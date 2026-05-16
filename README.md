# VulnForce - Professional Hacking Reporting Platform

Aplicación web para gestionar proyectos, hallazgos y plantillas de informes de pentesting.

<img width="3214" height="1458" alt="image" src="https://github.com/user-attachments/assets/16e48dd3-1bed-435b-ab6e-6df9815f47c4" />

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

- Node.js 22.13+ y pnpm 11.
- Entorno de desarrollo con acceso a variables de entorno necesarias para integraciones (p. ej. servicios de AI o almacenamiento), si aplica.

## Instalación (rápida)

1. Clona el repositorio:

```bash
git clone <repo-url>
cd <repo-folder>
```

2. Instala dependencias con pnpm:

```bash
pnpm install
```

3. Ejecuta en modo desarrollo:

```bash
pnpm run dev
```

Visita `http://localhost:9002` para acceder a la aplicación en desarrollo.

## Despliegue con Docker

Se incluye soporte para desplegar VulnForce con Docker usando un bind local por defecto en `127.0.0.1:47474`.

1. Asegúrate de tener Docker instalado y con el daemon accesible para tu usuario.

2. Ejecución automática: desde la raíz del repositorio ejecuta:

```bash
bash deploy.sh
```

El script realizará las siguientes acciones:
- Construye la imagen Docker usando el `Dockerfile` del proyecto.
- Instala dependencias y compila dentro del contenedor con `pnpm`.
- Lanza el contenedor en `127.0.0.1:47474` salvo que configures `PORT` o `--port=NNNN`.
- Crea volúmenes Docker nombrados para persistir datos: `vulnforce_data`, `vulnforce_uploads`, `vulnforce_logs`.

Si Docker no está instalado o el servicio debe iniciarse con `systemctl`, ejecuta el script con `sudo`.

3. Persistencia de datos: la base de datos y archivos subidos se guardan en volúmenes Docker nombrados, por lo que sobreviven a reinicios y actualizaciones del contenedor.

4. Nota de seguridad: este despliegue queda ligado a localhost por defecto. Si expones el servicio en una interfaz de red, hazlo solo en entornos controlados.

Si prefieres un despliegue con `docker-compose` o en plataformas como Vercel/Docker Swarm, dime y puedo añadir archivos y ejemplos adicionales.

## Scripts útiles

- `pnpm dev` - Arranca la app en desarrollo.
- `pnpm build` - Compila para producción.
- `pnpm start` - Inicia la versión construida.

Consulta `package.json` para ver otros scripts disponibles.

## Estructura relevante del proyecto

- `src/app/` — Rutas y páginas principales (dashboard, proyectos, hallazgos, plantillas).
- `src/components/` — Componentes reutilizables de UI.
- `src/lib/` — Lógica utilitaria, modelos de datos y helpers.
- `src/ai/` — Flujos y utilidades relacionadas con asistencia AI.

## Secciones principales

- **Dashboard:** Vista principal con métricas resumidas, actividad reciente, accesos rápidos a proyectos y hallazgos críticos.
- **Proyectos:** Gestión de proyectos de pentesting; crear/editar proyectos, asignar miembros, ver progreso y fechas asociadas.
- **Hallazgos:** Registro detallado de hallazgos por proyecto; cada entrada puede incluir descripción, severidad, evidencia, pasos para reproducir y estado.
- **Clientes:** Catálogo de clientes y contactos asociados; histórico de entregas y relación con proyectos.
- **Vulnerabilidades:** Biblioteca de vulnerabilidades con categorización (CVSS, CWE), estado y referencias; puede usarse para clasificar hallazgos y generar secciones técnicas del informe.
- **Plantillas:** Gestor de plantillas de informe (técnico y ejecutivo) reutilizables; permite crear bloques reutilizables que luego se insertan por hallazgo o por proyecto.
- **Backup:** Módulo para exportar e importar datos (proyectos, hallazgos y archivos) y para programar copias de seguridad; los backups se almacenan fuera del contenedor usando volúmenes persistentes.

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
