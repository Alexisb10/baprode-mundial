import { useState } from "react";

const SECTIONS = [
  {
    id: "general", title: "Datos Generales", icon: "🏢",
    fields: [
      { key: "nombreNegocio", label: "Nombre del gimnasio", type: "text", placeholder: "Ej: FitZone Gym" },
      { key: "propietario", label: "Propietario / Responsable", type: "text", placeholder: "Nombre completo" },
      { key: "ciudad", label: "Ciudad", type: "text", placeholder: "Ej: Buenos Aires" },
      { key: "antiguedad", label: "Años en operación", type: "number", placeholder: "Ej: 3" },
      { key: "m2", label: "Superficie total (m²)", type: "number", placeholder: "Ej: 450" },
      { key: "horario", label: "Horario de atención", type: "text", placeholder: "Ej: 6am–11pm, L-S" },
    ],
  },
  {
    id: "membresias", title: "Membresías y Socios", icon: "👥",
    fields: [
      { key: "sociosTotales", label: "Total socios activos", type: "number", placeholder: "Ej: 320" },
      { key: "sociosNuevosMes", label: "Altas promedio por mes", type: "number", placeholder: "Ej: 25" },
      { key: "sociosBajaMes", label: "Bajas promedio por mes", type: "number", placeholder: "Ej: 18" },
      { key: "ticketMensual", label: "Cuota mensual promedio ($)", type: "number", placeholder: "Ej: 35" },
      { key: "asistenciaPromedio", label: "Asistencia diaria promedio", type: "number", placeholder: "Ej: 85" },
    ],
  },
  {
    id: "ingresos", title: "Ingresos Mensuales", icon: "💰",
    fields: [
      { key: "ingresosMembresías", label: "Ingresos por membresías ($)", type: "number", placeholder: "Ej: 11200" },
      { key: "ingresosClases", label: "Clases grupales / personales ($)", type: "number", placeholder: "Ej: 1800" },
      { key: "ingresosBar", label: "Bar / Nutrición / Suplementos ($)", type: "number", placeholder: "Ej: 900" },
      { key: "ingresosOtros", label: "Otros ingresos ($)", type: "number", placeholder: "Ej: 300" },
      { key: "ingresosMorosidad", label: "Cuotas impagas estimadas ($)", type: "number", placeholder: "Ej: 1200" },
    ],
  },
  {
    id: "costos", title: "Costos y Gastos", icon: "📉",
    fields: [
      { key: "alquiler", label: "Alquiler / hipoteca ($)", type: "number", placeholder: "Ej: 3500" },
      { key: "servicios", label: "Servicios públicos ($)", type: "number", placeholder: "Ej: 800" },
      { key: "internet", label: "Internet / sistemas ($)", type: "number", placeholder: "Ej: 150" },
      { key: "mantenimiento", label: "Mantenimiento ($)", type: "number", placeholder: "Ej: 400" },
      { key: "marketing", label: "Marketing / publicidad ($)", type: "number", placeholder: "Ej: 350" },
      { key: "suministros", label: "Suministros / limpieza ($)", type: "number", placeholder: "Ej: 250" },
      { key: "otrosGastos", label: "Otros gastos fijos ($)", type: "number", placeholder: "Ej: 200" },
    ],
  },
  {
    id: "personal", title: "Personal y Nómina", icon: "🧑‍💼",
    fields: [
      { key: "cantEmpleados", label: "Total empleados", type: "number", placeholder: "Ej: 7" },
      { key: "nominaTotal", label: "Nómina total mensual ($)", type: "number", placeholder: "Ej: 5800" },
      { key: "instructoresCount", label: "Instructores / profesores", type: "number", placeholder: "Ej: 4" },
      { key: "sueldoDueno", label: "Sueldo del dueño incluido ($)", type: "number", placeholder: "Ej: 1500" },
      { key: "rolesClaves", label: "Roles críticos que faltan o sobran", type: "textarea", placeholder: "Describí brevemente..." },
    ],
  },
  {
    id: "deuda", title: "Deuda y Financiamiento", icon: "🏦",
    fields: [
      { key: "deudaTotal", label: "Deuda total vigente ($)", type: "number", placeholder: "Ej: 22000" },
      { key: "cuotaDeuda", label: "Cuota mensual de deudas ($)", type: "number", placeholder: "Ej: 1800" },
      { key: "tasaInteres", label: "Tasa de interés promedio (%)", type: "number", placeholder: "Ej: 18" },
      { key: "descripcionDeuda", label: "Descripción de las deudas", type: "textarea", placeholder: "Ej: Banco $15k, proveedor $7k..." },
    ],
  },
  {
    id: "operaciones", title: "Operaciones y Gestión", icon: "⚙️",
    fields: [
      { key: "softwareGestion", label: "¿Usa software de gestión?", type: "select", options: ["No", "Sí — básico (Excel/manual)", "Sí — software específico"] },
      { key: "controlFinanciero", label: "¿Lleva control financiero?", type: "select", options: ["No", "Informal (cuaderno/Excel)", "Contador externo", "Contador interno"] },
      { key: "procesosDocumentados", label: "¿Tiene procesos documentados?", type: "select", options: ["No", "Parcialmente", "Sí"] },
      { key: "principalesCuellos", label: "Principales cuellos de botella", type: "textarea", placeholder: "Ej: Recepción colapsada a las 7am..." },
      { key: "mayorProblema", label: "Mayor problema del negocio HOY", type: "textarea", placeholder: "Sé directo y honesto..." },
    ],
  },
  {
    id: "mercado", title: "Mercado y Competencia", icon: "📊",
    fields: [
      { key: "competidoresDirectos", label: "Competidores directos en zona", type: "number", placeholder: "Ej: 4" },
      { key: "diferencialPercibido", label: "Tu diferencial frente a competencia", type: "textarea", placeholder: "Ej: Precio, equipamiento, instructores..." },
      { key: "precioComparativo", label: "Tu precio vs competencia", type: "select", options: ["Más barato", "Similar", "Más caro"] },
      { key: "canalesAdquisicion", label: "¿Cómo conseguís nuevos socios?", type: "textarea", placeholder: "Ej: Instagram, boca a boca..." },
    ],
  },
  {
    id: "objetivos", title: "Objetivos", icon: "🎯",
    fields: [
      { key: "metaIngresos", label: "Meta de ingresos mensuales ($)", type: "number", placeholder: "Ej: 18000" },
      { key: "plazo", label: "¿En cuántos meses querés lograrlo?", type: "number", placeholder: "Ej: 6" },
      { key: "prioridad1", label: "Prioridad #1 ahora", type: "select", options: ["Reducir costos", "Aumentar socios", "Mejorar rentabilidad", "Ordenar operaciones", "Conseguir financiamiento", "Crecer / expandirse"] },
      { key: "contextoExtra", label: "Información adicional relevante", type: "textarea", placeholder: "Cualquier dato importante para el análisis..." },
    ],
  },
];

