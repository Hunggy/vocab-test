import tkinter as tk
from tkinter import ttk, messagebox
import random
import json
import time
import os

# ========== 词汇组定义 ==========
groups_0509 = [
    {"id": 81, "a": "evoke", "b": "elicit", "ch": "唤起", "ex": "The smell of fresh bread evokes happy memories of my grandmother's kitchen.", "cn": "新鮮麵包的香味喚起了我對祖母廚房的美好回憶。"},
    {"id": 82, "a": "exacerbate", "b": "worsen", "ch": "恶化", "ex": "Rubbing a mosquito bite will only exacerbate the itching.", "cn": "抓撓蚊子包只會讓痕癢惡化。"},
    {"id": 83, "a": "exemplify", "b": "illustrate", "ch": "举例说明", "ex": "This simple recipe exemplifies how easy it is to cook healthy food.", "cn": "這個簡單的食譜例說明了烹飪健康食品是多麼容易。"},
    {"id": 84, "a": "exploit", "b": "utilize", "ch": "利用", "ex": "We should exploit solar energy to save electricity.", "cn": "我們應該利用太陽能來節省電力。"},
    {"id": 85, "a": "facilitate", "b": "ease", "ch": "促进", "ex": "The new app will facilitate communication between teachers and parents.", "cn": "這個新的應用程式將促進老師和家長之間的溝通。"},
    {"id": 86, "a": "falter", "b": "hesitate", "ch": "犹豫", "ex": "He started to falter when asked a difficult question during the interview.", "cn": "面試中被問到一個難題時，他開始猶豫起來。"},
    {"id": 87, "a": "feasible", "b": "viable", "ch": "可行的", "ex": "It's not feasible to finish this entire project in one day.", "cn": "在一天內完成整個項目是不可行的。"},
    {"id": 88, "a": "finite", "b": "limited", "ch": "有限的", "ex": "The Earth has finite resources, so we need to recycle.", "cn": "地球的資源是有限的，所以我們需要回收利用。"},
    {"id": 89, "a": "fluctuate", "b": "vary", "ch": "波动", "ex": "The temperature can fluctuate greatly between day and night in the desert.", "cn": "在沙漠裡，白天和晚上的氣溫會波動很大。"},
    {"id": 90, "a": "formidable", "b": "challenging", "ch": "令人敬畏的", "ex": "Passing the final exam seemed like a formidable task.", "cn": "通過期末考試似乎是一項令人敬畏的任務。"},
    {"id": 91, "a": "foster", "b": "nurture", "ch": "培养", "ex": "Reading books can foster a child's imagination.", "cn": "閱讀書籍可以培養孩子的想像力。"},
    {"id": 92, "a": "fraudulent", "b": "deceptive", "ch": "欺诈的", "ex": "The company was accused of making fraudulent claims about their products.", "cn": "該公司被指控對其產品作出欺詐性的聲明。"},
    {"id": 93, "a": "futile", "b": "fruitless", "ch": "徒劳的", "ex": "It was futile to try and open the door; it was locked tight.", "cn": "試圖打開那扇門是徒勞的，它鎖得很緊。"},
    {"id": 94, "a": "gauge", "b": "measure", "ch": "测量", "ex": "It's hard to gauge how people will react to the news.", "cn": "很難估量人們對這個消息會有何反應。"},
    {"id": 95, "a": "generate", "b": "produce", "ch": "产生", "ex": "Wind turbines generate electricity.", "cn": "風力渦輪機產生電力。"},
    {"id": 96, "a": "genuine", "b": "authentic", "ch": "真正的", "ex": "Is that a genuine diamond or is it fake?", "cn": "那是真正的鑽石還是假的？"},
    {"id": 97, "a": "grasp", "b": "comprehend", "ch": "理解", "ex": "The concept was too difficult for me to grasp at first.", "cn": "這個概念太難了，我一開始無法理解。"},
    {"id": 98, "a": "hinder", "b": "impede", "ch": "阻碍", "ex": "Bad weather can hinder the progress of a construction project.", "cn": "惡劣的天氣會阻礙建築項目的進度。"},
    {"id": 99, "a": "immerse", "b": "engross", "ch": "沉浸", "ex": "When I read a good book, I like to immerse myself completely in the story.", "cn": "我讀一本好書時，喜歡讓自己完全沉浸在故事中。"},
    {"id": 100, "a": "impair", "b": "damage", "ch": "损害", "ex": "Drinking too much soda can impair your teeth.", "cn": "喝太多汽水會損害你的牙齒。"},
    {"id": 101, "a": "imperative", "b": "crucial", "ch": "紧要的", "ex": "It is imperative to wear a seatbelt when driving.", "cn": "開車時繫安全帶是必要的。"},
    {"id": 102, "a": "implement", "b": "execute", "ch": "实施", "ex": "The school will implement a new homework policy next week.", "cn": "學校下週將實施新的作業政策。"},
    {"id": 103, "a": "implicate", "b": "involve", "ch": "涉及", "ex": "His testimony implicated his friend in the prank.", "cn": "他的證詞顯示他的朋友涉及了那個惡作劇。"},
    {"id": 104, "a": "implicit", "b": "implied", "ch": "隐含的", "ex": "There was an implicit trust between the old friends.", "cn": "老友之間存在著一種不言而喻的信任。"},
    {"id": 105, "a": "impose", "b": "enforce", "ch": "强加", "ex": "My parents don't impose too many rules on me.", "cn": "我父母沒有強加太多規矩在我身上。"},
    {"id": 106, "a": "incentive", "b": "motivation", "ch": "动机", "ex": "The bonus was a great incentive for the team to work harder.", "cn": "獎金是激勵團隊更努力工作的好誘因。"},
    {"id": 107, "a": "incidental", "b": "secondary", "ch": "附带的", "ex": "Finding a $5 bill in my pocket was incidental to doing laundry.", "cn": "在口袋裡找到五塊錢是洗衣服的意外收穫。"},
    {"id": 108, "a": "incorporate", "b": "integrate", "ch": "合并", "ex": "Let's incorporate your ideas into the party plan.", "cn": "把我們的想法納入派對計畫吧。"},
    {"id": 109, "a": "indigenous", "b": "native", "ch": "土著的", "ex": "The kiwi is an indigenous bird of New Zealand.", "cn": "奇異鳥是紐西蘭的本土鳥類。"},
    {"id": 110, "a": "induce", "b": "provoke", "ch": "引发", "ex": "This medicine might induce sleepiness, so don't drive after taking it.", "cn": "這種藥可能會引起嗜睡，所以服用後不要開車。"},
    {"id": 111, "a": "infer", "b": "deduce", "ch": "推断", "ex": "From his sad face, I inferred that he failed the test.", "cn": "從他悲傷的臉，我推斷他考試沒通過。"},
    {"id": 112, "a": "ingenious", "b": "innovative", "ch": "巧妙的", "ex": "What an ingenious way to reuse plastic bottles!", "cn": "這真是個再利用塑膠瓶的巧妙方法！"},
    {"id": 113, "a": "inherent", "b": "intrinsic", "ch": "固有的", "ex": "There is an inherent risk in every adventure sport.", "cn": "每一種極限運動都有其固有的風險。"},
    {"id": 114, "a": "inhibit", "b": "restrain", "ch": "抑制", "ex": "His fear of water inhibited him from learning to swim.", "cn": "他對水的恐懼抑制了他學習游泳。"},
    {"id": 115, "a": "initiate", "b": "commence", "ch": "开始", "ex": "They will initiate the construction project next month.", "cn": "他們將在下個月啟動這個建設計畫。"},
    {"id": 116, "a": "innovate", "b": "pioneer", "ch": "创新", "ex": "Companies must innovate to stay competitive.", "cn": "公司必須創新才能保持競爭力。"},
    {"id": 117, "a": "inquiry", "b": "investigation", "ch": "调查", "ex": "The store manager is making an inquiry about the missing item.", "cn": "商店經理正在調查遺失的商品。"},
    {"id": 118, "a": "insight", "b": "understanding", "ch": "洞察力", "ex": "The article gives great insight into Japanese culture.", "cn": "這篇文章對日本文化提供了深刻的見解。"},
    {"id": 119, "a": "integral", "b": "essential", "ch": "不可或缺的", "ex": "Teamwork is an integral part of this class.", "cn": "團隊合作是這堂課不可或缺的一部分。"},
    {"id": 120, "a": "integrity", "b": "honesty", "ch": "正直", "ex": "I admire her for her integrity and kindness.", "cn": "我欽佩她的正直和善良。"}
]

# 以下批次定义与HTML一致，由于篇幅限制，此处省略完整代码，实际使用时请将HTML中的groups_0516、0523等全部复制过来。
# 请将您之前HTML中的 groups0516、groups0523、groups0530、groups0606、groups0620 复制到下面继续定义。

