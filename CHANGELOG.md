# Changelog

## 2026-05-16

### Added

- Added a section-based project report editor with full-width editable sections.
- Added `Split`, `MD`, and `Preview` modes for each report section.
- Added resizable split-view editing with a highlighted yellow divider on hover/drag.
- Added a Markdown formatting toolbar for bold, italic, inline/code block formatting, and bullet lists.
- Added TODO tracking for uppercase `TODO` markers:
  - TODO markers are highlighted in red in previews.
  - Report preview renders them as `TO DO`.
  - Pending TODO entries link back to the corresponding editable project or finding section.
- Added shared TODO utilities in `src/lib/todo-utils.ts`.
- Added Docker build progress display in `deploy.sh`, including elapsed time, completed/cached steps, and current BuildKit step.

### Changed

- Template and vulnerability imports now load as editable report sections based on top-level Markdown headings (`#` and `##`).
- Markdown parsing now preserves full logical report sections instead of splitting content into small paragraph blocks.
- Project report preview now renders Markdown through the visual Markdown renderer instead of injecting raw Markdown as HTML.
- Improved report HTML preview and exported HTML readability in dark mode and light mode.
- Improved report layout with a wider readable content area, stronger code/table styling, clearer blockquotes, and red TODO links.
- Updated the bullet formatting button to use a list icon.
- Updated Docker deployment documentation to match local folder persistence in `data`, `uploads`, and `logs`.

### Fixed

- Fixed the project editor production build issue caused by an incomplete JSX ternary.
- Fixed Markdown preview rendering for project editor preview mode.
- Fixed TODO navigation to use the project content tab instead of an obsolete scope tab.

