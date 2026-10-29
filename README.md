# SportZone — Frontend

Tienda deportiva para fútbol, básquetbol y MMA. Este repositorio contiene el frontend de la Entrega 3, reconstruido con Next.js App Router, TypeScript y Tailwind CSS. El catálogo conserva los productos de la Entrega 1 y los obtiene desde la API; el registro, el inicio de sesión, las solicitudes y el panel de administración se comunican con el backend.

## Repositorios y despliegues

- Frontend: https://github.com/TartarusBoss/Frontend-Entrega3
- Backend: https://github.com/TartarusBoss/Backend-Entrega3
- Sitio en Vercel: pendiente de configurar.
- API en Render o Railway: pendiente de configurar.

Los repositorios ya contienen el código de la entrega, pero estos enlaces no significan que los servicios estén desplegados. Sigue la sección [Desplegar y conectar Vercel con Render](#desplegar-y-conectar-vercel-con-render) para configurar los dos servicios. No uses credenciales locales de prueba en producción.

## Ejecutar localmente

Requisitos: Node.js 20.9 o superior y PostgreSQL.

1. Configura y ejecuta el backend siguiendo [su guía local](https://github.com/TartarusBoss/Backend-Entrega3/blob/main/README.md). Debe estar disponible en `http://localhost:3001`.
2. Copia `.env.example` a `.env.local` y configura `NEXT_PUBLIC_API_HOST=http://localhost:3001`.
3. En esta carpeta, ejecuta `npm install` y luego `npm run dev`.
4. Abre `http://localhost:3000`.

Validaciones disponibles: `npm run lint` y `npm run build`.

## Desplegar y conectar Vercel con Render

El backend tiene un Blueprint en `render.yaml` que prepara el servicio y ejecuta las migraciones Prisma. Estos pasos conectan los despliegues; aún debes ejecutarlos desde las cuentas de Vercel y Render.

1. **Crear PostgreSQL en Render.** Crea una base PostgreSQL de producción en la misma región que el servicio de API. Guarda la URL interna de conexión para usarla como `DATABASE_URL`.
2. **Crear el servicio de API.** En Render, crea un Blueprint desde `TartarusBoss/Backend-Entrega3` y usa su `render.yaml`. Cuando Render solicite valores, configura `DATABASE_URL` y deja `FRONTEND_URL` pendiente hasta crear el sitio. El Blueprint genera `JWT_SECRET`; establece también `JWT_EXPIRES_IN=1h`. El despliegue ejecuta `prisma migrate deploy` antes de iniciar la API.
3. **Cargar el seed de producción una sola vez.** En un entorno confiable, configura la `DATABASE_URL` de producción y contraseñas nuevas para `SEED_ADMIN_PASSWORD` y `SEED_USER_PASSWORD`, y ejecuta `npm run db:seed` desde el repositorio backend. No guardes esas contraseñas en Git ni reutilices las claves de ejemplo. Conserva las credenciales de prueba de producción en un lugar seguro para completar el README de entrega.
4. **Crear el sitio en Vercel.** Importa `TartarusBoss/Frontend-Entrega3` como proyecto Next.js, con la carpeta raíz `./` y la rama `main`. En las variables del entorno de producción añade `NEXT_PUBLIC_API_HOST` con el origen HTTPS de la API de Render, por ejemplo `https://sportzone-api.onrender.com` (sin `/api` al final). Despliega y anota la URL HTTPS que Vercel asigne.
5. **Configurar CORS.** En el servicio backend de Render establece `FRONTEND_URL` con el origen exacto de Vercel, por ejemplo `https://nombre-del-proyecto.vercel.app`, sin una ruta final. Guarda el cambio y vuelve a desplegar la API.
6. **Validar la conexión.** Abre `<URL_DE_API>/health` y confirma que responde `{"status":"ok"}`. Abre el sitio de Vercel, comprueba que cargan los productos y prueba registro, login y una solicitud con una cuenta de usuario. Para probar permisos, confirma `401` sin token y `403` al intentar borrar un producto con una cuenta user. Actualiza los enlaces de despliegue de este README cuando ambos servicios estén comprobados.

Los valores del dominio son ejemplos de formato, no URLs asignadas a estos proyectos. No publiques credenciales de bases de datos, secretos JWT ni tokens.

## Cuentas locales del seed

El seed del backend crea estas cuentas de prueba, siempre que los valores de `.env` del backend coincidan con los del ejemplo:

- Admin: `admin@sportzone.test` / `CambiaEstaClaveAdmin123!`
- Usuario: `usuario@sportzone.test` / `CambiaEstaClaveUser123!`

Son cuentas exclusivamente locales para probar roles. Define claves nuevas si cargas datos en un entorno compartido.

## Decisiones técnicas

- Las páginas de `app/` componen las vistas; catálogo, autenticación y solicitudes separan sus tipos, servicios, hooks y componentes por funcionalidad.
- El catálogo llama a la API mediante `services/product-service.ts` y el cliente común `http.ts`; pagina usando `?page=`, y muestra los estados de carga, error y catálogo vacío.
- El token se guarda en `localStorage` para que la sesión sobreviva al refrescar. Es una decisión sencilla para esta entrega, pero el token queda accesible a JavaScript y un XSS podría robarlo; una cookie `HttpOnly`, `Secure` y `SameSite` sería una alternativa más segura. La autorización real se valida en el backend, no se confía en los datos de rol guardados en el navegador.
- La API responde `401` si falta el token o es inválido/expiró; el cliente común cierra la sesión local y redirige al inicio de sesión. Responde `403` cuando el token sí es válido pero el rol no permite la acción; por ejemplo, un usuario que intente borrar un producto.
- La contraseña solo se envía al endpoint de autenticación; el backend la almacena como hash bcrypt y firma un JWT con el id y el rol.
- La IA se utilizó como apoyo para estructurar componentes y revisar errores. Antes de entregar, verifica que puedes explicar el flujo y las decisiones con tus propias palabras.

## Comprobaciones antes de entregar

- [ ] Configurar y probar ambos despliegues con las variables de producción.
- [ ] Probar registro duplicado, sesión después de refrescar, solicitud de usuario y permisos `401`/`403`.
- [ ] En el navegador, abrir DevTools → Network y guardar una captura de una petición protegida que muestre el encabezado `Authorization` (sin compartir ni publicar el token).
- [ ] Reemplazar los enlaces de despliegue pendientes por las URLs reales.