groups_0516 = [
    {"id":121, "a":"intricate", "b":"complex", "ch":"複雜的", "ex":"This puzzle is too intricate for a five-year-old child.", "cn":"這個拼圖對一個五歲小孩來說太複雜了。"},
    {"id":122, "a":"invoke", "b":"evoke", "ch":"喚起", "ex":"The smell of the ocean invokes happy memories of our family vacation.", "cn":"海洋的氣味喚起了我們家庭旅行的快樂回憶。"},
    {"id":123, "a":"irreparable", "b":"irreversible", "ch":"無法挽回的", "ex":"Lying to her caused irreparable damage to their friendship.", "cn":"對她說謊對他們的友誼造成了無法挽回的傷害。"},
    {"id":124, "a":"isolated", "b":"secluded", "ch":"孤立的", "ex":"The small village was isolated by the heavy snow for three days.", "cn":"那個小村莊被大雪孤立了三天。"},
    {"id":125, "a":"jeopardize", "b":"endanger", "ch":"危害", "ex":"If you don't study, you could jeopardize your chances of getting into college.", "cn":"如果你不學習，可能會危害你上大學的機會。"},
    {"id":126, "a":"keen", "b":"eager", "ch":"渴望的", "ex":"She is keen to learn how to play the guitar.", "cn":"她渴望學習如何彈吉他。"},
    {"id":127, "a":"legitimate", "b":"valid", "ch":"合法的", "ex":"Do you have a legitimate reason for being late again?", "cn":"你再次遲到有正當的理由嗎？"},
    {"id":128, "a":"magnify", "b":"amplify", "ch":"放大", "ex":"You can use a microscope to magnify tiny cells.", "cn":"你可以用顯微鏡來放大微小的細胞。"},
    {"id":129, "a":"manifest", "b":"demonstrate", "ch":"顯示", "ex":"His happiness manifested in his big smile.", "cn":"他的快樂從他燦爛的笑容中顯示出來。"},
    {"id":130, "a":"manipulate", "b":"exploit", "ch":"操縱", "ex":"The child tried to manipulate his parents into buying him a toy.", "cn":"那個孩子試圖操縱他的父母給他買玩具。"},
    {"id":131, "a":"marginal", "b":"negligible", "ch":"微不足道的", "ex":"There was only a marginal difference between the two test scores.", "cn":"兩個考試分數之間只有微不足道的差別。"},
    {"id":132, "a":"mediate", "b":"intervene", "ch":"調解", "ex":"A friend has to mediate the argument between the two brothers.", "cn":"一位朋友必須調解那兩兄弟之間的爭論。"},
    {"id":133, "a":"merge", "b":"amalgamate", "ch":"合併", "ex":"The two small companies plan to merge next year.", "cn":"這兩家小公司計劃明年合併。"},
    {"id":134, "a":"methodical", "b":"systematic", "ch":"有條理的", "ex":"She is very methodical and always cleans her room in a specific order.", "cn":"她非常有條理，總是按特定順序打掃房間。"},
    {"id":135, "a":"mitigate", "b":"alleviate", "ch":"緩解", "ex":"Drinking cold water can help mitigate the heat on a hot day.", "cn":"喝冷水可以幫助緩解大熱天的炎熱。"},
    {"id":136, "a":"mobilize", "b":"assemble", "ch":"動員", "ex":"The community mobilized to help the family whose house burned down.", "cn":"社區動員起來幫助那個房子被燒燬的家庭。"},
    {"id":137, "a":"modify", "b":"alter", "ch":"修改", "ex":"I need to modify my schedule to fit in an extra class.", "cn":"我需要修改我的時間表來安排多一堂課。"},
    {"id":138, "a":"monitor", "b":"supervise", "ch":"監控", "ex":"The teacher will monitor the students during the exam.", "cn":"老師會在考試期間監控學生。"},
    {"id":139, "a":"mundane", "b":"ordinary", "ch":"平凡的", "ex":"After the exciting weekend, Monday felt very mundane.", "cn":"經過興奮的週末後，星期一感覺非常平凡。"},
    {"id":140, "a":"negate", "b":"nullify", "ch":"取消", "ex":"One mistake should not negate all your hard work.", "cn":"一個錯誤不應該取消你所有的努力。"},
    {"id":141, "a":"negligible", "b":"insignificant", "ch":"微不足道的", "ex":"The cost of adding extra sugar to your coffee is negligible.", "cn":"在咖啡裡多加糖的成本是微不足道的。"},
    {"id":142, "a":"novel", "b":"innovative", "ch":"新穎的", "ex":"The chef created a novel dish using chocolate and chilli.", "cn":"那位廚師用巧克力和辣椒創作了一道新穎的菜餚。"},
    {"id":143, "a":"nurture", "b":"cultivate", "ch":"培養", "ex":"Parents should nurture their children's curiosity.", "cn":"父母應該培養孩子的好奇心。"},
    {"id":144, "a":"obsolete", "b":"outdated", "ch":"過時的", "ex":"Cassette tapes are now obsolete technology.", "cn":"卡式錄音帶現在已經是過時的科技了。"},
    {"id":145, "a":"ominous", "b":"threatening", "ch":"不祥的", "ex":"The sky looked dark and ominous before the storm.", "cn":"暴風雨來臨前，天空看起來漆黑而不祥。"},
    {"id":146, "a":"opportune", "b":"timely", "ch":"合適的", "ex":"The rain stopped at an opportune moment, just as we were leaving.", "cn":"雨在合適的時刻停了，正好我們要出發。"},
    {"id":147, "a":"opt", "b":"choose", "ch":"選擇", "ex":"I think I'll opt for the salad instead of the fries.", "cn":"我想我會選擇沙拉而不是薯條。"},
    {"id":148, "a":"optimize", "b":"maximize", "ch":"優化", "ex":"You can optimize your phone's battery life by closing unused apps.", "cn":"你可以透過關閉未使用的應用程式來優化手機的電池續航力。"},
    {"id":149, "a":"orient", "b":"align", "ch":"定位", "ex":"It takes time for new students to orient themselves to the school campus.", "cn":"新生需要時間來熟悉校園環境。"},
    {"id":150, "a":"overshadow", "b":"dominate", "ch":"使黯然失色", "ex":"My sister's achievements often overshadow my own.", "cn":"我姐姐的成就經常使我的成就黯然失色。"},
    {"id":151, "a":"paradox", "b":"contradiction", "ch":"悖論", "ex":"It's a paradox that you need experience to get a job, but you need a job to get experience.", "cn":"你需要經驗才能找到工作，但你需要工作才能獲得經驗，這是個悖論。"},
    {"id":152, "a":"paramount", "b":"supreme", "ch":"至高無上的", "ex":"When hiking in the mountains, safety is paramount.", "cn":"在山裡遠足時，安全是至高無上的。"},
    {"id":153, "a":"perceive", "b":"discern", "ch":"察覺", "ex":"I perceived a note of sadness in her voice.", "cn":"我察覺到她聲音中帶有一絲悲傷。"},
    {"id":154, "a":"perceptive", "b":"insightful", "ch":"有洞察力的", "ex":"That was a very perceptive comment about the movie's meaning.", "cn":"那是對電影含義非常有洞察力的評論。"},
    {"id":155, "a":"perilous", "b":"hazardous", "ch":"危險的", "ex":"The road was icy and driving was perilous.", "cn":"路面結冰了，開車很危險。"},
    {"id":156, "a":"permeate", "b":"penetrate", "ch":"滲透", "ex":"The smell of coffee permeated the entire kitchen.", "cn":"咖啡的香味滲透了整個廚房。"},
    {"id":157, "a":"persistent", "b":"tenacious", "ch":"堅持不懈的", "ex":"She was persistent in her efforts to learn English.", "cn":"她在學習英語的努力上堅持不懈。"},
    {"id":158, "a":"pivotal", "b":"crucial", "ch":"關鍵的", "ex":"This meeting will be pivotal for the future of the company.", "cn":"這次會議對公司的未來將是關鍵的。"},
    {"id":159, "a":"plausible", "b":"credible", "ch":"看似合理的", "ex":"His excuse for being late sounds plausible, but I'm not sure I believe it.", "cn":"他遲到的藉口聽起來看似合理，但我不確定我相信。"},
    {"id":160, "a":"plummet", "b":"plunge", "ch":"驟降", "ex":"The temperature plummeted when the sun went down.", "cn":"太陽下山後氣溫驟降。"}
]  # 需完整粘贴
groups_0523 = [
        {"id":161, "a":"ponder", "b":"contemplate", "ch":"思考", "ex":"I need to ponder this problem before answering.", "cn":"我需要思考這個問題然後再回答。"},
        {"id":162, "a":"potent", "b":"powerful", "ch":"强大的", "ex":"The speaker's words were potent and moved everyone.", "cn":"演講者的話語非常強大的，感動了每個人。"},
        {"id":163, "a":"precede", "b":"come before", "ch":"在... 之前", "ex":"The calm weather will precede the storm.", "cn":"平靜的天氣將會在暴風雨來臨之前。"},
        {"id":164, "a":"precise", "b":"exact", "ch":"精確的", "ex":"Please give me the precise location of the restaurant.", "cn":"請給我餐廳的精確的位置。"},
        {"id":165, "a":"predominant", "b":"dominant", "ch":"佔主導地位的", "ex":"Her opinion was the predominant one in the meeting.", "cn":"她的意見是會議中最主導的。"},
        {"id":166, "a":"prescribe", "b":"recommend", "ch":"規定", "ex":"The instructions prescribe a specific way to assemble it.", "cn":"說明書規定了特定的組裝方式。"},
        {"id":167, "a":"prevalent", "b":"widespread", "ch":"普遍的", "ex":"This custom is prevalent in rural areas.", "cn":"這個習俗在農村地區非常普遍的。"},
        {"id":168, "a":"profound", "b":"deep", "ch":"深刻的", "ex":"His advice had a profound impact on my life.", "cn":"他的建議對我的人生產生了深刻的影響。"},
        {"id":169, "a":"proliferate", "b":"multiply", "ch":"激增", "ex":"Fast food chains proliferate across the city.", "cn":"連鎖快餐店在全市範圍內激增。"},
        {"id":170, "a":"prominent", "b":"notable", "ch":"顯著的", "ex":"He played a prominent role in the project.", "cn":"他在這個項目中扮演了顯著的角色。"},
        {"id":171, "a":"propagate", "b":"spread", "ch":"傳播", "ex":"Their job is to propagate information about health.", "cn":"他們的工作是傳播有關健康的資訊。"},
        {"id":172, "a":"prospect", "b":"possibility", "ch":"前景", "ex":"The prospect of rain worries us.", "cn":"下雨的前景令我們擔心。"},
        {"id":173, "a":"provoke", "b":"incite", "ch":"激起", "ex":"His speech might provoke strong emotions.", "cn":"他的演講可能會激起強烈的情緒。"},
        {"id":174, "a":"prudent", "b":"cautious", "ch":"謹慎的", "ex":"It's prudent to check the weather before traveling.", "cn":"旅行前查看天氣是謹慎的做法。"},
        {"id":175, "a":"pursue", "b":"seek", "ch":"追求", "ex":"She wants to pursue higher education abroad.", "cn":"她想出國追求高等教育。"},
        {"id":176, "a":"quandary", "b":"dilemma", "ch":"困惑", "ex":"We are in a quandary about where to go.", "cn":"我們對於去哪裡感到困惑。"},
        {"id":177, "a":"quest", "b":"search", "ch":"探索", "ex":"Their quest for knowledge never ends.", "cn":"他們對知識的探索永無止境。"},
        {"id":178, "a":"radical", "b":"drastic", "ch":"激進的", "ex":"Moving to a new country is a radical change.", "cn":"搬到一個新國家是一個激進的改變。"},
        {"id":179, "a":"rationale", "b":"justification", "ch":"基本原理", "ex":"Can you explain the rationale behind your choice?", "cn":"你能解釋一下你選擇背後的基本原理嗎？"},
        {"id":180, "a":"readily", "b":"easily", "ch":"容易地", "ex":"This tool can be readily found in any store.", "cn":"這個工具在任何商店都可以容易地找到。"},
        {"id":181, "a":"rebuke", "b":"reprimand", "ch":"指責", "ex":"The teacher had to rebuke the noisy students.", "cn":"老師不得不指責吵鬧的學生。"},
        {"id":182, "a":"reciprocal", "b":"mutual", "ch":"互惠的", "ex":"They have a reciprocal arrangement to help each other.", "cn":"他們有一個互相幫助的互惠的安排。"},
        {"id":183, "a":"reconcile", "b":"harmonize", "ch":"調和", "ex":"It's hard to reconcile work and family time.", "cn":"很難調和工作與家庭時間。"},
        {"id":184, "a":"rectify", "b":"remedy", "ch":"糾正", "ex":"Please rectify the mistake in this form.", "cn":"請糾正這份表格上的錯誤。"},
        {"id":185, "a":"refute", "b":"debunk", "ch":"駁斥", "ex":"He provided evidence to refute the claim.", "cn":"他提供證據來駁斥這個說法。"},
        {"id":186, "a":"relentless", "b":"persistent", "ch":"不懈的", "ex":"Her relentless effort helped her win the race.", "cn":"她不懈的努力幫助她贏得了比賽。"},
        {"id":187, "a":"relevant", "b":"pertinent", "ch":"相關的", "ex":"Please ask questions that are relevant to the topic.", "cn":"請提出與主題相關的問題。"},
        {"id":188, "a":"relinquish", "b":"abandon", "ch":"放棄", "ex":"He had to relinquish his position as captain.", "cn":"他不得不放棄隊長的職位。"},
        {"id":189, "a":"remarkable", "b":"notable", "ch":"非凡的", "ex":"She has a remarkable talent for painting.", "cn":"她有繪畫的非凡的天賦。"},
        {"id":190, "a":"remorse", "b":"regret", "ch":"懊悔", "ex":"He felt deep remorse for lying to his friend.", "cn":"他對向朋友撒謊深感懊悔。"},
        {"id":191, "a":"render", "b":"make", "ch":"使成為", "ex":"The virus can render your computer useless.", "cn":"病毒可以使你的電腦無法使用。"},
        {"id":192, "a":"renowned", "b":"famous", "ch":"著名的", "ex":"This restaurant is renowned for its delicious pasta.", "cn":"這家餐廳以其美味的意大利麵而著名的。"},
        {"id":193, "a":"repudiate", "b":"reject", "ch":"拒絕", "ex":"The company repudiate any responsibility for the accident.", "cn":"公司拒絕承擔事故的任何責任。"},
        {"id":194, "a":"resilient", "b":"durable", "ch":"有彈性的", "ex":"Children are often very resilient after setbacks.", "cn":"孩子在遭遇挫折後往往非常有彈性的。"},
        {"id":195, "a":"respective", "b":"individual", "ch":"各自的", "ex":"After class, they went to their respective homes.", "cn":"下課後，他們回到了各自的家。"},
        {"id":196, "a":"restrain", "b":"curtail", "ch":"抑制", "ex":"He had to restrain his anger during the argument.", "cn":"在爭論中，他不得不抑制自己的怒氣。"},
        {"id":197, "a":"retrieve", "b":"recover", "ch":"取回", "ex":"I need to retrieve my keys from the car.", "cn":"我需要從車裡取回我的鑰匙。"},
        {"id":198, "a":"robust", "b":"strong", "ch":"健壯的", "ex":"My grandfather is still robust at 80 years old.", "cn":"我的祖父 80 歲高齡仍然十分健壯的。"},
        {"id":199, "a":"scrutinize", "b":"examine", "ch":"仔細檢查", "ex":"The boss will scrutinize every detail of the report.", "cn":"老闆會仔細檢查報告的每一個細節。"},
        {"id":200, "a":"secure", "b":"obtain", "ch":"獲得", "ex":"She managed to secure a ticket for the concert.", "cn":"她成功獲得了一張演唱會門票。"}]  # 需完整粘贴
