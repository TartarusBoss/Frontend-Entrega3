# SportZone — Frontend

Tienda deportiva para fútbol, básquetbol y MMA. Este repositorio contiene el frontend de la Entrega 3, reconstruido con Next.js App Router, TypeScript y Tailwind CSS. El catálogo conserva los productos de la Entrega 1 y los obtiene desde la API; el registro, el inicio de sesión, las solicitudes y el panel de administración se comunican con el backend.

## Repositorios y despliegues

- Frontend: https://github.com/TartarusBoss/Frontend-Entrega3
- Backend: https://github.com/TartarusBoss/Backend-Entrega3
- Sitio en Vercel: pendiente de configurar.
- API en Render o Railway: pendiente de configurar.

Los despliegues se deben completar cuando exista una base PostgreSQL de producción y se hayan configurado las variables de entorno en ambas plataformas. No uses las credenciales locales de prueba como credenciales de producción.

## Ejecutar localmente

Requisitos: Node.js 20.9 o superior y PostgreSQL.

1. Configura y ejecuta el backend siguiendo [su guía local](https://github.com/TartarusBoss/Backend-Entrega3/blob/main/README.md). Debe estar disponible en `http://localhost:3001`.
2. Copia `.env.example` a `.env.local` y configura `NEXT_PUBLIC_API_HOST=http://localhost:3001`.
3. En esta carpeta, ejecuta `npm install` y luego `npm run dev`.
4. Abre `http://localhost:3000`.

Validaciones disponibles: `npm run lint` y `npm run build`.

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
