---
name: spreadsheet-problem-solver
zh_name: "表格问题处理"
en_name: "Spreadsheet Problem Solver"
description: "Solves real spreadsheet problems with conservative data cleaning, formula diagnostics, cross-table reconciliation, anomaly review, and evidence-backed reporting."
zh_description: "处理真实办公表格问题：安全清理数据、诊断公式、核对多表、识别异常并输出可追溯结果。"
triggers:
  - "表格问题"
  - "检查这份表格"
  - "修复表格"
  - "表格数据有问题"
  - "清理表格"
  - "公式报错"
  - "公式漏填"
  - "核对两份表"
  - "数据对不上"
  - "对账"
  - "查找异常数据"
  - "Excel error"
  - "spreadsheet problem"
  - "clean this spreadsheet"
  - "spreadsheet formula error"
  - "reconcile spreadsheets"
od:
  mode: prototype
  category: office-productivity
  scenario: spreadsheet
  surface: web
  preview:
    type: markdown
  design_system:
    requires: false
  capabilities_required:
    - file_write
  example_prompt: "检查这份销售表的重复记录、格式问题、公式和异常金额；修复能确定的问题，保留原文件，并给我一份修改记录。"
  example_prompt_i18n:
    zh-CN: "检查这份销售表的重复记录、格式问题、公式和异常金额；修复能确定的问题，保留原文件，并给我一份修改记录。"
---

# 表格问题处理

这是办公表格任务的统一入口，不是一个只提供建议的聊天技能。先识别用户遇到的实际问题，再调用本技能随附的可执行脚本或其他可用工具。必须交付问题位置、执行结果、验证证据和未解决事项。不能因为某个脚本或连接器不可用，就假称任务已完成。

## 统一工作流程

1. **确认文件与目标。** 只处理用户指明或明确上传的文件。检查文件类型、工作表、表头、数据范围、公式和隐藏工作表；关键匹配字段或修复规则不明确时，先问一个必要问题。
2. **分流任务。**
   - 数据清理：使用本技能随附的 clean_spreadsheet.py，处理 CSV、XLSX、XLSM 的安全文本清理、空行检测和完全重复行检测。
   - 公式诊断：使用本技能随附的 diagnose_formulas.py，定位 Excel 错误值、#REF! 断裂引用和能被上下公式共同推导的单格缺失公式。
   - 多表核对：优先使用本技能随附的 reconcile_spreadsheets.py。先确认能唯一标识一条记录的关键字段（可为多个字段组合），再分别输出只在表 A、只在表 B、重复键和字段差异。重复键会被隔离，不能任意配对；总金额相等不代表每条记录都一致。若用户无法提供可靠匹配键，先询问，不要凭模糊字段猜配对。
   - 异常检测：将异常候选与已确认错误分开，说明规则和单元格位置。极端值不等于错误；不擅自删除或覆盖。
   - 分析报告：所有指标和结论必须能追溯到源数据与计算过程，不得编造原因。
3. **保护源数据。** 默认不覆盖输入文件。清理脚本只会输出独立副本；公式脚本默认只诊断，只有用户明确要求修复时才写入副本。删除行、去重、覆盖字段或修改业务值必须在用户授权范围内。
4. **复检实际产物。** 重新打开输出文件，检查工作表和关键字段。清理脚本会验证 CSV 往返读取或 Excel 工作表名及公式数量；公式脚本还会核对修复后的公式文本。公式字符串保存成功不代表它已被计算。
5. **准确交付。** 输出文件（如有）、JSON 审计报告、实际变更、验证通过的项目和仍需人工判断的项目。若只执行只读诊断，就明确说“已检查，未修改”。

## A. 数据清理与修复

### 查找脚本

    CLEANER=$(find .od-skills -type f -path '*/scripts/clean_spreadsheet.py' -print -quit)
    if [ -n "$CLEANER" ]; then
      python3 "$CLEANER" --help
    else
      echo "未找到随附清理脚本；检查当前激活技能的实际安装路径。" >&2
    fi

不要在脚本路径为空时继续执行，也不要声称脚本已经运行。输入支持 CSV、XLSX、XLSM；旧版 XLS 必须先另存为 XLSX。Excel 支持需要当前 Python 环境具备 openpyxl；CSV 清理不依赖第三方包。

### 默认先预检

    python3 "$CLEANER" "销售表.csv" --dry-run --report "销售表_预检.json"

预检会生成 JSON 计划报告，不写入清理后的文件。查看 summary、findings、changes 和 warnings，再决定是否执行已获授权的更改。

### 执行清理

    python3 "$CLEANER" "销售表.csv" --report "销售表_清理报告.json"

默认仅规范文本首尾空白，并检测空白行与完全重复行，不删除行。只有用户明确要求删除空行或完全重复行时，CSV 才使用对应参数，例如：

    python3 "$CLEANER" "销售表.csv" --drop-empty-rows --dedupe --report "销售表_清理报告.json"