groups_0530 = [
    {"id":201, "a":"segregate", "b":"separate", "ch":"隔離", "ex":"Schools should not segregate students by ability.", "cn":"學校不應該按能力隔離學生。"},
        {"id":202, "a":"sensational", "b":"extraordinary", "ch":"聳人聽聞的", "ex":"The news report was full of sensational stories.", "cn":"那篇新聞報道充滿了聳人聽聞的故事。"},
        {"id":203, "a":"signify", "b":"indicate", "ch":"表示", "ex":"A red sky at night often signify good weather the next day.", "cn":"晚上天邊發紅常常表示第二天天氣晴朗。"},
        {"id":204, "a":"simulate", "b":"imitate", "ch":"模擬", "ex":"The computer can simulate driving conditions.", "cn":"這台電腦可以模擬駕駛環境。"},
        {"id":205, "a":"skeptic", "b":"doubter", "ch":"懷疑論者", "ex":"My father is a skeptic about modern technology.", "cn":"我父親是現代科技的懷疑論者。"},
        {"id":206, "a":"sparse", "b":"scarce", "ch":"稀疏的", "ex":"The population in the desert is sparse.", "cn":"沙漠裡的人口是稀疏的。"},
        {"id":207, "a":"speculate", "b":"conjecture", "ch":"推測", "ex":"We can only speculate about what will happen next.", "cn":"我們只能推測接下來會發生什麼。"},
        {"id":208, "a":"sporadic", "b":"intermittent", "ch":"零星的", "ex":"There has been sporadic rain throughout the day.", "cn":"一整天都有零星的降雨。"},
        {"id":209, "a":"stagnant", "b":"dormant", "ch":"停滯的", "ex":"When I'm sick, my mind feels stagnant.", "cn":"我生病的時候，思維感到停滯的。"},
        {"id":210, "a":"stark", "b":"harsh", "ch":"嚴酷的", "ex":"The reality of poverty is stark and sad.", "cn":"貧窮的現實是嚴酷的和悲傷的。"},
        {"id":211, "a":"stimulate", "b":"provoke", "ch":"刺激", "ex":"Bright colors can stimulate a baby's interest.", "cn":"鮮豔的顏色可以刺激嬰兒的興趣。"},
        {"id":212, "a":"straightforward", "b":"direct", "ch":"直接的", "ex":"The instructions are clear and straightforward.", "cn":"說明書清晰且直接的。"},
        {"id":213, "a":"strenuous", "b":"demanding", "ch":"費力的", "ex":"Climbing the mountain is a strenuous activity.", "cn":"爬那座山是一項費力的活動。"},
        {"id":214, "a":"subsequent", "b":"following", "ch":"隨後的", "ex":"The first test was easy, but the subsequent ones were hard.", "cn":"第一次測驗很簡單，但隨後的幾次很難。"},
        {"id":215, "a":"substantial", "b":"significant", "ch":"大量的", "ex":"He received a substantial amount of money.", "cn":"他收到了一筆大量的錢。"},
        {"id":216, "a":"substitute", "b":"replace", "ch":"替代", "ex":"You can substitute honey for sugar in this recipe.", "cn":"在這個食譜中，你可以用蜂蜜替代糖。"},
        {"id":217, "a":"subtle", "b":"nuanced", "ch":"微妙的", "ex":"There is a subtle difference between the two colors.", "cn":"這兩種顏色之間有一個微妙的差異。"},
        {"id":218, "a":"surpass", "b":"exceed", "ch":"超越", "ex":"His grades will soon surpass everyone else's.", "cn":"他的成績很快會超越其他所有人。"},
        {"id":219, "a":"sustain", "b":"maintain", "ch":"維持", "ex":"We need food and water to sustain life.", "cn":"我們需要食物和水來維持生命。"},
        {"id":220, "a":"swift", "b":"rapid", "ch":"迅速的", "ex":"She received a swift reply to her email.", "cn":"她的電子郵件得到了迅速的回覆。"},
        {"id":221, "a":"symphony", "b":"orchestral music", "ch":"交響樂", "ex":"We went to hear a beautiful symphony last night.", "cn":"昨晚我們去聽了一場美妙的交響樂。"},
        {"id":222, "a":"synonymous", "b":"equivalent", "ch":"同義的", "ex":"His name is synonymous with success in business.", "cn":"他的名字在商業領域是成功的同義的。"},
        {"id":223, "a":"tangible", "b":"concrete", "ch":"可觸摸的", "ex":"The trophy is a tangible reward for his hard work.", "cn":"獎盃是他辛勤工作的可觸摸的回報。"},
        {"id":224, "a":"tedious", "b":"monotonous", "ch":"單調乏味的", "ex":"Copying numbers all day is a tedious job.", "cn":"整天抄寫號碼是一份單調乏味的工作。"},
        {"id":225, "a":"temperate", "b":"moderate", "ch":"溫和的", "ex":"The city has a temperate climate, not too hot or cold.", "cn":"這個城市氣候溫和的，不太熱也不太冷。"},
        {"id":226, "a":"tentative", "b":"provisional", "ch":"暫時的", "ex":"We made a tentative plan to meet on Sunday.", "cn":"我們做了一個星期天見面的暫時的計劃。"},
        {"id":227, "a":"thorough", "b":"comprehensive", "ch":"徹底的", "ex":"The mechanic gave the car a thorough inspection.", "cn":"技師對汽車進行了徹底的檢查。"},
        {"id":228, "a":"thrive", "b":"prosper", "ch":"繁榮", "ex":"Plants thrive in warm sunlight.", "cn":"植物在溫暖的陽光下生長繁榮。"},
        {"id":229, "a":"tolerate", "b":"endure", "ch":"忍受", "ex":"I cannot tolerate loud noise while I'm studying.", "cn":"我學習時無法忍受巨大的噪音。"},
        {"id":230, "a":"transcend", "b":"surpass", "ch":"超越", "ex":"Great art can transcend cultural boundaries.", "cn":"偉大的藝術可以超越文化界限。"},
        {"id":231, "a":"transform", "b":"convert", "ch":"轉變", "ex":"A fresh coat of paint can transform an old room.", "cn":"一層新油漆可以轉變一個舊房間。"},
        {"id":232, "a":"transparent", "b":"clear", "ch":"透明的", "ex":"The glass is completely transparent.", "cn":"這玻璃是完全透明的。"},
        {"id":233, "a":"treacherous", "b":"deceitful", "ch":"奸詐的", "ex":"The treacherous man lied to everyone he met.", "cn":"那個奸詐的人對他遇到的每個人都說謊。"},
        {"id":234, "a":"triumph", "b":"victory", "ch":"勝利", "ex":"Winning the championship was a great triumph.", "cn":"贏得冠軍是一個偉大的勝利。"},
        {"id":235, "a":"turbulent", "b":"chaotic", "ch":"動蕩的", "ex":"The plane flew through turbulent air.", "cn":"飛機飛過了動蕩的氣流。"},
        {"id":236, "a":"ultimate", "b":"final", "ch":"最終的", "ex":"His ultimate goal is to become a doctor.", "cn":"他的最終的目標是成為一名醫生。"},
        {"id":237, "a":"undermine", "b":"weaken", "ch":"削弱", "ex":"Lack of sleep can undermine your health.", "cn":"缺乏睡眠會削弱你的健康。"},
        {"id":238, "a":"underscore", "b":"emphasize", "ch":"強調", "ex":"I want to underscore the importance of practice.", "cn":"我想強調練習的重要性。"},
        {"id":239, "a":"unify", "b":"integrate", "ch":"統一", "ex":"The new leader hopes to unify the country.", "cn":"新領導人希望統一這個國家。"},
        {"id":240, "a":"unique", "b":"distinct", "ch":"獨特的", "ex":"Everyone's fingerprint is unique.", "cn":"每個人的指紋都是獨特的。"}
]  # 需完整粘贴
groups_0606 = [
        {"id":241, "a":"unravel", "b":"solve", "ch":"解開", "ex":"I need to unravel this knot in my shoelace.", "cn":"我需要解開鞋帶上的這個結。"},
        {"id":242, "a":"unprecedented", "b":"unparalleled", "ch":"空前的", "ex":"The popularity of the game is unprecedented.", "cn":"這個遊戲的受歡迎程度是空前的。"},
        {"id":243, "a":"uphold", "b":"support", "ch":"支持", "ex":"Judges must uphold the law.", "cn":"法官必須支持法律。"},
        {"id":244, "a":"urge", "b":"encourage", "ch":"敦促", "ex":"I urge you to finish your homework early.", "cn":"我敦促你早點完成作業。"},
        {"id":245, "a":"utilize", "b":"employ", "ch":"利用", "ex":"We can utilize this box as a table.", "cn":"我們可以利用這個盒子當桌子。"},
        {"id":246, "a":"validate", "b":"confirm", "ch":"驗證", "ex":"Please validate your ticket before boarding the train.", "cn":"上火車前請驗證你的車票。"},
        {"id":247, "a":"vehement", "b":"intense", "ch":"激烈的", "ex":"They had a vehement argument about money.", "cn":"他們就金錢問題進行了激烈的爭論。"},
        {"id":248, "a":"versatile", "b":"adaptable", "ch":"多才多藝的", "ex":"She is a versatile actor who can play any role.", "cn":"她是一位多才多藝的演員，什麼角色都能演。"},
        {"id":249, "a":"vigilant", "b":"watchful", "ch":"警惕的", "ex":"Stay vigilant when crossing the street.", "cn":"過馬路時要保持警惕的。"},
        {"id":250, "a":"violate", "b":"infringe", "ch":"違反", "ex":"If you violate the rules, you will be punished.", "cn":"如果你違反規定，你將會受到懲罰。"},
        {"id":251, "a":"vital", "b":"essential", "ch":"關鍵的", "ex":"Water is vital for all living things.", "cn":"水對所有生物來說都是關鍵的。"},
        {"id":252, "a":"vivid", "b":"vibrant", "ch":"生動的", "ex":"She has a vivid memory of her childhood.", "cn":"她對童年有著生動的記憶。"},
        {"id":253, "a":"volatile", "b":"unstable", "ch":"不穩定的", "ex":"The political situation in the region is volatile.", "cn":"該地區的政治局勢是不穩定的。"},
        {"id":254, "a":"vulnerable", "b":"susceptible", "ch":"脆弱的", "ex":"Young plants are vulnerable to frost.", "cn":"幼苗很脆弱的，容易受到霜凍傷害。"},
        {"id":255, "a":"warrant", "b":"justify", "ch":"證明... 是正當的", "ex":"The situation is serious enough to warrant a discussion.", "cn":"情況已經嚴重到足以證明... 是正當的一場討論。"},
        {"id":256, "a":"weary", "b":"fatigued", "ch":"疲倦的", "ex":"After the long walk, I felt weary.", "cn":"走了很長的路後，我感到疲倦的。"},
        {"id":257, "a":"widespread", "b":"prevalent", "ch":"廣泛的", "ex":"The use of smartphones is widespread among teenagers.", "cn":"智能手機在青少年中的使用是廣泛的。"},
        {"id":258, "a":"withdraw", "b":"retract", "ch":"撤回", "ex":"I need to withdraw some money from the bank.", "cn":"我需要從銀行撤回一些錢。"},
        {"id":259, "a":"withstand", "b":"endure", "ch":"經受住", "ex":"This bridge can withstand strong winds.", "cn":"這座橋可以經受住強風。"},
        {"id":260, "a":"yield", "b":"produce", "ch":"產生", "ex":"This apple tree will yield many fruits this year.", "cn":"這棵蘋果樹今年將會產生很多果實。"},
        {"id":261, "a":"abrupt", "b":"sudden", "ch":"突然的", "ex":"The bus came to an abrupt stop.", "cn":"巴士突然的停下了。"},
        {"id":262, "a":"accelerate", "b":"speed up", "ch":"加速", "ex":"The car started to accelerate on the highway.", "cn":"汽車在高速公路上開始加速。"},
        {"id":263, "a":"accommodate", "b":"adapt", "ch":"容納", "ex":"This hotel can accommodate up to 200 guests.", "cn":"這家酒店可以容納多達 200 位客人。"},
        {"id":264, "a":"adjacent", "b":"neighboring", "ch":"鄰近的", "ex":"We stayed in adjacent hotel rooms.", "cn":"我們住在鄰近的酒店房間。"},
        {"id":265, "a":"amplify", "b":"enhance", "ch":"放大", "ex":"A microphone will amplify your voice.", "cn":"麥克風會放大你的聲音。"},
        {"id":266, "a":"antagonize", "b":"provoke", "ch":"激怒", "ex":"Don't antagonize the dog, or it might bite.", "cn":"不要激怒那隻狗，不然它可能會咬人。"},
        {"id":267, "a":"antiquated", "b":"outdated", "ch":"過時的", "ex":"My grandfather still uses an antiquated phone.", "cn":"我祖父還在用一部過時的電話。"},
        {"id":268, "a":"apathy", "b":"indifference", "ch":"冷漠", "ex":"The students showed apathy towards the school project.", "cn":"學生們對學校項目表現出冷漠。"},
        {"id":269, "a":"apprehensive", "b":"anxious", "ch":"憂慮的", "ex":"I feel apprehensive about my job interview.", "cn":"我對工作面試感到憂慮的。"},
        {"id":270, "a":"arbitrary", "b":"random", "ch":"任意的", "ex":"The teacher made an arbitrary choice of which student to call on.", "cn":"老師任意的選擇了要提問哪個學生。"},
        {"id":271, "a":"articulate", "b":"express", "ch":"清楚地表達", "ex":"It's hard to articulate my feelings in words.", "cn":"很難用語言清楚地表達我的感受。"},
        {"id":272, "a":"ascend", "b":"rise", "ch":"上升", "ex":"We watched the balloon ascend into the sky.", "cn":"我們看著氣球上升到天空。"},
        {"id":273, "a":"assert", "b":"claim", "ch":"斷言", "ex":"He continued to assert that he was innocent.", "cn":"他繼續斷言自己是無辜的。"},
        {"id":274, "a":"assess", "b":"evaluate", "ch":"評估", "ex":"The teacher will assess our speaking skills.", "cn":"老師會評估我們的口語能力。"},
        {"id":275, "a":"augment", "b":"increase", "ch":"增加", "ex":"She took a second job to augment her income.", "cn":"她做了第二份工作來增加收入。"},
        {"id":276, "a":"authentic", "b":"genuine", "ch":"真實的", "ex":"Is this an authentic painting or a copy?", "cn":"這是真實的畫作還是複製品？"},
        {"id":277, "a":"avert", "b":"prevent", "ch":"防止", "ex":"The quick-thinking driver helped avert an accident.", "cn":"反應迅速的司機幫助防止了一場事故。"},
        {"id":278, "a":"biased", "b":"prejudiced", "ch":"有偏見的", "ex":"The article was biased and unfair.", "cn":"這篇文章是有偏見的且不公正。"},
        {"id":279, "a":"boost", "b":"enhance", "ch":"提升", "ex":"A good breakfast will boost your energy.", "cn":"一頓好的早餐會提升你的精力。"},
        {"id":280, "a":"cease", "b":"stop", "ch":"停止", "ex":"The rain will cease by evening.", "cn":"雨將在傍晚前停止。"}
]  # 需完整粘贴
groups_0620 = [
        {"id":281, "a":"chaotic", "b":"disorderly", "ch":"混亂的", "ex":"The classroom became chaotic when the teacher left.", "cn":"老師離開後，教室變得混亂的。"},
        {"id":282, "a":"circulate", "b":"distribute", "ch":"循環", "ex":"Blood circulates through the body.", "cn":"血液在全身循環。"},
        {"id":283, "a":"clash", "b":"conflict", "ch":"衝突", "ex":"Their opinions often clash during meetings.", "cn":"他們的意見在會議中經常衝突。"},
        {"id":284, "a":"coherent", "b":"logical", "ch":"邏輯上連貫的", "ex":"She gave a coherent explanation of the problem.", "cn":"她對問題給出了邏輯上連貫的解釋。"},
        {"id":285, "a":"commence", "b":"begin", "ch":"開始", "ex":"The ceremony will commence at noon.", "cn":"儀式將在中午開始。"},
        {"id":286, "a":"commemorate", "b":"celebrate", "ch":"紀念", "ex":"We commemorate his birthday every year.", "cn":"我們每年都紀念他的生日。"},
        {"id":287, "a":"compatible", "b":"harmonious", "ch":"兼容的", "ex":"Are these two software programs compatible?", "cn":"這兩個軟件程序兼容的嗎？"},
        {"id":288, "a":"compel", "b":"force", "ch":"強迫", "ex":"Bad weather may compel us to stay inside.", "cn":"壞天氣可能會強迫我們待在室內。"},
        {"id":289, "a":"compensate", "b":"reimburse", "ch":"補償", "ex":"The company will compensate you for your loss.", "cn":"公司會補償你的損失。"},
        {"id":290, "a":"concise", "b":"brief", "ch":"簡明的", "ex":"Please make your speech short and concise.", "cn":"請讓你的演講簡短而簡明的。"},
        {"id":291, "a":"concur", "b":"agree", "ch":"同意", "ex":"I concur with your opinion on this matter.", "cn":"在這件事上我同意你的看法。"},
        {"id":292, "a":"confine", "b":"restrict", "ch":"限制", "ex":"Please confine your use of the phone to business calls.", "cn":"請注意電話僅限於辦公用途。"},
        {"id":293, "a":"congested", "b":"crowded", "ch":"擁擠的", "ex":"Downtown streets are always congested during rush hour.", "cn":"市中心的街道在高峰時段總是擁擠的。"},
        {"id":294, "a":"consensus", "b":"agreement", "ch":"共識", "ex":"The group reached a consensus about where to go.", "cn":"小組就去哪裡達成了共識。"},
        {"id":295, "a":"consistent", "b":"steady", "ch":"一貫的", "ex":"Her work has been consistent all year.", "cn":"她全年的工作表現是一貫的優秀。"},
        {"id":296, "a":"conspicuous", "b":"noticeable", "ch":"顯眼的", "ex":"Her red hair is very conspicuous in the crowd.", "cn":"她的紅頭髮在人群中非常顯眼的。"},
        {"id":297, "a":"contemporary", "b":"modern", "ch":"當代的", "ex":"I prefer contemporary art to classical art.", "cn":"比起古典藝術，我更喜歡當代的藝術。"},
        {"id":298, "a":"contradict", "b":"oppose", "ch":"反駁", "ex":"His actions contradict his words.", "cn":"他的行為反駁了他的言辭。"},
        {"id":299, "a":"convene", "b":"gather", "ch":"召集", "ex":"The principal will convene a meeting of all teachers.", "cn":"校長將召集全體教師開會。"},
        {"id":300, "a":"convert", "b":"transform", "ch":"轉換", "ex":"This sofa converts into a bed.", "cn":"這張沙發可以轉換成一張床。"},
        {"id":301, "a":"convey", "b":"communicate", "ch":"傳遞", "ex":"This picture tries to convey a feeling of happiness.", "cn":"這幅畫試圖傳遞一種快樂的感覺。"},
        {"id":302, "a":"counterfeit", "b":"fake", "ch":"偽造的", "ex":"He was arrested for using counterfeit money.", "cn":"他因使用偽造的錢而被逮捕。"},
        {"id":303, "a":"counterpart", "b":"equivalent", "ch":"對應的人或物", "ex":"The Prime Minister met with his French counterpart.", "cn":"首相會見了法國對應的人或物（法國總理）。"},
        {"id":304, "a":"crucial", "b":"critical", "ch":"關鍵的", "ex":"It is crucial that you arrive on time.", "cn":"準時到達是關鍵的。"},
        {"id":305, "a":"culminate", "b":"conclude", "ch":"達到高潮", "ex":"The festival will culminate in a big fireworks display.", "cn":"節日將以一場盛大的煙火表演達到高潮。"},
        {"id":306, "a":"cumbersome", "b":"unwieldy", "ch":"笨重的", "ex":"Old computers are large and cumbersome.", "cn":"舊電腦又大又笨重的。"},
        {"id":307, "a":"decipher", "b":"decode", "ch":"解讀", "ex":"I can't decipher the doctor's handwriting.", "cn":"我解讀不了醫生的字跡。"},
        {"id":308, "a":"deficiency", "b":"insufficiency", "ch":"不足", "ex":"A deficiency of vitamins can make you sick.", "cn":"維生素不足會讓你生病。"},
        {"id":309, "a":"degrade", "b":"deteriorate", "ch":"惡化", "ex":"The quality of the air degrades near the factory.", "cn":"工廠附近的空氣質量惡化。"},
        {"id":310, "a":"denote", "b":"indicate", "ch":"表示", "ex":"A red sky often denotes bad weather.", "cn":"紅色的天空常常表示天氣不好。"},
        {"id":311, "a":"deplete", "b":"exhaust", "ch":"耗盡", "ex":"Overfishing can deplete the ocean's fish.", "cn":"過度捕撈會耗盡海洋中的魚類。"},
        {"id":312, "a":"depict", "b":"portray", "ch":"描繪", "ex":"The painting depict a beautiful sunset.", "cn":"這幅畫描繪了美麗的日落。"},
        {"id":313, "a":"desolate", "b":"barren", "ch":"荒涼的", "ex":"The island was desolate with no trees.", "cn":"那個島荒涼的，沒有樹木。"},
        {"id":314, "a":"detect", "b":"identify", "ch":"察覺", "ex":"Dogs can detect smells that humans can't.", "cn":"狗可以察覺人類察覺不到的氣味。"},
        {"id":315, "a":"detrimental", "b":"harmful", "ch":"有害的", "ex":"Smoking is detrimental to your health.", "cn":"吸煙對你的健康是有害的。"},
        {"id":316, "a":"devour", "b":"consume", "ch":"吞食", "ex":"The lion will devour its prey.", "cn":"獅子會吞食它的獵物。"},
        {"id":317, "a":"differentiate", "b":"distinguish", "ch":"區分", "ex":"It's hard to differentiate between the twins.", "cn":"很難區分這對雙胞胎。"},
        {"id":318, "a":"diminish", "b":"decrease", "ch":"減少", "ex":"The noise began to diminish as the car drove away.", "cn":"隨著汽車開走，噪音開始減少。"},
        {"id":319, "a":"discrepancy", "b":"inconsistency", "ch":"差異", "ex":"There is a discrepancy in the two reports.", "cn":"這兩份報告存在差異。"},
        {"id":320, "a":"disperse", "b":"scatter", "ch":"分散", "ex":"The police used water cannons to disperse the crowd.", "cn":"警察使用高壓水炮來分散人群。"}
]  # 需完整粘贴

