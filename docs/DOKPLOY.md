# Despliegue en Dokploy

Guía para un despliegue posterior. No se ha ejecutado ningún paso sobre un servidor remoto.

## 1. Fuente y construcción

Cuando decidas publicar, coloca **este repositorio independiente** en un proveedor Git accesible desde Dokploy. Crea una **Application** y selecciona ese repositorio con la rama `main`.

En **Build Type**, selecciona **Dockerfile**:

| Campo | Valor |
| --- | --- |
| Dockerfile Path | `Dockerfile` |
| Docker Context Path | `.` |
| Docker Build Stage | `runner` |

Deja el comando de ejecución sin sobrescribir: la imagen inicia `node server.js`. No configures un directorio de publicación estático. Estos campos corresponden a la [configuración oficial de Dockerfile en Dokploy](https://docs.dokploy.com/docs/core/applications/build-type#dockerfile).

## 2. Variables de ejecución

En **Environment**, configura:

```dotenv
NODE_ENV=production
SITE_URL=https://landing.aprendizpresente.soysantiago.tech
APP_URL=https://aprendizpresente.soysantiago.tech
HOSTNAME=0.0.0.0
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

La imagen ya incluye los valores de Node, host, puerto y telemetría. Las dos URLs también tienen los valores anteriores como predeterminados. No hacen falta argumentos de build, credenciales de la API ni una base de datos. Reinicia/recrea el contenedor cuando cambies variables.

## 3. Dominio

Crea un registro DNS `A` para `landing.aprendizpresente` dentro de la zona `soysantiago.tech`, apuntando a la IP pública del servidor Dokploy. Si existe un registro `AAAA`, debe apuntar a un servidor IPv6 que atienda esta aplicación.

En **Domains** de la aplicación:

| Campo | Valor |
| --- | --- |
| Host | `landing.aprendizpresente.soysantiago.tech` |
| Path | `/` |
| Internal Path | `/` |
| Strip Path | Desactivado |
| Container Port | `3000` |
| HTTPS | Activado |
| Certificate | Let's Encrypt |

Traefik dirige el dominio al puerto interno del contenedor; no hace falta publicar el puerto 3000 del host. El servidor debe ser accesible por 80/443 para HTTP(S) y la emisión del certificado. Consulta [Domains en Dokploy](https://docs.dokploy.com/docs/core/domains).

## 4. Construcción y comprobación

Ejecuta **Deploy** cuando el despliegue esté autorizado. Espera a que termine y revisa el estado del servicio. El Dockerfile ejecuta tipos, pruebas unitarias y build; el healthcheck consulta `/healthz` cada 30 segundos con 20 segundos de margen al arrancar. El proceso corre como `node`, sin privilegios de root.

```bash
curl --fail https://landing.aprendizpresente.soysantiago.tech/healthz
curl --fail https://landing.aprendizpresente.soysantiago.tech/
```

La primera respuesta debe ser `{"status":"ok","service":"aprendizpresente-landing-ssr"}`. La segunda debe contener el texto de la landing en el HTML. Comprueba los enlaces a la aplicación y el certificado HTTPS. Conserva la imagen anterior para volver a ella si la nueva versión falla.

## Probar Docker antes del despliegue

Con el motor Docker iniciado, desde la raíz de este repositorio:

```bash
docker build --target runner -t aprendizpresente-landing-ssr:local .
docker run --rm --name aprendizpresente-landing-ssr-local \
  -p 127.0.0.1:3000:3000 \
  --env-file .env.example \
  aprendizpresente-landing-ssr:local
```

En otra terminal, comprueba `curl --fail http://127.0.0.1:3000/healthz`. Detén la prueba con `docker stop aprendizpresente-landing-ssr-local`.

La imagen final copia el servidor standalone y los recursos públicos siguiendo el [patrón de Docker para Next.js](https://docs.docker.com/guides/nextjs/). Si el VPS tiene poca memoria, construye la imagen en una máquina de build y publica esa imagen para evitar que la compilación compita con los servicios activos.
