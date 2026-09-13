import { randomUUID } from "node:crypto";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, ClipboardCheck, MapPin, QrCode, UsersRound } from "lucide-react";
import { Brand } from "@/components/brand";
import { JourneyPreview } from "@/components/journey-preview";
import { getSiteConfig } from "@/lib/site.mjs";

// SSR on every request, including when the page has no external data source.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const modules = [
  { number: "01", Icon: QrCode, title: "Asistencia QR y geolocalizada", text: "Registra entradas y salidas con un QR temporal. Configura el punto y el radio de asistencia para validar la ubicación en las clases presenciales.", detail: "Cada registro, en su contexto", color: "lime" },
  { number: "02", Icon: UsersRound, title: "Grupos organizados", text: "Crea grupos de formación, identifica su ficha y programa, comparte invitaciones y consulta los aprendices vinculados.", detail: "Una vista para cada grupo", color: "blue" },
  { number: "03", Icon: CalendarDays, title: "Programación de clases", text: "Define días, horarios y sesiones recurrentes. Configura la modalidad, el margen de llegada tarde y el tipo de asistencia.", detail: "Tu semana, preparada", color: "peach" },
  { number: "04", Icon: ClipboardCheck, title: "Seguimiento e historial", text: "Consulta sesiones, asistencias e inasistencias. Revisa el recorrido de cada aprendiz y exporta el historial del grupo en Excel.", detail: "Información para acompañar", color: "purple" },
];

const instructorFeatures = [
  ["Organiza tus grupos", "Crea fichas, comparte invitaciones y consulta a tus aprendices."],
  ["Prepara cada encuentro", "Programa clases y define las condiciones de asistencia."],
  ["Gestiona la sesión", "Inicia y cierra sesiones, activa el QR y habilita la salida."],
  ["Acompaña con información", "Consulta registros, ausencias e historial por aprendiz."],
  ["Revisa las novedades", "Evalúa justificaciones y ajusta asistencias dejando una observación."],
  ["Lleva el seguimiento contigo", "Exporta el historial de asistencia de tus grupos en Excel."],
];

