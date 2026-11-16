"""
命令行聊天小程序:可以连续聊天,AI 记得前面说过的话。
配套教程:第 6 章 亲手调用一次 API

运行前:
  1. pip install openai
  2. 设置环境变量 DEEPSEEK_API_KEY(方法见第 6 章)
  3. python chat.py      (输入 退出 结束聊天)
"""
import os

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],
    base_url="https://api.deepseek.com",
)

# 聊天记录:每次都要把整段记录发给 AI,它才"记得"前面聊过什么
history = [{"role": "system", "content": "你是一个耐心的中文助手,回答尽量简短。"}]

while True:
    text = input("\n你:")
    if text.strip() in ("退出", "exit", "quit"):
        break
    history.append({"role": "user", "content": text})

    response = client.chat.completions.create(model="deepseek-flash", messages=history)
    answer = response.choices[0].message.content
    history.append({"role": "assistant", "content": answer})

    print("AI:", answer)
    print(f"(这次用了 {response.usage.total_tokens} 个 Token)")
