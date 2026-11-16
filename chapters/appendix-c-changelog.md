---
title: 附录 C 更新日志
part: 附录
verified_with: n/a
last_checked: 2026-11-17
---

# 附录 C 更新日志

这里记录**教程内容的更新**，以及 **DSH / DeepSeek 的变化对教程的影响**。

如果你发现教程和你看到的不一样，欢迎在 GitHub 提 Issue。

## 怎么看

- 每一章开头的 `verified_with` 写着这一章是对照哪个版本检查的
- DSH 版本号可以在桌面版的应用菜单「关于 DeepSeek Harness」里看到；命令行里输入 `dsh --version`

## 2026-11-17 · 教程第一版

- 完成全部 24 章和 4 个附录
- 对照版本：**DSH 0.2.2-rc.3**（预发布版）
- DeepSeek 模型：`deepseek-flash`(DeepSeek-V4.1-Flash)、`deepseek-v4-pro`；旧名 `deepseek-v4-flash` 仍可调用，但会按 Flash 处理
- 附带 3 个示例 skill:`meeting-notes`、`ppt-polish`、`reliable-research`
- **待补**：各章截图(位置已在源文件里用注释标出，见 `docs/screenshots.md`)

### 已知需要关注的变化

- DSH 还是 0.2.x 预发布版，更新很快（两周内发了 3 个版本），界面文字可能会变
- Anthropic 的 `pptx` skill 许可证已从早期的专有许可改为 Apache 2.0；早期下载的旧版建议换成新版
- 部分社区插件只支持旧版 DSH，在新版里会被跳过（见第 19 章）

<!-- 新的更新记在最上面,格式:
## YYYY-MM-DD · 一句话标题
- 影响哪些章节,改了什么
-->
