# AprendizPresente-Landing-SSR

Landing profesional en español para `https://landing.aprendizpresente.soysantiago.tech`, construida con React 19, Next.js 16 App Router y TypeScript. Proyecto Git independiente de la aplicación principal.

## Ejecutar localmente

Requiere Node.js 22.14+ de la rama 22 y npm. Las versiones exactas están fijadas en `package-lock.json`.

```bash
npm ci
npm run dev
```

Abre `http://localhost:3000`. Para producción:

```bash
npm run build
npm start
```

El paso `postbuild` agrega los recursos públicos y estáticos al paquete standalone. `npm start` ejecuta ese mismo servidor Node que usa Docker. Para cambiar el puerto: `PORT=3001 npm start`.

## SSR real

`src/app/page.tsx` declara `dynamic = "force-dynamic"` y `runtime = "nodejs"`. El servidor React genera el HTML completo en cada petición; el build identifica `/` como `ƒ (Dynamic)`. No hay exportación estática ni un contenedor Nginx que sirva una SPA. El contenido y la navegación por anclas funcionan sin ejecutar JavaScript. Next.js añade sus recursos habituales de cliente.

`output: "standalone"` crea un servidor con sus dependencias necesarias. Este patrón está documentado por [Next.js para despliegues con Docker](https://nextjs.org/docs/app/getting-started/deploying) y la configuración por petición en [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config).

## Configuración

Los valores predeterminados funcionan sin `.env`. Copia `.env.example` a `.env.local` para personalizar el desarrollo. En producción, suministra las variables al proceso o al contenedor: el servidor standalone no carga automáticamente `.env.local`.

| Variable | Valor predeterminado / propósito |
| --- | --- |
| `SITE_URL` | `https://landing.aprendizpresente.soysantiago.tech`; canonical, metadatos y sitemap |
| `APP_URL` | `https://aprendizpresente.soysantiago.tech`; enlaces `/login` y `/register` |
| `PORT` | `3000` |
| `HOSTNAME` | `0.0.0.0` en Docker; usar `127.0.0.1` para restringir la ejecución local |
| `NEXT_TELEMETRY_DISABLED` | `1` en Docker |

`SITE_URL` y `APP_URL` se leen en ejecución, admiten únicamente orígenes HTTP(S) sin rutas ni credenciales y pueden cambiarse sin reconstruir la imagen. Para el dominio público usa HTTPS. La landing no necesita conexión al backend, base de datos, secretos ni volumen persistente.

## Contenido y archivos

- `src/app/page.tsx`: presentación, cuatro módulos, capacidades del instructor y flujo de uso.
- `src/app/globals.css`: tema, diseño adaptable, foco visible y movimiento reducido.
- `src/components/`: marca y vista ilustrativa, identificada como datos de ejemplo.
- `src/lib/site.mjs`: URLs y metadatos compartidos.
- `src/app/healthz/route.ts`: salud HTTP, sin acceso a servicios externos.
- `Dockerfile`: construcción por etapas, usuario sin privilegios y healthcheck.

Las fuentes DM Sans e Instrument Serif se incluyen localmente desde Fontsource (OFL-1.1); los iconos provienen de Lucide (ISC). No se descargan fuentes desde Google en ejecución. La página no solicita cámara ni ubicación: esos permisos corresponden a la aplicación de asistencia.

El contenido se contrastó con los módulos existentes de AprendizPresente. El alcance y los archivos consultados están en [docs/CONTENT.md](docs/CONTENT.md). No se prometen planes, precios, cifras de adopción ni funciones futuras.

## Verificar

```bash
npm run verify
```

Ejecuta comprobación de tipos, 4 pruebas de configuración, build y 9 pruebas HTTP del servidor de producción. Estas últimas abren un puerto local libre y cierran el servidor al terminar. También pueden repetirse después de un build con `npm run test:ssr`.

La prueba de SSR compara un identificador no visible generado en cada respuesta, comprueba `Cache-Control: no-store` y verifica que `/` no esté en el manifiesto de páginas prerenderizadas. Además valida HTML sin scripts, URLs de ejecución, anclas, fuentes, estilos, scripts, metadatos, sitemap, robots, salud y 404.

Consulta [la guía de Dokploy](docs/DOKPLOY.md) y [los resultados de validación](docs/VALIDATION.md). Esta entrega es exclusivamente local: no se ha publicado el repositorio ni desplegado el sitio.
