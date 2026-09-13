import assert from "node:assert/strict";
import { test } from "node:test";
import { getSiteConfig, parseOrigin } from "../src/lib/site.mjs";

test("los valores por defecto separan la landing de la aplicación", () => {
  const config = getSiteConfig({});
  assert.equal(config.siteUrl, "https://landing.aprendizpresente.soysantiago.tech");
  assert.equal(config.loginUrl, "https://aprendizpresente.soysantiago.tech/login");
  assert.equal(config.registerUrl, "https://aprendizpresente.soysantiago.tech/register");
});

test("las URLs se leen en cada llamada y normalizan la barra final", () => {
  const env = { SITE_URL: "https://landing.example.test/", APP_URL: "https://app.example.test/" };
  assert.equal(getSiteConfig(env).siteUrl, "https://landing.example.test");
  env.APP_URL = "https://other.example.test";
  assert.equal(getSiteConfig(env).loginUrl, "https://other.example.test/login");
});

test("la configuración acepta desarrollo local", () => {
  assert.equal(parseOrigin("http://localhost:3000/", "SITE_URL"), "http://localhost:3000");
});

test("rechaza protocolos ejecutables, credenciales, rutas y URLs ambiguas", () => {
  for (const value of ["", "no-url", "javascript:alert(1)", "data:text/html,test", "ftp://example.test", "https://user:pass@example.test", "https://example.test/login", "https://example.test/?next=1", "https://example.test/#anchor"]) {
    assert.throws(() => parseOrigin(value, "SITE_URL"), /SITE_URL/);
  }
});
