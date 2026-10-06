(function (global) {
  "use strict";

  var CATEGORY_COPY = {
    all: { zh: "全部", en: "All" },
    web: { zh: "网站与落地页", en: "Web & landing" },
    app: { zh: "App", en: "Apps" },
    dashboard: { zh: "数据后台", en: "Dashboards" },
    commerce: { zh: "电商与服务", en: "Commerce" },
    deck: { zh: "演示与文档", en: "Decks & docs" },
    brand: { zh: "品牌与营销", en: "Brand & marketing" }
  };

  var COPY = {
    zh: {
      commercial: "商业授权",
      live: "真实 HTML",
      pro: "PRO",
      screens: "个可编辑界面",
      preview: "预览模板",
      use: "使用",
      useNow: "直接使用",
      useNowSub: "将模板说明填入创作器",
      useBrief: "带示例提示词使用",
      useBriefSub: "保留模板结构与示例内容",
      remix: "Remix 为新项目",
      remixSub: "复制结构并开始个性化编辑",
      share: "分享",
      shared: "模板链接已复制",
      favorite: "收藏",
      favorited: "已收藏",
      colorway: "切换配色",
      previous: "上一个界面",
      next: "下一个界面",
      close: "关闭预览",
      interaction: "交互原型",
      interactionReady: "页面任意区域、导航、按钮和数据卡片都可以点击",
      actionDone: "已触发：",
      page: "界面",
      included: "已包含",
      screenRailTitle: "全部界面",
      scrollHint: "向下滚动查看完整页面清单",
      interactive: "可交互",
      desktop: "桌面",
      tablet: "平板",
      mobile: "手机",
      featured: "本周商业精选",
      featuredDescription: "完整的 13 页面品牌手册，覆盖策略、视觉规范、落地应用与资源下载。所有页面均为可点击、可交互 HTML，而不是静态占位图。",
      previewScreens: "预览 13 个界面",
      librarySub: "{kits} 套商业级模板 · 每套 {screens} 个可交互界面 · 共 {pages} 个真实页面",
      uses: "次使用",
      scrollable: "长页可滚动",
      scrollHintCanvas: "向上滚动 · 浏览完整长页",
      interactionHint: "界面内所有按钮、导航与卡片都可点击，并产生真实反馈",
      navHint: "点击导航项可直接切换界面",
      deepTitle: "完整商业版长页",
      deepSub: "首屏之下还有数据、案例、定价与常见问题等完整章节",
      readingProgress: "阅读进度",
      toTop: "回到顶部",
      pressed: "已触发：",
      added: "已加入",
      liked: "已收藏",
      subscribed: "订阅成功",
      sentMessage: "消息已发送",
      playState: "正在播放",
      cartLabel: "购物袋",
      resetFilters: "重置筛选",
      faqLabel: "常见问题"
    },
    en: {
      commercial: "Commercial license",
      live: "LIVE HTML",
      pro: "PRO",
      screens: "editable screens",
      preview: "Preview template",
      use: "Use",
      useNow: "Use now",
      useNowSub: "Add the template brief to the composer",
      useBrief: "Use with sample brief",
      useBriefSub: "Keep the structure and sample content",
      remix: "Remix as a new project",
      remixSub: "Duplicate the structure and personalize it",
      share: "Share",
      shared: "Template link copied",
      favorite: "Favorite",
      favorited: "Saved",
      colorway: "Switch colorway",
      previous: "Previous screen",
      next: "Next screen",
      close: "Close preview",
      interaction: "Interactive prototype",
      interactionReady: "Every page area, navigation item, button, and data card is clickable",
      actionDone: "Activated: ",
      page: "Screen",
      included: "Included",
      screenRailTitle: "All screens",
      scrollHint: "Scroll down to browse the complete page set",
      interactive: "Interactive",
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobile",
      featured: "COMMERCIAL PICK",
      featuredDescription: "A complete 13-screen brand playbook covering strategy, visual rules, applications, and downloadable assets. Every page is clickable HTML—not a placeholder image.",
      previewScreens: "Preview 13 screens",
      librarySub: "{kits} commercial-grade kits · {screens} interactive screens each · {pages} real pages",
      uses: "uses",
      scrollable: "Scrollable page",
      scrollHintCanvas: "Scroll up · browse the full-length page",
      interactionHint: "Every button, nav item, and card in the artwork is clickable with real feedback",
      navHint: "Click a navigation item to jump straight to that screen",
      deepTitle: "Full commercial page",
      deepSub: "Below the fold: data, case studies, pricing, and FAQ chapters",
      readingProgress: "Reading progress",
      toTop: "Back to top",
      pressed: "Activated: ",
      added: "Added",
      liked: "Saved",
      subscribed: "Subscribed",
      sentMessage: "Message sent",
      playState: "Now playing",
      cartLabel: "Shopping bag",
      resetFilters: "Reset filters",
      faqLabel: "FAQ"
    }
  };

  var BASE_TEMPLATES = [
    {
      id: "northstar-saas-console", category: "dashboard", kind: "dashboard", skin: "northstar",
      accent: "#9cff57", alt: "#71d7ff", bg: "#101411", surface: "#f2f5ee", ink: "#152015", uses: "18.6k",
      zh: { name: "Northstar SaaS 经营台", category: "SaaS 数据后台", desc: "面向 B2B 产品团队的经营看板，覆盖收入、客户健康度与增长漏斗。", tags: ["SaaS", "B2B", "数据可视化"], pages: ["经营总览", "客户健康", "收入分析"] },
      en: { name: "Northstar SaaS Console", category: "SaaS dashboard", desc: "A B2B operating console for revenue, customer health, and growth funnels.", tags: ["SaaS", "B2B", "Analytics"], pages: ["Overview", "Customer health", "Revenue"] }
    },
    {
      id: "forma-furniture-store", category: "commerce", kind: "commerce", skin: "forma",
      accent: "#f1683a", alt: "#5b7c64", bg: "#eee9df", surface: "#fffaf2", ink: "#1d241f", uses: "14.2k",
      zh: { name: "Forma 家居商店", category: "精品电商", desc: "带产品筛选、购物车与搭配故事的高端家居电商模板。", tags: ["电商", "生活方式", "响应式"], pages: ["品牌首页", "系列商店", "商品详情"] },
      en: { name: "Forma Furniture Store", category: "Premium commerce", desc: "A premium furniture storefront with filters, cart interactions, and editorial stories.", tags: ["Commerce", "Lifestyle", "Responsive"], pages: ["Home", "Collection", "Product detail"] }
    },
    {
      id: "moneta-mobile-finance", category: "app", kind: "mobile", skin: "moneta",
      accent: "#d7ff54", alt: "#a98cff", bg: "#171a2b", surface: "#f5f6fa", ink: "#161824", uses: "12.9k",
      zh: { name: "Moneta 移动金融", category: "金融 App", desc: "包含资产总览、转账与预算分析的移动金融产品界面。", tags: ["FinTech", "移动端", "图表"], pages: ["资产总览", "快捷转账", "预算洞察"] },
      en: { name: "Moneta Mobile Finance", category: "Finance app", desc: "A mobile finance experience with net worth, transfers, and budget insights.", tags: ["FinTech", "Mobile", "Charts"], pages: ["Net worth", "Transfer", "Budget insights"] }
    },
    {
      id: "afterlight-conference", category: "web", kind: "event", skin: "afterlight",
      accent: "#ff4f91", alt: "#ffbd33", bg: "#151128", surface: "#211a3d", ink: "#fff7ee", uses: "10.7k",
      zh: { name: "Afterlight 创意大会", category: "活动落地页", desc: "强节奏视觉、讲者阵容、日程与购票流程组成的活动官网。", tags: ["活动", "创意", "售票"], pages: ["大会首页", "讲者阵容", "日程与票务"] },
      en: { name: "Afterlight Conference", category: "Event landing", desc: "A high-energy conference site with speakers, schedule, and ticket flow.", tags: ["Event", "Creative", "Tickets"], pages: ["Event home", "Speakers", "Schedule & tickets"] }
    },
    {
      id: "orbit-venture-deck", category: "deck", kind: "deck", skin: "orbit",
      accent: "#fcff59", alt: "#57ffcf", bg: "#20234a", surface: "#f4f3e8", ink: "#17182b", uses: "21.4k",
      zh: { name: "Orbit 融资路演", category: "商业演示", desc: "从市场机会到商业模型和融资计划的一套完整投资人路演。", tags: ["融资", "路演", "商业"], pages: ["愿景封面", "市场机会", "增长与财务"] },
      en: { name: "Orbit Venture Deck", category: "Pitch deck", desc: "A complete investor narrative from market opportunity to traction and fundraising.", tags: ["Fundraising", "Pitch", "Business"], pages: ["Vision", "Opportunity", "Growth & financials"] }
    },
    {
      id: "fieldnotes-digital-guide", category: "deck", kind: "editorial", skin: "fieldnotes",
      accent: "#2e68ff", alt: "#d34c3f", bg: "#c8d5ee", surface: "#fffdf6", ink: "#172138", uses: "16.8k", featured: true,
      zh: { name: "Fieldnotes 品牌实战手册", category: "数字指南", desc: "双页编辑排版，适合品牌手册、创作者指南与商业电子书。", tags: ["电子书", "编辑设计", "品牌"], pages: ["封面与目录", "方法章节", "检查清单"] },
      en: { name: "Fieldnotes Brand Playbook", category: "Digital guide", desc: "A two-page editorial system for brand manuals, creator guides, and commercial ebooks.", tags: ["Ebook", "Editorial", "Brand"], pages: ["Cover & contents", "Method chapter", "Checklist"] }
    },
    {
      id: "folio-architecture", category: "web", kind: "portfolio", skin: "folio",
      accent: "#e9ff4a", alt: "#ff805d", bg: "#d7d3c8", surface: "#171a18", ink: "#f6f2e9", uses: "9.6k",
      zh: { name: "Folio 建筑作品集", category: "创意作品集", desc: "以大幅案例图、项目索引和工作室档案构成的建筑作品集。", tags: ["作品集", "建筑", "极简"], pages: ["精选项目", "项目案例", "工作室档案"] },
      en: { name: "Folio Architecture", category: "Creative portfolio", desc: "An architecture portfolio with oversized case studies, an index, and studio profile.", tags: ["Portfolio", "Architecture", "Minimal"], pages: ["Selected work", "Case study", "Studio profile"] }
    },
    {
      id: "nest-property-market", category: "commerce", kind: "realestate", skin: "nest",
      accent: "#244f3d", alt: "#c45b42", bg: "#e8eee8", surface: "#fffdf8", ink: "#163126", uses: "8.8k",
      zh: { name: "Nest 精品房产", category: "房产服务", desc: "真实房源浏览、条件筛选、经纪人联系与预约看房体验。", tags: ["房产", "搜索", "预约"], pages: ["精选房源", "房源详情", "预约看房"] },
      en: { name: "Nest Property Market", category: "Real estate", desc: "A property marketplace with live filters, agent contact, and viewing requests.", tags: ["Property", "Search", "Booking"], pages: ["Listings", "Property detail", "Book a viewing"] }
    },
    {
      id: "serein-restaurant", category: "commerce", kind: "restaurant", skin: "serein",
      accent: "#b4452e", alt: "#2c735c", bg: "#e7d6c4", surface: "#f8f0e3", ink: "#321f18", uses: "7.9k",
      zh: { name: "Serein 餐厅品牌站", category: "餐饮预订", desc: "融合主厨故事、季节菜单与桌位预订的餐厅品牌网站。", tags: ["餐饮", "菜单", "预订"], pages: ["餐厅首页", "季节菜单", "桌位预订"] },
      en: { name: "Serein Restaurant", category: "Dining & booking", desc: "A restaurant experience combining chef story, seasonal menu, and reservations.", tags: ["Dining", "Menu", "Booking"], pages: ["Restaurant home", "Seasonal menu", "Reservation"] }
    },
    {
      id: "roam-travel-booking", category: "commerce", kind: "travel", skin: "roam",
      accent: "#ff6a49", alt: "#116e8a", bg: "#bce0e8", surface: "#fffdf7", ink: "#133946", uses: "11.3k",
      zh: { name: "Roam 旅行预订", category: "旅行服务", desc: "目的地发现、行程组合与预订确认一体化旅行体验。", tags: ["旅行", "预订", "探索"], pages: ["目的地发现", "行程详情", "预订确认"] },
      en: { name: "Roam Travel Booking", category: "Travel service", desc: "An end-to-end travel experience for discovery, itinerary building, and checkout.", tags: ["Travel", "Booking", "Explore"], pages: ["Discover", "Trip detail", "Booking"] }
    },
    {
      id: "pulse-care-center", category: "dashboard", kind: "health", skin: "pulse",
      accent: "#36c7a1", alt: "#557cff", bg: "#e8f6f2", surface: "#ffffff", ink: "#153831", uses: "13.1k",
      zh: { name: "Pulse 健康管理台", category: "医疗服务后台", desc: "患者概览、预约排班和健康趋势组成的医疗服务工作台。", tags: ["医疗", "预约", "数据"], pages: ["患者概览", "预约排班", "健康趋势"] },
      en: { name: "Pulse Care Center", category: "Health dashboard", desc: "A care workspace for patient overview, appointment planning, and health trends.", tags: ["Health", "Scheduling", "Data"], pages: ["Patients", "Appointments", "Health trends"] }
    },
    {
      id: "lumen-course-platform", category: "app", kind: "course", skin: "lumen",
      accent: "#7c5cff", alt: "#ff754c", bg: "#ede9ff", surface: "#ffffff", ink: "#231a49", uses: "10.2k",
      zh: { name: "Lumen 在线课程", category: "学习平台", desc: "课程发现、沉浸式学习和学习进度管理的在线教育产品。", tags: ["教育", "视频", "学习进度"], pages: ["课程发现", "学习空间", "学习进度"] },
      en: { name: "Lumen Course Platform", category: "Learning app", desc: "An online learning product for course discovery, focused lessons, and progress.", tags: ["Education", "Video", "Progress"], pages: ["Discover", "Lesson player", "Progress"] }
    },
    {
      id: "signal-social-campaign", category: "brand", kind: "campaign", skin: "signal",
      accent: "#ff3d5d", alt: "#2f66ff", bg: "#f4dfff", surface: "#fffaf4", ink: "#2d1834", uses: "8.5k",
      zh: { name: "Signal 社媒营销包", category: "营销活动", desc: "覆盖主视觉、社媒内容排期与活动数据的营销战役模板。", tags: ["营销", "社交媒体", "活动"], pages: ["活动主视觉", "内容排期", "效果复盘"] },
      en: { name: "Signal Social Campaign", category: "Marketing campaign", desc: "A campaign system spanning key visual, social calendar, and performance review.", tags: ["Marketing", "Social", "Campaign"], pages: ["Key visual", "Content calendar", "Performance"] }
    },
    {
      id: "arca-brand-system", category: "brand", kind: "brand", skin: "arca",
      accent: "#ff5b34", alt: "#2360ff", bg: "#ded7c9", surface: "#f8f4eb", ink: "#181815", uses: "15.7k",
      zh: { name: "Arca 品牌系统", category: "品牌规范", desc: "从品牌理念、标志规则到色彩和应用场景的完整视觉系统。", tags: ["品牌", "规范", "视觉系统"], pages: ["品牌核心", "视觉语言", "应用示例"] },
      en: { name: "Arca Brand System", category: "Brand guidelines", desc: "A complete visual system from brand idea and logo rules to applications.", tags: ["Brand", "Guidelines", "Identity"], pages: ["Brand core", "Visual language", "Applications"] }
    },
    {
      id: "common-good-impact-report", category: "deck", kind: "report", skin: "commongood",
      accent: "#ffcc3d", alt: "#40bca0", bg: "#203c34", surface: "#f5f0df", ink: "#1c352e", uses: "6.9k",
      zh: { name: "Common Good 年度报告", category: "影响力报告", desc: "用数据、人物故事与行动计划讲述组织年度影响力。", tags: ["年度报告", "公益", "数据故事"], pages: ["年度封面", "影响力数据", "人物故事"] },
      en: { name: "Common Good Impact Report", category: "Impact report", desc: "An annual narrative built from outcomes, human stories, and next actions.", tags: ["Annual report", "Impact", "Data story"], pages: ["Annual cover", "Impact data", "People stories"] }
    },
    {
      id: "welcome-people-ops", category: "dashboard", kind: "hr", skin: "welcome",
      accent: "#ff845d", alt: "#4e78e8", bg: "#f5eee6", surface: "#ffffff", ink: "#382821", uses: "7.4k",
      zh: { name: "Welcome 团队入职台", category: "人力协作", desc: "新成员入职任务、团队介绍与培训进度的一站式协作台。", tags: ["HR", "入职", "团队协作"], pages: ["入职首页", "任务计划", "团队与资源"] },
      en: { name: "Welcome People Ops", category: "People operations", desc: "A one-stop onboarding hub for tasks, team introductions, and learning.", tags: ["HR", "Onboarding", "Team"], pages: ["Welcome home", "Task plan", "Team & resources"] }
    },
    {
      id: "muse-ai-workspace", category: "app", kind: "ai", skin: "muse",
      accent: "#b7ff65", alt: "#7e8cff", bg: "#101217", surface: "#1b1e26", ink: "#f5f8ef", uses: "19.3k",
      zh: { name: "Muse AI 创作空间", category: "AI 工作台", desc: "集对话、素材库、生成历史和协作批注于一体的 AI 产品界面。", tags: ["AI", "创作", "工作空间"], pages: ["创作首页", "素材画布", "生成历史"] },
      en: { name: "Muse AI Workspace", category: "AI workspace", desc: "An AI product interface unifying chat, assets, generation history, and review.", tags: ["AI", "Creation", "Workspace"], pages: ["Create home", "Asset canvas", "Generation history"] }
    },
    {
      id: "kindred-nonprofit", category: "web", kind: "nonprofit", skin: "kindred",
      accent: "#e64f34", alt: "#23634d", bg: "#f1e5d6", surface: "#fff9ee", ink: "#2d2c20", uses: "6.4k",
      zh: { name: "Kindred 公益行动站", category: "公益官网", desc: "以影响力故事、项目进展和透明捐赠流程构成的公益网站。", tags: ["公益", "故事", "捐赠"], pages: ["行动首页", "项目故事", "透明捐赠"] },
      en: { name: "Kindred Nonprofit", category: "Nonprofit website", desc: "An impact-led nonprofit site with stories, programs, and transparent giving.", tags: ["Nonprofit", "Stories", "Giving"], pages: ["Impact home", "Program stories", "Donate"] }
    }
  ];

  /* The extended catalog (studio-templates-catalog.js) carries 50 more commercial kits. */
  var CATALOG_TEMPLATES = Array.isArray(global.StudioTemplateCatalog) ? global.StudioTemplateCatalog : [];
  var TEMPLATES = BASE_TEMPLATES.concat(CATALOG_TEMPLATES);
  TEMPLATES.forEach(function (template) {
    if (!template.more) return;
    template.zh.pages = template.zh.pages.concat(template.more.zh || []);
    template.en.pages = template.en.pages.concat(template.more.en || []);
  });

  /* Every commercial kit ships as a complete product, not a three-screen teaser. */
  var TEMPLATE_EXTRA_PAGES = {
    "northstar-saas-console": {
      zh: ["增长漏斗", "订阅计划", "客户列表", "客户详情", "产品使用", "留存队列", "销售管道", "团队绩效", "告警中心", "系统设置"],
      en: ["Growth funnel", "Subscription plans", "Customer list", "Customer profile", "Product usage", "Retention cohorts", "Sales pipeline", "Team performance", "Alert center", "Settings"]
    },
    "forma-furniture-store": {
      zh: ["搜索结果", "空间灵感", "搭配方案", "购物车", "结算配送", "支付确认", "订单追踪", "会员中心", "收藏清单", "品牌故事"],
      en: ["Search results", "Room inspiration", "Styled sets", "Shopping bag", "Delivery checkout", "Payment", "Order tracking", "Member account", "Wishlist", "Brand story"]
    },
    "moneta-mobile-finance": {
      zh: ["登录验证", "主卡管理", "交易明细", "账单详情", "收款码", "定期存款", "投资组合", "信用评分", "安全中心", "个人设置"],
      en: ["Secure sign in", "Card management", "Transactions", "Bill detail", "Receive money", "Savings goals", "Portfolio", "Credit score", "Security center", "Profile settings"]
    },
    "afterlight-conference": {
      zh: ["嘉宾详情", "会场地图", "单日日程", "工作坊详情", "门票方案", "购票结算", "参会凭证", "合作伙伴", "媒体中心", "常见问题"],
      en: ["Speaker profile", "Venue map", "Daily schedule", "Workshop detail", "Ticket tiers", "Ticket checkout", "Event pass", "Partners", "Press room", "FAQ"]
    },
    "orbit-venture-deck": {
      zh: ["用户痛点", "产品方案", "核心能力", "商业模式", "竞争格局", "市场进入", "增长数据", "团队介绍", "财务预测", "融资用途"],
      en: ["Customer problem", "Product solution", "Core capabilities", "Business model", "Competitive map", "Go to market", "Traction", "Team", "Financial forecast", "Use of funds"]
    },
    "fieldnotes-digital-guide": {
      zh: ["品牌定位", "受众画像", "核心叙事", "语气原则", "视觉节奏", "内容框架", "渠道示例", "发布计划", "评估指标", "资源附录"],
      en: ["Positioning", "Audience portraits", "Core narrative", "Voice principles", "Visual rhythm", "Content framework", "Channel examples", "Launch plan", "Success metrics", "Resource appendix"]
    },
    "folio-architecture": {
      zh: ["项目索引", "住宅案例", "公共空间", "文化建筑", "空间细节", "设计过程", "材料研究", "获奖记录", "团队成员", "联系工作室"],
      en: ["Project index", "Residential case", "Public space", "Cultural building", "Spatial details", "Design process", "Material studies", "Awards", "Team", "Contact studio"]
    },
    "nest-property-market": {
      zh: ["地图找房", "筛选结果", "社区详情", "户型图册", "设施清单", "经纪人档案", "看房日程", "贷款测算", "收藏房源", "个人中心"],
      en: ["Map search", "Filtered results", "Neighborhood", "Floor plans", "Amenities", "Agent profile", "Viewing calendar", "Mortgage calculator", "Saved homes", "Account"]
    },
    "serein-restaurant": {
      zh: ["主厨故事", "食材产地", "酒水单", "菜品详情", "私人宴会", "桌位选择", "预订确认", "礼品卡", "媒体报道", "到店指南"],
      en: ["Chef story", "Our producers", "Wine list", "Dish detail", "Private dining", "Choose a table", "Booking confirmation", "Gift cards", "Press", "Visit us"]
    },
    "roam-travel-booking": {
      zh: ["目的地搜索", "酒店列表", "酒店详情", "房型选择", "体验活动", "行程编辑", "旅伴邀请", "订单结算", "电子凭证", "旅行账户"],
      en: ["Destination search", "Hotel results", "Hotel detail", "Room selection", "Local experiences", "Itinerary builder", "Invite travelers", "Trip checkout", "Travel pass", "Traveler account"]
    },
    "pulse-care-center": {
      zh: ["患者档案", "检查结果", "用药计划", "医生排班", "远程问诊", "护理任务", "风险预警", "健康报告", "消息中心", "机构设置"],
      en: ["Patient profile", "Test results", "Medication plan", "Clinician roster", "Telehealth visit", "Care tasks", "Risk alerts", "Health report", "Messages", "Clinic settings"]
    },
    "lumen-course-platform": {
      zh: ["课程详情", "讲师主页", "章节目录", "视频课堂", "阅读材料", "互动测验", "作业提交", "讨论社区", "学习日历", "结业证书"],
      en: ["Course detail", "Instructor profile", "Curriculum", "Video lesson", "Reading material", "Interactive quiz", "Assignment", "Discussion", "Learning calendar", "Certificate"]
    },
    "signal-social-campaign": {
      zh: ["策略简报", "受众洞察", "创意方向", "素材看板", "短视频脚本", "帖子详情", "审批流程", "投放计划", "实时数据", "复盘报告"],
      en: ["Campaign brief", "Audience insight", "Creative direction", "Asset board", "Video script", "Post detail", "Approval flow", "Media plan", "Live analytics", "Campaign report"]
    },
    "arca-brand-system": {
      zh: ["标志规范", "安全空间", "品牌色彩", "字体系统", "图形语言", "图标系统", "摄影风格", "社媒应用", "包装应用", "下载中心"],
      en: ["Logo rules", "Clear space", "Color system", "Typography", "Graphic language", "Icon system", "Photography", "Social templates", "Packaging", "Download center"]
    },
    "common-good-impact-report": {
      zh: ["年度寄语", "组织使命", "项目地图", "教育成果", "社区成果", "资金流向", "伙伴网络", "志愿者故事", "未来计划", "数据附录"],
      en: ["Annual letter", "Mission", "Program map", "Education outcomes", "Community outcomes", "Funds allocation", "Partner network", "Volunteer story", "Next year", "Data appendix"]
    },
    "welcome-people-ops": {
      zh: ["欢迎清单", "第一周计划", "培训课程", "导师配对", "组织架构", "成员档案", "福利中心", "设备申请", "反馈问卷", "入职完成"],
      en: ["Welcome checklist", "First week", "Training hub", "Buddy matching", "Org chart", "People directory", "Benefits", "Equipment request", "Pulse survey", "Onboarding complete"]
    },
    "muse-ai-workspace": {
      zh: ["新建项目", "提示词编辑器", "文档生成", "图片生成", "视频生成", "版本对比", "团队评论", "共享空间", "模型管理", "工作区设置"],
      en: ["New project", "Prompt editor", "Document generation", "Image generation", "Video generation", "Version compare", "Team comments", "Shared workspace", "Model manager", "Workspace settings"]
    },
    "kindred-nonprofit": {
      zh: ["使命介绍", "项目列表", "项目详情", "影响力地图", "受助者故事", "志愿者报名", "活动日历", "捐赠方案", "捐赠结算", "公开透明"],
      en: ["Our mission", "Programs", "Program detail", "Impact map", "Community story", "Volunteer signup", "Events", "Giving options", "Donation checkout", "Transparency"]
    }
  };

  TEMPLATES.forEach(function (template) {
    var extra = TEMPLATE_EXTRA_PAGES[template.id];
    if (!extra) return;
    template.zh.pages = template.zh.pages.concat(extra.zh);
    template.en.pages = template.en.pages.concat(extra.en);
  });

  function langOf(lang) { return lang === "en" ? "en" : "zh"; }
  function text(lang, key, values) {
    var copy = COPY[langOf(lang)][key] || key;
    if (!values) return copy;
    return String(copy).replace(/\{(\w+)\}/g, function (match, name) {
      return values[name] == null ? match : String(values[name]);
    });
  }
  /* Every kit in the catalog ships 13 screens; the library subtitle reads from real data. */
  var SCREENS_PER_KIT = 13;
  function libraryStats() {
    var pages = 0;
    TEMPLATES.forEach(function (item) { pages += (item.zh.pages || []).length; });
    return { kits: TEMPLATES.length, screens: SCREENS_PER_KIT, pages: pages };
  }
  function librarySubtitle(lang) {
    return text(lang, "librarySub", libraryStats());
  }
  function localized(template, lang) { return template[langOf(lang)] || template.zh; }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function pageNumber(page) { return String(page + 1).padStart(2, "0"); }
  function byId(id) {
    for (var i = 0; i < TEMPLATES.length; i += 1) if (TEMPLATES[i].id === id) return TEMPLATES[i];
    return null;
  }
  function categoryList(lang) {
    var keys = ["all", "web", "app", "dashboard", "commerce", "deck", "brand"];
    return keys.map(function (key) {
      var count = key === "all" ? TEMPLATES.length : TEMPLATES.filter(function (item) { return item.category === key; }).length;
      return { id: key, label: CATEGORY_COPY[key][langOf(lang)], count: count };
    });
  }
  /* Pick a readable foreground for accent-filled surfaces from the accent itself,
     so light and dark palettes both keep commercial-grade contrast. */
  function accentInk(hex) {
    var value = String(hex || "").replace("#", "").trim();
    if (value.length === 3) value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
    if (value.length !== 6) return "#12160f";
    var channels = [0, 2, 4].map(function (offset) { return parseInt(value.slice(offset, offset + 2), 16) / 255; });
    if (channels.some(function (channel) { return isNaN(channel); })) return "#12160f";
    var luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    return luminance > 0.62 ? "#12160f" : "#ffffff";
  }
  function cssVars(template, alternate) {
    var accent = alternate ? template.alt : template.accent;
    return "--tpl-accent:" + esc(accent) + ";--tpl-on-accent:" + esc(accentInk(accent)) +
      ";--tpl-bg:" + esc(template.bg) + ";--tpl-surface:" + esc(template.surface) + ";--tpl-ink:" + esc(template.ink) + ";";
  }
  function dots() {
    return '<span class="tpl-window-dots"><i></i><i></i><i></i></span>';
  }
  function action(label, attributes) {
    return '<button type="button" class="tpl-demo-action" data-demo-action="' + esc(label) + '"' + (attributes || "") + '>' + esc(label) + '</button>';
  }
  function navItems(info, page) {
    var last = info.pages.length - 1;
    var indexes = [0];
    var start = Math.max(1, Math.min(Math.max(1, page - 1), Math.max(1, last - 2)));
    for (var i = start; i <= Math.min(last, start + 2); i += 1) indexes.push(i);
    if (indexes.indexOf(page) < 0) indexes[indexes.length - 1] = page;
    return indexes.filter(function (index, position) { return indexes.indexOf(index) === position; }).map(function (index) {
      var name = info.pages[index];
      return '<button type="button" class="tpl-mini-nav' + (index === page ? " is-active" : "") + '" data-goto-screen="' + index + '" data-screen-name="' + esc(name) + '" aria-current="' + (index === page ? "page" : "false") + '">' + esc(name) + '</button>';
    }).join("");
  }
  function barChart(seed) {
    var bars = [42, 67, 53, 82, 64, 91, 76, 96];
    return '<div class="tpl-bars">' + bars.map(function (height, index) {
      var h = Math.max(24, Math.min(98, height + ((seed * 7 + index * 3) % 13) - 6));
      return '<i style="height:' + h + '%"></i>';
    }).join("") + '</div>';
  }
  function sparkline() {
    return '<svg class="tpl-spark" viewBox="0 0 160 48" preserveAspectRatio="none" aria-hidden="true"><path d="M2 42 C18 38 20 26 36 30 S58 40 70 25 S90 8 102 18 S125 35 158 4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M2 42 C18 38 20 26 36 30 S58 40 70 25 S90 8 102 18 S125 35 158 4 L158 48 L2 48Z" fill="currentColor" opacity=".08"/></svg>';
  }
  function browserShell(template, info, page, inner, className, alternate) {
    return '<div class="tpl-art tpl-art--' + esc(className) + ' tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + ' tpl-screen-' + (page + 1) + '" style="' + cssVars(template, alternate) + '">' +
      '<div class="tpl-browser"><div class="tpl-browser-bar">' + dots() + '<span class="tpl-address">' + esc(template.id.replace(/-/g, ".")) + '</span><span class="tpl-live-mark"><i></i>LIVE</span></div>' +
      inner + '</div></div>';
  }
  function dashboardArt(template, info, page, alternate) {
    var variant = page % 3;
    var metrics = variant === 0 ? ["$148.2K", "+24.8%", "8,402"] : variant === 1 ? ["2,481", "92.4%", "18m"] : ["$1.84M", "+31.2%", "4.8×"];
    var labels = info.tags;
    var inner = '<div class="tpl-dash-shell"><aside><div class="tpl-wordmark"><i></i>' + esc(template.id.split("-")[0]) + '</div><div class="tpl-side-nav">' + navItems(info, page) + '</div><div class="tpl-side-note"><span>' + esc(labels[0]) + '</span><b>PRO workspace</b></div></aside>' +
      '<main><header><div><span>' + esc(info.category) + '</span><h3>' + esc(info.pages[page]) + '</h3></div><div class="tpl-avatar-stack"><i></i><i></i><i></i></div></header>' +
      '<div class="tpl-metrics">' + metrics.map(function (metric, index) { return '<button type="button" data-demo-action="' + esc(labels[index % labels.length]) + '"><span>' + esc(labels[index % labels.length]) + '</span><b>' + metric + '</b><em>' + (index === 1 ? "↑ 8.4%" : "+12.6%") + '</em></button>'; }).join("") + '</div>' +
      '<div class="tpl-dash-grid"><section><div class="tpl-panel-head"><b>' + esc(info.pages[page]) + '</b><span>Jan — Dec</span></div>' + barChart(page) + '</section><section class="tpl-feed"><div class="tpl-panel-head"><b>Live activity</b><span>•••</span></div>' + [0, 1, 2, 3].map(function (i) { return '<button type="button" data-demo-action="Activity ' + (i + 1) + '"><i></i><span><b>' + esc(labels[i % labels.length]) + '</b><small>' + (i + 2) + ' min ago</small></span><em>+' + (12 + i * 7) + '%</em></button>'; }).join("") + '</section></div></main></div>';
    return browserShell(template, info, page, inner, template.kind === "ai" ? "ai" : "dashboard", alternate);
  }
  function commerceArt(template, info, page, alternate) {
    var variant = page % 3;
    var productNames = variant === 0 ? ["Arc lounge", "Linea table", "Soft form"] : variant === 1 ? ["Series 01", "Series 02", "Series 03"] : ["Natural oak", "Clay textile", "Hand finish"];
    var inner = '<div class="tpl-shop"><nav><b>FORMA / ' + String(page + 1).padStart(2, "0") + '</b><div>' + navItems(info, page) + '</div><button type="button" data-demo-action="Cart">Bag <i>' + (page + 1) + '</i></button></nav>' +
      '<section class="tpl-shop-hero"><div><small>COLLECTION ' + (2026 + page) + '</small><h2>' + esc(info.pages[page]) + '</h2><p>' + esc(info.desc) + '</p>' + action(variant === 2 ? "Add to collection" : "Explore collection") + '</div><div class="tpl-object tpl-object-' + variant + '"><i></i><i></i></div></section>' +
      '<section class="tpl-product-row">' + productNames.map(function (name, index) { return '<button type="button" data-demo-action="' + esc(name) + '"><div class="tpl-product-shape s' + index + '"></div><span><b>' + esc(name) + '</b><em>$' + (240 + index * 175) + '</em></span></button>'; }).join("") + '</section></div>';
    return browserShell(template, info, page, inner, "commerce", alternate);
  }
  function mobileArt(template, info, page, alternate) {
    var variant = page % 3;
    var money = variant === 0 ? "$24,860" : variant === 1 ? "$1,250" : "$3,840";
    return '<div class="tpl-art tpl-art--mobile tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + ' tpl-screen-' + (page + 1) + '" style="' + cssVars(template, alternate) + '"><div class="tpl-mobile-copy"><span>MONETA / ' + pageNumber(page) + '</span><h2>' + esc(info.pages[page]) + '</h2><p>' + esc(info.desc) + '</p><div class="tpl-mobile-points"><i></i><span>' + esc(info.tags.join(" · ")) + '</span></div></div>' +
      '<div class="tpl-phone"><div class="tpl-phone-island"></div><header><span>9:41</span><i>◒</i></header><div class="tpl-phone-title"><span>' + esc(info.pages[page]) + '</span><b>•••</b></div><section class="tpl-balance"><small>Total balance</small><h3>' + money + '</h3>' + sparkline() + '</section><div class="tpl-quick-actions">' + ["Send", "Receive", "Bills"].map(function (label, index) { return '<button type="button" data-demo-action="' + label + '"><i>' + ["↗", "↙", "✓"][index] + '</i><span>' + label + '</span></button>'; }).join("") + '</div><div class="tpl-mobile-list"><b>Recent activity</b>' + [0, 1, 2].map(function (i) { return '<button type="button" data-demo-action="Transaction"><i></i><span><b>' + ["Studio plan", "Coffee house", "Transfer"][i] + '</b><small>Today</small></span><em>' + (i === 2 ? "+$850" : "−$" + (18 + i * 34)) + '</em></button>'; }).join("") + '</div></div></div>';
  }
  function eventArt(template, info, page, alternate) {
    var variant = page % 3;
    var inner = '<div class="tpl-event"><nav><b>AFTER / LIGHT</b><span>OCT 16—18 · BROOKLYN</span>' + action("Get tickets") + '</nav><main><div class="tpl-event-index">' + String(page + 1).padStart(2, "0") + ' / ' + String(info.pages.length).padStart(2, "0") + '</div><h2>' + (variant === 0 ? 'MAKE<br><i>IDEAS</i><br>VISIBLE' : variant === 1 ? 'THE<br><i>PEOPLE</i><br>ON STAGE' : 'THREE<br><i>DAYS</i><br>TOGETHER') + '</h2><div class="tpl-event-orbit"><i></i><i></i><i></i><span>' + esc(info.pages[page]) + '</span></div><footer><p>' + esc(info.desc) + '</p><div>' + navItems(info, page) + '</div></footer></main></div>';
    return browserShell(template, info, page, inner, "event", alternate);
  }
  function documentArt(template, info, page, alternate) {
    var isEditorial = template.kind === "editorial";
    var isBrand = template.kind === "brand";
    var isReport = template.kind === "report";
    var title = info.pages[page];
    var variant = page % 3;
    var inner;
    if (isEditorial) {
      inner = '<div class="tpl-spread"><article class="tpl-paper tpl-paper-cover"><header><span>FIELDNOTES / ' + (page + 1) + '</span><span>2026 EDITION</span></header><h2>' + (variant === 0 ? 'Build a brand<br>people <i>remember.</i>' : variant === 1 ? 'Clarity before<br><i>decoration.</i>' : 'Launch with<br><i>confidence.</i>') + '</h2><p>' + esc(info.desc) + '</p><div class="tpl-editorial-stats"><span><b>' + (12 + page * 4) + '</b>principles</span><span><b>' + (38 + page * 6) + '</b>examples</span><span><b>03</b>systems</span></div></article><article class="tpl-paper tpl-paper-content"><span>CHAPTER ' + pageNumber(page) + '</span><h3>' + esc(title) + '</h3><blockquote>“A useful system makes the right choice feel obvious.”</blockquote>' + ["Find the sharp idea", "Create a repeatable rhythm", "Test it in the real world", "Document what works"].map(function (x, i) { return '<button type="button" data-demo-action="' + esc(x) + '"><em>0' + (i + 1) + '</em><b>' + x + '</b></button>'; }).join("") + '</article></div>';
    } else if (isBrand) {
      inner = '<div class="tpl-brand-book"><header><b>ARCA®</b><span>Brand system / v2.1</span><em>' + pageNumber(page) + '</em></header><main><section><small>' + esc(info.pages[page]) + '</small><h2>' + (variant === 0 ? 'Move with<br>purpose.' : variant === 1 ? 'One voice.<br>Many forms.' : 'Built to live<br>everywhere.') + '</h2><p>' + esc(info.desc) + '</p></section><section class="tpl-brand-canvas"><div class="tpl-logo-shape"><i></i><i></i></div><div class="tpl-swatches"><i></i><i></i><i></i><i></i></div><b>Aa</b></section></main></div>';
    } else if (isReport) {
      inner = '<div class="tpl-report"><section class="tpl-report-lead"><small>COMMON GOOD / 2026</small><h2>' + (variant === 0 ? 'Small actions.<br><i>Lasting change.</i>' : variant === 1 ? 'Impact you<br><i>can measure.</i>' : 'Every number<br><i>has a name.</i>') + '</h2><p>' + esc(info.desc) + '</p><span>' + pageNumber(page) + ' / ' + String(info.pages.length).padStart(2, "0") + '</span></section><section class="tpl-report-data"><header>' + esc(title) + '<span>↗</span></header><div class="tpl-big-number">' + ["42K", "87%", "126"][variant] + '<small>' + esc(info.tags[variant]) + '</small></div>' + barChart(page + 2) + '<footer><span>Verified outcomes</span><span>2024—2026</span></footer></section></div>';
    } else {
      inner = '<div class="tpl-deck"><header><b>ORBIT<span>°</span></b><em>INVESTOR DECK · CONFIDENTIAL</em><i>' + pageNumber(page) + '</i></header><main><section><small>' + esc(info.pages[page]) + '</small><h2>' + (variant === 0 ? 'The operating system<br>for <i>bold teams.</i>' : variant === 1 ? 'A $4.8B market<br>ready to <i>move.</i>' : 'Compounding growth.<br><i>Capital efficient.</i>') + '</h2><p>' + esc(info.desc) + '</p></section><section class="tpl-deck-chart"><div><b>' + ["10×", "$4.8B", "184%"][variant] + '</b><span>' + esc(info.tags[variant]) + '</span></div>' + sparkline() + '</section></main><footer><span>ORBIT LABS</span><span>STRICTLY PRIVATE</span></footer></div>';
    }
    return '<div class="tpl-art tpl-art--document tpl-doc-' + esc(template.kind) + ' tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + ' tpl-screen-' + (page + 1) + '" style="' + cssVars(template, alternate) + '">' + inner + '</div>';
  }
  function portfolioArt(template, info, page, alternate) {
    var variant = page % 3;
    var inner = '<div class="tpl-portfolio"><header><b>FOLIO / A</b><div>' + navItems(info, page) + '</div><span>EST. 2018</span></header><main><div class="tpl-project-number">' + pageNumber(page) + '</div><section class="tpl-architecture-image"><i></i><i></i><i></i></section><section class="tpl-project-copy"><small>SELECTED WORK / ' + (2024 + page) + '</small><h2>' + ["House of quiet light", "Museum on the edge", "A room for making"][variant] + '</h2><p>' + esc(info.desc) + '</p>' + action("View case study") + '</section></main></div>';
    return browserShell(template, info, page, inner, "portfolio", alternate);
  }
  function serviceArt(template, info, page, alternate) {
    var variant = page % 3;
    var kind = template.serviceKind || template.kind;
    var isFood = kind === "restaurant";
    var isTravel = kind === "travel";
    var isNonprofit = kind === "nonprofit";
    var headline = isFood ? ["A table for<br>slow evenings.", "From the coast,<br>this season.", "Your table<br>is waiting."][variant] : isTravel ? ["Go where the<br>light feels new.", "Three days,<br>perfectly paced.", "One step from<br>your next story."][variant] : isNonprofit ? ["Good grows<br>when shared.", "Meet the people<br>making change.", "Give clearly.<br>See the impact."][variant] : ["Find a place<br>that feels yours.", "Space, light,<br>and a new view.", "Come see it<br>for yourself."][variant];
    var actionLabel = isFood ? ["Discover our story", "View menu", "Reserve a table"][variant] : isTravel ? ["Start exploring", "Build this trip", "Confirm booking"][variant] : isNonprofit ? ["See our impact", "Read their stories", "Donate now"][variant] : ["Explore homes", "View details", "Request a viewing"][variant];
    var inner = '<div class="tpl-service tpl-service-' + kind + '"><nav><b>' + esc(template.id.split("-")[0]).toUpperCase() + '</b><div>' + navItems(info, page) + '</div><span>MENU</span></nav><main><section class="tpl-service-copy"><small>' + pageNumber(page) + ' / ' + esc(info.category) + '</small><h2>' + headline + '</h2><p>' + esc(info.desc) + '</p>' + action(actionLabel) + '</section><section class="tpl-service-image"><div class="tpl-scene"><i></i><i></i><i></i><i></i></div><div class="tpl-floating-card"><small>' + esc(info.tags[variant]) + '</small><b>' + (isFood ? "Seasonal tasting" : isTravel ? "Curated escape" : isNonprofit ? "Verified impact" : "Private listing") + '</b><span>' + (isFood ? "8 courses · 2 hours" : isTravel ? "3 nights · from $680" : isNonprofit ? "92% directly to programs" : "$1.28M · 3 beds") + '</span></div></section></main></div>';
    return browserShell(template, info, page, inner, "service", alternate);
  }
  function courseArt(template, info, page, alternate) {
    var variant = page % 4;
    var progress = 28 + variant * 18;
    var inner = '<div class="tpl-course"><aside><b>LUMEN<span>+</span></b><div>' + navItems(info, page) + '</div><section><span>Course progress</span><b>' + progress + '%</b><i><em style="width:' + progress + '%"></em></i></section></aside><main><header><div><small>MASTERCLASS 04</small><h3>' + esc(info.pages[page]) + '</h3></div><span>◉ 12 learners online</span></header><div class="tpl-course-grid"><section class="tpl-video"><div class="tpl-play" data-demo-action="Play lesson">▶</div><span>12:48 / 28:30</span></section><section class="tpl-lessons"><b>In this module</b>' + ["Start with the outcome", "Map the core journey", "Prototype the moment", "Share and learn"].map(function (x, i) { return '<button type="button" data-demo-action="' + esc(x) + '" class="' + (i === variant ? "is-active" : "") + '"><i>' + (i + 1) + '</i><span><b>' + x + '</b><small>' + (8 + i * 3) + ' min</small></span></button>'; }).join("") + '</section></div></main></div>';
    return browserShell(template, info, page, inner, "course", alternate);
  }
  function campaignArt(template, info, page, alternate) {
    var variant = page % 3;
    return '<div class="tpl-art tpl-art--campaign tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + ' tpl-screen-' + (page + 1) + '" style="' + cssVars(template, alternate) + '"><div class="tpl-campaign-head"><b>SIGNAL / CAMPAIGN KIT</b><span>' + esc(info.pages[page]) + '</span><em>' + pageNumber(page) + '</em></div><div class="tpl-moodboard"><section class="tpl-poster"><small>DROP ' + pageNumber(page) + '</small><h2>' + ["MAKE<br>NOISE.", "SHOW<br>THE WORK.", "KEEP<br>MOVING."][variant] + '</h2><i></i></section><section class="tpl-social-post"><header><i></i><b>@signal.studio</b><span>•••</span></header><div class="tpl-social-art"><b>' + ["NEW / NOW", "BEHIND / IT", "RESULTS / IN"][variant] + '</b></div><footer>♡　⌁　↗<span>2,804 likes</span></footer></section><section class="tpl-campaign-plan"><header>CONTENT PLAN <span>W' + (12 + page) + '</span></header>' + ["Tease", "Reveal", "Explain", "Convert"].map(function (x, i) { return '<button type="button" data-demo-action="' + x + '"><span>' + ["MON", "TUE", "THU", "SAT"][i] + '</span><b>' + x + '</b><i class="' + (i < variant + 2 ? "done" : "") + '"></i></button>'; }).join("") + '</section></div></div>';
  }
  /* ── Family: marketing landing page ──────────────────────────────────── */
  function landingArt(template, info, page, alternate) {
    var variant = page % 3;
    var word = esc(template.id.split("-")[0]).toUpperCase();
    var headlines = {
      zh: ["把复杂业务，交给一套系统", "增长需要的，是可靠的底座", "从第一天就为规模而设计"],
      en: ["Run the complex parts on rails", "A dependable base for growth", "Built for scale from day one"]
    };
    var cta = { zh: ["免费开始使用", "预约产品演示", "查看客户案例"], en: ["Start for free", "Book a demo", "See customer stories"] };
    var inner = '<div class="tpl-landing">' +
      '<nav class="tpl-landing-nav"><b>' + word + '<i>.</i></b><div>' + navItems(info, page) + '</div><span class="tpl-landing-nav-actions">' + action(variant === 1 ? "Sign in" : "Get started") + '</span></nav>' +
      '<header class="tpl-landing-hero"><div class="tpl-landing-copy"><span class="tpl-eyebrow"><i></i>' + esc(info.category) + '</span><h2>' + headlines[langKey(info)][variant] + '</h2><p>' + esc(info.desc) + '</p><div class="tpl-landing-cta">' + action(cta[langKey(info)][variant]) + '<button type="button" class="tpl-ghost-action" data-demo-action="Watch tour">▶ ' + esc(info.pages[page]) + '</button></div>' +
        '<div class="tpl-landing-proof">' + info.tags.map(function (tag, index) { return '<span><b>' + (18 + index * 12 + page) + (index === 1 ? "%" : "K+") + '</b>' + esc(tag) + '</span>'; }).join("") + '</div></div>' +
        '<div class="tpl-landing-visual tpl-visual-' + variant + '"><div class="tpl-visual-chrome">' + dots() + '<span>' + esc(domainOf(template)) + '</span></div><div class="tpl-visual-body"><section class="tpl-visual-side"><i></i><i></i><i></i><i></i></section><section class="tpl-visual-main"><div class="tpl-visual-kpi">' + [0, 1, 2].map(function (i) { return '<button type="button" data-demo-action="Metric ' + (i + 1) + '"><span></span><b>' + (1240 + i * 380 + page * 12) + '</b><em>+' + (8 + i * 4) + '%</em></button>'; }).join("") + '</div>' + barChart(page) + '</section></div></div></header>' +
      '<footer class="tpl-landing-logos">' + [0, 1, 2, 3, 4].map(function (i) { return '<i class="tpl-logo-mark m' + i + '"></i>'; }).join("") + '</footer>' +
      '</div>';
    return browserShell(template, info, page, inner, "landing", alternate);
  }

  /* ── Family: product application shell ───────────────────────────────── */
  function appArt(template, info, page, alternate) {
    var variant = page % 3;
    var word = esc(template.id.split("-")[0]).toUpperCase();
    var inner = '<div class="tpl-appshell">' +
      '<aside class="tpl-app-rail"><b>' + word + '<i>•</i></b><div class="tpl-side-nav">' + navItems(info, page) + '</div>' +
        '<div class="tpl-app-rail-foot">' + [0, 1, 2].map(function (i) { return '<button type="button" data-demo-action="' + ["Search", "Notifications", "Help"][i] + '"><i>' + ["⌕", "◔", "?"][i] + '</i></button>'; }).join("") + '</div></aside>' +
      '<main class="tpl-app-main"><header class="tpl-app-head"><div><span>' + esc(info.category) + '</span><h3>' + esc(info.pages[page]) + '</h3></div><div class="tpl-app-head-actions"><button type="button" class="tpl-chip" data-demo-action="Filter">Filter</button><button type="button" class="tpl-chip is-on" data-demo-action="View">Board</button><button type="button" class="tpl-demo-action" data-demo-action="New">+ ' + esc(["New task", "New doc", "New item"][variant]) + '</button></div></header>' +
      '<div class="tpl-app-grid"><section class="tpl-app-list">' + [0, 1, 2, 3, 4].map(function (i) {
        var label = info.pages[(page + i + 1) % info.pages.length];
        return '<button type="button" class="tpl-app-row' + (i === 0 ? " is-active" : "") + '" data-demo-action="' + esc(label) + '"><span class="tpl-app-dot s' + (i % 3) + '"></span><span class="tpl-app-row-copy"><b>' + esc(label) + '</b><small>' + esc(info.tags[i % info.tags.length]) + ' · ' + (i + 1) + 'd</small></span><em class="tpl-app-state st' + (i % 3) + '">' + ["In progress", "Review", "Done"][i % 3] + '</em><i class="tpl-app-avatar a' + (i % 4) + '"></i></button>';
      }).join("") + '</section>' +
      '<section class="tpl-app-detail"><header><b>' + esc(info.pages[(page + 1) % info.pages.length]) + '</b><span>•••</span></header>' +
        '<div class="tpl-app-props">' + info.tags.map(function (tag, i) { return '<span data-toggle="prop"><i></i>' + esc(tag) + ' ' + (i + 3) + '</span>'; }).join("") + '</div>' +
        '<p class="tpl-app-text">' + esc(info.desc) + '</p>' +
        '<div class="tpl-app-checks">' + [0, 1, 2, 3].map(function (i) { return '<button type="button" class="tpl-check' + (i < 2 ? " is-done" : "") + '" data-toggle="check"><i></i><span>' + esc(info.pages[(page + i + 2) % info.pages.length]) + '</span></button>'; }).join("") + '</div>' +
        '<div class="tpl-app-thread">' + [0, 1].map(function (i) { return '<div class="tpl-app-comment"><i class="tpl-app-avatar a' + (i + 1) + '"></i><span><b>' + esc(info.tags[i % info.tags.length]) + '</b><small>' + (i + 1) + 'h ago</small></span><p>' + esc(info.desc.split(" ").slice(0, 9).join(" ")) + '</p></div>'; }).join("") + '</div></section></div></main></div>';
    return browserShell(template, info, page, inner, "app", alternate);
  }

  /* ── Family: booking flow ────────────────────────────────────────────── */
  function bookingArt(template, info, page, alternate) {
    var slots = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];
    var days = langKey(info) === "zh" ? ["周一", "周二", "周三", "周四", "周五", "周六"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var inner = '<div class="tpl-booking"><header class="tpl-booking-head"><b>' + esc(template.id.split("-")[0]).toUpperCase() + '</b><div class="tpl-booking-steps">' + info.pages.slice(0, 3).map(function (name, index) { return '<button type="button" data-goto-screen="' + index + '" data-screen-name="' + esc(name) + '" class="' + (index === page ? "is-active" : index < page ? "is-done" : "") + '"><i>' + (index + 1) + '</i>' + esc(name) + '</button>'; }).join("") + '</div><span class="tpl-booking-hours">◷ 08:00 — 20:00</span></header>' +
      '<main class="tpl-booking-main"><section class="tpl-booking-form"><span class="tpl-eyebrow"><i></i>' + esc(info.category) + '</span><h3>' + esc(info.pages[page]) + '</h3><p>' + esc(info.desc) + '</p>' +
        '<div class="tpl-field-row"><label class="tpl-field"><span>' + (langKey(info) === "zh" ? "服务项目" : "Service") + '</span><b>' + esc(info.tags[0]) + '</b></label><label class="tpl-field"><span>' + (langKey(info) === "zh" ? "医师/顾问" : "Practitioner") + '</span><b>' + esc(info.tags[1]) + '</b></label></div>' +
        '<div class="tpl-day-row">' + days.map(function (day, index) { return '<button type="button" data-toggle="day" class="' + (index === 2 ? "is-on" : "") + '"><b>' + day + '</b><small>' + (12 + index) + ' ' + (langKey(info) === "zh" ? "日" : "Nov") + '</small></button>'; }).join("") + '</div>' +
        '<div class="tpl-slot-row">' + slots.map(function (slot, index) { return '<button type="button" data-select="slot" class="' + (index === 2 ? "is-on" : "") + (index === 5 ? " is-off" : "") + '">' + slot + '</button>'; }).join("") + '</div></section>' +
        '<aside class="tpl-booking-summary"><header><b>' + (langKey(info) === "zh" ? "预约摘要" : "Summary") + '</b><span>·</span></header>' +
          '<ul>' + info.tags.map(function (tag, index) { return '<li><span>' + esc(tag) + '</span><b>' + (langKey(info) === "zh" ? "已选择" : "Selected") + ' ' + (index + 1) + '</b></li>'; }).join("") + '</ul>' +
          '<div class="tpl-summary-total"><span>' + (langKey(info) === "zh" ? "费用预估" : "Estimated") + '</span><b>¥' + (380 + page * 60) + '</b></div>' +
          action(langKey(info) === "zh" ? "确认预约" : "Confirm booking") +
          '<small class="tpl-summary-note">' + (langKey(info) === "zh" ? "可提前 24 小时免费改期" : "Free rescheduling up to 24h") + '</small></aside></main></div>';
    return browserShell(template, info, page, inner, "booking", alternate);
  }

  /* ── Family: media library / player ──────────────────────────────────── */
  function mediaArt(template, info, page, alternate) {
    var variant = page % 3;
    var word = esc(template.id.split("-")[0]).toUpperCase();
    var inner = '<div class="tpl-media">' +
      '<aside class="tpl-media-rail"><b>' + word + '</b><div class="tpl-side-nav">' + navItems(info, page) + '</div><section class="tpl-media-note"><small>Now playing</small><b>' + esc(info.pages[page]) + '</b><i><em style="width:' + (32 + variant * 18) + '%"></em></i></section></aside>' +
      '<main class="tpl-media-main"><header><div><small>' + esc(info.category).toUpperCase() + '</small><h3>' + esc(info.pages[page]) + '</h3></div><button type="button" class="tpl-chip is-on" data-toggle="follow">' + (langKey(info) === "zh" ? "已订阅" : "Following") + '</button></header>' +
      '<section class="tpl-media-player tpl-visual-' + variant + '"><div class="tpl-media-art"><i></i><i></i><i></i></div><button type="button" class="tpl-play" data-demo-action="Play"><span>▶</span></button><div class="tpl-media-bar"><span class="tpl-media-time">12:48</span><i><em style="width:' + (28 + variant * 16) + '%"></em></i><span class="tpl-media-time">43:20</span></div><div class="tpl-media-controls">' + ["⏮", "⏸", "⏭", "⇄", "♥"].map(function (glyph, index) { return '<button type="button" data-demo-action="Control ' + glyph + '"' + (index === 4 ? ' data-like="1"' : "") + '>' + glyph + '</button>'; }).join("") + '</div></section>' +
      '<section class="tpl-media-list">' + [0, 1, 2, 3].map(function (i) {
        var title = info.pages[(page + i + 1) % info.pages.length];
        return '<button type="button" class="tpl-media-ep' + (i === 0 ? " is-active" : "") + '" data-demo-action="' + esc(title) + '"><span class="tpl-media-ep-art s' + i + '"></span><span><b>' + esc(title) + '</b><small>' + esc(info.tags[i % info.tags.length]) + ' · ' + (24 + i * 6) + ' min</small></span><em>' + (i === 0 ? "▶" : (i + 1) + 'd ago') + '</em></button>';
      }).join("") + '</section></main></div>';
    return browserShell(template, info, page, inner, "media", alternate);
  }

  /* ── Family: social feed ─────────────────────────────────────────────── */
  function feedArt(template, info, page, alternate) {
    var variant = page % 3;
    var inner = '<div class="tpl-feed"><nav class="tpl-feed-nav"><b>' + esc(template.id.split("-")[0]).toUpperCase() + '</b><div>' + navItems(info, page) + '</div><span class="tpl-feed-search">⌕ ' + esc(info.category) + '</span></nav>' +
      '<div class="tpl-feed-columns"><section class="tpl-feed-stream">' +
        '<div class="tpl-feed-compose"><i class="tpl-app-avatar a0"></i><span>' + (langKey(info) === "zh" ? "分享你的" : "Share your") + ' ' + esc(info.tags[0]) + ' …</span><button type="button" class="tpl-demo-action" data-demo-action="' + (langKey(info) === "zh" ? "发布" : "Post") + '">' + (langKey(info) === "zh" ? "发布" : "Post") + '</button></div>' +
        [0, 1, 2].map(function (i) {
          var title = info.pages[(page + i + 1) % info.pages.length];
          return '<article class="tpl-feed-post"><header><i class="tpl-app-avatar a' + (i + 1) + '"></i><span><b>@' + esc(info.tags[i % info.tags.length].toLowerCase().replace(/[^a-z0-9]+/g, "") || "studio") + '</b><small>' + esc(title) + ' · ' + (i + 1) + 'h</small></span><em>•••</em></header><div class="tpl-feed-media v' + i + '"><i></i><i></i></div><footer><button type="button" data-like="1">♡ ' + (128 + i * 34 + page) + '</button><button type="button" data-demo-action="Comment">⌁ ' + (12 + i * 5) + '</button><button type="button" data-demo-action="Save">⌘</button></footer></article>';
        }).join("") + '</section>' +
      '<aside class="tpl-feed-side"><section class="tpl-feed-topics"><b>' + (langKey(info) === "zh" ? "热门话题" : "Trending") + '</b>' + info.tags.concat(info.pages.slice(page, page + 2)).map(function (tag, i) { return '<button type="button" data-demo-action="' + esc(tag) + '"><span>#' + esc(String(tag).replace(/\s+/g, "")) + '</span><em>' + (i + 1) + '</em></button>'; }).join("") + '</section>' +
        '<section class="tpl-feed-people"><b>' + (langKey(info) === "zh" ? "推荐关注" : "Who to follow") + '</b>' + [0, 1, 2].map(function (i) { return '<div class="tpl-feed-person"><i class="tpl-app-avatar a' + (i + 2) + '"></i><span><b>' + esc(info.tags[i % info.tags.length]) + '</b><small>' + (page + i + 2) + 'K ' + (langKey(info) === "zh" ? "粉丝" : "followers") + '</small></span><button type="button" data-toggle="follow">+</button></div>'; }).join("") + '</section></aside></div></div>';
    return browserShell(template, info, page, inner, "feed", alternate);
  }

  function langKey(info) { return info && info.__lang === "en" ? "en" : "zh"; }
  function domainOf(template) { return esc(template.id.replace(/-/g, ".")); }

  function heroArtMarkup(template, info, page, alternate) {
    var kind = template.kind;
    if (kind === "landing" || kind === "web") return landingArt(template, info, page, alternate);
    if (kind === "app") return appArt(template, info, page, alternate);
    if (kind === "booking") return bookingArt(template, info, page, alternate);
    if (kind === "media") return mediaArt(template, info, page, alternate);
    if (kind === "feed") return feedArt(template, info, page, alternate);
    if (kind === "dashboard" || kind === "health" || kind === "hr" || kind === "ai") return dashboardArt(template, info, page, alternate);
    if (kind === "commerce") return commerceArt(template, info, page, alternate);
    if (kind === "mobile") return mobileArt(template, info, page, alternate);
    if (kind === "event") return eventArt(template, info, page, alternate);
    if (kind === "deck" || kind === "editorial" || kind === "brand" || kind === "report") return documentArt(template, info, page, alternate);
    if (kind === "portfolio") return portfolioArt(template, info, page, alternate);
    if (kind === "realestate" || kind === "restaurant" || kind === "travel" || kind === "nonprofit" || kind === "service") return serviceArt(template, info, page, alternate);
    if (kind === "course") return courseArt(template, info, page, alternate);
    if (kind === "campaign") return campaignArt(template, info, page, alternate);
    return dashboardArt(template, info, page, alternate);
  }

  /* ── Long-form page: below-the-fold commercial chapters ─────────────── */
  var DEEP_FEATURES = {
    zh: ["全链路数据打通", "智能自动化流程", "细粒度权限体系", "实时多人协同", "可视化数据报表", "开放接口与集成", "移动端随时处理", "企业级安全合规"],
    en: ["End-to-end data", "Smart automation", "Granular permissions", "Realtime collaboration", "Visual reporting", "Open APIs", "Mobile ready", "Enterprise security"]
  };
  var DEEP_FEATURE_COPY = {
    zh: "把流程、数据与权限收进一套系统，团队少开会，多交付。",
    en: "Keep process, data, and permissions in one place so the team ships instead of syncing."
  };
  var DEEP_PLANS = {
    zh: [
      { name: "Starter", price: 199, note: "适合 5 人以内团队", perks: ["基础工作台", "3 个协作空间", "社区支持"] },
      { name: "Growth", price: 699, note: "最受欢迎的增长方案", perks: ["无限空间", "自动化流程", "优先支持", "数据分析"] },
      { name: "Enterprise", price: null, note: "定制与私有化部署", perks: ["单点登录", "私有部署", "专属客户成功", "SLA 保障"] }
    ],
    en: [
      { name: "Starter", price: 29, note: "For teams under 5", perks: ["Core workspace", "3 spaces", "Community support"] },
      { name: "Growth", price: 99, note: "Most teams choose this", perks: ["Unlimited spaces", "Automations", "Priority support", "Analytics"] },
      { name: "Enterprise", price: null, note: "Custom & self-hosted", perks: ["SSO / SCIM", "Self-hosting", "Dedicated CSM", "SLA"] }
    ]
  };
  var DEEP_FAQ = {
    zh: [
      { q: "上线需要多长时间？", a: "标准落地通常在两周内完成：第一周完成数据接入与权限配置，第二周完成团队培训与试运行。" },
      { q: "是否支持与现有系统集成？", a: "支持开放的 REST 与 Webhook 接口，已内置常见 CRM、工单、表格与数据仓库的连接器。" },
      { q: "数据安全如何保障？", a: "全链路加密传输、按角色隔离的数据权限、完整的操作审计日志，并支持私有化部署。" },
      { q: "如何计费与升级？", a: "按活跃席位按月计费，可随时升级或降级；年付享两月赠送，企业版支持按需定制。" }
    ],
    en: [
      { q: "How long does rollout take?", a: "Most teams are live in two weeks: week one covers data and permissions, week two covers training and piloting." },
      { q: "Can it integrate with our stack?", a: "Yes — open REST and webhook APIs plus built-in connectors for CRM, ticketing, spreadsheets, and warehouses." },
      { q: "How is data secured?", a: "Encrypted in transit and at rest, role-scoped permissions, full audit logs, and optional self-hosting." },
      { q: "How does billing work?", a: "Per active seat, monthly, upgrade or downgrade anytime. Annual plans include two months free." }
    ]
  };

  function deepBandHead(kicker, title, sub) {
    return '<header class="tpl-band-head"><span>' + esc(kicker) + '</span><h3>' + esc(title) + '</h3>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</header>';
  }

  function statBand(template, info, page, lang) {
    var c = langKey(info);
    var values = [
      { value: 38 + (page % 5) * 9, suffix: "%", label: c === "zh" ? "效率提升" : "Efficiency gain" },
      { value: 12 + (page % 4) * 6, suffix: "K+", label: c === "zh" ? "活跃团队" : "Active teams" },
      { value: 4 + (page % 3), suffix: "×", label: c === "zh" ? "投产比" : "Return on spend" },
      { value: 96 + (page % 3), suffix: "/100", label: c === "zh" ? "客户满意度" : "Customer score" }
    ];
    return '<section class="tpl-band tpl-band--stats" data-band>' + statBandHeadMarkup(page, info) +
      '<div class="tpl-stat-grid">' + values.map(function (item, index) {
        return '<article class="tpl-stat" data-band-item style="--d:' + index + '"><b><span data-countup="' + item.value + '">0</span>' + item.suffix + '</b><span>' + esc(item.label) + '</span><i></i></article>';
      }).join("") + '</div></section>';
  }
  function statBandHeadMarkup(page, info) {
    return deepBandHead(text(langKey(info), "deepTitle"), info.pages[page], text(langKey(info), "deepSub"));
  }

  function featureBand(template, info, page, lang) {
    var c = langKey(info);
    var pool = DEEP_FEATURES[c];
    var start = page % pool.length;
    var items = [];
    for (var i = 0; i < 6; i += 1) items.push(pool[(start + i) % pool.length]);
    var glyphs = ["◆", "◇", "⬡", "◎", "▣", "✦"];
    return '<section class="tpl-band tpl-band--features" data-band>' + deepBandHead(c === "zh" ? "能力矩阵" : "Capability matrix", c === "zh" ? "一套系统覆盖完整流程" : "One system, the whole workflow", DEEP_FEATURE_COPY[c]) +
      '<div class="tpl-feature-grid">' + items.map(function (item, index) {
        return '<button type="button" class="tpl-feature-card" data-band-item data-demo-action="' + esc(item) + '" style="--d:' + index + '"><i>' + glyphs[index % glyphs.length] + '</i><b>' + esc(item) + '</b><span>' + esc(info.tags[index % info.tags.length]) + '</span><em>›</em></button>';
      }).join("") + '</div></section>';
  }

  function showcaseBand(template, info, page, lang) {
    var c = langKey(info);
    var titles = [info.pages[(page + 1) % info.pages.length], info.pages[(page + 2) % info.pages.length], info.pages[(page + 3) % info.pages.length]];
    return '<section class="tpl-band tpl-band--showcase" data-band>' + deepBandHead(c === "zh" ? "真实场景" : "In the real world", c === "zh" ? "已经在这些场景跑起来" : "Already running in these scenarios", c === "zh" ? "从试点到全面铺开，每一步都有可复用的方法。" : "From pilot to rollout, every step comes with a playbook.") +
      '<div class="tpl-showcase-grid">' + titles.map(function (title, index) {
        return '<article class="tpl-showcase-card tpl-showcase-' + index + '" data-band-item style="--d:' + index + '"><div class="tpl-showcase-art"><i></i><i></i><i></i></div><div class="tpl-showcase-copy"><span>' + esc(info.category) + '</span><b>' + esc(title) + '</b><small>' + (c === "zh" ? "查看完整案例" : "Read the case") + ' ›</small></div><button type="button" class="tpl-showcase-open" data-demo-action="' + esc(title) + '" aria-label="' + esc(title) + '"></button></article>';
      }).join("") + '</div></section>';
  }

  function trustBand(template, info, page, lang) {
    var c = langKey(info);
    var names = ["Northwind", "Verta", "Kite Labs", "Aurora", "Mono", "Halo"];
    var quotes = {
      zh: ["上线三个月，跨部门沟通成本下降了一半，数据终于只有一份口径。", "迁移过程比预期顺利，团队几乎零学习成本就上手了。"],
      en: ["Three months in, cross-team overhead halved and everyone finally reads one source of truth.", "Migration was smoother than expected — the team was productive almost immediately."]
    };
    return '<section class="tpl-band tpl-band--trust" data-band>' +
      '<div class="tpl-logo-strip">' + names.map(function (name, index) { return '<span data-band-item style="--d:' + index + '">' + esc(name) + '</span>'; }).join("") + '</div>' +
      '<div class="tpl-quote-grid">' + quotes[c].map(function (quote, index) {
        return '<blockquote class="tpl-quote" data-band-item style="--d:' + index + '"><div class="tpl-quote-stars">' + [0, 1, 2, 3, 4].map(function (star) { return '<button type="button" data-like="1" aria-label="star">★</button>'; }).join("") + '</div><p>“' + esc(quote) + '”</p><footer><i class="tpl-app-avatar a' + (index + 1) + '"></i><span><b>' + esc(info.tags[index % info.tags.length]) + '</b><small>' + esc(names[index]) + ' · ' + (c === "zh" ? "客户成功负责人" : "Head of Operations") + '</small></span></footer></blockquote>';
      }).join("") + '</div></section>';
  }

  function pricingBand(template, info, page, lang) {
    var c = langKey(info);
    return '<section class="tpl-band tpl-band--pricing" data-band id="tplBandPricing">' + deepBandHead(c === "zh" ? "定价方案" : "Pricing", c === "zh" ? "按团队规模选择，随时升级" : "Pick a plan, upgrade anytime", c === "zh" ? "所有方案均含 14 天全功能试用，无需信用卡。" : "Every plan starts with a 14-day full-feature trial. No card required.") +
      '<div class="tpl-billing-switch" role="group" aria-label="billing"><button type="button" data-billing="monthly" class="is-on">' + (c === "zh" ? "按月" : "Monthly") + '</button><button type="button" data-billing="yearly">' + (c === "zh" ? "按年 · 省两月" : "Yearly · 2 months free") + '</button></div>' +
      '<div class="tpl-plan-grid">' + DEEP_PLANS[c].map(function (plan, index) {
        return '<article class="tpl-plan' + (index === 1 ? " is-featured" : "") + '" data-band-item style="--d:' + index + '">' +
          (index === 1 ? '<span class="tpl-plan-flag">' + (c === "zh" ? "最受欢迎" : "Most popular") + '</span>' : '') +
          '<b class="tpl-plan-name">' + esc(plan.name) + '</b><div class="tpl-plan-price">' + (plan.price == null ? '<b>' + (c === "zh" ? "定制" : "Custom") + '</b>' : '<span>' + (c === "zh" ? "¥" : "$") + '</span><b data-plan-price="' + plan.price + '">' + plan.price + '</b><small>/ ' + (c === "zh" ? "月" : "mo") + '</small>') + '</div>' +
          '<p>' + esc(plan.note) + '</p><ul>' + plan.perks.map(function (perk) { return '<li><i>✓</i>' + esc(perk) + '</li>'; }).join("") + '</ul>' +
          (plan.price == null ? action(c === "zh" ? "联系销售" : "Contact sales") : action(c === "zh" ? "开始试用" : "Start trial")) + '</article>';
      }).join("") + '</div></section>';
  }

  function faqBand(template, info, page, lang) {
    var c = langKey(info);
    return '<section class="tpl-band tpl-band--faq" data-band>' + deepBandHead(text(c, "faqLabel"), c === "zh" ? "你可能还想知道" : "Questions we hear most", c === "zh" ? "点击问题即可展开答案。" : "Click a question to expand the answer.") +
      '<div class="tpl-faq-list">' + DEEP_FAQ[c].map(function (item, index) {
        return '<article class="tpl-faq-item' + (index === 0 ? " is-open" : "") + '" data-accordion data-band-item style="--d:' + index + '"><button type="button" class="tpl-faq-q" data-accordion-toggle="1"><span>' + esc(item.q) + '</span><i>' + (index === 0 ? "−" : "+") + '</i></button><div class="tpl-faq-a"><p>' + esc(item.a) + '</p></div></article>';
      }).join("") + '</div></section>';
  }

  function ctaBand(template, info, page, lang) {
    var c = langKey(info);
    return '<section class="tpl-band tpl-band--cta" data-band>' +
      '<div class="tpl-cta-card" data-band-item><div><h3>' + (c === "zh" ? "准备好把这套方案用起来了吗？" : "Ready to put this system to work?") + '</h3><p>' + esc(info.desc) + '</p>' +
      '<form class="tpl-subscribe" data-subscribe><input type="email" placeholder="' + (c === "zh" ? "输入工作邮箱" : "Work email") + '" aria-label="email" /><button type="submit" class="tpl-demo-action">' + (c === "zh" ? "获取方案" : "Get the plan") + '</button></form>' +
      '<small>' + (c === "zh" ? "我们只发送与本次方案相关的内容，随时可退订。" : "We only send content related to this plan. Unsubscribe anytime.") + '</small></div>' +
      '<div class="tpl-cta-side"><span class="tpl-cta-badge">' + (c === "zh" ? "14 天试用" : "14-day trial") + '</span><button type="button" class="tpl-ghost-action" data-demo-action="' + (c === "zh" ? "预约演示" : "Book a demo") + '">' + (c === "zh" ? "预约演示" : "Book a demo") + '</button><button type="button" class="tpl-ghost-action" data-to-top="1">↑ ' + esc(text(c, "toTop")) + '</button></div></div>' +
      '<footer class="tpl-deep-foot"><div><b>' + esc(String(template.id.split("-")[0]).toUpperCase()) + '</b><small>' + esc(info.category) + ' · © 2026</small></div><nav>' + info.pages.slice(0, 5).map(function (name, index) { return '<button type="button" data-goto-screen="' + index + '" data-screen-name="' + esc(name) + '">' + esc(name) + '</button>'; }).join("") + '</nav><nav>' + info.tags.map(function (tag) { return '<button type="button" data-demo-action="' + esc(tag) + '">' + esc(tag) + '</button>'; }).join("") + '</nav></footer></section>';
  }

  function deepBands(template, info, page, lang) {
    return statBand(template, info, page, lang) +
      featureBand(template, info, page, lang) +
      showcaseBand(template, info, page, lang) +
      trustBand(template, info, page, lang) +
      pricingBand(template, info, page, lang) +
      faqBand(template, info, page, lang) +
      ctaBand(template, info, page, lang);
  }

  function artMarkup(template, page, lang, compact, alternate) {
    var resolved = langOf(lang);
    var info = localized(template, resolved);
    info.__lang = resolved;
    page = Math.max(0, Math.min(info.pages.length - 1, Number(page) || 0));
    var hero = heroArtMarkup(template, info, page, alternate);
    if (compact) return hero;
    /* Full preview renders a real long page: the screen plus every chapter below the fold. */
    return '<div class="tpl-art tpl-art--deep tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + '" style="' + cssVars(template, alternate) + '">' +
      '<div class="tpl-deep-hero">' + hero + '</div>' +
      deepBands(template, info, page, resolved) +
      '</div>';
  }

  /* ── Library thumbnails ─────────────────────────────────────────────── */
  function thumbnailMarkup(template, lang, page) {
    var info = localized(template, lang);
    var total = info.pages.length;
    var index = Math.max(0, Math.min(total - 1, Number(page) || 0));
    return '<div class="tpl-thumb">' +
      '<div class="tpl-thumb-chrome">' + dots() + '<span class="tpl-thumb-url">' + domainOf(template) + '</span><span class="tpl-thumb-live"><i></i>' + text(lang, "live") + '</span></div>' +
      '<div class="tpl-thumb-view"><div class="tpl-thumb-scroll">' +
        '<div class="tpl-thumb-screen is-current">' + artMarkup(template, index, lang, true, false) + '</div>' +
        /* The next screen is hydrated on first hover so 60+ thumbnails stay cheap to paint. */
        '<div class="tpl-thumb-screen" data-thumb-next="' + ((index + 1) % total) + '" data-thumb-template="' + esc(template.id) + '" data-thumb-lang="' + esc(langOf(lang)) + '"></div>' +
      '</div><span class="tpl-thumb-scrollhint"><i>⇣</i>' + text(lang, "scrollable") + '</span></div>' +
      '<div class="tpl-thumb-foot"><span class="tpl-thumb-dots-rail">' + info.pages.slice(0, 8).map(function (name, i) { return '<i class="' + (i === 0 ? "is-on" : "") + '"></i>'; }).join("") + '</span><span class="tpl-thumb-count">' + total + ' ' + text(lang, "screens") + '</span></div>' +
      '</div>';
  }

  function cardMarkup(template, lang) {
    var info = localized(template, lang);
    return '<div class="tpl-card-stage">' + thumbnailMarkup(template, lang, 0) + '<span class="tpl-pro-badge">' + text(lang, "pro") + '</span></div>' +
      '<div class="tpl-card-body"><div class="tpl-card-copy"><span>' + esc(info.category) + '</span><h3>' + esc(info.name) + '</h3><div class="tpl-card-tags">' + info.tags.slice(0, 2).map(function (tag) { return '<em>' + esc(tag) + '</em>'; }).join("") + '</div></div><div class="tpl-card-meta"><b>' + info.pages.length + '</b><span>' + text(lang, "screens") + '</span><i>↗</i></div></div>';
  }
  function featuredMarkup(template, lang) {
    var info = localized(template, lang);
    return '<div class="tpl-featured-art">' + thumbnailMarkup(template, lang, 0) + '</div><div class="tpl-featured-copy"><div class="tpl-featured-kicker"><span>' + text(lang, "featured") + '</span><i>' + text(lang, "commercial") + '</i></div><h3>' + esc(info.name) + '</h3><p>' + text(lang, "featuredDescription") + '</p><div class="tpl-featured-tags">' + info.tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("") + '</div><button type="button" class="btn-new tpl-featured-open" id="tpPreviewFeatured">' + text(lang, "previewScreens") + '<span>↗</span></button><small>' + esc(template.uses) + ' ' + text(lang, "uses") + '</small></div>';
  }

  var modalState = { template: null, page: 0, lang: "zh", alternate: false, viewport: "desktop", billing: "monthly", cart: 0, onUse: null, returnFocus: null, scrollTops: {} };
  var keyHandlerBound = false;

  function ensureModal() {
    var modal = document.getElementById("templatePreview");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "templatePreview";
    modal.className = "tpl-preview-overlay";
    modal.hidden = true;
    modal.innerHTML =
      '<section class="tpl-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="tplPreviewTitle">' +
        '<header class="tpl-preview-head">' +
          '<div class="tpl-preview-title"><span class="tpl-preview-kicker" id="tplPreviewKicker"></span><h2 id="tplPreviewTitle"></h2><p id="tplPreviewDescription"></p><div class="tpl-preview-tags" id="tplPreviewTags"></div></div>' +
          '<div class="tpl-preview-actions"><span class="tpl-license-badge" id="tplLicenseBadge"></span><button type="button" class="tpl-head-btn" id="tplShareButton"><span>↗</span><b></b></button><button type="button" class="tpl-head-btn tpl-favorite-btn" id="tplFavoriteButton" aria-pressed="false"><span>♡</span><b></b></button><div class="tpl-use-split"><button type="button" class="tpl-use-main" id="tplUseMain"></button><button type="button" class="tpl-use-more" id="tplUseMore" aria-haspopup="menu" aria-expanded="false">⌄</button><div class="tpl-use-menu" id="tplUseMenu" role="menu"></div></div><button type="button" class="tpl-preview-close" id="tplPreviewClose" aria-label="Close">×</button></div>' +
        '</header>' +
        '<div class="tpl-preview-toolbar">' +
          '<div class="tpl-current-screen"><span id="tplScreenCounter"></span><b id="tplScreenName"></b><em class="tpl-scrollable-badge" id="tplScrollBadge"><i>⇣</i><span></span></em></div>' +
          '<div class="tpl-toolbar-actions"><button type="button" class="tpl-top-button" id="tplToTop"><span>↑</span><b id="tplToTopLabel"></b></button><div class="tpl-viewport-switch" id="tplViewportSwitch"><button type="button" data-preview-viewport="desktop" aria-pressed="true"><span>▰</span><b></b></button><button type="button" data-preview-viewport="tablet" aria-pressed="false"><span>▯</span><b></b></button><button type="button" data-preview-viewport="mobile" aria-pressed="false"><span>▯</span><b></b></button></div><button type="button" class="tpl-colorway-button" id="tplColorway"><i></i><span></span></button></div>' +
        '</div>' +
        '<div class="tpl-preview-workspace">' +
          '<div class="tpl-preview-stage"><button type="button" class="tpl-preview-arrow prev" id="tplPrevScreen">‹</button>' +
            '<div class="tpl-preview-canvas" id="tplPreviewCanvas" data-viewport="desktop">' +
              '<div class="tpl-canvas-scroll" id="tplCanvasScroll" tabindex="0" role="group" aria-label="interactive page"></div>' +
              '<div class="tpl-canvas-progress" id="tplCanvasProgress"><i></i></div>' +
              '<div class="tpl-canvas-toast" id="tplCanvasToast" role="status" aria-live="polite"></div>' +
              '<div class="tpl-canvas-hint" id="tplCanvasHint" aria-hidden="true"><i>⇣</i><span></span></div>' +
              '<button type="button" class="tpl-canvas-totop" id="tplCanvasToTop" data-to-top="1" aria-label="back to top">↑</button>' +
            '</div>' +
            '<button type="button" class="tpl-preview-arrow next" id="tplNextScreen">›</button></div>' +
          '<aside class="tpl-screen-rail"><header><div><span id="tplRailCount"></span><b id="tplRailTitle"></b></div><small id="tplRailHint"></small></header><div class="tpl-preview-thumbs" id="tplPreviewThumbs" role="list"></div></aside>' +
        '</div>' +
        '<footer class="tpl-preview-foot"><div class="tpl-interaction-state"><i></i><span><b id="tplInteractionLabel"></b><small id="tplInteractionText"></small></span></div><div class="tpl-prototype-meta"><span><i></i>HTML · CSS · JS</span><b id="tplFooterPage"></b></div></footer>' +
      '</section>';
    document.body.appendChild(modal);

    var canvas = document.getElementById("tplCanvasScroll");
    var canvasFrame = document.getElementById("tplPreviewCanvas");

    modal.addEventListener("click", function (event) { if (event.target === modal) close(); });
    document.getElementById("tplPrevScreen").addEventListener("click", function () { changePage(-1); });
    document.getElementById("tplNextScreen").addEventListener("click", function () { changePage(1); });
    document.getElementById("tplColorway").addEventListener("click", function () {
      modalState.alternate = !modalState.alternate;
      renderModal();
    });
    document.getElementById("tplViewportSwitch").addEventListener("click", function (event) {
      var button = event.target.closest("[data-preview-viewport]");
      if (!button) return;
      modalState.viewport = button.getAttribute("data-preview-viewport");
      renderModal();
    });
    document.getElementById("tplToTop").addEventListener("click", function () { scrollCanvasTo(0); });
    document.getElementById("tplCanvasToTop").addEventListener("click", function () { scrollCanvasTo(0); });
    document.getElementById("tplUseMain").addEventListener("click", function () { applyTemplate("direct"); });
    document.getElementById("tplUseMore").addEventListener("click", function (event) {
      event.stopPropagation();
      var menu = document.getElementById("tplUseMenu");
      var open = menu.classList.toggle("show");
      document.getElementById("tplUseMore").setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.getElementById("tplUseMenu").addEventListener("click", function (event) {
      var item = event.target.closest("[data-template-intent]");
      if (!item) return;
      applyTemplate(item.getAttribute("data-template-intent"));
    });
    document.getElementById("tplPreviewThumbs").addEventListener("click", function (event) {
      var item = event.target.closest("[data-template-page]");
      if (!item) return;
      modalState.page = Number(item.getAttribute("data-template-page")) || 0;
      renderModal();
    });
    document.getElementById("tplPreviewThumbs").addEventListener("keydown", function (event) {
      var item = event.target.closest("[data-template-page]");
      if (!item || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      modalState.page = Number(item.getAttribute("data-template-page")) || 0;
      renderModal();
    });
    document.getElementById("tplShareButton").addEventListener("click", shareTemplate);
    document.getElementById("tplFavoriteButton").addEventListener("click", toggleFavorite);

    canvasFrame.addEventListener("click", handleCanvasClick);
    canvasFrame.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = event.target.querySelector ? event.target.querySelector("input") : null;
      if (input && !input.value) { input.focus(); canvasToast(input.getAttribute("placeholder"), "warn"); return; }
      if (input) input.value = "";
      canvasToast(text(modalState.lang, "subscribed"));
    });
    canvas.addEventListener("scroll", onCanvasScroll, { passive: true });
    document.addEventListener("click", function (event) {
      var menu = document.getElementById("tplUseMenu");
      if (!menu || event.target.closest(".tpl-use-split")) return;
      menu.classList.remove("show");
      var more = document.getElementById("tplUseMore");
      if (more) more.setAttribute("aria-expanded", "false");
    });
    if (!keyHandlerBound) {
      document.addEventListener("keydown", function (event) {
        var activeModal = document.getElementById("templatePreview");
        if (!activeModal || activeModal.hidden) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") changePage(-1);
        if (event.key === "ArrowRight") changePage(1);
        if (event.key === "PageUp") scrollCanvasTo(getCanvas().scrollTop - getCanvas().clientHeight * 0.8);
        if (event.key === "PageDown") scrollCanvasTo(getCanvas().scrollTop + getCanvas().clientHeight * 0.8);
      });
      keyHandlerBound = true;
    }
    return modal;
  }

  function getCanvas() { return document.getElementById("tplCanvasScroll"); }
  function getCanvasFrame() { return document.getElementById("tplPreviewCanvas"); }

  function scrollCanvasTo(top) {
    var canvas = getCanvas();
    if (!canvas) return;
    var max = Math.max(0, canvas.scrollHeight - canvas.clientHeight);
    var target = Math.max(0, Math.min(max, top));
    if (typeof canvas.scrollTo === "function") canvas.scrollTo({ top: target, behavior: "smooth" });
    else canvas.scrollTop = target;
  }

  function canvasToast(message, tone) {
    var toast = document.getElementById("tplCanvasToast");
    if (!toast) return;
    toast.textContent = message;
    toast.setAttribute("data-tone", tone || "ok");
    toast.classList.add("show");
    window.clearTimeout(toast.__timer);
    toast.__timer = window.setTimeout(function () { toast.classList.remove("show"); }, 1700);
  }

  function ripple(canvas, event, node) {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var target = node && node.getBoundingClientRect ? node.getBoundingClientRect() : rect;
    var span = document.createElement("span");
    span.className = "tpl-canvas-ripple";
    span.style.left = ((event.clientX || target.left + target.width / 2) - rect.left + canvas.scrollLeft) + "px";
    span.style.top = ((event.clientY || target.top + target.height / 2) - rect.top + canvas.scrollTop) + "px";
    canvas.appendChild(span);
    window.setTimeout(function () { span.remove(); }, 620);
  }

  function handleCanvasClick(event) {
    var canvas = getCanvas();
    if (!canvas) return;
    var node = event.target.closest ? event.target.closest("button, [data-demo-action], [data-toggle], [data-accordion], [data-goto-screen], [data-to-top], [data-plan-price]") : null;
    if (!node) {
      var frame = getCanvasFrame();
      if (frame) {
        frame.classList.remove("is-canvas-active");
        void frame.offsetWidth;
        frame.classList.add("is-canvas-active");
      }
      ripple(canvas, event, null);
      return;
    }
    event.preventDefault();
    var info = modalState.template ? localized(modalState.template, modalState.lang) : null;
    var label = node.getAttribute("data-demo-action") || node.getAttribute("data-screen-name") || (node.textContent || "").trim().slice(0, 26);
    ripple(canvas, event, node);
    node.classList.add("tpl-pressed");
    window.setTimeout(function () { node.classList.remove("tpl-pressed"); }, 220);

    if (node.hasAttribute("data-goto-screen")) {
      var target = Number(node.getAttribute("data-goto-screen")) || 0;
      modalState.page = target;
      renderModal();
      canvasToast(text(modalState.lang, "page") + " " + String(target + 1).padStart(2, "0") + " · " + label);
      return;
    }
    if (node.hasAttribute("data-to-top")) { scrollCanvasTo(0); return; }
    if (node.hasAttribute("data-accordion-toggle")) {
      var item = node.closest("[data-accordion]");
      if (item) {
        var open = item.classList.toggle("is-open");
        var glyph = node.querySelector("i");
        if (glyph) glyph.textContent = open ? "−" : "+";
      }
      return;
    }
    if (node.hasAttribute("data-billing")) {
      modalState.billing = node.getAttribute("data-billing");
      applyBilling();
      return;
    }
    if (node.hasAttribute("data-like")) {
      var liked = node.classList.toggle("is-liked");
      var digits = node.textContent.match(/\d+/);
      if (digits) {
        var base = Number(digits[0]);
        node.textContent = node.textContent.replace(String(base), String(liked ? base + 1 : Math.max(0, base - 1)));
      } else if (/[♡♥]/.test(node.textContent)) {
        node.textContent = node.textContent.replace(liked ? "♡" : "♥", liked ? "♥" : "♡");
      }
      canvasToast(liked ? text(modalState.lang, "liked") + " · " + label : label);
      return;
    }
    if (node.hasAttribute("data-toggle")) {
      var group = node.parentElement;
      if (group && group.hasAttribute("data-select")) group = group.parentElement;
      var siblings = group ? group.querySelectorAll("[data-toggle]") : [node];
      Array.prototype.forEach.call(siblings, function (sibling) { if (sibling !== node) sibling.classList.remove("is-on"); });
      node.classList.toggle("is-on");
      canvasToast(label + " · " + (node.classList.contains("is-on") ? "✓" : "○"));
      return;
    }
    if (node.hasAttribute("data-select")) {
      var row = node.parentElement;
      if (row) Array.prototype.forEach.call(row.querySelectorAll("[data-select]"), function (sibling) { sibling.classList.remove("is-on"); });
      node.classList.add("is-on");
      canvasToast(label);
      return;
    }
    if (node.hasAttribute("data-cart-add")) {
      modalState.cart += 1;
      updateCartChip();
      canvasToast(text(modalState.lang, "added") + " · " + label + " · " + text(modalState.lang, "cartLabel") + " ×" + modalState.cart);
      return;
    }
    if (node.hasAttribute("data-demo-action")) {
      var form = node.closest("[data-subscribe]");
      if (form) {
        var input = form.querySelector("input");
        if (input && !input.value) { input.focus(); canvasToast(input.getAttribute("placeholder"), "warn"); return; }
        if (input) input.value = "";
        canvasToast(text(modalState.lang, "subscribed"));
        return;
      }
      var cartLike = /bag|cart|购物|加入/i.test(label);
      if (cartLike) { modalState.cart += 1; updateCartChip(); }
      canvasToast(text(modalState.lang, "pressed") + label + (cartLike ? " · " + text(modalState.lang, "cartLabel") + " ×" + modalState.cart : ""));
      setInteractionText(text(modalState.lang, "pressed") + label);
      return;
    }
    var fallback = node.getAttribute("data-screen-name") || (info ? info.pages[modalState.page] : label);
    canvasToast(text(modalState.lang, "pressed") + fallback);
    setInteractionText(text(modalState.lang, "pressed") + fallback);
  }

  function updateCartChip() {
    var canvas = getCanvas();
    if (!canvas) return;
    Array.prototype.forEach.call(canvas.querySelectorAll("[data-cart-count]"), function (chip) {
      chip.textContent = String(modalState.cart);
      chip.classList.add("is-bump");
      window.setTimeout(function () { chip.classList.remove("is-bump"); }, 260);
    });
  }

  function applyBilling() {
    var canvas = getCanvas();
    if (!canvas) return;
    var yearly = modalState.billing === "yearly";
    Array.prototype.forEach.call(canvas.querySelectorAll("[data-billing]"), function (button) {
      button.classList.toggle("is-on", button.getAttribute("data-billing") === modalState.billing);
    });
    Array.prototype.forEach.call(canvas.querySelectorAll("[data-plan-price]"), function (node) {
      var base = Number(node.getAttribute("data-plan-price")) || 0;
      node.textContent = String(yearly ? Math.round(base * 10) : base);
    });
  }

  function setInteractionText(value) {
    var node = document.getElementById("tplInteractionText");
    if (node) node.textContent = value;
  }

  function onCanvasScroll() {
    var canvas = getCanvas();
    if (!canvas) return;
    var max = Math.max(1, canvas.scrollHeight - canvas.clientHeight);
    var ratio = Math.max(0, Math.min(1, canvas.scrollTop / max));
    var bar = document.querySelector("#tplCanvasProgress i");
    if (bar) bar.style.width = (ratio * 100).toFixed(1) + "%";
    var badge = document.getElementById("tplScrollBadge");
    if (badge) badge.classList.toggle("is-read", ratio > 0.02);
    var toTop = document.getElementById("tplCanvasToTop");
    if (toTop) toTop.classList.toggle("show", ratio > 0.06);
    var hint = document.getElementById("tplCanvasHint");
    if (hint) hint.classList.toggle("show", ratio < 0.02);
    if (modalState.template) modalState.scrollTops[modalState.page] = canvas.scrollTop;
    revealBands(canvas, ratio);
  }

  function revealBands(canvas, ratio) {
    var bands = canvas.querySelectorAll("[data-band-item]");
    if (!bands.length) return;
    var canvasTop = canvas.getBoundingClientRect().top;
    var visibleBottom = canvas.clientHeight * 1.08;
    Array.prototype.forEach.call(bands, function (band) {
      if (band.classList.contains("is-in")) return;
      if (band.getBoundingClientRect().top - canvasTop < visibleBottom) {
        band.classList.add("is-in");
        var counter = band.querySelector("[data-countup]");
        if (counter) countUp(counter);
      }
    });
    if (ratio > 0) {
      var head = document.getElementById("tplScrollBadge");
      if (head) head.classList.toggle("is-read", true);
    }
  }

  function countUp(node) {
    var target = Number(node.getAttribute("data-countup")) || 0;
    var start = performance.now();
    var duration = 700;
    function step(now) {
      var progress = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function renderCanvas() {
    if (!modalState.template) return;
    var canvas = getCanvas();
    var frame = getCanvasFrame();
    canvas.scrollTop = 0;
    canvas.innerHTML = artMarkup(modalState.template, modalState.page, modalState.lang, false, modalState.alternate);
    frame.setAttribute("data-viewport", modalState.viewport || "desktop");
    Array.prototype.forEach.call(document.querySelectorAll("#tplViewportSwitch [data-preview-viewport]"), function (button) {
      var selected = button.getAttribute("data-preview-viewport") === modalState.viewport;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    document.getElementById("templatePreview").setAttribute("data-colorway", modalState.alternate ? "alternate" : "primary");
    applyBilling();
    canvas.scrollTop = 0;
    revealBands(canvas, 0);
    var scrolled = canvas.scrollHeight - canvas.clientHeight > 40;
    var badge = document.getElementById("tplScrollBadge");
    if (badge) {
      badge.querySelector("span").textContent = text(modalState.lang, "scrollable");
      badge.classList.toggle("is-scrollable", scrolled);
    }
    var hint = document.getElementById("tplCanvasHint");
    if (hint) {
      hint.querySelector("span").textContent = text(modalState.lang, "scrollHintCanvas");
      hint.classList.toggle("show", scrolled);
    }
  }

  function renderModal() {
    var template = modalState.template;
    if (!template) return;
    var info = localized(template, modalState.lang);
    var c = COPY[modalState.lang];
    document.getElementById("tplPreviewKicker").textContent = info.category + " · " + c.live + " · " + c.scrollable;
    document.getElementById("tplPreviewTitle").textContent = info.name;
    document.getElementById("tplPreviewDescription").textContent = info.desc;
    document.getElementById("tplPreviewTags").innerHTML = info.tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("");
    document.getElementById("tplLicenseBadge").innerHTML = '<i>✓</i>' + c.commercial;
    document.getElementById("tplShareButton").querySelector("b").textContent = c.share;
    document.getElementById("tplFavoriteButton").querySelector("b").textContent = isFavorite(template.id) ? c.favorited : c.favorite;
    document.getElementById("tplFavoriteButton").querySelector("span").textContent = isFavorite(template.id) ? "♥" : "♡";
    document.getElementById("tplFavoriteButton").setAttribute("aria-pressed", isFavorite(template.id) ? "true" : "false");
    document.getElementById("tplUseMain").textContent = c.use;
    document.getElementById("tplToTopLabel").textContent = c.toTop;
    document.getElementById("tplPreviewClose").setAttribute("aria-label", c.close);
    document.getElementById("tplPrevScreen").setAttribute("aria-label", c.previous);
    document.getElementById("tplNextScreen").setAttribute("aria-label", c.next);
    document.getElementById("tplColorway").querySelector("span").textContent = c.colorway;
    document.querySelector('#tplViewportSwitch [data-preview-viewport="desktop"] b').textContent = c.desktop;
    document.querySelector('#tplViewportSwitch [data-preview-viewport="tablet"] b').textContent = c.tablet;
    document.querySelector('#tplViewportSwitch [data-preview-viewport="mobile"] b').textContent = c.mobile;
    document.getElementById("tplScreenCounter").textContent = c.page + " " + String(modalState.page + 1).padStart(2, "0") + " / " + String(info.pages.length).padStart(2, "0");
    document.getElementById("tplScreenName").textContent = info.pages[modalState.page];
    document.getElementById("tplRailCount").textContent = info.pages.length + " " + c.screens;
    document.getElementById("tplRailTitle").textContent = c.screenRailTitle;
    document.getElementById("tplRailHint").textContent = c.scrollHint + " · " + c.navHint;
    document.getElementById("tplInteractionLabel").textContent = c.interaction;
    document.getElementById("tplInteractionText").textContent = c.interactionHint;
    document.getElementById("tplFooterPage").textContent = String(modalState.page + 1).padStart(2, "0") + " / " + String(info.pages.length).padStart(2, "0") + " · " + info.pages[modalState.page];
    document.getElementById("tplUseMenu").innerHTML = [
      { id: "direct", title: c.useNow, sub: c.useNowSub, icon: "↗" },
      { id: "brief", title: c.useBrief, sub: c.useBriefSub, icon: "✦" },
      { id: "remix", title: c.remix, sub: c.remixSub, icon: "⎘" }
    ].map(function (item) { return '<button type="button" role="menuitem" data-template-intent="' + item.id + '"><i>' + item.icon + '</i><span><b>' + esc(item.title) + '</b><small>' + esc(item.sub) + '</small></span></button>'; }).join("");
    document.getElementById("tplPreviewThumbs").innerHTML = info.pages.map(function (name, index) {
      var number = String(index + 1).padStart(2, "0");
      return '<div role="button" tabindex="0" class="tpl-screen-item' + (index === modalState.page ? " is-active" : "") + '" data-template-page="' + index + '" aria-label="' + esc(number + " " + name) + '"><span class="tpl-screen-thumb"><span class="tpl-screen-thumb-scroll">' + artMarkup(template, index, modalState.lang, true, modalState.alternate) + '</span><em class="tpl-screen-index">' + number + '</em></span><span class="tpl-screen-copy"><b>' + esc(name) + '</b><small>' + c[modalState.viewport || "desktop"] + ' · ' + c.interactive + '</small></span><em>›</em></div>';
    }).join("");
    renderCanvas();
    requestAnimationFrame(function () {
      var active = document.querySelector("#tplPreviewThumbs [data-template-page].is-active");
      if (active && typeof active.scrollIntoView === "function") active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }
  function changePage(direction) {
    if (!modalState.template) return;
    var pages = localized(modalState.template, modalState.lang).pages;
    modalState.page = (modalState.page + direction + pages.length) % pages.length;
    renderModal();
  }
  function applyTemplate(intent) {
    var callback = modalState.onUse;
    var template = modalState.template;
    close();
    if (typeof callback === "function" && template) callback(template, intent || "direct");
  }
  function shareTemplate() {
    if (!modalState.template) return;
    var url = location.origin + location.pathname + "#template=" + encodeURIComponent(modalState.template.id);
    var done = function () {
      var button = document.getElementById("tplShareButton");
      if (!button) return;
      var old = button.querySelector("b").textContent;
      button.querySelector("b").textContent = text(modalState.lang, "shared");
      setTimeout(function () { if (button && button.querySelector("b")) button.querySelector("b").textContent = old; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done).catch(done);
    else done();
  }
  function favoriteIds() {
    try { return JSON.parse(localStorage.getItem("db-template-favorites") || "[]") || []; } catch (e) { return []; }
  }
  function isFavorite(id) { return favoriteIds().indexOf(id) >= 0; }
  function toggleFavorite() {
    if (!modalState.template) return;
    var ids = favoriteIds();
    var index = ids.indexOf(modalState.template.id);
    if (index >= 0) ids.splice(index, 1); else ids.push(modalState.template.id);
    try { localStorage.setItem("db-template-favorites", JSON.stringify(ids)); } catch (e) {}
    renderModal();
  }
  function open(id, options) {
    var template = typeof id === "string" ? byId(id) : id;
    if (!template) return false;
    var modal = ensureModal();
    modalState.template = template;
    modalState.lang = langOf(options && options.lang);
    modalState.page = Math.max(0, Math.min(localized(template, modalState.lang).pages.length - 1, Number(options && options.page) || 0));
    modalState.alternate = false;
    modalState.viewport = "desktop";
    modalState.billing = "monthly";
    modalState.cart = 0;
    modalState.scrollTops = {};
    modalState.onUse = options && options.onUse;
    modalState.returnFocus = document.activeElement;
    renderModal();
    modal.hidden = false;
    document.body.classList.add("template-preview-open");
    requestAnimationFrame(function () { modal.classList.add("show"); document.getElementById("tplPreviewClose").focus(); });
    return true;
  }
  function close() {
    var modal = document.getElementById("templatePreview");
    if (!modal || modal.hidden) return;
    modal.classList.remove("show");
    document.body.classList.remove("template-preview-open");
    setTimeout(function () { modal.hidden = true; }, 180);
    if (modalState.returnFocus && typeof modalState.returnFocus.focus === "function") modalState.returnFocus.focus();
  }

  function screensOf(template, lang) {
    return localized(template, langOf(lang)).pages.slice();
  }

  function hydrateThumbnail(host) {
    if (!host || !host.querySelector) return;
    var pending = host.querySelector("[data-thumb-next]");
    if (!pending || pending.getAttribute("data-ready") === "1") return;
    var template = byId(pending.getAttribute("data-thumb-template"));
    if (!template) return;
    var page = Number(pending.getAttribute("data-thumb-next")) || 0;
    var lang = langOf(pending.getAttribute("data-thumb-lang"));
    pending.innerHTML = artMarkup(template, page, lang, true, false);
    pending.setAttribute("data-ready", "1");
  }

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("mouseover", function (event) {
      var host = event.target && event.target.closest ? event.target.closest(".tpl-thumb") : null;
      if (host) hydrateThumbnail(host);
    });
    document.addEventListener("focusin", function (event) {
      var host = event.target && event.target.closest ? event.target.closest(".tpl-thumb") : null;
      if (host) hydrateThumbnail(host);
    });
    document.addEventListener("touchstart", function (event) {
      var host = event.target && event.target.closest ? event.target.closest(".tpl-thumb") : null;
      if (host) hydrateThumbnail(host);
    }, { passive: true });
  }

  global.StudioTemplates = {
    items: TEMPLATES,
    byId: byId,
    localized: localized,
    categories: categoryList,
    text: text,
    stats: libraryStats,
    subtitle: librarySubtitle,
    screensOf: screensOf,
    cardMarkup: cardMarkup,
    featuredMarkup: featuredMarkup,
    thumbnailMarkup: thumbnailMarkup,
    artMarkup: artMarkup,
    open: open,
    close: close
  };
})(window);
