# MiCompañero

Aplicación para la evaluación de la Unidad 2, desarrollada con React, Vite y Tailwind CSS.

## Requisitos

- Node.js 18 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre la dirección que indique Vite (por defecto, `http://localhost:5173`).

## Configuración de la API

La aplicación consume la API indicada en la pauta. Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=https://backend-react-fcsl.onrender.com/api-backend
```

Si modificas `.env`, reinicia el servidor de desarrollo.

## Rutas

- `/` o `/inicio`: bienvenida.
- `/posts`: listado público mediante `GET /posts`; muestra autor, fecha y contadores de reacciones.
- `/crear-post`: formulario para crear publicaciones mediante `POST /posts`; requiere sesión y envía el token JWT.
- `/login`: inicia sesión mediante `POST /auth/login`.
- `/publicaciones`: redirige a `/posts`.
- `/mis-companeros`: listado de usuarios mediante `GET /users`.
- `/registro` o `/registrarme`: formulario que envía los datos mediante `POST /auth/register`.

El registro e inicio de sesión guardan el usuario y el token en `localStorage` bajo
`mi-clase-session`. Las reacciones disponibles son `like`, `love`, `haha`, `wow`,
`sad` y `angry`; se envía el `userId` cuando hay sesión y se actualizan los
contadores con la respuesta de la API. No se implementa edición de publicaciones.

## Comandos

```bash
npm run build
npm run lint
```
