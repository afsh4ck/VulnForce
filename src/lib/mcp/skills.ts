// Skills served to MCP clients: markdown playbooks (with Claude Code style
// frontmatter) that teach an AI agent how to build professional reports in
// VulnForce while spending as few tokens as possible. Served on demand via the
// `get_skill` / `list_skills` tools and the `prompts/*` MCP methods, so the
// always-loaded `initialize` instructions stay tiny.
//
// Content is embedded as strings (not read from disk) so it survives the
// Next.js standalone build, where `src/` is not present at runtime. Each entry
// is a complete SKILL.md, frontmatter included, so a client can save it as-is.

export type SkillMeta = {
  id: string;
  name: string;
  description: string;
};

export type Skill = SkillMeta & {
  /** Full markdown, frontmatter included (ready to save as SKILL.md). */
  content: string;
  /** Body only, frontmatter stripped (used for MCP prompt messages). */
  body: string;
};

const SKILL_FILES: string[] = [
  `---
name: vulnforce-reports
description: Router skill for generating professional pentest reports through the VulnForce MCP server. Load this first, then load only the area skill you need.
---

# VulnForce reports

You are connected to VulnForce, a pentest reporting platform. A **report** is the
markdown \`reportBody\` of a project. **Findings** are separate structured records
the report renders automatically.

## Token-efficient workflow

1. \`list_projects\` -> pick a \`projectId\` (or \`create_report\`).
2. Load the area skill you need with \`get_skill\` (or the matching MCP prompt):
   - **vulnforce-report-structure** - how to shape the report body, sections,
     templates, the \`{{findings.table}}\` and \`{{findings.details}}\` markers.
   - **vulnforce-findings-workflow** - creating and writing findings, the
     reusable vulnerability library.
   - **vulnforce-cvss-scoring** - severity bands and CVSS conventions.
   - **vulnforce-import** - importing Obsidian or GitBook markdown, with images.
3. Read current state (\`get_report\`, \`list_findings\`) before writing.
4. Write with \`update_report\` / \`append_to_report\` for the body and
   \`create_finding\` / \`update_finding\` for findings.
5. Stop. Do not re-read what you just wrote.

## Rules that save the most tokens and rework

- Do **not** paste vulnerabilities into the report body. One \`create_finding\`
  per vulnerability; the report renders them itself.
- Build the body from a **small** set of \`#\`/\`##\` sections. Every \`#\` and \`##\`
  becomes a separate editable block in the UI; \`###\`/\`####\` stay nested.
- Reuse project templates instead of writing structure from scratch
  (\`ptpl-4\` is the CPTS certification template).
- Prefer \`append_to_report\` over resending the whole body.

## Tool map

| Need | Tool |
|---|---|
| Find / create a report | \`list_projects\`, \`create_report\` |
| Read / write body | \`get_report\`, \`update_report\`, \`append_to_report\` |
| Clients | \`list_clients\` |
| Findings | \`list_findings\`, \`get_finding\`, \`create_finding\`, \`update_finding\`, \`delete_finding\` |
| Vulnerability library | \`list_vulnerabilities\`, \`get_vulnerability\` |
| Skills | \`list_skills\`, \`get_skill\` |
`,

  `---
name: vulnforce-report-structure
description: How to shape a VulnForce report body - section hierarchy, project templates, and the findings markers. Load via the VulnForce MCP when writing or restructuring a report.
---

# VulnForce report structure

## Block model

The editor turns **every \`#\` and \`##\` heading into a separate editable block**.
\`###\`/\`####\` stay nested inside their parent block.

- Use \`#\` only for the few main sections.
- Use \`##\` only for genuine major subsections.
- Use \`###\`/\`####\` for everything deeper.
- Never emit a long flat list of \`#\`/\`##\` headings - it fragments the report.

Each heading must be followed by content (no empty sections).

## Recommended sections

For a network / infrastructure pentest, mirror the certification structure:

1. Executive Summary
2. Approach
3. Scope (in-scope assets table)
4. Assessment Overview and Recommendations
5. Network Penetration Test Assessment Summary (\`{{findings.table}}\` here)
6. Technical Findings Details (\`{{findings.details}}\` here)
7. Internal Network Compromise Walkthrough
8. Remediation Summary (Short / Medium / Long Term)
9. Appendix (severities, host/service discovery, exploited hosts, compromised
   users, cleanup, flags)

## Templates

Start from a project template instead of writing structure by hand. Built-in
ids: \`ptpl-1\` web app, \`ptpl-2\` internal network, \`ptpl-3\` mobile,
\`ptpl-4\` certification report (HTB CPTS structure), \`ptpl-5\` machine writeup.
A new project created from a template already contains the full skeleton with
\`[TODO: ...]\` markers - fill those in rather than replacing sections.

## Markers (replaced at render time)

| Marker | Renders |
|---|---|
| \`{{findings.table}}\` | Live summary table of findings (title, severity, CVSS, link). |
| \`{{findings.details}}\` | Every finding's full body, ordered by severity, in place. If absent, findings are appended in a \`# Findings\` section at the end. |

## Template variables (resolved in the report preview)

\`{{client.name}}\`, \`{{project.startDate}}\`, \`{{project.endDate}}\`,
\`{{pentester.name}}\`, \`{{vulnerabilities.count|critical|high|medium|low|informational}}\`.
Only \`group.key\` with letters is supported. Anything unresolved renders as an em dash.

## Writing

- \`update_report\` replaces the whole body; \`append_to_report\` adds a section.
- Keep \`[TODO: ...]\` markers where information is genuinely missing - the UI
  tracks them as pending items.
`,

  `---
name: vulnforce-findings-workflow
description: How to create and write findings in VulnForce and reuse the vulnerability library. Load via the VulnForce MCP when adding vulnerabilities to a report.
---

# VulnForce findings workflow

## One finding per vulnerability

Do **not** write vulnerabilities into the report body. Call \`create_finding\`
once per issue:

- \`projectId\` (required)
- \`title\` (required) - concise, e.g. "Kerberoastable service account with weak password"
- \`severity\` (required) - \`Critical | High | Medium | Low | Informational\`
- \`cvss\` - base score 0-10 (see the vulnforce-cvss-scoring skill)
- \`markdown\` - the finding body (see below)
- \`vulnerabilityId\` - optional link to a library entry

The report renders each finding as an \`##\` heading automatically (with a
severity badge and CVSS), wherever \`{{findings.details}}\` sits, otherwise at the
end. Findings are ordered by CVSS descending.

## Finding markdown body

The \`##\` title is added by the renderer, so start at \`###\`:

\`\`\`
### Description
What the issue is, where it was found.

### Evidence
Commands, output, screenshots (as markdown images).

### Impact
Concrete consequence for the client.

### Affected Components
Hosts / URLs / accounts.

### Remediation
Actionable fix, prioritised.
\`\`\`

Keep evidence tight - paste the decisive command and output, not full scans.

## Reusing the vulnerability library

\`list_vulnerabilities\` returns reusable bilingual templates (id, titles,
severity, cvss, cwe, tags). \`get_vulnerability\` returns the full entry. When one
matches, pass its id as \`vulnerabilityId\` and adapt its text into the finding's
\`markdown\` rather than writing from zero.

## Editing

- \`update_finding\` changes only the fields you pass.
- \`delete_finding\` removes one.
- \`list_findings\` (optionally \`projectId\`) to see what already exists before
  creating duplicates.

## Summary table

Put \`{{findings.table}}\` in the report body once (typically in the assessment
summary section). It stays in sync automatically - never hand-write that table.
`,

  `---
name: vulnforce-cvss-scoring
description: Severity bands and CVSS conventions used by VulnForce. Load via the VulnForce MCP when assigning severity or cvss to a finding.
---

# VulnForce CVSS scoring

VulnForce uses **CVSS v3.1** base scores. \`severity\` and \`cvss\` are separate
fields on a finding; keep them consistent using the bands below.

| Severity | CVSS base score |
|---|---|
| Critical | 9.0 - 10.0 |
| High | 7.0 - 8.9 |
| Medium | 4.0 - 6.9 |
| Low | 0.1 - 3.9 |
| Informational | 0.0 |

## Assigning a score

1. Derive the CVSS v3.1 base vector from the eight base metrics: AV, AC, PR, UI,
   S, C, I, A.
2. Round the computed base score up to one decimal.
3. Set \`severity\` to the band that score falls into.

Vector string format:
\`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H\`

## Guidance

- \`Informational\` findings carry \`cvss: 0.0\`. Use them for hardening
  observations that are not vulnerabilities on their own.
- When a finding is based on a library vulnerability (\`vulnerabilityId\`), start
  from that entry's severity and score, then adjust for the specific context
  (exposure, reachability, existing controls).
- Do not inflate scores. A finding that requires local access and high
  privileges is not Critical just because the impact is high.
- If you record a full vector in the finding markdown, put it under
  \`### Description\` or a \`### CVSS\` subsection so it renders inside the finding.
`,

  `---
name: vulnforce-import
description: Import Markdown from Obsidian or GitBook into a VulnForce report, keeping images working. Load via the VulnForce MCP when the source content comes from an Obsidian vault or a GitBook export/page.
---

# VulnForce import

Convert the source Markdown to plain GitHub-flavoured Markdown, then write it
with \`update_report\` / \`append_to_report\` (or into a finding). First read
**vulnforce-report-structure** for the heading rules.

## Images: the core concern

The report renders \`![alt](URL)\` with a plain \`<img>\`. A URL only works if it
is **publicly reachable and returns \`Content-Type: image/*\`**.

- MCP has no image-upload tool. You cannot embed a local file. Images that only
  exist on disk must be added by the user through the editor's image button;
  leave a \`[TODO: insert screenshot]\` marker where one belongs.
- After rewriting an image URL, verify it: a fetch must return an image
  content-type, not \`text/html\`. If it returns HTML, the link is wrong (see
  GitBook below).
- Prefer stable, direct image URLs. Query-signed CDN URLs can expire.

## GitBook

- **\`/files/...\` paths from a Markdown export return an HTML page, not the
  image.** Never use them. Use the rendered-image proxy instead:
  \`https://<space>.gitbook.io/<book>/~gitbook/image?url=<encoded-original>&...\`
  (it responds with \`image/jpeg\`). Copy that URL from the published GitBook
  page (right-click the image) or from the page HTML \`<img src>\`.
- \`{% hint style="..." %}...{% endhint %}\` -> blockquote.
- \`{% code %}\` / \`{% tabs %}\` -> fenced code block / keep the first tab.
- \`{% content-ref url="..." %}\` and \`{% embed url="..." %}\` -> a normal link.
- Strip GitBook page frontmatter unless it carries real content.

## Obsidian

- \`![[image.png]]\` (embed) -> \`![image](URL)\` if the image is hosted somewhere
  reachable, otherwise \`[TODO: insert image.png]\`.
- \`![[note#heading]]\` (transclusion) -> inline the referenced text, or link it.
- \`[[note]]\` / \`[[note|alias]]\` (wikilink) -> \`alias\` as plain text, or a link
  if the target has a URL.
- Callouts \`> [!note] Title\` / \`> [!warning]\` -> blockquote with a bold title.
- Strip YAML frontmatter; drop \`%% comments %%\`.
- \`==highlight==\` -> \`**highlight**\`. Tags like \`#tag\` -> plain text or drop.

## After importing

- Re-check heading depth: collapse a flat run of \`#\`/\`##\` into a small set of
  top-level sections with \`###\`/\`####\` beneath (see vulnforce-report-structure).
- Move each vulnerability out of the body into its own \`create_finding\`.
`,
];

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };
  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) data[key] = value;
  }
  return { data, body: match[2].trim() };
}

const SKILLS: Skill[] = SKILL_FILES.map((raw) => {
  const content = raw.trim();
  const { data, body } = parseFrontmatter(content);
  const id = data.name || 'unnamed-skill';
  return { id, name: data.name || id, description: data.description || '', content, body };
});

export function listSkills(): SkillMeta[] {
  return SKILLS.map(({ id, name, description }) => ({ id, name, description }));
}

export function getSkill(id: string): Skill | undefined {
  const key = id.replace(/\.md$/, '');
  return SKILLS.find((s) => s.id === key);
}