export default function Home() {
  const { loginUrl, registerUrl } = getSiteConfig();
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header" id="inicio">
        <div className="wrap navigation"><Brand /><nav aria-label="Navegación principal"><a href="#modulos">Módulos</a><a href="#instructores">Para instructores</a><a href="#como-funciona">Cómo funciona</a></nav><a className="button button-outline button-small" href={loginUrl}>Ingresar <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      </header>
      {/* A non-visible request marker lets integration tests verify fresh server rendering. */}
      <main id="contenido" data-render-id={randomUUID()}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> GESTIÓN DE LA FORMACIÓN</p>
              <h1 id="hero-title">Más tiempo<br />para enseñar.<br />Todos <em>presentes.</em></h1>
              <p className="hero-lead">AprendizPresente reúne asistencia, grupos y clases en un solo lugar. Menos registros dispersos, más atención a cada aprendiz.</p>
              <div className="hero-actions"><a className="button button-lime" href={registerUrl}>Empezar en AprendizPresente <ArrowRight size={18} aria-hidden="true" /></a><a className="text-link" href="#modulos">Explorar módulos <span aria-hidden="true">↓</span></a></div>
              <p className="hero-note"><Check size={17} aria-hidden="true" /> Pensado para el día a día del instructor.</p>
            </div>
            <JourneyPreview />
          </div>
          <div className="hero-strip"><div className="wrap"><span>DE LA PRIMERA CLASE AL SEGUIMIENTO</span><p>La presencia es el comienzo de todo.</p><span aria-hidden="true">01 / 04</span></div></div>
        </section>

        <section className="intro wrap" aria-labelledby="intro-title"><p className="eyebrow">QUÉ ES APRENDIZPRESENTE</p><div className="intro-grid"><h2 id="intro-title">Cada clase cuenta.<br /><em>Cada aprendiz también.</em></h2><p>Una plataforma de gestión de asistencia y formación que conecta lo que planeas, lo que sucede en el aula y lo que necesitas revisar después. Para instructores que organizan y aprendices que participan.</p></div></section>

        <section className="modules-section" id="modulos" aria-labelledby="modules-title"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">LOS MÓDULOS ACTUALES</p><h2 id="modules-title">Tu jornada, conectada.</h2></div><p>Cuatro módulos para pasar de la organización al acompañamiento.</p></div><div className="modules-grid">{modules.map(({ number, Icon, title, text, detail, color }) => <article className={`module-card ${color}`} key={number}><div className="module-top"><span className="module-icon"><Icon size={26} strokeWidth={1.6} aria-hidden="true" /></span><span className="module-number">{number}</span></div><h3>{title}</h3><p>{text}</p><div className="module-detail">{detail}</div></article>)}</div><p className="location-note"><MapPin size={16} aria-hidden="true" /> La geolocalización requiere permiso del dispositivo y depende de la configuración de la clase.</p></div></section>

        <section className="instructor-section wrap" id="instructores" aria-labelledby="instructor-title">
          <div className="instructor-story"><p className="eyebrow">EL ROL INSTRUCTOR</p><h2 id="instructor-title">Cerca de tu grupo.<br /><em>Al tanto de todo.</em></h2><p>Tu espacio para preparar clases, gestionar la asistencia y dar continuidad al proceso formativo de los grupos a tu cargo.</p><a className="text-link dark-link" href={loginUrl}>Entrar a mi espacio <ArrowUpRight size={19} aria-hidden="true" /></a>
            <figure className="history-preview"><div className="history-title"><ClipboardCheck size={19} aria-hidden="true" /><strong>Historial del grupo</strong><span>Ejemplo</span></div><table><caption className="sr-only">Ejemplo de estados de asistencia por aprendiz</caption><thead><tr><th scope="col">Aprendiz</th><th scope="col">Registro</th></tr></thead><tbody><tr><th scope="row"><span className="avatar" aria-hidden="true">A</span>Aprendiz A</th><td><span className="status present">Presente</span></td></tr><tr><th scope="row"><span className="avatar" aria-hidden="true">B</span>Aprendiz B</th><td><span className="status late">Llegada tarde</span></td></tr><tr><th scope="row"><span className="avatar" aria-hidden="true">C</span>Aprendiz C</th><td><span className="status absent">Ausente</span></td></tr></tbody></table><figcaption>Registros ilustrativos, sin datos personales.</figcaption></figure>
          </div>
          <ol className="instructor-features">{instructorFeatures.map(([title, detail], index) => <li key={title}><span className="feature-number">0{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div><Check size={19} aria-hidden="true" /></li>)}</ol>
        </section>

        <section className="flow-section" id="como-funciona" aria-labelledby="flow-title"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">ASÍ FUNCIONA</p><h2 id="flow-title">Un ritmo sencillo.<br /><em>De principio a fin.</em></h2></div><p>La organización y el seguimiento forman parte de la misma jornada.</p></div><ol className="flow-grid">{[["Crea tu grupo", "Organiza la ficha y comparte la invitación con los aprendices."], ["Programa la clase", "Define el horario, la modalidad y las condiciones del registro."], ["Registra la asistencia", "Activa la sesión y permite que cada aprendiz escanee el QR."], ["Revisa y acompaña", "Consulta el historial y da seguimiento a las novedades."]].map(([title, detail], index) => <li key={title}><span className="flow-number">0{index + 1}</span><h3>{title}</h3><p>{detail}</p></li>)}</ol></div></section>

        <section className="cta-section wrap" aria-labelledby="cta-title"><div><p className="eyebrow">LA PRÓXIMA CLASE EMPIEZA CONTIGO</p><h2 id="cta-title">Haz espacio para<br />lo que importa: <em>enseñar.</em></h2></div><div className="cta-actions"><a className="button button-dark" href={registerUrl}>Crear mi cuenta <ArrowRight size={18} aria-hidden="true" /></a><a href={loginUrl}>Ya tengo una cuenta</a></div></section>
      </main>
      <footer className="site-footer"><div className="wrap"><Brand /><p>Formación con presencia.</p><a href={loginUrl}>Ir a la plataforma <ArrowUpRight size={16} aria-hidden="true" /></a></div></footer>
    </>
  );
}
