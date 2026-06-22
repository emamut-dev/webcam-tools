# Webcam Tools

Una aplicación web ligera creada con Vue 3 y Vite para apoyar tareas rápidas de transmisión y webcam.

## Descripción

`webcam-tools` incluye utilidades para:

- Cuenta regresiva por rooms con configuración de duración y nombre de salas.
- Calculadora de tokens para obtener el valor estimado de pago a modelo, estudio y total.
- Navegación simple basada en Vue Router.

> Nota: La página de `Tags` existe como vista, pero no está habilitada en las rutas actuales.

## Tecnologías

- Vue 3
- Vite
- Vue Router
- Bootstrap 5
- Bootstrap Icons
- Montserrat (fuente)

## Instalación

```bash
pnpm install
```

## Uso

```bash
pnpm dev
```

Abre `http://localhost:5173` en tu navegador.

## Construcción para producción

```bash
pnpm build
```

## Vista previa local

```bash
pnpm preview
```

## Estructura principal

- `src/App.vue` - contenedor principal con navegación y pie de página.
- `src/router/index.js` - rutas de la aplicación.
- `src/views/HomePage.vue` - página de inicio y acceso a herramientas.
- `src/views/TimerPage.vue` - cuenta regresiva por rooms.
- `src/views/TokensCalculatorPage.vue` - calculadora de tokens.
- `src/components/RoomTimers.vue` - lógica de temporizadores de room.

## Dependencias principales

- `vue`
- `vue-router`
- `bootstrap`
- `bootstrap-icons`
- `@fontsource/montserrat`

## Licencia

Este proyecto es privado y no contiene licencia pública especificada.
