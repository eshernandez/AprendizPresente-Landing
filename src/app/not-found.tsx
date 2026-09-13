import { Brand } from "@/components/brand";

export default function NotFound() {
  return <main className="not-found wrap"><Brand /><p className="eyebrow">PÁGINA NO ENCONTRADA · 404</p><h1>Volvamos al <em>inicio.</em></h1><p>Esta dirección no existe en AprendizPresente.</p><a className="button button-dark" href="/">Volver a la landing</a></main>;
}
