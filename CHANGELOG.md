# Registro de cambios

## 2026-05-16

### Añadido

- Editor de informes por secciones con bloques editables a ancho completo.
- Modos `Split`, `MD` y `Preview` para cada sección del informe.
- Edición en vista dividida redimensionable con separador amarillo al hacer hover o arrastrar.
- Barra de formato Markdown para negrita, cursiva, código inline/bloque de código y listas.
- Seguimiento de marcadores `TODO` en mayúsculas:
  - Los `TODO` se resaltan en rojo también dentro del editor Markdown.
  - Los `TODO` se resaltan en rojo en las previsualizaciones.
  - La previsualización del informe los muestra como `TO DO`.
  - Los pendientes enlazan de vuelta a la sección editable correspondiente del proyecto o hallazgo.
- Utilidades compartidas para detección y renderizado de TODO en `src/lib/todo-utils.ts`.
- Editor Markdown por secciones compartido en informes, detalle de hallazgos, plantillas de proyecto y plantillas de vulnerabilidades.
- Iconografía de la aplicación migrada a Phosphor Icons.
- Miniaturas de iconos en los selectores de icono de proyectos y plantillas.
- Indicador de progreso de construcción Docker en `deploy.sh`, con tiempo transcurrido, pasos completados/cacheados y paso actual de BuildKit.
- Documentación de despliegue por sistema operativo en `README.md`: Linux recomendado, Windows y macOS.

### Cambiado

- Las importaciones de plantillas y vulnerabilidades ahora se cargan como secciones editables basadas en titulares Markdown de primer y segundo nivel (`#` y `##`).
- El parser Markdown conserva secciones lógicas completas en vez de dividir el contenido en párrafos pequeños.
- La previsualización del editor de proyecto renderiza Markdown con el renderer visual compartido.
- La previsualización HTML del informe y la exportación HTML tienen mejor legibilidad en modo claro y oscuro.
- El layout del informe usa un área de lectura más amplia, estilos más sólidos para tablas/código, blockquotes más claros y enlaces TODO en rojo.
- El botón de listas usa ahora un icono de lista.
- Los elementos de dropdown/selector cambian el texto a amarillo durante hover/focus.
- La documentación Docker refleja la persistencia actual en carpetas locales `data`, `uploads` y `logs`.
- `README.md` pasa a estar completamente en español e incluye índice con enlaces internos.

### Corregido

- Corregido el fallo de compilación del editor de proyecto provocado por un ternario JSX incompleto.
- Corregido el renderizado Markdown de la vista `Preview` del editor de proyecto.
- Corregida la navegación de TODO para usar la pestaña de contenido del proyecto en lugar de una pestaña obsoleta.
