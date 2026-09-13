import { ArrowUpRight, CalendarDays, Check, MapPin, QrCode, UsersRound } from "lucide-react";

/** Illustrative data, never presented as live product activity. */
export function JourneyPreview() {
  return (
    <figure className="journey-preview">
      <div className="preview-top"><span className="preview-monogram">ap.</span><span>Tu espacio de formación</span><span className="role-tag">Instructor</span></div>
      <div className="preview-heading"><div><p>TODO LISTO PARA EMPEZAR</p><h2>Una jornada.<br />Todo conectado.</h2></div><ArrowUpRight size={30} strokeWidth={1.3} aria-hidden="true" /></div>
      <div className="class-preview">
        <div className="class-meta"><span><CalendarDays size={15} aria-hidden="true" /> Lunes · 08:00–10:00</span><span className="live-label">En curso</span></div>
        <h3>Instrumentación industrial</h3>
        <p>Grupo de formación · Jornada mañana</p>
        <div className="attendance-preview">
          <div className="qr-icon" aria-hidden="true"><QrCode size={74} strokeWidth={1.4} /></div>
          <div><strong>Asistencia con QR</strong><p>Entrada habilitada</p><span className="location-label"><MapPin size={14} aria-hidden="true" /> Ubicación configurada</span></div>
        </div>
        <div className="register-preview"><span><Check size={16} aria-hidden="true" /> Registro de entrada</span><strong>Confirmado</strong></div>
      </div>
      <div className="preview-bottom"><UsersRound size={19} aria-hidden="true" /><span>Del grupo al historial, en un mismo lugar.</span></div>
      <figcaption>Vista ilustrativa · Datos de ejemplo</figcaption>
    </figure>
  );
}
