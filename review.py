import tkinter as tk
from tkinter import messagebox, ttk
import random
import json
import time
import os

# ✅ 完整单词表（带英文例句和中文翻译）
vocabulary = [
    # P9-P10 前40个
    {"word": "evoke", "chinese": "唤起",
     "example": "The smell of fresh bread evokes happy memories of my grandmother's kitchen.",
     "example_cn": "新鮮麵包的香味喚起了我對祖母廚房的美好回憶。"},
    {"word": "elicit", "chinese": "唤起",
     "example": "The smell of fresh bread elicits happy memories of my grandmother's kitchen.",
     "example_cn": "新鮮麵包的香味喚起了我對祖母廚房的美好回憶。"},
    {"word": "exacerbate", "chinese": "恶化", "example": "Rubbing a mosquito bite will only exacerbate the itching.",
     "example_cn": "抓撓蚊子包只會讓痕癢惡化。"},
    {"word": "worsen", "chinese": "恶化", "example": "Rubbing a mosquito bite will only worsen the itching.",
     "example_cn": "抓撓蚊子包只會讓痕癢惡化。"},
    {"word": "exemplify", "chinese": "举例说明",
     "example": "This simple recipe exemplifies how easy it is to cook healthy food.",
     "example_cn": "這個簡單的食譜例說明了烹飪健康食品是多麼容易。"},
    {"word": "illustrate", "chinese": "举例说明",
     "example": "This simple recipe illustrates how easy it is to cook healthy food.",
     "example_cn": "這個簡單的食譜例說明了烹飪健康食品是多麼容易。"},
    {"word": "exploit", "chinese": "利用", "example": "We should exploit solar energy to save electricity.",
     "example_cn": "我們應該利用太陽能來節省電力。"},
    {"word": "utilize", "chinese": "利用", "example": "We should utilize solar energy to save electricity.",
     "example_cn": "我們應該利用太陽能來節省電力。"},
    {"word": "facilitate", "chinese": "促进",
     "example": "The new app will facilitate communication between teachers and parents.",
     "example_cn": "這個新的應用程式將促進老師和家長之間的溝通。"},
    {"word": "ease", "chinese": "促进", "example": "The new app will ease communication between teachers and parents.",
     "example_cn": "這個新的應用程式將促進老師和家長之間的溝通。"},
    {"word": "falter", "chinese": "犹豫",
     "example": "He started to falter when asked a difficult question during the interview.",
     "example_cn": "面試中被問到一個難題時，他開始猶豫起來。"},
    {"word": "hesitate", "chinese": "犹豫",
     "example": "He started to hesitate when asked a difficult question during the interview.",
     "example_cn": "面試中被問到一個難題時，他開始猶豫起來。"},
    {"word": "feasible", "chinese": "可行的", "example": "It's not feasible to finish this entire project in one day.",
     "example_cn": "在一天內完成整個項目是不可行的。"},
    {"word": "viable", "chinese": "可行的", "example": "It's not viable to finish this entire project in one day.",
     "example_cn": "在一天內完成整個項目是不可行的。"},
    {"word": "finite", "chinese": "有限的", "example": "The Earth has finite resources, so we need to recycle.",
     "example_cn": "地球的資源是有限的，所以我們需要回收利用。"},
    {"word": "limited", "chinese": "有限的", "example": "The Earth has limited resources, so we need to recycle.",
     "example_cn": "地球的資源是有限的，所以我們需要回收利用。"},
    {"word": "fluctuate", "chinese": "波动",
     "example": "The temperature can fluctuate greatly between day and night in the desert.",
     "example_cn": "在沙漠裡，白天和晚上的氣溫會波動很大。"},
    {"word": "vary", "chinese": "波动",
     "example": "The temperature can vary greatly between day and night in the desert.",
     "example_cn": "在沙漠裡，白天和晚上的氣溫會波動很大。"},
    {"word": "formidable", "chinese": "令人敬畏的", "example": "Passing the final exam seemed like a formidable task.",
     "example_cn": "通過期末考試似乎是一項令人敬畏的任務。"},
    {"word": "challenging", "chinese": "令人敬畏的",
     "example": "Passing the final exam seemed like a challenging task.",
     "example_cn": "通過期末考試似乎是一項令人敬畏的任務。"},
    {"word": "foster", "chinese": "培养", "example": "Reading books can foster a child's imagination.",
     "example_cn": "閱讀書籍可以培養孩子的想像力。"},
    {"word": "nurture", "chinese": "培养", "example": "Reading books can nurture a child's imagination.",
     "example_cn": "閱讀書籍可以培養孩子的想像力。"},
    {"word": "fraudulent", "chinese": "欺诈的",
     "example": "The company was accused of making fraudulent claims about their products.",
     "example_cn": "該公司被指控對其產品作出欺詐性的聲明。"},
    {"word": "deceptive", "chinese": "欺诈的",
     "example": "The company was accused of making deceptive claims about their products.",
     "example_cn": "該公司被指控對其產品作出欺詐性的聲明。"},
    {"word": "futile", "chinese": "徒劳的", "example": "It was futile to try and open the door; it was locked tight.",
     "example_cn": "試圖打開那扇門是徒勞的，它鎖得很緊。"},
    {"word": "fruitless", "chinese": "徒劳的",
     "example": "It was fruitless to try and open the door; it was locked tight.",
     "example_cn": "試圖打開那扇門是徒勞的，它鎖得很緊。"},
    {"word": "gauge", "chinese": "测量", "example": "It's hard to gauge how people will react to the news.",
     "example_cn": "很難估量人們對這個消息會有何反應。"},
    {"word": "measure", "chinese": "测量", "example": "It's hard to measure how people will react to the news.",
     "example_cn": "很難估量人們對這個消息會有何反應。"},
    {"word": "generate", "chinese": "产生", "example": "Wind turbines generate electricity.",
     "example_cn": "風力渦輪機產生電力。"},
    {"word": "produce", "chinese": "产生", "example": "Wind turbines produce electricity.",
     "example_cn": "風力渦輪機產生電力。"},
    {"word": "genuine", "chinese": "真正的", "example": "Is that a genuine diamond or is it fake?",
     "example_cn": "那是真正的鑽石還是假的？"},
    {"word": "authentic", "chinese": "真正的", "example": "Is that an authentic diamond or is it fake?",
     "example_cn": "那是真正的鑽石還是假的？"},
    {"word": "grasp", "chinese": "理解", "example": "The concept was too difficult for me to grasp at first.",
     "example_cn": "這個概念太難了，我一開始無法理解。"},
    {"word": "comprehend", "chinese": "理解", "example": "The concept was too difficult for me to comprehend at first.",
     "example_cn": "這個概念太難了，我一開始無法理解。"},
    {"word": "hinder", "chinese": "阻碍", "example": "Bad weather can hinder the progress of a construction project.",
     "example_cn": "惡劣的天氣會阻礙建築項目的進度。"},
    {"word": "impede", "chinese": "阻碍", "example": "Bad weather can impede the progress of a construction project.",
     "example_cn": "惡劣的天氣會阻礙建築項目的進度。"},
    {"word": "immerse", "chinese": "沉浸",
     "example": "When I read a good book, I like to immerse myself completely in the story.",
     "example_cn": "我讀一本好書時，喜歡讓自己完全沉浸在故事中。"},
    {"word": "engross", "chinese": "沉浸",
     "example": "When I read a good book, I like to engross myself completely in the story.",
     "example_cn": "我讀一本好書時，喜歡讓自己完全沉浸在故事中。"},
    {"word": "impair", "chinese": "损害", "example": "Drinking too much soda can impair your teeth.",
     "example_cn": "喝太多汽水會損害你的牙齒。"},
    {"word": "damage", "chinese": "损害", "example": "Drinking too much soda can damage your teeth.",
     "example_cn": "喝太多汽水會損害你的牙齒。"},

    # P11-P12 后40个
    {"word": "imperative", "chinese": "紧要的", "example": "It is imperative to wear a seatbelt when driving.",
     "example_cn": "開車時繫安全帶是必要的。"},
    {"word": "crucial", "chinese": "紧要的", "example": "It is crucial to wear a seatbelt when driving.",
     "example_cn": "開車時繫安全帶是必要的。"},
    {"word": "implement", "chinese": "实施", "example": "The school will implement a new homework policy next week.",
     "example_cn": "學校下週將實施新的作業政策。"},
    {"word": "execute", "chinese": "实施", "example": "The school will execute a new homework policy next week.",
     "example_cn": "學校下週將實施新的作業政策。"},
    {"word": "implicate", "chinese": "涉及", "example": "His testimony implicated his friend in the prank.",
     "example_cn": "他的證詞顯示他的朋友涉及了那個惡作劇。"},
    {"word": "involve", "chinese": "涉及", "example": "His testimony involved his friend in the prank.",
     "example_cn": "他的證詞顯示他的朋友涉及了那個惡作劇。"},
    {"word": "implicit", "chinese": "隐含的", "example": "There was an implicit trust between the old friends.",
     "example_cn": "老友之間存在著一種不言而喻的信任。"},
    {"word": "implied", "chinese": "隐含的", "example": "There was an implied trust between the old friends.",
     "example_cn": "老友之間存在著一種不言而喻的信任。"},
    {"word": "impose", "chinese": "强加", "example": "My parents don't impose too many rules on me.",
     "example_cn": "我父母沒有強加太多規矩在我身上。"},
    {"word": "enforce", "chinese": "强加", "example": "My parents don't enforce too many rules on me.",
     "example_cn": "我父母沒有強加太多規矩在我身上。"},
    {"word": "incentive", "chinese": "动机", "example": "The bonus was a great incentive for the team to work harder.",
     "example_cn": "獎金是激勵團隊更努力工作的好誘因。"},
    {"word": "motivation", "chinese": "动机",
     "example": "The bonus was a great motivation for the team to work harder.",
     "example_cn": "獎金是激勵團隊更努力工作的好誘因。"},
    {"word": "incidental", "chinese": "附带的",
     "example": "Finding a $5 bill in my pocket was incidental to doing laundry.",
     "example_cn": "在口袋裡找到五塊錢是洗衣服的意外收穫。"},
    {"word": "secondary", "chinese": "附带的",
     "example": "Finding a $5 bill in my pocket was secondary to doing laundry.",
     "example_cn": "在口袋裡找到五塊錢是洗衣服的意外收穫。"},
    {"word": "incorporate", "chinese": "合并", "example": "Let's incorporate your ideas into the party plan.",
     "example_cn": "把我們的想法納入派對計畫吧。"},
    {"word": "integrate", "chinese": "合并", "example": "Let's integrate your ideas into the party plan.",
     "example_cn": "把我們的想法納入派對計畫吧。"},
    {"word": "indigenous", "chinese": "土著的", "example": "The kiwi is an indigenous bird of New Zealand.",
     "example_cn": "奇異鳥是紐西蘭的本土鳥類。"},
    {"word": "native", "chinese": "土著的", "example": "The kiwi is a native bird of New Zealand.",
     "example_cn": "奇異鳥是紐西蘭的本土鳥類。"},
    {"word": "induce", "chinese": "引发",
     "example": "This medicine might induce sleepiness, so don't drive after taking it.",
     "example_cn": "這種藥可能會引起嗜睡，所以服用後不要開車。"},
    {"word": "provoke", "chinese": "引发",
     "example": "This medicine might provoke sleepiness, so don't drive after taking it.",
     "example_cn": "這種藥可能會引起嗜睡，所以服用後不要開車。"},
    {"word": "infer", "chinese": "推断", "example": "From his sad face, I inferred that he failed the test.",
     "example_cn": "從他悲傷的臉，我推斷他考試沒通過。"},
    {"word": "deduce", "chinese": "推断", "example": "From his sad face, I deduced that he failed the test.",
     "example_cn": "從他悲傷的臉，我推斷他考試沒通過。"},
    {"word": "ingenious", "chinese": "巧妙的", "example": "What an ingenious way to reuse plastic bottles!",
     "example_cn": "這真是個再利用塑膠瓶的巧妙方法！"},
    {"word": "innovative", "chinese": "巧妙的", "example": "What an innovative way to reuse plastic bottles!",
     "example_cn": "這真是個再利用塑膠瓶的巧妙方法！"},
    {"word": "inherent", "chinese": "固有的", "example": "There is an inherent risk in every adventure sport.",
     "example_cn": "每一種極限運動都有其固有的風險。"},
    {"word": "intrinsic", "chinese": "固有的", "example": "There is an intrinsic risk in every adventure sport.",
     "example_cn": "每一種極限運動都有其固有的風險。"},
    {"word": "inhibit", "chinese": "抑制", "example": "His fear of water inhibited him from learning to swim.",
     "example_cn": "他對水的恐懼抑制了他學習游泳。"},
    {"word": "restrain", "chinese": "抑制", "example": "His fear of water restrained him from learning to swim.",
     "example_cn": "他對水的恐懼抑制了他學習游泳。"},
    {"word": "initiate", "chinese": "开始", "example": "They will initiate the construction project next month.",
     "example_cn": "他們將在下個月啟動這個建設計畫。"},
    {"word": "commence", "chinese": "开始", "example": "They will commence the construction project next month.",
     "example_cn": "他們將在下個月啟動這個建設計畫。"},
    {"word": "innovate", "chinese": "创新", "example": "Companies must innovate to stay competitive.",
     "example_cn": "公司必須創新才能保持競爭力。"},
    {"word": "pioneer", "chinese": "创新", "example": "Companies must pioneer to stay competitive.",
     "example_cn": "公司必須創新才能保持競爭力。"},
    {"word": "inquiry", "chinese": "调查", "example": "The store manager is making an inquiry about the missing item.",
     "example_cn": "商店經理正在調查遺失的商品。"},
    {"word": "investigation", "chinese": "调查",
     "example": "The store manager is making an investigation about the missing item.",
     "example_cn": "商店經理正在調查遺失的商品。"},
    {"word": "insight", "chinese": "洞察力", "example": "The article gives great insight into Japanese culture.",
     "example_cn": "這篇文章對日本文化提供了深刻的見解。"},
    {"word": "understanding", "chinese": "洞察力",
     "example": "The article gives great understanding into Japanese culture.",
     "example_cn": "這篇文章對日本文化提供了深刻的見解。"},
    {"word": "integral", "chinese": "不可或缺的", "example": "Teamwork is an integral part of this class.",
     "example_cn": "團隊合作是這堂課不可或缺的一部分。"},
    {"word": "essential", "chinese": "不可或缺的", "example": "Teamwork is an essential part of this class.",
     "example_cn": "團隊合作是這堂課不可或缺的一部分。"},
    {"word": "integrity", "chinese": "正直", "example": "I admire her for her integrity and kindness.",
     "example_cn": "我欽佩她的正直和善良。"},
    {"word": "honesty", "chinese": "正直", "example": "I admire her for her honesty and kindness.",
     "example_cn": "我欽佩她的正直和善良。"}
]

