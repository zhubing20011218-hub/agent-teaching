# 给每个 skill 的说明书打质量分（只读源码，不运行）
# 输出 quality.jsonl：结构、具体程度、依赖外部服务的程度
import json, os, re, sys
U = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
rows = [json.loads(l) for l in open(os.path.join(HERE, 'scan.jsonl')) if json.loads(l)['ok']]
SERVICES = re.compile(r'\b(Salesforce|HubSpot|Slack|Gmail|Outlook|Notion|Jira|Confluence|Asana|Linear|Zendesk|Intercom|Gong|Apollo|Snowflake|BigQuery|Databricks|Figma|Canva|Stripe|QuickBooks|Xero|Shopify|Google Drive|Google Ads|Meta Ads|LinkedIn Sales|Zoom|Twitter|Reddit|YouTube API|OpenRouter|Gemini API|OpenAI API)\b')
CONNECTOR = re.compile(r'~~[a-z]|\bMCP\b|connector', re.I)
OUT_SEC = re.compile(r'^#{1,4} .*(output|format|template|deliverable|输出|格式|模板|交付)', re.I | re.M)
EX_SEC = re.compile(r'^#{1,4} .*(example|sample|示例|例子|范例)', re.I | re.M)
WHEN = re.compile(r'(when to use|when not to|do not use|不要用|何时使用|什么时候用|use when|触发)', re.I)
STEPS = re.compile(r'^\s*(\d+[.)]|step \d|第[一二三四五六七八九十\d]+步)', re.I | re.M)
for r in rows:
    p = os.path.join(U, r['repo'].replace('/', '__'), r['rel'], os.path.basename(r['file']))
    try:
        t = open(p, encoding='utf-8', errors='ignore').read()
    except Exception:
        continue
    body = t.split('\n---', 2)[-1] if t.startswith('---') else t
    heads = re.findall(r'^#{1,4} (.+)$', body, re.M)
    q = {
        'repo': r['repo'], 'rel': r['rel'], 'name': r['name'],
        'chars': len(body.strip()),
        'heads': len(heads),
        'steps': len(STEPS.findall(body)),
        'out': bool(OUT_SEC.search(body)),
        'ex': bool(EX_SEC.search(body)),
        'when': bool(WHEN.search(t)),
        'svc': sorted(set(SERVICES.findall(t)))[:6],
        'conn': len(CONNECTOR.findall(t)),
        'outline': ' / '.join(h.strip()[:28] for h in heads[:9]),
    }
    s = 0
    s += 2 if 800 <= q['chars'] <= 40000 else (1 if q['chars'] >= 300 else 0)
    s += 1 if q['heads'] >= 3 else 0
    s += 1 if q['steps'] >= 3 else 0
    s += 1 if q['out'] else 0
    s += 1 if q['ex'] else 0
    s += 1 if q['when'] else 0
    s -= 1 if len(q['svc']) >= 3 or q['conn'] >= 8 else 0
    q['score'] = s  # 0–7
    print(json.dumps(q, ensure_ascii=False))