# ========== 变形工具 ==========
IRREGULAR_VERBS = {
    "arise": ["arose","arisen"], "be": ["was","were","been","being"], "bear": ["bore","borne"],
    "beat": ["beat","beaten"], "become": ["became","become"], "begin": ["began","begun"],
    "bend": ["bent","bent"], "bet": ["bet","bet"], "bind": ["bound","bound"],
    "bite": ["bit","bitten"], "bleed": ["bled","bled"], "blow": ["blew","blown"],
    "break": ["broke","broken"], "bring": ["brought","brought"], "build": ["built","built"],
    "burn": ["burnt","burnt"], "buy": ["bought","bought"], "catch": ["caught","caught"],
    "choose": ["chose","chosen"], "come": ["came","come"], "cost": ["cost","cost"],
    "cut": ["cut","cut"], "deal": ["dealt","dealt"], "dig": ["dug","dug"],
    "do": ["did","done"], "draw": ["drew","drawn"], "dream": ["dreamt","dreamt"],
    "drink": ["drank","drunk"], "drive": ["drove","driven"], "eat": ["ate","eaten"],
    "fall": ["fell","fallen"], "feed": ["fed","fed"], "feel": ["felt","felt"],
    "fight": ["fought","fought"], "find": ["found","found"], "fly": ["flew","flown"],
    "forget": ["forgot","forgotten"], "forgive": ["forgave","forgiven"], "freeze": ["froze","frozen"],
    "get": ["got","gotten"], "give": ["gave","given"], "go": ["went","gone"],
    "grow": ["grew","grown"], "hang": ["hung","hung"], "have": ["had","had"],
    "hear": ["heard","heard"], "hide": ["hid","hidden"], "hit": ["hit","hit"],
    "hold": ["held","held"], "hurt": ["hurt","hurt"], "keep": ["kept","kept"],
    "know": ["knew","known"], "lay": ["laid","laid"], "lead": ["led","led"],
    "learn": ["learnt","learnt"], "leave": ["left","left"], "lend": ["lent","lent"],
    "let": ["let","let"], "lie": ["lay","lain"], "lose": ["lost","lost"],
    "make": ["made","made"], "mean": ["meant","meant"], "meet": ["met","met"],
    "pay": ["paid","paid"], "put": ["put","put"], "read": ["read","read"],
    "ride": ["rode","ridden"], "ring": ["rang","rung"], "rise": ["rose","risen"],
    "run": ["ran","run"], "say": ["said","said"], "see": ["saw","seen"],
    "sell": ["sold","sold"], "send": ["sent","sent"], "set": ["set","set"],
    "shake": ["shook","shaken"], "shine": ["shone","shone"], "shoot": ["shot","shot"],
    "show": ["showed","shown"], "shut": ["shut","shut"], "sing": ["sang","sung"],
    "sink": ["sank","sunk"], "sit": ["sat","sat"], "sleep": ["slept","slept"],
    "speak": ["spoke","spoken"], "spend": ["spent","spent"], "spread": ["spread","spread"],
    "stand": ["stood","stood"], "steal": ["stole","stolen"], "stick": ["stuck","stuck"],
    "strike": ["struck","struck"], "swim": ["swam","swum"], "take": ["took","taken"],
    "teach": ["taught","taught"], "tear": ["tore","torn"], "tell": ["told","told"],
    "think": ["thought","thought"], "throw": ["threw","thrown"], "understand": ["understood","understood"],
    "wake": ["woke","woken"], "wear": ["wore","worn"], "win": ["won","won"],
    "write": ["wrote","written"]
}

