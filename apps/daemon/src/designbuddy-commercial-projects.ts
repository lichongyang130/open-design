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

const PALETTES = [
  ['#181d19', '#b9ff75', '#f4f5ee', '#dce9d3', '#233428'],
  ['#171923', '#8fa5ff', '#f3f2ed', '#dee3ff', '#272d55'],
  ['#201916', '#ff966f', '#f8f1e9', '#f4d8c8', '#4c2b22'],
  ['#102125', '#65ddda', '#eef5f3', '#caece8', '#16464d'],
  ['#251a25', '#f0a8ef', '#f7f0f6', '#efd8ed', '#573150'],
  ['#1d1a13', '#f5cb5c', '#f6f1e5', '#eee0b8', '#51431e'],
  ['#151f2a', '#76c7ff', '#eff4f8', '#d5eafa', '#1b455f'],
  ['#221c16', '#d5a66d', '#f5f0e9', '#eadac8', '#503a26'],
  ['#18201e', '#72ddb0', '#eff5f2', '#d1ebde', '#245440'],
  ['#22181c', '#ff7f9d', '#f8f0f1', '#f3d5dd', '#582b37'],
] as const;

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

function visualMarkup(spec: CommercialProjectSpec): string {
  const metric = spec.metrics[0]!;
  const family = spec.family;
  if (family === 'commerce') {
    return `<div class="visual commerce-visual"><div class="object object-a"></div><div class="object object-b"></div><div class="product-card"><small>EDITOR'S PICK</small><div class="product-shape"></div><b>${escapeHtml(spec.tags[0])}</b><span>${escapeHtml(metric[0])} · ${escapeHtml(metric[1])}</span><button type="button" data-pulse>快速预览 ↗</button></div></div>`;
  }
  if (family === 'saas') {
    return `<div class="visual app-window"><div class="window-bar"><i></i><i></i><i></i><span>Live workspace</span></div><div class="window-body"><aside><b>${escapeHtml(spec.brand.slice(0, 2))}</b><i></i><i></i><i></i><i></i></aside><main><small>OVERVIEW / LIVE</small><h3>${escapeHtml(metric[0])}</h3><p>${escapeHtml(metric[1])}</p><div class="spark"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="mini-grid"><span></span><span></span><span></span></div><button type="button" data-pulse>刷新实时数据</button></main></div></div>`;
  }
  if (family === 'service') {
    return `<div class="visual service-visual"><div class="scene"><i></i><i></i><i></i></div><div class="booking"><small>NEXT AVAILABLE</small><b>周五 · 18:30</b><span>${escapeHtml(spec.tags.join(' · '))}</span><button type="button" data-pulse>查看档期</button></div></div>`;
  }
  if (family === 'editorial') {
    return `<div class="visual editorial-visual"><article><small>ISSUE ${String(spec.slug.length).padStart(2, '0')}</small><h3>${escapeHtml(spec.headline)}</h3><span>${escapeHtml(spec.eyebrow)}</span></article><article><span>FEATURE</span><b>${escapeHtml(spec.features[0]![0])}</b><p>${escapeHtml(spec.features[0]![1])}</p><button type="button" data-pulse>展开阅读</button></article></div>`;
  }
  if (family === 'mobile') {
    return `<div class="visual phone-stage"><div class="phone back"><span>9:41</span><div class="phone-orb"></div><b>${escapeHtml(metric[0])}</b><small>${escapeHtml(metric[1])}</small></div><div class="phone front"><header><span>9:41</span><i>•••</i></header><small>${escapeHtml(spec.brand)}</small><h3>${escapeHtml(metric[0])}</h3><p>${escapeHtml(metric[2])}</p><div class="phone-actions"><i>↗</i><i>＋</i><i>✓</i></div><button type="button" data-pulse>运行场景</button></div></div>`;
  }
  if (family === 'dashboard') {
    return `<div class="visual dashboard-visual"><header><span>LIVE OPERATIONS</span><b>•••</b></header><div class="dash-kpis">${spec.metrics.map((item) => `<span><small>${escapeHtml(item[1])}</small><b>${escapeHtml(item[0])}</b></span>`).join('')}</div><div class="dash-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="dash-row"><span></span><b>${escapeHtml(spec.features[0]![0])}</b><em>ACTIVE</em></div><button type="button" data-pulse>更新运营数据</button></div>`;
  }
  if (family === 'event') {
    return `<div class="visual event-visual"><div class="event-poster"><small>LIVE / 2026</small><h3>${escapeHtml(spec.brand)}</h3><b>${escapeHtml(spec.primary)}</b><i></i></div><div class="event-plan"><span>01 · TEASE</span><span>02 · REVEAL</span><span>03 · EXPERIENCE</span><span>04 · CONVERT</span><button type="button" data-pulse>播放节奏</button></div></div>`;
  }
  if (family === 'portfolio') {
    return `<div class="visual portfolio-visual"><div class="work work-a"><span>01</span></div><div class="work work-b"><span>02</span></div><div class="work-copy"><small>SELECTED WORK</small><b>${escapeHtml(spec.features[0]![0])}</b><button type="button" data-pulse>切换项目</button></div></div>`;
  }
  if (family === 'knowledge') {
    return `<div class="visual lesson-visual"><aside><b>${escapeHtml(spec.brand.slice(0, 1))}</b><span class="on">01</span><span>02</span><span>03</span></aside><main><small>YOUR NEXT STEP</small><h3>${escapeHtml(spec.features[0]![0])}</h3><p>${escapeHtml(spec.features[0]![1])}</p><div class="lesson-progress"><i></i></div><button type="button" data-pulse>继续体验 →</button></main></div>`;
  }
  return `<div class="visual brand-visual"><div class="brand-tile tile-a"><span>${escapeHtml(spec.brand)}</span><b>Aa</b></div><div class="brand-tile tile-b"><i></i><i></i><i></i></div><div class="brand-tile tile-c"><small>SYSTEM / 01</small><b>${escapeHtml(spec.tags[0])}</b><button type="button" data-pulse>切换品牌资产</button></div></div>`;
}

