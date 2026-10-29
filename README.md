# SportZone — Frontend

Tienda deportiva para fútbol, básquetbol y MMA. Este repositorio contiene el frontend de la Entrega 3, reconstruido con Next.js App Router, TypeScript y Tailwind CSS. El catálogo conserva los productos de la Entrega 1 y los obtiene desde la API; el registro, el inicio de sesión, las solicitudes y el panel de administración se comunican con el backend.

## Repositorios y despliegues

- Frontend: https://github.com/TartarusBoss/Frontend-Entrega3
- Backend: https://github.com/TartarusBoss/Backend-Entrega3
- Sitio en Vercel: https://frontend-entrega3-ghfzule7h-matias-664b.vercel.app
- API en Render: https://sportzone-api-m6ag.onrender.com
- Salud de la API: https://sportzone-api-m6ag.onrender.com/health

Los servicios están desplegados y conectados. El catálogo de producción contiene nueve productos. No uses ni publiques las credenciales de producción; las claves del seed local son solo para desarrollo.

## Ejecutar localmente

Requisitos: Node.js 20.9 o superior y PostgreSQL.

1. Configura y ejecuta el backend siguiendo [su guía local](https://github.com/TartarusBoss/Backend-Entrega3/blob/main/README.md). Debe estar disponible en `http://localhost:3001`.
2. Copia `.env.example` a `.env.local` y configura `NEXT_PUBLIC_API_HOST=http://localhost:3001`.
3. En esta carpeta, ejecuta `npm install` y luego `npm run dev`.
4. Abre `http://localhost:3000`.

Validaciones disponibles: `npm run lint` y `npm run build`.

## Configuración del despliegue en Vercel y Render

El backend tiene un Blueprint en `render.yaml` que prepara el servicio y ejecuta las migraciones Prisma. La configuración actualmente desplegada es:

1. La base PostgreSQL y el servicio de API están en Render, en la región de Oregon. Las migraciones se ejecutan con `prisma migrate deploy`.
2. `FRONTEND_URL` en Render está configurada como `https://frontend-entrega3-ghfzule7h-matias-664b.vercel.app`.
3. El proyecto Next.js de Vercel usa `NEXT_PUBLIC_API_HOST=https://sportzone-api-m6ag.onrender.com`.
4. El seed del catálogo define nueve productos y cuentas de prueba. En producción, el catálogo se completó mediante la herramienta de administración; las contraseñas de las cuentas son privadas y no se documentan aquí.
5. Si se recrea la base, configura `DATABASE_URL`, `SEED_ADMIN_PASSWORD` y `SEED_USER_PASSWORD` únicamente en el entorno de ejecución y ejecuta `npm run db:seed`. No agregues credenciales a Git ni uses las claves de ejemplo en producción.

No publiques credenciales de bases de datos, contraseñas, secretos JWT ni tokens.

## Cuentas locales del seed

El seed del backend crea estas cuentas de prueba, siempre que los valores de `.env` del backend coincidan con los del ejemplo:

- Admin: `admin@sportzone.test` / `CambiaEstaClaveAdmin123!`
- Usuario: `usuario@sportzone.test` / `CambiaEstaClaveUser123!`

Son cuentas exclusivamente locales para probar roles. Define claves nuevas si cargas datos en un entorno compartido.

## Decisiones técnicas

- Las páginas de `app/` componen las vistas; catálogo, autenticación y solicitudes separan sus tipos, servicios, hooks y componentes por funcionalidad.
- El catálogo llama a la API mediante `services/product-service.ts` y el cliente común `http.ts`; pagina usando `?page=`, y muestra los estados de carga, error y catálogo vacío.
- **Flujo de login:** el formulario valida que el correo y la contraseña estén presentes y llama a `login()` del servicio de autenticación. El servicio envía `POST /api/auth/login` mediante el cliente HTTP común. La API busca el correo y compara la contraseña con el hash bcrypt; si las credenciales coinciden, firma un JWT con expiración que contiene solo el id y el rol, y devuelve el token junto con los datos públicos del usuario. El frontend guarda la sesión y redirige al inicio. Al llamar después a una ruta protegida, `http.ts` añade `Authorization: Bearer <token>` y el middleware de la API verifica el JWT antes de autorizar la acción.
- **Dónde se guarda el token y su riesgo:** el navegador guarda el JWT en `localStorage` para conservar la sesión tras una recarga. Cualquier JavaScript que se ejecute en el mismo origen puede leerlo; por eso una vulnerabilidad XSS podría robar la sesión. En una versión más segura se puede usar una cookie `HttpOnly`, `Secure` y `SameSite`, con la protección CSRF correspondiente. El rol guardado en el navegador solo adapta la interfaz; el backend es quien decide el acceso.
- **Diferencia entre `401` y `403`:** `401 Unauthorized` significa que falta un token válido. Por ejemplo, intentar borrar `DELETE /api/products/:id` sin iniciar sesión devuelve `401`. `403 Forbidden` significa que el token sí es válido, pero el rol no tiene permiso: si inicia sesión una cuenta `user` e intenta ese mismo borrado, la API responde `403`; una cuenta `admin` sí puede hacerlo. Ante un `401` en una ruta protegida, el cliente elimina la sesión local y redirige a `/login`; el error del inicio de sesión se muestra junto al campo de contraseña.
- La contraseña solo se envía al endpoint de autenticación; el backend la almacena como hash bcrypt y nunca devuelve el hash ni incluye la contraseña en el JWT.
- La IA se utilizó como apoyo para estructurar componentes y revisar errores. Antes de entregar, verifica que puedes explicar el flujo y las decisiones con tus propias palabras.

## Comprobaciones antes de entregar

- [x] Desplegar y conectar el frontend y el backend; confirmar que `/health` y el catálogo funcionan.
- [x] Comprobar registro, correo duplicado, login, persistencia de sesión tras recargar, creación y consulta de una solicitud, y respuestas `401`/`403`.
- [x] Confirmar que la petición protegida `GET /api/requests/mias` responde `200` con un encabezado Bearer; el valor del token se mantuvo oculto.
- [x] Registrar las URLs reales de Vercel y Render en este README.
- [x] Adjuntar la captura de DevTools → Network de una solicitud protegida, con el valor del token cubierto: [evidencia de Network](./docs/evidencia-network.png).

La captura corresponde a una solicitud `POST /api/requests` que respondió `201 Created`. El valor completo del token fue ocultado antes de guardar la imagen en este repositorio.
