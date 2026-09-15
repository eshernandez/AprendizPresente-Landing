/** Validate trusted configuration; never derive public URLs from request headers. */
export function parseOrigin(value, variable) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variable} debe ser una URL absoluta http(s).`);
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username || url.password || url.search || url.hash || url.pathname !== "/"
  ) {
    throw new Error(`${variable} debe contener solo el origen http(s), sin credenciales, ruta ni parámetros.`);
  }
  return url.origin;
}

/** Called during each server render, so Docker environment changes need no rebuild. */
export function getSiteConfig(environment = process.env) {
  const siteUrl = parseOrigin(
    environment.SITE_URL ?? "https://landing.aprendizpresente.soysantiago.tech",
    "SITE_URL",
  );
  const appUrl = parseOrigin(
    environment.APP_URL ?? "https://aprendizpresente.soysantiago.tech",
    "APP_URL",
  );
  return {
    siteUrl,
    appUrl,
    loginUrl: `${appUrl}/login`,
    registerUrl: `${appUrl}/register`,
    instructorRegisterUrl: `${appUrl}/register?origin=landing`,
  };
}

export const siteTitle = "AprendizPresente | Asistencia y gestión para instructores";
export const siteDescription = "Organiza grupos, programa clases y registra asistencia con QR y geolocalización. AprendizPresente conecta cada jornada con el seguimiento de tus aprendices.";