const C = {
  bg: "#0f1117", bgCard: "#1a1d27", bgSection: "#13161f",
  accent: "#6c63ff", accentGlow: "rgba(108,99,255,0.15)",
  gold: "#f5c518", text: "#e8e9f0", muted: "#6b7280",
  border: "#2a2d3a", success: "#22c55e", danger: "#ef4444",
  inputBg: "#0f1117",
};

function Field({ field, value, onChange }) {
  const base = {
    width: "100%", boxSizing: "border-box",
    background: C.inputBg, border: `1.5px solid ${C.border}`,
    borderRadius: 8, padding: "10px 13px",
    fontSize: 14, color: C.text, outline: "none", fontFamily: "inherit",
    transition: "border-color 0.2s",
  };
  if (field.type === "textarea")
    return <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} rows={3}
      style={{ ...base, resize: "vertical", lineHeight: 1.6, color: C.text }} />;
  if (field.type === "select")
    return (
      <select value={value || ""} onChange={e => onChange(e.target.value)}
        style={{ ...base, cursor: "pointer", color: value ? C.text : C.muted }}>
        <option value="">— Seleccionar —</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  return <input type={field.type} value={value || ""} onChange={e => onChange(e.target.value)}
    placeholder={field.placeholder} style={base} />;
}

function SectionCard({ section, data, onChange, isActive, onToggle }) {
  const filled = section.fields.filter(f => data[f.key] && data[f.key] !== "").length;
  const pct = Math.round((filled / section.fields.length) * 100);
  return (
    <div style={{
      marginBottom: 8, borderRadius: 12, overflow: "hidden",
      border: `1px solid ${isActive ? C.accent : C.border}`,
      background: C.bgCard,
      boxShadow: isActive ? `0 0 20px ${C.accentGlow}` : "none",
      transition: "all 0.2s",
    }}>
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "13px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left"
      }}>
        <span style={{ fontSize: 18 }}>{section.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.text, fontFamily: "'Syne', sans-serif" }}>{section.title}</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{filled}/{section.fields.length} campos completados</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 44, height: 3, borderRadius: 2, background: C.border, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? C.success : C.accent, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 10, color: isActive ? C.accent : C.muted }}>{isActive ? "▲" : "▼"}</span>
        </div>
      </button>
      {isActive && (
        <div style={{ padding: "4px 16px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
          {section.fields.map(f => (
            <div key={f.key} style={{ gridColumn: f.type === "textarea" ? "1 / -1" : "auto" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{f.label}</div>
              <Field field={f} value={data[f.key]} onChange={v => onChange(f.key, v)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState({});
  const [openSection, setOpenSection] = useState("general");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const totalFields = SECTIONS.flatMap(s => s.fields).length;
  const filledFields = SECTIONS.flatMap(s => s.fields).filter(f => formData[f.key] && formData[f.key] !== "").length;
  const progress = Math.round((filledFields / totalFields) * 100);

  const generateCode = () => {
    if (!formData.nombreNegocio) {
      alert("Completá al menos el nombre del negocio.");
      return;
    }
    const json = JSON.stringify(formData);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    setCode(b64);
    setShowCode(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        input,textarea,select { color-scheme: dark; }
        input::placeholder,textarea::placeholder { color: #4b5563; }
        input:focus,textarea:focus,select:focus { border-color: #6c63ff !important; outline: none; box-shadow: 0 0 0 3px rgba(108,99,255,0.15); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f1117; } ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 2px; }
      `}</style>

      <div style={{ background: "linear-gradient(135deg, #13161f 0%, #1a1d27 100%)", borderBottom: `1px solid ${C.border}`, padding: "24px 20px 20px" }}>
        <div style={{ fontSize: 9, color: C.accent, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8, fontWeight: 700 }}>
          Formulario de Diagnóstico
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.text, lineHeight: 1.1 }}>
          Gym<span style={{ color: C.accent }}>Diag</span><br />
          <span style={{ fontSize: 14, fontWeight: 400, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>Completá tus datos · Tu consultor los analiza</span>
        </h1>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`, borderRadius: 2, transition: "width 0.4s" }} />
          </div>
          <span style={{ fontSize: 11, color: progress === 100 ? C.gold : C.muted, fontWeight: 700, minWidth: 40 }}>{progress}%</span>
        </div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{filledFields} de {totalFields} campos completados</div>
      </div>

      <div style={{ padding: "14px 14px 120px" }}>
        {SECTIONS.map(s => (
          <SectionCard key={s.id} section={s} data={formData}
            onChange={(k, v) => setFormData(p => ({ ...p, [k]: v }))}
            isActive={openSection === s.id}
            onToggle={() => setOpenSection(openSection === s.id ? null : s.id)} />
        ))}
      </div>

      {showCode && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200,
          display: "flex", alignItems: "flex-end", padding: "0",
        }}>
          <div style={{
            width: "100%", background: C.bgCard, borderRadius: "20px 20px 0 0",
            border: `1px solid ${C.border}`, padding: "24px 20px 40px",
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: C.text }}>¡Listo!</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
                Copiá este código y enviáselo<br />a tu consultor por WhatsApp o email.
              </div>
            </div>
            <div style={{
              background: C.inputBg, borderRadius: 12, padding: "14px",
              border: `1px solid ${C.border}`, marginBottom: 16, position: "relative"
            }}>
              <div style={{ fontSize: 9, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Tu código de diagnóstico
              </div>
              <div style={{
                fontSize: 10, color: C.muted, wordBreak: "break-all", lineHeight: 1.6,
                maxHeight: 80, overflow: "hidden", fontFamily: "monospace"
              }}>
                {code.substring(0, 120)}...
              </div>
            </div>
            <button onClick={copyCode} style={{
              width: "100%", padding: "16px", borderRadius: 12, border: "none",
              background: copied ? C.success : `linear-gradient(135deg, ${C.accent}, #9c8fff)`,
              color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
              fontFamily: "'Syne', sans-serif", marginBottom: 10,
              transition: "background 0.3s",
            }}>
              {copied ? "✓ Código copiado" : "📋 Copiar código"}
            </button>
            <button onClick={() => setShowCode(false)} style={{
              width: "100%", padding: "12px", borderRadius: 12,
              border: `1px solid ${C.border}`, background: "transparent",
              color: C.muted, fontSize: 13, cursor: "pointer"
            }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: C.bgCard, borderTop: `1px solid ${C.border}`,
        padding: "12px 16px 20px"
      }}>
        <button onClick={generateCode} style={{
          width: "100%", padding: "16px", borderRadius: 12, border: "none",
          background: `linear-gradient(135deg, ${C.accent}, #9c8fff)`,
          color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
          fontFamily: "'Syne', sans-serif",
          boxShadow: `0 4px 20px ${C.accentGlow}`,
        }}>
          Generar código para el consultor →
        </button>
        <div style={{ textAlign: "center", fontSize: 10, color: C.muted, marginTop: 8 }}>
          Tus datos quedan privados. Solo el consultor los ve.
        </div>
      </div>
    </div>
  );
}
