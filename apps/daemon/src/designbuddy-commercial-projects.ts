export type CommercialStarterMode =
  | 'landing'
  | 'app'
  | 'deck'
  | 'poster'
  | 'dashboard'
  | 'design-system';

export interface CommercialStarterProject {
  key: string;
  name: string;
  mode: CommercialStarterMode;
  prompt: string;
  html: string;
  interactive: true;
}

type CommercialFamily =
  | 'commerce'
  | 'saas'
  | 'service'
  | 'editorial'
  | 'mobile'
  | 'dashboard'
  | 'event'
  | 'portfolio'
  | 'knowledge'
  | 'brand';

interface CommercialProjectSpec {
  slug: string;
  name: string;
  brand: string;
  mode: CommercialStarterMode;
  family: CommercialFamily;
  eyebrow: string;
  headline: string;
  summary: string;
  primary: string;
  secondary: string;
  metrics: [string, string, string][];
  features: [string, string][];
  tags: string[];
}

const SPECS: CommercialProjectSpec[] = [
  {
    slug: 'velora-skincare', name: 'Velora 高端护肤商城', brand: 'VELORA', mode: 'landing', family: 'commerce', eyebrow: 'BOTANICAL SKINCARE · 2026',
    headline: '让肌肤，回到最平衡的状态。', summary: '以成分透明、个性化方案和沉浸式内容建立高端护肤消费体验。', primary: '测试肤质方案', secondary: '收藏系列',
    metrics: [['98%', '天然来源成分', '配方公开可追溯'], ['4.9', '用户平均评分', '来自 8,420 条评价'], ['24h', '顾问响应', '专业护肤建议']],
    features: [['智能肤质诊断', '通过五个问题生成早晚护理步骤与成分建议。'], ['成分实验室', '用清晰的证据解释每一种活性成分。'], ['周期订阅', '根据使用速度自动安排补货，随时暂停。']], tags: ['敏感肌友好', '纯素配方', '可回收包装'],
  },
  {
    slug: 'forma-furniture', name: 'FORMA 家居精选店', brand: 'FORMA', mode: 'landing', family: 'commerce', eyebrow: 'OBJECTS FOR SLOW LIVING',
    headline: '值得一起生活很久的家具。', summary: '把材料、尺度与真实空间故事放在购买决策之前。', primary: '预约空间顾问', secondary: '保存心愿单',
    metrics: [['46', '独立设计师', '全球合作工作室'], ['10y', '结构质保', '核心家具系列'], ['72h', '材质寄样', '免费送达']],
    features: [['空间搭配器', '按房间尺寸组合家具并即时查看预算。'], ['材料档案', '查看木材、织物来源与保养方式。'], ['白手套交付', '预约配送、安装与旧家具回收。']], tags: ['自然材料', '模块化', '小空间方案'],
  },
  {
    slug: 'atelier-fashion', name: 'ATELIER 独立时装店', brand: 'ATELIER / 09', mode: 'landing', family: 'commerce', eyebrow: 'SEASONLESS WARDROBE',
    headline: '不追赶季节，只留下风格。', summary: '用编辑式陈列与完整造型建议重塑独立时装电商。', primary: '探索本期造型', secondary: '加入收藏',
    metrics: [['32', '限量单品', '本期精选'], ['14d', '无忧试穿', '免费预约取件'], ['86%', '小批量制作', '减少库存浪费']],
    features: [['完整造型', '从单品进入可购买的完整穿搭故事。'], ['尺码顾问', '结合品牌版型和历史购买推荐尺码。'], ['衣橱清单', '收藏、对比并规划下一次购买。']], tags: ['独立设计师', '限量制作', '造型编辑'],
  },
  {
    slug: 'morrow-coffee', name: 'MORROW 精品咖啡订阅', brand: 'MORROW', mode: 'landing', family: 'commerce', eyebrow: 'ROASTED WITH INTENT',
    headline: '每个月，认识一片新的产地。', summary: '连接庄园、烘焙师与饮用者的精品咖啡订阅体验。', primary: '匹配我的风味', secondary: '保存订阅',
    metrics: [['18', '合作庄园', '直接贸易'], ['48h', '烘焙后发出', '保持最佳赏味期'], ['4.8', '订阅者评分', '风味匹配准确']],
    features: [['风味匹配', '根据酸度、烘焙度与冲煮方式推荐咖啡。'], ['庄园手记', '每袋咖啡都附带产地、处理法与人物故事。'], ['灵活频率', '一键调整数量、研磨度与寄送日期。']], tags: ['直接贸易', '新鲜烘焙', '可暂停'],
  },
  {
    slug: 'aurelia-jewelry', name: 'AURELIA 珠宝定制', brand: 'AURELIA', mode: 'landing', family: 'commerce', eyebrow: 'MADE TO HOLD A STORY',
    headline: '为重要时刻，留下独一无二的形状。', summary: '从灵感沟通到工艺追踪，建立可信赖的高级珠宝定制旅程。', primary: '开始定制咨询', secondary: '收藏灵感',
    metrics: [['21d', '平均制作周期', '进度全程可见'], ['100%', '来源认证', '宝石与贵金属'], ['1:1', '专属设计师', '从草图到交付']],
    features: [['灵感画板', '保存材质、形状与镶嵌方式形成方向板。'], ['工艺进度', '查看草图确认、选石、制模与镶嵌节点。'], ['终身养护', '预约清洁、检查、改圈与翻新服务。']], tags: ['手工定制', '来源认证', '终身养护'],
  },
  {
    slug: 'orbit-analytics', name: 'Orbit 数据分析平台', brand: 'ORBIT', mode: 'dashboard', family: 'saas', eyebrow: 'DECISIONS, MADE CLEAR',
    headline: '把复杂数据，变成下一步行动。', summary: '面向增长团队的实时指标、洞察与协作工作台。', primary: '打开交互演示', secondary: '保存工作区',
    metrics: [['42%', '分析提速', '自动归因与摘要'], ['18m', '数据刷新', '覆盖核心来源'], ['99.99%', '平台可用性', '企业级保障']],
    features: [['统一指标层', '为团队建立一致、可信的数据定义。'], ['智能异常', '主动解释波动并标记最可能的驱动因素。'], ['协作简报', '把图表、结论与任务整合为可分享简报。']], tags: ['实时分析', 'AI 洞察', '企业权限'],
  },
  {
    slug: 'ledger-finance', name: 'Ledger 财务运营中心', brand: 'LEDGER', mode: 'dashboard', family: 'saas', eyebrow: 'FINANCE OPERATIONS CLOUD',
    headline: '现金流清晰，决策才有余地。', summary: '为成长型企业提供预算、付款、现金预测和审批控制。', primary: '查看财务沙盘', secondary: '收藏方案',
    metrics: [['¥8.6M', '可用现金', '跨 6 个账户'], ['92d', '现金跑道', '基于当前计划'], ['31%', '结账提速', '自动对账']],
    features: [['滚动预测', '随收入和支出变化自动更新现金跑道。'], ['智能审批', '按金额、部门和风险动态路由流程。'], ['自动对账', '连接银行、发票与采购记录减少手工核对。']], tags: ['现金预测', '费用控制', '审计记录'],
  },
  {
    slug: 'peoplebase-hr', name: 'Peoplebase 人才平台', brand: 'PEOPLEBASE', mode: 'dashboard', family: 'saas', eyebrow: 'PEOPLE OPERATIONS, HUMANLY',
    headline: '让每一次成长，都被团队看见。', summary: '覆盖入职、目标、反馈与人才发展的现代 HR 产品体验。', primary: '体验员工旅程', secondary: '保存方案',
    metrics: [['94%', '入职完成率', '首周关键任务'], ['3.8×', '反馈频次', '轻量持续反馈'], ['82', '团队健康分', '较上季 +7']],
    features: [['智能入职', '按角色生成任务、资料与伙伴计划。'], ['成长地图', '把能力、目标和学习资源连接起来。'], ['团队脉搏', '匿名趋势帮助管理者及时行动。']], tags: ['员工体验', '成长路径', '组织洞察'],
  },
  {
    slug: 'muse-ai', name: 'Muse AI 创作空间', brand: 'MUSE', mode: 'app', family: 'saas', eyebrow: 'AN AI STUDIO FOR TEAMS',
    headline: '从一句想法，到一套可交付内容。', summary: '把研究、生成、评审和品牌资产放进同一个创作空间。', primary: '运行创作演示', secondary: '保存空间',
    metrics: [['6.4×', '首稿提速', '跨文案与视觉'], ['58', '品牌规则', '自动检查'], ['12', '协作角色', '精细权限']],
    features: [['多模态画布', '在一个画布中组织文字、图像与视频。'], ['品牌守卫', '自动检查语气、视觉和禁用表达。'], ['版本分支', '探索不同方向，同时保留清晰决策记录。']], tags: ['多模态', '品牌一致', '版本协作'],
  },
  {
    slug: 'sentinel-security', name: 'Sentinel 安全控制台', brand: 'SENTINEL', mode: 'dashboard', family: 'saas', eyebrow: 'SECURITY WITHOUT THE NOISE',
    headline: '更少告警，更快看见真正风险。', summary: '把资产、事件和响应流程整合为可行动的安全运营体验。', primary: '进入威胁演练', secondary: '收藏控制台',
    metrics: [['14m', '平均响应', '较上月 -38%'], ['2,418', '受保护资产', '持续发现'], ['98.7%', '误报过滤', '智能关联']],
    features: [['风险优先级', '综合暴露面、业务影响与攻击路径排序。'], ['事件时间线', '自动拼接跨工具证据，减少调查切换。'], ['响应剧本', '一键执行隔离、通知与复盘流程。']], tags: ['攻击面', '事件响应', '合规证据'],
  },
  {
    slug: 'still-hotel', name: 'STILL 城市度假酒店', brand: 'STILL / HOUSE', mode: 'landing', family: 'service', eyebrow: 'A QUIET HOUSE IN THE CITY',
    headline: '住进城市，也住进片刻安静。', summary: '以空间、在地体验和无打扰服务塑造精品酒店预订体验。', primary: '查询可订房型', secondary: '收藏旅程',
    metrics: [['28', '间独立客房', '每间景观不同'], ['4.9', '住客评分', '安静与服务'], ['12', '在地体验', '每月更新']],
    features: [['房间故事', '用采光、材质和声音描述代替标准房型列表。'], ['慢旅行清单', '由主理人编辑步行可达的城市体验。'], ['无接触管家', '从抵达到夜床服务都可按偏好设置。']], tags: ['精品酒店', '城市漫游', '安静设计'],
  },
  {
    slug: 'sola-restaurant', name: 'SOLA 季节餐厅', brand: 'SOLA', mode: 'landing', family: 'service', eyebrow: 'COASTAL TABLE · SHANGHAI',
    headline: '海岸的味道，按季节抵达餐桌。', summary: '用菜单叙事、食材来源与顺畅订位呈现现代餐饮品牌。', primary: '预约今晚餐位', secondary: '保存菜单',
    metrics: [['8', '道季节菜单', '每六周更新'], ['17', '合作农场', '来源公开'], ['4.8', '用餐评分', '来自真实访客']],
    features: [['当季菜单', '浏览每道菜的风味、来源与搭配建议。'], ['智能订位', '选择座位偏好、过敏信息与纪念日服务。'], ['厨房手记', '认识生产者与厨师正在研究的新风味。']], tags: ['季节菜单', '开放厨房', '自然酒'],
  },
  {
    slug: 'nalu-wellness', name: 'NALU 身心疗愈会所', brand: 'NALU', mode: 'landing', family: 'service', eyebrow: 'RESTORE YOUR RHYTHM',
    headline: '找到适合你的恢复节奏。', summary: '连接评估、课程、理疗与长期进度的高端健康服务体验。', primary: '开始状态评估', secondary: '收藏计划',
    metrics: [['21', '专业疗愈师', '跨五个领域'], ['92%', '计划完成率', '持续陪伴'], ['4.9', '会员满意度', '近 90 天']],
    features: [['状态评估', '从睡眠、压力和活动建立个人基线。'], ['组合方案', '在课程、理疗与营养之间形成可执行计划。'], ['恢复记录', '用轻量反馈观察变化并调整节奏。']], tags: ['睡眠恢复', '身体理疗', '正念课程'],
  },
  {
    slug: 'elsewhere-travel', name: 'ELSEWHERE 私人旅行', brand: 'ELSEWHERE', mode: 'landing', family: 'service', eyebrow: 'JOURNEYS, PERSONALLY MADE',
    headline: '不是去更多地方，而是更深地抵达。', summary: '为小众目的地打造灵感、定制和旅中服务一体的旅行体验。', primary: '定制我的路线', secondary: '收藏目的地',
    metrics: [['34', '小众目的地', '实地验证'], ['1:1', '旅行设计师', '全程服务'], ['86%', '当地合作方', '社区共益']],
    features: [['灵感路线', '从旅行节奏而非热门清单开始探索。'], ['协同规划', '与顾问共同调整住宿、交通和每日安排。'], ['旅中支持', '行程更新、联系人与文件随时可用。']], tags: ['私人定制', '小众目的地', '在地体验'],
  },
  {
    slug: 'habitat-realty', name: 'HABITAT 精品住宅', brand: 'HABITAT', mode: 'landing', family: 'service', eyebrow: 'HOMES WITH A POINT OF VIEW',
    headline: '找到一处，真正适合生活的空间。', summary: '以建筑、社区和真实日常取代传统房源信息堆叠。', primary: '预约私人看房', secondary: '收藏房源',
    metrics: [['62', '精选住宅', '人工审核'], ['11', '城市片区', '生活方式指南'], ['48h', '顾问响应', '专属跟进']],
    features: [['空间档案', '完整查看采光、动线、材料与改造历史。'], ['社区半径', '用步行时间理解咖啡、教育和绿地资源。'], ['购房协作', '在一个空间管理清单、文件与顾问沟通。']], tags: ['建筑住宅', '社区洞察', '私人顾问'],
  },
  {
    slug: 'field-journal', name: 'FIELD 独立文化杂志', brand: 'FIELD / 12', mode: 'deck', family: 'editorial', eyebrow: 'INDEPENDENT CULTURE JOURNAL',
    headline: '记录那些正在改变日常的微小实践。', summary: '将长篇阅读、摄影专题和纸刊订阅整合为克制的编辑体验。', primary: '阅读本期封面', secondary: '收藏文章',
    metrics: [['12', '城市专题', '本期跨域报道'], ['38min', '平均阅读', '深度内容'], ['24K', '纸刊读者', '全球寄送']],
    features: [['沉浸阅读', '适合长文的版式、注释和阅读进度。'], ['视觉专题', '摄影与文字按编辑节奏自然交错。'], ['纸刊档案', '浏览往期目录并订购限量印刷版本。']], tags: ['长篇报道', '摄影专题', '独立出版'],
  },
  {
    slug: 'signal-podcast', name: 'SIGNAL 播客网络', brand: 'SIGNAL', mode: 'app', family: 'editorial', eyebrow: 'STORIES WORTH HEARING',
    headline: '把值得听见的声音，留在日常里。', summary: '面向深度播客的发现、收听、笔记与会员内容体验。', primary: '播放精选节目', secondary: '加入稍后收听',
    metrics: [['42', '原创节目', '持续更新'], ['86min', '周均收听', '会员用户'], ['4.8', '内容评分', '跨平台评价']],
    features: [['章节播放器', '快速定位主题、嘉宾观点与延伸资料。'], ['听中笔记', '一句话保存时间点并同步到个人知识库。'], ['会员频道', '无广告内容、幕后花絮和线下活动。']], tags: ['原创播客', '听中笔记', '会员频道'],
  },
  {
    slug: 'brief-newsroom', name: 'BRIEF 商业新闻站', brand: 'BRIEF', mode: 'landing', family: 'editorial', eyebrow: 'CONTEXT BEFORE COMMENTARY',
    headline: '更快知道发生了什么，更清楚它为何重要。', summary: '用事实摘要、时间线与行业影响建立可信的商业资讯产品。', primary: '打开今日简报', secondary: '保存专题',
    metrics: [['12min', '每日阅读', '覆盖关键动态'], ['36', '行业作者', '专业编辑'], ['07:30', '晨报送达', '工作日更新']],
    features: [['三层摘要', '一分钟、五分钟与深度版本自由切换。'], ['事实时间线', '把事件节点、来源和后续影响放在一起。'], ['行业雷达', '跟踪与你关注公司和赛道相关的信号。']], tags: ['事实核验', '每日简报', '行业雷达'],
  },
  {
    slug: 'margin-books', name: 'MARGIN 艺术书店', brand: 'MARGIN', mode: 'landing', family: 'editorial', eyebrow: 'BOOKS / OBJECTS / CONVERSATIONS',
    headline: '一本书，也是进入另一种生活的入口。', summary: '把策展式选书、编辑推荐与线下活动连接为文化零售体验。', primary: '浏览本月书单', secondary: '收藏书架',
    metrics: [['640', '独立出版物', '持续更新'], ['28', '合作出版社', '全球小型机构'], ['16', '月度活动', '读书会与展览']],
    features: [['主题书架', '由编辑围绕城市、设计与日常策展。'], ['翻阅预览', '在线查看目录、装帧与代表性跨页。'], ['活动日历', '报名作者对谈、工作坊和新书首发。']], tags: ['独立出版', '艺术书', '线下活动'],
  },
  {
    slug: 'archive-museum', name: 'ARCHIVE 数字文化馆', brand: 'ARCHIVE / CITY', mode: 'design-system', family: 'editorial', eyebrow: 'A LIVING DIGITAL ARCHIVE',
    headline: '让城市记忆，被重新发现和连接。', summary: '面向公共文化的藏品浏览、故事策展与研究工具体验。', primary: '探索主题展览', secondary: '保存藏品',
    metrics: [['84K', '数字藏品', '持续开放'], ['126', '主题策展', '跨年代连接'], ['18', '合作机构', '公共授权']],
    features: [['视觉检索', '按颜色、年代、地点与媒介探索藏品。'], ['故事路径', '用人物与事件连接分散的历史材料。'], ['研究清单', '保存、标注并导出规范引用信息。']], tags: ['开放藏品', '数字策展', '研究工具'],
  },
  {
    slug: 'harbor-clinic', name: 'HARBOR 综合诊所', brand: 'HARBOR', mode: 'app', family: 'knowledge', eyebrow: 'CARE THAT STAYS CONNECTED',
    headline: '从第一次咨询，到持续被照顾。', summary: '整合预约、健康记录、方案和医患沟通的现代诊疗体验。', primary: '查找合适医生', secondary: '保存健康计划',
    metrics: [['24h', '在线响应', '非急诊咨询'], ['18', '专业科室', '协同诊疗'], ['4.9', '患者评分', '服务体验']],
    features: [['症状导航', '用清晰问题引导患者进入合适科室。'], ['就诊时间线', '集中查看预约、报告、处方和随访。'], ['家庭健康', '在授权下管理家庭成员的健康任务。']], tags: ['线上预约', '持续随访', '隐私保护'],
  },
  {
    slug: 'kinetic-fitness', name: 'KINETIC 训练平台', brand: 'KINETIC', mode: 'app', family: 'knowledge', eyebrow: 'TRAIN WITH PURPOSE',
    headline: '每一次训练，都知道为什么。', summary: '根据目标、状态和反馈动态调整的个人训练产品。', primary: '生成本周计划', secondary: '收藏训练',
    metrics: [['28d', '训练周期', '渐进调整'], ['86%', '计划完成率', '近三个月'], ['32', '专业教练', '内容审核']],
    features: [['自适应计划', '根据时间、器械和恢复状态调整训练。'], ['动作指导', '分阶段演示、节奏提示与常见错误提醒。'], ['进步记录', '用力量、活动度和主观感受观察变化。']], tags: ['科学训练', '动作指导', '恢复管理'],
  },
  {
    slug: 'north-course', name: 'NORTH 在线课程学院', brand: 'NORTH', mode: 'app', family: 'knowledge', eyebrow: 'LEARN BY MAKING',
    headline: '不是看完一门课，而是完成一个作品。', summary: '以项目、反馈和同伴学习为核心的专业课程平台。', primary: '体验第一节课', secondary: '收藏课程',
    metrics: [['84%', '作品完成率', '项目制学习'], ['1:8', '导师配比', '及时反馈'], ['36K', '学习者', '全球社区']],
    features: [['项目路径', '每个模块都以可交付成果为终点。'], ['结构化反馈', '导师按目标、过程和质量给出具体建议。'], ['同伴工作室', '展示过程、互评并发现不同解法。']], tags: ['项目制', '导师反馈', '学习社区'],
  },
  {
    slug: 'luma-language', name: 'LUMA 语言学习 App', brand: 'LUMA', mode: 'app', family: 'knowledge', eyebrow: 'SPEAK A LITTLE EVERY DAY',
    headline: '每天开口一点，自然进入新的语言。', summary: '围绕真实场景、语音反馈与长期习惯设计的语言学习体验。', primary: '开始口语测评', secondary: '保存学习路径',
    metrics: [['12min', '每日练习', '低负担习惯'], ['42', '真实场景', '生活与工作'], ['91%', '语音识别', '即时反馈']],
    features: [['场景对话', '在点餐、旅行和会议中练习真实表达。'], ['发音教练', '对节奏、重音和具体音素给出反馈。'], ['记忆节奏', '根据掌握程度自动安排复习。']], tags: ['场景口语', '语音反馈', '间隔复习'],
  },
  {
    slug: 'common-good', name: 'COMMON GOOD 公益平台', brand: 'COMMON GOOD', mode: 'landing', family: 'knowledge', eyebrow: 'SMALL ACTIONS, VISIBLE IMPACT',
    headline: '每一份支持，都能看见它走向哪里。', summary: '用透明项目、持续进展和参与路径建立可信的公益体验。', primary: '选择支持项目', secondary: '收藏进展',
    metrics: [['92%', '直接用于项目', '公开财务说明'], ['42K', '受益参与者', '年度累计'], ['126', '在地伙伴', '持续合作']],
    features: [['影响仪表盘', '查看资金、活动和实际结果之间的关系。'], ['人物故事', '由参与者讲述项目如何改变日常。'], ['持续参与', '捐赠之外也可报名志愿、技能与传播任务。']], tags: ['透明公益', '在地伙伴', '持续参与'],
  },
  {
    slug: 'moneta-bank', name: 'MONETA 数字银行 App', brand: 'MONETA', mode: 'app', family: 'mobile', eyebrow: 'MONEY, MADE CALMER',
    headline: '清楚掌握钱，也安心规划生活。', summary: '把账户、预算、目标与安全控制整合为克制的移动金融体验。', primary: '体验资金总览', secondary: '保存目标',
    metrics: [['¥24.8K', '本月可支配', '预测至月末'], ['18%', '自动储蓄', '较上月 +3%'], ['0', '异常交易', '实时监测']],
    features: [['资金视图', '跨账户理解余额、账单和未来现金流。'], ['目标口袋', '自动分配零钱和固定比例完成计划。'], ['即时控制', '冻结卡片、调整限额并管理订阅付款。']], tags: ['资金预测', '自动储蓄', '安全控制'],
  },
  {
    slug: 'dash-delivery', name: 'DASH 即时配送 App', brand: 'DASH', mode: 'app', family: 'mobile', eyebrow: 'YOUR CITY, ON THE WAY',
    headline: '从下单到门口，每一步都更确定。', summary: '覆盖发现、组合下单与实时履约的城市即时配送体验。', primary: '模拟一笔订单', secondary: '收藏常购',
    metrics: [['28min', '平均送达', '核心城区'], ['1.2K', '本地商户', '实时库存'], ['96%', '准时率', '近 30 天']],
    features: [['场景发现', '按早餐、临时补给和聚会快速进入需求。'], ['组合订单', '跨相邻商户合并配送，减少等待与费用。'], ['透明履约', '从备货到骑手路线都提供清晰状态。']], tags: ['实时库存', '组合订单', '履约追踪'],
  },
  {
    slug: 'haven-home', name: 'HAVEN 智能家居 App', brand: 'HAVEN', mode: 'app', family: 'mobile', eyebrow: 'A HOME THAT FEELS RIGHT',
    headline: '让家，自动回到舒服的状态。', summary: '用空间场景、能源洞察和家庭权限简化智能设备管理。', primary: '运行回家场景', secondary: '保存自动化',
    metrics: [['18', '在线设备', '跨 6 个房间'], ['22%', '能源节省', '本月预测'], ['4', '家庭成员', '独立偏好']],
    features: [['空间场景', '一次调整灯光、温度、窗帘和音乐。'], ['自然自动化', '用日出、离家和睡眠状态触发变化。'], ['家庭权限', '为家人和访客设置可理解的访问范围。']], tags: ['场景控制', '能源管理', '家庭共享'],
  },
  {
    slug: 'stagepass-ticket', name: 'STAGEPASS 演出 App', brand: 'STAGEPASS', mode: 'app', family: 'mobile', eyebrow: 'LIVE, CLOSE, UNFORGETTABLE',
    headline: '下一场难忘现场，离你并不远。', summary: '从个性化发现、可信购票到现场服务的一体化演出体验。', primary: '发现附近演出', secondary: '收藏本周',
    metrics: [['240', '本周演出', '覆盖 18 个场馆'], ['100%', '实名票源', '安全保障'], ['4.8', '现场体验', '用户评分']],
    features: [['口味发现', '结合收藏、朋友和城市热度推荐现场。'], ['透明选座', '查看真实视角、价格组成与无障碍信息。'], ['现场模式', '票夹、交通、入场和周边信息集中呈现。']], tags: ['个性推荐', '可信票源', '现场模式'],
  },
  {
    slug: 'volt-charge', name: 'VOLT 充电网络 App', brand: 'VOLT', mode: 'app', family: 'mobile', eyebrow: 'ENERGY FOR EVERY ROAD',
    headline: '找到、预约、充好电，一路更从容。', summary: '面向电动车主的实时充电、路线规划与能源消费体验。', primary: '规划充电路线', secondary: '收藏站点',
    metrics: [['8.4K', '在线充电枪', '实时状态'], ['18min', '快充中位时长', '核心网络'], ['99.2%', '支付成功率', '自动结算']],
    features: [['智能路线', '结合续航、排队和沿途服务规划停靠。'], ['到站预约', '锁定短时充电位并提供导航提醒。'], ['能源账单', '查看费用、碳减排与家庭充电对比。']], tags: ['实时站点', '路线规划', '自动支付'],
  },
  {
    slug: 'route-logistics', name: 'ROUTE 物流指挥中心', brand: 'ROUTE', mode: 'dashboard', family: 'dashboard', eyebrow: 'OPERATIONS IN MOTION',
    headline: '每一票货，都在清晰计划之中。', summary: '面向区域物流团队的运力、异常和履约协作平台。', primary: '打开调度模拟', secondary: '保存视图',
    metrics: [['96.8%', '准时交付', '本周 +1.4%'], ['1,284', '在途订单', '跨 42 条线路'], ['18', '待处理异常', '已自动分级']],
    features: [['运力地图', '实时查看车辆、容量和线路拥堵。'], ['异常工作台', '按影响范围聚合延误、破损与地址问题。'], ['履约预测', '提前识别超时风险并推荐调度动作。']], tags: ['实时调度', '异常管理', '履约预测'],
  },
  {
    slug: 'shelf-retail', name: 'SHELF 零售运营台', brand: 'SHELF', mode: 'dashboard', family: 'dashboard', eyebrow: 'RETAIL, IN SYNC',
    headline: '门店、商品和团队，始终在同一节奏。', summary: '连接销售、库存、陈列与任务执行的多门店运营体验。', primary: '查看门店沙盘', secondary: '保存看板',
    metrics: [['¥4.82M', '本周销售', '同比 +16%'], ['94%', '在架率', '重点商品'], ['82', '门店健康分', '较上周 +5']],
    features: [['区域总览', '从大盘下钻到单店销售、库存与客流。'], ['陈列任务', '发布标准、上传证据并快速完成抽检。'], ['补货建议', '综合销量、活动和在途库存生成建议。']], tags: ['多店运营', '陈列执行', '智能补货'],
  },
  {
    slug: 'impact-esg', name: 'IMPACT ESG 管理平台', brand: 'IMPACT', mode: 'dashboard', family: 'dashboard', eyebrow: 'SUSTAINABILITY, ACCOUNTED FOR',
    headline: '把承诺，变成持续可验证的进展。', summary: '整合碳排、供应链数据、目标与披露流程的 ESG 平台。', primary: '运行减排情景', secondary: '保存报告',
    metrics: [['−18%', '范围一排放', '较基准年'], ['72%', '供应商覆盖', '已完成核验'], ['8', '年度目标', '6 项进度正常']],
    features: [['碳数据账本', '连接能源、采购与差旅，保留完整证据链。'], ['目标路径', '模拟不同举措对成本和减排的影响。'], ['披露中心', '将指标映射到常用框架并协同审核。']], tags: ['碳核算', '供应链', '披露协作'],
  },
  {
    slug: 'chain-supply', name: 'CHAIN 供应链控制塔', brand: 'CHAIN', mode: 'dashboard', family: 'dashboard', eyebrow: 'SEE AHEAD. ACT TOGETHER.',
    headline: '在风险发生之前，看见替代方案。', summary: '贯通需求、采购、生产和库存的供应链决策体验。', primary: '模拟供应中断', secondary: '保存场景',
    metrics: [['14d', '库存覆盖', '核心 SKU'], ['87%', '预测准确率', '滚动 12 周'], ['6', '高风险节点', '已有预案']],
    features: [['端到端视图', '把订单、库存和运输映射到同一网络。'], ['风险雷达', '持续追踪天气、交付和供应商信号。'], ['场景决策', '比较加急、替代采购与库存调整的影响。']], tags: ['需求预测', '风险雷达', '场景规划'],
  },
  {
    slug: 'relay-support', name: 'RELAY 客户服务中心', brand: 'RELAY', mode: 'dashboard', family: 'dashboard', eyebrow: 'SUPPORT THAT MOVES FORWARD',
    headline: '解决一个问题，也改善下一次体验。', summary: '把全渠道会话、知识与产品反馈连接起来的客户服务平台。', primary: '体验服务队列', secondary: '保存工作区',
    metrics: [['2m 18s', '首次响应', '本周 −22s'], ['89%', '一次解决率', '近 30 天'], ['4.8', '满意度', '12,480 次评价']],
    features: [['统一收件箱', '跨聊天、邮件与社交渠道保留完整上下文。'], ['辅助解决', '即时推荐答案、步骤与相似案例。'], ['反馈闭环', '把高频问题自动汇总给产品与运营团队。']], tags: ['全渠道', '智能知识', '反馈闭环'],
  },
  {
    slug: 'nova-launch', name: 'NOVA 新品发布战役', brand: 'NOVA', mode: 'poster', family: 'event', eyebrow: 'LAUNCH SYSTEM · Q4',
    headline: '让下一次发布，成为持续增长的开始。', summary: '覆盖预热、发布、内容矩阵与转化复盘的整合营销界面。', primary: '查看战役节奏', secondary: '收藏内容板',
    metrics: [['18M', '预计触达', '全渠道'], ['42', '内容资产', '已规划'], ['6wk', '战役周期', '四个阶段']],
    features: [['内容矩阵', '为不同渠道和受众规划统一叙事。'], ['发布节奏', '清晰查看预热、揭晓、证明与转化节点。'], ['实时复盘', '将内容表现、销售和社区反馈放在一起。']], tags: ['整合营销', '内容矩阵', '效果复盘'],
  },
  {
    slug: 'afterlight-festival', name: 'AFTERLIGHT 创意节', brand: 'AFTER / LIGHT', mode: 'poster', family: 'event', eyebrow: 'OCT 16—18 · SHANGHAI',
    headline: '三天，把想法带到真实世界。', summary: '为创意节打造阵容发现、议程规划和现场互动体验。', primary: '生成我的日程', secondary: '收藏嘉宾',
    metrics: [['48', '分享嘉宾', '跨 8 个领域'], ['36', '现场活动', '三天持续发生'], ['2.4K', '参与者', '城市创意社区']],
    features: [['阵容发现', '按主题、形式和兴趣探索嘉宾。'], ['个人日程', '收藏活动、处理冲突并接收场地提醒。'], ['现场脉冲', '投票、提问和发现正在发生的临时活动。']], tags: ['创意大会', '个人日程', '现场互动'],
  },
  {
    slug: 'aera-automotive', name: 'AERA 电动汽车发布', brand: 'AERA', mode: 'landing', family: 'event', eyebrow: 'ELECTRIC, WITHOUT COMPROMISE',
    headline: '安静出发，把距离留给想象。', summary: '围绕产品探索、配置、试驾与车主服务设计高端汽车体验。', primary: '预约沉浸试驾', secondary: '保存配置',
    metrics: [['720km', '综合续航', '长途更从容'], ['12min', '补能 300km', '高压平台'], ['3.8s', '零百加速', '双电机版本']],
    features: [['沉浸探索', '用空间、材料和声音讲解设计细节。'], ['配置工作室', '实时组合版本、颜色、轮毂与内饰。'], ['充电旅程', '理解家庭、城市与长途补能方案。']], tags: ['纯电旗舰', '沉浸配置', '预约试驾'],
  },
  {
    slug: 'mizu-beverage', name: 'MIZU 气泡饮品牌', brand: 'MIZU', mode: 'poster', family: 'event', eyebrow: 'TASTE THE BRIGHT SIDE',
    headline: '一口清爽，把今天调亮一点。', summary: '以鲜明视觉、口味探索与社交活动构建年轻饮品品牌。', primary: '找到我的口味', secondary: '收藏限定款',
    metrics: [['6', '自然口味', '零人工色素'], ['0g', '添加糖', '轻盈配方'], ['18', '城市快闪', '本季计划']],
    features: [['口味实验室', '用酸甜、气泡感和场景匹配饮品。'], ['限定联名', '探索艺术家包装与限时风味故事。'], ['城市快闪', '查看附近活动、试饮和周边领取。']], tags: ['零添加糖', '自然风味', '艺术联名'],
  },
  {
    slug: 'inside-recruiting', name: 'INSIDE 雇主品牌计划', brand: 'INSIDE / WORK', mode: 'landing', family: 'event', eyebrow: 'BUILD WHAT MATTERS',
    headline: '加入一群认真解决问题的人。', summary: '用团队故事、真实工作与透明流程重塑招聘转化体验。', primary: '匹配开放职位', secondary: '收藏团队',
    metrics: [['42', '开放职位', '跨 6 个团队'], ['12d', '平均流程', '节点透明'], ['4.7', '候选人体验', '匿名评价']],
    features: [['工作实录', '通过项目、决策和日常认识真实团队。'], ['角色匹配', '按能力、兴趣和工作方式探索机会。'], ['透明进度', '了解每个面试阶段、准备建议与反馈时间。']], tags: ['团队故事', '职位匹配', '透明招聘'],
  },
  {
    slug: 'line-architecture', name: 'LINE 建筑事务所作品集', brand: 'LINE / ARCH', mode: 'landing', family: 'portfolio', eyebrow: 'SPACE, LIGHT, MATERIAL',
    headline: '建筑从一束光和一种生活开始。', summary: '以项目叙事、过程图纸与事务所方法呈现建筑作品。', primary: '浏览精选项目', secondary: '收藏案例',
    metrics: [['38', '完成项目', '跨 9 个城市'], ['14', '设计奖项', '公共与居住'], ['8y', '持续实践', '从研究到建造']],
    features: [['项目叙事', '从场地、问题和生活方式理解设计。'], ['过程档案', '浏览模型、图纸、材料实验与建造节点。'], ['事务所方法', '了解团队如何与客户和工匠协同。']], tags: ['建筑作品', '过程档案', '材料研究'],
  },
  {
    slug: 'grain-photography', name: 'GRAIN 摄影师作品集', brand: 'GRAIN', mode: 'landing', family: 'portfolio', eyebrow: 'PHOTOGRAPHS BY LIN',
    headline: '在普通一刻里，看见没有重复的光。', summary: '面向商业与个人摄影项目的沉浸式作品集体验。', primary: '进入完整系列', secondary: '收藏作品',
    metrics: [['24', '影像系列', '长期项目'], ['11', '国际出版', '纸刊与画册'], ['6', '合作机构', '品牌与文化']],
    features: [['沉浸画廊', '以图像节奏和留白保持完整观看体验。'], ['项目手记', '补充拍摄背景、方法与未采用片段。'], ['委托咨询', '清晰说明商业、编辑与肖像合作流程。']], tags: ['纪实摄影', '商业委托', '出版项目'],
  },
  {
    slug: 'matter-agency', name: 'MATTER 创意机构', brand: 'MATTER', mode: 'landing', family: 'portfolio', eyebrow: 'STRATEGY MADE VISIBLE',
    headline: '把复杂的品牌问题，变成清晰的文化信号。', summary: '用策略、视觉与结果共同构成可信的创意机构案例库。', primary: '查看代表案例', secondary: '收藏能力',
    metrics: [['62', '品牌项目', '全球合作'], ['18', '行业奖项', '策略与体验'], ['74%', '长期客户', '持续合作']],
    features: [['案例深读', '从商业问题到创意系统完整展示过程。'], ['能力组合', '按品牌阶段组合策略、身份与数字体验。'], ['合作方式', '透明说明团队、节奏、预算区间与交付。']], tags: ['品牌策略', '视觉系统', '数字体验'],
  },
  {
    slug: 'noon-fashion', name: 'NOON 时装设计作品集', brand: 'NOON', mode: 'deck', family: 'portfolio', eyebrow: 'COLLECTIONS / RESEARCH / FORM',
    headline: '衣服是身体与时代之间的空间。', summary: '展示系列概念、材料研究、造型与秀场记录的时装作品集。', primary: '查看最新系列', secondary: '收藏造型',
    metrics: [['7', '完整系列', '研究驱动'], ['22', '材料实验', '本季档案'], ['9', '媒体刊载', '独立时装出版']],
    features: [['系列章节', '从概念、廓形到完整造型逐步展开。'], ['材料档案', '记录织物、工艺与失败实验的价值。'], ['合作资料', '为编辑、造型师和买手提供下载入口。']], tags: ['系列设计', '材料研究', '造型档案'],
  },
  {
    slug: 'studio-kite', name: 'KITE 艺术家工作室', brand: 'KITE STUDIO', mode: 'landing', family: 'portfolio', eyebrow: 'WORKS 2021—2026',
    headline: '在材料、时间和偶然之间工作。', summary: '连接作品、展览、研究文本与收藏咨询的艺术家网站。', primary: '浏览当前作品', secondary: '收藏展览',
    metrics: [['46', '在册作品', '跨三种媒介'], ['12', '展览项目', '2021—2026'], ['8', '公共收藏', '机构与基金会']],
    features: [['作品索引', '按年份、媒介与系列浏览高清细节。'], ['展览档案', '保留现场、文本、平面与相关报道。'], ['收藏咨询', '面向机构和个人提供清晰联系与资料。']], tags: ['当代艺术', '展览档案', '收藏咨询'],
  },
  {
    slug: 'counsel-legal', name: 'COUNSEL 企业法务平台', brand: 'COUNSEL', mode: 'dashboard', family: 'brand', eyebrow: 'LEGAL WORK, CLEARLY MANAGED',
    headline: '让合同、风险和协作都有清晰下一步。', summary: '面向企业法务的合同生命周期、事项与外部律师协作体验。', primary: '体验合同流程', secondary: '保存工作区',
    metrics: [['42%', '审批提速', '标准合同'], ['186', '活跃合同', '自动提醒'], ['8', '高风险条款', '待处理']],
    features: [['合同工作流', '从申请、审阅、签署到续约保留完整记录。'], ['条款知识库', '沉淀标准立场、回退方案与谈判历史。'], ['事项预算', '跟踪外部律师进展、费用和关键节点。']], tags: ['合同管理', '风险控制', '法务协作'],
  },
  {
    slug: 'shield-insurance', name: 'SHIELD 数字保险服务', brand: 'SHIELD', mode: 'app', family: 'brand', eyebrow: 'PROTECTION YOU CAN UNDERSTAND',
    headline: '保障应该说得清，也用得上。', summary: '从需求理解、方案对比到理赔进度的透明保险体验。', primary: '测算保障缺口', secondary: '保存方案',
    metrics: [['6min', '完成投保', '常见产品'], ['24h', '理赔预审', '材料齐全'], ['4.8', '服务评分', '真实客户']],
    features: [['保障地图', '用生活事件解释风险与当前缺口。'], ['透明对比', '清楚展示保什么、不保什么和总成本。'], ['理赔助手', '按步骤准备材料并随时查看处理进度。']], tags: ['保障测算', '透明条款', '理赔追踪'],
  },
  {
    slug: 'parcel-network', name: 'PARCEL 跨境物流门户', brand: 'PARCEL', mode: 'dashboard', family: 'brand', eyebrow: 'GLOBAL SHIPPING, ONE VIEW',
    headline: '跨境链路再长，也能一眼掌握。', summary: '面向品牌商家的报价、下单、清关和追踪自助门户。', primary: '试算一票运费', secondary: '保存路线',
    metrics: [['32', '服务国家', '门到门覆盖'], ['96%', '准时交付', '核心线路'], ['2h', '报价响应', '复杂货型']],
    features: [['智能报价', '根据货型、时效和清关要求比较方案。'], ['文件中心', '生成、校验并归档运输与报关材料。'], ['端到端追踪', '把国内段、干线、清关和末端放在一起。']], tags: ['跨境运输', '清关文件', '全程追踪'],
  },
  {
    slug: 'acre-agriculture', name: 'ACRE 智慧农业平台', brand: 'ACRE', mode: 'dashboard', family: 'brand', eyebrow: 'GROW WITH BETTER SIGNALS',
    headline: '读懂土地，也更从容地安排每一季。', summary: '结合田块、天气、投入品与作业记录的农业决策体验。', primary: '查看田块模拟', secondary: '保存农事计划',
    metrics: [['1,840ha', '管理面积', '跨 26 个田块'], ['−18%', '灌溉用水', '本季累计'], ['92%', '作业完成率', '按计划推进']],
    features: [['田块脉搏', '整合天气、土壤和遥感变化形成提醒。'], ['农事计划', '协调人员、设备和投入品的最佳窗口。'], ['产季复盘', '比较投入、作业与产量，沉淀下一季经验。']], tags: ['田块监测', '农事计划', '投入分析'],
  },
  {
    slug: 'grid-energy', name: 'GRID 清洁能源平台', brand: 'GRID', mode: 'dashboard', family: 'brand', eyebrow: 'CLEAN ENERGY, ORCHESTRATED',
    headline: '让分布式能源，成为可靠的共同网络。', summary: '面向能源运营商的资产监控、预测和市场调度体验。', primary: '运行负荷情景', secondary: '保存调度方案',
    metrics: [['286MW', '在线容量', '光储充资产'], ['98.4%', '资产可用率', '近 30 天'], ['18%', '峰值削减', '今日预测']],
    features: [['资产全景', '实时掌握发电、储能、充电与告警状态。'], ['供需预测', '结合天气、价格和历史负荷生成滚动预测。'], ['灵活调度', '在收益、稳定和寿命之间比较策略。']], tags: ['分布式能源', '负荷预测', '灵活调度'],
  },
];

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

