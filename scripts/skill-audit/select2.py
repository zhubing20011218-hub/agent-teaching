# 第二轮筛选：质量和通用性优先
# 规则：仓库 ≥300 星且近半年有更新；说明书质量分 ≥5（满分 7），依赖外部服务 ≤2 个；
#      分数偏低但内容确实扎实的（多为官方 skill）人工放行，写在 KEEP_LOW；明确排除的写在 DROP。
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
Q = {(q['repo'], q['name']): q for q in map(json.loads, open(os.path.join(HERE, 'quality.jsonl')))}
meta = json.load(open(os.path.join(HERE, 'repo-meta.json')))
old = [l.strip().split('|') for l in open(os.path.join(HERE, 'select.txt')) if l.strip() and not l.startswith('#')]

DROP = {
    # 说明书几乎是空的（真正内容在仓库别处），单独装没用
    'team-communications', 'deep-work', 'weekly-review', 'inbox-triage', 'meetings', 'reflect', 'capture',
    'general-counsel-advisor', 'linkedin-profile', 'linkedin-content', 'capacity-planner', 'transformers-js',
    # 难用 / 太专业 / 要付费钥匙
    'pyzotero', 'huggingface-papers', 'scientific-schematics', 'infographics', 'generate-image', 'latex-posters',
    'venue-templates', 'uncertainty-and-units', 'sympy', 'biopython', 'rdkit', 'astropy', 'scanpy', 'geopandas',
    'qiskit', 'pymc', 'networkx', 'timesfm-forecasting', 'research-grants', 'remotion-motion-graphics',
    'web-artifacts-builder', 'dev-browser', 'image', 'polars',
    # 面向高管的顾问类，太窄
    'cfo-advisor', 'coo-advisor', 'ciso-advisor', 'chro-advisor', 'ceo-advisor', 'strategic-alignment',
    'intl-expansion', 'org-health-diagnostic', 'culture-architect', 'change-management', 'scenario-war-room',
    'board-deck-builder', 'sales-engineer', 'design-qa', 'executive-onboarding-playbook',
    'business-health-diagnostic', 'finance-metrics-quickref', 'finance-based-pricing-advisor', 'saas-metrics-coach',
    'product-sense-interview-answer', 'research-finance',
    # 依赖较多外部服务、或是同类里较弱的
    'knowledge-ops', 'roadmap-planning', 'launch', 'pricing', 'product-marketing', 'public-relations', 'cold-email',
    'revops', 'marketing-loops', 'signup', 'popups', 'site-architecture', 'aso',
    'commit', 'nda-triage-anthropic', 'canned-responses-anthropic', 'exploratory-data-analysis',
    'month-end-close', 'vendor-management',
    # 只适用于某一家公司、某一个国家的细分场景，或基本是空壳
    'presentation-creator', 'blog-writing-guide', 'chronology-builder-andrew-bird', 'case-briefer',
    'employment-law-research', 'slack-gif-creator', 'brief', 'audit-support', 'defuddle', 'legal-translation',
    # 中文去 AI 味保留更成熟的两个
    'qu-ai-wei',
    # 编程类只留最常用的
    'golang-pro', 'java-architect', 'swift-expert', 'rust-engineer', 'flutter-expert', 'game-developer',
    'nextjs-developer', 'vue-expert', 'react-expert', 'typescript-pro', 'fastapi-expert', 'django-expert',
    'postgres-pro', 'devops-engineer', 'rag-architect', 'huggingface-gradio', 'executing-plans',
    'requesting-code-review', 'api-designer', 'debugging-wizard', 'secure-code-guardian', 'security-reviewer',
}
KEEP_LOW = {  # 分数 <5 但人工看过、内容扎实
    'docx', 'xlsx', 'pptx', 'pdf', 'theme-factory', 'canvas-design', 'frontend-design', 'markitdown',
    'peer-review', 'scholar-evaluation', 'scientific-brainstorming', 'ad-creative', 'ai-seo', 'churn-prevention',
    'community-marketing', 'content-strategy', 'influencer-marketing', 'marketing-ideas', 'referrals', 'brainstorming',
    'ads', 'competitor-profiling', 'mcp-builder', 'marketing-plan',
    # 新来源
    'shuorenhua', 'translate-book', 'design-taste-frontend', 'defuddle', 'baoyu-compress-image',
    'kb-article', 'contract-review-kwp',
}
# 重名：旧名单里的这几个让位给官方合集里同名、更好的版本
DROP_OLD = {'code-review', 'sprint-planning', 'legal-risk-assessment', 'contract-review', 'statistical-analysis', 'onboarding'}
OWN = {'meeting-notes', 'reliable-research', 'ppt-polish', 'pet-care-log', 'rubric-feedback', 'study-pack', 'paper-explainer', 'trip-planner'}

def ok(repo, name):
    if name in DROP: return False, 'drop'
    if repo == 'zhubing-own': return True, 'own'
    br, lic, stars = meta.get(repo, ['', '', 0])
    if int(stars) < 300: return False, f'stars {stars}'
    q = Q.get((repo, name))
    if not q: return False, 'no quality row'
    if name in KEEP_LOW: return True, 'manual'
    if q['score'] < 5: return False, f"score {q['score']}"
    if len(q['svc']) > 2 or q['conn'] > 7: return False, f"svc {q['svc']} conn {q['conn']}"
    return True, f"score {q['score']}"

out, rej = [], []
for repo, name, cat, roles, starter in old:
    if repo in ('mardab96/ecommerce-claude-skills', 'zach22-1999/amazon-skills', 'Hazenix/interview-prep-skills'):
        rej.append((repo, name, 'stars < 300')); continue
    nm = {'claude-legal-skill': 'contract-review'}.get(name, name)
    if nm in DROP_OLD: rej.append((repo, nm, 'name taken by better version')); continue
    good, why = ok(repo, nm)
    (out if good else rej).append((repo, nm, cat, roles, starter) if good else (repo, nm, why))

ADD = [l.strip().split('|') for l in open(os.path.join(HERE, 'add2.txt')) if l.strip() and not l.startswith('#')]
for repo, name, cat, roles, starter in ADD:
    good, why = ok(repo, name)
    (out if good else rej).append((repo, name, cat, roles, starter) if good else (repo, name, why))

with open(os.path.join(HERE, 'select-final.txt'), 'w') as f:
    for t in out: f.write('|'.join(t) + '\n')
print('kept', len(out))
print('rejected', len(rej))
for r in rej: print('  -', *r)
