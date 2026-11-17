---
name: env-check
description: 检查电脑的运行环境（操作系统、Python、pip、Node.js、npm、Git、LibreOffice、ffmpeg 等）够不够做某件事，缺什么就一步步带用户装好。用户说“检查环境”“看看我电脑能不能跑”“缺什么装什么”，或者开始一个需要 Python / Node.js 的任务之前使用。
---

# 运行环境检查

在开始任务之前，确认用户电脑上有需要的“底座软件”，缺的带用户装好。**先检查、再说明、用户同意后才安装。**

## 第一步：确定要检查什么

- 用户或任务说明里写了“需要什么”，就只检查那些
- 没写的话，检查这一组：操作系统和版本、Python、pip、Node.js、npm、Git、LibreOffice、ffmpeg
- 要用到具体工具包的（比如 `openpyxl`、`pptxgenjs`），也一起检查

## 第二步：检查（只读）

用不会改动电脑的命令检查，比如：

- `python3 --version`（Windows 用 `python --version`）、`pip3 --version`
- `node --version`、`npm --version`、`git --version`
- LibreOffice：Mac 看 `/Applications/LibreOffice.app` 是否存在；Windows 看 `C:\Program Files\LibreOffice` 是否存在
- `ffmpeg -version`
- Python 工具包：`python3 -c "import openpyxl"` 这类；Node 工具包：在工作区里 `npm ls 包名`

**这一步不安装、不修改任何东西。**

## 第三步：用表格报告

| 项目 | 装了吗 | 版本 | 够用吗 | 这次任务要不要 |
|---|---|---|---|---|

判断标准：Python ≥ 3.10，Node.js ≥ 18。最后用一句话总结：**能直接开始**，还是**要先装哪几样**。

## 第四步：带用户安装缺的

一样一样来，每样装完再装下一样。

**需要安装包的（Python、Node.js、LibreOffice、Git）：** 给用户官网地址和步骤，让用户自己下载、双击安装。

- Python：https://www.python.org/downloads/ ；Windows 安装时提醒勾选 “Add python.exe to PATH”；Mac 也可以在终端输入 `python3`，按提示安装“命令行开发者工具”
- Node.js：https://nodejs.org ，选 LTS 版
- LibreOffice：https://www.libreoffice.org/download/download-libreoffice/
- 装完提醒用户**关掉终端再重新打开**

**工具包（pip / npm）：** 可以由你来装，但要：

1. 先把要运行的命令写出来，说明它装什么、装到哪里
2. 等用户同意再运行
3. Python 包优先装到当前项目的虚拟环境里（`python3 -m venv .venv`）；Node 包装在当前工作区里，不用 `-g` 全局安装
4. 下载慢的话，询问用户是否在**这一次**安装时使用国内镜像：pip 用 `-i https://pypi.tuna.tsinghua.edu.cn/simple`，npm 用 `--registry=https://registry.npmmirror.com`。**不修改全局设置**

## 第五步：装完再查一遍

重新运行第二步的检查，确认版本号都出来了，再告诉用户“环境好了，可以开始”。

## 不要做的事

- 不要求用户提供电脑密码；需要输密码的安装，让用户自己操作
- 不运行 `curl ... | sh`、`sudo` 之类的命令，除非已经向用户解释清楚并得到同意
- 不从官网以外的地方下载安装包
- 不卸载、不升级用户已经装好的软件，除非用户明确要求
