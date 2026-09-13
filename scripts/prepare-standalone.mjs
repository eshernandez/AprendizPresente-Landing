import { cp } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
// Next traces the runtime; its public/static files must be added separately.
await cp(resolve(root, "public"), resolve(root, ".next/standalone/public"), { recursive: true });
await cp(resolve(root, ".next/static"), resolve(root, ".next/standalone/.next/static"), { recursive: true });
console.log("Paquete standalone listo, con recursos públicos y fuentes locales.");
