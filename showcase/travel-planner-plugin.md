---
title: 复刻：家庭旅行管家 skill
part: 作品展示 · 复刻步骤
last_checked: 2026-11-17
---

# 复刻：家庭旅行管家 skill

> **原作品：** [theoms/co-work-travel-planner-claude](https://github.com/theoms/co-work-travel-planner-claude)（MIT）
> **做出来是什么样：** 你自己的旅行规划 skill：先了解家庭情况，再选地方、排每日行程，最后输出一个**带地图的行程网页**，每个推荐都能展开看“为什么推荐它”
> **简化了什么：** 原作用谷歌地图查商家，国内用不了；这里改成用 `reliable-research` 查官方来源，地图用不需要钥匙的开源地图
> **难度：** ⭐⭐ · 大约 40 分钟
>
> 下面的提示词是我们读了原作的 `skills/plan-trip/SKILL.md` 和 `references/` 里的四份参考文档（目的地调研、自驾规划、每日行程、出行清单、地图模板）之后反推的，**不是作者的原话**，也没有实际运行过。
>
> **这个作品最值得学的是做法：** 一个复杂任务拆成“一份主说明 + 几份参考文档”；规则第一条就是“不要替用户假设喜好”。

> [!TIP]
> **第 1 步的提示词里附了原作关键文件的链接**，AI 会先读原作、再动手，做出来更接近原作。打不开 GitHub 也没关系，提示词里的要求已经够用。
>
> **整个复刻请在同一个 DSH 会话里做完**，AI 才会一直记得原作和前面的步骤。

## 准备

1. 新建文件夹 `ai-练习/旅行管家`
2. 装好 `reliable-research`；DSH 选这个文件夹，权限「工作区内修改」

## 第 0 步：检查环境

**这一段可以直接发给 DSH，它会知道你要做什么。** 原作的环境要求来自它的 README；我们的简化版用不到其中大部分，提示词里写明了哪些不用装，免得 AI 照着原作给你装一堆东西。

```text
我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。
项目：co-work-travel-planner-claude（家庭旅行管家） https://github.com/theoms/co-work-travel-planner-claude
原作是 Claude 桌面版的插件，不需要配置；它用谷歌地图查商家，用开源地图画路线。
我这次做的是：自己的一个旅行规划 skill，最后输出一个带地图的行程网页 trip.html；查资料用 reliable-research，不用谷歌地图。
这次只需要检查这几样：
1. 浏览器：能打开本地 HTML 文件
2. 网络：能不能打开 https://unpkg.com 和 https://tile.openstreetmap.org （地图要从这两个地方加载；打不开也能做，只是没有地图）
3. reliable-research skill：在 DSH 的 skill 列表里能找到
不需要：谷歌地图钥匙、Python、Node.js（这次都用不到，不要安装）。
请逐项检查。只检查，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。
缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。
检查完就停下，先不要开始做，等我发下一条消息。
```

✅ **检查：** 表格里每一项都是“够用”，最后 AI 停下来等你。
🔧 **装了还显示找不到的话：** `我已经装好了 Python，但你检查时还是显示找不到。请用 which python3（Windows 用 where python）查它装在哪里，判断是终端没有重新打开、还是没有加进 PATH，然后一步一步告诉我怎么修。`

🔧 **AI 没停下、直接开始做了的话：** `先停一下。刚才只是检查环境，还没让你开始做。请把刚才新建的文件列给我，等我下一条消息。`

不清楚“环境”是什么，先看[第 1 章 · 认识运行环境](/chapters/01-basic-skills#_5-小技能四-认识-运行环境)。

## 第 1 步：写 skill 的主说明

```text
参考这个开源项目：https://github.com/theoms/co-work-travel-planner-claude（MIT 许可证）
先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：
- https://raw.githubusercontent.com/theoms/co-work-travel-planner-claude/main/skills/plan-trip/SKILL.md（skill 主说明）
- https://raw.githubusercontent.com/theoms/co-work-travel-planner-claude/main/skills/plan-trip/references/itinerary-building.md（每日行程怎么排）
- https://raw.githubusercontent.com/theoms/co-work-travel-planner-claude/main/skills/plan-trip/references/map-template.md（地图网页模板）
读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。
然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。
如果打不开这些链接，直接告诉我，然后只按下面的要求做。

在 .dsh/skills/family-trip/ 下写一个 skill。SKILL.md 的要点：
1. 角色：一个细心的家庭旅行管家
2. 第一条规则：每个家庭都不一样，不要假设喜好（不默认要午睡、不默认饮食偏好、不默认爱逛街）
3. 原则：自己把事做完，不要只说“请您自己查一下”；每个推荐都写“为什么推荐它”；提前想到细节（几点关门、要不要预约、停车）
4. 流程分四段：了解家庭 → 选目的地 → 排每日行程 → 出行清单和地图网页；各段的细节写在 references/ 里，用到时再读
5. 开放时间、票价、预约规则必须用 reliable-research 查官方来源，标查询日期；查不到写「待核对」
```

## 第 2 步：写参考文档

```text
在 .dsh/skills/family-trip/references/ 下写三份参考文档：
- family-profile.md：了解家庭要问的问题（成员年龄、体力、预算、喜好、禁忌、交通方式），一次最多问 8 个
- itinerary.md：每日行程怎么排（按上午/中午/下午/晚上；同一天的地点要顺路；留出吃饭和休息；每个推荐带“为什么推荐”）
- checklist.md：出发前清单（证件、预约、天气、药品、充电器）和需要核对的信息
```

## 第 3 步：地图网页模板

```text
再写 .dsh/skills/family-trip/references/map-template.md：行程网页 trip.html 的做法——
- 单个 HTML 文件，用 Leaflet 1.9.4 和 OpenStreetMap 地图（不需要钥匙）
- 左边按天列出行程，每一站可以点开看“为什么推荐”（用 details 折叠）；右边地图上按天用不同颜色标出各站和路线
- 手机上改成上面地图、下面行程
- 页面顶部写清楚“开放时间、票价请以官方为准，查询日期 xxxx”
```

✅ **检查：** 打开模板文件，Leaflet 的版本号、地图来源都写明了。

## 第 4 步：试用

```text
用 family-trip 帮我规划：一家三口（孩子 6 岁）去杭州玩 3 天。
```

✅ **检查：** AI 先问问题，没有直接给行程；回答后生成了 `trip.html`，地图能显示，每站能展开看理由；开放时间都标了来源或「待核对」。
🔧 **不对的话：**
- 地图空白 → `trip.html 的地图是空白的，请检查 Leaflet 和地图图块的加载地址；如果网络打不开，改成只列出地址和导航链接。`
- 行程绕路 → `第二天上午在西湖，下午去了城北再回西湖，太绕了，请按地理位置重排。`

## 做完以后

- 和本教程自带的 `trip-planner` 对比一下：一个简单，一个完整，体会“拆成参考文档”的好处
- 回到 [作品展示](/showcase/)
