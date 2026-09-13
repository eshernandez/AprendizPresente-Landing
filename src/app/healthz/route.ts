export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok", service: "aprendizpresente-landing-ssr" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
