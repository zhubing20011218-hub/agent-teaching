"""
迷你 Agent:约 80 行,演示 "大脑 + 双手 + 反复做"。
配套教程:第 24 章 手写一个迷你 Agent

运行前:
  1. pip install openai
  2. 设置环境变量 DEEPSEEK_API_KEY(方法见第 23 章)
  3. python mini_agent.py
"""
import json
import os
from pathlib import Path

from openai import OpenAI

# ---------- 大脑:连接 DeepSeek ----------
client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],  # 钥匙从环境变量读,不写在代码里
    base_url="https://api.deepseek.com",
)
MODEL = "deepseek-flash"

# 只允许 AI 访问这个文件夹(安全起见)
WORKSPACE = Path.cwd()


def safe_path(name: str) -> Path:
    """把 AI 给的文件名变成完整路径,并确认它没有跑出工作文件夹。"""
    p = (WORKSPACE / name).resolve()
    if WORKSPACE not in p.parents and p != WORKSPACE:
        raise ValueError("不允许访问工作文件夹以外的地方")
    return p


# ---------- 双手:两个工具 ----------
def list_files(folder: str = ".") -> str:
    """列出文件夹里的文件。"""
    return "\n".join(sorted(x.name for x in safe_path(folder).iterdir()))


def read_file(path: str) -> str:
    """读取一个文本文件的内容(最多 2000 个字)。"""
    return safe_path(path).read_text(encoding="utf-8")[:2000]


TOOLS = {"list_files": list_files, "read_file": read_file}

# 告诉 AI 有哪些工具可用(这就是"工具清单")
TOOL_SPECS = [
    {"type": "function", "function": {
        "name": "list_files",
        "description": "列出某个文件夹里有哪些文件",
        "parameters": {"type": "object", "properties": {
            "folder": {"type": "string", "description": "文件夹名,默认是当前文件夹 ."}}},
    }},
    {"type": "function", "function": {
        "name": "read_file",
        "description": "读取一个文本文件的内容",
        "parameters": {"type": "object", "properties": {
            "path": {"type": "string", "description": "文件名"}}, "required": ["path"]},
    }},
]


# ---------- 反复做:Agent 循环 ----------
def run_agent(task: str, max_rounds: int = 10) -> str:
    messages = [
        {"role": "system", "content": "你是一个帮用户查看文件的助手。需要时调用工具,最后用中文简短回答。"},
        {"role": "user", "content": task},
    ]
    for round_no in range(1, max_rounds + 1):
        reply = client.chat.completions.create(
            model=MODEL, messages=messages, tools=TOOL_SPECS,
        ).choices[0].message
        messages.append(reply)

        if not reply.tool_calls:          # AI 没要求用工具 → 说明它做完了
            return reply.content

        for call in reply.tool_calls:      # AI 要求用工具 → 我们帮它执行
            args = json.loads(call.function.arguments or "{}")
            print(f"[第 {round_no} 圈] AI 要用工具 {call.function.name},参数 {args}")
            try:
                result = TOOLS[call.function.name](**args)
            except Exception as e:         # 出错也要告诉 AI,让它换个办法
                result = f"出错了:{e}"
            messages.append({"role": "tool", "tool_call_id": call.id, "content": result})
    return "做了太多圈还没完成,先停下。"


if __name__ == "__main__":
    question = input("你想让 AI 做什么?> ")
    print("\nAI 的回答:", run_agent(question))
