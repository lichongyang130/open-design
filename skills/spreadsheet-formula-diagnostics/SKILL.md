---
name: spreadsheet-formula-diagnostics
zh_name: "公式错误诊断与安全修复"
en_name: "Spreadsheet Formula Diagnostics"
description: "Finds broken spreadsheet references, error values, and provable one-cell formula gaps. Repairs only gaps independently implied by formulas above and below, to a new copy with a JSON audit report."
zh_description: "定位表格中的断裂引用、错误值和可明确推导的单格公式缺失；仅在上下公式推导结果完全一致时修复到新副本，并生成 JSON 审计报告。"
triggers:
  - "公式报错"
  - "公式漏填"
  - "检查 Excel 公式"
  - "修复公式"
  - "Excel #REF"
  - "spreadsheet formula error"
  - "missing spreadsheet formula"
  - "repair Excel formulas"
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
  example_prompt: "检查这份 Excel 的公式问题，找出 #REF! 和公式漏填；只自动修复上下公式能够推导出相同结果的缺失公式，并生成报告。"
  example_prompt_i18n:
    zh-CN: "检查这份 Excel 的公式问题，找出 #REF! 和公式漏填；只自动修复上下公式能够推导出相同结果的缺失公式，并生成报告。"
---

# 公式错误诊断与安全修复

使用配套脚本检查真实的 XLSX/XLSM 工作簿。先诊断、再判断是否应用修复。不要只给出泛泛建议，也不要把公式文本存在误报成公式计算结果正确。

## 能力范围

- 检查明确的 Excel 错误值，如 #REF!、#DIV/0!、#VALUE!、#NAME?、#N/A、#NUM! 等。
- 定位公式文本中包含 #REF! 的断裂引用。
- 检测单个空白单元格的公式缺失候选：该单元格上下相邻的公式分别平移到目标格后，必须得到完全一致的公式文本。
- 不尝试猜测复杂公式、整段缺失、业务规则、外部引用或结构化引用的意图。
- 脚本保留公式但不计算公式结果。真正计算和刷新缓存需要兼容的电子表格计算引擎。

## 执行步骤

1. 确认用户指定的文件为 .xlsx 或 .xlsm；不处理旧版二进制 .xls。
2. 找到实际脚本并查看参数：

       DIAGNOSTIC=$(find .od-skills -type f -path '*/scripts/diagnose_formulas.py' -print -quit)
       if [ -n "$DIAGNOSTIC" ]; then
         python3 "$DIAGNOSTIC" --help
       else
         echo "当前技能目录中没有诊断脚本；检查已安装技能的实际路径。" >&2
       fi

3. 默认先运行只读诊断：

       python3 "$DIAGNOSTIC" "销售表.xlsx" --report "销售表_公式诊断.json"

   默认不写入修订工作簿。检查 JSON 报告中的 findings 和 summary，把错误值、断裂引用和可安全修复的缺失公式分别说明。
4. 只有用户要求修复时，才使用 --apply-safe-repairs。输出写入独立副本，原始工作簿不被覆盖：

       python3 "$DIAGNOSTIC" "销售表.xlsx" --apply-safe-repairs

   也可以用 --output 和 --report 指定不会覆盖输入的输出路径；用 --sheet "工作表名" 限定工作表。
5. 重新打开输出文件并检查工作表名称、公式数量和每个修复单元格的公式文本。只有输出验证通过后才报告修复成功。

## 自动修复的严格条件

只支持单个空白单元格，且上下紧邻单元格都包含公式。如果把上下公式分别转换到目标单元格，两个预测公式必须完全一致。含批注、超链接、合并单元格、非空值或翻译失败的单元格不自动修复。

其它情况仅报告：
- 公式包含 #REF!：报告断裂引用，不尝试还原原来引用了哪个单元格。
- 错误值：记录具体工作表、单元格和错误类型，不自行替换公式。
- 公式规律不一致、多格连续缺失、外部链接或复杂公式：保留原值，要求人工审核。
- 找不到问题或没有安全修复候选：明确报告，不虚构修改。

## 安全与交付

- 永远不覆盖原文件。
- 默认只读取和报告；必须明确要求修复，才写入修订副本。
- 不声称脚本计算了公式。保存后会请求兼容表格软件重新计算；如当前环境无法计算，应在最终答复中明确说明。
- 交付公式诊断 JSON、修订副本（如有）、修复位置和公式、复检结果、未解决问题。
