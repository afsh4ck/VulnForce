# VulnForce — Professional Hacking Reporting Platform

🚀 VulnForce es una aplicación web autoalojada para gestionar proyectos de pentesting, hallazgos y reportes profesionales. Editor por bloques con previsualización en vivo, sistema de temas para reportes y exportación a HTML, PDF y Markdown.

<img width="2880" height="1622" alt="vulnforce-banner" src="https://github.com/user-attachments/assets/adc4cc6a-b808-447d-8368-e0a756de01ac" />

## Características

- 🗂️ Proyectos, clientes y hallazgos con severidad, CVSS y evidencias
- 📚 Biblioteca de plantillas de proyecto y de vulnerabilidad reutilizables (incluye plantilla de informe de certificación con la estructura del design CPTS de SysReptor)
- ✍️ Editor por secciones Markdown con vista `Split` / `MD` / `Preview` redimensionable
- 🎨 Sistema de temas de reportes (built-in + personalizables, import/export JSON)
- 🖼️ Editor visual de avatar y logos de cliente (icono cuadrado + horizontal)
- 📤 Exportación a HTML, PDF y Markdown con paridad visual
- 🌗 Light / dark mode y traducciones en tiempo real (ES / EN)
- ✅ Seguimiento de `TODO` con enlaces directos a la sección editable
- 💾 Backup y restauración completos (incluye temas personalizados)
- 🔌 Servidor MCP integrado: conecta cualquier cliente de IA (Claude, Cursor, Claude Code…) para crear y editar informes, con skills de generación descargables bajo demanda
- 🧩 Marcador `{{findings.details}}` para colocar los hallazgos detallados en la sección del informe que elijas

## Flujo de trabajo

#### 1. Crea un cliente e introducir sus datos
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/12db6306-2316-4023-9e7a-ab651eaa389c" />

#### 2. Crea un proyecto y asociarlo a un cliente
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/7fab2008-a1f7-43cb-86e2-6ac12ab8260d" />

#### 3. Importa una plantilla de proyecto o de vulnerabilidad
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/2dd0c26c-150c-46ec-9c91-705c2d26fb69" />

#### 4. Escribe contenido y marcar pendientes con `TODO` (se resaltan y vinculan)
<img width="2536" height="1234" alt="image" src="https://github.com/user-attachments/assets/8747757f-7f6d-4ddc-ab26-5d71bd33b24b" />

#### 5. Añade hallazgos desde la base de datos (+100 plantillas)
<img width="2536" height="1232" alt="image" src="https://github.com/user-attachments/assets/67b406aa-6fbe-468e-8c6c-a8a7d5aaa310" />

#### 6. Selecciona un tema visual para el informe
<img width="3828" height="1804" alt="image" src="https://github.com/user-attachments/assets/d0b6fd6e-5c33-45bf-9909-3057d95222f0" />

#### 7. Previsualiza el informe y expórtalo cuando esté listo
<img width="2534" height="1234" alt="image" src="https://github.com/user-attachments/assets/eaea1068-0f89-4b55-83a3-30e0446eef81" />

---

## Servidor MCP (IA)
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/a2dd80b7-019a-4eaf-b167-665a26374d0b" />

