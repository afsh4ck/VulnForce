# **App Name**: VulnForce

## Core Features:

- Vulnerability Database: A searchable catalog of over 250 vulnerabilities with detailed technical information in both Spanish and English, including descriptions, impacts, PoCs, mitigations, and references (CVE/CWE/OWASP). Allow for full-text search, severity filters, and custom tag support.
- CRUD Management: Tools for creating, reading, updating, and deleting Clients and Projects, with customizable fields such as name, contact, logo, scope, dates, and member assignments.
- Findings Editor: A split-view Markdown editor with live HTML preview for creating and editing findings. It supports images, tables, code snippets, and attachments, along with auto-saving and version history.
- Report Generation: The capability to export findings into professional HTML and PDF reports, complete with a customizable table of contents, dark mode CSS, logos, and configurable section ordering.
- Backup and Import: Functions for creating local backups (as .vulnforce-backup or .zip) that include all clients, projects, findings, custom vulnerabilities, and exported reports. Also enables restoring or importing backups, with options to select specific elements and compatibility checks.
- Template generation (AI powered): Leverage a large language model to analyze findings data and recommend optimal language for generating personalized reusable templates to avoid rewriting the same finding's information. The tool suggests sentences to complete the finding sections like Description, Risk and Mitigation.

## Style Guidelines:

- Primary color: A deep indigo (#4B0082) to convey professionalism and sophistication, subtly nodding to security contexts without being cliche.
- Background color: A light gray (#F0F0F0), nearly desaturated indigo to support prolonged use by being gentle on the eyes.
- Accent color: A vibrant teal (#008080), as an analogous contrast that complements the indigo while standing out for interactive elements.
- Headline font: 'Space Grotesk' (sans-serif) for headlines, for a modern, computerized feel; Body font: 'Inter' (sans-serif) for body text, for a clean, neutral reading experience
- Code font: 'Source Code Pro' (monospace) for code snippets
- Crisp, minimalist icons that clearly represent different vulnerabilities and functions, following a consistent style across the app.
- A clean, intuitive layout with a focus on maximizing screen real estate for the Markdown editor and HTML preview, using a split-view design.