# VulnForce - Plataforma profesional para informes de pentesting

VulnForce es una plataforma web autoalojada para gestionar proyectos de pentesting, clientes, hallazgos, plantillas reutilizables, biblioteca de vulnerabilidades y reportes finales listos para entregar.

<img width="3450" height="1892" alt="image" src="https://github.com/user-attachments/assets/4e8c1004-879e-4299-818c-726bbabdb54c" />

## Índice

- [Descripción](#descripción)
- [Características principales](#características-principales)
- [Flujo de trabajo de reporting](#flujo-de-trabajo-de-reporting)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Inicio rápido en desarrollo](#inicio-rápido-en-desarrollo)
- [Despliegue](#despliegue)
- [Linux recomendado](#linux-recomendado)
- [Windows](#windows)
- [macOS](#macos)
- [Opciones de deploy.sh](#opciones-de-deploysh)
- [Scripts útiles](#scripts-útiles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Secciones principales](#secciones-principales)
- [Notas de seguridad](#notas-de-seguridad)
- [Changelog](#changelog)

## Descripción

VulnForce está diseñada para equipos de seguridad ofensiva que necesitan un flujo estructurado para generar informes técnicos y ejecutivos. Combina gestión de proyectos, base de conocimiento de vulnerabilidades, editor Markdown por secciones, seguimiento de pendientes `TODO` y previsualización/exportación HTML.

El flujo de reporting está inspirado en plataformas maduras como SysReptor: el contenido se trabaja como secciones independientes, las plantillas se importan directamente como secciones editables y los revisores pueden saltar desde los pendientes del informe a la sección exacta donde deben corregir contenido.

## Características principales

- Gestión de proyectos y clientes.
- Gestión de hallazgos con severidad, CVSS, evidencias y contenido Markdown.
- Plantillas reutilizables de proyecto y vulnerabilidades.
- Editor de reporte por secciones con modos `Split`, `MD` y `Preview`.
- El mismo editor Markdown por secciones en informes, hallazgos, plantillas de proyecto y plantillas de vulnerabilidades.
- Vista dividida redimensionable con previsualización visual de Markdown.
- Barra de formato para negrita, cursiva, código y listas.
- Seguimiento de `TODO` en mayúsculas:
  - Se resaltan en rojo dentro del editor Markdown.
  - Se resaltan en rojo en las previsualizaciones.
  - En el informe se muestran como `TO DO`.
  - Cada pendiente enlaza de vuelta a la sección editable correspondiente.
- Previsualización HTML del informe con índice, panel de pendientes, badges de severidad y legibilidad en modo claro/oscuro.
- Iconografía basada en Phosphor Icons y selectores de icono con miniaturas visuales.
- Exportación HTML para entrega o revisión offline.
- Despliegue Docker local con contador de progreso durante la construcción de la imagen.

## Flujo de trabajo de reporting

1. Crear un proyecto y asociarlo a un cliente.
2. Importar una plantilla de proyecto o una vulnerabilidad desde la biblioteca.
3. El contenido importado se divide automáticamente en secciones editables usando titulares Markdown de primer y segundo nivel (`#` y `##`).
4. Editar cada sección en uno de estos modos:
   - `Split`: editor Markdown y previsualización renderizada lado a lado.
   - `MD`: editor Markdown a ancho completo.
   - `Preview`: vista visual renderizada.
5. Escribir `TODO` en mayúsculas en cualquier punto para marcar trabajo pendiente.
6. Abrir la previsualización del informe para revisar HTML final, índice y pendientes.
7. Pulsar cualquier `TO DO` pendiente para volver a la sección editable exacta.
8. Exportar el informe como HTML cuando no queden pendientes.

## Tecnologías

- Next.js 15 con App Router.
- React y TypeScript.
- Tailwind CSS y componentes UI estilo shadcn.
- Phosphor Icons para la iconografía de la interfaz.
- `react-markdown` con soporte GFM para renderizado de informes.
- `react-resizable-panels` para edición en vista dividida.
- Docker para despliegue local.

## Requisitos

- Node.js 22.13+.
- pnpm 11.
- Docker, si se usa el despliegue con `deploy.sh`.

## Inicio rápido en desarrollo

```bash
git clone <repo-url>
cd <repo-folder>
pnpm install
pnpm dev
```

Abre `http://localhost:9002`.

## Despliegue

El despliegue recomendado es Linux con Docker y `deploy.sh`. El script construye la imagen, muestra progreso en tiempo real, elimina el contenedor anterior y arranca VulnForce en `127.0.0.1:47474` por defecto.

Los datos persistentes se guardan en carpetas locales del proyecto:

- `./data`
- `./uploads`
- `./logs`

## Linux recomendado

1. Instala Docker y Git.

```bash
sudo apt-get update
sudo apt-get install -y git docker.io
sudo systemctl enable --now docker
```

2. Clona el repositorio.

```bash
git clone https://github.com/afsh4ck/VulnForce.git
cd VulnForce
```

3. Ejecuta el despliegue.

```bash
sudo bash deploy.sh
```

4. Abre la aplicación.

```text
http://127.0.0.1:47474
```

Si tu usuario no tiene acceso al socket de Docker, ejecuta el script con `sudo` o añade tu usuario al grupo `docker`.

```bash
sudo usermod -aG docker "$USER"
newgrp docker
```

## Windows

El flujo recomendado en Windows es usar Docker Desktop con WSL2 habilitado.

### 1. Despliegue con Docker

1. Instala:

- Docker Desktop para Windows.
- Git for Windows.
- Node.js 22.13+ si quieres ejecutar la app en desarrollo.
- WSL2, recomendado para usar `deploy.sh` con Bash.

2. Clona el repositorio desde PowerShell, Git Bash o WSL.

```powershell
git clone https://github.com/afsh4ck/VulnForce.git
cd VulnForce
```

3. Para desarrollo local en Windows:

```powershell
corepack enable
corepack pnpm install
corepack pnpm dev
```

Abre `http://localhost:9002`.

4. Para despliegue Docker, ejecuta el script desde WSL o Git Bash con Docker Desktop iniciado:

```bash
sudo bash deploy.sh
```

Abre `http://127.0.0.1:47474`.

### 2. Despliegue con Python
Esta opción tiene un funcionamiento un poco más lento, ya que compila cada página estática al acceder.

```powershell
git clone https://github.com/afsh4ck/VulnForce.git
cd VulnForce
python3 app.py
```

## macOS

1. Instala:

- Docker Desktop para macOS.
- Git.
- Node.js 22.13+ si quieres ejecutar la app en desarrollo.

2. Clona el repositorio.

```bash
git clone https://github.com/afsh4ck/VulnForce.git
cd VulnForce
```

3. Para desarrollo local:

```bash
corepack enable
corepack pnpm install
corepack pnpm dev
```

Abre `http://localhost:9002`.

4. Para despliegue Docker:

```bash
bash deploy.sh
```

Abre `http://127.0.0.1:47474`.

## Opciones de deploy.sh

```bash
bash deploy.sh --port=47474
PORT=8080 bash deploy.sh
HOST_BIND=0.0.0.0 bash deploy.sh
SHOW_BUILD_LOGS=1 bash deploy.sh
SKIP_PRUNE=1 bash deploy.sh
```

Opciones relevantes:

- `--port=NNNN` o `PORT=NNNN`: cambia el puerto local.
- `HOST_BIND=0.0.0.0`: expone el servicio en todas las interfaces de red.
- `SHOW_BUILD_LOGS=1`: muestra el log completo de construcción Docker.
- `SKIP_PRUNE=1`: evita la limpieza automática de contenedores detenidos e imágenes/cache colgantes.

El script muestra durante el build:

- Tiempo transcurrido.
- Pasos completados o cacheados.
- Paso actual de BuildKit.

## Scripts útiles

- `pnpm dev`: arranca el servidor de desarrollo en el puerto `9002`.
- `pnpm build`: compila para producción.
- `pnpm start`: arranca la versión compilada.
- `pnpm lint`: ejecuta ESLint.
- `pnpm typecheck`: ejecuta la comprobación de tipos.

## Estructura del proyecto

- `src/app/`: rutas principales del App Router y dashboard.
- `src/components/`: componentes reutilizables de UI y renderizado.
- `src/context/`: proveedores de estado de la aplicación.
- `src/lib/`: modelos, datos base, helpers Markdown y utilidades.
- `deploy.sh`: script de despliegue Docker.
- `Dockerfile`: construcción del contenedor de producción.

## Secciones principales

- **Dashboard:** métricas, actividad reciente y accesos rápidos.
- **Proyectos:** detalles del proyecto, editor de informe por secciones, hallazgos y configuración.
- **Hallazgos:** vulnerabilidades documentadas con secciones Markdown.
- **Clientes:** clientes y datos de contacto.
- **Vulnerabilidades:** biblioteca reutilizable con CVSS, CWE, referencias y texto técnico.
- **Plantillas:** plantillas reutilizables para informes.
- **Backup:** flujos de exportación e importación de datos.

## Notas de seguridad

- Trata informes, hallazgos, capturas, payloads y datos de clientes como información sensible.
- Mantén el servicio ligado a localhost salvo que estés en un entorno controlado.
- Usa HTTPS, control de acceso y almacenamiento cifrado en despliegues multiusuario reales.
- Revisa el HTML exportado antes de entregarlo y asegúrate de que no quedan elementos `TO DO`.

## Changelog

Consulta [CHANGELOG.md](CHANGELOG.md).
