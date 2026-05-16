# VulnForce - Professional Hacking Reporting Platform

VulnForce is a self-hosted web platform for managing pentesting projects, findings, reusable report templates, vulnerability writeups, and final client-ready reports.

<img width="3214" height="1458" alt="VulnForce dashboard" src="https://github.com/user-attachments/assets/16e48dd3-1bed-435b-ab6e-6df9815f47c4" />

## Overview

VulnForce is designed for offensive security teams that need a structured workflow for technical reporting. It combines project management, vulnerability libraries, section-based Markdown editing, TODO tracking, and HTML report preview/export in one local-first application.

The reporting workflow is inspired by mature pentesting report platforms such as SysReptor: report content is edited as independent sections, templates can be imported directly into editable report sections, and reviewers can jump from pending TODO markers in the report preview back to the exact editable section.

## Key Features

- Project and client management for pentesting engagements.
- Finding management with severity, CVSS score, evidence, and Markdown writeups.
- Reusable project templates and vulnerability templates.
- Section-based report editor with Markdown, preview, and split view modes.
- Resizable split editor with live visual Markdown preview.
- Formatting toolbar for bold, italic, code, and bullet lists.
- TODO tracking: uppercase `TODO` markers are highlighted in red, shown as `TO DO` in report preview, and linked back to the editable source section.
- HTML report preview with table of contents, finding severity badges, pending TODO panel, and dark/light mode readability.
- HTML export for delivery or offline review.
- Docker deployment script for isolated local environments.

## Reporting Workflow

1. Create a project and assign it to a client.
2. Import a project template or vulnerability entry.
3. The imported content is split into editable sections based on top-level Markdown headings (`#` and `##`).
4. Edit each section in one of three modes:
   - `Split`: Markdown editor and rendered preview side by side.
   - `MD`: full-width Markdown editor.
   - `Preview`: rendered visual preview.
5. Add `TODO` anywhere in uppercase to mark pending work.
6. Open the report preview to review the final HTML, pending TODOs, and table of contents.
7. Click any pending `TO DO` item to jump back to the corresponding editable section.
8. Export the report as HTML when ready.

## Technology Stack

- Next.js 15 with the App Router.
- React and TypeScript.
- Tailwind CSS and shadcn-style UI primitives.
- `react-markdown` with GFM support for report rendering.
- `react-resizable-panels` for split-view editing.
- Docker for local deployment.

## Requirements

- Node.js 22.13+.
- pnpm 11.
- Docker, if using `deploy.sh`.

## Quick Start

```bash
git clone <repo-url>
cd <repo-folder>
pnpm install
pnpm dev
```

Open `http://localhost:9002`.

## Docker Deployment

VulnForce includes `deploy.sh` for local Docker deployment. By default it binds to `127.0.0.1:47474`.

```bash
bash deploy.sh
```

Useful options:

```bash
bash deploy.sh --port=47474
PORT=8080 bash deploy.sh
HOST_BIND=0.0.0.0 bash deploy.sh
SHOW_BUILD_LOGS=1 bash deploy.sh
SKIP_PRUNE=1 bash deploy.sh
```

The deploy script:

- Checks Docker availability.
- Removes any previous `vulnforce` container.
- Builds the Docker image with BuildKit plain progress.
- Shows a live build counter with elapsed time, completed/cached steps, and current build step.
- Starts the app container on the selected bind address and port.
- Stores persistent local data in project folders:
  - `./data`
  - `./uploads`
  - `./logs`

The default bind address is localhost for safer local use. Only set `HOST_BIND=0.0.0.0` in controlled environments.

## Useful Scripts

- `pnpm dev` - start the development server on port `9002`.
- `pnpm build` - build for production.
- `pnpm start` - start the production build.
- `pnpm lint` - run ESLint.
- `pnpm typecheck` - run TypeScript checks.

## Project Structure

- `src/app/` - App Router pages and dashboard routes.
- `src/components/` - Reusable UI and report rendering components.
- `src/context/` - Application state providers.
- `src/lib/` - Data models, template data, Markdown helpers, and utilities.
- `deploy.sh` - Docker deployment helper.
- `Dockerfile` - Production container build.

## Main Areas

- **Dashboard:** project metrics, recent activity, and quick access.
- **Projects:** project details, section-based report editor, findings, and settings.
- **Findings:** detailed vulnerability findings with Markdown sections.
- **Clients:** client and contact records.
- **Vulnerabilities:** reusable vulnerability knowledge base with CVSS/CWE metadata.
- **Templates:** reusable project report templates.
- **Backup:** data export/import workflows.

## Security Notes

- Treat reports, findings, screenshots, payloads, and customer information as sensitive data.
- Keep deployments bound to localhost unless the environment is explicitly controlled.
- Use HTTPS, access control, and encrypted storage for real multi-user deployments.
- Review exported HTML before delivery to ensure no pending `TO DO` items remain.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
