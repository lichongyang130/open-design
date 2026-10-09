(function () {
  "use strict";

  var root = document.getElementById("skillsMarket");
  if (!root) return;

  var COPY = {
    zh: {
      featured: "常用办公技能",
      refresh: "重新加载",
      refreshing: "正在更新",
      recommended: "办公问题处理",
      hub: "已保存技能",
      suites: "更多技能",
      search: "搜索办公问题，例如公式、重复数据、格式",
      all: "全部",
      solo: "OPC·一人公司",
      office: "办公协同",
      development: "开发工具",
      finance: "投资理财",
      productivity: "效率工具",
      content: "内容创作",
      intelligence: "信息资讯",
      education: "教育学习",
      data: "数据分析",
      deployment: "网站部署",
      lifestyle: "生活服务",
      commerce: "商业运营",
      knowledge: "知识与学习",
      loading: "正在连接技能库…",
      loadingBody: "从当前工作区读取可用技能。",
      error: "技能库暂时不可用",
      errorBody: "未能从工作区读取技能，请检查服务后重试。",
      retry: "重新加载",
      empty: "没有找到匹配技能",
      emptyBody: "试试其他关键词或切换分类。",
      clear: "清除筛选",
      add: "添加技能",
      remove: "移除技能",
      added: "已添加",
      addToast: "已将「{name}」添加到创作器",
      removeToast: "已从创作器移除「{name}」",
      use: "使用此技能",
      details: "技能详情",
      triggers: "适用任务",
      example: "示例任务",
      capability: "能力信息",
      source: "来源",
      mode: "创作模式",
      builtIn: "工作区内置",
      personal: "个人技能",
      close: "关闭技能详情",
      loadMore: "加载更多",
      count: "项技能",
      openSuite: "查看套件",
      suiteDesign: "产品设计冲刺",
      suiteDesignDesc: "从研究、原型到设计系统的一套完整工作流。",
      suiteBuild: "研发交付加速",
      suiteBuildDesc: "覆盖前端实现、质量检查与稳定交付。",
      suiteContent: "内容增长引擎",
      suiteContentDesc: "把选题、创作、分发和复盘串成增长闭环。",
      suiteData: "数据决策台",
      suiteDataDesc: "从数据清理、分析到管理层洞察的专业组合。",
      suiteOps: "一人公司工具箱",
      suiteOpsDesc: "轻量完成调研、运营、销售与日常协作。",
      suiteKnowledge: "知识研究工作台",
      suiteKnowledgeDesc: "高效收集信息、深度研究并沉淀可复用知识。"
    },
    en: {
      featured: "Practical office skills",
      refresh: "Reload",
      refreshing: "Refreshing",
      recommended: "Office problem solving",
      hub: "Saved skills",
      suites: "More skills",
      search: "Search office tasks, e.g. formulas, duplicates, formatting",
      all: "All",
      solo: "Solo business",
      office: "Collaboration",
      development: "Developer tools",
      finance: "Finance",
      productivity: "Productivity",
      content: "Content",
      intelligence: "Intelligence",
      education: "Education",
      data: "Data analysis",
      deployment: "Deployment",
      lifestyle: "Lifestyle",
      commerce: "Business ops",
      knowledge: "Knowledge",
      loading: "Connecting to the skill library…",
      loadingBody: "Reading the skills available in this workspace.",
      error: "The skill library is unavailable",
      errorBody: "Skills could not be read from this workspace. Check the service and try again.",
      retry: "Try again",
      empty: "No matching skills",
      emptyBody: "Try another keyword or switch categories.",
      clear: "Clear filters",
      add: "Add skill",
      remove: "Remove skill",
      added: "Added",
      addToast: "Added “{name}” to the composer",
      removeToast: "Removed “{name}” from the composer",
      use: "Use this skill",
      details: "Skill details",
      triggers: "Best for",
      example: "Example task",
      capability: "Capability",
      source: "Source",
      mode: "Creation mode",
      builtIn: "Workspace built-in",
      personal: "Personal skill",
      close: "Close skill details",
      loadMore: "Load more",
      count: "skills",
      openSuite: "Open suite",
      suiteDesign: "Product design sprint",
      suiteDesignDesc: "A complete workflow from research and prototyping to design systems.",
      suiteBuild: "Engineering delivery",
      suiteBuildDesc: "Frontend implementation, quality checks, and reliable delivery.",
      suiteContent: "Content growth engine",
      suiteContentDesc: "Connect planning, production, distribution, and review in one loop.",
      suiteData: "Data decision desk",
      suiteDataDesc: "A professional set for cleaning, analysis, and executive insight.",
      suiteOps: "Solo business toolkit",
      suiteOpsDesc: "Run research, operations, sales, and collaboration with a lean setup.",
      suiteKnowledge: "Knowledge research desk",
      suiteKnowledgeDesc: "Collect information, research deeply, and build reusable knowledge."
    }
  };

  var CATEGORIES = [
    { id: "all", label: "all", pattern: null },
    { id: "solo", label: "solo", pattern: /solo|opc|创业|一人公司|个人经营|founder|startup/ },
    { id: "office", label: "office", pattern: /office|document|word|excel|ppt|slide|mail|calendar|meeting|协同|办公|文档|表格|演示|邮件|会议/ },
    { id: "development", label: "development", pattern: /develop|engineer|code|frontend|api|github|git|test|debug|代码|开发|工程|前端|接口|测试/ },
    { id: "finance", label: "finance", pattern: /financ|invest|stock|account|market|trade|金融|投资|股票|财务|理财|证券/ },
    { id: "productivity", label: "productivity", pattern: /productiv|workflow|automation|efficien|project|效率|自动化|流程|项目管理/ },
    { id: "content", label: "content", pattern: /content|writer|writing|copy|brand|image|video|audio|内容|写作|文案|品牌|图像|视频|音频/ },
    { id: "intelligence", label: "intelligence", pattern: /news|search|research|intelligence|information|资讯|搜索|检索|研究|情报/ },
    { id: "education", label: "education", pattern: /educat|learn|course|teach|school|教育|学习|课程|教学/ },
    { id: "data", label: "data", pattern: /data|sql|chart|analytic|metric|数据|分析|图表|指标/ },
    { id: "deployment", label: "deployment", pattern: /deploy|website|web|hosting|domain|landing|网页|网站|部署|域名/ },
    { id: "lifestyle", label: "lifestyle", pattern: /life|travel|music|health|weather|生活|旅行|音乐|健康|天气/ },
    { id: "commerce", label: "commerce", pattern: /business|sales|commerce|marketing|growth|operation|商业|销售|电商|营销|增长|运营/ },
    { id: "knowledge", label: "knowledge", pattern: /knowledge|memory|markdown|note|summary|知识|笔记|总结|阅读/ }
  ];

  var SUITES = [
    { id: "design", category: "content", title: "suiteDesign", desc: "suiteDesignDesc", icon: "◇", colors: ["#e7def5", "#7656a4"] },
    { id: "build", category: "development", title: "suiteBuild", desc: "suiteBuildDesc", icon: "</>", colors: ["#d9ece6", "#26775f"] },
    { id: "content", category: "commerce", title: "suiteContent", desc: "suiteContentDesc", icon: "✦", colors: ["#f5e4d7", "#a2592e"] },
    { id: "data", category: "data", title: "suiteData", desc: "suiteDataDesc", icon: "↗", colors: ["#dbe9f5", "#356f9c"] },
    { id: "solo", category: "solo", title: "suiteOps", desc: "suiteOpsDesc", icon: "◎", colors: ["#e8efd6", "#607a27"] },
    { id: "knowledge", category: "knowledge", title: "suiteKnowledge", desc: "suiteKnowledgeDesc", icon: "⌘", colors: ["#efe3eb", "#87546f"] }
  ];

  var ICONS = {
    solo: "◎", office: "▦", development: "</>", finance: "↗", productivity: "✓",
    content: "✦", intelligence: "⌕", education: "A", data: "⌁", deployment: "◇",
    lifestyle: "◌", commerce: "△", knowledge: "⌘"
  };
  var TONES = [
    ["#e8f2db", "#5f7f32"], ["#dfeaf7", "#47729b"], ["#f6e5dc", "#9a5a38"],
    ["#e9e0f3", "#74558e"], ["#dceee8", "#39755f"], ["#f3e2e7", "#925a6d"],
    ["#e9eadc", "#737747"], ["#e1e8f1", "#566f8a"]
  ];

  var state = {
    lang: document.documentElement.lang && document.documentElement.lang.toLowerCase().indexOf("zh") === 0 ? "zh" : "en",
    items: null,
    status: "loading",
    error: "",
    tab: "recommended",
    category: "all",
    query: "",
    limit: 30,
    featuredOffset: 0,
    installed: readSet("db-studio-skills"),
    detailId: null,
    refreshBusy: false
  };

  function copy(key) { return COPY[state.lang][key] || key; }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function readSet(key) {
    try {
      var parsed = JSON.parse(localStorage.getItem(key) || "[]");
      return new Set(Array.isArray(parsed) ? parsed.filter(function (id) { return typeof id === "string"; }) : []);
    } catch (error) {
      return new Set();
    }
  }
  function saveInstalled() {
    try { localStorage.setItem("db-studio-skills", JSON.stringify(Array.from(state.installed))); } catch (error) {}
  }
  function localeValue(map, fallback) {
    if (!map || typeof map !== "object" || Array.isArray(map)) return fallback || "";
    var keys = state.lang === "zh" ? ["zh-CN", "zh_CN", "zh", "cn", "en"] : ["en-US", "en_US", "en", "zh-CN", "zh"];
    for (var i = 0; i < keys.length; i++) if (typeof map[keys[i]] === "string" && map[keys[i]].trim()) return map[keys[i]].trim();
    var values = Object.keys(map);
    return values.length && typeof map[values[0]] === "string" ? map[values[0]] : (fallback || "");
  }
  function humanizeName(value) {
    var text = String(value || "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return state.lang === "zh" ? "未命名技能" : "Untitled skill";
    return text.split(" ").map(function (word) {
      if (/^(?:ai|api|css|html|pdf|ppt|qa|seo|sql|svg|ui|ux)$/i.test(word)) return word.toUpperCase();
      return /^\d/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  }
  function titleOf(item) {
    return localeValue(item.displayName, humanizeName(item.name || item.id));
  }
  function descriptionOf(item) {
    return localeValue(item.descriptionI18n, item.description || item.examplePrompt || (state.lang === "zh" ? "工作区专业技能" : "Workspace skill"));
  }
  function exampleOf(item) {
    return localeValue(item.examplePromptI18n, item.examplePrompt || descriptionOf(item));
  }
  function searchText(item) {
    var values = [item.id, item.name, titleOf(item), descriptionOf(item), item.category, item.mode, item.scenario, item.examplePrompt];
    if (Array.isArray(item.triggers)) values = values.concat(item.triggers);
    return values.filter(Boolean).join(" ").toLowerCase();
  }
  function hashCode(value) {
    var text = String(value || "skill"), hash = 0;
    for (var i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    return Math.abs(hash);
  }
  function categoryOf(item) {
    if (item.__studioCategory) return item.__studioCategory;
    var haystack = searchText(item);
    for (var i = 1; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].pattern.test(haystack)) {
        item.__studioCategory = CATEGORIES[i].id;
        return item.__studioCategory;
      }
    }
    item.__studioCategory = item.mode === "prototype" || item.surface === "web" ? "deployment" : "knowledge";
    return item.__studioCategory;
  }
  function toneOf(item) { return TONES[hashCode(item.id) % TONES.length]; }
  function iconOf(item) {
    var category = categoryOf(item);
    var id = String(item.id || "").toLowerCase();
    if (/excel|sheet/.test(id)) return "X";
    if (/word|document/.test(id)) return "W";
    if (/slide|deck|ppt/.test(id)) return "P";
    if (/image|photo/.test(id)) return "◈";
    return ICONS[category] || "✦";
  }
  function featuredScore(item) {
    var featured = Number(item.featured);
    return (Number.isFinite(featured) ? featured * 100000 : 0) + (item.source === "built-in" ? 10000 : 0) + (10000 - hashCode(item.id) % 10000);
  }
  function isPracticalOfficeSkill(item) {
    if (!item || typeof item !== "object") return false;
    var id = String(item.id || item.name || "").toLowerCase();
    var mode = String(item.mode || item.od && item.od.mode || "").toLowerCase();
    var officeCategory = /office|办公|表格|文档/.test(String(item.category || item.scenario || ""));
    return id === "spreadsheet-repair" || (mode === "utility" && (officeCategory || categoryOf(item) === "office"));
  }
  function availableItems() {
    return Array.isArray(state.items) ? state.items.filter(isPracticalOfficeSkill) : [];
  }
  function filteredItems() {
    var list = availableItems().slice();
    if (state.tab === "hub") {
      list = list.filter(function (item) { return state.installed.has(item.id) || selectedSkillId() === item.id; });
    }
    var query = state.query.trim().toLowerCase();
    if (state.category !== "all") list = list.filter(function (item) { return categoryOf(item) === state.category; });
    if (query) list = list.filter(function (item) { return searchText(item).indexOf(query) >= 0; });
    if (state.tab === "recommended") list.sort(function (a, b) { return featuredScore(b) - featuredScore(a); });
    else list.sort(function (a, b) { return titleOf(a).localeCompare(titleOf(b), state.lang === "zh" ? "zh-CN" : "en"); });
    return list;
  }
  function iconMarkup(item, className) {
    var tone = toneOf(item);
    return '<span class="' + (className || "skills-card-icon") + '" style="--skill-tone:' + esc(tone[0]) + ';--skill-ink:' + esc(tone[1]) + '" aria-hidden="true">' + esc(iconOf(item)) + '</span>';
  }
  function notify(message) {
    var host = window.StudioWorkbenchHost;
    if (host && typeof host.toast === "function") host.toast(message);
  }
  function selectedSkillId() {
    var host = window.StudioWorkbenchHost;
    var hostState = host && typeof host.getState === "function" ? host.getState() : null;
    return hostState && hostState.selSkill && hostState.selSkill.id || "";
  }
  function attach(item, navigate) {
    if (!item) return;
    state.installed.add(item.id);
    saveInstalled();
    var host = window.StudioWorkbenchHost;
    if (host && typeof host.attachSkill === "function") host.attachSkill({ id: item.id, name: titleOf(item) });
    if (navigate) {
      var prompt = host && typeof host.$ === "function" ? host.$("prompt") : document.getElementById("prompt");
      if (prompt) {
        prompt.value = state.lang === "zh"
          ? "请使用「" + titleOf(item) + "」技能协助我完成以下任务：\n\n" + exampleOf(item) + "\n\n请先确认目标与约束，再给出可直接执行的完整结果。"
          : "Use the “" + titleOf(item) + "” skill to help with this task:\n\n" + exampleOf(item) + "\n\nConfirm the objective and constraints, then provide a complete, actionable result.";
      }
      closeDetail();
      if (host && typeof host.go === "function") host.go("home");
      else location.hash = "/home";
      setTimeout(function () { if (prompt && typeof prompt.focus === "function") prompt.focus(); }, 40);
    }
    notify(copy("addToast").replace("{name}", titleOf(item)));
    renderCatalog();
    renderDetail();
  }
  function detach(item) {
    if (!item) return;
    state.installed.delete(item.id);
    saveInstalled();
    var host = window.StudioWorkbenchHost;
    if (host && typeof host.detachSkill === "function") host.detachSkill(item.id);
    notify(copy("removeToast").replace("{name}", titleOf(item)));
    renderCatalog();
    renderDetail();
  }
  function toggleInstalled(item) {
    if (state.installed.has(item.id) || selectedSkillId() === item.id) detach(item);
    else attach(item, false);
  }
  function findItem(id) {
    var list = availableItems();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function renderFeatured() {
    document.getElementById("skillsFeaturedTitle").textContent = copy("featured");
    var button = document.getElementById("skillsRefresh");
    button.classList.toggle("busy", state.refreshBusy);
    button.disabled = state.refreshBusy || state.status === "loading";
    button.querySelector("span").textContent = state.refreshBusy ? copy("refreshing") : copy("refresh");
    var grid = document.getElementById("skillsFeaturedGrid");
    if (state.status === "loading" && !availableItems().length) {
      grid.innerHTML = new Array(5).fill('<div class="skills-feature-card skeleton"><i></i><b></b><span></span></div>').join("");
      return;
    }
    var section = grid.closest(".skills-featured");
    if (section) section.hidden = true;
    var ranked = availableItems().slice().sort(function (a, b) { return featuredScore(b) - featuredScore(a); });
    if (!ranked.length) { grid.innerHTML = ""; return; }
    var take = Math.min(5, ranked.length), cards = [];
    for (var i = 0; i < take; i++) cards.push(ranked[(state.featuredOffset + i) % ranked.length]);
    grid.innerHTML = cards.map(function (item) {
      var active = state.installed.has(item.id) || selectedSkillId() === item.id;
      return '<article class="skills-feature-card" tabindex="0" role="button" data-skill-open="' + esc(item.id) + '"><div class="skills-feature-top">' + iconMarkup(item, "skills-feature-icon") + '<h3>' + esc(titleOf(item)) + '</h3><button type="button" class="skills-add' + (active ? ' active' : '') + '" data-skill-toggle="' + esc(item.id) + '" aria-label="' + esc(active ? copy("remove") : copy("add")) + '">' + (active ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4L19 7"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>') + '</button></div><p>' + esc(descriptionOf(item)) + '</p></article>';
    }).join("");
  }

  function renderTabs() {
    var labels = { recommended: "recommended", hub: "hub", suites: "suites" };
    Array.prototype.forEach.call(root.querySelectorAll("[data-skills-tab]"), function (button) {
      var id = button.getAttribute("data-skills-tab");
      button.hidden = id === "suites";
      button.textContent = copy(labels[id]);
      button.classList.toggle("active", state.tab === id);
      button.setAttribute("aria-selected", state.tab === id ? "true" : "false");
    });
    var search = document.getElementById("skillsSearch");
    search.placeholder = copy("search");
    search.setAttribute("aria-label", copy("search"));
    if (search.value !== state.query) search.value = state.query;
  }

  function renderCategories() {
    var counts = {};
    availableItems().forEach(function (item) {
      var category = categoryOf(item);
      counts[category] = (counts[category] || 0) + 1;
    });
    var box = document.getElementById("skillsCategories");
    box.hidden = true;
    box.innerHTML = CATEGORIES.map(function (category) {
      var count = category.id === "all" ? availableItems().length : (counts[category.id] || 0);
      return '<button type="button" class="skills-category' + (state.category === category.id ? ' active' : '') + '" data-skills-category="' + category.id + '" aria-pressed="' + (state.category === category.id ? 'true' : 'false') + '">' + esc(copy(category.label)) + (count ? '<span>' + count + '</span>' : '') + '</button>';
    }).join("");
  }

  function skillCard(item) {
    var active = state.installed.has(item.id) || selectedSkillId() === item.id;
    return '<article class="skills-card" tabindex="0" role="button" data-skill-open="' + esc(item.id) + '" aria-label="' + esc(titleOf(item)) + '"><header>' + iconMarkup(item) + '<h3>' + esc(titleOf(item)) + '</h3><button type="button" class="skills-add' + (active ? ' active' : '') + '" data-skill-toggle="' + esc(item.id) + '" aria-label="' + esc(active ? copy("remove") : copy("add")) + '" title="' + esc(active ? copy("remove") : copy("add")) + '">' + (active ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4L19 7"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>') + '</button></header><p>' + esc(descriptionOf(item)) + '</p></article>';
  }

  function stateMarkup(kind) {
    var loading = kind === "loading";
    return '<div class="skills-state ' + kind + '"><div class="skills-state-icon">' + (loading ? '<i></i>' : kind === "error" ? "!" : "⌕") + '</div><h3>' + esc(copy(loading ? "loading" : kind === "error" ? "error" : "empty")) + '</h3><p>' + esc(copy(loading ? "loadingBody" : kind === "error" ? "errorBody" : "emptyBody")) + '</p>' + (loading ? "" : '<button type="button" data-skills-action="' + (kind === "error" ? "retry" : "clear") + '">' + esc(copy(kind === "error" ? "retry" : "clear")) + '</button>') + '</div>';
  }

  function renderSuites() {
    var grid = document.getElementById("skillsGrid");
    grid.className = "skills-suite-grid";
    grid.innerHTML = SUITES.map(function (suite) {
      var matches = availableItems().filter(function (item) { return categoryOf(item) === suite.category; });
      var preview = matches.slice(0, 4).map(function (item) { return iconMarkup(item, "skills-suite-mini"); }).join("");
      if (!preview) preview = '<span class="skills-suite-mini fallback" aria-hidden="true">' + esc(suite.icon) + '</span>';
      return '<article class="skills-suite-card" style="--suite-tone:' + suite.colors[0] + ';--suite-ink:' + suite.colors[1] + '"><div class="skills-suite-art"><span class="skills-suite-symbol">' + esc(suite.icon) + '</span><div class="skills-suite-stack">' + preview + '</div></div><div class="skills-suite-copy"><span class="skills-suite-count">' + matches.length + ' ' + esc(copy("count")) + '</span><h3>' + esc(copy(suite.title)) + '</h3><p>' + esc(copy(suite.desc)) + '</p><button type="button" data-suite-open="' + esc(suite.category) + '"' + (matches.length ? "" : " disabled") + '>' + esc(copy("openSuite")) + '<span>→</span></button></div></article>';
    }).join("");
    document.getElementById("skillsResultsMeta").textContent = SUITES.length + " " + copy("suites");
  }

  function renderCatalog() {
    renderTabs();
    renderCategories();
    var grid = document.getElementById("skillsGrid");
    var meta = document.getElementById("skillsResultsMeta");
    var more = document.getElementById("skillsLoadMore");
    more.hidden = true;
    if (state.tab === "suites" && state.status !== "loading" && state.status !== "error") {
      renderSuites();
      return;
    }
    grid.className = "skills-grid";
    if (state.status === "loading" && !availableItems().length) {
      grid.innerHTML = stateMarkup("loading");
      meta.textContent = "";
      return;
    }
    if (state.status === "error" && !availableItems().length) {
      grid.innerHTML = stateMarkup("error");
      meta.textContent = "";
      return;
    }
    var list = filteredItems();
    meta.textContent = list.length + " " + copy("count");
    if (!list.length) {
      grid.innerHTML = stateMarkup("empty");
      return;
    }
    grid.innerHTML = list.slice(0, state.limit).map(skillCard).join("");
    if (list.length > state.limit) {
      more.hidden = false;
      more.textContent = copy("loadMore") + " · " + Math.min(30, list.length - state.limit);
    }
  }

  function renderDetail() {
    var overlay = document.getElementById("skillsDetail");
    if (!state.detailId) {
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("skills-detail-open");
      return;
    }
    var item = findItem(state.detailId);
    if (!item) { closeDetail(); return; }
    var active = state.installed.has(item.id) || selectedSkillId() === item.id;
    var tone = toneOf(item);
    var triggers = Array.isArray(item.triggers) ? item.triggers.filter(Boolean).slice(0, 8) : [];
    document.getElementById("skillsDetailBody").innerHTML = '<div class="skills-detail-identity">' + iconMarkup(item, "skills-detail-icon") + '<div><span>' + esc(copy("details")) + '</span><h2 id="skillsDetailTitle">' + esc(titleOf(item)) + '</h2></div></div><p class="skills-detail-description">' + esc(descriptionOf(item)) + '</p>' + (triggers.length ? '<section><h3>' + esc(copy("triggers")) + '</h3><div class="skills-detail-tags">' + triggers.map(function (trigger) { return '<span>' + esc(trigger) + '</span>'; }).join("") + '</div></section>' : '') + '<section><h3>' + esc(copy("example")) + '</h3><div class="skills-example"><span>↗</span><p>' + esc(exampleOf(item)) + '</p></div></section><section><h3>' + esc(copy("capability")) + '</h3><dl><div><dt>' + esc(copy("source")) + '</dt><dd>' + esc(item.source === "user" ? copy("personal") : copy("builtIn")) + '</dd></div><div><dt>' + esc(copy("mode")) + '</dt><dd>' + esc(item.mode || item.surface || "—") + '</dd></div></dl></section>';
    var use = document.getElementById("skillsDetailUse");
    use.textContent = active ? copy("added") : copy("use");
    use.classList.toggle("active", active);
    use.style.setProperty("--detail-tone", tone[1]);
    use.setAttribute("data-skill-use", item.id);
    use.disabled = false;
    document.getElementById("skillsDetailClose").setAttribute("aria-label", copy("close"));
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("skills-detail-open");
  }
  function openDetail(id) {
    if (!findItem(id)) return;
    state.detailId = id;
    renderDetail();
    requestAnimationFrame(function () { document.getElementById("skillsDetailClose").focus(); });
  }
  function closeDetail() {
    state.detailId = null;
    renderDetail();
  }

  function render() {
    renderFeatured();
    renderCatalog();
    renderDetail();
  }

  function requestData(force) {
    state.refreshBusy = !!force;
    if (!availableItems().length) state.status = "loading";
    render();
    var host = window.StudioWorkbenchHost;
    var request;
    if (host && typeof host.ensureSkills === "function") request = host.ensureSkills(!!force);
    else request = fetch("/api/skills", { cache: force ? "no-store" : "default" }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }).then(function (payload) { return payload && payload.skills || []; });
    return Promise.resolve(request).then(function (items) {
      if (Array.isArray(items)) setItems(items);
      return items;
    }).catch(function (error) {
      setError(error && error.message || "Unable to load skills");
      return null;
    }).finally(function () {
      state.refreshBusy = false;
      renderFeatured();
    });
  }
  function setItems(items) {
    state.items = (Array.isArray(items) ? items : []).filter(function (item) { return item && typeof item.id === "string" && item.id; });
    state.status = "ready";
    state.error = "";
    state.refreshBusy = false;
    if (state.featuredOffset >= state.items.length) state.featuredOffset = 0;
    render();
  }
  function setLoading(preserve) {
    state.status = "loading";
    state.refreshBusy = !!preserve;
    if (!preserve) state.items = null;
    render();
  }
  function setError(message) {
    state.error = String(message || "");
    state.status = "error";
    state.refreshBusy = false;
    render();
  }

  root.addEventListener("input", function (event) {
    if (event.target.id !== "skillsSearch") return;
    state.query = event.target.value;
    state.limit = 30;
    renderCatalog();
  });
  root.addEventListener("click", function (event) {
    var target = event.target.closest("[data-skills-tab], [data-skills-category], [data-skill-toggle], [data-skill-open], [data-skill-use], [data-skills-action], [data-suite-open], #skillsRefresh, #skillsLoadMore, #skillsDetailClose");
    if (!target || !root.contains(target)) return;
    if (target.id === "skillsRefresh") {
      state.featuredOffset = availableItems().length ? (state.featuredOffset + 5) % availableItems().length : 0;
      renderFeatured();
      requestData(true);
      return;
    }
    if (target.id === "skillsLoadMore") { state.limit += 30; renderCatalog(); return; }
    if (target.id === "skillsDetailClose") { closeDetail(); return; }
    if (target.hasAttribute("data-skills-tab")) {
      state.tab = target.getAttribute("data-skills-tab");
      state.category = "all";
      state.limit = 30;
      renderCatalog();
      return;
    }
    if (target.hasAttribute("data-skills-category")) {
      state.category = target.getAttribute("data-skills-category");
      state.limit = 30;
      renderCatalog();
      return;
    }
    if (target.hasAttribute("data-skill-toggle")) {
      event.stopPropagation();
      toggleInstalled(findItem(target.getAttribute("data-skill-toggle")));
      return;
    }
    if (target.hasAttribute("data-skill-use")) { attach(findItem(target.getAttribute("data-skill-use")), true); return; }
    if (target.hasAttribute("data-skill-open")) { openDetail(target.getAttribute("data-skill-open")); return; }
    if (target.hasAttribute("data-suite-open")) {
      if (target.disabled) return;
      state.tab = "hub";
      state.category = target.getAttribute("data-suite-open");
      state.query = "";
      state.limit = 30;
      renderCatalog();
      var tabs = document.getElementById("skillsTabbar");
      if (tabs && typeof tabs.scrollIntoView === "function") tabs.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    var action = target.getAttribute("data-skills-action");
    if (action === "retry") requestData(true);
    if (action === "clear") {
      state.query = "";
      state.category = "all";
      state.limit = 30;
      renderCatalog();
    }
  });
  root.addEventListener("keydown", function (event) {
    var card = event.target.closest("[data-skill-open]");
    if (!card || event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openDetail(card.getAttribute("data-skill-open"));
  });
  document.getElementById("skillsDetail").addEventListener("click", function (event) {
    if (event.target === this) closeDetail();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.detailId) closeDetail();
  });

  window.StudioSkills = {
    setLanguage: function (lang) {
      state.lang = lang === "zh" ? "zh" : "en";
      render();
    },
    setItems: setItems,
    setLoading: setLoading,
    setError: setError,
    refresh: function () { return requestData(true); },
    render: render,
    getState: function () { return state; }
  };

  render();
  setTimeout(function () { if (state.items === null) requestData(false); }, 0);
})();
