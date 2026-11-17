# 从 scan.jsonl + select.txt + zh*.tsv 生成网站用的 skills.json
# 用法：python3 build.py <untrusted-skills 目录> <输出 skills.json>
import json, os, re, sys, collections
U, OUT = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
rows = [json.loads(l) for l in open(os.path.join(HERE, 'scan.jsonl')) if json.loads(l)['ok']]
sel = [l.strip().split('|') for l in open(os.path.join(HERE, 'select.txt')) if l.strip() and not l.startswith('#')]
meta = json.load(open(os.path.join(HERE, 'repo-meta.json')))
DROP = {('petar-nauka/fact-check-skill', 'fact-check-skill'), ('lawve-ai/awesome-legal-skills', 'contract-review')}
DROP_NAMES = {'gdpr-audit-prep', 'iso27001-audit-prep', 'blog-writing-guide', 'presentation-creator', 'brand-guidelines'}
EXPAND = {'mardab96/ecommerce-claude-skills', 'zach22-1999/amazon-skills', 'Hazenix/interview-prep-skills'}
RENAME = {('evolsb/claude-legal-skill', 'claude-legal-skill'): 'contract-review'}
picked = []
for repo, name, cat, roles, starter in sel:
    if (repo, name) in DROP or name in DROP_NAMES: continue
    if repo == 'zhubing-own':
        picked.append({'repo': repo, 'name': name, 'cat': cat, 'roles': roles, 'starter': starter == '1', 'parentRefs': []}); continue
    if repo in EXPAND:
        for r in rows:
            if r['repo'] == repo and r['rel'] != '.': picked.append({**r, 'cat': cat, 'roles': roles, 'starter': False})
        continue
    nm = RENAME.get((repo, name), name)
    c = sorted([r for r in rows if r['repo'] == repo and r['name'] == nm], key=lambda r: len(r['rel']))
    if not c: print('MISSING', repo, name); continue
    picked.append({**c[0], 'cat': cat, 'roles': roles, 'starter': starter == '1'})
for e in picked:
    if e['repo'] == 'zhubing-own': continue
    t = open(os.path.join(U, e['repo'].replace('/', '__'), e['rel'], os.path.basename(e['file'])), encoding='utf-8', errors='ignore').read()
    e['parentRefs'] = sorted(set(m.split('/')[1] for m in re.findall(r'\.\./[A-Za-z0-9_.-]+', t)))
zh = {}
for f in ['zh1.tsv', 'zh2.tsv', 'zh3.tsv']:
    for l in open(os.path.join(HERE, f), encoding='utf-8'):
        if l.strip(): n, t, d = l.rstrip('\n').split('\t'); zh[n] = (t, d)
LIC_FIX = {'lawve-ai/awesome-legal-skills': 'CC BY-NC-ND 4.0', 'deanpeters/Product-Manager-Skills': 'CC BY-NC-SA 4.0'}
KEYS = {'scientific-schematics', 'infographics', 'generate-image', 'pyzotero', 'zach-product-research', 'zach-sif-cvr-threshold-analyzer', 'inbox-triage'}
DEPS = {'anki': 'Anki 软件', 'video-subtitle': 'ffmpeg 和 Whisper（AI 会教你装）', 'latex-posters': 'LaTeX', 'scanpy': 'Python 科学计算库（AI 会帮你装）', 'qiskit': 'Python 的 qiskit 库'}
NOTES = {
    'pptx': '你电脑上如果有旧版 pptx skill，许可证可能是早期的专有许可，建议换成这个新版',
    'qu-ai-wei': '只用来改你自己的文字风格。要求独立完成的作业、论文，不能用它“去痕迹”',
    'literature-review-skills': '帮你理清思路和找资料；写进论文要用你自己的话，按规范引用',
    'lecture-notes': '说明是英文，可以要求它输出中文',
    'contract-review': '只能帮你先看一遍，不能代替律师',
    'zach-listing-health-checker': '会抓取网页，先确认不违反平台规则',
    'resume-builder': '简历里只写真实经历',
    'cold-email': '发营销邮件要遵守当地法规，不要群发骚扰',
    'scientific-writing': '帮你起草和检查；交给期刊或学校的稿子，要按规定说明使用了 AI',
    'peer-review': '审稿意见要你自己判断和负责，不要直接照搬',
}
IGNORE_REFS = {'out.docx', 'out.pptx', 'image.webp', 'output.png', 'shopify.server', 'actions', '..'}
HOSTED = 'https://teach.prismice.cn/files/skills'
out = []
for e in picked:
    n = e['name']; t, d = zh[n]
    ent = {'id': n, 'name': n, 'title': t, 'desc': d, 'cat': e['cat'], 'roles': [r for r in e['roles'].split(',') if r], 'starter': bool(e.get('starter'))}
    if e['repo'] == 'zhubing-own':
        ent.update(url=f'{HOSTED}/{n}/SKILL.md', hosted=True, license='CC BY-NC-SA 4.0', zh=True, source='本教程')
    else:
        repo = e['repo']; br, lic, stars = meta[repo]; rel = e['rel']
        ent.update(url=f'https://github.com/{repo}' if rel == '.' else f'https://github.com/{repo}/tree/{br}/{rel}', source=repo, stars=int(stars))
        if repo == 'anthropics/skills': lic = 'Apache-2.0' if e.get('folderLicense') else '未单独注明'
        lic = LIC_FIX.get(repo, lic); ent['license'] = '未注明' if lic == 'NONE' else lic
        if e['scripts'] > 0: ent['script'] = True
        if e['net']: ent['net'] = True
        if e['zh']: ent['zh'] = True
        refs = [r for r in e.get('parentRefs', []) if r not in IGNORE_REFS]
        if repo == 'mardab96/ecommerce-claude-skills' and refs:
            ent['extra'] = '这个 skill 会用到仓库根目录的 ' + '、'.join(r for r in refs if r in ('references', 'scripts')) + ' 文件夹，请把它们也复制到 ~/.dsh/skills/ 下面（和 skill 文件夹放在同一层）'
        elif refs:
            ent['note'] = '会提到同一个仓库里的其他 skill；单独安装也能用，一起装效果更好'
        if repo == 'lawve-ai/awesome-legal-skills' or n in ('contract-review', 'general-counsel-advisor', 'employment-law-research', 'case-briefer'):
            ent['note'] = (ent['note'] + '；' if ent.get('note') else '') + '主要针对美国、欧盟的法律；中国的法律问题请咨询律师'
        if n == 'contract-review': ent['extra'] = '这个仓库的说明文件叫小写的 skill.md，装好后改名为 SKILL.md'
    if n in KEYS: ent['keys'] = True
    if n in DEPS: ent['deps'] = DEPS[n]
    if n in NOTES: ent['note'] = (NOTES[n] + '；' + ent['note']) if ent.get('note') else NOTES[n]
    out.append(ent)
ORDER = ['office', 'writing', 'productivity', 'research', 'learning', 'academic', 'teaching', 'data', 'finance', 'legal', 'career', 'business', 'product', 'ecommerce', 'sales', 'media', 'design', 'life', 'dev', 'security']
out.sort(key=lambda x: (ORDER.index(x['cat']), not x['starter']))
assert len({x['id'] for x in out}) == len(out), 'duplicate id'
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=0)
print('total', len(out), collections.Counter(x['cat'] for x in out).most_common())
