const STORAGE_KEY = 'vocab_test_progress';

let vocabulary = [];

async function loadVocabulary() {
    let data = null;

    // 本地 file:// 协议下 fetch 会被浏览器拦截，请用本地服务器预览
    if (window.location.protocol !== 'file:') {
        try {
            const response = await fetch('./vocabulary.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            data = await response.json();
        } catch (err) {
            console.warn('加载 vocabulary.json 失败:', err);
        }
    } else {
        console.warn('检测到本地文件协议 (file://)。\n如需本地预览，请运行: python -m http.server 8000');
    }

    if (!data || !data.groups) {
        console.error('词库未能加载，页面将无法显示单词。');
        data = { groups: {} };
    }

    vocabulary = [];
    let idx = 0;
    Object.keys(data.groups).forEach(date => {
        data.groups[date].forEach(word => {
            // 添加第一个单词 (word.a)
            vocabulary.push({
                _idx: idx,
                id: word.id,
                word: word.a,
                synonym: word.b,
                chinese: word.ch,
                example: word.ex,
                example_cn: word.cn,
                date: date,
                synonymIndices: []
            });
            idx++;
            
            // 添加第二个单词 (word.b) - 作为独立的单词条目
            vocabulary.push({
                _idx: idx,
                id: word.id,  // 共享同一个 id，用于分组
                word: word.b,
                synonym: word.a,
                chinese: word.ch,
                example: word.ex,
                example_cn: word.cn,
                date: date,
                synonymIndices: []
            });
            idx++;
        });
    });
}

function initApp() {
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    let currentWordIndex = null, currentWord = null, currentOptions = [], correctIndex = null;
    let hasMistake = false, isAnswering = true, isViewingHistory = false, savedCurrentState = null;
    let masteredIndices = [], unmasteredIndices = [], wrongWords = {}, hardWords = new Set();
    let wrongQueue = [], reviewQueue = [], slashedWords = new Set();
    let questionCounter = 0, isReviewQuestion = false, history = [];
    let testMode = 0, testDirection = 0, darkMode = false, selectedDate = '0509', autoSpeak = false;
    let fontSizes = { large: 26, medium: 15, small: 12 };
    let totalAttempts = 0, correctAttempts = 0, startTime = Date.now(), totalWords = 0;
    let nextTimeout = null, isBrowseMode = false;

    let isSpeedMode = false;
    let savedNormalState = null;
    let speedList = [];
    let speedIndex = 0;
    let speedCorrect = 0;
    let speedAttempts = 0;
    let speedMistakes = [];

    function init() {
        loadProgress();
        applyFontSizes();
        updateDirectionUI();
        document.getElementById('dateSelect').value = selectedDate;
        document.getElementById('modeSelect').value = testMode;
        document.getElementById('directionSelect').value = testDirection;
        if (darkMode) {
            document.body.classList.add('dark');
            document.getElementById('btnNightMode').textContent = '☀️';
        }
        updateTime();
        setInterval(updateTime, 60000);
        bindEvents();
        resetAndStart(true);
    }

    function applyFontSizes() {
        document.documentElement.style.setProperty('--font-large', fontSizes.large + 'px');
        document.documentElement.style.setProperty('--font-medium', fontSizes.medium + 'px');
        document.documentElement.style.setProperty('--font-small', fontSizes.small + 'px');
    }

    function updateDirectionUI() {
        const hint = document.getElementById('stageHint');
        if (testDirection === 0) {
            hint.textContent = '请选择中文解释:';
        } else if (testDirection === 1) {
            hint.textContent = '请选择英文单词:';
        } else if (testDirection === 2) {
            hint.textContent = '请选择正确的单词填空:';
        } else if (testDirection === 3) {
            hint.textContent = '🔊 听音拼写';
        }
    }

    function getDateMapping(dateStr) {
        const mapping = {
            '0509': '2026-05-09',
            '0516': '2026-05-16',
            '0523': '2026-05-23',
            '0530': '2026-05-30',
            '0606': '2026-06-06',
            '0620': '2026-06-20'
        };
        return mapping[dateStr] || dateStr;
    }

    function getAvailableWords() {
        let pool = vocabulary;
        if (selectedDate === 'custom') {
            pool = vocabulary.filter(v => v.id < 0);
        } else if (selectedDate !== 'all') {
            const targetDate = getDateMapping(selectedDate);
            pool = vocabulary.filter(v => v.date === targetDate);
        }
        if (testMode === 0) return pool.map(v => v._idx);
        if (testMode === 1) return pool.slice(0, Math.ceil(pool.length / 2)).map(v => v._idx);
        if (testMode === 2) return pool.slice(Math.ceil(pool.length / 2)).map(v => v._idx);
        if (testMode === 3) {
            const keys = Object.keys(wrongWords).map(Number);
            return keys.filter(k => pool.some(v => v._idx === k));
        }
        if (testMode === 4) return [...hardWords].filter(k => pool.some(v => v._idx === k));
        return pool.map(v => v._idx);
    }

    function getRandomOptions(correctAnswer, optionType) {
        const avail = getAvailableWords();
        const set = new Set();
        avail.forEach(idx => {
            const v = vocabulary[idx];
            set.add(optionType === 'chinese' ? v.chinese : v.word);
        });
        set.delete(correctAnswer);
        if (optionType === 'english' && currentWordIndex !== null) {
            // 删除当前单词的同义词，避免在选项中出现
            const currentWord = vocabulary[currentWordIndex];
            if (currentWord.synonym) {
                set.delete(currentWord.synonym);
            }
            // 也删除通过同义词关系关联的单词
            (currentWord.synonymIndices || []).forEach(si => set.delete(vocabulary[si].word));
        }
        const wrongs = [...set].sort(() => Math.random() - 0.5).slice(0, 3);
        while (wrongs.length < 3) wrongs.push('(其他选项)');
        return [...wrongs, correctAnswer].sort(() => Math.random() - 0.5);
    }

    function startSpeedMode() {
        const avail = getAvailableWords();
        if (avail.length === 0) {
            showToast('当前范围内没有单词，无法速通');
            return;
        }
        savedNormalState = {
            unmasteredIndices: [...unmasteredIndices],
            wrongQueue: wrongQueue.map(item => ({ ...item })),
            reviewQueue: reviewQueue.map(item => ({ ...item })),
            questionCounter: questionCounter,
            history: [...history],
            currentWordIndex: currentWordIndex,
            currentWord: currentWord,
            currentOptions: currentOptions ? [...currentOptions] : [],
            correctIndex: correctIndex,
            isAnswering: isAnswering,
            hasMistake: hasMistake,
            isViewingHistory: isViewingHistory,
            savedCurrentState: savedCurrentState ? { ...savedCurrentState } : null
        };
        isSpeedMode = true;
        speedList = [...avail].sort(() => Math.random() - 0.5);
        speedIndex = 0;
        speedCorrect = 0;
        speedAttempts = 0;
        speedMistakes = [];

        document.getElementById('topActions').style.display = 'none';
        document.getElementById('btnHardWord').style.display = 'none';
        document.getElementById('btnSlashWord').style.display = 'none';
        document.getElementById('modeSelect').disabled = true;
        document.getElementById('directionSelect').disabled = true;
        document.getElementById('btnSpeedMode').disabled = true;
        document.getElementById('btnBrowse').disabled = true;
        document.getElementById('btnWrongBook').disabled = true;
        document.getElementById('navBtns').style.display = 'none';
        document.getElementById('titleLabel').textContent = '⚡ 速通模式';
        document.getElementById('shortcutHint').textContent = '速通中：1-4 选答案，答完自动下一题，全部完成后显示统计';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('btnSpeedMode').style.display = 'none';
        document.getElementById('btnExitSpeed').style.display = '';
        showSpeedQuestion();
    }

    function showSpeedQuestion() {
        if (speedIndex >= speedList.length) {
            finishSpeedMode();
            return;
        }
        const idx = speedList[speedIndex];
        currentWordIndex = idx;
        currentWord = vocabulary[idx];
        isAnswering = true;
        hasMistake = false;
        document.getElementById('exampleCnDisplay').textContent = '';

        if (testDirection === 0) {
            document.getElementById('wordDisplay').textContent = currentWord.word;
            // 英文选中文模式：如果例句不包含当前单词但包含同义词，替换成当前单词显示
            let displayExample = currentWord.example;
            if (currentWord.synonym && displayExample && !displayExample.includes(currentWord.word) && displayExample.includes(currentWord.synonym)) {
                displayExample = displayExample.replace(currentWord.synonym, currentWord.word);
            }
            document.getElementById('exampleDisplay').textContent = displayExample;
            currentOptions = getRandomOptions(currentWord.chinese, 'chinese');
            correctIndex = currentOptions.indexOf(currentWord.chinese);
        } else if (testDirection === 1) {
            document.getElementById('wordDisplay').textContent = currentWord.chinese;
            document.getElementById('exampleDisplay').textContent = '';
            currentOptions = getRandomOptions(currentWord.word, 'english');
            correctIndex = currentOptions.indexOf(currentWord.word);
        } else if (testDirection === 3) {
            // 听音拼写模式
            document.getElementById('wordDisplay').textContent = '🔊 请听发音，输入英文单词';
            document.getElementById('exampleDisplay').textContent = '';
            document.getElementById('exampleCnDisplay').textContent = '';
            document.getElementById('optionsGrid').style.display = 'none';
            document.getElementById('inputModeContainer').style.display = 'flex';
            document.getElementById('inputModeContainer').style.flexDirection = 'column';
            document.getElementById('inputModeContainer').style.alignItems = 'center';
            document.getElementById('answerInput').value = '';
            document.getElementById('answerInput').placeholder = '输入英文单词...';
            document.getElementById('inputFeedback').textContent = '';
            document.getElementById('answerInput').disabled = false;
            document.getElementById('btnSubmitAnswer').disabled = false;
            document.getElementById('answerInput').focus();
            // 自动播放发音
            setTimeout(() => speak(currentWord.word), 500);
        } else {
            // 句子填空模式：把单词或同义词替换成 ____
            let example = currentWord.example || '';
            const word = currentWord.word;
            const synonym = currentWord.synonym;
            const replacements = [];
            if (synonym && example.includes(synonym)) {
                replacements.push({ word: synonym, len: synonym.length });
            }
            if (example.includes(word)) {
                replacements.push({ word: word, len: word.length });
            }
            replacements.sort((a, b) => b.len - a.len);
            replacements.forEach(r => {
                example = example.replaceAll(r.word, '____');
            });
            document.getElementById('wordDisplay').textContent = example;
            document.getElementById('exampleDisplay').textContent = '';
            currentOptions = getRandomOptions(currentWord.word, 'english');
            correctIndex = currentOptions.indexOf(currentWord.word);
        }
        if (testDirection !== 3) {
            document.getElementById('optionsGrid').style.display = 'grid';
            document.getElementById('inputModeContainer').style.display = 'none';
            $$('.option-btn').forEach((b, i) => { b.textContent = currentOptions[i] || '-'; b.className = 'option-btn'; b.disabled = false; });
        }
        if (autoSpeak && testDirection === 0) speak(currentWord.word);
        const progress = (speedIndex / speedList.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('scoreLabel').textContent = `进度: ${speedIndex + 1}/${speedList.length}`;
        document.getElementById('remainingLabel').textContent = `正确: ${speedCorrect}`;
        document.getElementById('accuracyLabel').textContent = `正确率: ${speedAttempts ? Math.round(speedCorrect / speedAttempts * 100) : 0}%`;
    }

    function speedSelectOption(i) {
        if (!isSpeedMode || !isAnswering) return;
        if (testDirection === 3) {
            speedSubmitInput();
            return;
        }
        const btn = $$('.option-btn')[i];
        if (!btn || btn.disabled) return;
        isAnswering = false;
        speedAttempts++;
        if (i === correctIndex) {
            btn.classList.add('correct');
            speedCorrect++;
            if (autoSpeak && (testDirection === 1 || testDirection === 2) && currentWord) speak(currentWord.word);
            if (testDirection !== 1) {
                if (testDirection === 2) {
                    document.getElementById('exampleCnDisplay').innerHTML = highlightChineseMeaning(currentWord.example_cn, currentWord.chinese);
                } else {
                    document.getElementById('exampleCnDisplay').textContent = currentWord.example_cn;
                }
            }
        } else {
            btn.classList.add('wrong');
            speedMistakes.push(currentWordIndex);
            $$('.option-btn')[correctIndex].classList.add('correct');
            if (testDirection !== 1) {
                if (testDirection === 2) {
                    document.getElementById('exampleCnDisplay').innerHTML = highlightChineseMeaning(currentWord.example_cn, currentWord.chinese);
                } else {
                    document.getElementById('exampleCnDisplay').textContent = currentWord.example_cn;
                }
            }
        }
        $$('.option-btn').forEach(b => b.disabled = true);
        document.getElementById('remainingLabel').textContent = `正确: ${speedCorrect}`;
        document.getElementById('accuracyLabel').textContent = `正确率: ${Math.round(speedCorrect / speedAttempts * 100)}%`;
        speedIndex++;
        nextTimeout = setTimeout(showSpeedQuestion, 800);
    }

    function speedSubmitInput() {
        if (!isSpeedMode || !isAnswering) return;
        if (!currentWord) return;
        
        const input = document.getElementById('answerInput');
        const feedback = document.getElementById('inputFeedback');
        const userAnswer = input.value.trim();
        
        if (!userAnswer) {
            feedback.textContent = '请输入答案';
            feedback.style.color = 'var(--remaining-fg)';
            return;
        }
        
        isAnswering = false;
        speedAttempts++;
        
        if (userAnswer.toLowerCase() === currentWord.word.toLowerCase()) {
            feedback.textContent = `✓ 正确！${currentWord.word} - ${currentWord.chinese}`;
            feedback.style.color = 'var(--progress-fill)';
            speedCorrect++;
            document.getElementById('exampleCnDisplay').textContent = currentWord.example_cn || '';
        } else {
            feedback.textContent = `✗ 错误！正确答案: ${currentWord.word}`;
            feedback.style.color = 'var(--remaining-fg)';
            speedMistakes.push(currentWordIndex);
        }
        
        document.getElementById('remainingLabel').textContent = `正确: ${speedCorrect}`;
        document.getElementById('accuracyLabel').textContent = `正确率: ${Math.round(speedCorrect / speedAttempts * 100)}%`;
        speedIndex++;
        nextTimeout = setTimeout(showSpeedQuestion, 1000);
    }

    function finishSpeedMode() {
        const total = speedList.length;
        const accuracy = total ? Math.round(speedCorrect / total * 100) : 0;
        const hasMistakes = speedMistakes.length > 0;

        showModal('速通完成', `
            <p style="text-align:center; font-size:1.2em; margin-bottom:10px;">🎉 速通挑战结束！</p>
            <p style="text-align:center;">共完成 ${total} 个单词</p>
            <p style="text-align:center;">正确 <span style="color:var(--progress-fill); font-weight:bold;">${speedCorrect}</span> 个，错误 <span style="color:var(--remaining-fg); font-weight:bold;">${speedMistakes.length}</span> 个</p>
            <p style="text-align:center; margin-bottom:20px;">正确率 ${accuracy}%</p>
            <div style="display:flex; gap:10px; justify-content:center;">
                <button class="close-btn" id="modalCloseBtn" style="margin:0;">确定</button>
                ${hasMistakes ? `<button id="btnReviewSpeedMistakes" style="background:var(--speed-accent); color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">🎯 重练错题 (${speedMistakes.length})</button>` : ''}
            </div>
        `);

        if (hasMistakes) {
            document.getElementById('btnReviewSpeedMistakes').onclick = () => {
                closeModal();
                startReviewingMistakes(speedMistakes);
            };
        }
        exitSpeedMode();
    }

    function startReviewingMistakes(mistakeIndices) {
        testMode = 3;
        document.getElementById('modeSelect').value = "3";

        unmasteredIndices = [];
        reviewQueue = [];
        slashedWords.clear();

        wrongQueue = mistakeIndices.map(idx => ({
            idx: idx,
            cnt: (wrongWords[String(idx)] || 0) + 1,
            next: questionCounter
        }));

        mistakeIndices.forEach(idx => {
            const s = String(idx);
            wrongWords[s] = (wrongWords[s] || 0) + 1;
        });

        showToast(`已加载 ${mistakeIndices.length} 个错题`);
        nextQuestion();
    }

    function exitSpeedMode() {
        isSpeedMode = false;
        speedList = [];
        speedIndex = 0;

        document.getElementById('topActions').style.display = '';
        document.getElementById('btnHardWord').style.display = '';
        document.getElementById('btnSlashWord').style.display = '';
        document.getElementById('modeSelect').disabled = false;
        document.getElementById('directionSelect').disabled = false;
        document.getElementById('btnSpeedMode').disabled = false;
        document.getElementById('btnBrowse').disabled = false;
        document.getElementById('btnWrongBook').disabled = false;
        document.getElementById('navBtns').style.display = '';
        document.getElementById('titleLabel').textContent = '📝 单词测试';
        document.getElementById('shortcutHint').textContent = '快捷键: 1-4选答案 | Enter/空格 下一题 | ←上一题 | →返回 | A收藏 | S斩';
        document.getElementById('btnSpeedMode').style.display = '';
        document.getElementById('btnExitSpeed').style.display = 'none';
        
        // 更新方向提示
        updateDirectionUI();
        
        // 根据当前模式恢复界面显示
        if (testDirection === 3) {
            document.getElementById('optionsGrid').style.display = 'none';
            document.getElementById('inputModeContainer').style.display = 'flex';
            document.getElementById('inputModeContainer').style.flexDirection = 'column';
            document.getElementById('inputModeContainer').style.alignItems = 'center';
            document.getElementById('wordDisplay').textContent = '🔊 请听发音，输入英文单词';
            document.getElementById('answerInput').value = '';
            document.getElementById('answerInput').placeholder = '输入英文单词...';
            document.getElementById('inputFeedback').textContent = '';
            document.getElementById('exampleCnDisplay').textContent = '';
        } else {
            document.getElementById('optionsGrid').style.display = 'grid';
            document.getElementById('inputModeContainer').style.display = 'none';
        }

        if (savedNormalState) {
            unmasteredIndices = savedNormalState.unmasteredIndices;
            wrongQueue = savedNormalState.wrongQueue;
            reviewQueue = savedNormalState.reviewQueue;
            questionCounter = savedNormalState.questionCounter;
            history = savedNormalState.history;
            currentWordIndex = savedNormalState.currentWordIndex;
            currentWord = savedNormalState.currentWord;
            currentOptions = savedNormalState.currentOptions;
            correctIndex = savedNormalState.correctIndex;
            isAnswering = savedNormalState.isAnswering;
            hasMistake = savedNormalState.hasMistake;
            isViewingHistory = savedNormalState.isViewingHistory;
            savedCurrentState = savedNormalState.savedCurrentState;
            savedNormalState = null;

            if (currentWord) {
                if (testDirection === 0) {
                    document.getElementById('wordDisplay').textContent = currentWord.word;
                    let example = currentWord.example || '';
                    const word = currentWord.word;
                    const synonym = currentWord.synonym;
                    if (synonym && example.includes(synonym) && !example.includes(word)) {
                        example = example.replace(synonym, word);
                    }
                    document.getElementById('exampleDisplay').textContent = example;
                } else if (testDirection === 1) {
                    document.getElementById('wordDisplay').textContent = currentWord.chinese;
                    document.getElementById('exampleDisplay').textContent = '';
                } else {
                    // 句子填空模式：把单词或同义词替换成 ____
                    let example = currentWord.example || '';
                    const word = currentWord.word;
                    const synonym = currentWord.synonym;
                    
                    // 按长度排序，先替换较长的词，避免部分匹配
                    const replacements = [];
                    if (synonym && example.includes(synonym)) {
                        replacements.push({ word: synonym, len: synonym.length });
                    }
                    if (example.includes(word)) {
                        replacements.push({ word: word, len: word.length });
                    }
                    
                    replacements.sort((a, b) => b.len - a.len);
                    replacements.forEach(r => {
                        example = example.replaceAll(r.word, '____');
                    });
                    
                    document.getElementById('wordDisplay').textContent = example;
                    document.getElementById('exampleDisplay').textContent = '';
                }
                document.getElementById('exampleCnDisplay').textContent =
                    (testDirection !== 1 && isAnswering === false) ? currentWord.example_cn : '';
                $$('.option-btn').forEach((b, i) => {
                    b.textContent = currentOptions[i] || '-';
                    b.className = 'option-btn';
                    b.disabled = !isAnswering;
                });
                document.getElementById('stageHint').textContent =
                    testDirection === 0 ? '请选择中文解释:' : (testDirection === 1 ? '请选择英文单词:' : '请选择正确的单词填空:');
            } else {
                resetAndStart();
            }
        } else {
            resetAndStart();
        }
        updateScoreAndProgress();
    }

    function nextQuestion() {
        if (nextTimeout) { clearTimeout(nextTimeout); nextTimeout = null; }
        document.getElementById('exampleDisplay').textContent = '';
        document.getElementById('exampleCnDisplay').textContent = '';
        const avail = getAvailableWords();
        if (!avail.length) { 
            showModalConfirm('⚠️ 没有可用单词', '当前选择的范围没有单词，请选择其他日期范围。', () => { closeModal(); }, '确定');
            return; 
        }
        if (!unmasteredIndices.length && !wrongQueue.length && !reviewQueue.length) {
            showModalConfirm('🎉 全部掌握！', '当前范围单词已全部掌握，重新开始。', () => { closeModal(); resetAndStart(); }, '重新开始');
            return;
        }
        if (currentWord && !isViewingHistory) {
            // 保存历史记录时，如果是句子填空模式，保存替换后的句子
            // 如果是英选中模式，把同义词替换成当前单词
            let displayExample = currentWord.example || '';
            if (testDirection === 2) {
                const word = currentWord.word;
                const synonym = currentWord.synonym;
                const replacements = [];
                if (synonym && displayExample.includes(synonym)) {
                    replacements.push({ word: synonym, len: synonym.length });
                }
                if (displayExample.includes(word)) {
                    replacements.push({ word: word, len: word.length });
                }
                replacements.sort((a, b) => b.len - a.len);
                replacements.forEach(r => {
                    displayExample = displayExample.replaceAll(r.word, '____');
                });
            } else if (testDirection === 0) {
                // 英选中模式：把同义词替换成当前单词
                const word = currentWord.word;
                const synonym = currentWord.synonym;
                if (synonym && displayExample.includes(synonym) && !displayExample.includes(word)) {
                    displayExample = displayExample.replace(synonym, word);
                }
            }
                
            history.push({
                idx: currentWordIndex, word: currentWord.word, chinese: currentWord.chinese,
                example: displayExample, blank: testDirection === 2 ? displayExample : null,
                example_cn: currentWord.example_cn, dir: testDirection,
                opts: [...currentOptions], correct: correctIndex,
                hard: currentWordIndex !== null && hardWords.has(currentWordIndex)
            });
            document.getElementById('btnPrev').disabled = false;
        }
        questionCounter++;
        let nextIdx = null; isReviewQuestion = false;
        for (let i = wrongQueue.length - 1; i >= 0; i--) {
            if (questionCounter >= wrongQueue[i].next && !slashedWords.has(wrongQueue[i].idx) && avail.includes(wrongQueue[i].idx)) {
                nextIdx = wrongQueue[i].idx; wrongQueue.splice(i, 1); break;
            }
        }
        if (nextIdx === null) {
            for (let i = reviewQueue.length - 1; i >= 0; i--) {
                if (questionCounter >= reviewQueue[i].next && !slashedWords.has(reviewQueue[i].idx) && avail.includes(reviewQueue[i].idx)) {
                    nextIdx = reviewQueue[i].idx; reviewQueue.splice(i, 1); isReviewQuestion = true; break;
                }
            }
        }
        if (nextIdx === null) {
            const fresh = unmasteredIndices.filter(i => !slashedWords.has(i) && avail.includes(i));
            if (fresh.length) {
                nextIdx = fresh[Math.floor(Math.random() * fresh.length)];
                unmasteredIndices = unmasteredIndices.filter(i => i !== nextIdx);
            }
        }
        if (nextIdx === null) {
            const allq = [
                ...wrongQueue.map(i => ({ idx: i.idx, next: i.next, t: 'w' })),
                ...reviewQueue.map(i => ({ idx: i.idx, next: i.next, t: 'r' }))
            ].filter(i => !slashedWords.has(i.idx) && avail.includes(i.idx));
            if (allq.length) {
                allq.sort((a, b) => a.next - b.next);
                nextIdx = allq[0].idx;
                if (allq[0].t === 'w') wrongQueue = wrongQueue.filter(i => i.idx !== nextIdx);
                else { reviewQueue = reviewQueue.filter(i => i.idx !== nextIdx); isReviewQuestion = true; }
            } else {
                slashedWords.clear();
                showToast('所有单词都被斩掉了，已恢复');
                nextQuestion();
                return;
            }
        }
        currentWordIndex = nextIdx;
        currentWord = vocabulary[nextIdx];
        hasMistake = false; isAnswering = true; isViewingHistory = false;
        document.getElementById('btnReturn').disabled = true;
        document.getElementById('btnHardWord').textContent = hardWords.has(nextIdx) ? '★' : '⭐';
        if (testDirection === 0) {
            document.getElementById('wordDisplay').textContent = currentWord.word;
            // 英文选中文模式：如果例句不包含当前单词但包含同义词，替换成当前单词显示
            let displayExample = currentWord.example;
            if (currentWord.synonym && displayExample && !displayExample.includes(currentWord.word) && displayExample.includes(currentWord.synonym)) {
                displayExample = displayExample.replace(currentWord.synonym, currentWord.word);
            }
            document.getElementById('exampleDisplay').textContent = displayExample;
            currentOptions = getRandomOptions(currentWord.chinese, 'chinese');
            correctIndex = currentOptions.indexOf(currentWord.chinese);
        } else if (testDirection === 1) {
            document.getElementById('wordDisplay').textContent = currentWord.chinese;
            document.getElementById('exampleDisplay').textContent = '';
            currentOptions = getRandomOptions(currentWord.word, 'english');
            correctIndex = currentOptions.indexOf(currentWord.word);
        } else if (testDirection === 3) {
            // 听音拼写模式
            document.getElementById('wordDisplay').textContent = '🔊 请听发音，输入英文单词';
            document.getElementById('exampleDisplay').textContent = '';
            document.getElementById('exampleCnDisplay').textContent = '';
            document.getElementById('optionsGrid').style.display = 'none';
            document.getElementById('inputModeContainer').style.display = 'flex';
            document.getElementById('inputModeContainer').style.flexDirection = 'column';
            document.getElementById('inputModeContainer').style.alignItems = 'center';
            document.getElementById('answerInput').value = '';
            document.getElementById('answerInput').placeholder = '输入英文单词...';
            document.getElementById('inputFeedback').textContent = '';
            document.getElementById('answerInput').disabled = false;
            document.getElementById('btnSubmitAnswer').disabled = false;
            document.getElementById('answerInput').focus();
            // 自动播放发音
            setTimeout(() => speak(currentWord.word), 500);
        } else {
            // 句子填空模式：把单词或同义词替换成 ____
            let example = currentWord.example || '';
            const word = currentWord.word;
            const synonym = currentWord.synonym;
            
            // 按长度排序，先替换较长的词，避免部分匹配（如 dominant 在 predominant 中）
            const replacements = [];
            if (synonym && example.includes(synonym)) {
                replacements.push({ word: synonym, len: synonym.length });
            }
            if (example.includes(word)) {
                replacements.push({ word: word, len: word.length });
            }
            
            replacements.sort((a, b) => b.len - a.len);
            
            replacements.forEach(r => {
                example = example.replaceAll(r.word, '____');
            });
            document.getElementById('wordDisplay').textContent = example;
            document.getElementById('exampleDisplay').textContent = '';
            currentOptions = getRandomOptions(word, 'english');
            correctIndex = currentOptions.indexOf(word);
        }
        if (testDirection !== 3) {
            document.getElementById('optionsGrid').style.display = 'grid';
            document.getElementById('inputModeContainer').style.display = 'none';
            $$('.option-btn').forEach((b, i) => { b.textContent = currentOptions[i] || '-'; b.className = 'option-btn'; b.disabled = false; });
        }
        if (autoSpeak && testDirection === 0) speak(currentWord.word);
        updateScoreAndProgress();
        saveProgress();
    }

    function submitInputAnswer() {
        if (!isAnswering || isViewingHistory || isBrowseMode) return;
        if (isSpeedMode && testDirection === 3) {
            speedSubmitInput();
            return;
        }
        if (!currentWord) return;
        
        const input = document.getElementById('answerInput');
        const feedback = document.getElementById('inputFeedback');
        const userAnswer = input.value.trim();
        
        if (!userAnswer) {
            feedback.textContent = '请输入答案';
            feedback.style.color = 'var(--remaining-fg)';
            return;
        }
        
        totalAttempts++;
        
        if (testDirection === 3) {
            // 听音拼写模式：英文必须完全匹配（不区分大小写）
            if (userAnswer.toLowerCase() === currentWord.word.toLowerCase()) {
                feedback.textContent = `✓ 正确！${currentWord.word} - ${currentWord.chinese}`;
                feedback.style.color = 'var(--progress-fill)';
                // 答对后不重复播放发音
                
                isAnswering = false;
                
                if (!hasMistake) {
                    correctAttempts++;
                    if (isReviewQuestion) masteredIndices.push(currentWordIndex);
                    else reviewQueue.push({ idx: currentWordIndex, next: questionCounter + 15 });
                }
                
                document.getElementById('exampleCnDisplay').textContent = currentWord.example_cn || '';
                updateScoreAndProgress();
                saveProgress();
                nextTimeout = setTimeout(nextQuestion, 1000);
            } else {
                feedback.textContent = `✗ 错误！正确答案: ${currentWord.word}`;
                feedback.style.color = 'var(--remaining-fg)';
                hasMistake = true;
                
                // 答错后记录错误，但不进入下一题
                const s = String(currentWordIndex);
                wrongWords[s] = (wrongWords[s] || 0) + 1;
                const cnt = wrongWords[s];
                let interval = 20; 
                if (cnt === 1) interval = 5; 
                else if (cnt === 2) interval = 10;
                
                const exist = wrongQueue.findIndex(x => x.idx === currentWordIndex);
                if (exist >= 0) wrongQueue[exist] = { idx: currentWordIndex, cnt, next: questionCounter + interval };
                else wrongQueue.push({ idx: currentWordIndex, cnt, next: questionCounter + interval });
                
                // 清空输入框，让用户继续尝试
                input.value = '';
                updateScoreAndProgress();
                saveProgress();
                
                // 重新聚焦输入框
                input.focus();
            }
        }
    }

    function selectOption(i) {
        if (isSpeedMode) { speedSelectOption(i); return; }
        if (!isAnswering || isViewingHistory || isBrowseMode) return;
        const btn = $$('.option-btn')[i];
        if (!btn || btn.disabled) return;
        if (i === correctIndex) {
            btn.classList.add('correct'); isAnswering = false;
            $$('.option-btn').forEach(b => b.disabled = true);
            totalAttempts++;
            if (autoSpeak && (testDirection === 1 || testDirection === 2) && currentWord) speak(currentWord.word);
            if (testDirection !== 1 && currentWord) {
                if (testDirection === 0 || testDirection === 2) {
                    document.getElementById('exampleCnDisplay').innerHTML = highlightChineseMeaning(currentWord.example_cn, currentWord.chinese);
                } else {
                    document.getElementById('exampleCnDisplay').textContent = currentWord.example_cn;
                }
            }
            if (!hasMistake) {
                correctAttempts++;
                if (isReviewQuestion) masteredIndices.push(currentWordIndex);
                else reviewQueue.push({ idx: currentWordIndex, next: questionCounter + 15 });
            }
            updateScoreAndProgress(); saveProgress();
            nextTimeout = setTimeout(nextQuestion, 800);
        } else {
            btn.classList.add('wrong'); hasMistake = true; totalAttempts++;
            const s = String(currentWordIndex);
            wrongWords[s] = (wrongWords[s] || 0) + 1;
            const cnt = wrongWords[s];
            let interval = 20; if (cnt === 1) interval = 5; else if (cnt === 2) interval = 10;
            const exist = wrongQueue.findIndex(x => x.idx === currentWordIndex);
            if (exist >= 0) wrongQueue[exist] = { idx: currentWordIndex, cnt, next: questionCounter + interval };
            else wrongQueue.push({ idx: currentWordIndex, cnt, next: questionCounter + interval });
            updateScoreAndProgress(); saveProgress();
        }
    }

    function showPreviousQuestion() {
        if (isSpeedMode) return;
        if (!history.length || isViewingHistory || isBrowseMode) return;
        savedCurrentState = {
            wi: currentWordIndex, w: currentWord, opts: [...currentOptions], ci: correctIndex,
            hm: hasMistake, ia: isAnswering,
            bs: [...$$('.option-btn')].map(b => ({ t: b.textContent, d: b.disabled, c: b.className })),
            ecn: currentWord ? currentWord.example_cn : '',
            ecnd: document.getElementById('exampleCnDisplay').textContent || '',
            td: testDirection, irq: isReviewQuestion
        };
        isViewingHistory = true;
        const p = history[history.length - 1];
        document.getElementById('wordDisplay').textContent = p.dir === 0 ? p.word : (p.dir === 1 ? p.chinese : (p.blank || p.example));
        document.getElementById('exampleDisplay').textContent = p.dir === 0 ? p.example : '';
        if (p.dir === 0 || p.dir === 2) {
            document.getElementById('exampleCnDisplay').innerHTML = highlightChineseMeaning(p.example_cn || '', p.chinese || '');
        } else {
            document.getElementById('exampleCnDisplay').textContent = p.example_cn || '';
        }
        document.getElementById('stageHint').textContent = '上一题回顾：';
        document.getElementById('btnHardWord').textContent = p.hard ? '★' : '⭐';
        $$('.option-btn').forEach((b, i) => {
            b.textContent = p.opts[i] || '-'; b.className = 'option-btn'; b.disabled = true;
            if (i === p.correct) b.classList.add('correct');
        });
        document.getElementById('btnPrev').disabled = true;
        document.getElementById('btnReturn').disabled = false;
    }

    function returnToCurrentQuestion() {
        if (isSpeedMode) return;
        if (!isViewingHistory || !savedCurrentState) return;
        const s = savedCurrentState;
        currentWordIndex = s.wi; currentWord = s.w; currentOptions = s.opts; correctIndex = s.ci;
        hasMistake = s.hm; isAnswering = s.ia; testDirection = s.td; isReviewQuestion = s.irq;
        if (s.td === 0 && s.w) {
            document.getElementById('wordDisplay').textContent = s.w.word;
        } else if (s.td === 1 && s.w) {
            document.getElementById('wordDisplay').textContent = s.w.chinese;
        } else if (s.td === 2 && s.w) {
            let example = s.w.example || '';
            const word = s.w.word;
            const synonym = s.w.synonym;
            const replacements = [];
            if (synonym && example.includes(synonym)) {
                replacements.push({ word: synonym, len: synonym.length });
            }
            if (example.includes(word)) {
                replacements.push({ word: word, len: word.length });
            }
            replacements.sort((a, b) => b.len - a.len);
            replacements.forEach(r => {
                example = example.replaceAll(r.word, '____');
            });
            document.getElementById('wordDisplay').textContent = example;
        } else {
            document.getElementById('wordDisplay').textContent = '';
        }
        document.getElementById('exampleDisplay').textContent = s.td === 0 && s.w ? s.w.example : '';
        document.getElementById('exampleCnDisplay').textContent = s.ecnd || '';
        updateDirectionUI();
        document.getElementById('btnHardWord').textContent = currentWordIndex !== null && hardWords.has(currentWordIndex) ? '★' : '⭐';
        $$('.option-btn').forEach((b, i) => { b.textContent = s.bs[i].t; b.className = s.bs[i].c; b.disabled = s.bs[i].d; });
        isViewingHistory = false; savedCurrentState = null;
        document.getElementById('btnReturn').disabled = true;
        document.getElementById('btnPrev').disabled = history.length === 0;
    }

    function toggleHardWord() {
        if (currentWordIndex === null || isViewingHistory || isBrowseMode) return;
        if (hardWords.has(currentWordIndex)) { hardWords.delete(currentWordIndex); showToast('已取消难词标记'); }
        else { hardWords.add(currentWordIndex); showToast('已标记为难词'); }
        document.getElementById('btnHardWord').textContent = hardWords.has(currentWordIndex) ? '★' : '⭐';
        saveProgress();
    }

    function slashWord() {
        if (currentWordIndex === null || isViewingHistory || isBrowseMode) return;
        showModalConfirm('斩词确认', `确定要斩掉「${vocabulary[currentWordIndex].word}」吗？`, () => {
            closeModal();
            slashedWords.add(currentWordIndex);
            wrongQueue = wrongQueue.filter(i => i.idx !== currentWordIndex);
            reviewQueue = reviewQueue.filter(i => i.idx !== currentWordIndex);
            unmasteredIndices = unmasteredIndices.filter(i => i !== currentWordIndex);
            showToast('已斩掉！');
            nextQuestion();
        });
    }

    function showBrowseMode(searchTerm = '') {
        isBrowseMode = true;
        ['wordCard', 'optionsGrid', 'inputModeContainer', 'progressWrap', 'headerRow', 'bottomBar'].forEach(id => document.getElementById(id).style.display = 'none');
        document.getElementById('browseContainer').classList.add('active');
        const idxs = getAvailableWords();
        if (!idxs.length) { document.getElementById('browseList').innerHTML = '<p>无单词</p>'; return; }

        const filteredIdxs = idxs.filter(i => {
            const v = vocabulary[i];
            return v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.chinese.includes(searchTerm);
        });

        const groups = {};
        filteredIdxs.forEach(i => {
            const key = vocabulary[i].id;
            if (!groups[key]) groups[key] = [];
            groups[key].push(vocabulary[i]);
        });

        let html = '';
        Object.values(groups).forEach(arr => {
            html += `
                <div class="browse-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                        <div class="word-title" style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
                            ${arr.map(v => `
                                <span style="display:inline-flex; align-items:center; gap:4px;">
                                    ${v.word}
                                    <button class="btn-icon speak-btn" data-word="${v.word}" style="border:none; background:none; cursor:pointer; font-size:16px; padding:0 !important; min-height:auto; width:auto; height:auto;">🔊</button>
                                </span>
                            `).join('<span style="color:var(--example-fg); font-weight:normal;">=</span>')}
                        </div>
                    </div>
                    <div class="chinese-meaning">${arr[0].chinese}</div>
                    <div class="example-en">${arr[0].example}</div>
                    <div class="example-cn">${arr[0].example_cn}</div>
                </div>`;
        });
        const list = document.getElementById('browseList');
        list.innerHTML = html;
        list.querySelectorAll('.speak-btn').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); speak(btn.dataset.word); };
        });
        document.getElementById('browseTitle').textContent = `📖 单词浏览 (${Object.keys(groups).length}组)`;
    }

    function hideBrowseMode() {
        isBrowseMode = false;
        document.getElementById('browseContainer').classList.remove('active');
        ['wordCard', 'progressWrap', 'headerRow', 'bottomBar'].forEach(id => document.getElementById(id).style.display = '');
        
        // 根据当前模式设置正确的界面显示
        if (testDirection === 3) {
            document.getElementById('optionsGrid').style.display = 'none';
            document.getElementById('inputModeContainer').style.display = 'flex';
            document.getElementById('inputModeContainer').style.flexDirection = 'column';
            document.getElementById('inputModeContainer').style.alignItems = 'center';
        } else {
            document.getElementById('optionsGrid').style.display = 'grid';
            document.getElementById('inputModeContainer').style.display = 'none';
        }
    }

    function updateScoreAndProgress() {
        const avail = getAvailableWords();
        totalWords = avail.length;
        const masteredCount = masteredIndices.filter(i => avail.includes(i)).length;
        document.getElementById('scoreLabel').textContent = `得分: ${masteredCount}/${totalWords}`;
        const rem = unmasteredIndices.filter(i => avail.includes(i)).length + wrongQueue.filter(i => avail.includes(i.idx)).length + reviewQueue.filter(i => avail.includes(i.idx)).length;
        document.getElementById('remainingLabel').textContent = `剩余: ${rem}`;
        document.getElementById('progressFill').style.width = totalWords ? (masteredCount / totalWords * 100) + '%' : '0%';
        if (totalAttempts) document.getElementById('accuracyLabel').textContent = `正确率: ${Math.round(correctAttempts / totalAttempts * 100)}%`;
    }

    function resetAndStart(preserveMastered = false) {
        if (isSpeedMode) return;
        const av = getAvailableWords();
        totalWords = av.length;
        if (!preserveMastered) masteredIndices = [];
        unmasteredIndices = av.filter(i => !masteredIndices.includes(i));
        wrongQueue = []; reviewQueue = []; questionCounter = 0; history = [];
        document.getElementById('btnPrev').disabled = true;
        document.getElementById('btnReturn').disabled = true;
        currentWord = null; currentWordIndex = null;
        updateScoreAndProgress();
        nextQuestion();
    }

    function bindEvents() {
        $$('.option-btn').forEach((b, i) => b.addEventListener('click', () => selectOption(i)));
        document.addEventListener('keydown', e => {
            if (document.getElementById('modalOverlay').classList.contains('active')) return;
            
            // 检查是否在输入框中，如果是则跳过快捷键（除了Enter键用于提交）
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (activeElement.id === 'answerInput' || activeElement.id === 'browseSearch');
            if (isInputFocused && e.key !== 'Enter') return;
            
            if (isBrowseMode) { if (e.key === 'Escape') hideBrowseMode(); return; }
            if (isSpeedMode) {
                const k = e.key;
                if (k === '1') { e.preventDefault(); selectOption(0); }
                if (k === '2') { e.preventDefault(); selectOption(1); }
                if (k === '3') { e.preventDefault(); selectOption(2); }
                if (k === '4') { e.preventDefault(); selectOption(3); }
                if (k === 'Escape') { e.preventDefault(); exitSpeedMode(); return; }
                if ((k === 'v' || k === 'V') && currentWord) { e.preventDefault(); speak(currentWord.word); return; }
                return;
            }
            const k = e.key;
            if (k === '1' && !isViewingHistory && isAnswering) { e.preventDefault(); selectOption(0); }
            if (k === '2' && !isViewingHistory && isAnswering) { e.preventDefault(); selectOption(1); }
            if (k === '3' && !isViewingHistory && isAnswering) { e.preventDefault(); selectOption(2); }
            if (k === '4' && !isViewingHistory && isAnswering) { e.preventDefault(); selectOption(3); }
            if ((k === 'Enter' || k === ' ') && !isViewingHistory && !isAnswering && testDirection !== 3) { e.preventDefault(); if (nextTimeout) { clearTimeout(nextTimeout); nextTimeout = null; } nextQuestion(); }
            if (k === 'ArrowLeft') { e.preventDefault(); showPreviousQuestion(); }
            if (k === 'ArrowRight') { e.preventDefault(); returnToCurrentQuestion(); }
            if ((k === 'a' || k === 'A') && !isViewingHistory && currentWordIndex !== null) { e.preventDefault(); toggleHardWord(); }
            if ((k === 'v' || k === 'V') && currentWord) { e.preventDefault(); speak(currentWord.word); }
            if ((k === 's' || k === 'S') && !isViewingHistory && currentWordIndex !== null) { e.preventDefault(); slashWord(); }
        });
        document.getElementById('btnSpeedMode').addEventListener('click', startSpeedMode);
        document.getElementById('btnExitSpeed').addEventListener('click', exitSpeedMode);
        document.getElementById('btnNightMode').addEventListener('click', () => {
            darkMode = !darkMode; document.body.classList.toggle('dark', darkMode);
            document.getElementById('btnNightMode').textContent = darkMode ? '☀️' : '🌙'; saveProgress();
        });
        document.getElementById('btnFontMinus').addEventListener('click', () => {
            if (fontSizes.large > 16) { fontSizes.large -= 2; fontSizes.medium -= 1; fontSizes.small -= 1; applyFontSizes(); saveProgress(); }
        });
        document.getElementById('btnFontPlus').addEventListener('click', () => {
            fontSizes.large = Math.min(42, fontSizes.large + 2); fontSizes.medium = Math.min(26, fontSizes.medium + 1); fontSizes.small = Math.min(20, fontSizes.small + 1); applyFontSizes(); saveProgress();
        });
        document.getElementById('btnWrongBook').addEventListener('click', () => {
            let html = Object.entries(wrongWords).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
                const w = vocabulary[parseInt(k)];
                return w ? `<div>${w.word} - ${w.chinese} (${v}次)</div>` : '';
            }).join('') || '<p>无错题</p>';
            document.getElementById('modalDialog').innerHTML = `<h3>错题统计</h3>${html}<button id="modalCloseBtn" style="margin-top:12px">关闭</button>`;
            document.getElementById('modalOverlay').classList.add('active');
            document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
        });
        document.getElementById('btnHelp').addEventListener('click', () => {
            document.getElementById('modalDialog').innerHTML = `<h3>快捷键</h3><div style="line-height:2"><p>1-4: 选答案</p><p>Enter/空格: 下一题</p><p>←/→: 历史回顾</p><p>A: 难词 S: 斩词</p><p>V: 播放发音</p><p>📖 浏览: 点击按钮/Esc退出</p></div><button id="modalCloseBtn">关闭</button>`;
            document.getElementById('modalOverlay').classList.add('active');
            document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
        });
        document.getElementById('btnAutoSpeak').onclick = () => {
            autoSpeak = !autoSpeak;
            document.getElementById('btnAutoSpeak').textContent = autoSpeak ? '🔊 On' : '🔊 Off';
            document.getElementById('btnAutoSpeak').style.background = autoSpeak ? 'var(--accent)' : '';
            document.getElementById('btnAutoSpeak').style.color = autoSpeak ? '#fff' : '';
            saveProgress();
        };
        document.getElementById('btnSpeak').onclick = () => {
            if (isViewingHistory && history.length) {
                speak(history[history.length - 1].word);
            } else if (currentWord) {
                speak(currentWord.word);
            }
        };
        document.getElementById('btnExport').onclick = exportProgress;
        document.getElementById('btnImport').onclick = () => document.getElementById('importFile').click();
        document.getElementById('importFile').onchange = handleImport;
        document.getElementById('btnImportCsv').addEventListener('click', () => { document.getElementById('importCsvFile').click(); });
        document.getElementById('importCsvFile').onchange = handleCsvImport;
        document.getElementById('btnSubmitAnswer').addEventListener('click', submitInputAnswer);
        document.getElementById('answerInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitInputAnswer();
            }
        });
        document.getElementById('answerInput').addEventListener('input', () => {
            document.getElementById('inputFeedback').textContent = '';
        });
        document.getElementById('btnHardWord').addEventListener('click', toggleHardWord);
        document.getElementById('btnSlashWord').addEventListener('click', slashWord);
        document.getElementById('btnPrev').addEventListener('click', showPreviousQuestion);
        document.getElementById('btnReturn').addEventListener('click', returnToCurrentQuestion);
        document.getElementById('btnBrowse').addEventListener('click', () => showBrowseMode());
        document.getElementById('browseSearch').oninput = (e) => showBrowseMode(e.target.value);
        document.getElementById('btnBackToTest').addEventListener('click', hideBrowseMode);
        document.getElementById('dateSelect').addEventListener('change', function () { selectedDate = this.value; history = []; wrongQueue = []; reviewQueue = []; slashedWords.clear(); questionCounter = 0; resetAndStart(); });
        document.getElementById('modeSelect').addEventListener('change', function () { testMode = parseInt(this.value); history = []; wrongQueue = []; reviewQueue = []; slashedWords.clear(); questionCounter = 0; resetAndStart(); });
        document.getElementById('directionSelect').addEventListener('change', function () { testDirection = parseInt(this.value); updateDirectionUI(); history = []; wrongQueue = []; reviewQueue = []; slashedWords.clear(); questionCounter = 0; resetAndStart(); });
    }

    function showToast(msg) {
        const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
        document.getElementById('toastContainer').appendChild(t);
        setTimeout(() => t.remove(), 2400);
    }

    function showModalConfirm(title, msg, onOk) {
        document.getElementById('modalDialog').innerHTML = `
            <h3>${title}</h3><p style="text-align:center;white-space:pre-line">${msg}</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:16px">
                <button id="modalOk" style="background:var(--accent);color:#fff;border:none;padding:8px 20px;border-radius:6px;cursor:pointer">确定</button>
                <button id="modalCancel" style="background:var(--btn-bg);color:var(--btn-fg);border:1px solid var(--border);padding:8px 20px;border-radius:6px;cursor:pointer">取消</button>
            </div>`;
        document.getElementById('modalOverlay').classList.add('active');
        document.getElementById('modalOk').addEventListener('click', () => { closeModal(); onOk(); });
        document.getElementById('modalCancel').addEventListener('click', closeModal);
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
            else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('modalOk').click(); document.removeEventListener('keydown', escHandler); }
        });
    }

    function showModal(title, html) {
        document.getElementById('modalDialog').innerHTML = `
            <h3 style="text-align:center; margin-bottom:15px;">${title}</h3>
            <div>${html}</div>
        `;
        document.getElementById('modalOverlay').classList.add('active');
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) closeBtn.onclick = closeModal;

        document.getElementById('modalOverlay').onclick = (e) => {
            if (e.target === document.getElementById('modalOverlay')) closeModal();
        };

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }

    function speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const uttr = new SpeechSynthesisUtterance(text);
        uttr.lang = 'en-US';
        uttr.rate = 0.9;
        window.speechSynthesis.speak(uttr);
    }

    function highlightChineseMeaning(exampleCn, chinese) {
        if (!exampleCn || !chinese) return exampleCn || '';
        
        let pattern = chinese;
        if (chinese.includes('...')) {
            const parts = chinese.split('...');
            pattern = parts.filter(p => p.trim()).join('|');
        }
        
        let result = exampleCn;
        const regex = new RegExp(`(${pattern})`, 'g');
        
        if (regex.test(exampleCn)) {
            result = exampleCn.replace(regex, '<span style="color:var(--accent);font-weight:600;">$1</span>');
        } else {
            const chars = chinese.replace(/[...的了是在]/g, '');
            if (chars.length >= 2) {
                for (let len = Math.min(chars.length, 4); len >= 2; len--) {
                    for (let i = 0; i <= chars.length - len; i++) {
                        const keyPart = chars.substring(i, i + len);
                        const charRegex = new RegExp(`(${keyPart})`, 'g');
                        if (charRegex.test(exampleCn)) {
                            result = exampleCn.replace(charRegex, '<span style="color:var(--accent);font-weight:600;">$1</span>');
                            return result;
                        }
                    }
                }
            }
        }
        return result;
    }

    function exportProgress() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) { showToast('没有可导出的进度'); return; }
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vocab_progress_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        showToast('进度已导出');
    }

    function handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                showToast('导入成功，即将刷新');
                setTimeout(() => location.reload(), 1000);
            } catch (err) {
                showToast('导入失败，文件格式不正确');
            }
        };
        reader.readAsText(file);
    }
    
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }
    
    function parseCSV(text) {
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const wordIndex = headers.indexOf('word');
        const chineseIndex = headers.indexOf('chinese');
        const synonymIndex = headers.indexOf('synonym');
        const exampleIndex = headers.indexOf('example');
        const exampleCnIndex = headers.indexOf('example_cn');
        
        if (wordIndex === -1 || chineseIndex === -1) {
            showToast('CSV 文件必须包含 word 和 chinese 列');
            return [];
        }
        
        const words = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length > wordIndex && values.length > chineseIndex) {
                words.push({
                    a: values[wordIndex] || '',
                    ch: values[chineseIndex] || '',
                    b: synonymIndex !== -1 && values[synonymIndex] ? values[synonymIndex] : null,
                    ex: exampleIndex !== -1 && values[exampleIndex] ? values[exampleIndex] : null,
                    cn: exampleCnIndex !== -1 && values[exampleCnIndex] ? values[exampleCnIndex] : null
                });
            }
        }
        return words;
    }
    
    function handleCsvImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const customWords = parseCSV(event.target.result);
                if (customWords.length === 0) {
                    showToast('CSV 导入失败，请检查文件格式');
                    return;
                }
                
                customWords.forEach((w, i) => {
                    vocabulary.unshift({
                        id: -1 - i,
                        word: w.a,
                        chinese: w.ch,
                        synonym: w.b,
                        example: w.ex,
                        example_cn: w.cn,
                        a: w.a,
                        ch: w.ch,
                        b: w.b,
                        ex: w.ex,
                        cn: w.cn
                    });
                });
                
                showToast(`成功导入 ${customWords.length} 个自定义词汇`);
                
                vocabulary.forEach((v, i) => { v._idx = i; });
                saveProgress();
                
                // 刷新界面
                updateDirectionUI();
                
                // 重置界面显示状态
                if (testDirection === 3) {
                    document.getElementById('optionsGrid').style.display = 'none';
                    document.getElementById('inputModeContainer').style.display = 'flex';
                    document.getElementById('inputModeContainer').style.flexDirection = 'column';
                    document.getElementById('inputModeContainer').style.alignItems = 'center';
                } else {
                    document.getElementById('optionsGrid').style.display = 'grid';
                    document.getElementById('inputModeContainer').style.display = 'none';
                }
                
                resetAndStart();
            } catch (err) {
                showToast('CSV 解析失败：' + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    function updateTime() {
        document.getElementById('timeLabel').textContent = `学习时长: ${Math.floor((Date.now() - startTime) / 60000)}分钟`;
    }

    function saveProgress() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ masteredIndices, wrongWords, hardWords: [...hardWords], wrongQueue, reviewQueue, questionCounter, slashedWords: [...slashedWords], testMode, testDirection, darkMode, fontSizes, selectedDate, autoSpeak })); } catch (e) { }
    }

    function loadProgress() {
        try {
            const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (d) {
                masteredIndices = d.masteredIndices || []; wrongWords = d.wrongWords || {};
                hardWords = new Set(d.hardWords || []);
                wrongQueue = d.wrongQueue || [];
                reviewQueue = d.reviewQueue || [];
                questionCounter = d.questionCounter || 0;
                slashedWords = new Set(d.slashedWords || []);
                testMode = d.testMode ?? 0; testDirection = d.testDirection ?? 0;
                darkMode = d.darkMode ?? false; fontSizes = d.fontSizes || { large: 26, medium: 15, small: 12 };
                selectedDate = d.selectedDate || '0509';
                autoSpeak = d.autoSpeak ?? false;
                if (autoSpeak) {
                    document.getElementById('btnAutoSpeak').textContent = '🔊 On';
                    document.getElementById('btnAutoSpeak').style.background = 'var(--accent)';
                    document.getElementById('btnAutoSpeak').style.color = '#fff';
                }
            }
        } catch (e) { }
    }

    init();
}

loadVocabulary().then(() => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}).catch(() => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
});