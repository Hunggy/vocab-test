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
    let hideExamples = false;        // 隐藏例句开关（只看单词，不给上下文提示）
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
    let speedHistory = [];          // 速通已答题记录，供 ← 回看
    let speedPrevPos = -1;          // 当前回看的是 speedHistory 的第几题，-1 表示不在回看
    let speedPrevSavedState = null; // 进入回看前的现场快照
    let speedPendingNext = false;   // 进入回看时是否正等着自动跳下一题

    // 翻卡自测模式
    let isCardMode = false;
    let cardQueue = [];             // 待翻的单词 idx 队列
    let cardIndex = 0;
    let cardFlipped = false;
    let cardKnown = 0, cardForgot = 0, cardTotal = 0;
    let cardForgotList = [];
    let cardHistory = [];            // 已自评的卡 {idx, known}，供 ↑/← 回看
    let cardPrevPos = -1;            // -1 表示不在回看
    let cardSavedFlipped = false;    // 进入回看前当前卡的翻面状态

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
        updateHideExamplesBtn();
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

    function updateHideExamplesBtn() {
        const b = document.getElementById('btnHideExamples');
        b.textContent = hideExamples ? '🚫 例句' : '📄 例句';
        b.title = hideExamples ? '例句已隐藏，点击恢复显示' : '点击隐藏例句';
        b.style.background = hideExamples ? 'var(--accent)' : '';
        b.style.color = hideExamples ? '#fff' : '';
        // 只作用于答题卡片；浏览模式是专门查词的，例句保留
        document.getElementById('wordCard').classList.toggle('hide-examples', hideExamples);
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
        if (isCardMode) return;
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
        speedHistory = [];
        speedPrevPos = -1;
        speedPrevSavedState = null;
        speedPendingNext = false;

        document.getElementById('topActions').style.display = 'none';
        document.getElementById('btnHardWord').style.display = 'none';
        document.getElementById('btnSlashWord').style.display = 'none';
        document.getElementById('modeSelect').disabled = true;
        document.getElementById('directionSelect').disabled = true;
        document.getElementById('btnSpeedMode').disabled = true;
        document.getElementById('btnBrowse').disabled = false; // 速通中也能查单词
        document.getElementById('btnWrongBook').disabled = true;
        // 速通中保留上一题/返回按钮，方便回看刚答过的单词
        document.getElementById('navBtns').style.display = '';
        document.getElementById('btnPrev').disabled = true;
        document.getElementById('btnReturn').disabled = true;
        document.getElementById('titleLabel').textContent = '⚡ 速通模式';
        document.getElementById('shortcutHint').textContent = '速通中：1-4 选答案，答完自动下一题 | ← 看上一题 | → 返回 | 📖 可随时浏览单词';
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
        // 关键：必须清空 nextTimeout。否则它会一直留着上一次的 timer id，
        // 导致之后在未作答的题上按 ← 回看时，被误判成「正等着跳下一题」，
        // 返回后强行跳走、把当前正在做的题跳过。
        if (nextTimeout) { clearTimeout(nextTimeout); nextTimeout = null; }
        // 若上一刻还在回看，进入新题前必须清掉回看的界面痕迹，
        // 否则「回顾…」提示会被当成普通提示存进快照，之后会卡在回看态出不来
        if (speedPrevPos !== -1) {
            speedPrevPos = -1;
            updateDirectionUI();
            document.getElementById('btnReturn').disabled = true;
        }
        speedPrevSavedState = null;
        speedPendingNext = false;
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
        document.getElementById('btnPrev').disabled = speedHistory.length === 0;
        document.getElementById('btnReturn').disabled = true;
    }

    function speedSelectOption(i) {
        if (!isSpeedMode || !isAnswering || speedPrevPos !== -1) return;
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
        speedHistory.push({
            idx: currentWordIndex, dir: testDirection, opts: [...currentOptions],
            correct: correctIndex, chosen: i, ok: i === correctIndex, typed: null
        });
        document.getElementById('btnPrev').disabled = false;
        document.getElementById('remainingLabel').textContent = `正确: ${speedCorrect}`;
        document.getElementById('accuracyLabel').textContent = `正确率: ${Math.round(speedCorrect / speedAttempts * 100)}%`;
        speedIndex++;
        nextTimeout = setTimeout(showSpeedQuestion, 800);
    }

    function speedSubmitInput() {
        if (!isSpeedMode || !isAnswering || speedPrevPos !== -1) return;
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
        
        speedHistory.push({
            idx: currentWordIndex, dir: testDirection, opts: [], correct: -1,
            chosen: -1, ok: userAnswer.toLowerCase() === currentWord.word.toLowerCase(), typed: userAnswer
        });
        document.getElementById('btnPrev').disabled = false;
        document.getElementById('remainingLabel').textContent = `正确: ${speedCorrect}`;
        document.getElementById('accuracyLabel').textContent = `正确率: ${Math.round(speedCorrect / speedAttempts * 100)}%`;
        speedIndex++;
        nextTimeout = setTimeout(showSpeedQuestion, 1000);
    }

    // ========== 速通模式：回看上一题 ==========
    function captureSpeedScene() {
        const inp = document.getElementById('answerInput');
        const fb = document.getElementById('inputFeedback');
        return {
            word: document.getElementById('wordDisplay').textContent,
            example: document.getElementById('exampleDisplay').textContent,
            exampleCn: document.getElementById('exampleCnDisplay').innerHTML,
            stageHint: document.getElementById('stageHint').textContent,
            bs: [...$$('.option-btn')].map(b => ({ t: b.textContent, d: b.disabled, c: b.className })),
            gridDisplay: document.getElementById('optionsGrid').style.display,
            inputDisplay: document.getElementById('inputModeContainer').style.display,
            inputValue: inp.value,
            inputDisabled: inp.disabled,
            submitDisabled: document.getElementById('btnSubmitAnswer').disabled,
            feedback: fb.textContent,
            feedbackColor: fb.style.color,
            ia: isAnswering
        };
    }

    function renderSpeedPrev() {
        const rec = speedHistory[speedPrevPos];
        if (!rec) return;
        const w = vocabulary[rec.idx];
        const dir = rec.dir;

        if (dir === 0) {
            document.getElementById('wordDisplay').textContent = w.word;
            let ex = w.example || '';
            if (w.synonym && ex && !ex.includes(w.word) && ex.includes(w.synonym)) ex = ex.replace(w.synonym, w.word);
            document.getElementById('exampleDisplay').textContent = ex;
            document.getElementById('exampleCnDisplay').innerHTML = highlightChineseMeaning(w.example_cn || '', w.chinese || '');
        } else if (dir === 1) {
            document.getElementById('wordDisplay').textContent = w.chinese;
            document.getElementById('exampleDisplay').textContent = w.example || '';
            document.getElementById('exampleCnDisplay').textContent = `正确答案：${w.word}`;
        } else if (dir === 3) {
            document.getElementById('wordDisplay').textContent = w.word;
            document.getElementById('exampleDisplay').textContent = w.example || '';
            document.getElementById('exampleCnDisplay').textContent = w.example_cn || '';
        } else {
            let ex = w.example || '';
            const reps = [];
            if (w.synonym && ex.includes(w.synonym)) reps.push({ word: w.synonym, len: w.synonym.length });
            if (ex.includes(w.word)) reps.push({ word: w.word, len: w.word.length });
            reps.sort((a, b) => b.len - a.len);
            reps.forEach(r => { ex = ex.replaceAll(r.word, '____'); });
            document.getElementById('wordDisplay').textContent = ex;
            document.getElementById('exampleDisplay').textContent = '';
            document.getElementById('exampleCnDisplay').innerHTML = highlightChineseMeaning(w.example_cn || '', w.chinese || '');
        }

        if (dir === 3) {
            document.getElementById('optionsGrid').style.display = 'none';
            document.getElementById('inputModeContainer').style.display = 'none';
        } else {
            document.getElementById('optionsGrid').style.display = 'grid';
            document.getElementById('inputModeContainer').style.display = 'none';
            $$('.option-btn').forEach((b, i) => {
                b.textContent = rec.opts[i] || '-';
                b.className = 'option-btn';
                b.disabled = true;
                if (i === rec.correct) b.classList.add('correct');
                else if (i === rec.chosen) b.classList.add('wrong');
            });
        }

        const resultText = rec.ok ? '✓ 答对' : (rec.typed ? `✗ 你输入：${rec.typed}` : '✗ 答错');
        document.getElementById('stageHint').textContent = `👀 回顾第 ${speedPrevPos + 1} 题（${resultText}） · ← 更早 / → 返回`;
        document.getElementById('btnPrev').disabled = speedPrevPos <= 0;
        document.getElementById('btnReturn').disabled = false;
    }

    function showSpeedPrevious() {
        if (!isSpeedMode) return;
        if (!speedHistory.length) { showToast('还没有答过的题目'); return; }
        if (speedPrevPos === -1) {
            speedPrevSavedState = captureSpeedScene();
            speedPendingNext = !!nextTimeout;
            if (nextTimeout) { clearTimeout(nextTimeout); nextTimeout = null; }
            // 屏幕上若还显示着刚答完的那道题（它已被记入 history），再看一遍没有意义，
            // 直接翻到更早一道；否则（已跳到未作答的新题）从最近一道答过的题开始
            const last = speedHistory[speedHistory.length - 1];
            speedPrevPos = (last && last.idx === currentWordIndex && speedHistory.length > 1)
                ? speedHistory.length - 2
                : speedHistory.length - 1;
        } else if (speedPrevPos > 0) {
            speedPrevPos--;
        } else {
            showToast('已经是第一题');
            return;
        }
        isAnswering = false;
        renderSpeedPrev();
    }

    function restoreSpeedScene() {
        const s = speedPrevSavedState;
        speedPrevPos = -1;
        speedPrevSavedState = null;
        if (!s) return;
        isAnswering = s.ia;
        document.getElementById('wordDisplay').textContent = s.word;
        document.getElementById('exampleDisplay').textContent = s.example;
        document.getElementById('exampleCnDisplay').innerHTML = s.exampleCn;
        document.getElementById('stageHint').textContent = s.stageHint;
        if (s.stageHint.includes('回顾')) updateDirectionUI(); // 快照异常时兜底，避免残留回看提示
        document.getElementById('optionsGrid').style.display = s.gridDisplay;
        document.getElementById('inputModeContainer').style.display = s.inputDisplay;
        const inp = document.getElementById('answerInput');
        inp.value = s.inputValue;
        inp.disabled = s.inputDisabled;
        document.getElementById('btnSubmitAnswer').disabled = s.submitDisabled;
        const fb = document.getElementById('inputFeedback');
        fb.textContent = s.feedback;
        fb.style.color = s.feedbackColor;
        $$('.option-btn').forEach((b, i) => {
            if (s.bs[i]) { b.textContent = s.bs[i].t; b.className = s.bs[i].c; b.disabled = s.bs[i].d; }
        });
        document.getElementById('btnPrev').disabled = speedHistory.length === 0;
        document.getElementById('btnReturn').disabled = true;
        if (speedPendingNext) {
            speedPendingNext = false;
            nextTimeout = setTimeout(showSpeedQuestion, 700);
        }
    }

    function returnFromSpeedPrevious() {
        if (!isSpeedMode || speedPrevPos === -1) return;
        if (speedPrevPos < speedHistory.length - 1) { speedPrevPos++; renderSpeedPrev(); return; }
        restoreSpeedScene();
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

    // ========== 翻卡自测模式 ==========
    function enterCardMode() {
        const avail = getAvailableWords();
        if (!avail.length) {
            showModalConfirm('⚠️ 没有可用单词', '当前选择的范围没有单词，请选择其他日期范围。', () => { closeModal(); }, '确定');
            return;
        }
        isCardMode = true;
        document.getElementById('optionsGrid').style.display = 'none';
        document.getElementById('inputModeContainer').style.display = 'none';
        document.getElementById('cardActions').style.display = 'flex';
        document.getElementById('wordCard').classList.add('card-flippable');
        document.getElementById('btnSpeedMode').disabled = true;   // 翻卡下不提供速通
        document.getElementById('directionSelect').disabled = true;
        document.getElementById('titleLabel').textContent = '🃏 翻卡自测';
        document.getElementById('shortcutHint').textContent = '空格/点击卡片翻面 | → 记住了 | ← 还没记住 | ↑ 回看上一张 | V 发音';
        // 翻卡里 ←/→ 已被自评占用，回看改用 ↑ 进入，故按钮文案同步改成 ↑
        document.getElementById('btnPrev').textContent = '上一张 (↑)';
        document.getElementById('btnReturn').textContent = '返回 (→)';
        cardQueue = [...avail].sort(() => Math.random() - 0.5);
        cardIndex = 0;
        cardKnown = 0; cardForgot = 0; cardForgotList = [];
        cardHistory = []; cardPrevPos = -1; cardSavedFlipped = false;
        cardTotal = cardQueue.length;
        cardFlipped = false;
        showCard();
    }

    function exitCardMode() {
        isCardMode = false;
        cardFlipped = false;
        document.getElementById('cardActions').style.display = 'none';
        document.getElementById('wordCard').classList.remove('card-flippable');
        document.getElementById('wordDisplay').classList.remove('card-face');
        document.getElementById('btnSpeedMode').disabled = false;
        document.getElementById('directionSelect').disabled = false;
        document.getElementById('titleLabel').textContent = '📝 单词测试';
        document.getElementById('shortcutHint').textContent = '快捷键: 1-4选答案 | Enter/空格 下一题 | ←上一题 | →返回 | A收藏 | S斩';
        document.getElementById('btnPrev').textContent = '上一题 (←)';
        document.getElementById('btnReturn').textContent = '返回 (→)';
        document.getElementById('btnPrev').disabled = history.length === 0;
        document.getElementById('btnReturn').disabled = true;
        cardHistory = []; cardPrevPos = -1; cardSavedFlipped = false;
    }

    function showCard() {
        // 任何进入新卡的路径都要先清掉回看态，否则会留下「界面在回看、状态已归位」的不一致
        cardPrevPos = -1;
        if (cardIndex >= cardQueue.length) { finishCardMode(); return; }
        currentWordIndex = cardQueue[cardIndex];
        currentWord = vocabulary[currentWordIndex];
        cardFlipped = false;
        renderCard();
        if (autoSpeak) speak(currentWord.word);
        updateCardStats();
    }

    function renderCard(hintOverride) {
        const w = currentWord;
        const wd = document.getElementById('wordDisplay');
        let hint;
        if (!cardFlipped) {
            wd.textContent = w.word;
            document.getElementById('exampleDisplay').textContent = w.example || '';
            document.getElementById('exampleCnDisplay').textContent = '';
            hint = '👆 回想中文意思，点击卡片翻面';
        } else {
            wd.textContent = w.chinese;
            document.getElementById('exampleDisplay').textContent = w.example || '';
            document.getElementById('exampleCnDisplay').textContent = w.example_cn || '';
            hint = w.synonym ? `${w.word} = ${w.synonym}` : w.word;
            // 翻到中文面之后才解锁「翻回英文」和自评，正面时两者都不可用
            if (cardPrevPos === -1) hint += ' · 再点一次翻回英文';
        }
        wd.classList.remove('card-face');
        void wd.offsetWidth; // 重启动画
        wd.classList.add('card-face');
        document.getElementById('stageHint').textContent = hintOverride || hint;
        // 回看时禁止再自评，否则会重复计数
        const reviewing = cardPrevPos !== -1;
        document.getElementById('btnCardKnown').disabled = reviewing || !cardFlipped;
        document.getElementById('btnCardForgot').disabled = reviewing || !cardFlipped;
        const btnPrev = document.getElementById('btnPrev');
        const btnReturn = document.getElementById('btnReturn');
        btnPrev.disabled = reviewing ? cardPrevPos <= 0 : cardHistory.length === 0;
        btnReturn.disabled = !reviewing;
    }

    function flipCard() {
        if (!isCardMode) return;
        cardFlipped = !cardFlipped; // 双向：翻到中文后还能再翻回英文
        // 回看中翻面必须走回看渲染，否则「回顾…」提示会被普通提示顶掉
        if (cardPrevPos !== -1) renderCardPrev();
        else renderCard();
    }

    // ========== 翻卡回看 ==========
    function renderCardPrev() {
        const rec = cardHistory[cardPrevPos];
        currentWordIndex = rec.idx;
        currentWord = vocabulary[rec.idx];
        renderCard(`👀 回顾第 ${cardPrevPos + 1} 张（${rec.known ? '✓ 记住了' : '✗ 还没记住'}） · ↑/← 更早 / → 返回`);
    }

    function showCardPrevious() {
        if (!isCardMode || !cardHistory.length) return;
        if (cardPrevPos === -1) {
            cardSavedFlipped = cardFlipped;
            cardPrevPos = cardHistory.length - 1;
        } else if (cardPrevPos > 0) {
            cardPrevPos--;
        } else {
            return; // 已经是最早一张
        }
        cardFlipped = true; // 回看默认摊开中文面
        renderCardPrev();
    }

    function returnFromCardPrevious() {
        if (!isCardMode || cardPrevPos === -1) return;
        if (cardPrevPos < cardHistory.length - 1) {
            cardPrevPos++;
            cardFlipped = true;
            renderCardPrev();
            return;
        }
        // 已回到最新一张，再按 → 退出回看、恢复当前卡
        cardPrevPos = -1;
        if (cardIndex >= cardQueue.length) { finishCardMode(); return; }
        currentWordIndex = cardQueue[cardIndex];
        currentWord = vocabulary[currentWordIndex];
        cardFlipped = cardSavedFlipped;
        renderCard();
        updateCardStats();
    }

    function markCard(known) {
        if (!isCardMode || !cardFlipped || cardPrevPos !== -1) return;
        const idx = cardQueue[cardIndex];
        cardHistory.push({ idx, known });
        cardQueue.splice(cardIndex, 1); // 当前卡出队，下一张自然补位（cardIndex 不变）
        if (known) {
            cardKnown++;
        } else {
            cardForgot++;
            cardForgotList.push(idx);
            wrongWords[String(idx)] = (wrongWords[String(idx)] || 0) + 1;
            cardQueue.splice(Math.min(cardIndex + 5, cardQueue.length), 0, idx); // 5 张后再来一次
        }
        saveProgress();
        if (cardIndex >= cardQueue.length) { finishCardMode(); return; }
        showCard();
    }

    function updateCardStats() {
        document.getElementById('scoreLabel').textContent = `记住: ${cardKnown}`;
        document.getElementById('remainingLabel').textContent = `剩余: ${Math.max(cardQueue.length - cardIndex, 0)}`;
        document.getElementById('accuracyLabel').textContent = `未记住: ${cardForgot}`;
        document.getElementById('progressFill').style.width = cardTotal ? (cardKnown / cardTotal * 100) + '%' : '0%';
    }

    function finishCardMode() {
        const forgotUnique = [...new Set(cardForgotList)];
        showModal('翻卡完成', `
            <p style="text-align:center; font-size:1.2em; margin-bottom:10px;">🎉 这一轮翻完了！</p>
            <p style="text-align:center;">共 ${cardTotal} 张卡，记住 <span style="color:var(--progress-fill); font-weight:bold;">${cardKnown}</span> 个</p>
            <p style="text-align:center;">标记未记住 <span style="color:var(--remaining-fg); font-weight:bold;">${forgotUnique.length}</span> 个（已计入错题统计）</p>
            <div style="display:flex; gap:10px; justify-content:center; margin-top:18px; flex-wrap:wrap;">
                <button class="close-btn" id="modalCloseBtn" style="margin:0;">确定</button>
                ${forgotUnique.length ? `<button id="btnReviewCardForgot" style="background:var(--accent); color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">🔁 再翻一遍未记住的 (${forgotUnique.length})</button>` : ''}
            </div>
        `);
        if (forgotUnique.length) {
            document.getElementById('btnReviewCardForgot').onclick = () => {
                closeModal();
                cardQueue = [...forgotUnique].sort(() => Math.random() - 0.5);
                cardIndex = 0; cardForgotList = []; cardKnown = 0; cardForgot = 0;
                cardHistory = []; cardPrevPos = -1; cardSavedFlipped = false;
                cardTotal = cardQueue.length;
                showCard();
                showToast(`已载入 ${cardQueue.length} 个未记住的单词`);
            };
        }
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
        // 清理回看状态：正在回看时直接丢弃快照，界面随后会被普通模式重建
        if (nextTimeout) { clearTimeout(nextTimeout); nextTimeout = null; }
        speedHistory = [];
        speedPrevPos = -1;
        speedPrevSavedState = null;
        speedPendingNext = false;
        isAnswering = true;
        if (isBrowseMode) hideBrowseMode(); // 正在浏览时退出速通，先回到测试界面

        document.getElementById('topActions').style.display = '';
        document.getElementById('btnHardWord').style.display = '';
        document.getElementById('btnSlashWord').style.display = '';
        document.getElementById('modeSelect').disabled = false;
        document.getElementById('directionSelect').disabled = false;
        document.getElementById('btnSpeedMode').disabled = false;
        document.getElementById('btnBrowse').disabled = false;
        document.getElementById('btnWrongBook').disabled = false;
        document.getElementById('navBtns').style.display = '';
        document.getElementById('btnPrev').disabled = history.length === 0;
        document.getElementById('btnReturn').disabled = true;
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
        if (isCardMode) { showCardPrevious(); return; }
        if (isSpeedMode) { showSpeedPrevious(); return; }
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
        document.getElementById('wordDisplay').textContent = p.dir === 0 ? p.word : (p.dir === 1 ? p.chinese : (p.dir === 3 ? p.word : (p.blank || p.example)));
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
        if (isCardMode) { returnFromCardPrevious(); return; }
        if (isSpeedMode) { returnFromSpeedPrevious(); return; }
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
        } else if (s.td === 3 && s.w) {
            document.getElementById('wordDisplay').textContent = '🔊 请听发音，输入英文单词';
        } else {
            document.getElementById('wordDisplay').textContent = '';
        }
        document.getElementById('exampleDisplay').textContent = s.td === 0 && s.w ? s.w.example : '';
        document.getElementById('exampleCnDisplay').textContent = s.ecnd || '';
        updateDirectionUI();
        document.getElementById('btnHardWord').textContent = currentWordIndex !== null && hardWords.has(currentWordIndex) ? '★' : '⭐';
        $$('.option-btn').forEach((b, i) => { b.textContent = s.bs[i].t; b.className = s.bs[i].c; b.disabled = s.bs[i].d; });
        if (s.td === 3) {
            document.getElementById('optionsGrid').style.display = 'none';
            document.getElementById('inputModeContainer').style.display = 'flex';
            document.getElementById('inputModeContainer').style.flexDirection = 'column';
            document.getElementById('inputModeContainer').style.alignItems = 'center';
        } else {
            document.getElementById('optionsGrid').style.display = 'grid';
            document.getElementById('inputModeContainer').style.display = 'none';
        }
        isViewingHistory = false; savedCurrentState = null;
        document.getElementById('btnReturn').disabled = true;
        document.getElementById('btnPrev').disabled = history.length === 0;
    }

    function toggleHardWord() {
        if (currentWordIndex === null || isViewingHistory || isBrowseMode) return;
        if (isCardMode && cardPrevPos !== -1) return; // 回看中标记的是历史卡，会标错词
        if (hardWords.has(currentWordIndex)) { hardWords.delete(currentWordIndex); showToast('已取消难词标记'); }
        else { hardWords.add(currentWordIndex); showToast('已标记为难词'); }
        document.getElementById('btnHardWord').textContent = hardWords.has(currentWordIndex) ? '★' : '⭐';
        saveProgress();
    }

    function slashWord() {
        if (currentWordIndex === null || isViewingHistory || isBrowseMode) return;
        if (isCardMode && cardPrevPos !== -1) return; // 回看中 currentWordIndex 是历史卡，斩了没意义还会扰乱队列
        showModalConfirm('斩词确认', `确定要斩掉「${vocabulary[currentWordIndex].word}」吗？`, () => {
            closeModal();
            slashedWords.add(currentWordIndex);
            wrongQueue = wrongQueue.filter(i => i.idx !== currentWordIndex);
            reviewQueue = reviewQueue.filter(i => i.idx !== currentWordIndex);
            unmasteredIndices = unmasteredIndices.filter(i => i !== currentWordIndex);
            showToast('已斩掉！');
            if (isCardMode) { removeFromCardQueue(currentWordIndex); showCard(); return; }
            nextQuestion();
        });
    }

    function removeFromCardQueue(idx) {
        const pos = cardQueue.indexOf(idx);
        if (pos === -1) return;
        cardQueue.splice(pos, 1);
        if (pos < cardIndex) cardIndex--;
    }

    function showBrowseMode(searchTerm = '') {
        // 速通中打开浏览：暂停自动跳题，返回测试时再继续
        if (isSpeedMode && nextTimeout) {
            clearTimeout(nextTimeout);
            nextTimeout = null;
            speedPendingNext = true;
        }
        isBrowseMode = true;
        ['wordCard', 'optionsGrid', 'inputModeContainer', 'progressWrap', 'headerRow', 'bottomBar', 'cardActions'].forEach(id => document.getElementById(id).style.display = 'none');
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
        document.getElementById('btnBackToTest').textContent = isSpeedMode ? '返回速通' : '返回测试';
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
        } else if (isCardMode) {
            document.getElementById('optionsGrid').style.display = 'none';
            document.getElementById('inputModeContainer').style.display = 'none';
            document.getElementById('cardActions').style.display = 'flex';
        } else {
            document.getElementById('optionsGrid').style.display = 'grid';
            document.getElementById('inputModeContainer').style.display = 'none';
        }

        // 速通中：从浏览回到测试，恢复被暂停的自动跳题（回看上一题时保持不动）
        if (isSpeedMode && speedPrevPos === -1 && speedPendingNext) {
            speedPendingNext = false;
            nextTimeout = setTimeout(showSpeedQuestion, 700);
        }
        // 回看途中进过浏览：按题型重建的布局会把回看界面冲掉，这里重新渲染一次
        if (isSpeedMode && speedPrevPos !== -1) renderSpeedPrev();
        if (isCardMode && cardPrevPos !== -1) renderCardPrev();
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
        if (testMode === 5) { enterCardMode(); return; }
        if (isCardMode) exitCardMode();
        nextQuestion();
    }

    function bindEvents() {
        $$('.option-btn').forEach((b, i) => b.addEventListener('click', () => selectOption(i)));
        document.addEventListener('keydown', e => {
            if (document.getElementById('modalOverlay').classList.contains('active')) return;
            
            // 检查是否在输入框中，如果是则跳过快捷键（除了Enter键用于提交）
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (activeElement.id === 'answerInput' || activeElement.id === 'browseSearch');
            const isArrowKey = e.key === 'ArrowLeft' || e.key === 'ArrowRight';
            if (isInputFocused && e.key !== 'Enter' && !isArrowKey) return;
            
            if (isBrowseMode) { if (e.key === 'Escape') hideBrowseMode(); return; }
            if (isCardMode) {
                const k = e.key;
                if (k === ' ' || k === 'Enter') { e.preventDefault(); flipCard(); return; }
                if (k === 'ArrowUp') { e.preventDefault(); showCardPrevious(); return; }
                // 回看中 ←/→ 让位给导航，自评在回看时本来就是禁用的
                if (k === 'ArrowRight') { e.preventDefault(); if (cardPrevPos !== -1) returnFromCardPrevious(); else markCard(true); return; }
                if (k === 'ArrowLeft') { e.preventDefault(); if (cardPrevPos !== -1) showCardPrevious(); else markCard(false); return; }
                if (k === 'v' || k === 'V') { e.preventDefault(); if (currentWord) speak(currentWord.word); return; }
                if ((k === 'a' || k === 'A') && currentWordIndex !== null && cardPrevPos === -1) { e.preventDefault(); toggleHardWord(); return; }
                if ((k === 's' || k === 'S') && currentWordIndex !== null && cardPrevPos === -1) { e.preventDefault(); slashWord(); return; }
                return;
            }
            if (isSpeedMode) {
                const k = e.key;
                if (k === 'ArrowLeft') { e.preventDefault(); showSpeedPrevious(); return; }
                if (k === 'ArrowRight') { e.preventDefault(); returnFromSpeedPrevious(); return; }
                if (k === 'Escape') { e.preventDefault(); exitSpeedMode(); return; }
                if (k === 'v' || k === 'V') {
                    e.preventDefault();
                    const rec = speedPrevPos !== -1 ? speedHistory[speedPrevPos] : null;
                    if (rec) speak(vocabulary[rec.idx].word);
                    else if (currentWord) speak(currentWord.word);
                    return;
                }
                if (speedPrevPos !== -1) return; // 回看上一题时不响应 1-4
                if (k === '1') { e.preventDefault(); selectOption(0); }
                if (k === '2') { e.preventDefault(); selectOption(1); }
                if (k === '3') { e.preventDefault(); selectOption(2); }
                if (k === '4') { e.preventDefault(); selectOption(3); }
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
            document.getElementById('modalDialog').innerHTML = `<h3>快捷键</h3><div style="line-height:2"><p>1-4: 选答案</p><p>Enter/空格: 下一题</p><p>←/→: 历史回顾（速通中可 ← 看上一题、→ 返回）</p><p>A: 难词 S: 斩词</p><p>V: 播放发音</p><p>🃏 翻卡: 空格/点击翻面（可翻回英文） | ←还没记住 | →记住了 | ↑回看上一张（回看中 ←更早 / →返回）</p><p>📖 浏览: 点击按钮/Esc退出</p></div><button id="modalCloseBtn">关闭</button>`;
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
        document.getElementById('btnHideExamples').onclick = () => {
            hideExamples = !hideExamples;
            updateHideExamplesBtn();
            saveProgress();
            showToast(hideExamples ? '例句已隐藏' : '例句已显示');
        };
        document.getElementById('btnSpeak').onclick = () => {
            if (isSpeedMode && speedPrevPos !== -1 && speedHistory[speedPrevPos]) {
                speak(vocabulary[speedHistory[speedPrevPos].idx].word);
            } else if (isViewingHistory && history.length) {
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
        document.getElementById('btnCardKnown').addEventListener('click', () => markCard(true));
        document.getElementById('btnCardForgot').addEventListener('click', () => markCard(false));
        document.getElementById('wordCard').addEventListener('click', (e) => {
            if (!isCardMode) return;
            if (e.target.closest('button')) return; // 点🔊/⭐/🔪 时不翻面
            flipCard();
        });
        document.getElementById('btnPrev').addEventListener('click', showPreviousQuestion);
        document.getElementById('btnReturn').addEventListener('click', returnToCurrentQuestion);
        document.getElementById('btnBrowse').addEventListener('click', () => showBrowseMode());
        document.getElementById('browseSearch').oninput = (e) => showBrowseMode(e.target.value);
        document.getElementById('btnBackToTest').addEventListener('click', () => {
            hideBrowseMode();
            document.getElementById('btnBackToTest').textContent = '返回测试';
        });
        document.getElementById('dateSelect').addEventListener('change', function () { selectedDate = this.value; isViewingHistory = false; savedCurrentState = null; history = []; wrongQueue = []; reviewQueue = []; slashedWords.clear(); questionCounter = 0; resetAndStart(); });
        document.getElementById('modeSelect').addEventListener('change', function () { testMode = parseInt(this.value); isViewingHistory = false; savedCurrentState = null; history = []; wrongQueue = []; reviewQueue = []; slashedWords.clear(); questionCounter = 0; resetAndStart(); });
        document.getElementById('directionSelect').addEventListener('change', function () { testDirection = parseInt(this.value); updateDirectionUI(); isViewingHistory = false; savedCurrentState = null; history = []; wrongQueue = []; reviewQueue = []; slashedWords.clear(); questionCounter = 0; resetAndStart(); });
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
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ masteredIndices, wrongWords, hardWords: [...hardWords], wrongQueue, reviewQueue, questionCounter, slashedWords: [...slashedWords], testMode, testDirection, darkMode, fontSizes, selectedDate, autoSpeak, hideExamples })); } catch (e) { }
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
                hideExamples = d.hideExamples ?? false;
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