def get_forms(word):
    forms = {word}
    lower = word.lower()
    forms.add(word + 's')
    if lower.endswith(('s','x','z','ch','sh')):
        forms.add(word + 'es')
    elif lower.endswith('y') and not lower.endswith(('ay','ey','iy','oy','uy')):
        forms.add(word[:-1] + 'ies')
    if lower.endswith('e'):
        forms.add(word + 'd')
        forms.add(word[:-1] + 'ing')
    elif lower.endswith('y') and not lower.endswith(('ay','ey','iy','oy','uy')):
        forms.add(word[:-1] + 'ied')
    else:
        forms.add(word + 'ed')
        forms.add(word + 'ing')
    if lower in IRREGULAR_VERBS:
        for f in IRREGULAR_VERBS[lower]:
            forms.add(f)
    return sorted(forms, key=lambda x: -len(x))

def replace_example(example, from_word, to_word):
    from_forms = get_forms(from_word)
    to_forms = get_forms(to_word)
    res = example
    for i, f in enumerate(from_forms):
        import re
        pattern = r'\b' + re.escape(f) + r'\b'
        repl = to_forms[i] if i < len(to_forms) else to_word
        res = re.sub(pattern, repl, res, flags=re.IGNORECASE)
    return res

# ========== 构建完整词汇表 ==========
vocabulary = []
def add_group(group, date_str):
    vid = len(vocabulary)
    vocabulary.append({
        "word": group["a"], "chinese": group["ch"],
        "example": group["ex"], "example_cn": group["cn"],
        "date": date_str, "sibling": group["b"], "group_id": group["id"],
        "_idx": vid
    })
    replaced = replace_example(group["ex"], group["a"], group["b"])
    vocabulary.append({
        "word": group["b"], "chinese": group["ch"],
        "example": replaced, "example_cn": group["cn"],
        "date": date_str, "sibling": group["a"], "group_id": group["id"],
        "_idx": vid + 1
    })

