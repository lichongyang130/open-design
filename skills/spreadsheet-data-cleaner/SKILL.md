---
name: spreadsheet-data-cleaner
zh_name: "表格数据清理与修复"
en_name: "Spreadsheet Data Cleaner"
description: "Safely audits and cleans CSV/XLSX/XLSM files, records every text change, detects blank and exact duplicate rows, and validates the saved output without overwriting the source."
zh_description: "安全检查并清理 CSV、XLSX、XLSM 文件，记录每项文本变更，检测空行和完全重复行，验证输出且不覆盖源文件。"
triggers:
  - "清理表格"
  - "清理 Excel"
  - "去掉重复行"
  - "删除空白行"
  - "规范表格格式"
  - "clean CSV"
  - "clean spreadsheet data"
  - "remove duplicate spreadsheet rows"
od:
  mode: prototype
  category: office-productivity
  scenario: spreadsheet
  surface: web
  design_system:
    requires: false
  capabilities_required:
    - file_write
  example_prompt: "清理这份 CSV：去掉文本首尾空格，删除全空行和完全重复的数据行；保留原文件并输出修改记录。"
  example_prompt_i18n:
    zh-CN: "清理这份 CSV：去掉文本首尾空格，删除全空行和完全重复的数据行；保留原文件并输出修改记录。"
---

# 表格数据清理与修复

使用配套脚本处理真实文件。不要仅给出建议，也不要在没有产物的情况下声称清理完成。

## 支持范围

- CSV：不需要第三方 Python 包。可读取 UTF-8、带 BOM 的 UTF-8、GB18030 以及常见单字节文本编码；自动识别逗号、分号、Tab 或竖线分隔符。
- XLSX / XLSM：需要当前 Python 环境安装 openpyxl。脚本保留公式文本；XLSM 会启用 VBA 保留模式，但复杂图形或特殊 Excel 功能仍须在原生表格软件中复查。
- 不支持旧版二进制 XLS。先在 Excel、LibreOffice 或其他兼容软件中另存为 XLSX。
- 输入文件永远不会被覆盖。默认输出为同目录下的 <原文件名>_cleaned.<扩展名> 及其 JSON 清理报告。

## 执行步骤

1. 找到并确认用户要处理的文件，不要自行选择目录中看起来相似的文件。
2. 查找脚本并查看参数说明：

       CLEANER=$(find .od-skills -type f -path '*/scripts/clean_spreadsheet.py' -print -quit)
       test -n "$CLEANER" || echo "脚本未暂存：请检查当前技能的实际安装路径"
       python3 "$CLEANER" --help

3. 先进行只读预检，选择一个不会覆盖已有文件的报告路径：

       python3 "$CLEANER" "销售表.csv" --dry-run --report "销售表_预检.json"

   预检会分析并计划变更，但不会写入清理后的文件。查看报告里的 summary、findings、changes、warnings。
4. 按用户授权执行实际清理。普通“检查/清理”请求仅允许安全的文本首尾空格规范化；只有用户明确要求删除空行或重复项时才加相应参数。例如：

       python3 "$CLEANER" "销售表.csv" --drop-empty-rows --dedupe --report "销售表_清理报告.json"

   对 XLSX/XLSM，先检查目标工作表；需要限制范围时重复使用 --sheet "工作表名"。不要对公式、前导零编号、日期、金额文本或未知字段做推测性类型转换。
5. 打开 JSON 报告确认处理数量；重新读取输出文件，检查文件可读、表头/关键列/行数符合预期，并抽查变更。只有在这些检查通过后才可报告成功。

## 行为规则

- 默认只裁掉文本首尾空格。内部空白合并需要显式使用 --collapse-whitespace，因为空格可能有业务含义。
- CSV 的 --drop-empty-rows 会移除所有单元格都为空的行；--dedupe 会按整行内容删除完全重复的数据行，保留第一次出现的行。若需要按订单号等业务键去重，先确定键和冲突处理规则，不要把不同金额的订单合并掉。
- 对 XLSX/XLSM，脚本不会物理删除或移动行号，以免公式引用错位。显式使用 --dedupe 时，只会清空无公式的完全重复行中的值；含公式的重复行只报告、不清空。输出会保留空白行位置，报告会注明。
- 默认只处理可见工作表。隐藏表可能包含业务数据或辅助公式，只有用户确认后才用 --include-hidden-sheets；也可用 --sheet 指定确切工作表。
- 公式会保留，但脚本不执行公式计算。若需要验证公式结果，必须使用可用的计算引擎打开并重新计算，或明确说明当前环境无法验证。
- 脚本不负责判断一笔交易是否真的重复，也不负责决定缺失值应填什么。碰到歧义时保留数据并请求用户判断。

## 错误处理

- 如果缺少 openpyxl，对 CSV 仍可继续；对 XLSX/XLSM 停止并说明需要在当前 Python 环境安装该包，不要悄悄改用 CSV 或伪装成已处理。
- 如果输出/报告路径已存在，选择新名字，或在用户明确允许覆盖该输出时再加 --overwrite-output。该参数也绝不会覆盖输入文件。
- 文件打不开、工作表名称无效、超过安全扫描范围或保存后验证不一致时，停止交付该文件并报告具体错误。

## 必须交付

- 清理后的独立副本（dry-run 除外）。
- JSON 清理报告，包含处理数量、变更位置、原值/新值（适用时）、重复行定位、警告和完成时间。
- 简短结论：已修复、仅检测、未处理和需要用户确认的项目分别是什么。