interface FamilyTheme {
  ink: string;
  paper: string;
  accent: string;
  accentAlt: string;
  soft: string;
  panel: string;
}

interface FamilyExperienceCopy {
  label: string;
  title: string;
  intro: string;
  actionTitle: string;
  actionBody: string;
  actionLabel: string;
  nav: [string, string, string];
}

const FAMILY_THEMES: Record<CommercialFamily, FamilyTheme> = {
  commerce: { ink: '#201b18', paper: '#f4efe7', accent: '#d66846', accentAlt: '#6f8f69', soft: '#e6d9ca', panel: '#fffaf3' },
  saas: { ink: '#101729', paper: '#f4f6fb', accent: '#735cff', accentAlt: '#35b6a4', soft: '#e2e6f4', panel: '#ffffff' },
  service: { ink: '#1b2823', paper: '#f3eee5', accent: '#c58252', accentAlt: '#577c6a', soft: '#ded5c7', panel: '#fffaf1' },
  editorial: { ink: '#151515', paper: '#f2eee6', accent: '#e85735', accentAlt: '#2458a6', soft: '#ddd5ca', panel: '#fffdf8' },
  knowledge: { ink: '#173027', paper: '#f1f5ed', accent: '#8bcf68', accentAlt: '#4a89d8', soft: '#dce8d5', panel: '#fbfdf8' },
  mobile: { ink: '#17213a', paper: '#f2f4f8', accent: '#6382ff', accentAlt: '#ff8067', soft: '#dde3f2', panel: '#ffffff' },
  dashboard: { ink: '#101b22', paper: '#edf2f3', accent: '#49d5a1', accentAlt: '#f4b95f', soft: '#d7e3e2', panel: '#f9fcfc' },
  event: { ink: '#181412', paper: '#f3eddc', accent: '#ff5f38', accentAlt: '#a8ee65', soft: '#e5d6bd', panel: '#fff9e9' },
  portfolio: { ink: '#191816', paper: '#efede7', accent: '#bad46b', accentAlt: '#6789d8', soft: '#d9d5cb', panel: '#f9f7f1' },
  brand: { ink: '#102329', paper: '#edf4f1', accent: '#42c9ae', accentAlt: '#f0a653', soft: '#d4e5df', panel: '#f9fcfb' },
};

