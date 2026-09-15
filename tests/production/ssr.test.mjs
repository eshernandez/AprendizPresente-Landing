import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const root = resolve(import.meta.dirname, "../..");
let server;
let origin;
let html;
let logs = "";
const runtimeSite = "https://runtime-landing.example.test";
const runtimeApp = "https://runtime-app.example.test";
const request = (path, options) => fetch(`${origin}${path}`, { ...options, signal: AbortSignal.timeout(10000) });

before(async () => {
  // Exercise the complete standalone package produced by npm run build.
  const reservation = createServer();
  reservation.listen(0, "127.0.0.1");
  await once(reservation, "listening");
  const port = reservation.address().port;
  await new Promise((done) => reservation.close(done));
  origin = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, [resolve(root, ".next/standalone/server.js")], {
    cwd: root,
    env: { ...process.env, NODE_ENV: "production", HOSTNAME: "127.0.0.1", PORT: String(port), SITE_URL: runtimeSite, APP_URL: runtimeApp, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (data) => { logs += data; });
  server.stderr.on("data", (data) => { logs += data; });
  for (let attempt = 0; attempt < 150; attempt++) {
    if (server.exitCode !== null) throw new Error(`El servidor terminó: ${logs}`);
    try {
      const response = await request("/healthz");
      if (response.ok) break;
    } catch { /* Startup is asynchronous. */ }
    if (attempt === 149) throw new Error(`El servidor no inició: ${logs}`);
    await delay(100);
  }
  const response = await request("/");
  assert.equal(response.status, 200, logs);
  html = await response.text();
}, { timeout: 30000 });

after(async () => {
  if (!server || server.exitCode !== null) return;
  const closed = once(server, "exit");
  server.kill("SIGTERM");
  const forceStop = setTimeout(() => server.kill("SIGKILL"), 5000);
  await closed;
  clearTimeout(forceStop);
});

test("SSR entrega el contenido completo sin ejecutar JavaScript", () => {
  const document = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(document, /<html[^>]*lang="es"/);
  assert.equal((document.match(/<h1\b/g) || []).length, 1);
  for (const content of ["Más tiempo", "para enseñar.", "Asistencia QR y geolocalizada", "Grupos organizados", "Programación de clases", "Seguimiento e historial", "Revisa las novedades", "Exporta el historial", "Vista ilustrativa"]) {
    assert.ok(document.includes(content), `Falta contenido SSR: ${content}`);
  }
});

test("cada petición vuelve a renderizar y evita la caché estática", async () => {
  const response = await request("/");
  const nextHtml = await response.text();
  const marker = /data-render-id="([a-f0-9-]+)"/;
  assert.match(html, marker);
  assert.match(nextHtml, marker);
  assert.notEqual(html.match(marker)[1], nextHtml.match(marker)[1]);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const manifest = JSON.parse(await readFile(resolve(root, ".next/prerender-manifest.json"), "utf8"));
  assert.equal(manifest.routes["/"], undefined, "La landing no debe prerenderizarse durante el build");
});

test("canonical, metadata y enlaces leen variables de ejecución", () => {
  assert.ok(html.includes(`rel="canonical" href="${runtimeSite}"`) || html.includes(`rel="canonical" href="${runtimeSite}/"`));
  assert.ok(html.includes(`href="${runtimeApp}/login"`));
  assert.ok(html.includes(`href="${runtimeApp}/register?origin=landing"`));
  assert.match(html, /name="description"/);
  assert.match(html, /property="og:locale" content="es_CO"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /name="viewport"/);
});

test("los encabezados reenviados no cambian el canonical", async () => {
  const response = await request("/", { headers: { "x-forwarded-host": "untrusted.example.test", "x-forwarded-proto": "http" } });
  const body = await response.text();
  assert.ok(body.includes(runtimeSite));
  assert.ok(!body.includes("untrusted.example.test"));
});

test("las anclas de navegación apuntan a secciones existentes", () => {
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.ok(anchors.length >= 4);
  for (const anchor of anchors) assert.ok(html.includes(`id="${anchor}"`), `Ancla sin destino: ${anchor}`);
});

test("el paquete standalone sirve scripts, estilos y fuentes locales", async () => {
  const assets = new Set([...html.matchAll(/(?:src|href)="([^"\s]+)"/g)].map((match) => match[1]).filter((url) => url.startsWith("/_next/static/")));
  assert.ok(assets.size > 0);
  let fonts = 0;
  for (const asset of assets) {
    const response = await request(asset);
    assert.equal(response.status, 200, asset);
    if (asset.endsWith(".css")) {
      const css = await response.text();
      assert.match(response.headers.get("content-type"), /text\/css/);
      assert.ok(!css.includes("fonts.googleapis.com"));
      for (const match of css.matchAll(/url\(["']?([^\s)"']+\.woff2?)["']?\)/g)) {
        const fontUrl = new URL(match[1], `${origin}${asset}`);
        const font = await request(fontUrl.pathname);
        assert.equal(font.status, 200, fontUrl.pathname);
        fonts++;
      }
    }
  }
  assert.ok(fonts > 0, "Debe servir las fuentes incluidas en el build");
});

test("salud y cabeceras responden correctamente", async () => {
  const response = await request("/healthz");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok", service: "aprendizpresente-landing-ssr" });
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-powered-by"), null);
});

test("robots, sitemap e icono se sirven desde el servidor", async () => {
  const robots = await request("/robots.txt");
  assert.equal(robots.status, 200);
  assert.ok((await robots.text()).includes(`${runtimeSite}/sitemap.xml`));
  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.ok((await sitemap.text()).includes(`<loc>${runtimeSite}</loc>`));
  const icon = await request("/icon.svg");
  assert.equal(icon.status, 200);
  assert.match(icon.headers.get("content-type"), /image\/svg\+xml/);
});

test("las rutas inexistentes devuelven un 404 en español", async () => {
  const response = await request("/ruta-inexistente");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Volver a la landing/);
});
