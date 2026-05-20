# VulnForce — Plataforma para informes de pentesting

🚀 VulnForce es una aplicación web autoalojada para gestionar proyectos de pentesting, clientes y reportes. Facilita la creación de informes técnicos y ejecutivos mediante edición por secciones, plantillas reutilizables y exportación a HTML/PDF.

<img width="3450" height="1892" alt="image" src="https://github.com/user-attachments/assets/4e8c1004-879e-4299-818c-726bbabdb54c" />

## Índice rápido

- 📌 [Descripción](#descripción)
- ✨ [Características](#características)
- 🧭 [Flujo de trabajo](#flujo-de-trabajo)
- 🧰 [Tecnologías](#tecnologías)
- ⚙️ [Requisitos](#requisitos)
- ⚡ [Inicio rápido (desarrollo)](#inicio-rápido-en-desarrollo)
- 🚢 [Despliegue](#despliegue)
- 🗂️ [Estructura del proyecto](#estructura-del-proyecto)
- 🔒 [Notas de seguridad](#notas-de-seguridad)
- 📝 [Changelog](#changelog)

## Descripción

VulnForce está diseñada para equipos de seguridad ofensiva que necesitan un flujo estructurado y reproducible para generar informes. Trabaja con:

- Secciones editables (Markdown) por informe
- Plantillas de proyecto y de vulnerabilidad
- Índice automático, badges de severidad y previsualización HTML
- Exportación a HTML y PDF

## Características

- 🗂️ Gestión de proyectos y clientes
- ⚠️ Gestión de hallazgos con severidad, CVSS y evidencias
- 📚 Biblioteca de vulnerabilidades y plantillas reutilizables
- ✍️ Editor por secciones con modos `Split`, `MD` y `Preview`
- 🖥️ Vista dividida redimensionable con previsualización en vivo
- ✅ Seguimiento de `TO DO` que enlaza a la sección editable correspondiente
- 📤 Exportación de informes a HTML y PDF

## Flujo de trabajo

1. Crear un proyecto y asociarlo a un cliente.
<img width="2332" height="1628" alt="image" src="https://github.com/user-attachments/assets/461f45cd-b3e0-4809-8abc-636631940379" />

2. Importar una plantilla de proyecto o de vulnerabilidad.
<img width="3344" height="1326" alt="image" src="https://github.com/user-attachments/assets/d35c06b2-e1cf-45f8-b272-639f20e8336e" />

3. Escribir contenido y marcar pendientes con `TODO` (se resaltan y vinculan).
<img width="2918" height="838" alt="image" src="https://github.com/user-attachments/assets/b07a2bc0-8af6-40ae-8dfb-e489c2a5ff24" />

4. Revisar en la previsualización HTML y exportar cuando esté listo.
<img width="3364" height="1772" alt="image" src="https://github.com/user-attachments/assets/bffdf8f1-323a-4f3f-af96-a45351759dd7" />

## Tecnologías

- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS (estilo shadcn)
- Phosphor Icons
- `react-markdown` (GFM)
- Docker (opcional para despliegue)

## Requisitos

- Node.js >= 22.13
- pnpm >= 11
- Docker (si se usa `deploy.sh`)

## Inicio rápido (desarrollo)

```bash
git clone https://github.com/afsh4ck/VulnForce.git
cd VulnForce
pnpm install
pnpm dev
```

Abre `http://localhost:9002`.

## Despliegue

El despliegue recomendado es Linux con Docker y `deploy.sh`. Por defecto la app se sirve en `127.0.0.1:47474`.

Datos persistentes (local):

- `./data`
- `./uploads`
- `./logs`

### Opciones comunes de `deploy.sh`

```bash
bash deploy.sh --port=47474
PORT=8080 bash deploy.sh
HOST_BIND=0.0.0.0 bash deploy.sh
SHOW_BUILD_LOGS=1 bash deploy.sh
SKIP_PRUNE=1 bash deploy.sh
```

- `PORT=NNNN` — cambia el puerto.
- `HOST_BIND=0.0.0.0` — expone en todas las interfaces.
- `SHOW_BUILD_LOGS=1` — ver log completo de build.

## Guía rápida por SO

### Linux (recomendado)

```bash
sudo apt-get update
sudo apt-get install -y git docker.io
sudo systemctl enable --now docker
git clone https://github.com/afsh4ck/VulnForce.git
cd VulnForce
sudo bash deploy.sh
```

### macOS

Instala Docker Desktop, clona el repo y para desarrollo:

```bash
corepack enable
corepack pnpm install
corepack pnpm dev
```

### Windows

Usa Docker Desktop con WSL2 para despliegue. Para desarrollo desde PowerShell/Git Bash:

```powershell
git clone https://github.com/afsh4ck/VulnForce.git
cd VulnForce
corepack enable
corepack pnpm install
corepack pnpm dev
```

## Scripts útiles

- `pnpm dev` — servidor de desarrollo (puerto `9002`).
- `pnpm build` — compila producción.
- `pnpm start` — arranca versión compilada.
- `pnpm lint` — ESLint.
- `pnpm typecheck` — comprobación de tipos.

## Estructura del proyecto

- `src/app/` — rutas y pantallas principales.
- `src/components/` — UI reutilizable.
- `src/context/` — proveedores de estado.
- `src/lib/` — helpers, datos y utilidades.
- `deploy.sh`, `Dockerfile` — despliegue y contenedores.

## Notas de seguridad

- Trata informes, hallazgos y capturas como información sensible.
- Mantén VulnForce accesible solo desde entornos controlados o mediante VPN.
- Usa HTTPS, control de acceso y cifrado en despliegues multiusuario.

## Changelog

Consulta [CHANGELOG.md](CHANGELOG.md).