const FAMILY_COPY: Record<CommercialFamily, FamilyExperienceCopy> = {
  commerce: {
    label: 'CURATED COMMERCE', title: '从看见，到真正想拥有。',
    intro: '商品、材质与使用场景被放在同一条选择路径中，每一次点击都有明确结果。',
    actionTitle: '你的精选清单', actionBody: '确认偏好后，我们会生成一套匹配当前需求的商品组合。', actionLabel: '查看购物袋',
    nav: ['精选系列', '产品细节', '服务保障'],
  },
  saas: {
    label: 'LIVE PRODUCT WORKSPACE', title: '真实数据，直接进入下一步。',
    intro: '不是装饰性的后台截图，而是一套可筛选、可下钻、可处理的工作空间。',
    actionTitle: '创建工作区视图', actionBody: '保存当前指标、筛选条件和团队协作方式。', actionLabel: '保存当前视图',
    nav: ['实时概览', '产品工作台', '团队动态'],
  },
  service: {
    label: 'PERSONAL SERVICE JOURNEY', title: '先理解需要，再安排体验。',
    intro: '时间、偏好和服务内容在一个连续流程里完成，避免来回确认。',
    actionTitle: '预约摘要', actionBody: '选择时间和体验方向，立即生成一份清晰的预约安排。', actionLabel: '确认预约方案',
    nav: ['服务体验', '可订时间', '专属方案'],
  },
  editorial: {
    label: 'EDITORIAL EXPERIENCE', title: '内容有节奏，观点有停留。',
    intro: '封面、长文、声音与档案形成有层次的阅读路径，而不是信息卡片堆叠。',
    actionTitle: '个人阅读清单', actionBody: '把专题、音频和延伸资料保存为稍后阅读清单。', actionLabel: '打开阅读清单',
    nav: ['本期封面', '精选内容', '阅读档案'],
  },
  knowledge: {
    label: 'GUIDED PROGRESS', title: '每一步，都看得见进展。',
    intro: '把复杂知识拆成清晰任务、专业反馈和可以持续完成的个人计划。',
    actionTitle: '生成个人计划', actionBody: '根据当前目标整理下一步任务，并保存进度。', actionLabel: '查看我的计划',
    nav: ['今日任务', '进度路径', '专业资源'],
  },
  mobile: {
    label: 'MOBILE PRODUCT FLOW', title: '重要操作，一只手就能完成。',
    intro: '从总览到确认状态，关键任务被组织成连续、可返回的移动端流程。',
    actionTitle: '操作确认', actionBody: '检查本次操作信息，然后查看完成后的状态变化。', actionLabel: '继续当前操作',
    nav: ['产品总览', '移动流程', '安全与状态'],
  },
  dashboard: {
    label: 'OPERATIONS COMMAND', title: '异常先被看见，行动随后发生。',
    intro: '指标、地图、任务和异常被放在统一运营语境中，支持快速判断和处理。',
    actionTitle: '运营处理单', actionBody: '汇总选中的异常、负责人和建议动作。', actionLabel: '创建处理任务',
    nav: ['运营态势', '异常中心', '执行记录'],
  },
  event: {
    label: 'LIVE MOMENT SYSTEM', title: '从预热，到现场，再到持续传播。',
    intro: '视觉、日程、嘉宾和票务共同形成完整的品牌事件体验。',
    actionTitle: '活动通行证', actionBody: '确认日期、场次与票种，生成个人活动安排。', actionLabel: '选择活动通行证',
    nav: ['活动主张', '现场日程', '票务体验'],
  },
  portfolio: {
    label: 'SELECTED PRACTICE', title: '作品不是排列，而是完整叙事。',
    intro: '从背景、过程到结果，每个案例都拥有独立的观看节奏和细节。',
    actionTitle: '项目咨询', actionBody: '保存感兴趣的案例方向，并形成一份合作需求摘要。', actionLabel: '发起项目咨询',
    nav: ['精选项目', '创作过程', '合作方式'],
  },
  brand: {
    label: 'CONNECTED INDUSTRY', title: '复杂业务，也可以清晰运转。',
    intro: '把资产、流程和关键状态组织成可信、可追踪的行业产品体验。',
    actionTitle: '业务情景方案', actionBody: '根据当前目标生成一套可执行、可追踪的情景方案。', actionLabel: '运行业务情景',
    nav: ['业务全景', '核心能力', '执行方案'],
  },
};

function coverPath(index: number, offset = 0): string {
  return `/mock-covers/cover-${(index * 3 + offset) % 12}.jpg`;
}