对 XLSX/XLSM 可通过重复的 --sheet "工作表名" 选择工作表。脚本不会物理删除或移动 Excel 行号；显式开启去重时，只清空无公式的完全重复行的单元格值，含公式的重复行会保留供检查。不能将完全重复整行等同于重复订单号；业务键去重前必须确认规则。

公式样式文本（CSV 中以 =、+、-、@ 开头的文本）会写入报告供复核，不会被擅自改写为其他业务值。不要自动把文本数字转换成数字、填充缺失值或规范日期，因为这可能破坏前导零、货币或业务含义。

## B. 公式诊断与安全修复

### 查找脚本

    DIAGNOSTIC=$(find .od-skills -type f -path '*/scripts/diagnose_formulas.py' -print -quit)
    if [ -n "$DIAGNOSTIC" ]; then
      python3 "$DIAGNOSTIC" --help
    else
      echo "未找到随附公式诊断脚本；检查当前激活技能的实际安装路径。" >&2
    fi

该脚本只支持 XLSX/XLSM，并需要 openpyxl。

### 默认只诊断，不写工作簿

    python3 "$DIAGNOSTIC" "销售表.xlsx" --report "销售表_公式诊断.json"

报告中的问题分为错误值、#REF! 断裂引用和安全公式缺失候选。断裂引用无法推导出原来引用的单元格，只能人工审核。

### 仅在用户要求修复时应用安全修复

    python3 "$DIAGNOSTIC" "销售表.xlsx" --apply-safe-repairs

脚本只考虑一个空白单元格且上下相邻单元格都包含公式的情况；将两侧公式分别转换到目标单元格后，公式文本必须完全一致，才会写入新的修订副本。含批注、超链接、合并单元格、非空值或公式转换失败的目标格不自动修改。多格连续缺失或两侧公式规律不同的情况只报告、不猜测。

脚本会请求兼容表格软件在打开修订副本时重新计算公式；它本身不计算公式结果。必须明确区分“公式已填入并通过文件复检”与“公式计算值已重新验证”。

## C. 多表核对与差异清单

### 查找脚本

    RECONCILER=$(find .od-skills -type f -path '*/scripts/reconcile_spreadsheets.py' -print -quit)
    if [ -n "$RECONCILER" ]; then
      python3 "$RECONCILER" --help
    else
      echo "未找到随附多表核对脚本；检查当前激活技能的实际安装路径。" >&2
    fi

支持 CSV、XLSX、XLSM。Excel 输入必须能提供已保存的公式缓存值；脚本不会重新计算来源公式。若缓存缺失，报告会提示重新计算并保存源工作簿后再对账。

### 运行对账

对账必须明确指定匹配键，例如订单号：

    python3 "$RECONCILER" "销售订单.csv" "回款记录.xlsx" --key "订单号"

如果需要组合键，可重复指定 --key；如果只想比对部分共有字段，可重复指定 --compare：

    python3 "$RECONCILER" "销售订单.csv" "回款记录.xlsx" --key "订单号" --key "公司编码" --compare "金额" --compare "状态"

Excel 可以使用 --sheet-a 和 --sheet-b 指定不同工作表。默认输出独立的 XLSX 差异报告和 JSON 审计报告，其中包含 Summary、Field Differences、Only in A、Only in B、Duplicate Keys 和 Needs Review 六个工作表。

### 对账规则

- 键值会去掉首尾空格；普通数字文本和数值会规范到一致的数值表示，但保留带前导零的编号（如 00123），避免误配记录。
- 出现在任意一侧多次的键会进入 Duplicate Keys，整组记录不自动配对，也不会被错误列作“仅在 A/B”。
- 关键字段为空的记录进入 Needs Review，不参与匹配。
- 默认比较所有共有的非键字段；两侧独有的列会出现在报告警告中，不会被当作相等。
- 差异报告可能包含敏感业务数据。只把结果保存在用户指定的位置，不外传。
- 当详情超过报告上限时，摘要计数仍覆盖全部数据，报告会明确警告只有前一部分详细行被写入；不得称其为完整逐行清单。

## D. 安全、失败与验收规则

- 输入文件永远不能被覆盖。若输出或报告路径已存在，选择新路径；不要擅自覆盖旧产物。
- 用户只要求“检查”时，不执行删除、去重或修复操作。
- 不将异常候选直接删除，不将格式规范化冒充业务修复，不为缺失信息编造值。
- 如果文件损坏、权限不足、依赖缺失、工作表名称错误或输出复检失败，停止处理并给出可操作的原因。
- 当本技能尚无相应确定性执行器（例如复杂的业务键多表对账）时，只能使用已确认可用的工具；如果无法验证，就报告限制，而不是声称已完成。
- 交付格式：问题摘要、文件和工作表位置、执行变更、输出副本、验证结果、未解决项。没有输出副本时，不得声称修复成功。
