# VulnForce — Herramienta de reportes para Pentesting

Aplicación web para gestionar proyectos, hallazgos y plantillas de informes de pentesting.

## Descripción

VulnForce es una herramienta diseñada para equipos de pentesting y seguridad ofensiva que simplifica la gestión de proyectos, el seguimiento de hallazgos y la generación de informes profesionales. Proporciona una interfaz organizada para mantener evidencias, plantillas de reporte y generar entregables técnicos y ejecutivos.

## Características principales

- Gestión de proyectos y clientes.
- Registro y categorización de hallazgos (vulnerabilidades, pruebas, evidencias).
- Plantillas de informe reutilizables y edición por hallazgo.
- Generación de reportes en formatos listos para entregar.
- Módulos de ayuda basados en AI para resumen y traducción de hallazgos.
- Panel de administración y control de usuarios.

## Tecnologías

- Frontend y backend: Next.js con TypeScript.
- Estilos: Tailwind CSS.
- Arquitectura: App Router y componentes React.
- Código y utilidades: TypeScript en `src/`.

## Requisitos

- Node.js 18+ y npm / pnpm / yarn.
- Entorno de desarrollo con acceso a variables de entorno necesarias para integraciones (p. ej. servicios de AI o almacenamiento), si aplica.

## Instalación (rápida)

1. Clona el repositorio:

```bash
git clone <repo-url>
cd <repo-folder>
```

2. Instala dependencias:

```bash
pnpm install
# o: pnpm install
# o: yarn install
```

3. Ejecuta en modo desarrollo:

```bash
pnpm run dev
# o: pnpm dev
# o: yarn dev
```

Visita `http://localhost:3000` (o el puerto configurado) para acceder a la aplicación.

## Despliegue con Docker

Se incluye soporte para desplegar VulnForce en una máquina dentro de la red local mediante Docker y una red `macvlan`, al estilo del script HackLabs.

1. Asegúrate de tener Docker instalado y el sistema con privilegios `root` para crear interfaces macvlan.

2. Ejecución automática: desde la raíz del repositorio ejecuta:

```bash
sudo bash deploy.sh
```

El script realizará las siguientes acciones:
- Detecta la interfaz de red y la subred local.
- Construye la imagen Docker usando el `Dockerfile` del proyecto.
- Crea una red `macvlan` y un "shim" para permitir que el host alcance el contenedor.
- Asigna una IP libre en el rango `.100–.199` y lanza el contenedor con esa IP.
- Crea volúmenes Docker nombrados para persistir datos: `vulnforce_db`, `vulnforce_uploads`, `vulnforce_logs`.

3. Persistencia de datos: la base de datos y archivos subidos se guardan en volúmenes Docker nombrados, por lo que sobreviven a reinicios y actualizaciones del contenedor.

4. Nota de seguridad: este despliegue usa `macvlan` y cambios de red — solo usar en entornos controlados.

Si prefieres un despliegue con `docker-compose` o en plataformas como Vercel/Docker Swarm, dime y puedo añadir archivos y ejemplos adicionales.

## Scripts útiles

- `npm run dev` — Arranca la app en desarrollo.
- `npm run build` — Compila para producción.
- `npm run start` — Inicia la versión construida.

Consulta `package.json` para ver otros scripts disponibles.

## Estructura relevante del proyecto

- `src/app/` — Rutas y páginas principales (dashboard, proyectos, hallazgos, plantillas).
- `src/components/` — Componentes reutilizables de UI.
- `src/lib/` — Lógica utilitaria, modelos de datos y helpers.
- `src/ai/` — Flujos y utilidades relacionadas con asistencia AI.

## Flujo de trabajo típico

1. Crear un `Proyecto` y registrar cliente.
2. Añadir hallazgos con evidencias, severidad y contexto.
3. Usar plantillas para componer secciones del informe.
4. Generar el reporte final y exportarlo para entrega.

## Seguridad y privacidad

- Tratar la información de hallazgos y evidencias como datos sensibles.
- Asegurar el acceso a la aplicación con autenticación y control de acceso.
- En despliegues reales, usar almacenamiento cifrado y conexiones seguras (HTTPS).

## Contribuir

Si quieres contribuir:

1. Abre un issue describiendo la propuesta o fallo.
2. Crea una rama con un nombre descriptivo.
3. Envía un pull request con cambios claros y pruebas cuando proceda.

## Licencia

Indica aquí la licencia del proyecto (por ejemplo, MIT). Si el repositorio ya incluye un archivo `LICENSE`, siga esa licencia.

## Contacto

Para soporte o consultas: equipo de desarrollo o maintainer del proyecto.

---

Si quieres, puedo adaptar este README para incluir instrucciones de despliegue concreto (Docker, Vercel), variables de entorno requeridas, o ejemplos de plantillas de informe.
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