function renderMetricStrip(spec: CommercialProjectSpec): string {
  return `<section class="metric-strip" id="proof"><div class="wide metric-grid">${spec.metrics.map((item, metricIndex) => `
    <article><span>0${metricIndex + 1}</span><strong>${escapeHtml(item[0])}</strong><b>${escapeHtml(item[1])}</b><p>${escapeHtml(item[2])}</p></article>`).join('')}</div></section>`;
}

function renderHeroVisual(spec: CommercialProjectSpec, index: number): string {
  const [primaryMetric] = spec.metrics;
  const imageA = coverPath(index);
  const imageB = coverPath(index, 1);
  switch (spec.family) {
    case 'commerce':
      return `<div class="hero-visual commerce-hero"><img src="${imageA}" alt=""><div class="product-object"><i></i><span>${escapeHtml(spec.tags[0])}</span><b>${escapeHtml(spec.brand)}</b><small>${escapeHtml(primaryMetric![0])} · ${escapeHtml(primaryMetric![1])}</small></div><div class="visual-caption"><span>CURATED / 0${index % 5 + 1}</span><b>${escapeHtml(spec.features[0]![0])}</b></div></div>`;
    case 'saas':
      return `<div class="hero-visual software-hero"><div class="software-top"><i></i><i></i><i></i><span>${escapeHtml(spec.brand)} / LIVE</span></div><div class="software-shell"><aside><b>${escapeHtml(spec.brand.slice(0, 2))}</b><i class="on"></i><i></i><i></i><i></i></aside><div class="software-main"><header><span>Overview</span><em>Last 30 days⌄</em></header><div class="software-kpis">${spec.metrics.map((item) => `<div><small>${escapeHtml(item[1])}</small><b>${escapeHtml(item[0])}</b><span>↗ LIVE</span></div>`).join('')}</div><div class="line-chart"><svg viewBox="0 0 560 180" preserveAspectRatio="none" aria-hidden="true"><path class="grid-line" d="M0 35H560M0 90H560M0 145H560"/><path class="area" d="M0 152 C80 130 95 82 160 105 S260 38 320 68 S430 18 560 42 L560 180 L0 180Z"/><path class="line" d="M0 152 C80 130 95 82 160 105 S260 38 320 68 S430 18 560 42"/></svg></div></div></div></div>`;
    case 'service':
      return `<div class="hero-visual service-hero"><img src="${imageA}" alt=""><div class="image-wash"></div><div class="availability-card"><small>NEXT AVAILABLE</small><b>周五 · 18:30</b><p>${escapeHtml(spec.tags.join(' · '))}</p><div><span class="avatar-dot"></span><span>专属顾问在线</span></div></div><span class="image-index">0${index % 5 + 1} / EXPERIENCE</span></div>`;
    case 'editorial':
      return `<div class="hero-visual editorial-hero"><article class="cover-main"><img src="${imageA}" alt=""><span>ISSUE / ${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(spec.brand)}</b></article><article class="cover-story"><img src="${imageB}" alt=""><small>FEATURE STORY</small><h3>${escapeHtml(spec.features[0]![0])}</h3><p>${escapeHtml(spec.features[0]![1])}</p></article></div>`;
    case 'knowledge':
      return `<div class="hero-visual knowledge-hero"><aside><b>${escapeHtml(spec.brand.slice(0, 1))}</b><span class="active">01</span><span>02</span><span>03</span><span>04</span></aside><main><div class="knowledge-top"><span>TODAY'S FOCUS</span><i>68% COMPLETE</i></div><h3>${escapeHtml(spec.features[0]![0])}</h3><p>${escapeHtml(spec.features[0]![1])}</p><div class="knowledge-progress"><i></i></div><div class="knowledge-tasks"><span>✓　完成状态评估</span><span>○　${escapeHtml(spec.features[1]![0])}</span><span>○　${escapeHtml(spec.features[2]![0])}</span></div></main></div>`;
    case 'mobile':
      return `<div class="hero-visual mobile-hero"><div class="phone phone-back"><header>9:41 <span>● ● ▰</span></header><img src="${imageA}" alt=""><small>${escapeHtml(spec.tags[0])}</small><b>${escapeHtml(primaryMetric![0])}</b></div><div class="phone phone-front"><header>9:41 <span>● ● ▰</span></header><small>${escapeHtml(spec.brand)}</small><h3>${escapeHtml(primaryMetric![0])}</h3><p>${escapeHtml(primaryMetric![2])}</p><div class="phone-chart"><i></i><i></i><i></i><i></i><i></i></div><div class="phone-actions"><span>↗</span><span>＋</span><span>✓</span></div><nav><i></i><i class="active"></i><i></i><i></i></nav></div></div>`;
    case 'dashboard':
      return `<div class="hero-visual command-hero"><div class="command-head"><span>● SYSTEM LIVE</span><b>${escapeHtml(spec.brand)} CONTROL</b><em>•••</em></div><div class="command-grid"><div class="command-map"><i class="route r1"></i><i class="route r2"></i><span class="node n1"></span><span class="node n2"></span><span class="node n3"></span><small>${escapeHtml(spec.tags[0])}</small></div><div class="command-stats">${spec.metrics.map((item) => `<article><small>${escapeHtml(item[1])}</small><b>${escapeHtml(item[0])}</b><span>${escapeHtml(item[2])}</span></article>`).join('')}</div></div></div>`;
    case 'event':
      return `<div class="hero-visual event-hero"><img src="${imageA}" alt=""><div class="event-poster"><small>LIVE EXPERIENCE · 2026</small><b>${escapeHtml(spec.brand)}</b><p>${escapeHtml(spec.eyebrow)}</p><span>0${index % 5 + 1}</span></div><div class="event-ticket"><small>ADMIT ONE</small><b>${escapeHtml(spec.primary)}</b><i></i></div></div>`;
    case 'portfolio':
      return `<div class="hero-visual portfolio-hero"><figure class="work-one"><img src="${imageA}" alt=""><figcaption>01 · ${escapeHtml(spec.tags[0])}</figcaption></figure><figure class="work-two"><img src="${imageB}" alt=""><figcaption>02 · ${escapeHtml(spec.tags[1])}</figcaption></figure><div class="portfolio-stamp"><span>SELECTED</span><b>20<br>26</b></div></div>`;
    default:
      return `<div class="hero-visual industry-hero"><div class="industry-orbit"><i></i><i></i><i></i><b>${escapeHtml(spec.brand.slice(0, 1))}</b></div><div class="industry-panel"><header><span>NETWORK / LIVE</span><em>•••</em></header>${spec.metrics.map((item, metricIndex) => `<article><i>0${metricIndex + 1}</i><div><small>${escapeHtml(item[1])}</small><b>${escapeHtml(item[0])}</b></div><span>${escapeHtml(item[2])}</span></article>`).join('')}</div></div>`;
  }
}

function featureButton(feature: [string, string], index: number): string {
  return `<button type="button" class="feature-card${index === 0 ? ' active' : ''}" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><span>0${index + 1}</span><h3>${escapeHtml(feature[0])}</h3><p>${escapeHtml(feature[1])}</p><i>↗</i></button>`;
}

function renderCommerceExperience(spec: CommercialProjectSpec, index: number): string {
  return `<div class="commerce-layout experience-layout"><div class="product-gallery">${spec.features.map((feature, itemIndex) => `<button type="button" class="shop-item${itemIndex === 0 ? ' active' : ''}" data-choice="${escapeHtml(feature[0])}" data-group="product"><img src="${coverPath(index, itemIndex)}" alt=""><span>0${itemIndex + 1}</span><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(spec.tags[itemIndex] ?? spec.tags[0])}</small></button>`).join('')}</div><aside class="shop-summary"><small>YOUR SELECTION</small><h3 data-choice-output="product">${escapeHtml(spec.features[0]![0])}</h3><p>${escapeHtml(spec.features[0]![1])}</p><div class="option-row"><span>规格</span><div><button type="button" class="chip active" data-choice="标准" data-group="size">标准</button><button type="button" class="chip" data-choice="臻选" data-group="size">臻选</button></div></div><div class="shop-price"><span>专属组合</span><b>${escapeHtml(spec.metrics[0]![0])}</b></div><button class="solid wide-button" type="button" data-add>加入精选袋　↗</button></aside></div>`;
}

function renderSaasExperience(spec: CommercialProjectSpec): string {
  return `<div class="saas-layout experience-layout"><aside class="product-rail"><b>${escapeHtml(spec.brand.slice(0, 2))}</b><button type="button" class="active" data-detail="总览" data-copy="查看团队当前最重要的变化与任务。">⌁</button><button type="button" data-detail="自动洞察" data-copy="聚合异常并解释最可能的驱动因素。">✦</button><button type="button" data-detail="协作记录" data-copy="把结论、负责人和截止时间放在一起。">◎</button></aside><main class="product-workspace"><header><div><small>WORKSPACE / LIVE</small><h3>${escapeHtml(spec.features[0]![0])}</h3></div><div class="periods"><button type="button" data-period="7 天">7D</button><button type="button" class="active" data-period="30 天">30D</button><button type="button" data-period="90 天">90D</button></div></header><div class="workspace-kpis">${spec.metrics.map((item) => `<article><span>${escapeHtml(item[1])}</span><b>${escapeHtml(item[0])}</b><small>${escapeHtml(item[2])}</small></article>`).join('')}</div><div class="workspace-body"><div class="big-chart"><div class="chart-label"><b>趋势与预测</b><span data-period-output>过去 30 天</span></div><svg viewBox="0 0 700 260" preserveAspectRatio="none"><path class="grid-line" d="M0 52H700M0 130H700M0 208H700"/><path class="area" d="M0 220 C70 190 90 122 160 154 S270 74 340 112 S470 35 550 73 S630 42 700 28 L700 260 L0 260Z"/><path class="line" d="M0 220 C70 190 90 122 160 154 S270 74 340 112 S470 35 550 73 S630 42 700 28"/></svg></div><div class="activity-list"><b>需要关注</b>${spec.features.map((feature, featureIndex) => `<button type="button" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><i>${featureIndex === 0 ? '!' : '↗'}</i><span><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(feature[1])}</small></span></button>`).join('')}</div></div></main></div>`;
}

function renderServiceExperience(spec: CommercialProjectSpec, index: number): string {
  const days = ['周四 16', '周五 17', '周六 18', '周日 19'];
  return `<div class="service-layout experience-layout"><div class="service-scenes"><figure><img src="${coverPath(index, 1)}" alt=""><figcaption><span>01</span><b>${escapeHtml(spec.features[0]![0])}</b></figcaption></figure><div class="service-cards">${spec.features.slice(1).map((feature, featureIndex) => `<button type="button" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><span>0${featureIndex + 2}</span><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(feature[1])}</small></button>`).join('')}</div></div><aside class="booking-panel"><small>SELECT A MOMENT</small><h3>安排你的体验</h3><div class="date-grid">${days.map((day, dayIndex) => `<button type="button" class="${dayIndex === 1 ? 'active' : ''}" data-choice="${day}" data-group="date"><span>${day.split(' ')[0]}</span><b>${day.split(' ')[1]}</b></button>`).join('')}</div><label>体验方向<div class="select-like" data-choice-output="service">${escapeHtml(spec.features[0]![0])}<span>⌄</span></div></label><div class="booking-meta"><span><i></i> 专属顾问在线</span><b data-choice-output="date">周五 17</b></div><button class="solid wide-button" type="button" data-open-action>${escapeHtml(FAMILY_COPY.service.actionLabel)}　↗</button></aside></div>`;
}

function renderEditorialExperience(spec: CommercialProjectSpec, index: number): string {
  return `<div class="editorial-layout experience-layout"><article class="lead-story"><img src="${coverPath(index, 2)}" alt=""><div><small>LONG READ · 12 MIN</small><h3>${escapeHtml(spec.features[0]![0])}</h3><p>${escapeHtml(spec.features[0]![1])}</p><button type="button" class="text-button" data-detail="${escapeHtml(spec.features[0]![0])}" data-copy="${escapeHtml(spec.features[0]![1])}">进入沉浸阅读　↗</button></div></article><div class="story-stack">${spec.features.slice(1).map((feature, storyIndex) => `<button type="button" class="story-row" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><span>0${storyIndex + 2}</span><div><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(feature[1])}</small></div><i>↗</i></button>`).join('')}<div class="audio-player"><button type="button" data-play aria-label="播放">▶</button><div><b>${escapeHtml(spec.brand)} · 编辑精选</b><span><i></i></span></div><small>08:42</small></div></div></div>`;
}

function renderKnowledgeExperience(spec: CommercialProjectSpec): string {
  return `<div class="knowledge-layout experience-layout"><aside class="lesson-list"><small>YOUR PATH</small>${spec.features.map((feature, lessonIndex) => `<button type="button" class="${lessonIndex === 0 ? 'active' : ''}" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><i>${lessonIndex === 0 ? '✓' : `0${lessonIndex + 1}`}</i><span><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(feature[1])}</small></span></button>`).join('')}</aside><main class="lesson-focus"><div class="lesson-breadcrumb">MODULE 01　/　${escapeHtml(spec.tags[0])}</div><h3>${escapeHtml(spec.features[0]![0])}</h3><p>${escapeHtml(spec.features[0]![1])}</p><div class="lesson-note"><span>专业提示</span><b>${escapeHtml(spec.metrics[0]![2])}</b></div><div class="check-list">${['完成基础信息', `了解${spec.features[1]![0]}`, `开始${spec.features[2]![0]}`].map((label, checkIndex) => `<button type="button" class="${checkIndex === 0 ? 'done' : ''}" data-check><i>${checkIndex === 0 ? '✓' : ''}</i><span>${escapeHtml(label)}</span></button>`).join('')}</div><div class="completion"><span>本模块进度</span><div><i></i></div><b data-progress>1 / 3</b></div></main></div>`;
}

function renderMobileExperience(spec: CommercialProjectSpec): string {
  return `<div class="mobile-layout experience-layout"><aside class="mobile-copy"><small>ONE-HAND FLOW</small><h3>${escapeHtml(spec.features[0]![0])}</h3><p>${escapeHtml(spec.features[0]![1])}</p><div class="mobile-nav">${spec.features.map((feature, screenIndex) => `<button type="button" class="${screenIndex === 0 ? 'active' : ''}" data-screen="screen-${screenIndex}" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><span>0${screenIndex + 1}</span><b>${escapeHtml(feature[0])}</b></button>`).join('')}</div></aside><div class="device-stage">${spec.features.map((feature, screenIndex) => `<article class="device-screen${screenIndex === 0 ? ' active' : ''}" data-screen-panel="screen-${screenIndex}"><header><span>9:41</span><b>${escapeHtml(spec.brand)}</b><i>•••</i></header><small>${escapeHtml(spec.tags[screenIndex] ?? spec.tags[0])}</small><h3>${escapeHtml(spec.metrics[screenIndex]![0])}</h3><p>${escapeHtml(feature[1])}</p><div class="mobile-card"><span>${escapeHtml(spec.metrics[screenIndex]![1])}</span><b>${escapeHtml(spec.metrics[screenIndex]![2])}</b><i></i></div><div class="mobile-list"><span><i></i>${escapeHtml(spec.features[(screenIndex + 1) % 3]![0])}<b>›</b></span><span><i></i>${escapeHtml(spec.features[(screenIndex + 2) % 3]![0])}<b>›</b></span></div><button type="button" class="solid" data-open-action>继续操作　↗</button></article>`).join('')}</div></div>`;
}

function renderDashboardExperience(spec: CommercialProjectSpec): string {
  return `<div class="dashboard-layout experience-layout"><header class="ops-toolbar"><div><small>CONTROL ROOM</small><h3>${escapeHtml(spec.features[0]![0])}</h3></div><div><button type="button" class="chip active" data-period="实时">实时</button><button type="button" class="chip" data-period="今日">今日</button><button type="button" class="chip" data-period="本周">本周</button></div></header><div class="ops-kpis">${spec.metrics.map((item) => `<article><span>${escapeHtml(item[1])}</span><b>${escapeHtml(item[0])}</b><small>${escapeHtml(item[2])}</small></article>`).join('')}</div><div class="ops-grid"><div class="ops-map"><div class="map-grid"></div><i class="map-path p1"></i><i class="map-path p2"></i><button type="button" class="map-node node-a" data-detail="${escapeHtml(spec.features[0]![0])}" data-copy="${escapeHtml(spec.features[0]![1])}">A</button><button type="button" class="map-node node-b" data-detail="${escapeHtml(spec.features[1]![0])}" data-copy="${escapeHtml(spec.features[1]![1])}">B</button><button type="button" class="map-node node-c" data-detail="${escapeHtml(spec.features[2]![0])}" data-copy="${escapeHtml(spec.features[2]![1])}">C</button><span>LIVE NETWORK</span></div><div class="incident-list"><header><b>优先处理</b><span>3 ACTIVE</span></header>${spec.features.map((feature, incidentIndex) => `<button type="button" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><i class="sev-${incidentIndex}"></i><span><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(feature[1])}</small></span><em>${incidentIndex === 0 ? '高' : incidentIndex === 1 ? '中' : '低'}</em></button>`).join('')}<button type="button" class="solid wide-button" data-open-action>创建处理任务　↗</button></div></div></div>`;
}

