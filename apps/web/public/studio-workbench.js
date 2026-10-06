(function () {
  "use strict";

  var H = window.StudioWorkbenchHost;
  if (!H) {
    console.error("Studio workbench host is unavailable");
    return;
  }

  var ICON = {
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 6-6 6 6 6"/></svg>',
    save: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h12l2 2v14H5zM8 4v6h8V4M8 20v-6h8v6"/></svg>',
    link: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/></svg>',
    upload: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 19h14"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6zM14 3v5h5"/></svg>',
    sketch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4-1L19.5 7.5a2.1 2.1 0 0 0-3-3L5 16l-1 4z"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 2-2 5 4"/></svg>',
    browser: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6 6.6h.01M9 6.6h.01"/></svg>',
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="4" width="8" height="7" rx="1"/><rect x="13" y="4" width="8" height="4" rx="1"/><rect x="13" y="10" width="8" height="10" rx="1"/><rect x="3" y="13" width="8" height="7" rx="1"/></svg>',
    plus: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    retry: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6v5h-5M4 18v-5h5M18.5 10A7 7 0 0 0 6 7.5L4 11m2 3a7 7 0 0 0 12 2.5l2-3.5"/></svg>'
  };

  var W = {
    projectId: null,
    projectName: "",
    root: H.$("genWorkbench"),
    kind: null,
    files: [],
    filesLoading: false,
    filesRequest: 0,
    contexts: [],
    saveMode: "saved",
    saveText: "",
    dirty: false,
    saveTimer: null,
    saveQueue: Promise.resolve(),
    revision: 0,
    opening: false,
    document: null,
    sketch: null,
    upload: { items: [] },
    browser: null,
    designSystem: null,
    pollTimer: null
  };

  function state() { return H.getState(); }
  function L(zh, en) { return state().lang === "zh" ? zh : en; }
  function E(value) {
    return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function nowStamp() {
    var d = new Date();
    return d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2);
  }
  function safeBaseName(value, fallback) {
    var clean = String(value || "").replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-").replace(/\s+/g, " ").trim();
    clean = clean.replace(/^\.+|\.+$/g, "").slice(0, 96);
    return clean || fallback;
  }
  function ensureExt(value, ext, fallback) {
    var name = safeBaseName(value, fallback);
    return name.toLowerCase().endsWith(ext.toLowerCase()) ? name : name + ext;
  }
  function safeCssFont(value) {
    return String(value || "system-ui").replace(/[^a-z0-9 ,_'"-]/gi, "").slice(0, 120) || "system-ui";
  }
  function byteLabel(size) {
    var n = Number(size) || 0;
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + " KB";
    return (n / 1024 / 1024).toFixed(1) + " MB";
  }
  function fileType(name, mime) {
    var lower = String(name || "").toLowerCase();
    var type = String(mime || "").toLowerCase();
    if (lower.endsWith(".sketch.json")) return "sketch";
    if (lower.endsWith(".design-system.json")) return "design-system";
    if (lower.endsWith(".browser.md")) return "browser";
    if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(lower)) return "image";
    if (type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(lower)) return "video";
    if (/\.html?$/i.test(lower) || type.includes("html")) return "html";
    if (/\.(md|markdown|txt)$/i.test(lower) || type.startsWith("text/")) return "document";
    if (/\.pdf$/i.test(lower) || type.includes("pdf")) return "pdf";
    if (/\.(json|ya?ml)$/i.test(lower)) return "data";
    return "file";
  }
  function fileLabel(kind) {
    var labels = {
      sketch: ["草图", "Sketch"], document: ["文档", "Document"], image: ["图片", "Image"],
      video: ["视频", "Video"], html: ["页面", "Page"], pdf: ["PDF", "PDF"], data: ["数据", "Data"],
      "design-system": ["设计体系", "Design system"], file: ["文件", "File"], browser: ["网页参考", "Web reference"]
    };
    var pair = labels[kind] || labels.file;
    return L(pair[0], pair[1]);
  }
  function cleanError(error) {
    return H.cleanErrorMessage ? H.cleanErrorMessage(error) : String(error && error.message || error || L("操作失败", "Operation failed"));
  }
  function currentProjectPath(name) { return H.projectFileUrl(W.projectId, name); }

  function saveStateHtml() {
    var text = W.saveText || (W.saveMode === "dirty" ? L("未保存", "Unsaved") : W.saveMode === "saving" ? L("保存中…", "Saving…") : W.saveMode === "error" ? L("保存失败", "Save failed") : L("已保存", "Saved"));
    return '<span class="gw-save-state ' + E(W.saveMode) + '" id="gwSaveState"><i></i><span>' + E(text) + '</span></span>';
  }
  function setSaveState(mode, text) {
    W.saveMode = mode;
    W.saveText = text || "";
    var el = document.getElementById("gwSaveState");
    if (!el) return;
    el.className = "gw-save-state " + mode;
    var span = el.querySelector("span");
    if (span) span.textContent = text || (mode === "dirty" ? L("未保存", "Unsaved") : mode === "saving" ? L("保存中…", "Saving…") : mode === "error" ? L("保存失败", "Save failed") : L("已保存", "Saved"));
  }
  function markDirty() {
    W.dirty = true;
    W.revision++;
    setSaveState("dirty");
  }
  function clearSaveTimer() {
    if (W.saveTimer) clearTimeout(W.saveTimer);
    W.saveTimer = null;
  }
  function scheduleSave() {
    clearSaveTimer();
    W.saveTimer = setTimeout(function () { void saveCurrent(true); }, 900);
  }

  function frame(config, body) {
    W.root.hidden = false;
    var nameHtml = config.nameEditable
      ? '<input class="gw-name" id="gwName" value="' + E(config.name || "") + '" aria-label="' + E(L("文件名称", "File name")) + '" />'
      : '<b>' + E(config.title) + '</b>';
    var sub = config.subtitle ? '<small>' + E(config.subtitle) + '</small>' : "";
    var attach = config.attachable
      ? '<button type="button" class="gw-btn" id="gwAttach">' + ICON.link + '<span>' + E(L("加入生成上下文", "Add to context")) + '</span></button>'
      : "";
    var save = config.saveable
      ? '<button type="button" class="gw-btn primary" id="gwSave">' + ICON.save + '<span>' + E(L("保存", "Save")) + '</span></button>'
      : "";
    W.root.innerHTML =
      '<header class="gw-head">' +
        '<button type="button" class="gw-back" id="gwBack" aria-label="' + E(L("返回设计文件", "Back to design files")) + '">' + ICON.back + '</button>' +
        '<div class="gw-title-group">' + nameHtml + sub + '</div>' +
        (config.showSaveState === false ? "" : saveStateHtml()) +
        '<div class="gw-head-actions">' + attach + save + '</div>' +
      '</header>' +
      '<div class="gw-body" id="gwBody">' + body + '</div>' +
      (config.footer || "");
    document.getElementById("gwBack").addEventListener("click", function () { void close(false); });
    var nameInput = document.getElementById("gwName");
    if (nameInput && config.onName) nameInput.addEventListener("input", function () { config.onName(nameInput.value); markDirty(); scheduleSave(); });
    var saveButton = document.getElementById("gwSave");
    if (saveButton) saveButton.addEventListener("click", function () { void saveCurrent(false); });
    var attachButton = document.getElementById("gwAttach");
    if (attachButton) attachButton.addEventListener("click", function () { void attachCurrent(); });
  }

  function ensureAttachButton() {
    if (document.getElementById("gwAttach")) return;
    var actions = W.root.querySelector(".gw-head-actions");
    if (!actions) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "gw-btn";
    button.id = "gwAttach";
    button.innerHTML = ICON.link + '<span>' + E(L("加入生成上下文", "Add to context")) + '</span>';
    button.addEventListener("click", function () { void attachCurrent(); });
    actions.insertBefore(button, actions.firstChild);
  }
  async function saveTextFile(name, content, previousName) {
    var projectId = W.projectId;
    if (!projectId) throw new Error(L("当前项目不可用", "Current project is unavailable"));
    if (previousName && previousName !== name) {
      await H.apiSend("/api/projects/" + encodeURIComponent(projectId) + "/files/rename", "POST", { from: previousName, to: name });
    }
    var result = await H.apiRequest("/api/projects/" + encodeURIComponent(projectId) + "/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, content: content, encoding: "utf8", overwrite: true }),
      keepalive: false
    });
    if (W.projectId === projectId) await loadFiles();
    return result && result.file ? result.file : { name: name, size: new Blob([content]).size, mime: "text/plain" };
  }
  async function readTextFile(name, limit) {
    var response = await fetch(currentProjectPath(name), { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    var text = await response.text();
    return typeof limit === "number" ? text.slice(0, limit) : text;
  }

  async function loadFiles() {
    if (!W.projectId) return;
    var request = ++W.filesRequest;
    W.filesLoading = true;
    if (H.renderGenFiles) H.renderGenFiles();
    try {
      var result = await H.apiGet("/api/projects/" + encodeURIComponent(W.projectId) + "/files");
      if (request !== W.filesRequest) return;
      W.files = Array.isArray(result && result.files) ? result.files.slice() : [];
    } catch (error) {
      if (request !== W.filesRequest) return;
      W.files = [];
    } finally {
      if (request === W.filesRequest) {
        W.filesLoading = false;
        if (H.renderGenFiles) H.renderGenFiles();
      }
    }
  }

  function contextStorageKey() { return "db-gen-context-" + (W.projectId || "none"); }
  function persistContexts() {
    try {
      sessionStorage.setItem(contextStorageKey(), JSON.stringify(W.contexts.map(function (item) {
        return { id: item.id, name: item.name, type: item.type, url: item.url || "", content: String(item.content || "").slice(0, 12000) };
      })));
    } catch (error) {}
  }
  function restoreContexts() {
    W.contexts = [];
    try {
      var parsed = JSON.parse(sessionStorage.getItem(contextStorageKey()) || "[]");
      if (Array.isArray(parsed)) W.contexts = parsed.filter(function (item) { return item && typeof item.name === "string"; }).slice(0, 8);
    } catch (error) {}
  }
  function addContext(item) {
    if (!item || !item.name) return;
    var id = item.id || item.name;
    W.contexts = W.contexts.filter(function (existing) { return existing.id !== id; });
    W.contexts.push({ id: id, name: item.name, type: item.type || "file", content: item.content || "", url: item.url || "" });
    if (W.contexts.length > 8) W.contexts.shift();
    persistContexts();
    renderContext();
    if (H.renderGenFiles) H.renderGenFiles();
    H.toast(state().gen.status === "run" ? L("已加入下一轮生成上下文", "Added to the next generation turn") : L("已加入生成上下文", "Added to generation context"));
  }
  function removeContext(id) {
    W.contexts = W.contexts.filter(function (item) { return item.id !== id; });
    persistContexts();
    renderContext();
    if (H.renderGenFiles) H.renderGenFiles();
  }
  function renderContext() {
    var box = H.$("genContext");
    if (!box) return;
    decorateGenerationTimeline();
    if (!W.contexts.length) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.hidden = false;
    box.innerHTML = '<span class="gen-context-label">' + E(L("上下文", "Context")) + '</span>' + W.contexts.map(function (item) {
      return '<span class="gen-context-chip" title="' + E(item.name) + '"><span>' + E(item.name) + '</span><button type="button" data-context-remove="' + E(item.id) + '" aria-label="' + E(L("移除", "Remove")) + '">×</button></span>';
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll("[data-context-remove]"), function (button) {
      button.addEventListener("click", function () { removeContext(button.getAttribute("data-context-remove")); });
    });
  }
  async function promptWithContext(prompt) {
    if (!W.contexts.length) return prompt;
    var total = 0;
    var blocks = [];
    for (var i = 0; i < W.contexts.length; i++) {
      var item = W.contexts[i];
      var content = String(item.content || "");
      if (!content && /^(document|sketch|data|design-system|browser)$/.test(item.type) && item.name && !item.url) {
        try { content = await readTextFile(item.name, 5000); } catch (error) {}
      }
      content = content.replace(/\u0000/g, "").slice(0, Math.min(5000, 12000 - total));
      total += content.length;
      var description = content || (item.url ? "URL: " + item.url : "Project file path: " + item.name + ". Its bytes are stored in the current project.");
      blocks.push("[Project reference: " + item.name + "]\n" + description);
      if (total >= 12000) break;
    }
    return prompt + "\n\nUse the following project references when relevant. Do not claim to have visually inspected binary files unless their contents are explicitly provided.\n\n" + blocks.join("\n\n");
  }

  function latestTurn() {
    var events = state().gen.events || [];
    var user = null, steps = [];
    events.forEach(function (event) {
      if (event.type === "user") { user = event; steps = []; }
      else if (user && event.type === "step" && event.payload && event.payload.text) steps.push(event.payload.text);
    });
    return { user: user, steps: steps };
  }
  function decorateGenerationTimeline() {
    var running = state().gen.status === "run";
    var cards = H.$("genChat") ? H.$("genChat").querySelectorAll(".gm-ai") : [];
    if (!cards.length) return;
    var card = cards[cards.length - 1];
    Array.prototype.forEach.call(card.querySelectorAll(".gm-step"), function (step) {
      step.classList.remove("active", "future");
    });
    if (running) {
      var steps = card.querySelectorAll(".gm-step:not(.pending)");
      var pending = card.querySelector(".gm-step.pending");
      if (pending) pending.remove();
      if (steps.length) {
        var active = steps[steps.length - 1];
        active.classList.add("active");
        var activeIcon = active.querySelector(".ck");
        if (activeIcon) activeIcon.innerHTML = "";
      }
      var list = card.querySelector(".gm-steps");
      if (list && !list.querySelector(".future")) {
        [L("验证生成结果", "Validate generated result"), L("保存到设计文件", "Save to design files")].forEach(function (label) {
          var row = document.createElement("div");
          row.className = "gm-step future";
          row.innerHTML = '<span class="ck"></span><span>' + E(label) + '</span>';
          list.appendChild(row);
        });
      }
    } else {
      var events = state().gen.events || [];
      var last = events[events.length - 1];
      if (last && last.type === "stop" && last.payload && last.payload.reason === "error" && !card.querySelector(".gw-retry-generation")) {
        var retry = document.createElement("button");
        retry.type = "button";
        retry.className = "gm-art-link gw-retry-generation";
        retry.innerHTML = ICON.retry + E(L("重试上次请求", "Retry last request"));
        retry.addEventListener("click", function () {
          for (var i = events.length - 1; i >= 0; i--) {
            if (events[i].type === "user" && events[i].payload && events[i].payload.text) {
              H.startGenTurn(events[i].payload.text);
              break;
            }
          }
        });
        card.appendChild(retry);
      }
    }
  }

  function currentFileNamesFromArtifacts(arts) {
    var names = Object.create(null);
    (arts || []).forEach(function (item) { if (item.fileName) names[item.fileName] = true; });
    return names;
  }
  function genericFilePreview(file, kind) {
    if (kind === "image") return '<img src="' + E(currentProjectPath(file.name)) + '" alt="" loading="lazy" />';
    if (kind === "video") return '<video src="' + E(currentProjectPath(file.name)) + '" muted preload="metadata"></video>';
    var icon = kind === "sketch" ? ICON.sketch : kind === "design-system" ? ICON.system : kind === "browser" ? ICON.browser : ICON.file;
    return '<span class="gf-file-mark">' + icon + '</span>';
  }
  function contextContains(name) { return W.contexts.some(function (item) { return item.id === "file:" + name || item.name === name; }); }
  function renderProjectFiles(box, arts) {
    if (!box || !W.projectId) return;
    var running = state().gen.status === "run";
    var stopped = state().gen.status === "stop";
    var artifactNames = currentFileNamesFromArtifacts(arts);
    var files = W.files.filter(function (file) { return file && file.name && !artifactNames[file.name]; }).sort(function (a, b) {
      return Number(b.mtime || b.updatedAt || 0) - Number(a.mtime || a.updatedAt || 0);
    }).slice(0, 40);
    if (!running && !stopped && !files.length && !W.filesLoading) return;
    var empty = box.querySelector(".gf-empty");
    if (empty) empty.remove();
    var grid = box.querySelector(".gf-grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "gf-grid";
      box.appendChild(grid);
    }
    if (running) {
      var run = latestTurn();
      var model = run.user && run.user.payload && run.user.payload.model || state().model || "Agnes";
      var current = run.steps.length ? run.steps[run.steps.length - 1] : L("准备生成请求…", "Preparing generation request…");
      var generating = document.createElement("div");
      generating.className = "gf-generating";
      generating.innerHTML = '<div class="gf-generating-head"><span class="gf-generating-spinner"></span><div class="gf-generating-copy"><b>' + E(L("正在生成设计文件", "Generating design file")) + '</b><span>' + E(current) + '</span></div><span class="gf-generating-model">' + E(model) + '</span></div><div class="gf-generating-bar"><i></i></div>';
      grid.insertBefore(generating, grid.firstChild);
    } else if (state().gen.status === "stop") {
      var events = state().gen.events || [], stop = null, lastPrompt = "";
      for (var ei = events.length - 1; ei >= 0; ei--) {
        if (!stop && events[ei].type === "stop") stop = events[ei];
        if (events[ei].type === "user" && events[ei].payload && events[ei].payload.text) { lastPrompt = events[ei].payload.text; break; }
      }
      if (stop) {
        var failed = stop.payload && stop.payload.reason === "error";
        var stoppedCard = document.createElement("div");
        stoppedCard.className = "gf-generating " + (failed ? "failed" : "stopped");
        stoppedCard.innerHTML = '<div class="gf-generating-head"><span class="gf-generating-state">' + (failed ? "!" : "■") + '</span><div class="gf-generating-copy"><b>' + E(failed ? L("生成失败", "Generation failed") : L("生成已停止", "Generation stopped")) + '</b><span>' + E(stop.payload && (stop.payload.detail || stop.payload.message || stop.payload.error) || L("没有创建未完成的设计文件", "No incomplete design file was created")) + '</span></div>' + (lastPrompt ? '<button type="button" class="gw-btn danger gf-retry">' + ICON.retry + E(L("重试", "Retry")) + '</button>' : "") + '</div>';
        var retryButton = stoppedCard.querySelector(".gf-retry");
        if (retryButton) retryButton.addEventListener("click", function () { H.startGenTurn(lastPrompt); });
        grid.insertBefore(stoppedCard, grid.firstChild);
      }
    }
    if (W.filesLoading && !files.length) {
      var loading = document.createElement("div");
      loading.className = "gf-loading";
      loading.textContent = L("正在读取项目文件…", "Loading project files…");
      grid.appendChild(loading);
      return;
    }
    if (!files.length) return;
    var title = document.createElement("div");
    title.className = "gf-section-title";
    title.textContent = L("项目文件", "Project files");
    grid.appendChild(title);
    files.forEach(function (file) {
      var kind = fileType(file.name, file.mime);
      var card = document.createElement("div");
      card.className = "gf-card project-file";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.innerHTML = '<div class="pv">' + genericFilePreview(file, kind) + '<span class="gf-file-kind">' + E(fileLabel(kind)) + '</span></div>' +
        '<div class="meta"><b title="' + E(file.name) + '">' + E(file.name) + '</b><span class="time">' + E(byteLabel(file.size)) + '</span><button type="button" class="gf-context-add' + (contextContains(file.name) ? ' on' : '') + '" aria-label="' + E(L("加入生成上下文", "Add to context")) + '">' + ICON.plus + '</button></div>';
      var add = card.querySelector(".gf-context-add");
      add.addEventListener("click", function (event) {
        event.stopPropagation();
        if (contextContains(file.name)) removeContext("file:" + file.name);
        else void attachFile(file);
      });
      var openFile = function () { void openProjectFile(file); };
      card.addEventListener("click", openFile);
      card.addEventListener("keydown", function (event) { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openFile(); } });
      grid.appendChild(card);
    });
  }

  async function attachFile(file) {
    var kind = fileType(file.name, file.mime);
    var content = "";
    if (/^(document|sketch|data|design-system|browser)$/.test(kind)) {
      try { content = await readTextFile(file.name, 7000); } catch (error) {}
    }
    addContext({ id: "file:" + file.name, name: file.name, type: kind, content: content });
  }
  async function openProjectFile(file) {
    var kind = fileType(file.name, file.mime);
    if (kind === "sketch") { await open("sketch", { file: file }); return; }
    if (kind === "browser") { await open("browser", { file: file }); return; }
    if (kind === "document" || kind === "data" || kind === "design-system") { await open("document", { file: file }); return; }
    if (kind === "image" || kind === "video") {
      H.openGenPreview({ name: file.name, version: "", model: "", surface: kind, fileName: file.name });
      return;
    }
    if (kind === "html") {
      try {
        var html = await readTextFile(file.name);
        H.openGenPreview({ name: file.name, version: "", model: "", surface: "text", html: html });
      } catch (error) { H.toast(cleanError(error)); }
      return;
    }
    window.open(currentProjectPath(file.name), "_blank", "noopener,noreferrer");
  }

  function roleDocumentTemplates() {
    var role = state().role || "designer";
    var templates = {
      designer: [
        [L("设计说明", "Design brief"), "# 设计说明\n\n## 目标\n\n## 用户与场景\n\n## 视觉方向\n\n## 关键交互\n\n## 交付检查\n- [ ] "],
        [L("交互说明", "Interaction spec"), "# 交互说明\n\n## 页面结构\n\n## 核心流程\n\n## 状态与反馈\n\n## 边界情况\n"]
      ],
      pm: [
        ["PRD", "# 产品需求文档\n\n## 背景与目标\n\n## 用户问题\n\n## 需求范围\n\n## 用户故事\n\n## 验收标准\n- [ ] "],
        [L("评审记录", "Review notes"), "# 评审记录\n\n## 结论\n\n## 决策\n\n## 待办事项\n- [ ] "]
      ],
      dev: [
        [L("技术方案", "Technical proposal"), "# 技术方案\n\n## 目标\n\n## 架构\n\n## 数据模型\n\n## API\n\n## 风险与测试\n"],
        [L("测试计划", "Test plan"), "# 测试计划\n\n## 范围\n\n## 用例\n- [ ] \n\n## 回归检查\n"]
      ],
      admin: [
        [L("运营规范", "Operations guide"), "# 运营规范\n\n## 适用范围\n\n## 标准流程\n\n## 角色与权限\n\n## 审批记录\n"],
        [L("权限清单", "Permission matrix"), "# 权限清单\n\n| 角色 | 查看 | 编辑 | 审批 | 管理 |\n| --- | --- | --- | --- | --- |\n"]
      ]
    };
    return templates[role] || templates.designer;
  }
  function markdownPreview(text) {
    var lines = String(text || "").split(/\r?\n/), html = "", inList = false;
    function inline(value) {
      return E(value).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    }
    lines.forEach(function (line) {
      var list = /^[-*]\s+(.*)$/.exec(line);
      if (list) {
        if (!inList) { html += "<ul>"; inList = true; }
        html += "<li>" + inline(list[1]) + "</li>";
        return;
      }
      if (inList) { html += "</ul>"; inList = false; }
      var head = /^(#{1,3})\s+(.*)$/.exec(line);
      if (head) { var level = head[1].length; html += "<h" + level + ">" + inline(head[2]) + "</h" + level + ">"; return; }
      var quote = /^>\s?(.*)$/.exec(line);
      if (quote) { html += "<blockquote>" + inline(quote[1]) + "</blockquote>"; return; }
      if (/^\s*$/.test(line)) { html += "<br>"; return; }
      html += "<p>" + inline(line) + "</p>";
    });
    if (inList) html += "</ul>";
    return html;
  }

  async function openDocument(options) {
    var file = options && options.file;
    var content = "";
    if (file) {
      try { content = await readTextFile(file.name); } catch (error) { H.toast(cleanError(error)); }
    }
    W.document = {
      name: file ? file.name : ensureExt(L("未命名文档-", "Untitled document-") + nowStamp(), ".md", "document.md"),
      savedName: file ? file.name : "",
      content: content,
      mode: "edit",
      file: file || null
    };
    W.dirty = false;
    W.saveMode = "saved";
    renderDocument();
  }
  function renderDocument() {
    var doc = W.document;
    var templates = roleDocumentTemplates();
    var templateHtml = '<div class="gw-doc-template-strip"><span>' + E(L("模板", "Templates")) + '</span>' + templates.map(function (entry, index) {
      return '<button type="button" data-doc-template="' + index + '">' + E(entry[0]) + '</button>';
    }).join("") + "</div>";
    var editorVisible = doc.mode !== "preview";
    var previewVisible = doc.mode !== "edit";
    var mainClass = doc.mode === "split" ? "gw-doc-main split" : "gw-doc-main";
    var toolbar = '<div class="gw-doc-toolbar">' +
      '<button type="button" class="gw-tool" data-md-prefix="# ">H1</button><button type="button" class="gw-tool" data-md-prefix="## ">H2</button><span class="gw-tool-sep"></span>' +
      '<button type="button" class="gw-tool" data-md-wrap="**">B</button><button type="button" class="gw-tool" data-md-wrap="*"><i>I</i></button><button type="button" class="gw-tool" data-md-wrap="`">&lt;/&gt;</button><span class="gw-tool-sep"></span>' +
      '<button type="button" class="gw-tool" data-md-prefix="- ">• ' + E(L("列表", "List")) + '</button><button type="button" class="gw-tool" data-md-prefix="- [ ] ">☑</button><button type="button" class="gw-tool" data-md-prefix="> ">❝</button>' +
      '<div class="gw-doc-tabs"><button type="button" data-doc-mode="edit" class="' + (doc.mode === "edit" ? "on" : "") + '">' + E(L("编辑", "Edit")) + '</button><button type="button" data-doc-mode="split" class="' + (doc.mode === "split" ? "on" : "") + '">' + E(L("分屏", "Split")) + '</button><button type="button" data-doc-mode="preview" class="' + (doc.mode === "preview" ? "on" : "") + '">' + E(L("预览", "Preview")) + '</button></div></div>';
    var body = '<div class="gw-doc">' + templateHtml + toolbar + '<div class="' + mainClass + '">' +
      (editorVisible ? '<textarea class="gw-doc-editor" id="gwDocEditor" spellcheck="true">' + E(doc.content) + '</textarea>' : "") +
      (previewVisible ? '<article class="gw-doc-preview" id="gwDocPreview">' + markdownPreview(doc.content) + '</article>' : "") +
      "</div></div>";
    frame({
      title: L("新建文档", "New document"), subtitle: L("Markdown · 自动保存到当前项目", "Markdown · auto-saved to this project"),
      name: doc.name, nameEditable: true, saveable: true, attachable: Boolean(doc.savedName),
      onName: function (value) { doc.name = value; }
    }, body);
    bindDocument();
  }
  function bindDocument() {
    var editor = document.getElementById("gwDocEditor");
    if (editor) editor.addEventListener("input", function () {
      W.document.content = editor.value;
      markDirty();
      scheduleSave();
      var preview = document.getElementById("gwDocPreview");
      if (preview) preview.innerHTML = markdownPreview(editor.value);
    });
    Array.prototype.forEach.call(W.root.querySelectorAll("[data-doc-mode]"), function (button) {
      button.addEventListener("click", function () { W.document.mode = button.getAttribute("data-doc-mode"); renderDocument(); });
    });
    Array.prototype.forEach.call(W.root.querySelectorAll("[data-doc-template]"), function (button) {
      button.addEventListener("click", function () {
        var template = roleDocumentTemplates()[Number(button.getAttribute("data-doc-template"))];
        if (!template) return;
        if (W.document.content.trim() && !window.confirm(L("替换当前文档内容？", "Replace the current document content?"))) return;
        W.document.content = template[1];
        markDirty();
        renderDocument();
        scheduleSave();
      });
    });
    Array.prototype.forEach.call(W.root.querySelectorAll("[data-md-prefix],[data-md-wrap]"), function (button) {
      button.addEventListener("click", function () {
        var area = document.getElementById("gwDocEditor");
        if (!area) { W.document.mode = "edit"; renderDocument(); return; }
        var start = area.selectionStart, end = area.selectionEnd;
        var value = area.value, selected = value.slice(start, end);
        var prefix = button.getAttribute("data-md-prefix"), wrap = button.getAttribute("data-md-wrap");
        var replacement = prefix != null ? prefix + selected : wrap + selected + wrap;
        area.setRangeText(replacement, start, end, "end");
        W.document.content = area.value;
        area.focus();
        markDirty();
        scheduleSave();
      });
    });
  }
  function saveDocument(quiet) {
    var doc = W.document;
    if (!doc) return Promise.resolve(false);
    clearSaveTimer();
    var revision = W.revision;
    var content = doc.content;
    var name = safeBaseName(doc.name, "document.md");
    if (!/\.[a-z0-9][a-z0-9._-]{0,15}$/i.test(name)) name += ".md";
    doc.name = name;
    if (W.document === doc && W.kind === "document") setSaveState("saving");
    var operation = W.saveQueue.catch(function () {}).then(async function () {
      try {
        var file = await saveTextFile(name, content, doc.savedName);
        doc.savedName = name;
        doc.file = file;
        if (W.document === doc && W.kind === "document") {
          if (W.revision === revision) { W.dirty = false; setSaveState("saved"); }
          else { W.dirty = true; setSaveState("dirty"); scheduleSave(); }
          var input = document.getElementById("gwName");
          if (input && W.revision === revision) input.value = name;
          ensureAttachButton();
          if (!quiet) H.toast(L("文档已保存", "Document saved"));
        }
        return true;
      } catch (error) {
        if (W.document === doc && W.kind === "document") {
          setSaveState("error", cleanError(error));
          if (!quiet) H.toast(cleanError(error));
        }
        return false;
      }
    });
    W.saveQueue = operation;
    return operation;
  }

  function normalizeSketchItems(value) {
    if (!value || !Array.isArray(value.items)) return [];
    function number(input, fallback) { var n = Number(input); return Number.isFinite(n) ? Math.max(-100000, Math.min(100000, n)) : fallback; }
    function color(input) { return /^#[0-9a-f]{3,8}$/i.test(String(input || "")) ? String(input) : "#26342b"; }
    return value.items.slice(0, 2000).reduce(function (out, item) {
      if (!item || !/^(pen|rect|arrow|text)$/.test(item.kind)) return out;
      var size = Math.max(1, Math.min(4096, number(item.size, item.kind === "text" ? 18 : 2)));
      if (item.kind === "pen") {
        if (!Array.isArray(item.points)) return out;
        out.push({ kind: "pen", points: item.points.slice(0, 12000).map(function (point) { return { x: number(point && point.x, 0), y: number(point && point.y, 0) }; }), color: color(item.color), size: size });
      } else if (item.kind === "rect") out.push({ kind: "rect", x: number(item.x, 0), y: number(item.y, 0), w: number(item.w, 0), h: number(item.h, 0), color: color(item.color), size: size });
      else if (item.kind === "arrow") out.push({ kind: "arrow", x1: number(item.x1, 0), y1: number(item.y1, 0), x2: number(item.x2, 0), y2: number(item.y2, 0), color: color(item.color), size: size });
      else out.push({ kind: "text", x: number(item.x, 0), y: number(item.y, 0), text: String(item.text || "").slice(0, 2000), color: color(item.color), size: size });
      return out;
    }, []);
  }
  function parseSketchPayload(value) {
    if (value && value.type === "excalidraw" && Array.isArray(value.elements)) {
      var converted = [];
      value.elements.forEach(function (element) {
        if (!element || element.isDeleted) return;
        var base = { color: /^#[0-9a-f]{3,8}$/i.test(String(element.strokeColor || "")) ? element.strokeColor : "#26342b", size: Math.max(1, Math.min(12, Number(element.strokeWidth) || 2)) };
        if (element.type === "freedraw" && Array.isArray(element.points)) converted.push({ kind: "pen", points: element.points.map(function (point) { return { x: (Number(element.x) || 0) + (Number(point && point[0]) || 0), y: (Number(element.y) || 0) + (Number(point && point[1]) || 0) }; }), color: base.color, size: base.size });
        else if (element.type === "rectangle") converted.push({ kind: "rect", x: Number(element.x) || 0, y: Number(element.y) || 0, w: Number(element.width) || 0, h: Number(element.height) || 0, color: base.color, size: base.size });
        else if (element.type === "arrow") { var points = Array.isArray(element.points) ? element.points : [[0, 0], [Number(element.width) || 0, Number(element.height) || 0]]; var end = points[points.length - 1] || [0, 0]; converted.push({ kind: "arrow", x1: Number(element.x) || 0, y1: Number(element.y) || 0, x2: (Number(element.x) || 0) + (Number(end[0]) || 0), y2: (Number(element.y) || 0) + (Number(end[1]) || 0), color: base.color, size: base.size }); }
        else if (element.type === "text") converted.push({ kind: "text", x: Number(element.x) || 0, y: (Number(element.y) || 0) + (Number(element.fontSize) || 18), text: String(element.text || element.originalText || ""), color: base.color, size: Number(element.fontSize) || 18 });
      });
      return { items: normalizeSketchItems({ items: converted }), passthrough: [{ kind: "excalidraw-source", document: value }], imported: true };
    }
    var all = value && Array.isArray(value.items) ? value.items : [];
    return {
      items: normalizeSketchItems(value),
      passthrough: all.filter(function (item) { return !item || !/^(pen|rect|arrow|text)$/.test(item.kind); }),
      imported: false
    };
  }
  async function openSketch(options) {
    var file = options && options.file, parsed = { items: [], passthrough: [], imported: false };
    if (file) {
      try { parsed = parseSketchPayload(JSON.parse(await readTextFile(file.name))); } catch (error) { H.toast(cleanError(error)); }
    }
    W.sketch = {
      name: file ? file.name : ensureExt(L("草图-", "Sketch-") + nowStamp(), ".sketch.json", "sketch.sketch.json"),
      savedName: file ? file.name : "",
      file: file || null,
      items: parsed.items,
      passthrough: parsed.passthrough,
      imported: parsed.imported,
      history: [],
      future: [],
      tool: "pen",
      color: "#26342b",
      size: 3,
      text: L("文本", "Text"),
      selected: -1,
      gesture: null
    };
    W.dirty = false;
    W.saveMode = "saved";
    renderSketch();
  }
  function sketchToolButton(id, label, icon) {
    return '<button type="button" class="gw-sketch-tool' + (W.sketch.tool === id ? " on" : "") + '" data-sketch-tool="' + id + '" title="' + E(label) + '">' + icon + '<span>' + E(label) + '</span></button>';
  }
  function renderSketch() {
    var s = W.sketch;
    var body = '<div class="gw-sketch"><div class="gw-sketch-toolbar">' +
      sketchToolButton("select", L("选择", "Select"), "↖") +
      sketchToolButton("pen", L("画笔", "Pen"), "✎") +
      sketchToolButton("rect", L("矩形", "Rectangle"), "□") +
      sketchToolButton("arrow", L("箭头", "Arrow"), "↗") +
      sketchToolButton("text", L("文字", "Text"), "T") +
      sketchToolButton("eraser", L("擦除", "Erase"), "⌫") +
      '<span class="gw-tool-sep"></span><input type="color" id="gwSketchColor" value="' + E(s.color) + '" title="' + E(L("颜色", "Color")) + '"/><input class="gw-sketch-size" id="gwSketchSize" type="range" min="1" max="8" step="1" value="' + E(s.size) + '" title="' + E(L("线条粗细", "Stroke width")) + '"/><input class="gw-sketch-text-value" id="gwSketchTextValue" value="' + E(s.text) + '" placeholder="' + E(L("放置的文字", "Text to place")) + '"/>' +
      '<span class="gw-tool-sep"></span><button type="button" class="gw-sketch-tool" id="gwSketchUndo" title="' + E(L("撤销", "Undo")) + '">↶</button><button type="button" class="gw-sketch-tool" id="gwSketchRedo" title="' + E(L("重做", "Redo")) + '">↷</button><button type="button" class="gw-sketch-tool" id="gwSketchClear" title="' + E(L("清空", "Clear")) + '">⌧</button>' +
      '</div><div class="gw-sketch-canvas-wrap"><svg class="gw-sketch-canvas" id="gwSketchCanvas" data-tool="' + E(s.tool) + '" viewBox="0 0 1200 800" role="application" tabindex="0" aria-label="' + E(L("草图画布", "Sketch canvas")) + '"></svg></div><div class="gw-sketch-status"><span id="gwSketchCount"></span><span>' + E(s.imported ? L("已转换常用 Excalidraw 元素；原场景数据会保留在文件中", "Common Excalidraw elements were converted; the original scene remains preserved in the file") : L("支持选择移动、画笔、矩形、箭头、文字和擦除", "Select/move, pen, rectangle, arrow, text and eraser")) + '</span></div></div>';
    frame({ title: L("新建草图", "New sketch"), subtitle: L("项目草图 · 自动保存", "Project sketch · auto-save"), name: s.name, nameEditable: true, saveable: true, attachable: Boolean(s.savedName), onName: function (value) { s.name = value; } }, body);
    bindSketch();
    drawSketch();
  }
  function sketchSnapshot() { return JSON.parse(JSON.stringify(W.sketch.items)); }
  function sketchPushHistory() {
    W.sketch.history.push(sketchSnapshot());
    if (W.sketch.history.length > 60) W.sketch.history.shift();
    W.sketch.future = [];
  }
  function sketchPoint(event, svg) {
    var rect = svg.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1200, (event.clientX - rect.left) * 1200 / rect.width)), y: Math.max(0, Math.min(800, (event.clientY - rect.top) * 800 / rect.height)) };
  }
  function moveSketchItem(item, dx, dy) {
    if (item.kind === "pen") item.points.forEach(function (p) { p.x += dx; p.y += dy; });
    else if (item.kind === "rect" || item.kind === "text") { item.x += dx; item.y += dy; }
    else if (item.kind === "arrow") { item.x1 += dx; item.x2 += dx; item.y1 += dy; item.y2 += dy; }
  }
  function drawSketch() {
    var svg = document.getElementById("gwSketchCanvas");
    if (!svg || !W.sketch) return;
    var s = W.sketch;
    var out = '<defs><marker id="gwArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="context-stroke"/></marker></defs>';
    s.items.forEach(function (item, index) {
      var cls = index === s.selected ? ' class="selected"' : "";
      if (item.kind === "pen") {
        out += '<polyline data-index="' + index + '"' + cls + ' points="' + item.points.map(function (p) { return Number(p.x).toFixed(1) + "," + Number(p.y).toFixed(1); }).join(" ") + '" fill="none" stroke="' + E(item.color) + '" stroke-width="' + Number(item.size) + '" stroke-linecap="round" stroke-linejoin="round"/>';
      } else if (item.kind === "rect") {
        var x = Math.min(item.x, item.x + item.w), y = Math.min(item.y, item.y + item.h);
        out += '<rect data-index="' + index + '"' + cls + ' x="' + x + '" y="' + y + '" width="' + Math.abs(item.w) + '" height="' + Math.abs(item.h) + '" rx="8" fill="rgba(255,255,255,.02)" stroke="' + E(item.color) + '" stroke-width="' + Number(item.size) + '"/>';
      } else if (item.kind === "arrow") {
        out += '<line data-index="' + index + '"' + cls + ' x1="' + Number(item.x1) + '" y1="' + Number(item.y1) + '" x2="' + Number(item.x2) + '" y2="' + Number(item.y2) + '" stroke="' + E(item.color) + '" stroke-width="' + Number(item.size) + '" stroke-linecap="round" marker-end="url(#gwArrow)"/>';
      } else if (item.kind === "text") {
        out += '<text data-index="' + index + '"' + cls + ' x="' + Number(item.x) + '" y="' + Number(item.y) + '" fill="' + E(item.color) + '" font-size="' + Math.max(14, Number(item.size) || 18) + '" font-family="Inter,system-ui,sans-serif" font-weight="600">' + E(item.text) + '</text>';
      }
    });
    svg.innerHTML = out;
    svg.setAttribute("data-tool", s.tool);
    var count = document.getElementById("gwSketchCount");
    if (count) count.textContent = L("元素 ", "Elements ") + s.items.length;
  }
  function sketchChanged() { markDirty(); drawSketch(); scheduleSave(); }
  function bindSketch() {
    var s = W.sketch, svg = document.getElementById("gwSketchCanvas");
    Array.prototype.forEach.call(W.root.querySelectorAll("[data-sketch-tool]"), function (button) {
      button.addEventListener("click", function () { s.tool = button.getAttribute("data-sketch-tool"); s.selected = -1; renderSketch(); });
    });
    document.getElementById("gwSketchColor").addEventListener("input", function (event) { s.color = event.target.value; });
    document.getElementById("gwSketchSize").addEventListener("input", function (event) { s.size = Number(event.target.value) || 2; });
    document.getElementById("gwSketchTextValue").addEventListener("input", function (event) { s.text = event.target.value; });
    document.getElementById("gwSketchUndo").addEventListener("click", function () {
      if (!s.history.length) return;
      s.future.push(sketchSnapshot());
      s.items = s.history.pop();
      s.selected = -1;
      sketchChanged();
    });
    document.getElementById("gwSketchRedo").addEventListener("click", function () {
      if (!s.future.length) return;
      s.history.push(sketchSnapshot());
      s.items = s.future.pop();
      s.selected = -1;
      sketchChanged();
    });
    document.getElementById("gwSketchClear").addEventListener("click", function () {
      if (!s.items.length || !window.confirm(L("清空当前草图？", "Clear this sketch?"))) return;
      sketchPushHistory(); s.items = []; s.selected = -1; sketchChanged();
    });
    svg.addEventListener("pointerdown", function (event) {
      var point = sketchPoint(event, svg), index = Number(event.target && event.target.getAttribute && event.target.getAttribute("data-index"));
      if (!Number.isInteger(index)) index = -1;
      if (s.tool === "eraser") {
        if (index >= 0) { sketchPushHistory(); s.items.splice(index, 1); s.selected = -1; sketchChanged(); }
        return;
      }
      if (s.tool === "select") {
        s.selected = index;
        if (index >= 0) {
          sketchPushHistory();
          s.gesture = { mode: "move", index: index, x: point.x, y: point.y, original: JSON.parse(JSON.stringify(s.items[index])) };
          svg.setPointerCapture(event.pointerId);
        }
        drawSketch();
        return;
      }
      sketchPushHistory();
      var item;
      if (s.tool === "pen") item = { kind: "pen", points: [point], color: s.color, size: s.size };
      else if (s.tool === "rect") item = { kind: "rect", x: point.x, y: point.y, w: 0, h: 0, color: s.color, size: s.size };
      else if (s.tool === "arrow") item = { kind: "arrow", x1: point.x, y1: point.y, x2: point.x, y2: point.y, color: s.color, size: s.size };
      else if (s.tool === "text") item = { kind: "text", x: point.x, y: point.y, text: s.text.trim() || L("文本", "Text"), color: s.color, size: Math.max(14, s.size * 6) };
      if (!item) return;
      s.items.push(item);
      s.selected = s.items.length - 1;
      if (s.tool === "text") { sketchChanged(); return; }
      s.gesture = { mode: "draw", index: s.items.length - 1, x: point.x, y: point.y };
      svg.setPointerCapture(event.pointerId);
      drawSketch();
    });
    svg.addEventListener("pointermove", function (event) {
      if (!s.gesture) return;
      var point = sketchPoint(event, svg), item = s.items[s.gesture.index];
      if (!item) return;
      if (s.gesture.mode === "move") {
        s.items[s.gesture.index] = JSON.parse(JSON.stringify(s.gesture.original));
        moveSketchItem(s.items[s.gesture.index], point.x - s.gesture.x, point.y - s.gesture.y);
      } else if (item.kind === "pen") item.points.push(point);
      else if (item.kind === "rect") { item.w = point.x - item.x; item.h = point.y - item.y; }
      else if (item.kind === "arrow") { item.x2 = point.x; item.y2 = point.y; }
      drawSketch();
    });
    var finish = function () { if (!s.gesture) return; s.gesture = null; sketchChanged(); };
    svg.addEventListener("pointerup", finish);
    svg.addEventListener("pointercancel", finish);
    svg.addEventListener("keydown", function (event) {
      if ((event.key === "Delete" || event.key === "Backspace") && s.selected >= 0) {
        sketchPushHistory(); s.items.splice(s.selected, 1); s.selected = -1; sketchChanged();
      }
    });
  }
  function saveSketch(quiet) {
    var s = W.sketch;
    if (!s) return Promise.resolve(false);
    clearSaveTimer();
    var revision = W.revision;
    var name = ensureExt(s.name.replace(/\.sketch\.json$/i, ""), ".sketch.json", "sketch.sketch.json");
    s.name = name;
    if (W.sketch === s && W.kind === "sketch") setSaveState("saving");
    var content = JSON.stringify({ version: 1, items: (s.passthrough || []).concat(s.items) }, null, 2);
    var operation = W.saveQueue.catch(function () {}).then(async function () {
      try {
        var file = await saveTextFile(name, content, s.savedName);
        s.savedName = name; s.file = file;
        if (W.sketch === s && W.kind === "sketch") {
          if (W.revision === revision) { W.dirty = false; setSaveState("saved"); }
          else { W.dirty = true; setSaveState("dirty"); scheduleSave(); }
          var input = document.getElementById("gwName"); if (input && W.revision === revision) input.value = name;
          ensureAttachButton();
          if (!quiet) H.toast(L("草图已保存", "Sketch saved"));
        }
        return true;
      } catch (error) {
        if (W.sketch === s && W.kind === "sketch") { setSaveState("error", cleanError(error)); if (!quiet) H.toast(cleanError(error)); }
        return false;
      }
    });
    W.saveQueue = operation;
    return operation;
  }

  function uploadRowHtml(item, index) {
    var stateLabel = item.state === "done" ? L("上传完成", "Uploaded") : item.state === "error" ? item.error : item.state === "uploading" ? L("上传中 ", "Uploading ") + Math.round(item.progress) + "%" : L("等待上传", "Waiting");
    return '<div class="gw-upload-row ' + E(item.state) + '" data-upload-row="' + index + '"><span class="gw-upload-file-icon">' + ICON.file + '</span><div class="gw-upload-copy"><b>' + E(item.file.name) + '</b><small>' + E(byteLabel(item.file.size) + " · " + stateLabel) + '</small><div class="gw-upload-progress"><i style="--progress:' + Math.max(0, Math.min(100, item.progress || 0)) + '%"></i></div></div><div class="gw-upload-actions">' +
      (item.state === "error" ? '<button type="button" data-upload-retry="' + index + '" title="' + E(L("重试", "Retry")) + '">' + ICON.retry + '</button>' : "") +
      (item.state === "done" ? '<button type="button" data-upload-context="' + index + '" title="' + E(L("加入生成上下文", "Add to context")) + '">' + ICON.plus + '</button>' : "") +
      (item.state === "uploading" ? '<button type="button" data-upload-cancel="' + index + '" title="' + E(L("取消", "Cancel")) + '">×</button>' : '<button type="button" data-upload-remove="' + index + '" title="' + E(L("从队列移除", "Remove from queue")) + '">−</button>') + '</div></div>';
  }
  function renderUploadRows() {
    var list = document.getElementById("gwUploadList");
    if (!list) return;
    list.innerHTML = W.upload.items.map(uploadRowHtml).join("");
    Array.prototype.forEach.call(list.querySelectorAll("[data-upload-retry]"), function (button) { button.addEventListener("click", function () { void uploadOne(Number(button.getAttribute("data-upload-retry"))); }); });
    Array.prototype.forEach.call(list.querySelectorAll("[data-upload-cancel]"), function (button) { button.addEventListener("click", function () { var item = W.upload.items[Number(button.getAttribute("data-upload-cancel"))]; if (item && item.xhr) item.xhr.abort(); }); });
    Array.prototype.forEach.call(list.querySelectorAll("[data-upload-remove]"), function (button) { button.addEventListener("click", function () { W.upload.items.splice(Number(button.getAttribute("data-upload-remove")), 1); renderUploadRows(); }); });
    Array.prototype.forEach.call(list.querySelectorAll("[data-upload-context]"), function (button) { button.addEventListener("click", function () { var item = W.upload.items[Number(button.getAttribute("data-upload-context"))]; if (item && item.serverFile) void attachFile(item.serverFile); }); });
  }
  function renderUpload() {
    W.dirty = false; W.saveMode = "saved";
    var body = '<div class="gw-upload"><div class="gw-dropzone" id="gwDropzone"><span class="mark">' + ICON.upload + '</span><b>' + E(L("拖放文件到这里", "Drop files here")) + '</b><p>' + E(L("支持图片、PDF、Markdown、HTML、JSON、草图等项目文件；单个文件最大 20 MB。", "Images, PDF, Markdown, HTML, JSON, sketches and other project files; 20 MB per file.")) + '</p><button type="button" class="gw-btn primary" id="gwChooseFiles">' + E(L("选择文件", "Choose files")) + '</button><input class="gw-upload-input" id="gwUploadInput" type="file" multiple /></div><div class="gw-upload-list" id="gwUploadList"></div></div>';
    frame({ title: L("上传", "Upload"), subtitle: L("文件会保存到当前项目", "Files are saved to this project"), showSaveState: false }, body);
    var input = document.getElementById("gwUploadInput"), drop = document.getElementById("gwDropzone");
    document.getElementById("gwChooseFiles").addEventListener("click", function () { input.click(); });
    input.addEventListener("change", function () { queueUploads(input.files); input.value = ""; });
    ["dragenter", "dragover"].forEach(function (name) { drop.addEventListener(name, function (event) { event.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (name) { drop.addEventListener(name, function (event) { event.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function (event) { queueUploads(event.dataTransfer && event.dataTransfer.files); });
    renderUploadRows();
  }
  function queueUploads(fileList) {
    Array.prototype.forEach.call(fileList || [], function (file) {
      if (file.size > 20 * 1024 * 1024) {
        W.upload.items.push({ file: file, state: "error", progress: 0, error: L("文件超过 20 MB", "File exceeds 20 MB") });
      } else {
        W.upload.items.push({ file: file, state: "queued", progress: 0, error: "", xhr: null, serverFile: null });
      }
    });
    renderUploadRows();
    W.upload.items.forEach(function (item, index) { if (item.state === "queued") void uploadOne(index); });
  }
  function uploadOne(index) {
    var item = W.upload.items[index];
    if (!item || !W.projectId) return Promise.resolve(false);
    item.state = "uploading"; item.progress = 0; item.error = ""; renderUploadRows();
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest(); item.xhr = xhr;
      xhr.open("POST", "/api/projects/" + encodeURIComponent(W.projectId) + "/files");
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) item.progress = event.loaded / event.total * 100;
        var row = document.querySelector('[data-upload-row="' + index + '"]');
        if (row) {
          var bar = row.querySelector(".gw-upload-progress i"); if (bar) bar.style.setProperty("--progress", item.progress + "%");
          var small = row.querySelector("small"); if (small) small.textContent = byteLabel(item.file.size) + " · " + L("上传中 ", "Uploading ") + Math.round(item.progress) + "%";
        }
      };
      xhr.onload = async function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { var data = JSON.parse(xhr.responseText || "{}"); item.serverFile = data.file || { name: item.file.name, size: item.file.size, mime: item.file.type }; item.state = "done"; item.progress = 100; await loadFiles(); resolve(true); }
          catch (error) { item.state = "error"; item.error = cleanError(error); resolve(false); }
        } else {
          var message = "HTTP " + xhr.status;
          try { var parsed = JSON.parse(xhr.responseText || "{}"); message = parsed.error && parsed.error.message || parsed.message || parsed.error || message; } catch (error) {}
          item.state = "error"; item.error = String(message).slice(0, 180); resolve(false);
        }
        item.xhr = null; renderUploadRows();
      };
      xhr.onerror = function () { item.state = "error"; item.error = L("网络连接失败", "Network connection failed"); item.xhr = null; renderUploadRows(); resolve(false); };
      xhr.onabort = function () { item.state = "error"; item.error = L("已取消", "Cancelled"); item.xhr = null; renderUploadRows(); resolve(false); };
      var form = new FormData(); form.append("file", item.file, item.file.name); form.append("name", item.file.name); xhr.send(form);
    });
  }

  function normalizeUrl(value) {
    var raw = String(value || "").trim();
    if (!raw) return "about:blank";
    if (/^about:blank$/i.test(raw)) return "about:blank";
    if (!/^[a-z][a-z0-9+.-]*:/i.test(raw)) raw = "https://" + raw;
    try { var parsed = new URL(raw); return /^(https?:|about:)$/.test(parsed.protocol) ? parsed.toString() : "about:blank"; } catch (error) { return "about:blank"; }
  }
  async function createBrowserSession() {
    if (!W.browser || W.browser.sessionPending) return;
    var browser = W.browser, projectId = W.projectId;
    browser.sessionPending = true; updateBrowserStatus("pending", L("正在启动 Daemon 浏览器会话…", "Starting daemon browser session…"));
    try {
      var result = await H.apiSend("/api/projects/" + encodeURIComponent(projectId) + "/browser-sessions", "POST", {});
      var sessionId = result && result.browserSession && result.browserSession.id || "";
      if (W.browser !== browser || W.kind !== "browser" || W.projectId !== projectId) {
        if (sessionId) void H.apiRequest("/api/projects/" + encodeURIComponent(projectId) + "/browser-sessions/" + encodeURIComponent(sessionId), { method: "DELETE", keepalive: true }).catch(function () {});
        return;
      }
      browser.sessionId = sessionId;
      browser.sessionPending = false;
      updateBrowserStatus("ready", browser.sessionId ? L("Daemon 浏览器会话已就绪", "Daemon browser session is ready") : L("内嵌浏览器已就绪", "Embedded browser is ready"));
    } catch (error) {
      if (W.browser !== browser || W.kind !== "browser") return;
      browser.sessionPending = false;
      browser.sessionError = cleanError(error);
      updateBrowserStatus("warn", L("系统浏览器不可用，仍可使用内嵌预览：", "System browser unavailable; embedded preview remains available: ") + browser.sessionError);
    }
  }
  function updateBrowserStatus(mode, text) {
    var info = document.getElementById("gwBrowserInfo");
    if (!info) return;
    var dot = info.querySelector(".dot"), span = info.querySelector("span");
    dot.className = "dot " + (mode || ""); span.textContent = text || "";
  }
  function renderBrowser() {
    var b = W.browser;
    var body = '<div class="gw-browser"><div class="gw-browser-bar"><button type="button" class="gw-browser-nav" id="gwBrowserBack" title="' + E(L("后退", "Back")) + '">←</button><button type="button" class="gw-browser-nav" id="gwBrowserForward" title="' + E(L("前进", "Forward")) + '">→</button><button type="button" class="gw-browser-nav" id="gwBrowserReload" title="' + E(L("刷新", "Reload")) + '">↻</button><input class="gw-browser-address" id="gwBrowserAddress" value="' + E(b.address) + '" placeholder="https://example.com"/><button type="button" class="gw-browser-nav" id="gwBrowserGo" title="' + E(L("访问", "Go")) + '">↵</button><div class="gw-browser-viewport"><button type="button" data-browser-viewport="desktop" class="' + (b.viewport === "desktop" ? "on" : "") + '">▰</button><button type="button" data-browser-viewport="tablet" class="' + (b.viewport === "tablet" ? "on" : "") + '">▯</button><button type="button" data-browser-viewport="mobile" class="' + (b.viewport === "mobile" ? "on" : "") + '">▯</button></div><button type="button" class="gw-browser-nav" id="gwBrowserExternal" title="' + E(L("新窗口打开", "Open externally")) + '">↗</button></div><div class="gw-browser-stage"><div class="gw-browser-frame-wrap ' + E(b.viewport) + '" id="gwBrowserFrameWrap"><iframe class="gw-browser-frame" id="gwBrowserFrame" title="Browser preview" sandbox="allow-scripts allow-forms allow-popups allow-downloads" referrerpolicy="no-referrer" src="' + E(b.url) + '"></iframe></div></div><div class="gw-browser-info" id="gwBrowserInfo"><i class="dot"></i><span>' + E(L("部分网站会禁止内嵌；此时请使用新窗口打开并保存网页参考。", "Some sites block embedding; open them externally and save the reference.")) + '</span></div></div>';
    var footer = '<footer class="gw-foot"><span class="gw-foot-note">' + E(L("保存网页参考会记录 URL、时间和项目关系，不会伪造不可读取的页面内容。", "Saving a web reference records its URL, time and project relation; blocked page content is never invented.")) + '</span><div class="gw-foot-actions"><button type="button" class="gw-btn" id="gwBrowserSave">' + ICON.save + E(L("保存网页参考", "Save web reference")) + '</button><button type="button" class="gw-btn lime" id="gwBrowserAttach"' + (b.referenceFile ? "" : " disabled") + '>' + ICON.link + E(L("加入生成上下文", "Add to context")) + '</button></div></footer>';
    frame({ title: L("新建浏览器", "New browser"), subtitle: L("项目参考与设计调研", "Project references and design research"), showSaveState: false, footer: footer }, body);
    bindBrowser();
  }
  async function openBrowser(options) {
    var file = options && options.file, content = "", url = "about:blank";
    if (file) {
      try {
        content = await readTextFile(file.name);
        var match = /^- URL:\s*(\S+)/m.exec(content);
        if (match) url = normalizeUrl(match[1]);
      } catch (error) { H.toast(cleanError(error)); }
    }
    W.browser = { url: url, address: url === "about:blank" ? "" : url, history: [url], index: 0, viewport: "desktop", sessionId: "", sessionPending: false, sessionError: "", referenceFile: file || null, referenceContent: content };
    renderBrowser();
    void createBrowserSession();
  }
  function browserNavigate(value, fromHistory) {
    var b = W.browser, url = normalizeUrl(value); b.url = url; b.address = url === "about:blank" ? "" : url;
    if (!fromHistory) { b.history = b.history.slice(0, b.index + 1); b.history.push(url); b.index = b.history.length - 1; }
    var frameNode = document.getElementById("gwBrowserFrame"), address = document.getElementById("gwBrowserAddress");
    if (frameNode) frameNode.src = url; if (address) address.value = b.address;
    updateBrowserStatus("pending", L("正在加载 ", "Loading ") + b.address);
    var back = document.getElementById("gwBrowserBack"), forward = document.getElementById("gwBrowserForward");
    if (back) back.disabled = b.index <= 0; if (forward) forward.disabled = b.index >= b.history.length - 1;
  }
  function bindBrowser() {
    var b = W.browser, address = document.getElementById("gwBrowserAddress"), frameNode = document.getElementById("gwBrowserFrame");
    document.getElementById("gwBrowserGo").addEventListener("click", function () { browserNavigate(address.value); });
    address.addEventListener("keydown", function (event) { if (event.key === "Enter") browserNavigate(address.value); });
    document.getElementById("gwBrowserReload").addEventListener("click", function () { frameNode.src = b.url; });
    document.getElementById("gwBrowserExternal").addEventListener("click", function () { if (b.url !== "about:blank") window.open(b.url, "_blank", "noopener,noreferrer"); });
    document.getElementById("gwBrowserBack").disabled = b.index <= 0;
    document.getElementById("gwBrowserForward").disabled = b.index >= b.history.length - 1;
    document.getElementById("gwBrowserBack").addEventListener("click", function () { if (b.index > 0) { b.index--; browserNavigate(b.history[b.index], true); } });
    document.getElementById("gwBrowserForward").addEventListener("click", function () { if (b.index < b.history.length - 1) { b.index++; browserNavigate(b.history[b.index], true); } });
    frameNode.addEventListener("load", function () { updateBrowserStatus(b.sessionId ? "ready" : "", L("页面已加载；如显示空白，网站可能禁止内嵌。", "Page loaded; a blank frame may mean the site blocks embedding.")); });
    Array.prototype.forEach.call(W.root.querySelectorAll("[data-browser-viewport]"), function (button) { button.addEventListener("click", function () { b.viewport = button.getAttribute("data-browser-viewport"); W.root.querySelectorAll("[data-browser-viewport]").forEach(function (item) { item.classList.toggle("on", item === button); }); document.getElementById("gwBrowserFrameWrap").className = "gw-browser-frame-wrap " + b.viewport; }); });
    document.getElementById("gwBrowserSave").addEventListener("click", function () { void saveBrowserReference(); });
    document.getElementById("gwBrowserAttach").addEventListener("click", function () { if (b.referenceFile) addContext({ id: "file:" + b.referenceFile.name, name: b.referenceFile.name, type: "browser", content: b.referenceContent || "", url: b.url }); });
  }
  async function saveBrowserReference() {
    var b = W.browser;
    if (!b || b.url === "about:blank") { H.toast(L("请先访问一个网页", "Visit a page first")); return; }
    var host = "web-reference";
    try { host = new URL(b.url).hostname.replace(/^www\./, "") || host; } catch (error) {}
    var name = ensureExt(host + "-" + nowStamp(), ".browser.md", "web-reference.browser.md");
    var content = "# Web reference\n\n- URL: " + b.url + "\n- Captured at: " + new Date().toISOString() + "\n- Project: " + W.projectName + "\n\n> The page URL is recorded as a reference. Cross-origin page content was not read or invented.\n";
    try {
      b.referenceFile = await saveTextFile(name, content, ""); b.referenceContent = content; renderBrowser();
      updateBrowserStatus("ready", L("网页参考已保存到项目", "Web reference saved to the project"));
      H.toast(L("网页参考已保存", "Web reference saved"));
    } catch (error) { H.toast(cleanError(error)); }
  }
  async function closeBrowserSession() {
    var b = W.browser;
    if (!b || !b.sessionId || !W.projectId) return;
    var id = b.sessionId; b.sessionId = "";
    try { await H.apiRequest("/api/projects/" + encodeURIComponent(W.projectId) + "/browser-sessions/" + encodeURIComponent(id), { method: "DELETE" }); } catch (error) {}
  }

  function defaultDesignSystem() {
    return { step: 0, source: "project", title: W.projectName ? W.projectName + " Design System" : "New Design System", submitting: false, summary: L("为当前项目建立一致、可复用的视觉语言。", "A consistent, reusable visual language for this project."), category: "product", surface: "web", primary: "#263b2d", secondary: "#79c45b", neutral: "#f4f5f1", font: "Inter, system-ui, sans-serif", radius: 12, spacing: 8, job: null, jobError: "", referenceFile: null };
  }
  function dsStepLabels() { return [L("选择来源", "Choose source"), L("基础信息", "Basics"), L("设计 Token", "Design tokens"), L("生成与检查", "Generate & review")]; }
  function dsStepsHtml() {
    return dsStepLabels().map(function (label, index) { return '<div class="gw-ds-step ' + (index === W.designSystem.step ? "on" : index < W.designSystem.step ? "done" : "") + '"><i>' + (index < W.designSystem.step ? "✓" : index + 1) + '</i><span>' + E(label) + '</span></div>'; }).join("");
  }
  function dsSourceBody() {
    var sources = [
      ["blank", L("空白创建", "Start blank"), L("从基础 Token 和品牌信息开始。", "Start from foundational tokens and brand details.")],
      ["project", L("基于当前项目", "From current project"), L("把当前项目文件和参考作为设计证据。", "Use current project files and references as design evidence.")],
      ["assets", L("基于已上传素材", "From uploaded assets"), L("使用项目中的图片、字体和文档。", "Use images, fonts and documents in this project.")],
      ["website", L("基于网页参考", "From web reference"), L("使用已保存的网页参考和来源 URL。", "Use saved web references and source URLs.")]
    ];
    return '<h2>' + E(L("从哪里开始？", "Where should it start?")) + '</h2><p>' + E(L("选择设计体系的证据来源，后续仍可继续补充。", "Choose the evidence source; you can add more later.")) + '</p><div class="gw-ds-source-grid">' + sources.map(function (source) { return '<button type="button" class="gw-ds-source ' + (W.designSystem.source === source[0] ? "on" : "") + '" data-ds-source="' + source[0] + '"><b>' + E(source[1]) + '</b><span>' + E(source[2]) + '</span></button>'; }).join("") + '</div>';
  }
  function dsBasicsBody() {
    var d = W.designSystem;
    return '<h2>' + E(L("定义设计体系", "Define the design system")) + '</h2><p>' + E(L("这些信息会写入设计体系说明和预览文件。", "These details are written into its specification and previews.")) + '</p><div class="gw-form-grid"><div class="gw-field full"><label>' + E(L("名称", "Name")) + '</label><input id="gwDsTitle" value="' + E(d.title) + '"/></div><div class="gw-field full"><label>' + E(L("简介", "Summary")) + '</label><textarea id="gwDsSummary">' + E(d.summary) + '</textarea></div><div class="gw-field"><label>' + E(L("类型", "Category")) + '</label><select id="gwDsCategory"><option value="product">Product</option><option value="brand">Brand</option><option value="marketing">Marketing</option><option value="editorial">Editorial</option></select></div><div class="gw-field"><label>' + E(L("主要载体", "Primary surface")) + '</label><select id="gwDsSurface"><option value="web">Web</option><option value="image">Image</option><option value="video">Video</option></select></div></div>';
  }
  function dsTokensBody() {
    var d = W.designSystem;
    return '<h2>' + E(L("设定基础 Token", "Set foundational tokens")) + '</h2><p>' + E(L("右侧预览会使用这些值生成基础组件规范。", "These values drive the generated component foundation.")) + '</p><div class="gw-token-grid"><section class="gw-token-card"><h3>' + E(L("颜色", "Colors")) + '</h3>' +
      colorRow("primary", L("主色", "Primary"), d.primary) + colorRow("secondary", L("辅助色", "Secondary"), d.secondary) + colorRow("neutral", L("中性色", "Neutral"), d.neutral) + '</section><section class="gw-token-card"><h3>' + E(L("排版与形状", "Type and shape")) + '</h3><div class="gw-field"><label>' + E(L("字体栈", "Font stack")) + '</label><input id="gwDsFont" value="' + E(d.font) + '"/></div><div class="gw-field" style="margin-top:10px"><label>' + E(L("圆角：", "Radius: ")) + E(d.radius) + 'px</label><input id="gwDsRadius" type="range" min="0" max="28" value="' + E(d.radius) + '"/></div><div class="gw-field" style="margin-top:10px"><label>' + E(L("间距基数：", "Spacing base: ")) + E(d.spacing) + 'px</label><input id="gwDsSpacing" type="range" min="4" max="16" value="' + E(d.spacing) + '"/></div></section></div>';
  }
  function colorRow(id, label, value) { return '<div class="gw-color-row"><input type="color" data-ds-color="' + id + '" value="' + E(value) + '" title="' + E(label) + '"/><input type="text" data-ds-color-text="' + id + '" value="' + E(value) + '" aria-label="' + E(label) + '"/></div>'; }
  function dsBodyMarkdown() {
    var d = W.designSystem;
    return "# " + d.title + "\n\n" + d.summary + "\n\n## Foundations\n\n### Colors\n\n- Primary: `" + d.primary + "`\n- Secondary: `" + d.secondary + "`\n- Neutral: `" + d.neutral + "`\n\n### Typography\n\n- Font family: `" + d.font + "`\n\n### Shape and spacing\n\n- Radius: `" + d.radius + "px`\n- Spacing base: `" + d.spacing + "px`\n\n## Components\n\nButtons, inputs, cards, navigation and feedback states should use the foundations above consistently.\n";
  }
  function dsReviewBody() {
    var d = W.designSystem;
    return '<h2>' + E(L("生成并检查", "Generate and review")) + '</h2><p>' + E(L("将创建真实设计体系任务，并显示服务端返回的每个步骤。", "A real server-side generation job will be created and every reported step shown.")) + '</p><div class="gw-ds-review"><div class="gw-ds-preview" style="--ds-primary:' + E(d.primary) + ';--ds-secondary:' + E(d.secondary) + ';--ds-radius:' + E(d.radius) + 'px;font-family:' + E(safeCssFont(d.font)) + '"><div class="gw-ds-preview-hero"><small>DESIGN SYSTEM</small><h3>' + E(d.title) + '</h3><p>' + E(d.summary) + '</p></div><div class="gw-ds-preview-components"><button>Primary action</button><span>Input field</span><span>Card surface</span></div></div><aside class="gw-ds-summary"><b>' + E(L("创建摘要", "Creation summary")) + '</b><dl><dt>' + E(L("来源", "Source")) + '</dt><dd>' + E(d.source) + '</dd><dt>' + E(L("类型", "Category")) + '</dt><dd>' + E(d.category) + '</dd><dt>' + E(L("载体", "Surface")) + '</dt><dd>' + E(d.surface) + '</dd><dt>' + E(L("文件", "Files")) + '</dt><dd>' + E(String(W.files.length)) + '</dd></dl></aside></div><div id="gwDsJob"></div>';
  }
  function renderDesignSystem() {
    var d = W.designSystem, bodyContent = d.step === 0 ? dsSourceBody() : d.step === 1 ? dsBasicsBody() : d.step === 2 ? dsTokensBody() : dsReviewBody();
    var prev = d.step > 0 && !d.job ? '<button type="button" class="gw-btn" id="gwDsPrev">' + E(L("上一步", "Back")) + '</button>' : "";
    var next = d.step < 3 ? '<button type="button" class="gw-btn primary" id="gwDsNext">' + E(L("下一步", "Continue")) + '</button>' : !d.job ? '<button type="button" class="gw-btn lime" id="gwDsCreate"' + (d.submitting ? " disabled" : "") + '>' + E(d.submitting ? L("正在提交…", "Submitting…") : L("创建设计体系", "Create design system")) + '</button>' : "";
    var footer = '<footer class="gw-foot"><span class="gw-foot-note">' + E(L("设计体系会保存在 Daemon，并可在“设计体系”页面继续编辑。", "The design system is stored by the daemon and remains editable in Design Systems.")) + '</span><div class="gw-foot-actions">' + prev + next + '</div></footer>';
    frame({ title: L("新建设计体系", "New design system"), subtitle: L("项目证据 → Token → 组件规范", "Project evidence → tokens → component guidance"), attachable: Boolean(d.referenceFile), showSaveState: false, footer: footer }, '<div class="gw-ds"><aside class="gw-ds-steps">' + dsStepsHtml() + '</aside><main class="gw-ds-main">' + bodyContent + '</main></div>');
    bindDesignSystem();
    renderDesignSystemJob();
  }
  function bindDesignSystem() {
    var d = W.designSystem;
    Array.prototype.forEach.call(W.root.querySelectorAll("[data-ds-source]"), function (button) { button.addEventListener("click", function () { d.source = button.getAttribute("data-ds-source"); renderDesignSystem(); }); });
    var title = document.getElementById("gwDsTitle"), summary = document.getElementById("gwDsSummary"), category = document.getElementById("gwDsCategory"), surface = document.getElementById("gwDsSurface");
    if (title) title.addEventListener("input", function () { d.title = title.value; });
    if (summary) summary.addEventListener("input", function () { d.summary = summary.value; });
    if (category) { category.value = d.category; category.addEventListener("change", function () { d.category = category.value; }); }
    if (surface) { surface.value = d.surface; surface.addEventListener("change", function () { d.surface = surface.value; }); }
    Array.prototype.forEach.call(W.root.querySelectorAll("[data-ds-color]"), function (input) { input.addEventListener("input", function () { var key = input.getAttribute("data-ds-color"); d[key] = input.value; var text = W.root.querySelector('[data-ds-color-text="' + key + '"]'); if (text) text.value = input.value; }); });
    Array.prototype.forEach.call(W.root.querySelectorAll("[data-ds-color-text]"), function (input) { input.addEventListener("change", function () { var key = input.getAttribute("data-ds-color-text"); if (/^#[0-9a-f]{6}$/i.test(input.value)) d[key] = input.value; }); });
    var font = document.getElementById("gwDsFont"), radius = document.getElementById("gwDsRadius"), spacing = document.getElementById("gwDsSpacing");
    if (font) font.addEventListener("input", function () { d.font = font.value; });
    if (radius) radius.addEventListener("input", function () { d.radius = Number(radius.value); });
    if (spacing) spacing.addEventListener("input", function () { d.spacing = Number(spacing.value); });
    var prev = document.getElementById("gwDsPrev"), next = document.getElementById("gwDsNext"), create = document.getElementById("gwDsCreate");
    if (prev) prev.addEventListener("click", function () { d.step--; renderDesignSystem(); });
    if (next) next.addEventListener("click", function () { if (d.step === 1 && !d.title.trim()) { H.toast(L("请输入名称", "Enter a name")); return; } d.step++; renderDesignSystem(); });
    if (create) create.addEventListener("click", function () { void startDesignSystemJob(); });
  }
  async function startDesignSystemJob() {
    var d = W.designSystem;
    if (!d || d.submitting || d.job && !/^(failed|succeeded)$/.test(d.job.status)) return;
    d.submitting = true;
    renderDesignSystem();
    var assetFiles = d.source === "blank" ? [] : W.files.map(function (file) { return file.name; }).slice(0, 80);
    var webUrls = W.contexts.filter(function (item) { return item.type === "browser" && item.url; }).map(function (item) { return item.url; });
    var sourceNotes = d.source === "project" ? "Created from project " + W.projectName + " (" + W.projectId + ") with " + W.files.length + " project files." : "Source mode: " + d.source + ".";
    try {
      d.jobError = "";
      var result = await H.apiSend("/api/design-systems/generation-jobs", "POST", {
        title: d.title.trim(), summary: d.summary.trim(), category: d.category, surface: d.surface,
        status: "draft", artifactMode: "generated", body: dsBodyMarkdown(), sourceNotes: sourceNotes,
        provenance: { assetFiles: assetFiles, sourceUrls: webUrls, notes: sourceNotes }
      });
      if (!result || !result.job) throw new Error(L("服务端未返回设计体系任务", "The server did not return a design-system job"));
      d.job = result.job;
      d.submitting = false;
      renderDesignSystem();
      if (d.job && d.job.id) pollDesignSystemJob(d.job.id);
    } catch (error) { d.submitting = false; d.jobError = cleanError(error); renderDesignSystem(); H.toast(d.jobError); }
  }
  function renderDesignSystemJob() {
    var target = document.getElementById("gwDsJob"), d = W.designSystem;
    if (!target || !d) return;
    if (d.jobError) {
      target.innerHTML = '<div class="gw-banner error">' + E(d.jobError) + '</div>' + (d.job && d.job.id ? '<div style="margin-top:10px"><button type="button" class="gw-btn" id="gwDsResume">' + ICON.retry + E(L("恢复进度", "Resume progress")) + '</button></div>' : "");
      var resume = document.getElementById("gwDsResume");
      if (resume) resume.addEventListener("click", function () { d.jobError = ""; renderDesignSystemJob(); pollDesignSystemJob(d.job.id); });
      return;
    }
    if (d.submitting) { target.innerHTML = '<div class="gw-banner">' + E(L("正在向服务端创建设计体系任务…", "Creating the design-system job on the server…")) + '</div>'; return; }
    if (!d.job) { target.innerHTML = ""; return; }
    var job = d.job;
    target.innerHTML = '<div class="gw-job"><div class="gw-job-head"><b>' + E(job.status === "succeeded" ? L("设计体系已创建", "Design system created") : job.status === "failed" ? L("创建失败", "Creation failed") : L("正在创建设计体系", "Creating design system")) + '</b><span>' + Math.max(0, Math.min(100, Number(job.progress) || 0)) + '%</span></div><div class="gw-job-progress"><i style="width:' + Math.max(0, Math.min(100, Number(job.progress) || 0)) + '%"></i></div><div class="gw-job-steps">' + (job.steps || []).map(function (step) { return '<div class="gw-job-step ' + E(step.status) + '"><i></i><span><b>' + E(step.title) + '</b>' + (step.message ? " · " + E(step.message) : "") + '</span></div>'; }).join("") + '</div>' + (job.error ? '<div class="gw-banner error">' + E(job.error) + '</div>' : "") + (job.status === "succeeded" ? '<div class="gw-banner success">' + E(L("已生成 Token、预览和规范文件，可前往设计体系页面继续编辑。", "Tokens, previews and guidance files are ready for continued editing.")) + '</div><div style="margin-top:10px"><button type="button" class="gw-btn" id="gwDsOpen">' + E(L("打开设计体系", "Open design system")) + '</button></div>' : "") + (job.status === "failed" ? '<div style="margin-top:10px"><button type="button" class="gw-btn danger" id="gwDsRetry">' + ICON.retry + E(L("重新创建", "Try again")) + '</button></div>' : "") + '</div>';
    var retry = document.getElementById("gwDsRetry");
    if (retry) retry.addEventListener("click", function () { d.job = null; d.jobError = ""; void startDesignSystemJob(); });
    var openSystem = document.getElementById("gwDsOpen");
    if (openSystem) openSystem.addEventListener("click", async function () { await close(true); H.go("systems"); if (H.loadSystems) H.loadSystems(); });
  }
  function pollDesignSystemJob(id) {
    clearTimeout(W.pollTimer);
    W.pollTimer = setTimeout(async function () {
      try {
        var result = await H.apiGet("/api/design-systems/generation-jobs/" + encodeURIComponent(id));
        if (!W.designSystem || !result || !result.job) return;
        W.designSystem.job = result.job; renderDesignSystemJob();
        if (result.job.status === "succeeded") { await finishDesignSystem(result.job); return; }
        if (result.job.status === "failed") return;
        pollDesignSystemJob(id);
      } catch (error) { if (W.designSystem) { W.designSystem.jobError = cleanError(error); renderDesignSystemJob(); } }
    }, 550);
  }
  async function finishDesignSystem(job) {
    var d = W.designSystem;
    if (!d || d.referenceFile || !job.designSystemId) return;
    var name = ensureExt(safeBaseName(d.title, "design-system"), ".design-system.json", "design-system.design-system.json");
    var content = JSON.stringify({ type: "open-design-system-reference", designSystemId: job.designSystemId, title: d.title, summary: d.summary, tokens: { colors: { primary: d.primary, secondary: d.secondary, neutral: d.neutral }, typography: { fontFamily: d.font }, radius: d.radius, spacing: d.spacing }, createdAt: new Date().toISOString() }, null, 2);
    try {
      d.referenceFile = await saveTextFile(name, content, ""); d.referenceContent = content; if (H.loadSystems) H.loadSystems();
      if (W.designSystem === d && W.kind === "design-system") renderDesignSystem();
    }
    catch (error) { if (W.designSystem === d) { d.jobError = cleanError(error); renderDesignSystemJob(); } }
  }

  async function saveCurrent(quiet) {
    if (W.kind === "document") return saveDocument(quiet);
    if (W.kind === "sketch") return saveSketch(quiet);
    return true;
  }
  async function attachCurrent() {
    if (W.kind === "document" && W.document) {
      if (W.dirty || !W.document.savedName) { if (!await saveDocument(false)) return; }
      addContext({ id: "file:" + W.document.savedName, name: W.document.savedName, type: fileType(W.document.savedName), content: W.document.content });
    } else if (W.kind === "sketch" && W.sketch) {
      if (W.dirty || !W.sketch.savedName) { if (!await saveSketch(false)) return; }
      addContext({ id: "file:" + W.sketch.savedName, name: W.sketch.savedName, type: "sketch", content: JSON.stringify({ version: 1, items: (W.sketch.passthrough || []).concat(W.sketch.items) }).slice(0, 9000) });
    } else if (W.kind === "browser" && W.browser && W.browser.referenceFile) {
      addContext({ id: "file:" + W.browser.referenceFile.name, name: W.browser.referenceFile.name, type: "browser", content: W.browser.referenceContent || "", url: W.browser.url });
    } else if (W.kind === "design-system" && W.designSystem && W.designSystem.referenceFile) {
      addContext({ id: "file:" + W.designSystem.referenceFile.name, name: W.designSystem.referenceFile.name, type: "design-system", content: W.designSystem.referenceContent || "" });
    }
  }

  async function close(force) {
    if (!W.kind) return true;
    clearSaveTimer();
    if (!force && W.dirty && (W.kind === "document" || W.kind === "sketch")) {
      var saved = await saveCurrent(true);
      if (!saved && !window.confirm(L("保存失败，仍要关闭吗？", "Saving failed. Close anyway?"))) return false;
    }
    clearSaveTimer();
    if (W.kind === "browser") { await closeBrowserSession(); W.browser = null; }
    if (W.kind === "design-system") W.designSystem = null;
    clearTimeout(W.pollTimer); W.pollTimer = null;
    W.kind = null; W.dirty = false; W.root.hidden = true; W.root.innerHTML = "";
    if (H.renderGenFiles) H.renderGenFiles();
    return true;
  }
  async function open(kind, options) {
    if (W.opening) return;
    if (!W.projectId) { H.toast(L("请先打开一个项目", "Open a project first")); return; }
    W.opening = true;
    try {
      if (W.kind && !await close(false)) return;
      W.kind = kind; W.saveMode = "saved"; W.saveText = ""; W.dirty = false; W.revision = 0; W.saveQueue = Promise.resolve();
      if (kind === "document") await openDocument(options || {});
      else if (kind === "sketch") await openSketch(options || {});
      else if (kind === "upload") renderUpload();
      else if (kind === "browser") await openBrowser(options || {});
      else if (kind === "design-system") { W.designSystem = defaultDesignSystem(); renderDesignSystem(); }
    } finally { W.opening = false; }
  }
  async function beforeProjectChange() {
    if (!await close(false)) return false;
    W.upload.items.forEach(function (item) { if (item && item.xhr) item.xhr.abort(); });
    W.upload = { items: [] };
    W.projectId = null; W.projectName = ""; W.files = []; W.contexts = []; W.filesRequest++;
    return true;
  }
  function onProjectOpen(projectId, projectName) {
    W.projectId = projectId; W.projectName = projectName || ""; W.files = []; W.filesLoading = true; W.upload = { items: [] }; restoreContexts(); renderContext(); void loadFiles();
  }
  function onLanguageChange() {
    renderContext();
    if (H.renderGenActions) H.renderGenActions();
    if (H.renderGenFiles) H.renderGenFiles();
    if (!W.kind) return;
    if (W.kind === "document") renderDocument();
    else if (W.kind === "sketch") renderSketch();
    else if (W.kind === "upload") renderUpload();
    else if (W.kind === "browser") renderBrowser();
    else if (W.kind === "design-system") renderDesignSystem();
  }

  window.StudioWorkbench = {
    open: open,
    close: close,
    beforeProjectChange: beforeProjectChange,
    onProjectOpen: onProjectOpen,
    onLanguageChange: onLanguageChange,
    renderContext: renderContext,
    renderProjectFiles: renderProjectFiles,
    promptWithContext: promptWithContext,
    reloadFiles: loadFiles
  };

  var initial = state().gen;
  if (initial && initial.pid) onProjectOpen(initial.pid, initial.name);
})();
