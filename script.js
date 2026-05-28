const STORAGE_KEY = 'vocab_test_progress';
const vocabularyData = {
  "groups": {
    "2026-05-09": [
      {"id":81, "a":"evoke", "b":"elicit", "ch":"唤起", "ex":"The smell of fresh bread evokes happy memories of my grandmother's kitchen.", "cn":"新鮮麵包的香味喚起了我對祖母廚房的美好回憶。"},
      {"id":82, "a":"exacerbate", "b":"worsen", "ch":"恶化", "ex":"Rubbing a mosquito bite will only exacerbate the itching.", "cn":"抓撓蚊子包只會讓痕癢惡化。"},
      {"id":83, "a":"exemplify", "b":"illustrate", "ch":"举例说明", "ex":"This simple recipe exemplifies how easy it is to cook healthy food.", "cn":"這個簡單的食譜例說明了烹飪健康食品是多麼容易。"},
      {"id":84, "a":"exploit", "b":"utilize", "ch":"利用", "ex":"We should exploit solar energy to save electricity.", "cn":"我們應該利用太陽能來節省電力。"},
      {"id":85, "a":"facilitate", "b":"ease", "ch":"促进", "ex":"The new app will facilitate communication between teachers and parents.", "cn":"這個新的應用程式將促進老師和家長之間的溝通。"},
      {"id":86, "a":"falter", "b":"hesitate", "ch":"犹豫", "ex":"He started to falter when asked a difficult question during the interview.", "cn":"面試中被問到一個難題時，他開始猶豫起來。"},
      {"id":87, "a":"feasible", "b":"viable", "ch":"可行的", "ex":"It's not feasible to finish this entire project in one day.", "cn":"在一天內完成整個項目是不可行的。"},
      {"id":88, "a":"finite", "b":"limited", "ch":"有限的", "ex":"The Earth has finite resources, so we need to recycle.", "cn":"地球的資源是有限的，所以我們需要回收利用。"},
      {"id":89, "a":"fluctuate", "b":"vary", "ch":"波动", "ex":"The temperature can fluctuate greatly between day and night in the desert.", "cn":"在沙漠裡，白天和晚上的氣溫會波動很大。"},
      {"id":90, "a":"formidable", "b":"challenging", "ch":"令人敬畏的", "ex":"Passing the final exam seemed like a formidable task.", "cn":"通過期末考試似乎是一項令人敬畏的任務。"},
      {"id":91, "a":"foster", "b":"nurture", "ch":"培养", "ex":"Reading books can foster a child's imagination.", "cn":"閱讀書籍可以培養孩子的想像力。"},
      {"id":92, "a":"fraudulent", "b":"deceptive", "ch":"欺诈的", "ex":"The company was accused of making fraudulent claims about their products.", "cn":"該公司被指控對其產品作出欺詐性的聲明。"},
      {"id":93, "a":"futile", "b":"fruitless", "ch":"徒劳的", "ex":"It was futile to try and open the door; it was locked tight.", "cn":"試圖打開那扇門是徒勞的，它鎖得很緊。"},
      {"id":94, "a":"gauge", "b":"measure", "ch":"测量", "ex":"It's hard to gauge how people will react to the news.", "cn":"很難估量人們對這個消息會有何反應。"},
      {"id":95, "a":"generate", "b":"produce", "ch":"产生", "ex":"Wind turbines generate electricity.", "cn":"風力渦輪機產生電力。"},
      {"id":96, "a":"genuine", "b":"authentic", "ch":"真正的", "ex":"Is that a genuine diamond or is it fake?", "cn":"那是真正的鑽石還是假的？"},
      {"id":97, "a":"grasp", "b":"comprehend", "ch":"理解", "ex":"The concept was too difficult for me to grasp at first.", "cn":"這個概念太難了，我一開始無法理解。"},
      {"id":98, "a":"hinder", "b":"impede", "ch":"阻碍", "ex":"Bad weather can hinder the progress of a construction project.", "cn":"惡劣的天氣會阻礙建築項目的進度。"},
      {"id":99, "a":"immerse", "b":"engross", "ch":"沉浸", "ex":"When I read a good book, I like to immerse myself completely in the story.", "cn":"我讀一本好書時，喜歡讓自己完全沉浸在故事中。"},
      {"id":100, "a":"impair", "b":"damage", "ch":"损害", "ex":"Drinking too much soda can impair your teeth.", "cn":"喝太多汽水會損害你的牙齒。"},
      {"id":101, "a":"imperative", "b":"crucial", "ch":"紧要的", "ex":"It is imperative to wear a seatbelt when driving.", "cn":"開車時繫安全帶是必要的。"},
      {"id":102, "a":"implement", "b":"execute", "ch":"实施", "ex":"The school will implement a new homework policy next week.", "cn":"學校下週將實施新的作業政策。"},
      {"id":103, "a":"implicate", "b":"involve", "ch":"涉及", "ex":"His testimony implicated his friend in the prank.", "cn":"他的證詞顯示他的朋友涉及了那個惡作劇。"},
      {"id":104, "a":"implicit", "b":"implied", "ch":"隐含的", "ex":"There was an implicit trust between the old friends.", "cn":"老友之間存在著一種不言而喻的信任。"},
      {"id":105, "a":"impose", "b":"enforce", "ch":"强加", "ex":"My parents don't impose too many rules on me.", "cn":"我父母沒有強加太多規矩在我身上。"},
      {"id":106, "a":"incentive", "b":"motivation", "ch":"动机", "ex":"The bonus was a great incentive for the team to work harder.", "cn":"獎金是激勵團隊更努力工作的好誘因。"},
      {"id":107, "a":"incidental", "b":"secondary", "ch":"附带的", "ex":"Finding a $5 bill in my pocket was incidental to doing laundry.", "cn":"在口袋裡找到五塊錢是洗衣服的意外收穫。"},
      {"id":108, "a":"incorporate", "b":"integrate", "ch":"合并", "ex":"Let's incorporate your ideas into the party plan.", "cn":"把我們的想法納入派對計畫吧。"},
      {"id":109, "a":"indigenous", "b":"native", "ch":"土著的", "ex":"The kiwi is an indigenous bird of New Zealand.", "cn":"奇異鳥是紐西蘭的本土鳥類。"},
      {"id":110, "a":"induce", "b":"provoke", "ch":"引发", "ex":"This medicine might induce sleepiness, so don't drive after taking it.", "cn":"這種藥可能會引起嗜睡，所以服用後不要開車。"},
      {"id":111, "a":"infer", "b":"deduce", "ch":"推断", "ex":"From his sad face, I inferred that he failed the test.", "cn":"從他悲傷的臉，我推斷他考試沒通過。"},
      {"id":112, "a":"ingenious", "b":"innovative", "ch":"巧妙的", "ex":"What an ingenious way to reuse plastic bottles!", "cn":"這真是個再利用塑膠瓶的巧妙方法！"},
      {"id":113, "a":"inherent", "b":"intrinsic", "ch":"固有的", "ex":"There is an inherent risk in every adventure sport.", "cn":"每一種極限運動都有其固有的風險。"},
      {"id":114, "a":"inhibit", "b":"restrain", "ch":"抑制", "ex":"His fear of water inhibited him from learning to swim.", "cn":"他對水的恐懼抑制了他學習游泳。"},
      {"id":115, "a":"initiate", "b":"commence", "ch":"开始", "ex":"They will initiate the construction project next month.", "cn":"他們將在下個月啟動這個建設計畫。"},
      {"id":116, "a":"innovate", "b":"pioneer", "ch":"创新", "ex":"Companies must innovate to stay competitive.", "cn":"公司必須創新才能保持競爭力。"},
      {"id":117, "a":"inquiry", "b":"investigation", "ch":"调查", "ex":"The store manager is making an inquiry about the missing item.", "cn":"商店經理正在調查遺失的商品。"},
      {"id":118, "a":"insight", "b":"understanding", "ch":"洞察力", "ex":"The article gives great insight into Japanese culture.", "cn":"這篇文章對日本文化提供了深刻的見解。"},
      {"id":119, "a":"integral", "b":"essential", "ch":"不可或缺的", "ex":"Teamwork is an integral part of this class.", "cn":"團隊合作是這堂課不可或缺的一部分。"},
      {"id":120, "a":"integrity", "b":"honesty", "ch":"正直", "ex":"I admire her for her integrity and kindness.", "cn":"我欽佩她的正直和善良。"}
    ],
    "2026-05-16": [
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
    ],
    "2026-05-23": [
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
      {"id":200, "a":"secure", "b":"obtain", "ch":"獲得", "ex":"She managed to secure a ticket for the concert.", "cn":"她成功獲得了一張演唱會門票。"}
    ],
    "2026-05-30": [
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
    ],
    "2026-06-06": [
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
      {"id":266, "a":"anticipate", "b":"predict", "ch":"預期", "ex":"We anticipate a busy weekend.", "cn":"我們預期一個忙碌的週末。"},
      {"id":267, "a":"apparent", "b":"obvious", "ch":"明顯的", "ex":"The problem was apparent to everyone.", "cn":"這個問題對每個人來說都是明顯的。"},
      {"id":268, "a":"arbitrary", "b":"random", "ch":"任意的", "ex":"The choice seemed arbitrary to me.", "cn":"這個選擇對我來說似乎是任意的。"},
      {"id":269, "a":"articulate", "b":"express", "ch":"清晰地表達", "ex":"She can articulate her ideas clearly.", "cn":"她能清晰地表達自己的想法。"},
      {"id":270, "a":"ascend", "b":"climb", "ch":"上升", "ex":"We watched the balloon ascend into the sky.", "cn":"我們看著氣球升入天空。"},
      {"id":271, "a":"assemble", "b":"gather", "ch":"組裝", "ex":"We need to assemble the furniture.", "cn":"我們需要組裝這件家具。"},
      {"id":272, "a":"assess", "b":"evaluate", "ch":"評估", "ex":"The teacher will assess our performance.", "cn":"老師將評估我們的表現。"},
      {"id":273, "a":"assign", "b":"allocate", "ch":"分配", "ex":"The manager will assign tasks to the team.", "cn":"經理將給團隊分配任務。"},
      {"id":274, "a":"assume", "b":"suppose", "ch":"假設", "ex":"Let's assume he is telling the truth.", "cn":"讓我們假設他說的是真話。"},
      {"id":275, "a":"attain", "b":"achieve", "ch":"獲得", "ex":"She worked hard to attain her goals.", "cn":"她努力工作以實現她的目標。"},
      {"id":276, "a":"attribute", "b":"credit", "ch":"歸因於", "ex":"They attribute their success to hard work.", "cn":"他們把成功歸因於努力工作。"},
      {"id":277, "a":"authorize", "b":"permit", "ch":"授權", "ex":"The manager authorized the payment.", "cn":"經理授權了這筆付款。"},
      {"id":278, "a":"automate", "b":"mechanize", "ch":"自動化", "ex":"We plan to automate the process.", "cn":"我們計劃使這個過程自動化。"},
      {"id":279, "a":"avail", "b":"use", "ch":"利用", "ex":"Please avail yourself of this opportunity.", "cn":"請利用這個機會。"},
      {"id":280, "a":"avoid", "b":"evade", "ch":"避免", "ex":"Try to avoid making the same mistake.", "cn":"儘量避免犯同樣的錯誤。"}
    ],
    "2026-06-20": [
      {"id":281, "a":"await", "b":"wait for", "ch":"等待", "ex":"We await your decision.", "cn":"我們等待你的決定。"},
      {"id":282, "a":"bypass", "b":"circumvent", "ch":"繞過", "ex":"We can bypass the traffic by taking a different route.", "cn":"我們可以走另一條路繞過交通堵塞。"},
      {"id":283, "a":"capture", "b":"seize", "ch":"捕獲", "ex":"The camera can capture beautiful moments.", "cn":"相機可以捕捉美好的瞬間。"},
      {"id":284, "a":"cease", "b":"stop", "ch":"停止", "ex":"The rain has finally ceased.", "cn":"雨終於停止了。"},
      {"id":285, "a":"clarify", "b":"explain", "ch":"澄清", "ex":"Could you clarify your statement?", "cn":"你能澄清一下你的陳述嗎？"},
      {"id":286, "a":"collaborate", "b":"cooperate", "ch":"合作", "ex":"We need to collaborate on this project.", "cn":"我們需要在這個項目中合作。"},
      {"id":287, "a":"compel", "b":"force", "ch":"迫使", "ex":"The law compels us to pay taxes.", "cn":"法律迫使我們納稅。"},
      {"id":288, "a":"compensate", "b":"reimburse", "ch":"補償", "ex":"The company will compensate you for the loss.", "cn":"公司將為你的損失提供補償。"},
      {"id":289, "a":"compile", "b":"gather", "ch":"編譯", "ex":"We need to compile a list of participants.", "cn":"我們需要編製一份參與者名單。"},
      {"id":290, "a":"comply", "b":"obey", "ch":"遵守", "ex":"All employees must comply with the rules.", "cn":"所有員工必須遵守規則。"},
      {"id":291, "a":"compose", "b":"create", "ch":"組成", "ex":"She likes to compose music in her free time.", "cn":"她喜歡在空閒時間作曲。"},
      {"id":292, "a":"comprehend", "b":"understand", "ch":"理解", "ex":"It's difficult to comprehend his theory.", "cn":"很難理解他的理論。"},
      {"id":293, "a":"concede", "b":"admit", "ch":"承認", "ex":"He finally conceded that he was wrong.", "cn":"他終於承認自己錯了。"},
      {"id":294, "a":"conceive", "b":"imagine", "ch":"構想", "ex":"She conceived the idea for the project.", "cn":"她構想了這個項目的想法。"},
      {"id":295, "a":"conclude", "b":"finish", "ch":"得出結論", "ex":"We can conclude that the experiment was successful.", "cn":"我們可以得出結論，實驗是成功的。"},
      {"id":296, "a":"concur", "b":"agree", "ch":"同意", "ex":"I concur with your opinion.", "cn":"我同意你的觀點。"},
      {"id":297, "a":"conduct", "b":"carry out", "ch":"進行", "ex":"We will conduct a survey next week.", "cn":"我們下周將進行一項調查。"},
      {"id":298, "a":"confine", "b":"restrict", "ch":"限制", "ex":"The virus confined us to our homes.", "cn":"病毒把我們限制在家裡。"},
      {"id":299, "a":"confirm", "b":"verify", "ch":"確認", "ex":"Please confirm your reservation.", "cn":"請確認你的預訂。"},
      {"id":300, "a":"conflict", "b":"clash", "ch":"衝突", "ex":"There was a conflict between the two groups.", "cn":"兩個團體之間發生了衝突。"},
      {"id":301, "a":"conform", "b":"comply", "ch":"符合", "ex":"The product must conform to safety standards.", "cn":"產品必須符合安全標準。"},
      {"id":302, "a":"confront", "b":"face", "ch":"面對", "ex":"We need to confront the problem directly.", "cn":"我們需要直接面對這個問題。"},
      {"id":303, "a":"confuse", "b":"mix up", "ch":"混淆", "ex":"Don't confuse the twins; they look alike.", "cn":"不要混淆這對雙胞胎；他們長得很像。"},
      {"id":304, "a":"congratulate", "b":"praise", "ch":"祝賀", "ex":"Let me congratulate you on your success.", "cn":"讓我祝賀你的成功。"},
      {"id":305, "a":"connect", "b":"link", "ch":"連接", "ex":"The bridge connects the two cities.", "cn":"這座橋連接了兩個城市。"},
      {"id":306, "a":"conserve", "b":"preserve", "ch":"保護", "ex":"We must conserve natural resources.", "cn":"我們必須保護自然資源。"},
      {"id":307, "a":"consider", "b":"think about", "ch":"考慮", "ex":"Please consider my proposal.", "cn":"請考慮我的提議。"},
      {"id":308, "a":"consist", "b":"be composed of", "ch":"由...組成", "ex":"The team consists of five members.", "cn":"這個團隊由五名成員組成。"},
      {"id":309, "a":"consolidate", "b":"strengthen", "ch":"鞏固", "ex":"We need to consolidate our position in the market.", "cn":"我們需要鞏固我們在市場中的地位。"},
      {"id":310, "a":"construct", "b":"build", "ch":"建造", "ex":"They plan to construct a new bridge.", "cn":"他們計劃建造一座新橋。"},
      {"id":311, "a":"consult", "b":"ask", "ch":"諮詢", "ex":"You should consult a doctor about your symptoms.", "cn":"你應該就你的症狀諮詢醫生。"},
      {"id":312, "a":"consume", "b":"use up", "ch":"消耗", "ex":"The car consumes a lot of fuel.", "cn":"這輛車消耗大量燃料。"},
      {"id":313, "a":"contemplate", "b":"ponder", "ch":"思考", "ex":"She sat there, contemplating her future.", "cn":"她坐在那裡，思考著自己的未來。"},
      {"id":314, "a":"contemporary", "b":"modern", "ch":"當代的", "ex":"The museum features contemporary art.", "cn":"這家博物館展示當代藝術。"},
      {"id":315, "a":"contempt", "b":"disdain", "ch":"輕蔑", "ex":"He looked at me with contempt.", "cn":"他以輕蔑的眼神看著我。"},
      {"id":316, "a":"contend", "b":"compete", "ch":"爭奪", "ex":"Two teams are contending for the championship.", "cn":"兩支隊伍正在爭奪冠軍。"},
      {"id":317, "a":"contemplate", "b":"ponder", "ch":"思考", "ex":"She sat there, contemplating her future.", "cn":"她坐在那裡，思考著自己的未來。"},
      {"id":318, "a":"contradict", "b":"deny", "ch":"矛盾", "ex":"His actions contradict his words.", "cn":"他的行為與他的話語矛盾。"},
      {"id":319, "a":"contribute", "b":"give", "ch":"貢獻", "ex":"Everyone should contribute to the community.", "cn":"每個人都應該為社區做出貢獻。"},
      {"id":320, "a":"controversial", "b":"debated", "ch":"有爭議的", "ex":"The topic is highly controversial.", "cn":"這個話題極具爭議性。"}
    ]
  }
};

