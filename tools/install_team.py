"""Install the Home Office & Co agent team from sparse clones in %TEMP%/hoc-team.
Usage: python -I -X utf8 tools/install_team.py <clones_dir> <project_root>
Copies agent .md files into .claude/agents (with project fixes), skills into .claude/skills,
vendors claude-seo into .claude/vendor, and writes docs/THIRD_PARTY_LICENSES.md.
"""
import os, re, shutil, sys

SRC, ROOT = sys.argv[1], sys.argv[2]
AG = os.path.join(ROOT, '.claude', 'agents')
SK = os.path.join(ROOT, '.claude', 'skills')
VE = os.path.join(ROOT, '.claude', 'vendor')
for d in (AG, SK, VE):
    os.makedirs(d, exist_ok=True)

def read(rel):
    return open(os.path.join(SRC, rel), encoding='utf-8').read()

def write_agent(fname, text):
    with open(os.path.join(AG, fname), 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    fm = text.split('---', 2)[1]
    name = re.search(r'^name:\s*(.+)$', fm, re.M).group(1).strip()
    print(f'agent  {fname:38s} name={name}')

def set_fm(text, key, value):
    """Replace or insert a frontmatter key."""
    head, fm, body = text.split('---', 2)
    if re.search(rf'^{key}:.*$', fm, re.M):
        fm = re.sub(rf'^{key}:.*$', f'{key}: {value}', fm, count=1, flags=re.M)
    else:
        fm = fm.rstrip('\n') + f'\n{key}: {value}\n'
    return head + '---' + fm + '---' + body

def drop_fm(text, key):
    head, fm, body = text.split('---', 2)
    fm = re.sub(rf'^{key}:.*\n', '', fm, flags=re.M)
    return head + '---' + fm + '---' + body

PROJECT_NOTE = """

---

## Project context: Home Office & Co (added on install)

- Read `docs/PROJECT_BRIEF.md` before any work. It is the single source of truth: client facts, audience, goals, structure, brand direction, facts that must not be invented.
- The site is in Russian (primary) with English for five key pages. Write user-facing text in Russian unless told otherwise.
- Stack: Next.js (App Router) + TypeScript + Tailwind, later Payload CMS. Animation: GSAP + ScrollTrigger and Lenis.
- The target level is a premium studio site (Sotheby's, Knight Frank, Carolwood, haus & haus), not a template. "Premium" here is a stated requirement of the brief, not scope creep.
- Never invent facts about the client (team names, awards, prices, partners, press). Use clearly marked placeholders.
"""

def tag(text):
    return text.rstrip() + PROJECT_NOTE

# ---------- agents taken from GitHub ----------
A = 'msitarzewski_agency-agents/'

t = read('vijaythecoder_awesome-claude-agents/agents/orchestrators/tech-lead-orchestrator.md')
t = t.replace('2. **Maximum 2 agents run in parallel**', '2. **Maximum 4 agents run in parallel**')
t = t.replace('(max 2 at once)', '(max 4 at once)').replace('(max 2)', '(max 4)')
t = tag(t) + """
### Project roster (use ONLY these agent names; Django/Rails examples above are illustrative)

| Area | Agents |
| --- | --- |
| Design & art direction | brand-guardian, ui-designer, ui-finish-gate-reviewer |
| Frontend | expert-nextjs-developer, tailwind-frontend-expert, motion-engineer, accessibility-auditor, wsh-performance-engineer, wsh-typescript-pro |
| SEO | seo-specialist (lead), yandex-seo-specialist, seo-cluster, seo-technical, seo-schema, seo-content |
| Marketing & copy | ru-copywriter (Russian copy, writes), landing-page-copywriter (structure and conversion review), ux-microcopy-reviewer |
| Sales & conversion | realestate-sales-strategist, offer-lead-gen-strategist, cro-specialist |
| QA | evidence-collector, silent-failure-hunter, wsh-code-reviewer, ui-visual-validator |

Typical order for a page: seo-cluster/yandex-seo-specialist (queries and page intent) → realestate-sales-strategist + offer-lead-gen-strategist (offer, objections, funnel step) → ru-copywriter (text) → brand-guardian/ui-designer (layout) → expert-nextjs-developer + tailwind-frontend-expert + motion-engineer (build) → seo-technical + seo-schema (markup) → ui-finish-gate-reviewer + accessibility-auditor + evidence-collector (gates).
"""
write_agent('tech-lead-orchestrator.md', t)

t = read('wshobson_agents/plugins/ui-design/agents/ui-designer.md')
t = tag(t) + "\nBefore designing, read `.claude/skills/frontend-design/SKILL.md` and `.claude/skills/taste-skill/SKILL.md`.\n"
write_agent('ui-designer.md', t)

t = set_fm(read(A + 'design/design-brand-guardian.md'), 'name', 'brand-guardian')
write_agent('brand-guardian.md', tag(t))

t = set_fm(read(A + 'design/design-ui-finish-gate-reviewer.md'), 'name', 'ui-finish-gate-reviewer')
t = tag(t) + "\nFor this marketing site, judge against the premium real-estate references listed in the brief (not product dashboards). Read `.claude/skills/taste-skill/SKILL.md` for the anti-template checklist.\n"
write_agent('ui-finish-gate-reviewer.md', t)

t = read('davila7_claude-code-templates/cli-tool/components/agents/web-tools/expert-nextjs-developer.md')
t = drop_fm(t, 'tools')  # VS Code Copilot tool names do not exist in Claude Code; inherit all tools
t = tag(t) + "\nNext.js 16 note: request interception moved from `middleware.ts` to `proxy.ts`; check the installed version's docs in `node_modules/next/dist/docs/` before relying on either. Read `.claude/skills/nextjs-app-router-patterns/SKILL.md`.\n"
write_agent('expert-nextjs-developer.md', t)

t = read('vijaythecoder_awesome-claude-agents/agents/universal/tailwind-css-expert.md')
t = tag(t) + "\nRead `.claude/skills/tailwind-design-system/SKILL.md` before building tokens.\n"
write_agent('tailwind-frontend-expert.md', t)

t = set_fm(read(A + 'testing/testing-accessibility-auditor.md'), 'name', 'accessibility-auditor')
write_agent('accessibility-auditor.md', tag(t))

t = set_fm(read(A + 'marketing/marketing-seo-specialist.md'), 'name', 'seo-specialist')
t = tag(t) + "\nYou lead SEO. Yandex specifics go to yandex-seo-specialist; SERP clustering to seo-cluster; markup to seo-schema; crawl and rendering to seo-technical.\n"
write_agent('seo-specialist.md', t)

for n in ('seo-technical', 'seo-schema', 'seo-cluster', 'seo-content'):
    t = read(f'AgriciDaniel_claude-seo/agents/{n}.md')
    t = t.replace('${CLAUDE_PLUGIN_ROOT}', '.claude/vendor/claude-seo')
    t = tag(t) + "\nThe claude-seo scripts are vendored in `.claude/vendor/claude-seo` (Python; install `requirements.txt` there if a script fails). Search results you see are closest to Google; Yandex SERP is not visible to you, hand Yandex questions to yandex-seo-specialist.\n"
    write_agent(f'{n}.md', t)

t = read('jnMetaCode_agency-agents-ru/marketing/marketing-yandex-seo-specialist.md')
t = set_fm(t, 'name', 'yandex-seo-specialist')
removed = [l for l in t.splitlines() if re.search(r'[Тт]урбо|[Tt]urbo', l)]
t = '\n'.join(l for l in t.splitlines() if not re.search(r'[Тт]урбо|[Tt]urbo', l)) + '\n'
t = tag(t) + "\nВажно: Турбо-страницы Яндекс отключил в 2025 году, не рекомендуйте их. Перед работой прочитайте `.claude/skills/yandex-seo/SKILL.md` и его references (сверено 2026-06).\n"
write_agent('yandex-seo-specialist.md', t)
print(f'       yandex: removed {len(removed)} Turbo-page lines')

t = read('VoltAgent_awesome-claude-code-subagents/categories/08-business-product/landing-page-copywriter.md')
t = t.replace('Query context manager for the offer, target audience, and current conversion baseline',
              'Read docs/PROJECT_BRIEF.md for the offer, target audience and goals')
t = re.sub(r'\n## Communication Protocol.*?(?=\n## |\Z)', '\n', t, flags=re.S)
t = tag(t) + "\nYou review structure and conversion logic; final Russian wording is ru-copywriter's job. Read `.claude/skills/copywriting/SKILL.md`.\n"
write_agent('landing-page-copywriter.md', t)

t = set_fm(read(A + 'sales/sales-offer-lead-gen-strategist.md'), 'name', 'offer-lead-gen-strategist')
t = tag(t) + "\nRead `.claude/skills/lead-magnets/SKILL.md`. Lead magnets here: the property-selection quiz, the investor guide PDF, the consultation booking.\n"
write_agent('offer-lead-gen-strategist.md', t)

t = read('anthropics_claude-plugins-official/plugins/pr-review-toolkit/agents/silent-failure-hunter.md')
t = tag(t) + "\nPriority here: every lead form (quiz, booking, guide) must never lose a lead silently on the way to amoCRM/Telegram.\n"
write_agent('silent-failure-hunter.md', t)

t = set_fm(read(A + 'testing/testing-evidence-collector.md'), 'name', 'evidence-collector')
t = t.replace("- Don't add luxury requirements that weren't in the original spec",
              "- Don't add requirements that weren't in the brief (here a premium look IS required by the brief)")
t = t.replace('./qa-playwright-capture.sh http://localhost:8000 public/qa-screenshots',
              '# capture desktop (1440) and mobile (390) screenshots of the running Next.js dev server (http://localhost:3000), e.g. with Playwright')
t = '\n'.join(l for l in t.splitlines() if 'NO PREMIUM FEATURES FOUND' not in l) + '\n'
write_agent('evidence-collector.md', tag(t))

t = read('VoltAgent_awesome-claude-code-subagents/categories/08-business-product/ux-microcopy-reviewer.md')
t = tag(t) + "\nDefaults for this project: language Russian, address the reader formally («вы»), plain infostyle, no exclamation marks in UI.\n"
write_agent('ux-microcopy-reviewer.md', t)

# ---------- skills ----------
def copy_skill(src_rel, name, fix=None):
    s = os.path.join(SRC, src_rel)
    d = os.path.join(SK, name)
    if os.path.exists(d):
        shutil.rmtree(d)
    shutil.copytree(s, d, ignore=shutil.ignore_patterns('.git*', 'evals', '*.webp', '*.png'))
    if fix:
        p = os.path.join(d, 'SKILL.md')
        txt = open(p, encoding='utf-8').read()
        open(p, 'w', encoding='utf-8', newline='\n').write(fix(txt))
    print(f'skill  {name}')

copy_skill('anthropics_skills/skills/frontend-design', 'frontend-design')
copy_skill('Leonxlnx_taste-skill/skills/taste-skill', 'taste-skill')
for n in ('gsap-core', 'gsap-react', 'gsap-scrolltrigger', 'gsap-timeline', 'gsap-performance', 'gsap-plugins', 'gsap-utils', 'gsap-frameworks'):
    copy_skill(f'greensock_gsap-skills/skills/{n}', n)
for n in ('animate', 'review-animations', 'animation-performance', 'improve-animations', 'find-animation-opportunities', 'animation-vocabulary'):
    copy_skill(f'emilkowalski_skills/skills/{n}', n)
for n in ('copywriting', 'cro', 'lead-magnets', 'popups', 'product-marketing', 'schema', 'site-architecture'):
    copy_skill(f'coreyhaines31_marketingskills/skills/{n}', n)
copy_skill('rdsolod-ui_claude-yandex-seo/skills/yandex-seo', 'yandex-seo',
           fix=lambda s: '\n'.join(l for l in s.splitlines() if '_seo/semantics.md' not in l) + '\n')
copy_skill('wshobson_agents/plugins/frontend-mobile-development/skills/tailwind-design-system', 'tailwind-design-system')
copy_skill('wshobson_agents/plugins/frontend-mobile-development/skills/nextjs-app-router-patterns', 'nextjs-app-router-patterns')
copy_skill('wshobson_agents/plugins/ui-design/skills/visual-design-foundations', 'visual-design-foundations')
copy_skill('wshobson_agents/plugins/ui-design/skills/interaction-design', 'interaction-design')

# ---------- vendor claude-seo ----------
vs = os.path.join(SRC, 'AgriciDaniel_claude-seo')
vd = os.path.join(VE, 'claude-seo')
if os.path.exists(vd):
    shutil.rmtree(vd)
os.makedirs(vd)
for item in ('scripts', 'skills', 'data', 'schema', 'requirements.txt', 'pyproject.toml', 'LICENSE', 'README.md'):
    s = os.path.join(vs, item)
    if os.path.isdir(s):
        shutil.copytree(s, os.path.join(vd, item), ignore=shutil.ignore_patterns('__pycache__', '*.png', '*.webp', '*.jpg'))
    elif os.path.exists(s):
        shutil.copy2(s, vd)
print('vendor claude-seo')

# reference only (not an agent): US real-estate buyer/seller agent, structure reused by realestate-sales-strategist
os.makedirs(os.path.join(ROOT, 'docs', 'reference'), exist_ok=True)
shutil.copy2(os.path.join(SRC, A + 'specialized/real-estate-buyer-seller.md'), os.path.join(ROOT, 'docs', 'reference', 'real-estate-buyer-seller.md'))

# ---------- licenses ----------
LIC = [
    ('msitarzewski/agency-agents', 'msitarzewski_agency-agents/LICENSE', 'brand-guardian, ui-finish-gate-reviewer, accessibility-auditor, seo-specialist, offer-lead-gen-strategist, evidence-collector'),
    ('vijaythecoder/awesome-claude-agents', 'vijaythecoder_awesome-claude-agents/LICENSE', 'tech-lead-orchestrator, tailwind-frontend-expert'),
    ('wshobson/agents', 'wshobson_agents/LICENSE', 'ui-designer; skills tailwind-design-system, nextjs-app-router-patterns, visual-design-foundations, interaction-design'),
    ('davila7/claude-code-templates', 'davila7_claude-code-templates/LICENSE', 'expert-nextjs-developer'),
    ('AgriciDaniel/claude-seo', 'AgriciDaniel_claude-seo/LICENSE', 'seo-technical, seo-schema, seo-cluster, seo-content; vendored scripts'),
    ('jnMetaCode/agency-agents-ru', 'jnMetaCode_agency-agents-ru/LICENSE', 'yandex-seo-specialist'),
    ('VoltAgent/awesome-claude-code-subagents', 'VoltAgent_awesome-claude-code-subagents/LICENSE', 'landing-page-copywriter, ux-microcopy-reviewer'),
    ('anthropics/claude-plugins-official', 'anthropics_claude-plugins-official/LICENSE', 'silent-failure-hunter (Apache-2.0)'),
    ('anthropics/skills', 'anthropics_skills/skills/frontend-design/LICENSE.txt', 'skill frontend-design (Apache-2.0)'),
    ('Leonxlnx/taste-skill', 'Leonxlnx_taste-skill/LICENSE', 'skill taste-skill'),
    ('greensock/gsap-skills', 'greensock_gsap-skills/LICENSE', 'skills gsap-*'),
    ('emilkowalski/skills', 'emilkowalski_skills/LICENSE', 'skills animate, review-animations, animation-performance, improve-animations, find-animation-opportunities, animation-vocabulary'),
    ('coreyhaines31/marketingskills', 'coreyhaines31_marketingskills/LICENSE', 'skills copywriting, cro, lead-magnets, popups, product-marketing, schema, site-architecture'),
    ('rdsolod-ui/claude-yandex-seo', 'rdsolod-ui_claude-yandex-seo/LICENSE', 'skill yandex-seo'),
]
out = ['# Third-party licenses\n', 'Agent and skill files in `.claude/` were taken from these repositories (modified for this project: renamed frontmatter, project notes appended, outdated lines removed).\n']
for repo, lic, what in LIC:
    out.append(f'\n## {repo}\n\nUsed for: {what}\n\nSource: https://github.com/{repo}\n\n```\n{read(lic).strip()}\n```\n')
open(os.path.join(ROOT, 'docs', 'THIRD_PARTY_LICENSES.md'), 'w', encoding='utf-8', newline='\n').write(''.join(out))
print('licenses written')