function renderEventExperience(spec: CommercialProjectSpec, index: number): string {
  return `<div class="event-layout experience-layout"><div class="agenda"><header><small>PROGRAM / 2026</small><h3>现场日程</h3></header>${spec.features.map((feature, agendaIndex) => `<button type="button" class="agenda-row${agendaIndex === 0 ? 'active' : ''}" data-choice="${escapeHtml(feature[0])}" data-group="session" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><span>${String(10 + agendaIndex * 3).padStart(2, '0')}:00</span><div><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(feature[1])}</small></div><i>↗</i></button>`).join('')}</div><aside class="ticket-panel"><img src="${coverPath(index, 1)}" alt=""><small>YOUR PASS</small><h3 data-choice-output="session">${escapeHtml(spec.features[0]![0])}</h3><p>${escapeHtml(spec.summary)}</p><div class="ticket-types"><button type="button" class="active" data-choice="现场通行证" data-group="ticket">现场</button><button type="button" data-choice="线上通行证" data-group="ticket">线上</button></div><div class="ticket-total"><span data-choice-output="ticket">现场通行证</span><b>${escapeHtml(spec.metrics[0]![0])}</b></div><button type="button" class="solid wide-button" data-open-action>确认通行证　↗</button></aside></div>`;
}

function renderPortfolioExperience(spec: CommercialProjectSpec, index: number): string {
  return `<div class="portfolio-layout experience-layout"><header><div><small>SELECTED WORK / 2026</small><h3>项目不是分类，<br>而是不同的问题。</h3></div><div class="filters"><button type="button" class="active" data-filter="全部">全部</button>${spec.tags.map((tag) => `<button type="button" data-filter="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join('')}</div></header><div class="case-grid">${spec.features.map((feature, caseIndex) => `<button type="button" class="case-card case-${caseIndex + 1}" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}"><img src="${coverPath(index, caseIndex)}" alt=""><span>0${caseIndex + 1}</span><div><small>${escapeHtml(spec.tags[caseIndex] ?? spec.tags[0])}</small><b>${escapeHtml(feature[0])}</b><p>${escapeHtml(feature[1])}</p></div></button>`).join('')}</div></div>`;
}

function renderBrandExperience(spec: CommercialProjectSpec): string {
  return `<div class="industry-layout experience-layout"><header><div><small>CONNECTED OPERATIONS</small><h3>${escapeHtml(spec.features[0]![0])}</h3></div><span>● ALL SYSTEMS OPERATIONAL</span></header><div class="industry-grid"><div class="industry-network"><div class="network-rings"><i></i><i></i><i></i><b>${escapeHtml(spec.brand.slice(0, 1))}</b><span class="sat s1"></span><span class="sat s2"></span><span class="sat s3"></span></div><small>${escapeHtml(spec.tags.join(' · '))}</small></div><div class="scenario-list">${spec.features.map((feature, scenarioIndex) => `<button type="button" class="${scenarioIndex === 0 ? 'active' : ''}" data-detail="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}" data-choice="${escapeHtml(feature[0])}" data-group="scenario"><span>0${scenarioIndex + 1}</span><div><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(feature[1])}</small></div><i>↗</i></button>`).join('')}<div class="scenario-outcome"><span>当前情景</span><b data-choice-output="scenario">${escapeHtml(spec.features[0]![0])}</b><small>${escapeHtml(spec.metrics[0]![2])}</small></div><button class="solid wide-button" type="button" data-open-action>运行当前情景　↗</button></div></div></div>`;
}

function renderFamilyExperience(spec: CommercialProjectSpec, index: number): string {
  switch (spec.family) {
    case 'commerce': return renderCommerceExperience(spec, index);
    case 'saas': return renderSaasExperience(spec);
    case 'service': return renderServiceExperience(spec, index);
    case 'editorial': return renderEditorialExperience(spec, index);
    case 'knowledge': return renderKnowledgeExperience(spec);
    case 'mobile': return renderMobileExperience(spec);
    case 'dashboard': return renderDashboardExperience(spec);
    case 'event': return renderEventExperience(spec, index);
    case 'portfolio': return renderPortfolioExperience(spec, index);
    default: return renderBrandExperience(spec);
  }
}