let vocabulary = [];

function loadVocabulary() {
    vocabulary = [];
    let idx = 0;
    Object.keys(vocabularyData.groups).forEach(date => {
        vocabularyData.groups[date].forEach(word => {
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
    return Promise.resolve(vocabulary);
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
        resetAndStart();
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
                example = example.replace(r.word, '____');
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
                        example = example.replace(r.word, '____');
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
                    displayExample = displayExample.replace(r.word, '____');
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
                example = example.replace(r.word, '____');
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
                example = example.replace(r.word, '____');
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

    function resetAndStart() {
        if (isSpeedMode) return;
        const av = getAvailableWords();
        totalWords = av.length;
        masteredIndices = []; unmasteredIndices = [...av];
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
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ masteredIndices, wrongWords, hardWords: [...hardWords], testMode, testDirection, darkMode, fontSizes, selectedDate, autoSpeak })); } catch (e) { }
    }

    function loadProgress() {
        try {
            const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (d) {
                masteredIndices = d.masteredIndices || []; wrongWords = d.wrongWords || {};
                hardWords = new Set(d.hardWords || []); testMode = d.testMode ?? 0; testDirection = d.testDirection ?? 0;
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
    document.addEventListener('DOMContentLoaded', initApp);
}).catch(() => {
    document.addEventListener('DOMContentLoaded', initApp);
});