# 需要将所有groups添加到vocabulary，此处省略重复代码，请按照日期添加
for g in groups_0509: add_group(g, "2026-05-09")
for g in groups_0516: add_group(g, "2026-05-16")
for g in groups_0523: add_group(g, "2026-05-23")
for g in groups_0530: add_group(g, "2026-05-30")
for g in groups_0606: add_group(g, "2026-06-06")
for g in groups_0620: add_group(g, "2026-06-20")
# 添加其余批次 0516, 0523, 0530, 0606, 0620

# 建立同义词索引
for v in vocabulary:
    v["synonyms"] = [i for i, w in enumerate(vocabulary) if w["group_id"] == v["group_id"] and i != v["_idx"]]

# 预处理填空例句
for v in vocabulary:
    forms = get_forms(v["word"])
    if v["example"]:
        import re
        escaped = [re.escape(f) for f in forms]
        pattern = r'\b(' + '|'.join(escaped) + r')\b'
        v["blank_example"] = re.sub(pattern, '_____', v["example"], flags=re.IGNORECASE)
    else:
        v["blank_example"] = ""

# ========== 应用类 ==========
class VocabularyTestApp:
    def __init__(self, root):
        self.root = root
        self.root.title("单词测试 · 多日期批次")
        self.root.geometry("650x850")
        self.root.resizable(True, True)

        # 主题颜色
        self.dark_mode = False
        self.light_colors = {"bg": "#f0f0f0", "fg": "#000", "btn_bg": "#f0f0f0", "btn_fg": "#000", "example_fg": "#555", "remaining_fg": "#FF4444"}
        self.dark_colors = {"bg": "#2b2b2b", "fg": "#fff", "btn_bg": "#3c3f41", "btn_fg": "#fff", "example_fg": "#bbb", "remaining_fg": "#FF6B6B"}
        self.colors = self.light_colors.copy()

        # 字体
        self.font_large_size = 24
        self.font_medium_size = 14
        self.font_small_size = 11
        self.update_fonts()

        # 状态变量
        self.test_mode = 0          # 模式索引（0全部，1前一半，2后一半，3错题，4难词）
        self.test_direction = 0     # 0英选中，1中选英，2填空
        self.selected_date = "0509"
        self.date_names = {"0509":"5月9日 (81-120)", "0516":"5月16日 (121-160)", "0523":"5月23日 (161-200)",
                           "0530":"5月30日 (201-240)", "0606":"6月6日 (241-280)", "0620":"6月20日 (281-320)", "all":"全部 (81-320)"}
        self.current_word_index = None
        self.current_word = None
        self.current_options = []
        self.correct_index = None
        self.has_mistake = False
        self.is_answering = True
        self.mastered_indices = []
        self.unmastered_indices = []
        self.wrong_words = {}
        self.hard_words = set()
        self.wrong_queue = []
        self.review_queue = []
        self.slashed_words = set()
        self.question_counter = 0
        self.is_review_question = False
        self.history = []
        self.is_viewing_history = False
        self.saved_current_state = None

        self.start_time = time.time()
        self.total_attempts = 0
        self.correct_attempts = 0
        self.next_timeout = None

        self.create_widgets()
        self.load_progress()
        self.bind_shortcuts()
        self.reset_and_start()

    def update_fonts(self):
        self.font_large = ("Arial", self.font_large_size, "bold")
        self.font_medium = ("Arial", self.font_medium_size)
        self.font_small = ("Arial", self.font_small_size)

    def create_widgets(self):
        # 顶部工具栏
        toolbar = tk.Frame(self.root, bg=self.colors["bg"])
        toolbar.pack(fill="x", padx=20, pady=10)
        # 字体、夜间、错题、帮助、浏览、日期、方向
        tk.Button(toolbar, text="A-", font=self.font_small, width=3, command=self.decrease_font).pack(side="left", padx=2)
        tk.Button(toolbar, text="A+", font=self.font_small, width=3, command=self.increase_font).pack(side="left", padx=2)
        self.night_btn = tk.Button(toolbar, text="🌙", font=self.font_small, width=3, command=self.toggle_night)
        self.night_btn.pack(side="left", padx=2)
        tk.Button(toolbar, text="错题统计", font=self.font_small, command=self.show_wrong_book).pack(side="left", padx=5)
        tk.Button(toolbar, text="?", font=self.font_small, width=2, command=self.show_help).pack(side="left", padx=2)
        tk.Button(toolbar, text="📖 浏览", font=self.font_small, command=self.browse_words).pack(side="left", padx=5)
        # 方向选择
        self.dir_var = tk.StringVar(value="英文选中文")
        dir_combo = ttk.Combobox(toolbar, textvariable=self.dir_var, values=["英文选中文","中文选英文","句子填空"],
                                 state="readonly", font=self.font_small, width=8)
        dir_combo.pack(side="right", padx=5)
        dir_combo.bind("<<ComboboxSelected>>", self.switch_direction)
        # 日期选择
        self.date_var = tk.StringVar(value="5月9日 (81-120)")
        date_combo = ttk.Combobox(toolbar, textvariable=self.date_var, values=list(self.date_names.values()),
                                  state="readonly", font=self.font_small, width=14)
        date_combo.pack(side="right", padx=5)
        date_combo.bind("<<ComboboxSelected>>", self.switch_date)

        # 标题行
        header = tk.Frame(self.root, bg=self.colors["bg"])
        header.pack(fill="x", padx=20, pady=5)
        tk.Label(header, text="单词测试", font=self.font_medium, bg=self.colors["bg"], fg=self.colors["fg"]).pack(side="left")
        # 模式选择
        self.mode_var = tk.StringVar(value="全部单词")
        mode_combo = ttk.Combobox(header, textvariable=self.mode_var, values=["全部单词","前一半","后一半","只复习错题","只复习难词"],
                                  state="readonly", font=self.font_small, width=14)
        mode_combo.pack(side="left", padx=20)
        mode_combo.bind("<<ComboboxSelected>>", self.switch_mode)
        # 得分
        score_frame = tk.Frame(header, bg=self.colors["bg"])
        score_frame.pack(side="right")
        self.score_label = tk.Label(score_frame, text="得分: 0/80", font=self.font_medium, bg=self.colors["bg"], fg=self.colors["fg"])
        self.score_label.pack(side="left", padx=(0,10))
        self.remaining_label = tk.Label(score_frame, text="剩余: 80", font=self.font_medium, bg=self.colors["bg"], fg=self.colors["remaining_fg"])
        self.remaining_label.pack(side="left", padx=(0,10))
        self.accuracy_label = tk.Label(score_frame, text="正确率: 0%", font=self.font_small, bg=self.colors["bg"], fg=self.colors["fg"])
        self.accuracy_label.pack(side="left")

        # 进度条
        self.progress = ttk.Progressbar(self.root, length=600, mode="determinate")
        self.progress.pack(padx=20, pady=10)

        # 单词卡片
        word_frame = tk.Frame(self.root, bg=self.colors["bg"])
        word_frame.pack(fill="x", padx=20, pady=10)
        # 难词和斩词
        top_right = tk.Frame(word_frame, bg=self.colors["bg"])
        top_right.pack(side="top", anchor="ne")
        self.hard_btn = tk.Button(top_right, text="⭐", font=self.font_medium, width=2, command=self.toggle_hard_word)
        self.hard_btn.pack(side="left", padx=2)
        self.slash_btn = tk.Button(top_right, text="🔪", font=self.font_medium, width=2, command=self.slash_word)
        self.slash_btn.pack(side="left", padx=2)
        self.word_label = tk.Label(word_frame, text="", font=self.font_large, wraplength=600, justify="center", bg=self.colors["bg"], fg=self.colors["fg"])
        self.word_label.pack()
        self.example_label = tk.Label(word_frame, text="", font=self.font_small, wraplength=600, justify="center", bg=self.colors["bg"], fg=self.colors["example_fg"])
        self.example_label.pack(pady=10)
        self.example_cn_label = tk.Label(word_frame, text="", font=self.font_small, wraplength=600, justify="center", bg=self.colors["bg"], fg=self.colors["example_fg"])
        self.example_cn_label.pack(pady=5)
        self.stage_label = tk.Label(word_frame, text="请选择中文解释:", font=self.font_medium, bg=self.colors["bg"], fg=self.colors["fg"])
        self.stage_label.pack(pady=10)

        # 选项按钮
        options_frame = tk.Frame(self.root, bg=self.colors["bg"])
        options_frame.pack(fill="both", expand=True, padx=20, pady=10)
        self.option_buttons = []
        for i in range(4):
            btn = tk.Button(options_frame, text="", font=self.font_small, width=40, height=2,
                            command=lambda idx=i: self.select_option(idx), bg=self.colors["btn_bg"], fg=self.colors["btn_fg"])
            btn.grid(row=i, column=0, pady=8)
            self.option_buttons.append(btn)

        # 底部
        bottom = tk.Frame(self.root, bg=self.colors["bg"])
        bottom.pack(fill="x", padx=20, pady=10)
        self.shortcut_label = tk.Label(bottom, text="快捷键: 1-4选答案 | Enter下一题 | ←→历史 | A收藏 | S斩", font=self.font_small, bg=self.colors["bg"], fg=self.colors["example_fg"])
        self.shortcut_label.pack(side="left", padx=20)
        self.time_label = tk.Label(bottom, text="学习时长: 0分钟", font=self.font_small, bg=self.colors["bg"], fg=self.colors["fg"])
        self.time_label.pack(side="left")
        self.prev_btn = tk.Button(bottom, text="上一题 (←)", font=self.font_small, width=12, state="disabled", command=self.show_previous)
        self.prev_btn.pack(side="right", padx=5)
        self.return_btn = tk.Button(bottom, text="返回 (→)", font=self.font_small, width=12, state="disabled", command=self.return_to_current)
        self.return_btn.pack(side="right", padx=5)

        self.update_time()

    # ---------- 核心方法 ----------
    def get_available_words(self):
        pool = [v for v in vocabulary if self._date_match(v["date"])]
        if self.test_mode == 0:
            indices = [v["_idx"] for v in pool]
        elif self.test_mode == 1:
            half = len(pool)//2
            indices = [v["_idx"] for v in pool[:half]]
        elif self.test_mode == 2:
            half = len(pool)//2
            indices = [v["_idx"] for v in pool[half:]]
        elif self.test_mode == 3:
            indices = [int(k) for k in self.wrong_words if any(v["_idx"]==int(k) for v in pool)]
        else:  # 难词
            indices = [i for i in self.hard_words if any(v["_idx"]==i for v in pool)]
        return indices

    def _date_match(self, date_str):
        if self.selected_date == "all": return True
        return date_str == f"2026-{self.selected_date[:2]}-{self.selected_date[2:]}"

    def reset_and_start(self):
        avail = self.get_available_words()
        if not avail:
            messagebox.showwarning("提示", "当前日期范围内没有单词！")
            self.total_words = 0
            self.update_score_progress()
            return
        self.total_words = len(avail)
        self.mastered_indices = []
        self.unmastered_indices = avail.copy()
        self.wrong_queue = []
        self.review_queue = []
        self.slashed_words.clear()
        self.question_counter = 0
        self.history = []
        self.prev_btn.config(state="disabled")
        self.current_word = None
        self.update_score_progress()
        self.next_question()

    def next_question(self):
        if self.next_timeout:
            self.root.after_cancel(self.next_timeout)
            self.next_timeout = None
        avail = self.get_available_words()
        if not avail:
            # 没有可用单词，可能是日期筛选导致，直接提示并重新开始，但避免再次递归
            messagebox.showwarning("提示", "当前日期范围内没有单词！请检查词汇表或选择其他日期。")
            return
        if not self.unmastered_indices and not self.wrong_queue and not self.review_queue:
            messagebox.showinfo("完成", "当前范围单词已全部掌握！重新开始")
            self.reset_and_start()
            return
        # 其余逻辑...
        # 保存历史
        if self.current_word and not self.is_viewing_history:
            self.history.append({
                "idx": self.current_word_index, "word": self.current_word["word"],
                "chinese": self.current_word["chinese"], "example": self.current_word["example"],
                "blank": self.current_word.get("blank_example",""), "example_cn": self.current_word["example_cn"],
                "dir": self.test_direction, "opts": self.current_options.copy(), "correct": self.correct_index,
                "hard": self.current_word_index in self.hard_words
            })
            self.prev_btn.config(state="normal")
        self.question_counter += 1
        next_idx = None
        self.is_review_question = False
        # 错题队列
        for item in self.wrong_queue:
            if self.question_counter >= item[2] and item[0] not in self.slashed_words and item[0] in avail:
                next_idx = item[0]; self.wrong_queue.remove(item); break
        # 复习队列
        if next_idx is None:
            for item in self.review_queue:
                if self.question_counter >= item[1] and item[0] not in self.slashed_words and item[0] in avail:
                    next_idx = item[0]; self.review_queue.remove(item); self.is_review_question = True; break
        # 新词
        if next_idx is None:
            fresh = [i for i in self.unmastered_indices if i not in self.slashed_words and i in avail]
            if fresh:
                next_idx = random.choice(fresh)
                self.unmastered_indices.remove(next_idx)
        # 兜底
        if next_idx is None:
            all_queued = [(it[0], it[1] if isinstance(it, tuple) and len(it)==3 else it[1]) for it in self.wrong_queue] + \
                         [(it[0], it[1]) for it in self.review_queue]
            all_queued = [i for i in all_queued if i[0] not in self.slashed_words and i[0] in avail]
            if all_queued:
                all_queued.sort(key=lambda x: x[1])
                next_idx = all_queued[0][0]
                self.wrong_queue = [it for it in self.wrong_queue if it[0] != next_idx]
                self.review_queue = [it for it in self.review_queue if it[0] != next_idx]
            else:
                self.slashed_words.clear()
                self.next_question()
                return
        self.current_word_index = next_idx
        self.current_word = vocabulary[next_idx]
        self.has_mistake = False
        self.is_answering = True
        self.is_viewing_history = False
        self.return_btn.config(state="disabled")
        self.hard_btn.config(text="★" if next_idx in self.hard_words else "⭐")
        # 根据方向显示
        if self.test_direction == 0:
            self.word_label.config(text=self.current_word["word"])
            self.example_label.config(text=self.current_word["example"])
            self.current_options = self._get_options(self.current_word["chinese"], "chinese")
            self.correct_index = self.current_options.index(self.current_word["chinese"])
        elif self.test_direction == 1:
            self.word_label.config(text=self.current_word["chinese"])
            self.example_label.config(text="")
            self.current_options = self._get_options(self.current_word["word"], "english")
            self.correct_index = self.current_options.index(self.current_word["word"])
        else:
            self.word_label.config(text=self.current_word.get("blank_example", self.current_word["example"]))
            self.example_label.config(text="")
            self.current_options = self._get_options(self.current_word["word"], "english")
            self.correct_index = self.current_options.index(self.current_word["word"])
        self.example_cn_label.config(text="")
        for i, btn in enumerate(self.option_buttons):
            btn.config(text=self.current_options[i], state="normal", bg=self.colors["btn_bg"])
        self.update_score_progress()
        self.save_progress()

    def _get_options(self, correct, opt_type):
        avail = self.get_available_words()
        all_opts = set()
        for idx in avail:
            w = vocabulary[idx]
            all_opts.add(w["chinese"] if opt_type == "chinese" else w["word"])
        all_opts.discard(correct)
        # 排除同义词
        if opt_type == "english" and self.current_word_index is not None:
            for syn in self.current_word.get("synonyms", []):
                if syn < len(vocabulary):
                    all_opts.discard(vocabulary[syn]["word"])
        wrongs = random.sample(list(all_opts), min(3, len(all_opts)))
        while len(wrongs) < 3:
            wrongs.append("(其他选项)")
        options = wrongs + [correct]
        random.shuffle(options)
        return options

    def select_option(self, idx):
        if not self.is_answering or self.is_viewing_history:
            return
        if idx == self.correct_index:
            self.option_buttons[idx].config(bg="#90EE90")
            self.is_answering = False
            for btn in self.option_buttons:
                btn.config(state="disabled")
            self.total_attempts += 1
            if self.test_direction != 1:
                self.example_cn_label.config(text=self.current_word["example_cn"])
            if not self.has_mistake:
                self.correct_attempts += 1
                if self.is_review_question:
                    self.mastered_indices.append(self.current_word_index)
                else:
                    self.review_queue.append((self.current_word_index, self.question_counter + 15))
            self.update_score_progress()
            self.save_progress()
            self.next_timeout = self.root.after(800, self.next_question)
        else:
            self.option_buttons[idx].config(bg="#FFB6C1", state="disabled")
            self.has_mistake = True
            self.total_attempts += 1
            s_idx = str(self.current_word_index)
            self.wrong_words[s_idx] = self.wrong_words.get(s_idx, 0) + 1
            cnt = self.wrong_words[s_idx]
            interval = 5 if cnt == 1 else (10 if cnt == 2 else 20)
            next_appear = self.question_counter + interval
            found = False
            for i, item in enumerate(self.wrong_queue):
                if item[0] == self.current_word_index:
                    self.wrong_queue[i] = (self.current_word_index, cnt, next_appear)
                    found = True
                    break
            if not found:
                self.wrong_queue.append((self.current_word_index, cnt, next_appear))
            self.update_score_progress()
            self.save_progress()

    def update_score_progress(self):
        avail = self.get_available_words()
        total = len(avail)
        mastered = len([i for i in self.mastered_indices if i in avail])
        self.score_label.config(text=f"得分: {mastered}/{total}")
        remaining = len([i for i in self.unmastered_indices if i in avail]) + len(self.wrong_queue) + len(self.review_queue)
        self.remaining_label.config(text=f"剩余: {remaining}")
        self.progress["value"] = (mastered / total * 100) if total else 0
        if self.total_attempts:
            acc = int(self.correct_attempts / self.total_attempts * 100)
            self.accuracy_label.config(text=f"正确率: {acc}%")

    # ---------- 历史记录 ----------
    def show_previous(self):
        if not self.history or self.is_viewing_history:
            return
        self._save_current_state()
        self.is_viewing_history = True
        prev = self.history[-1]
        if prev["dir"] == 0:
            self.word_label.config(text=prev["word"])
            self.example_label.config(text=prev["example"])
        elif prev["dir"] == 1:
            self.word_label.config(text=prev["chinese"])
            self.example_label.config(text="")
        else:
            self.word_label.config(text=prev.get("blank", prev["example"]))
            self.example_label.config(text="")
        self.example_cn_label.config(text=prev["example_cn"])
        self.stage_label.config(text="上一题回顾：")
        self.hard_btn.config(text="★" if prev["hard"] else "⭐")
        for i, btn in enumerate(self.option_buttons):
            btn.config(text=prev["opts"][i], state="disabled", bg=self.colors["btn_bg"])
            if i == prev["correct"]:
                btn.config(bg="#90EE90")
        self.prev_btn.config(state="disabled")
        self.return_btn.config(state="normal")

    def _save_current_state(self):
        self.saved_current_state = {
            "word_index": self.current_word_index, "word": self.current_word,
            "options": self.current_options.copy(), "correct_index": self.correct_index,
            "has_mistake": self.has_mistake, "is_answering": self.is_answering,
            "button_states": [(btn["text"], btn["state"], btn["bg"]) for btn in self.option_buttons],
            "example_cn": self.example_cn_label["text"],
            "test_direction": self.test_direction, "is_review_question": self.is_review_question
        }

    def return_to_current(self):
        if not self.is_viewing_history or not self.saved_current_state:
            return
        s = self.saved_current_state
        self.current_word_index = s["word_index"]
        self.current_word = s["word"]
        self.current_options = s["options"]
        self.correct_index = s["correct_index"]
        self.has_mistake = s["has_mistake"]
        self.is_answering = s["is_answering"]
        self.test_direction = s["test_direction"]
        self.is_review_question = s["is_review_question"]
        if s["test_direction"] == 0:
            self.word_label.config(text=s["word"]["word"])
            self.example_label.config(text=s["word"]["example"])
        elif s["test_direction"] == 1:
            self.word_label.config(text=s["word"]["chinese"])
            self.example_label.config(text="")
        else:
            self.word_label.config(text=s["word"].get("blank_example", ""))
            self.example_label.config(text="")
        self.example_cn_label.config(text=s["example_cn"])
        self.stage_label.config(text="请选择中文解释:" if s["test_direction"]==0 else ("请选择英文单词:" if s["test_direction"]==1 else "请选择正确的单词填空:"))
        self.hard_btn.config(text="★" if s["word_index"] in self.hard_words else "⭐")
        for i, btn in enumerate(self.option_buttons):
            t, st, bg = s["button_states"][i]
            btn.config(text=t, state=st, bg=bg)
        self.is_viewing_history = False
        self.saved_current_state = None
        self.return_btn.config(state="disabled")
        self.prev_btn.config(state="normal" if self.history else "disabled")

    # ---------- 浏览单词 ----------
    def browse_words(self):
        win = tk.Toplevel(self.root)
        win.title("单词浏览")
        win.geometry("600x500")
        avail = self.get_available_words()
        groups = {}
        for idx in avail:
            gid = vocabulary[idx]["group_id"]
            groups.setdefault(gid, []).append(idx)
        text = tk.Text(win, font=self.font_small, wrap="word")
        scroll = tk.Scrollbar(win, command=text.yview)
        text.configure(yscrollcommand=scroll.set)
        for gid, idxs in groups.items():
            words = " = ".join(vocabulary[i]["word"] for i in idxs)
            first = vocabulary[idxs[0]]
            text.insert("end", f"单词: {words}\n中文: {first['chinese']}\n例句: {first['example']}\n中文翻译: {first['example_cn']}\n\n")
        text.config(state="disabled")
        scroll.pack(side="right", fill="y")
        text.pack(fill="both", expand=True)

    # ---------- 界面控制 ----------
    def switch_date(self, event=None):
        for key, name in self.date_names.items():
            if name == self.date_var.get():
                self.selected_date = key
                break
        self.reset_and_start()

    def switch_mode(self, event=None):
        modes = ["全部单词","前一半","后一半","只复习错题","只复习难词"]
        self.test_mode = modes.index(self.mode_var.get())
        self.reset_and_start()

    def switch_direction(self, event=None):
        dirs = ["英文选中文","中文选英文","句子填空"]
        self.test_direction = dirs.index(self.dir_var.get())
        self.stage_label.config(text="请选择中文解释:" if self.test_direction==0 else ("请选择英文单词:" if self.test_direction==1 else "请选择正确的单词填空:"))
        self.reset_and_start()

    def toggle_hard_word(self):
        if self.current_word_index is None: return
        if self.current_word_index in self.hard_words:
            self.hard_words.remove(self.current_word_index)
            self.hard_btn.config(text="⭐")
        else:
            self.hard_words.add(self.current_word_index)
            self.hard_btn.config(text="★")
        self.save_progress()

    def slash_word(self):
        if self.current_word_index is None: return
        if messagebox.askyesno("斩词", f"确定斩掉「{self.current_word['word']}」吗？"):
            self.slashed_words.add(self.current_word_index)
            self.wrong_queue = [it for it in self.wrong_queue if it[0] != self.current_word_index]
            self.review_queue = [it for it in self.review_queue if it[0] != self.current_word_index]
            if self.current_word_index in self.unmastered_indices:
                self.unmastered_indices.remove(self.current_word_index)
            self.next_question()

    def increase_font(self):
        self.font_large_size += 2; self.font_medium_size += 1; self.font_small_size += 1
        self.update_fonts(); self._apply_fonts()

    def decrease_font(self):
        if self.font_large_size > 16:
            self.font_large_size -= 2; self.font_medium_size -= 1; self.font_small_size -= 1
            self.update_fonts(); self._apply_fonts()

    def _apply_fonts(self):
        # 更新主要控件字体（简化起见，部分未列出）
        self.word_label.config(font=self.font_large)
        self.example_label.config(font=self.font_small)
        self.stage_label.config(font=self.font_medium)

    def toggle_night(self):
        self.dark_mode = not self.dark_mode
        self.colors = self.dark_colors if self.dark_mode else self.light_colors
        self.root.config(bg=self.colors["bg"])
        self.night_btn.config(text="☀️" if self.dark_mode else "🌙")
        # 此处省略大量颜色更新，可参照原代码

    def show_wrong_book(self):
        # 显示错题统计弹窗（简化）
        msg = "错题统计:\n"
        for k, v in sorted(self.wrong_words.items(), key=lambda x: x[1], reverse=True):
            w = vocabulary[int(k)]
            msg += f"{w['word']} - {w['chinese']} ({v}次)\n"
        if not self.wrong_words: msg = "无错题记录"
        messagebox.showinfo("错题统计", msg)

    def show_help(self):
        messagebox.showinfo("快捷键", "1-4: 选答案\nEnter/空格: 下一题\n←→: 历史回顾\na: 难词\nS: 斩词")

    def bind_shortcuts(self):
        for i in range(1,5):
            self.root.bind(str(i), lambda e, idx=i-1: self.select_option(idx) if not self.is_viewing_history and self.is_answering else None)
        self.root.bind("<Return>", lambda e: self.manual_next())
        self.root.bind("<space>", lambda e: self.manual_next())
        self.root.bind("<Left>", lambda e: self.show_previous())
        self.root.bind("<Right>", lambda e: self.return_to_current())
        self.root.bind("a", lambda e: self.toggle_hard_word())
        self.root.bind("A", lambda e: self.toggle_hard_word())
        self.root.bind("s", lambda e: self.slash_word())
        self.root.bind("S", lambda e: self.slash_word())

    def manual_next(self):
        if not self.is_viewing_history and not self.is_answering:
            if self.next_timeout:
                self.root.after_cancel(self.next_timeout)
                self.next_timeout = None
            self.next_question()

    def update_time(self):
        elapsed = int((time.time() - self.start_time) / 60)
        self.time_label.config(text=f"学习时长: {elapsed}分钟")
        self.root.after(60000, self.update_time)

    def save_progress(self):
        config = {
            "mastered": self.mastered_indices, "wrong_words": self.wrong_words,
            "hard_words": list(self.hard_words), "test_mode": self.test_mode,
            "test_direction": self.test_direction, "dark_mode": self.dark_mode,
            "selected_date": self.selected_date,
            "font_large": self.font_large_size, "font_medium": self.font_medium_size, "font_small": self.font_small_size
        }
        try:
            with open("vocab_config.json", "w", encoding="utf-8") as f:
                json.dump(config, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print("保存失败", e)

    def load_progress(self):
        if not os.path.exists("vocab_config.json"): return
        try:
            with open("vocab_config.json", "r", encoding="utf-8") as f:
                cfg = json.load(f)
            self.mastered_indices = cfg.get("mastered", [])
            self.wrong_words = cfg.get("wrong_words", {})
            self.hard_words = set(cfg.get("hard_words", []))
            self.test_mode = cfg.get("test_mode", 0)
            self.test_direction = cfg.get("test_direction", 0)
            self.dark_mode = cfg.get("dark_mode", False)
            self.selected_date = cfg.get("selected_date", "0509")
            self.font_large_size = cfg.get("font_large", 24)
            self.font_medium_size = cfg.get("font_medium", 14)
            self.font_small_size = cfg.get("font_small", 11)
            self.update_fonts()
            self.mode_var.set(["全部单词","前一半","后一半","只复习错题","只复习难词"][self.test_mode])
            self.dir_var.set(["英文选中文","中文选英文","句子填空"][self.test_direction])
            self.date_var.set(self.date_names[self.selected_date])
            if self.dark_mode:
                self.toggle_night()
        except Exception as e:
            print("加载失败", e)

if __name__ == "__main__":
    root = tk.Tk()
    app = VocabularyTestApp(root)
    root.mainloop()