function renderCommercialProject(spec: CommercialProjectSpec, index: number): string {
  const theme = FAMILY_THEMES[spec.family];
  const copy = FAMILY_COPY[spec.family];
  const variant = index % 5;
  const capabilityCards = spec.features.map(featureButton).join('');
  const familyExperience = renderFamilyExperience(spec, index);
  const actionSteps = spec.features.map((feature, stepIndex) => `<li><i>0${stepIndex + 1}</i><span><b>${escapeHtml(feature[0])}</b><small>${escapeHtml(feature[1])}</small></span></li>`).join('');

  return `<!doctype html>
<html lang="zh-CN" data-commercial-project="${escapeHtml(spec.slug)}" data-family="${spec.family}" data-layout="${variant}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(spec.name)}</title>
<style>
:root{--ink:${theme.ink};--paper:${theme.paper};--accent:${theme.accent};--accent-2:${theme.accentAlt};--soft:${theme.soft};--panel:${theme.panel};--line:color-mix(in srgb,var(--ink) 15%,transparent);--muted:color-mix(in srgb,var(--ink) 62%,transparent);--shadow:0 30px 90px color-mix(in srgb,var(--ink) 16%,transparent);--radius:26px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,"SF Pro Display","PingFang SC","Microsoft YaHei",system-ui,sans-serif;line-height:1.5}body:after{content:"";position:fixed;inset:0;pointer-events:none;z-index:100;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E");opacity:.025;mix-blend-mode:multiply}.wide{width:min(1320px,91vw);margin-inline:auto}.page{overflow:hidden}button,input{font:inherit}button{cursor:pointer}.topbar{height:76px;display:flex;align-items:center;gap:30px;border-bottom:1px solid var(--line);position:relative;z-index:20}.brand-button{border:0;background:none;color:inherit;display:flex;align-items:center;gap:11px;font-weight:900;letter-spacing:-.03em}.brand-mark{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:var(--ink);color:var(--accent);font-size:12px}.topnav{margin-left:auto;display:flex;align-items:center;gap:25px}.topnav button{border:0;background:none;color:var(--muted);font-size:11px;font-weight:750}.topnav button:hover{color:var(--ink)}.bag-button{border:1px solid var(--line)!important;border-radius:999px!important;padding:8px 11px!important;color:var(--ink)!important}.bag-button b{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;background:var(--ink);color:var(--paper);font-size:8px;margin-left:5px}.hero{min-height:760px;padding:72px 0 78px;display:flex;align-items:center}.hero-grid{display:grid;grid-template-columns:minmax(0,.88fr) minmax(520px,1.12fr);align-items:center;gap:6vw}.hero-copy{position:relative;z-index:2}.kicker{font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;display:flex;align-items:center;gap:9px}.kicker:before{content:"";width:26px;height:8px;background:var(--accent);border-radius:99px}.hero h1{font-size:clamp(54px,6.5vw,96px);line-height:.94;letter-spacing:-.068em;margin:24px 0;max-width:760px}.hero-copy>p{font-size:17px;color:var(--muted);max-width:610px}.hero-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:30px}.solid,.outline{min-height:44px;border-radius:12px;padding:0 17px;font-size:11px;font-weight:850;transition:.2s}.solid{border:1px solid var(--ink);background:var(--ink);color:var(--paper)}.outline{border:1px solid var(--line);background:color-mix(in srgb,var(--panel) 70%,transparent);color:var(--ink)}.solid:hover,.outline:hover{transform:translateY(-2px);box-shadow:0 12px 28px color-mix(in srgb,var(--ink) 15%,transparent)}.hero-tags{display:flex;gap:16px;flex-wrap:wrap;margin-top:25px}.hero-tags span{font-size:10px;color:var(--muted)}.hero-tags span:before{content:"✓";color:var(--accent-2);font-weight:900;margin-right:5px}.hero-visual{min-height:520px;border-radius:32px;position:relative;overflow:hidden;box-shadow:var(--shadow);border:1px solid color-mix(in srgb,var(--ink) 12%,transparent)}.hero-visual img{width:100%;height:100%;object-fit:cover}.variant-1 .hero-grid{grid-template-columns:minmax(520px,1.1fr) minmax(0,.9fr)}.variant-1 .hero-copy{order:2}.variant-1 .hero-visual{order:1}.variant-2 .hero{padding-top:48px}.variant-2 .hero-grid{grid-template-columns:1fr}.variant-2 .hero-copy{display:grid;grid-template-columns:1.2fr .8fr;align-items:end;column-gap:8vw}.variant-2 .hero-copy .kicker,.variant-2 .hero-copy h1{grid-column:1}.variant-2 .hero-copy>p,.variant-2 .hero-actions,.variant-2 .hero-tags{grid-column:2}.variant-2 .hero-copy>p{grid-row:1/3;align-self:end}.variant-2 .hero-actions{grid-row:3}.variant-2 .hero-tags{grid-row:4}.variant-2 .hero-visual{min-height:570px}.variant-3 .hero-grid{gap:2vw}.variant-3 .hero-copy{background:var(--ink);color:var(--paper);padding:52px;border-radius:30px;margin-right:-70px}.variant-3 .hero-copy>p,.variant-3 .hero-tags span{color:color-mix(in srgb,var(--paper) 65%,transparent)}.variant-3 .hero-copy .solid{background:var(--accent);color:var(--ink);border-color:var(--accent)}.variant-3 .hero-copy .outline{color:var(--paper);border-color:color-mix(in srgb,var(--paper) 25%,transparent);background:transparent}.variant-4 .hero-grid{grid-template-columns:minmax(0,.72fr) minmax(600px,1.28fr)}.variant-4 .hero h1{font-size:clamp(50px,5.5vw,78px)}
/* family hero art */
.commerce-hero{background:var(--soft)}.commerce-hero>img{position:absolute;inset:0;filter:saturate(.7) contrast(.92)}.commerce-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 15%,color-mix(in srgb,var(--paper) 18%,transparent),color-mix(in srgb,var(--ink) 45%,transparent))}.product-object{position:absolute;z-index:2;right:8%;top:10%;bottom:10%;width:44%;border-radius:26px;background:color-mix(in srgb,var(--panel) 92%,transparent);backdrop-filter:blur(18px);padding:24px;display:flex;flex-direction:column;justify-content:flex-end;box-shadow:0 25px 60px #0003}.product-object i{position:absolute;width:58%;height:54%;top:10%;left:21%;border-radius:45% 45% 18% 18%;background:linear-gradient(145deg,var(--accent),var(--accent-2));box-shadow:inset 0 0 0 10px #ffffff25,0 25px 40px #0002}.product-object span,.product-object small{font-size:9px;color:var(--muted)}.product-object b{font-family:Georgia,"Songti SC",serif;font-size:28px;margin:5px 0}.visual-caption{position:absolute;z-index:2;left:24px;bottom:22px;color:white}.visual-caption span,.visual-caption b{display:block}.visual-caption span{font-size:8px;letter-spacing:.16em}.visual-caption b{font-size:17px;margin-top:6px}.software-hero{background:var(--ink);color:var(--paper);padding:18px}.software-top{height:38px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #ffffff20}.software-top i{width:7px;height:7px;border-radius:50%;background:var(--accent)}.software-top span{margin-left:auto;font-size:8px;opacity:.6}.software-shell{height:calc(100% - 38px);display:grid;grid-template-columns:70px 1fr}.software-shell>aside{border-right:1px solid #ffffff1d;padding-top:20px;display:flex;flex-direction:column;align-items:center;gap:22px}.software-shell>aside b{width:31px;height:31px;border-radius:10px;background:var(--accent);color:white;display:grid;place-items:center;font-size:9px}.software-shell>aside i{width:16px;height:4px;border-radius:9px;background:#ffffff30}.software-shell>aside i.on{background:var(--accent)}.software-main{padding:28px;min-width:0}.software-main>header{display:flex;justify-content:space-between;font-size:10px}.software-main em{font-style:normal;opacity:.55}.software-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:26px 0}.software-kpis div{padding:13px;border:1px solid #ffffff1b;border-radius:12px}.software-kpis small,.software-kpis b,.software-kpis span{display:block}.software-kpis small{font-size:8px;opacity:.5}.software-kpis b{font-size:21px;margin:7px 0}.software-kpis span{font-size:7px;color:var(--accent)}.line-chart{height:240px;border-radius:16px;background:#ffffff08;padding:16px}.line-chart svg{width:100%;height:100%;overflow:visible}.grid-line{stroke:#ffffff18;stroke-width:1}.area{fill:color-mix(in srgb,var(--accent) 18%,transparent)}.line{stroke:var(--accent);stroke-width:4;fill:none;stroke-linecap:round}.service-hero>img{position:absolute;inset:0}.image-wash{position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,#101b18b8)}.availability-card{position:absolute;right:7%;bottom:7%;left:33%;background:color-mix(in srgb,var(--panel) 91%,transparent);padding:24px;border-radius:21px;backdrop-filter:blur(16px);box-shadow:0 25px 50px #0003}.availability-card>*{display:block}.availability-card small{font-size:8px;letter-spacing:.15em}.availability-card b{font:28px Georgia,"Songti SC",serif;margin:8px 0}.availability-card p{font-size:10px;color:var(--muted)}.availability-card div{display:flex;gap:8px;align-items:center;font-size:9px}.avatar-dot{width:17px;height:17px;border-radius:50%;background:var(--accent)}.image-index{position:absolute;top:22px;left:23px;color:white;font-size:9px;font-weight:800;letter-spacing:.13em}.editorial-hero{display:grid;grid-template-columns:1.05fr .95fr;background:var(--ink);padding:14px;gap:12px}.editorial-hero article{position:relative;overflow:hidden;border-radius:18px}.cover-main img,.cover-story img{position:absolute;inset:0}.cover-main:after,.cover-story:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,#000b)}.cover-main span,.cover-main b{position:absolute;z-index:2;color:#fff;left:20px}.cover-main span{top:18px;font-size:8px}.cover-main b{bottom:17px;font:38px Georgia,serif;letter-spacing:-.04em}.cover-story{background:var(--panel);padding:24px;display:flex;flex-direction:column;justify-content:flex-end}.cover-story img{height:52%;filter:saturate(.7)}.cover-story:after{height:52%}.cover-story small,.cover-story h3,.cover-story p{position:relative;z-index:2}.cover-story small{font-size:8px;color:var(--muted)}.cover-story h3{font:28px/1.05 Georgia,"Songti SC",serif;margin:14px 0 8px}.cover-story p{font-size:11px;color:var(--muted)}.knowledge-hero{display:grid;grid-template-columns:82px 1fr;background:var(--ink);color:var(--paper);padding:18px}.knowledge-hero>aside{border-right:1px solid #ffffff20;display:flex;flex-direction:column;align-items:center;gap:24px;padding-top:9px}.knowledge-hero>aside b{width:38px;height:38px;border-radius:11px;background:var(--accent);color:var(--ink);display:grid;place-items:center}.knowledge-hero>aside span{font-size:9px;opacity:.35}.knowledge-hero>aside span.active{opacity:1;color:var(--accent)}.knowledge-hero>main{padding:42px}.knowledge-top{display:flex;justify-content:space-between;font-size:8px;letter-spacing:.12em}.knowledge-top i{font-style:normal;color:var(--accent)}.knowledge-hero h3{font-size:42px;letter-spacing:-.05em;margin:76px 0 10px}.knowledge-hero p{font-size:12px;opacity:.65;max-width:410px}.knowledge-progress{height:5px;background:#ffffff1c;border-radius:9px;margin:28px 0}.knowledge-progress i{display:block;width:68%;height:100%;background:var(--accent)}.knowledge-tasks{display:grid;gap:8px}.knowledge-tasks span{border-top:1px solid #ffffff18;padding-top:8px;font-size:9px}.mobile-hero{background:linear-gradient(145deg,var(--soft),color-mix(in srgb,var(--accent) 40%,white))}.phone{position:absolute;width:245px;height:455px;border:8px solid var(--ink);border-radius:38px;background:var(--panel);box-shadow:0 28px 55px #0004;padding:19px;overflow:hidden}.phone header{display:flex;justify-content:space-between;font-size:8px}.phone-back{left:8%;top:12%;transform:rotate(-9deg)}.phone-front{right:8%;top:5%;transform:rotate(5deg)}.phone-back img{height:190px;border-radius:22px;margin:44px 0 15px}.phone-back small,.phone-back b{display:block}.phone-back small{font-size:8px;color:var(--muted)}.phone-back b{font-size:28px}.phone-front>small{display:block;margin-top:49px;font-size:8px;letter-spacing:.13em}.phone-front h3{font-size:38px;letter-spacing:-.055em;margin:7px 0}.phone-front p{font-size:9px;color:var(--muted)}.phone-chart{height:90px;display:flex;align-items:end;gap:7px;margin:21px 0}.phone-chart i{flex:1;background:linear-gradient(var(--accent),var(--soft));border-radius:6px 6px 2px 2px}.phone-chart i:nth-child(1){height:34%}.phone-chart i:nth-child(2){height:48%}.phone-chart i:nth-child(3){height:42%}.phone-chart i:nth-child(4){height:72%}.phone-chart i:nth-child(5){height:91%}.phone-actions{display:flex;gap:8px}.phone-actions span{width:38px;height:38px;border-radius:12px;background:var(--soft);display:grid;place-items:center}.phone nav{position:absolute;left:20px;right:20px;bottom:17px;display:flex;justify-content:space-between}.phone nav i{width:17px;height:4px;background:var(--soft);border-radius:8px}.phone nav i.active{background:var(--accent)}.command-hero{background:var(--ink);color:var(--paper);padding:22px}.command-head{height:48px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff1c;font-size:8px;letter-spacing:.11em}.command-head span{color:var(--accent)}.command-head em{font-style:normal}.command-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:12px;height:calc(100% - 48px);padding-top:12px}.command-map{border:1px solid #ffffff17;border-radius:18px;position:relative;overflow:hidden;background-image:linear-gradient(#ffffff0c 1px,transparent 1px),linear-gradient(90deg,#ffffff0c 1px,transparent 1px);background-size:34px 34px}.command-map:after{content:"";position:absolute;width:330px;height:330px;border:1px solid #ffffff20;border-radius:50%;left:14%;top:10%}.command-map small{position:absolute;left:17px;bottom:15px;font-size:8px}.route{position:absolute;height:2px;background:var(--accent);transform-origin:left}.r1{width:46%;left:23%;top:56%;transform:rotate(-28deg)}.r2{width:38%;left:35%;top:35%;transform:rotate(42deg)}.node{position:absolute;width:16px;height:16px;border:4px solid var(--ink);outline:2px solid var(--accent);background:var(--accent);border-radius:50%;z-index:2}.n1{left:22%;top:55%}.n2{left:57%;top:35%}.n3{left:72%;top:66%}.command-stats{display:grid;gap:9px}.command-stats article{border:1px solid #ffffff17;border-radius:14px;padding:15px}.command-stats small,.command-stats b,.command-stats span{display:block}.command-stats small{font-size:8px;opacity:.5}.command-stats b{font-size:24px;margin:7px 0}.command-stats span{font-size:8px;color:var(--accent)}.event-hero{background:var(--ink);color:var(--paper)}.event-hero>img{position:absolute;inset:0;opacity:.58;filter:saturate(1.3) contrast(1.05)}.event-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,var(--ink) 0%,transparent 70%)}.event-poster{position:absolute;z-index:2;left:7%;top:8%;bottom:8%;width:55%;border:1px solid #ffffff55;padding:26px;display:flex;flex-direction:column}.event-poster small{font-size:8px;letter-spacing:.18em}.event-poster b{font-size:clamp(48px,6vw,82px);line-height:.83;letter-spacing:-.075em;margin:auto 0;word-break:break-word}.event-poster p{font-size:9px}.event-poster>span{position:absolute;right:18px;top:14px;font-size:12px}.event-ticket{position:absolute;z-index:3;right:6%;bottom:8%;width:32%;background:var(--accent);color:var(--ink);padding:19px;border-radius:14px;transform:rotate(-5deg)}.event-ticket>*{display:block}.event-ticket small{font-size:7px}.event-ticket b{font-size:15px;margin:8px 0}.event-ticket i{height:1px;border-top:1px dashed var(--ink);margin-top:15px}.portfolio-hero{background:var(--ink);padding:14px;display:grid;grid-template-columns:1.2fr .8fr;gap:11px}.portfolio-hero figure{margin:0;position:relative;overflow:hidden;border-radius:18px}.portfolio-hero figure img{position:absolute;inset:0;filter:saturate(.72)}.portfolio-hero figcaption{position:absolute;z-index:2;left:15px;bottom:13px;color:white;font-size:8px}.work-one{grid-row:1/3}.work-two{grid-row:1/2}.portfolio-stamp{grid-row:2/3;background:var(--accent);border-radius:18px;padding:20px;display:flex;justify-content:space-between;align-items:end}.portfolio-stamp span{font-size:8px;letter-spacing:.16em}.portfolio-stamp b{font-size:40px;line-height:.75}.industry-hero{background:var(--ink);color:var(--paper);display:grid;grid-template-columns:.92fr 1.08fr;padding:20px;gap:14px}.industry-orbit{position:relative;display:grid;place-items:center;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 23%,transparent),transparent 62%);border:1px solid #ffffff18;border-radius:20px}.industry-orbit>i{position:absolute;border:1px solid #ffffff25;border-radius:50%}.industry-orbit>i:nth-child(1){width:72%;height:72%}.industry-orbit>i:nth-child(2){width:52%;height:52%;border-color:var(--accent)}.industry-orbit>i:nth-child(3){width:32%;height:32%}.industry-orbit>b{width:74px;height:74px;border-radius:24px;background:var(--accent);color:var(--ink);display:grid;place-items:center;font-size:31px}.industry-panel{border:1px solid #ffffff18;border-radius:20px;padding:19px}.industry-panel header{display:flex;justify-content:space-between;font-size:8px;padding-bottom:17px;border-bottom:1px solid #ffffff17}.industry-panel em{font-style:normal}.industry-panel article{display:grid;grid-template-columns:27px 1fr .9fr;gap:12px;align-items:center;padding:22px 0;border-bottom:1px solid #ffffff17}.industry-panel article>i{font-style:normal;font-size:8px;color:var(--accent)}.industry-panel small,.industry-panel b{display:block}.industry-panel small{font-size:8px;opacity:.5}.industry-panel b{font-size:24px}.industry-panel article>span{font-size:8px;opacity:.65}
/* metrics and sections */
.metric-strip{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.metric-grid{display:grid;grid-template-columns:repeat(3,1fr)}.metric-grid article{min-height:190px;padding:31px 30px;border-right:1px solid var(--line);position:relative}.metric-grid article:last-child{border-right:0}.metric-grid article>span{font-size:9px;font-weight:850;color:var(--accent)}.metric-grid strong{display:block;font-size:clamp(38px,4vw,62px);letter-spacing:-.06em;margin:22px 0 2px}.metric-grid b{font-size:12px}.metric-grid p{font-size:10px;color:var(--muted);margin:5px 0}.section{padding:105px 0}.section-heading{display:grid;grid-template-columns:.8fr 1.2fr;gap:9vw;align-items:end;margin-bottom:46px}.section-heading small{font-size:9px;font-weight:900;letter-spacing:.16em;color:var(--accent)}.section-heading h2{font-size:clamp(42px,5.5vw,72px);line-height:.98;letter-spacing:-.06em;margin:13px 0 0}.section-heading p{font-size:16px;color:var(--muted);max-width:580px}.experience-zone{background:var(--ink);color:var(--paper)}.experience-zone .section-heading p{color:color-mix(in srgb,var(--paper) 62%,transparent)}.experience-zone .section-heading small{color:var(--accent)}.experience-layout{min-height:570px;border-radius:28px;overflow:hidden}.wide-button{width:100%}.chip{border:1px solid var(--line);background:transparent;color:inherit;border-radius:999px;padding:7px 11px;font-size:9px}.chip.active{background:var(--accent);border-color:var(--accent);color:var(--ink)}
/* family workspaces */
.commerce-layout{display:grid;grid-template-columns:1.35fr .65fr;gap:14px}.product-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.shop-item{border:1px solid #ffffff20;background:#ffffff08;color:var(--paper);border-radius:20px;padding:10px;text-align:left;transition:.2s}.shop-item:hover,.shop-item.active{border-color:var(--accent);transform:translateY(-4px)}.shop-item img{width:100%;height:300px;object-fit:cover;border-radius:13px;filter:saturate(.65)}.shop-item>span,.shop-item>b,.shop-item>small{display:block}.shop-item>span{font-size:8px;color:var(--accent);margin-top:13px}.shop-item>b{font:19px Georgia,"Songti SC",serif;margin:7px 0}.shop-item>small{font-size:8px;opacity:.55}.shop-summary{background:var(--panel);color:var(--ink);border-radius:20px;padding:30px;display:flex;flex-direction:column}.shop-summary>small{font-size:8px;letter-spacing:.15em}.shop-summary h3{font:32px Georgia,"Songti SC",serif;margin:50px 0 10px}.shop-summary>p{font-size:11px;color:var(--muted)}.option-row{border-top:1px solid var(--line);padding-top:20px;margin-top:25px;display:flex;align-items:center;justify-content:space-between;font-size:10px}.shop-price{margin-top:auto;padding:25px 0 17px;display:flex;justify-content:space-between;align-items:end}.shop-price span{font-size:9px}.shop-price b{font-size:25px}.saas-layout{display:grid;grid-template-columns:74px 1fr;background:#f8f9fd;color:#101729}.product-rail{background:#161d31;display:flex;flex-direction:column;align-items:center;gap:14px;padding-top:20px}.product-rail>b{width:35px;height:35px;background:var(--accent);border-radius:11px;display:grid;place-items:center;color:white;font-size:9px;margin-bottom:15px}.product-rail button{width:36px;height:36px;border:0;border-radius:10px;background:transparent;color:#ffffff80}.product-rail button.active,.product-rail button:hover{background:#ffffff15;color:white}.product-workspace{padding:28px}.product-workspace>header,.ops-toolbar{display:flex;justify-content:space-between;align-items:center}.product-workspace h3,.ops-toolbar h3{margin:5px 0;font-size:26px}.product-workspace header small,.ops-toolbar small{font-size:8px;letter-spacing:.14em;color:#69718a}.periods{display:flex;gap:4px}.periods button{border:1px solid #dce0eb;background:white;border-radius:8px;padding:7px 9px;font-size:8px}.periods button.active{background:#171e31;color:white}.workspace-kpis,.ops-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:23px 0}.workspace-kpis article,.ops-kpis article{border:1px solid #e2e5ee;background:white;border-radius:13px;padding:15px}.workspace-kpis span,.workspace-kpis b,.workspace-kpis small,.ops-kpis span,.ops-kpis b,.ops-kpis small{display:block}.workspace-kpis span,.ops-kpis span{font-size:8px;color:#747b90}.workspace-kpis b,.ops-kpis b{font-size:24px;margin:6px 0}.workspace-kpis small,.ops-kpis small{font-size:8px;color:#39a986}.workspace-body{display:grid;grid-template-columns:1.3fr .7fr;gap:9px}.big-chart,.activity-list{border:1px solid #e2e5ee;background:white;border-radius:15px;padding:17px}.chart-label{display:flex;justify-content:space-between;font-size:10px}.chart-label span{font-size:8px;color:#798096}.big-chart svg{width:100%;height:270px}.big-chart .grid-line{stroke:#e9ebf2}.big-chart .area{fill:color-mix(in srgb,var(--accent) 13%,transparent)}.big-chart .line{stroke:var(--accent)}.activity-list>b{font-size:11px}.activity-list>button{display:flex;width:100%;gap:10px;align-items:center;border:0;border-top:1px solid #eceef4;background:none;padding:14px 0;text-align:left}.activity-list>button>i{width:25px;height:25px;border-radius:8px;background:#f0edff;color:var(--accent);display:grid;place-items:center;font-style:normal}.activity-list span{min-width:0}.activity-list span b,.activity-list span small{display:block}.activity-list span b{font-size:9px}.activity-list span small{font-size:7px;color:#788096;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.service-layout{display:grid;grid-template-columns:1.15fr .85fr;gap:14px}.service-scenes{display:grid;grid-template-rows:1fr 150px;gap:10px}.service-scenes figure{margin:0;position:relative;overflow:hidden;border-radius:20px}.service-scenes figure img{width:100%;height:100%;object-fit:cover;filter:saturate(.7)}.service-scenes figcaption{position:absolute;left:18px;right:18px;bottom:16px;color:white;display:flex;justify-content:space-between}.service-scenes figcaption span{font-size:8px}.service-scenes figcaption b{font:24px Georgia,"Songti SC",serif}.service-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px}.service-cards button{border:1px solid #ffffff20;background:#ffffff08;color:var(--paper);border-radius:17px;text-align:left;padding:17px}.service-cards span,.service-cards b,.service-cards small{display:block}.service-cards span{font-size:8px;color:var(--accent)}.service-cards b{font-size:13px;margin:10px 0 3px}.service-cards small{font-size:8px;opacity:.55}.booking-panel{background:var(--panel);color:var(--ink);border-radius:20px;padding:30px;display:flex;flex-direction:column}.booking-panel>small{font-size:8px;letter-spacing:.14em}.booking-panel h3{font:34px Georgia,"Songti SC",serif;margin:20px 0 30px}.date-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.date-grid button{border:1px solid var(--line);border-radius:11px;background:transparent;padding:10px 3px}.date-grid button span,.date-grid button b{display:block;font-size:8px}.date-grid button b{font-size:15px;margin-top:4px}.date-grid button.active{background:var(--ink);color:var(--paper)}.booking-panel label{font-size:9px;font-weight:800;margin-top:24px}.select-like{height:46px;border:1px solid var(--line);border-radius:11px;margin-top:7px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-weight:600}.booking-meta{margin-top:auto;border-top:1px solid var(--line);padding:21px 0;display:flex;justify-content:space-between;font-size:9px}.booking-meta i{display:inline-block;width:7px;height:7px;background:#57b77c;border-radius:50%}.editorial-layout{display:grid;grid-template-columns:1.2fr .8fr;gap:14px}.lead-story{background:var(--panel);color:var(--ink);border-radius:20px;display:grid;grid-template-rows:1.2fr .8fr;overflow:hidden}.lead-story>img{width:100%;height:100%;object-fit:cover;filter:saturate(.72)}.lead-story>div{padding:24px}.lead-story small{font-size:8px;letter-spacing:.14em;color:var(--accent)}.lead-story h3{font:32px Georgia,"Songti SC",serif;margin:12px 0 7px}.lead-story p{font-size:10px;color:var(--muted)}.text-button{border:0;background:none;padding:0;color:var(--ink);font-size:9px;font-weight:900}.story-stack{display:flex;flex-direction:column;gap:9px}.story-row{flex:1;border:1px solid #ffffff20;border-radius:17px;background:#ffffff08;color:var(--paper);display:grid;grid-template-columns:27px 1fr auto;align-items:center;gap:9px;text-align:left;padding:18px}.story-row>span{font-size:8px;color:var(--accent)}.story-row b,.story-row small{display:block}.story-row b{font:18px Georgia,"Songti SC",serif}.story-row small{font-size:8px;opacity:.55;margin-top:4px}.story-row>i{font-style:normal}.audio-player{height:85px;background:var(--accent);color:var(--ink);border-radius:17px;display:flex;align-items:center;gap:12px;padding:16px}.audio-player>button{width:38px;height:38px;border:0;border-radius:50%;background:var(--ink);color:var(--paper)}.audio-player>div{flex:1}.audio-player b{font-size:9px}.audio-player div>span{display:block;height:4px;background:#0002;margin-top:8px}.audio-player div>span i{display:block;width:32%;height:100%;background:var(--ink);transition:width .4s}.audio-player.playing div>span i{width:78%}.audio-player>small{font-size:8px}.knowledge-layout{display:grid;grid-template-columns:.65fr 1.35fr;background:var(--panel);color:var(--ink)}.lesson-list{background:color-mix(in srgb,var(--soft) 55%,var(--panel));padding:27px}.lesson-list>small{font-size:8px;letter-spacing:.13em}.lesson-list button{display:flex;width:100%;gap:11px;align-items:center;border:0;border-bottom:1px solid var(--line);background:none;text-align:left;padding:17px 0;color:var(--muted)}.lesson-list button.active{color:var(--ink)}.lesson-list button>i{width:29px;height:29px;border-radius:9px;background:var(--panel);display:grid;place-items:center;font-style:normal;font-size:8px}.lesson-list button.active>i{background:var(--accent)}.lesson-list b,.lesson-list small{display:block}.lesson-list b{font-size:11px}.lesson-list small{font-size:8px;margin-top:3px}.lesson-focus{padding:45px 7vw}.lesson-breadcrumb{font-size:8px;letter-spacing:.12em;color:var(--accent-2)}.lesson-focus h3{font-size:40px;letter-spacing:-.05em;margin:38px 0 8px}.lesson-focus>p{font-size:12px;color:var(--muted);max-width:570px}.lesson-note{border-left:3px solid var(--accent);background:var(--soft);padding:16px;margin:25px 0}.lesson-note span,.lesson-note b{display:block}.lesson-note span{font-size:8px;color:var(--muted)}.lesson-note b{font-size:11px;margin-top:4px}.check-list{display:grid;gap:7px}.check-list button{border:1px solid var(--line);border-radius:11px;background:transparent;display:flex;align-items:center;gap:10px;padding:11px;text-align:left}.check-list button i{width:24px;height:24px;border:1px solid var(--line);border-radius:7px;display:grid;place-items:center;font-style:normal}.check-list button.done i{background:var(--accent);border-color:var(--accent)}.check-list span{font-size:10px}.completion{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;margin-top:25px;font-size:9px}.completion>div{height:5px;background:var(--soft);border-radius:9px}.completion>div i{display:block;width:33%;height:100%;background:var(--accent);transition:width .25s}.mobile-layout{display:grid;grid-template-columns:.85fr 1.15fr}.mobile-copy{padding:55px;background:#ffffff0a}.mobile-copy>small{font-size:8px;color:var(--accent);letter-spacing:.15em}.mobile-copy>h3{font-size:40px;letter-spacing:-.05em;margin:30px 0 10px}.mobile-copy>p{font-size:11px;color:#ffffff99}.mobile-nav{display:grid;margin-top:42px}.mobile-nav button{border:0;border-top:1px solid #ffffff1c;background:none;color:#ffffff75;padding:16px 0;text-align:left;display:flex;align-items:center;gap:15px}.mobile-nav button.active{color:var(--paper)}.mobile-nav button span{font-size:8px;color:var(--accent)}.mobile-nav button b{font-size:11px}.device-stage{position:relative;background:radial-gradient(circle,var(--accent),transparent 63%);display:grid;place-items:center;min-height:570px}.device-screen{position:absolute;width:300px;min-height:520px;border:9px solid var(--ink);border-radius:42px;background:var(--panel);color:var(--ink);padding:22px;box-shadow:0 30px 70px #0006;display:none}.device-screen.active{display:block;animation:screenIn .3s ease}.device-screen>header{display:flex;justify-content:space-between;font-size:8px;margin-bottom:42px}.device-screen>small{font-size:8px;letter-spacing:.12em}.device-screen>h3{font-size:42px;letter-spacing:-.06em;margin:8px 0}.device-screen>p{font-size:9px;color:var(--muted)}.mobile-card{background:var(--ink);color:var(--paper);padding:17px;border-radius:16px;margin:23px 0;position:relative}.mobile-card span,.mobile-card b{display:block}.mobile-card span{font-size:8px;opacity:.55}.mobile-card b{font-size:13px;margin-top:5px}.mobile-card i{position:absolute;right:14px;top:14px;width:26px;height:26px;border-radius:9px;background:var(--accent)}.mobile-list{display:grid}.mobile-list span{border-bottom:1px solid var(--line);padding:12px 0;font-size:9px;display:grid;grid-template-columns:20px 1fr auto;align-items:center}.mobile-list span i{width:15px;height:15px;border-radius:5px;background:var(--soft)}.device-screen>.solid{width:100%;margin-top:18px}.dashboard-layout{background:#f6f9f9;color:#101b22;padding:25px}.ops-kpis article{border-color:#dde6e5}.ops-toolbar .chip{color:#101b22}.ops-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:10px}.ops-map{height:340px;border:1px solid #dce5e3;border-radius:16px;position:relative;overflow:hidden;background:#e9efef}.map-grid{position:absolute;inset:0;background-image:linear-gradient(#12262c0c 1px,transparent 1px),linear-gradient(90deg,#12262c0c 1px,transparent 1px);background-size:31px 31px}.map-path{position:absolute;height:4px;background:var(--accent);transform-origin:left;border-radius:8px}.p1{width:48%;left:18%;top:59%;transform:rotate(-24deg)}.p2{width:34%;left:49%;top:40%;transform:rotate(37deg)}.map-node{position:absolute;width:34px;height:34px;border:5px solid white;border-radius:50%;background:var(--ink);color:white;font-size:8px;z-index:2;box-shadow:0 8px 20px #0003}.node-a{left:16%;top:55%}.node-b{left:53%;top:32%}.node-c{left:78%;top:62%}.ops-map>span{position:absolute;left:16px;bottom:13px;font-size:8px;font-weight:800}.incident-list{border:1px solid #dce5e3;background:white;border-radius:16px;padding:17px}.incident-list>header{display:flex;justify-content:space-between;font-size:9px;padding-bottom:9px}.incident-list>header span{color:#e56b52}.incident-list>button:not(.solid){display:grid;width:100%;grid-template-columns:8px 1fr auto;align-items:center;gap:10px;border:0;border-top:1px solid #e8eeee;background:none;padding:14px 0;text-align:left}.incident-list>button>i{width:7px;height:7px;border-radius:50%;background:#e56b52}.incident-list>button>i.sev-1{background:#e9b052}.incident-list>button>i.sev-2{background:#57b89a}.incident-list button span b,.incident-list button span small{display:block}.incident-list button span b{font-size:9px}.incident-list button span small{font-size:7px;color:#758183}.incident-list button em{font-size:8px;font-style:normal}.event-layout{display:grid;grid-template-columns:1.2fr .8fr;gap:14px}.agenda{border:1px solid #ffffff20;border-radius:20px;padding:25px}.agenda>header{display:flex;justify-content:space-between;align-items:end;padding-bottom:20px}.agenda header small{font-size:8px;color:var(--accent)}.agenda header h3{font-size:27px;margin:0}.agenda-row{width:100%;display:grid;grid-template-columns:65px 1fr auto;gap:14px;align-items:center;border:0;border-top:1px solid #ffffff20;background:none;color:var(--paper);padding:22px 0;text-align:left}.agenda-row>span{font-size:11px;color:var(--accent)}.agenda-row b,.agenda-row small{display:block}.agenda-row b{font-size:14px}.agenda-row small{font-size:8px;opacity:.55;margin-top:4px}.agenda-row>i{font-style:normal}.ticket-panel{background:var(--panel);color:var(--ink);border-radius:20px;padding:20px;display:flex;flex-direction:column}.ticket-panel>img{width:100%;height:190px;object-fit:cover;border-radius:14px;filter:saturate(.8)}.ticket-panel>small{font-size:8px;letter-spacing:.15em;margin-top:19px}.ticket-panel h3{font:27px Georgia,"Songti SC",serif;margin:10px 0}.ticket-panel>p{font-size:9px;color:var(--muted)}.ticket-types{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px}.ticket-types button{border:1px solid var(--line);border-radius:9px;background:none;padding:8px;font-size:8px}.ticket-types button.active{background:var(--ink);color:var(--paper)}.ticket-total{display:flex;justify-content:space-between;margin-top:auto;padding:18px 0 13px;border-top:1px solid var(--line);font-size:9px}.ticket-total b{font-size:16px}.portfolio-layout{border-radius:0;overflow:visible}.portfolio-layout>header{display:flex;justify-content:space-between;align-items:end;margin-bottom:24px}.portfolio-layout header small{font-size:8px;color:var(--accent)}.portfolio-layout header h3{font:34px/1.05 Georgia,"Songti SC",serif;margin:10px 0}.filters{display:flex;gap:5px;flex-wrap:wrap}.filters button{border:1px solid #ffffff20;border-radius:999px;background:none;color:#ffffff80;padding:7px 10px;font-size:8px}.filters button.active{background:var(--accent);color:var(--ink)}.case-grid{display:grid;grid-template-columns:1.2fr .8fr;grid-template-rows:290px 290px;gap:11px}.case-card{position:relative;border:0;border-radius:18px;overflow:hidden;background:var(--soft);text-align:left;padding:0;color:white}.case-card>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.7);transition:.3s}.case-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 25%,#000c)}.case-card:hover>img{transform:scale(1.035)}.case-card>span{position:absolute;z-index:2;right:15px;top:13px;font-size:8px}.case-card>div{position:absolute;z-index:2;left:19px;right:19px;bottom:17px}.case-card small,.case-card b,.case-card p{display:block}.case-card small{font-size:8px;letter-spacing:.12em}.case-card b{font:25px Georgia,"Songti SC",serif;margin-top:6px}.case-card p{font-size:8px;opacity:.7}.case-1{grid-row:1/3}.industry-layout{background:#f7fbf9;color:var(--ink);padding:27px}.industry-layout>header{display:flex;justify-content:space-between;align-items:center}.industry-layout header small{font-size:8px;color:var(--accent-2)}.industry-layout header h3{font-size:28px;margin:5px 0}.industry-layout header>span{font-size:8px;color:#3c9d83}.industry-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:13px;margin-top:22px}.industry-network{border:1px solid #dce8e4;background:var(--ink);color:var(--paper);border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center}.network-rings{width:330px;height:330px;position:relative;display:grid;place-items:center}.network-rings>i{position:absolute;border:1px solid #ffffff25;border-radius:50%}.network-rings>i:nth-child(1){width:94%;height:94%}.network-rings>i:nth-child(2){width:68%;height:68%;border-color:var(--accent)}.network-rings>i:nth-child(3){width:40%;height:40%}.network-rings>b{width:76px;height:76px;border-radius:24px;background:var(--accent);color:var(--ink);display:grid;place-items:center;font-size:29px}.sat{position:absolute;width:14px;height:14px;border:4px solid var(--ink);outline:2px solid var(--accent);background:var(--accent);border-radius:50%}.s1{left:13%;top:47%}.s2{right:21%;top:22%}.s3{right:13%;bottom:24%}.industry-network>small{font-size:8px;opacity:.55;margin-bottom:22px}.scenario-list{display:flex;flex-direction:column}.scenario-list>button:not(.solid){flex:1;border:0;border-top:1px solid #dce8e4;background:none;color:var(--ink);display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center;text-align:left;padding:15px}.scenario-list>button.active{background:var(--soft);border-radius:12px}.scenario-list>button>span{font-size:8px;color:var(--accent-2)}.scenario-list>button b,.scenario-list>button small{display:block}.scenario-list>button b{font-size:11px}.scenario-list>button small{font-size:8px;color:var(--muted);margin-top:3px}.scenario-list>button>i{font-style:normal}.scenario-outcome{background:var(--ink);color:var(--paper);border-radius:13px;padding:16px;margin:10px 0}.scenario-outcome span,.scenario-outcome b,.scenario-outcome small{display:block}.scenario-outcome span{font-size:7px;color:var(--accent)}.scenario-outcome b{font-size:17px;margin:5px 0}.scenario-outcome small{font-size:8px;opacity:.55}
/* capabilities and closing */
.capability-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}.feature-card{min-height:310px;border:1px solid var(--line);background:transparent;color:var(--ink);border-radius:22px;padding:24px;text-align:left;position:relative;transition:.2s}.feature-card:hover,.feature-card.active{background:var(--accent);border-color:var(--accent);transform:translateY(-4px)}.feature-card>span{font-size:8px;font-weight:900}.feature-card h3{font-size:24px;letter-spacing:-.03em;margin:72px 0 9px}.feature-card p{font-size:11px;color:var(--muted)}.feature-card>i{position:absolute;right:21px;top:18px;font-style:normal}.detail-bar{margin-top:12px;padding:20px 22px;border-radius:17px;background:var(--soft);display:grid;grid-template-columns:220px 1fr;gap:24px}.detail-bar b{font-size:14px}.detail-bar span{font-size:11px;color:var(--muted)}.closing{padding:0 0 105px}.closing-card{min-height:460px;border-radius:32px;overflow:hidden;position:relative;background:var(--ink);color:var(--paper);padding:58px;display:flex;flex-direction:column;justify-content:flex-end}.closing-card>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.32;filter:saturate(.7)}.closing-card:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--ink),transparent)}.closing-card>*:not(img){position:relative;z-index:2}.closing-card small{font-size:9px;color:var(--accent);letter-spacing:.16em}.closing-card h2{font-size:clamp(48px,6vw,82px);line-height:.95;letter-spacing:-.065em;margin:17px 0;max-width:780px}.closing-card p{max-width:570px;color:#ffffffa3}.closing-card button{align-self:flex-start;margin-top:17px;background:var(--accent);border-color:var(--accent);color:var(--ink)}.footer{border-top:1px solid var(--line);min-height:90px;display:flex;align-items:center;justify-content:space-between;font-size:9px;color:var(--muted)}
/* drawer, toast, animations */
.drawer-backdrop{position:fixed;inset:0;background:#0508078c;z-index:80;opacity:0;pointer-events:none;transition:.25s;backdrop-filter:blur(6px)}.drawer-backdrop.open{opacity:1;pointer-events:auto}.action-drawer{position:absolute;right:0;top:0;bottom:0;width:min(470px,94vw);background:var(--panel);color:var(--ink);padding:34px;transform:translateX(100%);transition:.3s;overflow:auto}.drawer-backdrop.open .action-drawer{transform:translateX(0)}.drawer-close{margin-left:auto;width:38px;height:38px;border:1px solid var(--line);border-radius:50%;background:none;display:grid;place-items:center}.action-drawer>small{display:block;font-size:8px;color:var(--accent-2);letter-spacing:.14em;margin-top:46px}.action-drawer h2{font-size:39px;letter-spacing:-.05em;margin:13px 0}.action-drawer>p{font-size:11px;color:var(--muted)}.action-drawer ul{list-style:none;margin:28px 0;padding:0}.action-drawer li{display:flex;gap:12px;border-top:1px solid var(--line);padding:17px 0}.action-drawer li>i{font-style:normal;font-size:8px;color:var(--accent-2)}.action-drawer li b,.action-drawer li small{display:block}.action-drawer li b{font-size:11px}.action-drawer li small{font-size:8px;color:var(--muted);margin-top:3px}.action-confirm{width:100%;height:48px}.toast{position:fixed;z-index:120;left:50%;bottom:26px;transform:translate(-50%,18px);opacity:0;pointer-events:none;background:var(--ink);color:var(--paper);border:1px solid #ffffff20;border-radius:999px;padding:12px 17px;font-size:10px;font-weight:800;box-shadow:var(--shadow);transition:.25s}.toast.show{opacity:1;transform:translate(-50%,0)}@keyframes screenIn{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
@media(max-width:900px){.topnav button:not(.bag-button){display:none}.hero{padding:50px 0}.hero-grid,.variant-1 .hero-grid,.variant-2 .hero-grid,.variant-4 .hero-grid{grid-template-columns:1fr}.variant-1 .hero-copy{order:1}.variant-1 .hero-visual{order:2}.variant-2 .hero-copy{display:block}.variant-3 .hero-copy{margin:0 0 -55px;padding:35px}.hero h1{font-size:56px}.hero-visual{min-height:480px}.section-heading{grid-template-columns:1fr;gap:15px}.metric-grid,.capability-grid{grid-template-columns:1fr}.metric-grid article{border-right:0;border-bottom:1px solid var(--line);min-height:auto}.commerce-layout,.service-layout,.editorial-layout,.event-layout,.industry-grid{grid-template-columns:1fr}.product-gallery{grid-template-columns:repeat(3,1fr)}.shop-item img{height:220px}.shop-summary{min-height:420px}.workspace-body,.ops-grid{grid-template-columns:1fr}.product-workspace{overflow:auto}.service-scenes{min-height:500px}.knowledge-layout,.mobile-layout{grid-template-columns:1fr}.mobile-copy{display:none}.device-stage{min-height:650px}.case-grid{grid-template-columns:1fr;grid-template-rows:420px 260px 260px}.case-1{grid-row:auto}.industry-network{min-height:440px}.detail-bar{grid-template-columns:1fr}.portfolio-layout>header{display:block}.filters{margin-top:15px}}
@media(max-width:600px){.wide{width:min(92vw,1320px)}.topbar{height:65px}.hero{min-height:auto}.hero h1{font-size:45px}.hero-copy>p{font-size:14px}.hero-visual{min-height:420px;border-radius:22px}.variant-3 .hero-copy{padding:28px}.software-main{padding:16px}.software-kpis{grid-template-columns:1fr}.software-kpis div:nth-child(n+2){display:none}.line-chart{height:230px}.editorial-hero{grid-template-columns:1fr}.cover-story{display:none}.phone{transform:scale(.82)!important}.command-grid{grid-template-columns:1fr}.command-stats{display:none}.event-poster{width:76%}.event-ticket{display:none}.portfolio-hero{grid-template-columns:1fr}.work-two,.portfolio-stamp{display:none}.metric-grid article{padding-inline:5px}.section{padding:75px 0}.section-heading h2{font-size:42px}.product-gallery{grid-template-columns:1fr}.shop-item img{height:260px}.product-gallery .shop-item:nth-child(n+2){display:none}.workspace-kpis,.ops-kpis{grid-template-columns:1fr}.workspace-kpis article:nth-child(n+2),.ops-kpis article:nth-child(n+2){display:none}.saas-layout{grid-template-columns:54px 1fr}.service-scenes{min-height:430px}.date-grid{grid-template-columns:1fr 1fr}.story-stack{min-height:350px}.lesson-focus{padding:32px 24px}.event-layout{display:block}.agenda{margin-bottom:10px}.ticket-panel{min-height:510px}.case-grid{grid-template-rows:360px 240px 240px}.network-rings{width:280px;height:280px}.capability-grid{gap:8px}.feature-card{min-height:240px}.feature-card h3{margin-top:45px}.closing-card{padding:34px;min-height:420px}.footer span:nth-child(2){display:none}}
</style>
</head>
<body class="family-${spec.family} variant-${variant}">
<div class="page" id="top">
<header class="topbar wide"><button class="brand-button" type="button" data-jump="top"><span class="brand-mark">${escapeHtml(spec.brand.slice(0, 1))}</span>${escapeHtml(spec.brand)}</button><nav class="topnav"><button type="button" data-jump="proof">${escapeHtml(copy.nav[0])}</button><button type="button" data-jump="experience">${escapeHtml(copy.nav[1])}</button><button type="button" data-jump="capabilities">${escapeHtml(copy.nav[2])}</button><button type="button" class="bag-button" data-open-action>${escapeHtml(copy.actionLabel)} <b data-bag-count>0</b></button></nav></header>
<main>
<section class="hero"><div class="wide hero-grid"><div class="hero-copy"><span class="kicker">${escapeHtml(spec.eyebrow)}</span><h1>${escapeHtml(spec.headline)}</h1><p>${escapeHtml(spec.summary)}</p><div class="hero-actions"><button type="button" class="solid" data-jump="experience">${escapeHtml(spec.primary)}　↗</button><button type="button" class="outline" data-open-action>${escapeHtml(spec.secondary)}</button></div><div class="hero-tags">${spec.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div></div>${renderHeroVisual(spec, index)}</div></section>
${renderMetricStrip(spec)}
<section class="section experience-zone" id="experience"><div class="wide"><div class="section-heading"><div><small>02 / ${escapeHtml(copy.label)}</small><h2>${escapeHtml(copy.title)}</h2></div><p>${escapeHtml(copy.intro)}</p></div>${familyExperience}</div></section>
<section class="section" id="capabilities"><div class="wide"><div class="section-heading"><div><small>03 / BUILT AROUND THE TASK</small><h2>能力不是口号，<br>而是每一步操作。</h2></div><p>${escapeHtml(spec.summary)} 选择任意模块，查看它如何进入真实用户路径。</p></div><div class="capability-grid">${capabilityCards}</div><div class="detail-bar"><b id="detailTitle">${escapeHtml(spec.features[0]![0])}</b><span id="detailCopy">${escapeHtml(spec.features[0]![1])}</span></div></div></section>
<section class="closing"><div class="wide closing-card"><img src="${coverPath(index, 2)}" alt=""><small>READY FOR THE NEXT STEP</small><h2>${escapeHtml(spec.primary)}</h2><p>${escapeHtml(spec.summary)}</p><button type="button" class="solid" data-open-action>${escapeHtml(copy.actionLabel)}　↗</button></div></section>
</main>
<footer class="footer wide"><span>© 2026 ${escapeHtml(spec.brand)}</span><span>${escapeHtml(spec.tags.join(' · '))}</span><span>DESIGNED AROUND REAL TASKS</span></footer>
</div>
<div class="drawer-backdrop" id="actionDrawer" aria-hidden="true"><aside class="action-drawer" role="dialog" aria-modal="true" aria-labelledby="actionTitle"><button type="button" class="drawer-close" data-close-drawer aria-label="关闭">×</button><small>INTERACTIVE SUMMARY</small><h2 id="actionTitle">${escapeHtml(copy.actionTitle)}</h2><p>${escapeHtml(copy.actionBody)}</p><ul>${actionSteps}</ul><button type="button" class="solid action-confirm" data-confirm-action>确认并继续　↗</button></aside></div>
<div class="toast" id="toast" aria-live="polite">操作已完成</div>
<script>
(function(){
  var toast=document.getElementById('toast');var toastTimer;var drawer=document.getElementById('actionDrawer');var bag=0;
  function notify(text){toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){toast.classList.remove('show')},1800)}
  function jump(id){var target=document.getElementById(id);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})}
  function openDrawer(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');var close=drawer.querySelector('[data-close-drawer]');if(close)setTimeout(function(){close.focus()},80)}
  function closeDrawer(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
  document.querySelectorAll('[data-jump]').forEach(function(button){button.addEventListener('click',function(){jump(button.getAttribute('data-jump'))})});
  document.querySelectorAll('[data-open-action]').forEach(function(button){button.addEventListener('click',openDrawer)});
  document.querySelector('[data-close-drawer]').addEventListener('click',closeDrawer);drawer.addEventListener('click',function(event){if(event.target===drawer)closeDrawer()});
  document.querySelector('[data-confirm-action]').addEventListener('click',function(){closeDrawer();notify('${escapeHtml(spec.brand)} · 方案已确认')});
  document.querySelectorAll('[data-choice]').forEach(function(button){button.addEventListener('click',function(){var group=button.getAttribute('data-group');document.querySelectorAll('[data-choice][data-group="'+group+'"]').forEach(function(node){node.classList.remove('active')});button.classList.add('active');var output=document.querySelector('[data-choice-output="'+group+'"]');if(output)output.textContent=button.getAttribute('data-choice');notify('已选择 '+button.getAttribute('data-choice'))})});
  document.querySelectorAll('[data-detail]').forEach(function(button){button.addEventListener('click',function(){document.querySelectorAll('[data-detail]').forEach(function(node){node.classList.remove('active')});button.classList.add('active');var title=document.getElementById('detailTitle');var copy=document.getElementById('detailCopy');if(title)title.textContent=button.getAttribute('data-detail');if(copy)copy.textContent=button.getAttribute('data-copy');notify('正在查看 '+button.getAttribute('data-detail'))})});
  document.querySelectorAll('[data-period]').forEach(function(button){button.addEventListener('click',function(){button.parentElement.querySelectorAll('[data-period]').forEach(function(node){node.classList.remove('active')});button.classList.add('active');var output=document.querySelector('[data-period-output]');if(output)output.textContent=button.getAttribute('data-period');notify('时间范围已更新')})});
  document.querySelectorAll('[data-add]').forEach(function(button){button.addEventListener('click',function(){bag+=1;document.querySelectorAll('[data-bag-count]').forEach(function(node){node.textContent=String(bag)});button.textContent='✓ 已加入精选袋';notify('商品已加入精选袋')})});
  document.querySelectorAll('[data-play]').forEach(function(button){button.addEventListener('click',function(){var player=button.closest('.audio-player');var playing=player.classList.toggle('playing');button.textContent=playing?'Ⅱ':'▶';notify(playing?'正在播放编辑精选':'播放已暂停')})});
  document.querySelectorAll('[data-check]').forEach(function(button){button.addEventListener('click',function(){button.classList.toggle('done');button.querySelector('i').textContent=button.classList.contains('done')?'✓':'';var all=document.querySelectorAll('[data-check]');var done=document.querySelectorAll('[data-check].done').length;var progress=document.querySelector('[data-progress]');if(progress)progress.textContent=done+' / '+all.length;var bar=document.querySelector('.completion>div i');if(bar)bar.style.width=(done/all.length*100)+'%';notify('进度已更新')})});
  document.querySelectorAll('[data-screen]').forEach(function(button){button.addEventListener('click',function(){document.querySelectorAll('[data-screen]').forEach(function(node){node.classList.remove('active')});document.querySelectorAll('[data-screen-panel]').forEach(function(node){node.classList.remove('active')});button.classList.add('active');var panel=document.querySelector('[data-screen-panel="'+button.getAttribute('data-screen')+'"]');if(panel)panel.classList.add('active');notify('已进入 '+button.getAttribute('data-detail'))})});
  document.querySelectorAll('[data-filter]').forEach(function(button){button.addEventListener('click',function(){document.querySelectorAll('[data-filter]').forEach(function(node){node.classList.remove('active')});button.classList.add('active');document.querySelectorAll('.case-card').forEach(function(card,index){card.style.opacity=button.getAttribute('data-filter')==='全部'||index===Array.prototype.indexOf.call(button.parentElement.children,button)-1?'1':'.42'});notify('已筛选 '+button.getAttribute('data-filter'))})});
  document.addEventListener('keydown',function(event){if(event.key==='Escape')closeDrawer()});
})();
</script>
</body></html>`;
}