VulnForce expone su propio servidor [MCP](https://modelcontextprotocol.io) en `POST /api/mcp`. Cualquier cliente de IA puede conectarse y crear o editar informes mediante herramientas. La sección **MCP** del dashboard muestra el endpoint, un test de conexión y los snippets de configuración.

Conecta tu cliente al endpoint (en desarrollo, `http://localhost:9002/api/mcp`):

```jsonc
// Clientes con MCP por HTTP nativo (Cursor, VS Code, Claude Code)
{ "mcpServers": { "vulnforce": { "url": "http://localhost:9002/api/mcp" } } }

// Clientes que solo hablan stdio (Claude Desktop): puente con mcp-remote
{ "mcpServers": { "vulnforce": { "command": "npx", "args": ["mcp-remote", "http://localhost:9002/api/mcp"] } } }
```

```bash
# Claude Code CLI
claude mcp add --transport http vulnforce http://localhost:9002/api/mcp

# Codex CLI (añadir, listar y comprobar estado)
codex mcp add vulnforce --url http://localhost:9002/api/mcp && codex mcp list && curl -sS -o /dev/null -w '%{http_code}\n' --max-time 5 http://localhost:9002/api/mcp
```

Herramientas disponibles: `list_skills`, `get_skill`, `list_projects`, `get_report`, `create_report`, `update_report`, `append_to_report`, `list_clients`, `list_findings`, `get_finding`, `create_finding`, `update_finding`, `delete_finding`, `list_vulnerabilities`, `get_vulnerability`. Un informe es el cuerpo Markdown de un proyecto. La IA escribe directamente en el almacén; recarga la app para ver los cambios.

### Skills de generación de informes

Al conectarse, el cliente de IA descarga bajo demanda una serie de *skills* (manuales en Markdown con frontmatter, guardables como `SKILL.md`) que le enseñan a redactar informes profesionales en la plataforma gastando el mínimo de tokens. Se sirven vía las herramientas `list_skills` / `get_skill` y también como *prompts* MCP (`prompts/list`, `prompts/get`).

- `vulnforce-reports` — router: mapa de herramientas y flujo de trabajo eficiente
- `vulnforce-report-structure` — jerarquía de secciones, plantillas y marcadores `{{findings.table}}` / `{{findings.details}}`
- `vulnforce-findings-workflow` — creación y redacción de hallazgos, biblioteca de vulnerabilidades
- `vulnforce-cvss-scoring` — bandas de severidad y convenciones CVSS v3.1
- `vulnforce-import` — importar Markdown de Obsidian o GitBook manteniendo las imágenes

Las instrucciones cargadas en cada conexión son mínimas: solo un puntero a estas skills.

## Tecnologías

- Next.js 15 (App Router) + React + TypeScript
- Tailwind CSS + Radix UI (shadcn)
- `react-markdown` (GFM) y `react-easy-crop`
- Docker para despliegue self-hosted

## Inicio rápido

```bash
git clone https://github.com/afsh4ck/VulnForce.git
cd VulnForce
pnpm install
pnpm dev
```

Abre `http://localhost:9002`.

Requisitos: Node.js >= 22.13, pnpm >= 11.

### Modo producción local (más rápido)

`pnpm dev` recompila en cada acción. Para un uso fluido, compila una vez y sirve el build:

```bash
pnpm build
pnpm start
```

Abre `http://localhost:9002` (mismo puerto que `dev`).

`pnpm dev` usa el directorio `.next-dev` y `pnpm build` / `pnpm start` usan `.next`, así que ambos conviven: puedes alternar entre `pnpm dev` y `pnpm build && pnpm start` sin recompilar. Tras cambiar código, vuelve a ejecutar `pnpm build` para reflejarlo en `pnpm start`.

## Despliegue

Despliegue recomendado: Linux + Docker mediante `deploy.sh`. Por defecto la app se sirve en `127.0.0.1:47474`.

```bash
sudo bash deploy.sh
# Personalización
PORT=8080 bash deploy.sh
HOST_BIND=0.0.0.0 bash deploy.sh
SHOW_BUILD_LOGS=1 bash deploy.sh
```

Volúmenes persistentes: `./data`, `./uploads`, `./logs`.

## Scripts

- `pnpm dev` — desarrollo con HMR (puerto `9002`, directorio `.next-dev`)
- `pnpm build` — build de producción (directorio `.next`)
- `pnpm start` — sirve el build de producción (puerto `9002`)
- `pnpm typecheck` — comprobación de tipos
- `pnpm lint` — ESLint

## Estructura

- `src/app/` — rutas (dashboard, proyectos, hallazgos, plantillas, temas, MCP, ajustes)
- `src/app/api/mcp/` — endpoint del servidor MCP (Streamable HTTP)
- `src/lib/mcp/` — herramientas, handlers y skills del servidor MCP
- `src/components/` — UI reutilizable
- `src/context/` — estado global (datos, tema, idioma, usuario)
- `src/lib/` — design tokens, plantillas, motor de temas, exportadores y herramientas MCP

## Notas de seguridad

- Trata informes, hallazgos y capturas como información sensible.
- Mantén VulnForce accesible solo desde entornos controlados o vía VPN.
- En despliegues multiusuario usa HTTPS y control de acceso.

## Changelog

Consulta [CHANGELOG.md](CHANGELOG.md).