function renderCommercialProject(spec: CommercialProjectSpec, index: number): string {
  const [ink, accent, paper, soft, deep] = PALETTES[index % PALETTES.length]!;
  const panels = spec.features.map((feature, panelIndex) => `
    <article class="show-panel${panelIndex === 0 ? ' active' : ''}" data-panel="${panelIndex}">
      <div><small>0${panelIndex + 1} / PRODUCT MODULE</small><h3>${escapeHtml(feature[0])}</h3><p>${escapeHtml(feature[1])}</p><ul><li>清晰的信息层级与任务路径</li><li>响应式布局覆盖桌面与移动端</li><li>状态反馈让每一步都可感知</li></ul></div>
      <div class="panel-ui"><header><span>${escapeHtml(spec.brand)}</span><i>LIVE</i></header><div class="panel-focus"><small>${escapeHtml(spec.tags[panelIndex % spec.tags.length])}</small><b>${escapeHtml(spec.metrics[panelIndex % spec.metrics.length]![0])}</b><span>${escapeHtml(spec.metrics[panelIndex % spec.metrics.length]![2])}</span></div><div class="panel-lines"><i></i><i></i><i></i></div></div>
    </article>`).join('');
  const featureCards = spec.features.map((feature, featureIndex) => `
    <button class="feature-card${featureIndex === 0 ? ' active' : ''}" type="button" data-feature="${featureIndex}" data-title="${escapeHtml(feature[0])}" data-copy="${escapeHtml(feature[1])}">
      <span>0${featureIndex + 1}</span><h3>${escapeHtml(feature[0])}</h3><p>${escapeHtml(feature[1])}</p><i>↗</i>
    </button>`).join('');

  return `<!doctype html>
<html lang="zh-CN" data-commercial-project="${escapeHtml(spec.slug)}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(spec.name)}</title>
<style>
:root{--ink:${ink};--accent:${accent};--paper:${paper};--soft:${soft};--deep:${deep};--line:color-mix(in srgb,var(--ink) 14%,transparent);--muted:color-mix(in srgb,var(--ink) 64%,transparent);--shadow:0 28px 80px color-mix(in srgb,var(--ink) 16%,transparent)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,"SF Pro Display","PingFang SC","Microsoft YaHei",system-ui,sans-serif;line-height:1.5;transition:background .3s,color .3s}button,input{font:inherit}button{cursor:pointer}.page{overflow:hidden}.wrap{width:min(1180px,88vw);margin:0 auto}.nav{height:72px;display:flex;align-items:center;gap:32px;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20;padding:0 5.5vw;background:color-mix(in srgb,var(--paper) 86%,transparent);backdrop-filter:blur(18px) saturate(150%)}.logo{display:flex;align-items:center;gap:10px;border:0;background:none;color:inherit;font-weight:900;letter-spacing:-.03em}.logo i{width:30px;height:30px;border-radius:10px;background:var(--ink);color:var(--accent);display:grid;place-items:center;font-style:normal}.nav-links{display:flex;gap:24px;margin-left:auto}.nav-links button,.theme-btn{border:0;background:none;color:var(--muted);font-size:12px;font-weight:700}.nav-links button:hover{color:var(--ink)}.theme-btn{width:38px;height:38px;border:1px solid var(--line);border-radius:50%;font-size:15px}.hero{min-height:710px;display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,.92fr);align-items:center;gap:7vw;padding:82px 0}.eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.eyebrow:before{content:"";width:22px;height:7px;border-radius:99px;background:var(--accent)}.hero h1{font-size:clamp(52px,6vw,86px);line-height:.98;letter-spacing:-.065em;margin:24px 0;max-width:760px}.hero-copy>p{font-size:17px;color:var(--muted);max-width:590px}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:30px}.primary,.secondary{border-radius:12px;padding:13px 18px;font-weight:800;font-size:12px;transition:transform .18s,box-shadow .18s}.primary{border:1px solid var(--ink);background:var(--ink);color:var(--paper);box-shadow:0 10px 24px color-mix(in srgb,var(--ink) 18%,transparent)}.secondary{border:1px solid var(--line);background:color-mix(in srgb,var(--paper) 82%,white);color:var(--ink)}.primary:hover,.secondary:hover{transform:translateY(-2px)}.hero-note{display:flex;gap:18px;margin-top:24px;font-size:10px;color:var(--muted)}.hero-note span:before{content:"✓";color:var(--deep);font-weight:900;margin-right:5px}.visual{min-height:480px;border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);border-radius:28px;position:relative;box-shadow:var(--shadow);background:linear-gradient(145deg,var(--soft),color-mix(in srgb,var(--paper) 70%,white));overflow:hidden}.visual button{border:0;border-radius:9px;background:var(--ink);color:var(--paper);padding:9px 12px;font-size:10px;font-weight:800}.commerce-visual .object{position:absolute;border-radius:48% 52% 58% 42%;filter:saturate(.9)}.object-a{width:310px;height:340px;background:linear-gradient(145deg,var(--accent),var(--deep));right:-45px;top:-55px;transform:rotate(18deg)}.object-b{width:170px;height:210px;background:color-mix(in srgb,var(--accent) 50%,white);left:30px;bottom:-45px;transform:rotate(-24deg)}.product-card{position:absolute;left:14%;right:9%;top:20%;bottom:10%;border-radius:22px;background:color-mix(in srgb,var(--paper) 90%,white);padding:24px;box-shadow:0 22px 50px color-mix(in srgb,var(--ink) 18%,transparent);display:flex;flex-direction:column;align-items:flex-start}.product-card small,.visual small{font-size:9px;letter-spacing:.13em;font-weight:900;color:var(--muted)}.product-shape{height:190px;width:100%;border-radius:16px;margin:14px 0;background:radial-gradient(circle at 35% 30%,white 0 4%,transparent 5%),linear-gradient(135deg,var(--deep),var(--accent))}.product-card b{font-size:20px}.product-card span{font-size:11px;color:var(--muted);margin:3px 0 13px}.app-window{background:var(--ink);padding:18px;color:var(--paper)}.window-bar{height:38px;display:flex;align-items:center;gap:6px;border-bottom:1px solid color-mix(in srgb,var(--paper) 15%,transparent)}.window-bar i{width:7px;height:7px;border-radius:50%;background:var(--accent)}.window-bar span{margin-left:auto;font-size:9px;opacity:.6}.window-body{height:calc(100% - 38px);display:grid;grid-template-columns:62px 1fr}.window-body aside{border-right:1px solid color-mix(in srgb,var(--paper) 14%,transparent);display:flex;flex-direction:column;align-items:center;gap:22px;padding-top:22px}.window-body aside b{width:29px;height:29px;display:grid;place-items:center;border-radius:9px;background:var(--accent);color:var(--ink);font-size:10px}.window-body aside i{width:15px;height:4px;border-radius:4px;background:color-mix(in srgb,var(--paper) 27%,transparent)}.window-body main{padding:28px}.window-body h3{font-size:48px;margin:16px 0 0}.window-body p{font-size:11px;opacity:.6}.spark{height:130px;display:flex;align-items:end;gap:9px;margin:20px 0}.spark i{flex:1;border-radius:7px 7px 2px 2px;background:linear-gradient(var(--accent),color-mix(in srgb,var(--accent) 24%,transparent))}.spark i:nth-child(1){height:28%}.spark i:nth-child(2){height:44%}.spark i:nth-child(3){height:37%}.spark i:nth-child(4){height:62%}.spark i:nth-child(5){height:55%}.spark i:nth-child(6){height:79%}.spark i:nth-child(7){height:91%}.mini-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.mini-grid span{height:44px;border:1px solid color-mix(in srgb,var(--paper) 14%,transparent);border-radius:9px}.service-visual .scene{position:absolute;inset:0;background:linear-gradient(140deg,var(--deep),var(--soft))}.scene i{position:absolute;border-radius:50%;background:color-mix(in srgb,var(--accent) 65%,white)}.scene i:nth-child(1){width:310px;height:310px;right:-50px;top:-30px}.scene i:nth-child(2){width:180px;height:180px;left:60px;top:100px;filter:blur(1px)}.scene i:nth-child(3){width:100%;height:42%;left:0;bottom:-20%;border-radius:50% 50% 0 0;background:color-mix(in srgb,var(--paper) 50%,transparent)}.booking{position:absolute;left:9%;right:9%;bottom:8%;padding:22px;border-radius:20px;background:color-mix(in srgb,var(--paper) 90%,white);box-shadow:0 24px 55px color-mix(in srgb,var(--ink) 22%,transparent)}.booking>*{display:block}.booking b{font-size:25px;margin:8px 0}.booking span{font-size:11px;color:var(--muted);margin-bottom:15px}.editorial-visual{display:grid;grid-template-columns:1fr 1fr;padding:18px;gap:12px;background:var(--ink)}.editorial-visual article{padding:28px;background:var(--paper);border-radius:14px;display:flex;flex-direction:column}.editorial-visual article:first-child{background:var(--accent)}.editorial-visual h3{font-size:34px;line-height:1.03;letter-spacing:-.045em;margin:auto 0 24px}.editorial-visual article>span{font-size:9px;font-weight:800}.editorial-visual article:nth-child(2)>span{margin-bottom:auto}.editorial-visual article:nth-child(2)>b{font-size:24px}.editorial-visual article:nth-child(2)>p{font-size:12px;color:var(--muted)}.editorial-visual button{align-self:flex-start;margin-top:auto}.phone-stage{background:linear-gradient(145deg,var(--soft),var(--accent))}.phone{position:absolute;width:230px;height:430px;border:7px solid var(--ink);border-radius:34px;background:var(--paper);box-shadow:0 25px 55px color-mix(in srgb,var(--ink) 24%,transparent);padding:18px;color:var(--ink)}.phone.back{left:7%;top:12%;transform:rotate(-8deg);opacity:.8}.phone.front{right:8%;top:6%;transform:rotate(5deg)}.phone header{display:flex;justify-content:space-between;font-size:9px;margin-bottom:50px}.phone h3{font-size:35px;letter-spacing:-.05em;margin:8px 0}.phone p{font-size:10px;color:var(--muted)}.phone-orb{height:150px;border-radius:22px;background:linear-gradient(145deg,var(--deep),var(--accent));margin:55px 0 20px}.phone-actions{display:flex;gap:8px;margin:28px 0}.phone-actions i{width:40px;height:40px;border-radius:13px;background:var(--soft);display:grid;place-items:center;font-style:normal}.dashboard-visual{padding:24px;background:color-mix(in srgb,var(--paper) 92%,white)}.dashboard-visual>header{display:flex;justify-content:space-between;font-size:10px;font-weight:900}.dash-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:24px 0}.dash-kpis span{padding:13px;border:1px solid var(--line);border-radius:13px}.dash-kpis small,.dash-kpis b{display:block}.dash-kpis small{font-size:8px;color:var(--muted)}.dash-kpis b{font-size:19px;margin-top:6px}.dash-chart{height:180px;border:1px solid var(--line);border-radius:16px;display:flex;align-items:end;gap:7px;padding:18px}.dash-chart i{flex:1;background:linear-gradient(var(--accent),var(--deep));border-radius:7px 7px 2px 2px}.dash-chart i:nth-child(1){height:28%}.dash-chart i:nth-child(2){height:44%}.dash-chart i:nth-child(3){height:39%}.dash-chart i:nth-child(4){height:67%}.dash-chart i:nth-child(5){height:58%}.dash-chart i:nth-child(6){height:82%}.dash-chart i:nth-child(7){height:72%}.dash-chart i:nth-child(8){height:94%}.dash-row{margin:11px 0;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:9px;font-size:10px}.dash-row span{width:28px;height:28px;border-radius:9px;background:var(--soft)}.dash-row em{font-style:normal;color:var(--deep);font-weight:900}.event-visual{background:var(--ink);color:var(--paper);padding:20px;display:grid;grid-template-columns:1.25fr .75fr;gap:12px}.event-poster{border-radius:18px;background:var(--accent);color:var(--ink);padding:24px;position:relative;overflow:hidden;display:flex;flex-direction:column}.event-poster h3{font-size:50px;line-height:.86;letter-spacing:-.07em;margin:auto 0;max-width:260px;word-break:break-word}.event-poster b{font-size:10px}.event-poster i{position:absolute;width:170px;height:170px;border:2px solid var(--ink);border-radius:50%;right:-48px;top:30px}.event-plan{border:1px solid color-mix(in srgb,var(--paper) 16%,transparent);border-radius:18px;padding:20px;display:flex;flex-direction:column}.event-plan span{padding:17px 0;border-bottom:1px solid color-mix(in srgb,var(--paper) 14%,transparent);font-size:9px}.event-plan button{margin-top:auto;background:var(--accent);color:var(--ink)}.portfolio-visual{padding:18px;background:var(--ink);display:grid;grid-template-columns:1.15fr .85fr;grid-template-rows:1fr 130px;gap:12px}.work{border-radius:16px;position:relative;overflow:hidden;background:linear-gradient(145deg,var(--deep),var(--accent))}.work:before,.work:after{content:"";position:absolute;background:color-mix(in srgb,var(--paper) 70%,transparent)}.work:before{width:46%;height:80%;bottom:0;left:18%;transform:skew(-12deg)}.work:after{width:60%;height:9px;left:8%;top:27%;transform:rotate(-16deg)}.work span{position:absolute;left:12px;top:10px;font-size:9px}.work-a{grid-row:1/3}.work-b{background:linear-gradient(145deg,var(--soft),var(--paper))}.work-copy{border-radius:16px;background:var(--paper);color:var(--ink);padding:17px;display:flex;flex-direction:column}.work-copy b{margin:7px 0 auto}.work-copy button{align-self:flex-start}.lesson-visual{background:var(--ink);color:var(--paper);padding:18px;display:grid;grid-template-columns:68px 1fr}.lesson-visual aside{border-right:1px solid color-mix(in srgb,var(--paper) 14%,transparent);display:flex;flex-direction:column;align-items:center;gap:20px;padding-top:8px}.lesson-visual aside b{width:34px;height:34px;border-radius:10px;background:var(--accent);color:var(--ink);display:grid;place-items:center}.lesson-visual aside span{font-size:9px;opacity:.4}.lesson-visual aside .on{opacity:1;color:var(--accent)}.lesson-visual main{padding:42px;display:flex;flex-direction:column}.lesson-visual h3{font-size:39px;letter-spacing:-.05em;margin:80px 0 8px}.lesson-visual p{font-size:12px;opacity:.6;max-width:350px}.lesson-progress{height:5px;background:color-mix(in srgb,var(--paper) 14%,transparent);border-radius:8px;margin:30px 0}.lesson-progress i{display:block;width:64%;height:100%;background:var(--accent);border-radius:8px}.lesson-visual button{align-self:flex-start;background:var(--accent);color:var(--ink)}.brand-visual{display:grid;grid-template-columns:1.05fr .95fr;grid-template-rows:1fr 1fr;padding:18px;gap:12px;background:var(--ink)}.brand-tile{border-radius:16px;padding:22px;background:var(--paper);display:flex;flex-direction:column}.tile-a{grid-row:1/3;background:var(--accent);justify-content:space-between}.tile-a span{font-weight:900;font-size:12px}.tile-a b{font-size:120px;letter-spacing:-.1em}.tile-b{flex-direction:row;align-items:center;justify-content:center;gap:8px}.tile-b i{width:58px;height:58px;border-radius:50%;background:var(--deep)}.tile-b i:nth-child(2){background:var(--accent)}.tile-b i:nth-child(3){background:var(--soft)}.tile-c b{font-size:21px;margin:8px 0 auto}.tile-c button{align-self:flex-start}.trust{min-height:92px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;align-items:center;gap:38px;overflow:hidden}.trust span{font-size:10px;color:var(--muted);white-space:nowrap}.trust b{font-size:13px;letter-spacing:.1em;white-space:nowrap}.section{padding:110px 0}.section-head{display:grid;grid-template-columns:.75fr 1.25fr;gap:7vw;align-items:end;margin-bottom:46px}.section-head small{font-size:10px;font-weight:900;letter-spacing:.15em;color:var(--deep)}.section-head h2{font-size:clamp(38px,5vw,64px);line-height:1;letter-spacing:-.055em;margin:10px 0}.section-head p{color:var(--muted);font-size:16px;max-width:540px}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metric{border-top:1px solid var(--ink);padding:22px 4px;min-height:170px}.metric b{display:block;font-size:clamp(34px,4vw,56px);letter-spacing:-.055em}.metric span{font-size:13px;font-weight:800}.metric p{font-size:11px;color:var(--muted)}.showcase{background:var(--ink);color:var(--paper)}.showcase .section-head small{color:var(--accent)}.showcase .section-head p{color:color-mix(in srgb,var(--paper) 65%,transparent)}.tabs{display:flex;gap:7px;margin-bottom:16px}.tabs button{border:1px solid color-mix(in srgb,var(--paper) 18%,transparent);background:transparent;color:color-mix(in srgb,var(--paper) 62%,transparent);border-radius:999px;padding:9px 14px;font-size:10px;font-weight:800}.tabs button.active{background:var(--accent);color:var(--ink);border-color:var(--accent)}.show-panel{display:none;grid-template-columns:.8fr 1.2fr;gap:7vw;align-items:center;min-height:450px;border-top:1px solid color-mix(in srgb,var(--paper) 15%,transparent);padding:42px 0}.show-panel.active{display:grid}.show-panel h3{font-size:40px;letter-spacing:-.04em;margin:14px 0}.show-panel p,.show-panel li{color:color-mix(in srgb,var(--paper) 65%,transparent);font-size:13px}.show-panel ul{list-style:none;padding:0;margin:28px 0}.show-panel li{padding:8px 0}.show-panel li:before{content:"✓";color:var(--accent);margin-right:9px}.panel-ui{min-height:330px;background:var(--paper);color:var(--ink);border-radius:22px;padding:24px}.panel-ui header{display:flex;justify-content:space-between;font-size:10px;font-weight:900}.panel-ui header i{font-style:normal;color:var(--deep)}.panel-focus{margin:45px 0 34px}.panel-focus>*{display:block}.panel-focus b{font-size:58px;letter-spacing:-.06em}.panel-focus span{font-size:11px;color:var(--muted)}.panel-lines{display:grid;gap:9px}.panel-lines i{height:10px;background:var(--soft);border-radius:8px}.panel-lines i:nth-child(2){width:74%}.panel-lines i:nth-child(3){width:52%}.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.feature-card{min-height:300px;border:1px solid var(--line);background:transparent;color:inherit;border-radius:20px;padding:24px;text-align:left;position:relative;transition:.2s}.feature-card:hover,.feature-card.active{background:var(--accent);border-color:var(--accent);transform:translateY(-4px)}.feature-card>span{font-size:10px;font-weight:900}.feature-card h3{font-size:24px;margin:75px 0 10px}.feature-card p{font-size:12px;color:var(--muted)}.feature-card i{position:absolute;right:22px;top:20px;font-style:normal}.feature-detail{margin-top:16px;border-radius:18px;background:var(--soft);padding:20px 24px;display:flex;align-items:center;gap:20px}.feature-detail b{min-width:180px}.feature-detail span{font-size:12px;color:var(--muted)}.quote{padding:115px 0;background:var(--soft)}.quote blockquote{font-size:clamp(34px,5vw,66px);line-height:1.1;letter-spacing:-.05em;margin:0;max-width:950px}.quote footer{margin-top:30px;font-size:11px;font-weight:800}.cta{padding:110px 0}.cta-box{min-height:420px;border-radius:30px;background:var(--accent);color:var(--ink);display:grid;grid-template-columns:1fr .65fr;align-items:end;padding:56px;position:relative;overflow:hidden}.cta-box:after{content:"";position:absolute;width:360px;height:360px;border:2px solid var(--ink);border-radius:50%;right:-70px;top:-90px}.cta-box h2{font-size:clamp(46px,6vw,80px);line-height:.95;letter-spacing:-.065em;margin:14px 0}.cta-box p{max-width:500px}.cta-box .primary{position:relative;z-index:1;justify-self:end}.footer{border-top:1px solid var(--line);padding:36px 0 55px;display:flex;justify-content:space-between;font-size:10px;color:var(--muted)}.modal{position:fixed;inset:0;background:color-mix(in srgb,var(--ink) 66%,transparent);z-index:50;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)}.modal.open{display:flex}.modal-card{width:min(520px,96vw);border-radius:24px;background:var(--paper);padding:28px;box-shadow:var(--shadow);color:var(--ink)}.modal-head{display:flex;align-items:flex-start;gap:15px}.modal-head>div{flex:1}.modal-head small{font-size:9px;letter-spacing:.15em;font-weight:900;color:var(--deep)}.modal-head h3{font-size:28px;margin:7px 0}.modal-close{width:35px;height:35px;border:1px solid var(--line);background:none;border-radius:50%}.demo-form{display:grid;gap:11px;margin-top:22px}.demo-form label{font-size:10px;font-weight:800}.demo-form input{display:block;width:100%;height:44px;border:1px solid var(--line);border-radius:11px;background:transparent;color:inherit;padding:0 12px;margin-top:5px;outline:none}.demo-form input:focus{border-color:var(--deep)}.demo-form .primary{margin-top:7px}.toast{position:fixed;left:50%;bottom:28px;z-index:70;transform:translate(-50%,20px);opacity:0;pointer-events:none;background:var(--ink);color:var(--paper);border:1px solid color-mix(in srgb,var(--paper) 20%,transparent);border-radius:999px;padding:11px 16px;font-size:11px;font-weight:800;box-shadow:var(--shadow);transition:.25s}.toast.show{opacity:1;transform:translate(-50%,0)}body.night{--paper:${ink};--ink:${paper};--soft:${deep};--deep:${accent};--line:color-mix(in srgb,var(--ink) 18%,transparent)}body.night .primary{background:var(--accent);border-color:var(--accent);color:${ink}}body.night .visual{box-shadow:none}.is-saved{background:var(--accent)!important;color:${ink}!important;border-color:var(--accent)!important}
@media(max-width:850px){.nav-links{display:none}.hero{grid-template-columns:1fr;padding:55px 0}.visual{min-height:430px}.section-head,.show-panel,.cta-box{grid-template-columns:1fr}.section{padding:78px 0}.metrics,.feature-grid{grid-template-columns:1fr}.metric{min-height:auto}.show-panel{gap:30px}.cta-box{padding:35px}.cta-box .primary{justify-self:start}.event-visual{grid-template-columns:1fr}.event-plan{display:none}.phone{transform:scale(.86)!important}.editorial-visual{grid-template-columns:1fr}.editorial-visual article:nth-child(2){display:none}.portfolio-visual{grid-template-columns:1fr}.work-b,.work-copy{display:none}.brand-visual{grid-template-columns:1fr}.tile-b,.tile-c{display:none}.window-body main{padding:20px}.hero h1{font-size:52px}}@media(max-width:520px){.wrap{width:min(92vw,1180px)}.nav{padding:0 4vw}.hero{min-height:auto}.visual{min-height:390px}.hero-note{display:none}.dash-kpis{grid-template-columns:1fr}.dash-kpis span:nth-child(n+2){display:none}.cta-box{min-height:360px}.feature-detail{display:block}.feature-detail b{display:block;margin-bottom:6px}}
</style>
</head>
<body class="family-${spec.family}">
<div class="page" id="top">
<header class="nav"><button class="logo" type="button" data-jump="top"><i>${escapeHtml(spec.brand.slice(0, 1))}</i>${escapeHtml(spec.brand)}</button><nav class="nav-links"><button type="button" data-jump="overview">概览</button><button type="button" data-jump="product">产品</button><button type="button" data-jump="stories">体验</button><button type="button" data-jump="contact">联系</button></nav><button type="button" class="theme-btn" data-theme aria-label="切换明暗主题">◐</button></header>
<main>
<section class="hero wrap"><div class="hero-copy"><span class="eyebrow">${escapeHtml(spec.eyebrow)}</span><h1>${escapeHtml(spec.headline)}</h1><p>${escapeHtml(spec.summary)}</p><div class="hero-actions"><button type="button" class="primary" data-action="primary">${escapeHtml(spec.primary)}　↗</button><button type="button" class="secondary" data-action="save">♡　${escapeHtml(spec.secondary)}</button></div><div class="hero-note"><span>实时交互演示</span><span>响应式商业界面</span><span>无需注册</span></div></div>${visualMarkup(spec)}</section>
<section class="trust"><div class="wrap" style="display:flex;align-items:center;gap:38px"><span>TRUSTED EXPERIENCE</span>${spec.tags.map((tag) => `<b>${escapeHtml(tag)}</b>`).join('')}<b>${escapeHtml(spec.brand)}</b><b>DESIGNED FOR 2026</b></div></section>
<section class="section wrap" id="overview"><div class="section-head"><div><small>01 / BUSINESS OVERVIEW</small><h2>关键价值，<br>一眼可见。</h2></div><p>${escapeHtml(spec.summary)} 数据、任务和品牌表达被组织在同一套清晰体验中。</p></div><div class="metrics">${spec.metrics.map((item) => `<article class="metric"><b>${escapeHtml(item[0])}</b><span>${escapeHtml(item[1])}</span><p>${escapeHtml(item[2])}</p></article>`).join('')}</div></section>
<section class="section showcase" id="product"><div class="wrap"><div class="section-head"><div><small>02 / INTERACTIVE PRODUCT</small><h2>不只是展示，<br>而是可以使用。</h2></div><p>点击标签切换产品模块。每个状态都拥有清晰反馈，让体验从第一屏延续到真实任务。</p></div><div class="tabs" role="tablist">${spec.features.map((item, tabIndex) => `<button type="button" class="${tabIndex === 0 ? 'active' : ''}" data-tab="${tabIndex}">${escapeHtml(item[0])}</button>`).join('')}</div>${panels}</div></section>
<section class="section wrap" id="stories"><div class="section-head"><div><small>03 / EXPERIENCE SYSTEM</small><h2>每一个细节，<br>都服务于行动。</h2></div><p>选择任意能力卡片查看反馈。组件、动效与内容共同构成可持续扩展的商业产品系统。</p></div><div class="feature-grid">${featureCards}</div><div class="feature-detail"><b id="featureTitle">${escapeHtml(spec.features[0]![0])}</b><span id="featureCopy">${escapeHtml(spec.features[0]![1])}</span></div></section>
<section class="quote"><div class="wrap"><blockquote>“优秀的商业体验，不只是看起来完整，而是让用户始终知道下一步。”</blockquote><footer>${escapeHtml(spec.brand)} · PRODUCT EXPERIENCE PRINCIPLE</footer></div></section>
<section class="cta wrap" id="contact"><div class="cta-box"><div><small>READY TO EXPERIENCE</small><h2>${escapeHtml(spec.primary)}</h2><p>${escapeHtml(spec.summary)}</p></div><button type="button" class="primary" data-action="primary">开启交互体验　↗</button></div></section>
</main>
<footer class="footer wrap"><span>© 2026 ${escapeHtml(spec.brand)}</span><span>${escapeHtml(spec.tags.join(' · '))}</span><span>SCROLL TO EXPLORE ↑</span></footer>
</div>
<div class="modal" id="demoModal" role="dialog" aria-modal="true" aria-labelledby="demoTitle"><form class="modal-card demo-form" id="demoForm"><div class="modal-head"><div><small>INTERACTIVE REQUEST</small><h3 id="demoTitle">${escapeHtml(spec.primary)}</h3><p>${escapeHtml(spec.summary)}</p></div><button class="modal-close" type="button" data-close aria-label="关闭">×</button></div><label>你的名字<input required name="name" placeholder="请输入名字"></label><label>工作邮箱<input required type="email" name="email" placeholder="name@company.com"></label><label>最关注的方向<input name="goal" value="${escapeHtml(spec.features[0]![0])}"></label><button class="primary" type="submit">确认提交　↗</button></form></div>
<div class="toast" id="toast" aria-live="polite">操作已完成</div>
<script>
(function(){
  var toast=document.getElementById('toast');var toastTimer;
  function notify(text){toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){toast.classList.remove('show')},1900)}
  function jump(id){var node=document.getElementById(id);if(node)node.scrollIntoView({behavior:'smooth',block:'start'})}
  document.querySelectorAll('[data-jump]').forEach(function(button){button.addEventListener('click',function(){jump(button.getAttribute('data-jump'))})});
  document.querySelector('[data-theme]').addEventListener('click',function(){document.body.classList.toggle('night');notify(document.body.classList.contains('night')?'已切换深色体验':'已切换浅色体验')});
  document.querySelectorAll('[data-action="primary"]').forEach(function(button){button.addEventListener('click',function(){document.getElementById('demoModal').classList.add('open');setTimeout(function(){var input=document.querySelector('#demoForm input');if(input)input.focus()},80)})});
  var save=document.querySelector('[data-action="save"]');save.addEventListener('click',function(){var active=save.classList.toggle('is-saved');save.innerHTML=active?'✓　已保存到项目':'♡　${escapeHtml(spec.secondary)}';notify(active?'已保存，可随时继续编辑':'已从收藏中移除')});
  document.querySelectorAll('[data-tab]').forEach(function(tab){tab.addEventListener('click',function(){document.querySelectorAll('[data-tab]').forEach(function(x){x.classList.remove('active')});document.querySelectorAll('[data-panel]').forEach(function(x){x.classList.remove('active')});tab.classList.add('active');var panel=document.querySelector('[data-panel="'+tab.getAttribute('data-tab')+'"]');if(panel)panel.classList.add('active');notify('已切换到 '+tab.textContent)})});
  document.querySelectorAll('[data-feature]').forEach(function(card){card.addEventListener('click',function(){document.querySelectorAll('[data-feature]').forEach(function(x){x.classList.remove('active')});card.classList.add('active');document.getElementById('featureTitle').textContent=card.getAttribute('data-title');document.getElementById('featureCopy').textContent=card.getAttribute('data-copy');notify('已选择 '+card.getAttribute('data-title'))})});
  document.querySelectorAll('[data-pulse]').forEach(function(button){button.addEventListener('click',function(){button.classList.add('is-saved');var old=button.textContent;button.textContent='✓ 已完成';notify(old+' · 交互已触发');setTimeout(function(){button.classList.remove('is-saved');button.textContent=old},1500)})});
  document.querySelector('[data-close]').addEventListener('click',function(){document.getElementById('demoModal').classList.remove('open')});
  document.getElementById('demoModal').addEventListener('click',function(event){if(event.target===event.currentTarget)event.currentTarget.classList.remove('open')});
  document.getElementById('demoForm').addEventListener('submit',function(event){event.preventDefault();document.getElementById('demoModal').classList.remove('open');notify('提交成功，体验顾问会尽快联系你');event.currentTarget.reset()});
  document.addEventListener('keydown',function(event){if(event.key==='Escape')document.getElementById('demoModal').classList.remove('open')});
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

export function enhanceLegacyStarterHtml(html: string, projectName: string): string {
  if (!html.includes('</body>') || html.includes('data-od-legacy-interactions')) return html;
  const projectLabel = JSON.stringify(projectName);
  const injection = `<style data-od-legacy-interactions>
  .od-commercial-continuation{min-height:640px;padding:90px max(6vw,28px);background:#18221b;color:#f4f7f1;font-family:Inter,"PingFang SC",system-ui,sans-serif;display:flex;flex-direction:column;justify-content:center}.od-commercial-continuation small{font-size:10px;font-weight:900;letter-spacing:.16em;color:#a4f584}.od-commercial-continuation h2{max-width:760px;margin:18px 0 36px;font-size:clamp(42px,7vw,82px);line-height:1;letter-spacing:-.055em}.od-commercial-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.od-commercial-grid article{min-height:190px;padding:22px;border:1px solid #ffffff24;border-radius:18px;background:#ffffff09}.od-commercial-grid b,.od-commercial-grid span{display:block}.od-commercial-grid b{font-size:17px;margin-bottom:10px}.od-commercial-grid span{font-size:12px;line-height:1.6;color:#bdc8c0}.od-commercial-continuation button{align-self:flex-start;margin-top:26px;border:0;border-radius:11px;background:#a4f584;color:#18221b;padding:12px 17px;font-weight:850}.od-demo-toast{position:fixed;left:50%;bottom:24px;z-index:2147483647;transform:translate(-50%,16px);opacity:0;padding:11px 16px;border-radius:999px;background:#18221b;color:#fff;font:700 12px/1.2 Inter,system-ui,sans-serif;box-shadow:0 16px 40px rgba(16,25,18,.28);transition:.22s;pointer-events:none}.od-demo-toast.show{opacity:1;transform:translate(-50%,0)}button.od-demo-active{box-shadow:0 0 0 4px rgba(139,232,93,.28)!important;transform:translateY(-1px)}@media(max-width:700px){.od-commercial-grid{grid-template-columns:1fr}.od-commercial-continuation{padding-top:65px;padding-bottom:65px}}
  </style><section class="od-commercial-continuation"><small>COMMERCIAL EXPERIENCE · CONTINUE SCROLLING</small><h2>${escapeHtml(projectName)}，不止第一屏。</h2><div class="od-commercial-grid"><article><b>完整内容结构</b><span>继续向下探索产品价值、真实场景与行动入口。</span></article><article><b>响应式商业版式</b><span>桌面与移动端都保持清晰层级和可靠阅读节奏。</span></article><article><b>可感知的交互</b><span>点击页面中的按钮即可查看状态变化与操作反馈。</span></article></div><button type="button">体验下一步　↗</button></section><div class="od-demo-toast" id="odDemoToast" aria-live="polite">操作已完成</div><script data-od-legacy-interactions>
  (function(){var toast=document.getElementById('odDemoToast'),timer,name=${projectLabel};function show(text){toast.textContent=text;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(function(){toast.classList.remove('show')},1800)}document.addEventListener('click',function(event){var button=event.target.closest&&event.target.closest('button');if(!button)return;button.classList.add('od-demo-active');setTimeout(function(){button.classList.remove('od-demo-active')},520);var label=(button.textContent||'').replace(/\\s+/g,' ').trim()||'按钮';show(name+' · '+label+' 已触发');button.setAttribute('aria-pressed',button.getAttribute('aria-pressed')==='true'?'false':'true')});})();
  </script>`;
  return html.replace('</body>', `${injection}</body>`);
}