# 配置文件路径
CONFIG_FILE = "vocab_config.json"


class VocabularyTestApp:
    def __init__(self, root):
        self.root = root
        self.root.title("单词中文解释测试")
        self.root.geometry("650x820")
        self.root.resizable(True, True)

        # 主题设置
        self.dark_mode = False
        self.light_colors = {
            "bg": "#f0f0f0",
            "fg": "#000000",
            "btn_bg": "#f0f0f0",
            "btn_fg": "#000000",
            "example_fg": "#555555",
            "remaining_fg": "#FF4444"
        }
        self.dark_colors = {
            "bg": "#2b2b2b",
            "fg": "#ffffff",
            "btn_bg": "#3c3f41",
            "btn_fg": "#ffffff",
            "example_fg": "#bbbbbb",
            "remaining_fg": "#FF6B6B"
        }
        self.colors = self.light_colors

        # 字体设置
        self.font_size_large = 24
        self.font_size_medium = 14
        self.font_size_small = 11
        self.update_fonts()

        # 初始化变量
        self.current_word = None
        self.current_word_index = None
        self.current_options = []
        self.correct_index = None
        self.has_mistake = False
        self.mastered_indices = []
        self.unmastered_indices = []
        self.wrong_words = {}
        self.hard_words = set()
        self.test_mode = 0
        self.mode_names = ["全部80个", "前40个", "后40个", "只复习错题", "只复习难词"]
        self.test_direction = 0
        self.direction_names = ["英文选中文", "中文选英文", "句子填空"]

        # 智能队列系统
        self.wrong_queue = []  # 错题队列：[(index, wrong_count, next_appear_after)]
        self.review_queue = []  # 巩固复习队列：[(index, next_appear_after)]
        self.slashed_words = set()  # 本轮已斩单词
        self.question_counter = 0
        self.is_review_question = False  # 标记当前是否是复习题
        self.next_timeout = None  # 用于修复Enter键重复跳转bug

        # 历史记录系统
        self.history = []
        self.is_viewing_history = False
        self.saved_current_state = None
        self.is_answering = True

        # 学习统计
        self.start_time = time.time()
        self.total_attempts = 0
        self.correct_attempts = 0

        # 创建界面
        self.create_widgets()

        # 加载保存的进度
        self.load_progress()

        # 绑定键盘快捷键
        self.bind_shortcuts()

        # 开始第一题
        self.reset_and_start()

    def update_fonts(self):
        self.font_large = ("Arial", self.font_size_large, "bold")
        self.font_medium = ("Arial", self.font_size_medium)
        self.font_small = ("Arial", self.font_size_small)

    def create_widgets(self):
        # 顶部工具栏
        self.toolbar_frame = tk.Frame(self.root, bg=self.colors["bg"])
        self.toolbar_frame.pack(fill="x", padx=20, pady=10)

        # 字体调整按钮
        self.font_minus_btn = tk.Button(self.toolbar_frame, text="A-", font=self.font_small,
                                        width=3, command=self.decrease_font)
        self.font_minus_btn.pack(side="left", padx=2)
        self.font_plus_btn = tk.Button(self.toolbar_frame, text="A+", font=self.font_small,
                                       width=3, command=self.increase_font)
        self.font_plus_btn.pack(side="left", padx=2)

        # 夜间模式按钮
        self.night_mode_btn = tk.Button(self.toolbar_frame, text="🌙", font=self.font_small,
                                        width=3, command=self.toggle_night_mode)
        self.night_mode_btn.pack(side="left", padx=2)

        # 错题统计按钮
        self.wrong_book_btn = tk.Button(self.toolbar_frame, text="错题统计", font=self.font_small,
                                        command=self.show_wrong_book)
        self.wrong_book_btn.pack(side="left", padx=5)

        # 快捷键帮助按钮
        self.help_btn = tk.Button(self.toolbar_frame, text="?", font=self.font_small,
                                  width=2, command=self.show_shortcuts)
        self.help_btn.pack(side="left", padx=2)

        # 测试方向切换
        self.direction_var = tk.StringVar(value=self.direction_names[self.test_direction])
        self.direction_combobox = ttk.Combobox(self.toolbar_frame, textvariable=self.direction_var,
                                               values=self.direction_names, state="readonly",
                                               font=self.font_small, width=10)
        self.direction_combobox.pack(side="left", padx=5)
        self.direction_combobox.bind("<<ComboboxSelected>>", self.switch_direction)

        # 标题、得分和范围切换
        self.header_frame = tk.Frame(self.root, bg=self.colors["bg"])
        self.header_frame.pack(fill="x", padx=20, pady=5)

        self.title_label = tk.Label(self.header_frame, text="单词测试", font=self.font_medium,
                                    bg=self.colors["bg"], fg=self.colors["fg"])
        self.title_label.pack(side="left")

        # 范围下拉列表
        self.mode_var = tk.StringVar(value=self.mode_names[self.test_mode])
        self.mode_combobox = ttk.Combobox(self.header_frame, textvariable=self.mode_var,
                                          values=self.mode_names, state="readonly",
                                          font=self.font_small, width=12)
        self.mode_combobox.pack(side="left", padx=20)
        self.mode_combobox.bind("<<ComboboxSelected>>", self.switch_mode)

        # 得分和统计
        self.score_frame = tk.Frame(self.header_frame, bg=self.colors["bg"])
        self.score_frame.pack(side="right")

        self.score_label = tk.Label(self.score_frame, text="得分: 0/80", font=self.font_medium,
                                    bg=self.colors["bg"], fg=self.colors["fg"])
        self.score_label.pack(side="left", padx=(0, 10))

        self.remaining_label = tk.Label(self.score_frame, text="剩余: 80", font=self.font_medium,
                                        bg=self.colors["bg"], fg=self.colors["remaining_fg"])
        self.remaining_label.pack(side="left", padx=(0, 10))

        self.accuracy_label = tk.Label(self.score_frame, text="正确率: 0%", font=self.font_small,
                                       bg=self.colors["bg"], fg=self.colors["fg"])
        self.accuracy_label.pack(side="left")

        # 进度条
        self.progress = ttk.Progressbar(self.root, length=610, mode="determinate")
        self.progress.pack(padx=20, pady=10)

        # 单词和例句区域
        self.word_frame = tk.Frame(self.root, bg=self.colors["bg"])
        self.word_frame.pack(fill="x", padx=20, pady=20)

        # 右上角按钮区域（难词 + 斩词）
        self.top_right_frame = tk.Frame(self.word_frame, bg=self.colors["bg"])
        self.top_right_frame.pack(side="top", anchor="ne", pady=(0, 10))

        # 难词标记按钮
        self.hard_btn = tk.Button(self.top_right_frame, text="⭐", font=self.font_medium,
                                  width=2, command=self.toggle_hard_word)
        self.hard_btn.pack(side="left", padx=2)

        # 斩词按钮
        self.slash_btn = tk.Button(self.top_right_frame, text="🔪", font=self.font_medium,
                                   width=2, command=self.slash_word)
        self.slash_btn.pack(side="left", padx=2)

        self.word_label = tk.Label(self.word_frame, text="", font=self.font_large,
                                   wraplength=600, justify="center",
                                   bg=self.colors["bg"], fg=self.colors["fg"])
        self.word_label.pack()

        # 英文例句
        self.example_label = tk.Label(self.word_frame, text="", font=self.font_small,
                                      wraplength=600, justify="center",
                                      bg=self.colors["bg"], fg=self.colors["example_fg"])
        self.example_label.pack(pady=10)

        # 中文例句翻译（答对后显示）
        self.example_cn_label = tk.Label(self.word_frame, text="", font=self.font_small,
                                         wraplength=600, justify="center",
                                         bg=self.colors["bg"], fg=self.colors["example_fg"])
        self.example_cn_label.pack(pady=5)

        self.stage_label = tk.Label(self.word_frame, text="请选择中文解释:", font=self.font_medium,
                                    bg=self.colors["bg"], fg=self.colors["fg"])
        self.stage_label.pack(pady=10)

        # 选项区域
        self.options_frame = tk.Frame(self.root, bg=self.colors["bg"])
        self.options_frame.pack(fill="both", expand=True, padx=20, pady=10)

        self.option_buttons = []
        for i in range(4):
            btn = tk.Button(self.options_frame, text="", font=self.font_small,
                            width=40, height=2, command=lambda idx=i: self.select_option(idx),
                            bg=self.colors["btn_bg"], fg=self.colors["btn_fg"])
            btn.grid(row=i, column=0, pady=8)
            self.option_buttons.append(btn)

        # 底部导航按钮
        self.bottom_frame = tk.Frame(self.root, bg=self.colors["bg"])
        self.bottom_frame.pack(fill="x", padx=20, pady=10)

        # 底部常驻快捷键提示
        self.shortcut_label = tk.Label(self.bottom_frame, text="快捷键: 1-4选答案 | ←上一题 | →返回 | A收藏 | S斩",
                                       font=self.font_small, bg=self.colors["bg"], fg=self.colors["example_fg"])
        self.shortcut_label.pack(side="left", padx=20)

        self.time_label = tk.Label(self.bottom_frame, text="学习时长: 0分钟", font=self.font_small,
                                   bg=self.colors["bg"], fg=self.colors["fg"])
        self.time_label.pack(side="left")

        # 上一题和返回按钮
        self.prev_btn = tk.Button(self.bottom_frame, text="上一题 (←)", font=self.font_small,
                                  width=12, state="disabled", command=self.show_previous_question)
        self.prev_btn.pack(side="right", padx=5)

        self.return_btn = tk.Button(self.bottom_frame, text="返回 (→)", font=self.font_small,
                                    width=12, state="disabled", command=self.return_to_current_question)
        self.return_btn.pack(side="right", padx=5)

        # 启动学习时长更新
        self.update_time()

    def show_shortcuts(self):
        shortcut_text = """📌 完整快捷键列表

🎯 答题操作
  1 / 2 / 3 / 4  →  选择对应选项
  Enter / 空格   →  下一题

📜 历史回看
  ← 左箭头      →  查看上一题
  → 右箭头      →  返回当前题目

⭐ 收藏/难词
  A             →  标记/取消难词

🔪 斩词
  S             →  斩掉当前单词

💡 智能学习系统：
- 答错的单词会自动在后面重复出现
- 一次答对的单词也会在15题后巩固一次
- 连续答对2次才会永久移除
- 🔪 按钮可以斩掉本轮不想看到的词"""

        messagebox.showinfo("快捷键说明", shortcut_text)

    def bind_shortcuts(self):
        self.root.bind("1",
                       lambda e: self.select_option(0) if not self.is_viewing_history and self.is_answering else None)
        self.root.bind("2",
                       lambda e: self.select_option(1) if not self.is_viewing_history and self.is_answering else None)
        self.root.bind("3",
                       lambda e: self.select_option(2) if not self.is_viewing_history and self.is_answering else None)
        self.root.bind("4",
                       lambda e: self.select_option(3) if not self.is_viewing_history and self.is_answering else None)
        self.root.bind("<Return>", lambda
            e: self.manual_next_question() if not self.is_viewing_history and not self.is_answering else None)
        self.root.bind("<space>", lambda
            e: self.manual_next_question() if not self.is_viewing_history and not self.is_answering else None)
        self.root.bind("<Left>", lambda e: self.show_previous_question())
        self.root.bind("<Right>", lambda e: self.return_to_current_question())

        # ✅ 新增：A键收藏（难词），S键斩词
        self.root.bind("a", lambda e: self.toggle_hard_word() if not self.is_viewing_history else None)
        self.root.bind("A", lambda e: self.toggle_hard_word() if not self.is_viewing_history else None)
        self.root.bind("s", lambda e: self.slash_word() if not self.is_viewing_history else None)
        self.root.bind("S", lambda e: self.slash_word() if not self.is_viewing_history else None)

    def increase_font(self):
        self.font_size_large += 2
        self.font_size_medium += 1
        self.font_size_small += 1
        self.update_fonts()
        self.update_widgets_font()

    def decrease_font(self):
        if self.font_size_large > 16:
            self.font_size_large -= 2
            self.font_size_medium -= 1
            self.font_size_small -= 1
            self.update_fonts()
            self.update_widgets_font()

    def update_widgets_font(self):
        self.title_label.config(font=self.font_medium)
        self.score_label.config(font=self.font_medium)
        self.remaining_label.config(font=self.font_medium)
        self.word_label.config(font=self.font_large)
        self.example_label.config(font=self.font_small)
        self.example_cn_label.config(font=self.font_small)
        self.stage_label.config(font=self.font_medium)
        for btn in self.option_buttons:
            btn.config(font=self.font_small)
        self.time_label.config(font=self.font_small)
        self.accuracy_label.config(font=self.font_small)
        self.prev_btn.config(font=self.font_small)
        self.return_btn.config(font=self.font_small)
        self.shortcut_label.config(font=self.font_small)

    def toggle_night_mode(self):
        self.dark_mode = not self.dark_mode
        self.colors = self.dark_colors if self.dark_mode else self.light_colors

        self.root.config(bg=self.colors["bg"])
        self.toolbar_frame.config(bg=self.colors["bg"])
        self.header_frame.config(bg=self.colors["bg"])
        self.score_frame.config(bg=self.colors["bg"])
        self.word_frame.config(bg=self.colors["bg"])
        self.top_right_frame.config(bg=self.colors["bg"])
        self.options_frame.config(bg=self.colors["bg"])
        self.bottom_frame.config(bg=self.colors["bg"])

        self.title_label.config(bg=self.colors["bg"], fg=self.colors["fg"])
        self.score_label.config(bg=self.colors["bg"], fg=self.colors["fg"])
        self.remaining_label.config(bg=self.colors["bg"], fg=self.colors["remaining_fg"])
        self.accuracy_label.config(bg=self.colors["bg"], fg=self.colors["fg"])
        self.word_label.config(bg=self.colors["bg"], fg=self.colors["fg"])
        self.example_label.config(bg=self.colors["bg"], fg=self.colors["example_fg"])
        self.example_cn_label.config(bg=self.colors["bg"], fg=self.colors["example_fg"])
        self.stage_label.config(bg=self.colors["bg"], fg=self.colors["fg"])
        self.time_label.config(bg=self.colors["bg"], fg=self.colors["fg"])
        self.shortcut_label.config(bg=self.colors["bg"], fg=self.colors["example_fg"])

        for btn in self.option_buttons:
            btn.config(bg=self.colors["btn_bg"], fg=self.colors["btn_fg"])

        self.prev_btn.config(bg=self.colors["btn_bg"], fg=self.colors["btn_fg"])
        self.return_btn.config(bg=self.colors["btn_bg"], fg=self.colors["btn_fg"])

    def update_time(self):
        elapsed = int((time.time() - self.start_time) / 60)
        self.time_label.config(text=f"学习时长: {elapsed}分钟")
        self.root.after(60000, self.update_time)

    def show_wrong_book(self):
        """显示错题统计和已斩词"""
        stats_window = tk.Toplevel(self.root)
        stats_window.title("学习统计")
        stats_window.geometry("450x400")

        notebook = ttk.Notebook(stats_window)
        notebook.pack(fill="both", expand=True, padx=10, pady=10)

        # 错题统计标签页
        wrong_frame = tk.Frame(notebook)
        notebook.add(wrong_frame, text="错题统计")

        if not self.wrong_words:
            tk.Label(wrong_frame, text="你还没有答错过任何单词！", font=self.font_medium).pack(pady=20)
        else:
            sorted_wrong = sorted(self.wrong_words.items(), key=lambda x: x[1], reverse=True)
            total_wrong = len(self.wrong_words)
            total_mistakes = sum(self.wrong_words.values())

            header = f"总错题数: {total_wrong} | 总答错次数: {total_mistakes}\n"
            tk.Label(wrong_frame, text=header, font=self.font_small).pack(pady=5)

            text = tk.Text(wrong_frame, font=self.font_small, wrap="word")
            scroll = tk.Scrollbar(wrong_frame, command=text.yview)
            text.configure(yscrollcommand=scroll.set)

            for idx_str, count in sorted_wrong:
                idx = int(idx_str)
                word = vocabulary[idx]
                text.insert("end", f"{word['word']} - {word['chinese']} (答错{count}次)\n")

            text.config(state="disabled")
            scroll.pack(side="right", fill="y")
            text.pack(fill="both", expand=True)

        # 已斩词标签页
        slash_frame = tk.Frame(notebook)
        notebook.add(slash_frame, text="已斩词")

        if not self.slashed_words:
            tk.Label(slash_frame, text="本轮还没有斩掉任何单词！", font=self.font_medium).pack(pady=20)
        else:
            tk.Label(slash_frame, text=f"本轮已斩: {len(self.slashed_words)} 个单词", font=self.font_small).pack(pady=5)

            text = tk.Text(slash_frame, font=self.font_small, wrap="word")
            scroll = tk.Scrollbar(slash_frame, command=text.yview)
            text.configure(yscrollcommand=scroll.set)

            for idx in self.slashed_words:
                word = vocabulary[idx]
                text.insert("end", f"{word['word']} - {word['chinese']}\n")

            text.config(state="disabled")
            scroll.pack(side="right", fill="y")
            text.pack(fill="both", expand=True, padx=10, pady=5)

            # 恢复按钮
            def restore_all():
                if messagebox.askyesno("确认", "确定要恢复所有已斩词吗？"):
                    self.slashed_words.clear()
                    stats_window.destroy()
                    messagebox.showinfo("成功", "已恢复所有已斩词！")

            tk.Button(slash_frame, text="恢复所有已斩词", command=restore_all).pack(pady=10)

    def toggle_hard_word(self):
        if self.current_word_index is None:
            return

        if self.current_word_index in self.hard_words:
            self.hard_words.remove(self.current_word_index)
            self.hard_btn.config(text="⭐")
            messagebox.showinfo("提示", "已取消难词标记")
        else:
            self.hard_words.add(self.current_word_index)
            self.hard_btn.config(text="★")
            messagebox.showinfo("提示", "已标记为难词")

        self.save_progress()

    # 斩词功能
    def slash_word(self):
        if self.current_word_index is None:
            return

        if messagebox.askyesno("斩词确认", f"确定要斩掉「{self.current_word['word']}」吗？\n\n本轮将不再出现这个词。"):
            self.slashed_words.add(self.current_word_index)

            # 从所有队列中移除
            self.wrong_queue = [item for item in self.wrong_queue if item[0] != self.current_word_index]
            self.review_queue = [item for item in self.review_queue if item[0] != self.current_word_index]

            if self.current_word_index in self.unmastered_indices:
                self.unmastered_indices.remove(self.current_word_index)

            messagebox.showinfo("成功", f"已斩掉「{self.current_word['word']}」！")
            self.next_question()

    def switch_direction(self, event=None):
        selected_index = self.direction_combobox.current()
        if selected_index != self.test_direction:
            self.test_direction = selected_index
            if self.test_direction == 0:
                self.stage_label.config(text="请选择中文解释:")
            elif self.test_direction == 1:
                self.stage_label.config(text="请选择英文单词:")
            else:
                self.stage_label.config(text="请选择正确的单词填空:")
            self.history = []
            self.wrong_queue = []
            self.review_queue = []
            self.slashed_words.clear()
            self.question_counter = 0
            self.prev_btn.config(state="disabled")
            self.reset_and_start()

    def reset_and_start(self):
        available_indices = self.get_available_words()
        self.total_words = len(available_indices)
        self.mastered_indices = []
        self.unmastered_indices = available_indices.copy()
        self.wrong_queue = []
        self.review_queue = []
        self.slashed_words.clear()
        self.question_counter = 0
        self.history = []
        self.prev_btn.config(state="disabled")

        self.update_score_and_progress()
        self.next_question()

    def switch_mode(self, event=None):
        selected_index = self.mode_combobox.current()
        if selected_index != self.test_mode:
            self.test_mode = selected_index
            messagebox.showinfo("范围已切换", f"现在将测试{self.mode_names[self.test_mode]}单词")
            self.history = []
            self.wrong_queue = []
            self.review_queue = []
            self.slashed_words.clear()
            self.question_counter = 0
            self.prev_btn.config(state="disabled")
            self.reset_and_start()

    def get_available_words(self):
        if not vocabulary:
            return []

        total_len = len(vocabulary)
        if self.test_mode == 0:  # 全部
            return list(range(total_len))
        elif self.test_mode == 1:  # 前半部分（前40个）
            return list(range(total_len // 2))
        elif self.test_mode == 2:  # 后半部分（后40个）
            return list(range(total_len // 2, total_len))
        elif self.test_mode == 3:  # 只复习错题
            return [int(idx) for idx in self.wrong_words.keys()] if self.wrong_words else list(range(total_len))
        else:  # 只复习难词
            return list(self.hard_words) if self.hard_words else list(range(total_len))

    def get_random_options(self, correct_answer, option_type):
        if not vocabulary:
            return []

        all_unique_options = set()
        available_indices = self.get_available_words()
        for i in available_indices:
            if option_type == "chinese":
                all_unique_options.add(vocabulary[i]["chinese"])
            else:
                all_unique_options.add(vocabulary[i]["word"])

        all_unique_options.discard(correct_answer)
        wrong_options = random.sample(list(all_unique_options), min(3, len(all_unique_options)))

        if len(wrong_options) < 3:
            wrong_options += ["(其他选项)"] * (3 - len(wrong_options))

        options = wrong_options + [correct_answer]
        random.shuffle(options)

        return options

    def update_score_and_progress(self):
        self.score_label.config(text=f"得分: {len(self.mastered_indices)}/{self.total_words}")
        remaining = len(self.unmastered_indices) + len(self.wrong_queue) + len(self.review_queue)
        self.remaining_label.config(text=f"剩余: {remaining}")
        self.progress["value"] = (len(self.mastered_indices) / self.total_words) * 100 if self.total_words > 0 else 0

        if self.total_attempts > 0:
            accuracy = int((self.correct_attempts / self.total_attempts) * 100)
            self.accuracy_label.config(text=f"正确率: {accuracy}%")

    # 新增：手动触发下一题（用于Enter/空格）
    def manual_next_question(self):
        # 清除定时器
        if self.next_timeout:
            self.root.after_cancel(self.next_timeout)
            self.next_timeout = None
        # 立即跳转
        self.next_question()

    def next_question(self):
        # 修复Enter键重复跳转bug：清除之前的定时器
        if self.next_timeout:
            self.root.after_cancel(self.next_timeout)
            self.next_timeout = None

        if not vocabulary:
            messagebox.showwarning("提示", "单词表为空，请先添加新单词！")
            return

        # 如果所有单词都掌握了，重置
        if not self.unmastered_indices and not self.wrong_queue and not self.review_queue:
            messagebox.showinfo("🎉 全部掌握！",
                                f"太厉害了！你已经掌握了所有{self.mode_names[self.test_mode]}单词！\n"
                                f"满分：{self.total_words}/{self.total_words}\n"
                                f"将重新开始新一轮测试。")
            self.reset_and_start()
            return

        # 添加上一题到历史记录
        if self.current_word is not None and not self.is_viewing_history:
            self.history.append({
                "word": self.current_word["word"],
                "chinese": self.current_word["chinese"],
                "example": self.current_word["example"],
                "example_cn": self.current_word["example_cn"],
                "direction": self.test_direction,
                "options": self.current_options.copy(),
                "correct_index": self.correct_index
            })
            self.prev_btn.config(state="normal")

        # 题目计数器加1
        self.question_counter += 1

        # 优先检查错题队列
        next_word_index = None
        self.is_review_question = False  # 重置标记

        for i in range(len(self.wrong_queue)):
            idx, wrong_count, next_appear = self.wrong_queue[i]
            if self.question_counter >= next_appear and idx not in self.slashed_words:
                next_word_index = idx
                del self.wrong_queue[i]
                break

        # 然后检查巩固复习队列
        if next_word_index is None:
            for i in range(len(self.review_queue)):
                idx, next_appear = self.review_queue[i]
                if self.question_counter >= next_appear and idx not in self.slashed_words:
                    next_word_index = idx
                    del self.review_queue[i]
                    self.is_review_question = True  # 标记为复习题
                    break

        # 最后从新单词中抽取
        if next_word_index is None:
            # 过滤掉已斩词
            available = [idx for idx in self.unmastered_indices if idx not in self.slashed_words]
            if available:
                next_word_index = random.choice(available)
                self.unmastered_indices.remove(next_word_index)

        # 修复：如果还是没有，说明所有单词都在队列里但还没到时间
        # 这时候直接取出队列中最早出现的单词，不要触发斩词提示
        if next_word_index is None:
            # 合并两个队列，按nextAppear排序
            all_queued = [
                *[(item[0], item[2], 'wrong') for item in self.wrong_queue],
                *[(item[0], item[1], 'review') for item in self.review_queue]
            ]
            all_queued = [item for item in all_queued if item[0] not in self.slashed_words]

            if len(all_queued) > 0:
                # 取出最早出现的那个
                all_queued.sort(key=lambda x: x[1])
                earliest = all_queued[0]
                next_word_index = earliest[0]

                # 从原队列中删除
                if earliest[2] == 'wrong':
                    self.wrong_queue = [item for item in self.wrong_queue if item[0] != next_word_index]
                else:
                    self.review_queue = [item for item in self.review_queue if item[0] != next_word_index]
                    self.is_review_question = True
            else:
                # 真的没有单词了（所有都被斩了）
                messagebox.showinfo("提示", "所有单词都被斩掉了！已恢复所有已斩词。")
                self.slashed_words.clear()
                self.next_question()
                return

        self.current_word_index = next_word_index
        self.current_word = vocabulary[self.current_word_index]

        self.has_mistake = False
        self.is_answering = True

        self.hard_btn.config(text="★" if self.current_word_index in self.hard_words else "⭐")

        # 显示内容
        if self.test_direction == 0:
            self.word_label.config(text=self.current_word["word"])
            self.example_label.config(text=self.current_word["example"])
            self.current_options = self.get_random_options(self.current_word["chinese"], "chinese")
            self.correct_index = self.current_options.index(self.current_word["chinese"])
        elif self.test_direction == 1:
            self.word_label.config(text=self.current_word["chinese"])
            self.example_label.config(text="")
            self.current_options = self.get_random_options(self.current_word["word"], "english")
            self.correct_index = self.current_options.index(self.current_word["word"])
        else:
            blank_sentence = self.current_word["example"].replace(self.current_word["word"], "_____")
            self.word_label.config(text=blank_sentence)
            self.example_label.config(text="")
            self.current_options = self.get_random_options(self.current_word["word"], "english")
            self.correct_index = self.current_options.index(self.current_word["word"])

        self.example_cn_label.config(text="")

        # 修复颜色残留问题：完全重置所有按钮样式
        for i in range(4):
            self.option_buttons[i].config(text=self.current_options[i], state="normal", bg=self.colors["btn_bg"])

        self.update_score_and_progress()
        self.save_progress()

    def select_option(self, index):
        if not self.is_answering:
            return

        if index == self.correct_index:
            self.option_buttons[index].config(bg="#90EE90")
            self.is_answering = False
            for btn in self.option_buttons:
                btn.config(state="disabled")

            self.total_attempts += 1

            if self.test_direction != 1:
                self.example_cn_label.config(text=self.current_word["example_cn"])

            if not self.has_mistake:
                self.correct_attempts += 1

                # 修复无限循环bug：根据is_review_question标记处理
                if self.is_review_question:
                    # 如果是复习题，答对后直接加入已掌握
                    self.mastered_indices.append(self.current_word_index)
                else:
                    # 如果是新题，答对后加入巩固复习队列
                    next_appear = self.question_counter + 15
                    self.review_queue.append((self.current_word_index, next_appear))

            # 0.8秒后自动跳转
            self.next_timeout = self.root.after(800, self.next_question)
        else:
            self.option_buttons[index].config(bg="#FFB6C1", state="disabled")
            self.has_mistake = True
            self.total_attempts += 1

            idx_str = str(self.current_word_index)
            if idx_str in self.wrong_words:
                self.wrong_words[idx_str] += 1
            else:
                self.wrong_words[idx_str] = 1

            wrong_count = self.wrong_words[idx_str]
            if wrong_count == 1:
                interval = 5
            elif wrong_count == 2:
                interval = 10
            else:
                interval = 20

            next_appear = self.question_counter + interval

            found = False
            for i in range(len(self.wrong_queue)):
                if self.wrong_queue[i][0] == self.current_word_index:
                    self.wrong_queue[i] = (self.current_word_index, wrong_count, next_appear)
                    found = True
                    break

            if not found:
                self.wrong_queue.append((self.current_word_index, wrong_count, next_appear))

    def show_previous_question(self):
        if not self.history or self.is_viewing_history:
            return

        self.saved_current_state = {
            "word_index": self.current_word_index,
            "word": self.current_word,
            "options": self.current_options.copy(),
            "correct_index": self.correct_index,
            "has_mistake": self.has_mistake,
            "is_answering": self.is_answering,
            "button_states": [(btn["text"], btn["state"], btn["bg"]) for btn in self.option_buttons],
            "example_cn": self.example_cn_label["text"],
            "test_direction": self.test_direction,
            "is_review_question": self.is_review_question
        }

        self.is_viewing_history = True

        prev_question = self.history[-1]

        if prev_question["direction"] == 0:
            self.word_label.config(text=prev_question["word"])
            self.example_label.config(text=prev_question["example"])
        elif prev_question["direction"] == 1:
            self.word_label.config(text=prev_question["chinese"])
            self.example_label.config(text="")
        else:
            blank_sentence = prev_question["example"].replace(prev_question["word"], "_____")
            self.word_label.config(text=blank_sentence)
            self.example_label.config(text="")

        self.example_cn_label.config(text=prev_question["example_cn"])
        self.stage_label.config(text="上一题回顾：")

        for i in range(4):
            self.option_buttons[i].config(text=prev_question["options"][i], state="disabled")
            if i == prev_question["correct_index"]:
                self.option_buttons[i].config(bg="#90EE90")
            else:
                self.option_buttons[i].config(bg=self.colors["btn_bg"])

        self.prev_btn.config(state="disabled")
        self.return_btn.config(state="normal")

    def return_to_current_question(self):
        if not self.is_viewing_history or not self.saved_current_state:
            return

        self.current_word_index = self.saved_current_state["word_index"]
        self.current_word = self.saved_current_state["word"]
        self.current_options = self.saved_current_state["options"]
        self.correct_index = self.saved_current_state["correct_index"]
        self.has_mistake = self.saved_current_state["has_mistake"]
        self.is_answering = self.saved_current_state["is_answering"]
        current_test_direction = self.saved_current_state["test_direction"]
        self.is_review_question = self.saved_current_state["is_review_question"]

        if current_test_direction == 0:
            self.word_label.config(text=self.current_word["word"])
            self.example_label.config(text=self.current_word["example"])
        elif current_test_direction == 1:
            self.word_label.config(text=self.current_word["chinese"])
            self.example_label.config(text="")
        else:
            blank_sentence = self.current_word["example"].replace(self.current_word["word"], "_____")
            self.word_label.config(text=blank_sentence)
            self.example_label.config(text="")

        self.example_cn_label.config(text=self.saved_current_state["example_cn"])
        if current_test_direction == 0:
            self.stage_label.config(text="请选择中文解释:")
        elif current_test_direction == 1:
            self.stage_label.config(text="请选择英文单词:")
        else:
            self.stage_label.config(text="请选择正确的单词填空:")

        for i, (text, state, bg) in enumerate(self.saved_current_state["button_states"]):
            self.option_buttons[i].config(text=text, state=state, bg=bg)

        self.is_viewing_history = False
        self.saved_current_state = None

        self.return_btn.config(state="disabled")
        self.prev_btn.config(state="normal" if self.history else "disabled")

    def save_progress(self):
        config = {
            "mastered_indices": self.mastered_indices,
            "wrong_words": self.wrong_words,
            "hard_words": list(self.hard_words),
            "test_mode": self.test_mode,
            "test_direction": self.test_direction,
            "dark_mode": self.dark_mode,
            "font_size_large": self.font_size_large,
            "font_size_medium": self.font_size_medium,
            "font_size_small": self.font_size_small
        }

        try:
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(config, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"保存进度失败: {e}")

    def load_progress(self):
        if not os.path.exists(CONFIG_FILE):
            return

        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                config = json.load(f)

            self.mastered_indices = config.get("mastered_indices", [])
            self.wrong_words = config.get("wrong_words", {})
            self.hard_words = set(config.get("hard_words", []))
            self.test_mode = config.get("test_mode", 0)
            self.test_direction = config.get("test_direction", 0)
            self.dark_mode = config.get("dark_mode", False)
            self.font_size_large = config.get("font_size_large", 24)
            self.font_size_medium = config.get("font_size_medium", 14)
            self.font_size_small = config.get("font_size_small", 11)

            self.update_fonts()
            self.mode_var.set(self.mode_names[self.test_mode])
            self.direction_var.set(self.direction_names[self.test_direction])
            if self.test_direction == 0:
                self.stage_label.config(text="请选择中文解释:")
            elif self.test_direction == 1:
                self.stage_label.config(text="请选择英文单词:")
            else:
                self.stage_label.config(text="请选择正确的单词填空:")

            if self.dark_mode:
                self.toggle_night_mode()

        except Exception as e:
            print(f"加载进度失败: {e}")


if __name__ == "__main__":
    root = tk.Tk()
    app = VocabularyTestApp(root)
    root.mainloop()