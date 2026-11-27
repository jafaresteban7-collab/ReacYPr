# M10.2. JSX con React — Prototipo funcional

**Autor:** Alvaro Esteban Jimenez<br>
**Repositorio:** https://github.com/jafaresteban7-collab/ReacYPr<br>
**Aplicación desplegada:** https://reac-y-pr.vercel.app/

Evolución del proyecto base `m10-2-jsx-react-demo` (React 18 + Vite) desde una demo técnica hasta un prototipo funcional, implementando los 10 tickets del backlog del sprint.

## Mejoras implementadas

| Ticket | Archivo | Resumen |
| --- | --- | --- |
| 01 | `App.jsx`, `index.css` | Botón en la cabecera para alternar modo claro/oscuro (clase CSS en el contenedor principal, recordado en `localStorage`) y footer con autor, módulo y año calculado con `new Date().getFullYear()`. |
| 02 | `01_SintaxisYFragmentos.jsx` | `#campo-alumno` es un input controlado: error en rojo con `role="alert"` por debajo de 3 caracteres y saludo en tiempo real a partir de 3. |
| 03 | `02_ExpresionesYEstilos.jsx` | Calculadora fiscal con `<select>` de IVA (21 %, 10 %, 4 %), descuento acotado entre 0 y 50 % y desglose completo con 2 decimales. El total se resalta en verde con `style={{ }}` cuando hay descuento. |
| 04 | `03_RenderizadoCondicional.jsx` | Corregida la «trampa del 0» (`Boolean(notificaciones) && …`), botón «Marcar todas como leídas» deshabilitado sin avisos y estado vacío «Estás al día…». |
| 05 | `04_ListasYKeys.jsx` | Bloqueo de módulos duplicados sin distinguir mayúsculas, buscador por nombre o código y contador «Mostrando X de Y módulos». |
| 06 | `05_EventosYSeguridadXSS.jsx` | Historial de los últimos 5 eventos con `.map()` y `key` única, botón «Limpiar historial» y 3 botones que cargan payloads XSS de prueba (`<img onerror>`, `<script>`, `<svg onload>` + `javascript:`). |
| 07 | `06_DemoIntegradora.jsx` | Buscador por nombre combinable con «Solo aprobados», ordenación por nota (desc/asc) y nombre (A–Z), y estado vacío. |
| 08 | `06_DemoIntegradora.jsx` | `EXPEDIENTES` pasa a `useState`; formulario controlado de alta (nombre obligatorio, nota 0–10, módulos separados por comas) con id único y limpieza de campos. |
| 09 | `ResumenKPIs.jsx` | Componente reutilizable `<ResumenKPIs alumnos={…} />` con total de alumnos, nota media (2 decimales) y % de aprobados, calculados sobre la lista filtrada. |
| 10 | `06_DemoIntegradora.jsx` | Guardado automático de los expedientes en `localStorage`, carga al iniciar y botón «Restablecer datos iniciales». Consola sin warnings y `npm run build` sin errores. |

También se corrigió un error del proyecto base: el payload XSS inicial tenía comillas sin escapar y `npm run build` fallaba.

## Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ para producción
```

## Estructura

Cada pestaña de la aplicación corresponde a un archivo numerado dentro de `src/components/`:

1. `01_SintaxisYFragmentos.jsx` — Fragmentos, cierre obligatorio, `className`, `htmlFor` e input controlado.
2. `02_ExpresionesYEstilos.jsx` — Expresiones `{ }`, estilos en línea y calculadora fiscal.
3. `03_RenderizadoCondicional.jsx` — Early return, ternario, `&&` y la trampa del `0`.
4. `04_ListasYKeys.jsx` — `.map()`, `key`, buscador y control de duplicados.
5. `05_EventosYSeguridadXSS.jsx` — Eventos, historial y banco de pruebas XSS.
6. `06_DemoIntegradora.jsx` + `ResumenKPIs.jsx` — Panel de expedientes completo.

## Despliegue

Desplegado en Vercel en https://reac-y-pr.vercel.app/ importando este repositorio (preset Vite: build `npm run build`, salida `dist`).
