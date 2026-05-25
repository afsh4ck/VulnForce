# VulnForce — Professional Hacking Reporting Platform

🚀 VulnForce es una aplicación web autoalojada para gestionar proyectos de pentesting, hallazgos y reportes profesionales. Editor por bloques con previsualización en vivo, sistema de temas para reportes y exportación a HTML, PDF y Markdown.

<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/9b9d3e78-3406-4d32-82ef-5c4de4daebc4" />

## Características

- 🗂️ Proyectos, clientes y hallazgos con severidad, CVSS y evidencias
- 📚 Biblioteca de plantillas de proyecto y de vulnerabilidad reutilizables
- ✍️ Editor por secciones Markdown con vista `Split` / `MD` / `Preview` redimensionable
- 🎨 Sistema de temas de reportes (built-in + personalizables, import/export JSON)
- 🖼️ Editor visual de avatar y logos de cliente (icono cuadrado + horizontal)
- 📤 Exportación a HTML, PDF y Markdown con paridad visual
- 🌗 Light / dark mode y traducciones en tiempo real (ES / EN)
- ✅ Seguimiento de `TODO` con enlaces directos a la sección editable
- 💾 Backup y restauración completos (incluye temas personalizados)
- 🔌 Servidor MCP integrado: conecta cualquier cliente de IA (Claude, Cursor, Claude Code…) para crear y editar informes

## Flujo de trabajo

#### 1. Crear un cliente e introducir sus datos.
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/12db6306-2316-4023-9e7a-ab651eaa389c" />

#### 2. Crear un proyecto y asociarlo a un cliente.
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/7fab2008-a1f7-43cb-86e2-6ac12ab8260d" />

#### 3. Importar una plantilla de proyecto o de vulnerabilidad.
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/2dd0c26c-150c-46ec-9c91-705c2d26fb69" />

#### 4. Escribir contenido y marcar pendientes con `TODO` (se resaltan y vinculan).
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/1ebddbc2-291c-4450-9ba5-9da4fb9bbc41" />

#### 5. Seleccionar un tema visual para el informe
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/77be2ab0-0f5d-49e0-842e-d6ae5585addb" />

#### 6. Previsualizar informe y exportarlo cuando esté listo
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/ecfa10b9-7ddf-49fc-8c0c-8eaa3de2ae74" />

---

## Servidor MCP (IA)
<img width="2560" height="1238" alt="image" src="https://github.com/user-attachments/assets/a2dd80b7-019a-4eaf-b167-665a26374d0b" />

VulnForce expone su propio servidor [MCP](https://modelcontextprotocol.io) (igual que Figma) en `POST /api/mcp` (transporte Streamable HTTP). Cualquier cliente de IA puede conectarse y crear o editar informes mediante herramientas. La sección **MCP** del dashboard muestra el endpoint, un test de conexión y los snippets de configuración.

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
```

Herramientas disponibles: `list_projects`, `get_report`, `create_report`, `update_report`, `append_to_report`, `list_clients`, `list_findings`. Un informe es el cuerpo Markdown de un proyecto. La IA escribe directamente en el almacén; recarga la app para ver los cambios.

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

- `pnpm dev` — desarrollo (puerto `9002`)
- `pnpm build` — build producción
- `pnpm start` — arranca build
- `pnpm typecheck` — comprobación de tipos
- `pnpm lint` — ESLint

## Estructura

- `src/app/` — rutas (dashboard, proyectos, hallazgos, plantillas, temas, MCP, ajustes)
- `src/app/api/mcp/` — endpoint del servidor MCP (Streamable HTTP)
- `src/components/` — UI reutilizable
- `src/context/` — estado global (datos, tema, idioma, usuario)
- `src/lib/` — design tokens, plantillas, motor de temas, exportadores y herramientas MCP

## Notas de seguridad

- Trata informes, hallazgos y capturas como información sensible.
- Mantén VulnForce accesible solo desde entornos controlados o vía VPN.
- En despliegues multiusuario usa HTTPS y control de acceso.

## Changelog

Consulta [CHANGELOG.md](CHANGELOG.md).