if (SPECS.length !== 50) {
  throw new Error(`Expected 50 commercial project starters, received ${SPECS.length}`);
}

export const DESIGNER_COMMERCIAL_STARTERS: CommercialStarterProject[] = SPECS.map((spec, index) => ({
  key: `designer.commercial.${spec.slug}`,
  name: spec.name,
  mode: spec.mode,
  prompt: `为「${spec.name}」创建商业级、可上下滚动并带真实按钮交互的完整${spec.mode === 'dashboard' ? '数据产品' : spec.mode === 'app' ? '应用界面' : '品牌体验'}。`,
  html: renderCommercialProject(spec, index),
  interactive: true,
}));

interface LegacyEnhancement {
  kicker: string;
  title: string;
  summary: string;
  items: [string, string][];
  action: string;
  cover: number;
}

const LEGACY_ENHANCEMENTS: Record<string, LegacyEnhancement> = {
  '品牌官网改版': { kicker: 'SELECTED CUSTOMER STORIES', title: '品牌主张，最终要落到真实结果。', summary: '从团队协作、品牌一致到上线效率，查看 Northstar 如何进入不同规模的创作流程。', items: [['Arc Studio', '跨三座城市协作，首轮交付时间缩短 42%。'], ['Fieldwork', '统一品牌资产与组件，减少重复返工。'], ['MONO', '从策略、原型到评审都保留清晰版本记录。']], action: '探索完整客户案例', cover: 8 },
  '会员中心 App': { kicker: 'MEMBER JOURNEY', title: '权益不只被展示，也真正进入日常。', summary: '从积分任务、等级成长到专属活动，每一步都有即时状态和清晰反馈。', items: [['今日任务', '完成资料更新，领取 100 积分。'], ['本月权益', '双倍积分、生日礼遇与优先体验。'], ['成长记录', '查看每一次消费与互动带来的等级变化。']], action: '开始本周会员任务', cover: 3 },
  '秋季发布会提案': { kicker: 'LAUNCH RUN OF SHOW', title: '从第一条预告，到发布后的持续讨论。', summary: '完整发布节奏覆盖预热、揭晓、现场体验和后续内容扩散。', items: [['T − 21 DAYS', '主题预告与核心视觉首次释放。'], ['LAUNCH NIGHT', '新品故事、体验演示与嘉宾对谈。'], ['T + 14 DAYS', '评测内容、用户故事与零售体验延续。']], action: '查看完整发布节奏', cover: 10 },
  '社区招募海报': { kicker: 'OPEN COMMUNITY PROGRAM', title: '加入之后，会发生什么？', summary: '四周共创计划连接作品分享、城市漫游、导师反馈和最终公开展示。', items: [['第一周 · 相遇', '认识来自不同领域的共同创作者。'], ['第二周 · 共创', '围绕真实城市议题完成小组提案。'], ['第四周 · 展示', '公开分享过程、结果与下一步计划。']], action: '选择参与场次', cover: 6 },
  '增长指标 Dashboard': { kicker: 'FROM SIGNAL TO ACTION', title: '看见变化，更要知道下一步做什么。', summary: '把异常渠道、转化节点和建议动作组织成一份可执行的增长简报。', items: [['自然搜索增长', '高意向内容带来 18% 新增访问。'], ['注册转化下降', '移动端第二步流失需要优先处理。'], ['付费用户回访', '新用户第七日回访较上月提升 6.8%。']], action: '生成本周增长简报', cover: 5 },
  'Aurora 设计系统': { kicker: 'PATTERNS IN PRACTICE', title: '令牌和组件，最终要形成稳定体验。', summary: '把基础规范放进导航、表单、反馈和复杂业务流程中验证。', items: [['数据录入模式', '错误、帮助和成功状态保持一致。'], ['权限与角色', '跨产品使用同一套身份和访问语言。'], ['移动端适配', '组件在紧凑空间中仍保留清晰优先级。']], action: '打开组件实践库', cover: 11 },
};

