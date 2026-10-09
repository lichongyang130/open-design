---
name: spreadsheet-problem-solver
zh_name: "表格问题处理"
en_name: "Spreadsheet Problem Solver"
description: "Diagnoses real spreadsheet problems and chooses a safe, verifiable workflow for cleanup, formula issues, cross-sheet reconciliation, anomaly detection, and reporting."
zh_description: "诊断办公表格中的真实问题，选择可验证的处理流程，覆盖数据清理、公式问题、多表核对、异常检测和分析报告。"
triggers:
  - "表格问题"
  - "检查这份表格"
  - "修复表格"
  - "表格数据有问题"
  - "Excel error"
  - "spreadsheet problem"
  - "clean this spreadsheet"
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
  example_prompt: "检查这份销售表，找出重复订单、格式问题和异常金额；修复能确定的问题，并给我一份修改记录。"
  example_prompt_i18n:
    zh-CN: "检查这份销售表，找出重复订单、格式问题和异常金额；修复能确定的问题，并给我一份修改记录。"
---

# 表格问题处理：总入口技能

你的工作不是向用户罗列表格技巧，而是尽可能完成用户提出的表格任务，并用证据说明做了什么、什么仍未解决。

## 处理流程

1. **确认输入。** 找到用户指定的文件，检查扩展名、工作表名称、表头、数据范围和公式比例。不要把演示数据或猜测的数据当作用户数据。
2. **理解目标。** 将请求归入一个或多个实际问题：清理数据、诊断公式、核对多个表、检测异常、分析数据并汇报。若关键字段或去重规则不明确，先问一个必要问题。
3. **选择可执行的工作流。**
   - 数据清理：优先使用已安装的 spreadsheet-data-cleaner 专业技能及其脚本。先阅读脚本帮助和报告，再执行用户明确授权的修复。
   - 公式问题：检查具体公式、相邻行模式、引用区域和错误值。只有能从原公式模式或业务规则推导出的修复才可自动修改；不要臆造公式。
   - 多表核对：先确认稳定匹配键。分别输出只在 A 中、只在 B 中、字段冲突、重复匹配和成功匹配的记录；不要只比较总额。
   - 异常检测：区分“异常候选”与“已确认错误”。极端值不等于错误；保留原值，给出触发规则和具体单元格。
   - 分析报告：每个结论都必须能追溯到原始数据、筛选条件和计算过程，不得编造原因或指标。
4. **保护原始数据。** 除非用户明确要求覆盖，否则在旁边创建修订副本。涉及删除、去重、批量覆盖或更改业务值时，先确认用户的授权范围。
5. **独立复检。** 修改后重新读取输出文件，检查文件可打开、关键行数和字段仍在、变更日志与实际变化一致。公式文本被保留不代表公式计算结果已被验证。
6. **交付结果。** 提供修订文件、问题清单、变更日志和未解决事项。明确指出哪些检查已完成、哪些依赖 Excel/兼容计算引擎、哪些需要用户判断。

## 使用专业清理脚本

先检查当前技能目录是否包含脚本：

    CLEANER=$(find .od-skills -type f -path '*/scripts/clean_spreadsheet.py' -print -quit)

如果找到脚本，先运行 python3 "$CLEANER" --help，其中 CLEANER 应设置为实际找到的路径。若脚本未被暂存，使用当前技能环境中实际可访问的 spreadsheet-data-cleaner 安装路径；找不到时不要声称脚本已执行，改用当前可用工具并说明能力限制。

脚本默认只清理文本首尾空白，并生成 JSON 审计报告。CSV 的空行删除和精确重复行删除必须使用明确参数；Excel 工作簿的去重会清空重复数据行的值但不移动行号，含公式的重复行会保留给用户检查。不要将“检查一下”自动解释成允许删除数据。

## 禁止事项

- 不覆盖原文件，不隐藏或省略未完成项。
- 不把空值随意填成 0，不把文本数字随意转换成数字（这可能破坏编号的前导零）。
- 不把异常候选直接删除，不把格式修复冒充业务纠错。
- 不声称脚本计算了 Excel 公式；它只能保留公式并请求兼容表格应用在打开时重新计算。
- 不输出“已修复”除非修订文件确实存在且复检通过。

## 完成答复格式

简要汇报：发现的问题、执行的变更、输出文件、验证结果、仍需判断的事项。若没有修改，明确说明这是检查结果而不是修复完成。