export function enhanceLegacyStarterHtml(html: string, projectName: string): string {
  if (!html.includes('</body>') || html.includes('data-od-legacy-interactions')) return html;
  const enhancement = LEGACY_ENHANCEMENTS[projectName] ?? LEGACY_ENHANCEMENTS['品牌官网改版']!;
  const injection = `<style data-od-legacy-interactions>
  .od-legacy-story{min-height:780px;padding:100px max(6vw,28px);background:#131b16;color:#f5f6f0;font-family:Inter,"PingFang SC",system-ui,sans-serif;position:relative;overflow:hidden}.od-legacy-story:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#131b16 15%,transparent),url('/mock-covers/cover-${enhancement.cover}.jpg') center/cover;opacity:.34}.od-legacy-inner{position:relative;z-index:2;width:min(1120px,100%);margin:auto}.od-legacy-inner>small{font-size:10px;font-weight:900;letter-spacing:.17em;color:#a4f584}.od-legacy-inner h2{max-width:900px;margin:22px 0 18px;font-size:clamp(44px,7vw,82px);line-height:.98;letter-spacing:-.06em}.od-legacy-inner>p{max-width:640px;color:#bdc8c0;font-size:15px}.od-legacy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:55px}.od-legacy-grid button{min-height:210px;border:1px solid #ffffff25;border-radius:19px;background:#ffffff0c;color:#fff;padding:22px;text-align:left;backdrop-filter:blur(12px);transition:.2s}.od-legacy-grid button:hover,.od-legacy-grid button.active{background:#a4f584;color:#142018;transform:translateY(-4px)}.od-legacy-grid span,.od-legacy-grid b,.od-legacy-grid i{display:block}.od-legacy-grid span{font-size:9px;font-weight:900}.od-legacy-grid b{font-size:18px;margin:60px 0 9px}.od-legacy-grid i{font-style:normal;font-size:11px;line-height:1.6;opacity:.72}.od-legacy-action{margin-top:20px;border:0;border-radius:12px;background:#a4f584;color:#142018;padding:13px 18px;font-weight:850}.od-demo-toast{position:fixed;left:50%;bottom:24px;z-index:2147483647;transform:translate(-50%,16px);opacity:0;padding:11px 16px;border-radius:999px;background:#18221b;color:#fff;font:700 12px/1.2 Inter,system-ui,sans-serif;box-shadow:0 16px 40px rgba(16,25,18,.28);transition:.22s;pointer-events:none}.od-demo-toast.show{opacity:1;transform:translate(-50%,0)}button.od-demo-active{box-shadow:0 0 0 4px rgba(139,232,93,.28)!important;transform:translateY(-1px)}@media(max-width:700px){.od-legacy-grid{grid-template-columns:1fr}.od-legacy-story{padding-top:70px;padding-bottom:70px}}
  </style><section class="od-legacy-story"><div class="od-legacy-inner"><small>${escapeHtml(enhancement.kicker)}</small><h2>${escapeHtml(enhancement.title)}</h2><p>${escapeHtml(enhancement.summary)}</p><div class="od-legacy-grid">${enhancement.items.map((item, itemIndex) => `<button type="button"><span>0${itemIndex + 1}</span><b>${escapeHtml(item[0])}</b><i>${escapeHtml(item[1])}</i></button>`).join('')}</div><button type="button" class="od-legacy-action">${escapeHtml(enhancement.action)}　↗</button></div></section><div class="od-demo-toast" id="odDemoToast" aria-live="polite">操作已完成</div><script data-od-legacy-interactions>
  (function(){var toast=document.getElementById('odDemoToast'),timer,name=${JSON.stringify(projectName)};function show(text){toast.textContent=text;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(function(){toast.classList.remove('show')},1800)}document.addEventListener('click',function(event){var button=event.target.closest&&event.target.closest('button');if(!button)return;document.querySelectorAll('.od-legacy-grid button').forEach(function(node){node.classList.remove('active')});if(button.closest('.od-legacy-grid'))button.classList.add('active');button.classList.add('od-demo-active');setTimeout(function(){button.classList.remove('od-demo-active')},520);var label=(button.textContent||'').replace(/\\s+/g,' ').trim()||'按钮';show(name+' · '+label+' 已触发');button.setAttribute('aria-pressed',button.getAttribute('aria-pressed')==='true'?'false':'true')});})();
  </script>`;
  return html.replace('</body>', `${injection}</body>`);
}
