import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://iffjdqfwdawqfxwowdqp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZmpkcWZ3ZGF3cWZ4d293ZHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTgyNjIsImV4cCI6MjA5MzU5NDI2Mn0.J3oSgvOBNbO7Kg26HeKiDagkBbrMNsgm5tkClA_0QXI";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:       "#050a10",
  surface:  "#091520",
  surface2: "#0d1e2e",
  border:   "#0e2a40",
  border2:  "#153a55",
  text:     "#d4ecf8",
  sub:      "#2e6880",
  sub2:     "#4a90a8",
  accent:   "linear-gradient(135deg, #2280ff 0%, #00b8d4 50%, #00e5cc 100%)",
  accentS:  "#00c8e0",
  accentB:  "#2280ff",
  green:    "#4cdf9a",
  red:      "#e05c6a",
  gold:     "#ffd060",
  glow:     "0 0 20px rgba(0,200,224,0.15)",
};

const font = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
const mono = "'DM Mono', 'Fira Mono', monospace";

// ─── 2026 DATA ────────────────────────────────────────────────────────────────
const GROUPS = {
  A: ["Mexico","Corea del Sur","Sudáfrica","Chequia"],
  B: ["Canadá","Bosnia-Herz.","Qatar","Suiza"],
  C: ["Brasil","Marruecos","Haití","Escocia"],
  D: ["USA","Paraguay","Australia","Türkiye"],
  E: ["Alemania","Curazao","Costa Marfil","Ecuador"],
  F: ["Países Bajos","Japón","Suecia","Túnez"],
  G: ["Bélgica","Egipto","Irán","Nueva Zelanda"],
  H: ["España","Arabia Saudita","Uruguay","Cabo Verde"],
  I: ["Francia","Senegal","Noruega","Irak"],
  J: ["Argentina","Argelia","Austria","Jordania"],
  K: ["Portugal","Colombia","Uzbekistán","DR Congo"],
  L: ["Inglaterra","Croacia","Ghana","Panamá"],
};

// Group stage matches with real dates/times (Argentina time = ET+1 for summer)
const GROUP_MATCHES = [
  // Group A
  {id:"A1",group:"A",home:"Mexico",away:"Sudáfrica",date:"2026-06-11",time:"16:00",venue:"Ciudad de México"},
  {id:"A2",group:"A",home:"Corea del Sur",away:"Chequia",date:"2026-06-11",time:"23:00",venue:"Zapopan"},
  {id:"A3",group:"A",home:"Mexico",away:"Chequia",date:"2026-06-15",time:"23:00",venue:"Ciudad de México"},
  {id:"A4",group:"A",home:"Corea del Sur",away:"Sudáfrica",date:"2026-06-15",time:"20:00",venue:"Zapopan"},
  {id:"A5",group:"A",home:"Mexico",away:"Corea del Sur",date:"2026-06-19",time:"23:00",venue:"Ciudad de México"},
  {id:"A6",group:"A",home:"Sudáfrica",away:"Chequia",date:"2026-06-19",time:"23:00",venue:"Zapopan"},
  // Group B
  {id:"B1",group:"B",home:"Canadá",away:"Bosnia-Herz.",date:"2026-06-12",time:"16:00",venue:"Toronto"},
  {id:"B2",group:"B",home:"Qatar",away:"Suiza",date:"2026-06-13",time:"16:00",venue:"Santa Clara"},
  {id:"B3",group:"B",home:"Canadá",away:"Suiza",date:"2026-06-17",time:"16:00",venue:"Toronto"},
  {id:"B4",group:"B",home:"Qatar",away:"Bosnia-Herz.",date:"2026-06-17",time:"20:00",venue:"Santa Clara"},
  {id:"B5",group:"B",home:"Canadá",away:"Qatar",date:"2026-06-21",time:"20:00",venue:"Toronto"},
  {id:"B6",group:"B",home:"Bosnia-Herz.",away:"Suiza",date:"2026-06-21",time:"20:00",venue:"Kansas City"},
  // Group C
  {id:"C1",group:"C",home:"Brasil",away:"Marruecos",date:"2026-06-13",time:"19:00",venue:"East Rutherford"},
  {id:"C2",group:"C",home:"Haití",away:"Escocia",date:"2026-06-13",time:"22:00",venue:"Foxborough"},
  {id:"C3",group:"C",home:"Brasil",away:"Escocia",date:"2026-06-17",time:"22:00",venue:"East Rutherford"},
  {id:"C4",group:"C",home:"Marruecos",away:"Haití",date:"2026-06-17",time:"19:00",venue:"Foxborough"},
  {id:"C5",group:"C",home:"Brasil",away:"Haití",date:"2026-06-21",time:"16:00",venue:"East Rutherford"},
  {id:"C6",group:"C",home:"Escocia",away:"Marruecos",date:"2026-06-21",time:"16:00",venue:"Foxborough"},
  // Group D
  {id:"D1",group:"D",home:"USA",away:"Paraguay",date:"2026-06-12",time:"22:00",venue:"Los Ángeles"},
  {id:"D2",group:"D",home:"Australia",away:"Türkiye",date:"2026-06-13",time:"13:00",venue:"Philadelphia"},
  {id:"D3",group:"D",home:"USA",away:"Türkiye",date:"2026-06-17",time:"13:00",venue:"Los Ángeles"},
  {id:"D4",group:"D",home:"Paraguay",away:"Australia",date:"2026-06-17",time:"22:00",venue:"Philadelphia"},
  {id:"D5",group:"D",home:"USA",away:"Australia",date:"2026-06-22",time:"20:00",venue:"Los Ángeles"},
  {id:"D6",group:"D",home:"Türkiye",away:"Paraguay",date:"2026-06-22",time:"20:00",venue:"Philadelphia"},
  // Group E
  {id:"E1",group:"E",home:"Alemania",away:"Costa Marfil",date:"2026-06-14",time:"16:00",venue:"Atlanta"},
  {id:"E2",group:"E",home:"Curazao",away:"Ecuador",date:"2026-06-14",time:"22:00",venue:"Seattle"},
  {id:"E3",group:"E",home:"Alemania",away:"Ecuador",date:"2026-06-18",time:"16:00",venue:"Atlanta"},
  {id:"E4",group:"E",home:"Costa Marfil",away:"Curazao",date:"2026-06-18",time:"22:00",venue:"Seattle"},
  {id:"E5",group:"E",home:"Alemania",away:"Curazao",date:"2026-06-22",time:"16:00",venue:"Atlanta"},
  {id:"E6",group:"E",home:"Ecuador",away:"Costa Marfil",date:"2026-06-22",time:"16:00",venue:"Seattle"},
  // Group F
  {id:"F1",group:"F",home:"Países Bajos",away:"Túnez",date:"2026-06-14",time:"13:00",venue:"Miami"},
  {id:"F2",group:"F",home:"Japón",away:"Suecia",date:"2026-06-14",time:"19:00",venue:"Dallas"},
  {id:"F3",group:"F",home:"Países Bajos",away:"Suecia",date:"2026-06-18",time:"13:00",venue:"Miami"},
  {id:"F4",group:"F",home:"Túnez",away:"Japón",date:"2026-06-18",time:"19:00",venue:"Dallas"},
  {id:"F5",group:"F",home:"Países Bajos",away:"Japón",date:"2026-06-22",time:"22:00",venue:"Miami"},
  {id:"F6",group:"F",home:"Suecia",away:"Túnez",date:"2026-06-22",time:"22:00",venue:"Dallas"},
  // Group G
  {id:"G1",group:"G",home:"Bélgica",away:"Irán",date:"2026-06-15",time:"13:00",venue:"Dallas"},
  {id:"G2",group:"G",home:"Egipto",away:"Nueva Zelanda",date:"2026-06-15",time:"16:00",venue:"Seattle"},
  {id:"G3",group:"G",home:"Bélgica",away:"Nueva Zelanda",date:"2026-06-19",time:"13:00",venue:"Dallas"},
  {id:"G4",group:"G",home:"Irán",away:"Egipto",date:"2026-06-19",time:"16:00",venue:"Seattle"},
  {id:"G5",group:"G",home:"Bélgica",away:"Egipto",date:"2026-06-23",time:"20:00",venue:"Dallas"},
  {id:"G6",group:"G",home:"Nueva Zelanda",away:"Irán",date:"2026-06-23",time:"20:00",venue:"Seattle"},
  // Group H
  {id:"H1",group:"H",home:"España",away:"Arabia Saudita",date:"2026-06-15",time:"19:00",venue:"Kansas City"},
  {id:"H2",group:"H",home:"Uruguay",away:"Cabo Verde",date:"2026-06-15",time:"22:00",venue:"Miami"},
  {id:"H3",group:"H",home:"España",away:"Cabo Verde",date:"2026-06-19",time:"19:00",venue:"Kansas City"},
  {id:"H4",group:"H",home:"Arabia Saudita",away:"Uruguay",date:"2026-06-19",time:"22:00",venue:"Miami"},
  {id:"H5",group:"H",home:"España",away:"Uruguay",date:"2026-06-23",time:"16:00",venue:"Kansas City"},
  {id:"H6",group:"H",home:"Cabo Verde",away:"Arabia Saudita",date:"2026-06-23",time:"16:00",venue:"Miami"},
  // Group I
  {id:"I1",group:"I",home:"Francia",away:"Senegal",date:"2026-06-16",time:"13:00",venue:"Atlanta"},
  {id:"I2",group:"I",home:"Noruega",away:"Irak",date:"2026-06-16",time:"16:00",venue:"Los Ángeles"},
  {id:"I3",group:"I",home:"Francia",away:"Irak",date:"2026-06-20",time:"13:00",venue:"Atlanta"},
  {id:"I4",group:"I",home:"Senegal",away:"Noruega",date:"2026-06-20",time:"16:00",venue:"Los Ángeles"},
  {id:"I5",group:"I",home:"Francia",away:"Noruega",date:"2026-06-24",time:"20:00",venue:"Atlanta"},
  {id:"I6",group:"I",home:"Irak",away:"Senegal",date:"2026-06-24",time:"20:00",venue:"Los Ángeles"},
  // Group J
  {id:"J1",group:"J",home:"Argentina",away:"Argelia",date:"2026-06-16",time:"19:00",venue:"Miami"},
  {id:"J2",group:"J",home:"Austria",away:"Jordania",date:"2026-06-16",time:"22:00",venue:"East Rutherford"},
  {id:"J3",group:"J",home:"Argentina",away:"Jordania",date:"2026-06-20",time:"19:00",venue:"Miami"},
  {id:"J4",group:"J",home:"Argelia",away:"Austria",date:"2026-06-20",time:"22:00",venue:"East Rutherford"},
  {id:"J5",group:"J",home:"Argentina",away:"Austria",date:"2026-06-24",time:"16:00",venue:"Miami"},
  {id:"J6",group:"J",home:"Jordania",away:"Argelia",date:"2026-06-24",time:"16:00",venue:"East Rutherford"},
  // Group K
  {id:"K1",group:"K",home:"Portugal",away:"Uzbekistán",date:"2026-06-17",time:"13:00",venue:"Kansas City"},
  {id:"K2",group:"K",home:"Colombia",away:"DR Congo",date:"2026-06-17",time:"16:00",venue:"Santa Clara"},
  {id:"K3",group:"K",home:"Portugal",away:"DR Congo",date:"2026-06-21",time:"13:00",venue:"Kansas City"},
  {id:"K4",group:"K",home:"Uzbekistán",away:"Colombia",date:"2026-06-21",time:"16:00",venue:"Santa Clara"},
  {id:"K5",group:"K",home:"Portugal",away:"Colombia",date:"2026-06-25",time:"20:00",venue:"Kansas City"},
  {id:"K6",group:"K",home:"DR Congo",away:"Uzbekistán",date:"2026-06-25",time:"20:00",venue:"Santa Clara"},
  // Group L
  {id:"L1",group:"L",home:"Inglaterra",away:"Panamá",date:"2026-06-18",time:"13:00",venue:"Foxborough"},
  {id:"L2",group:"L",home:"Croacia",away:"Ghana",date:"2026-06-18",time:"16:00",venue:"Vancouver"},
  {id:"L3",group:"L",home:"Inglaterra",away:"Ghana",date:"2026-06-22",time:"13:00",venue:"Foxborough"},
  {id:"L4",group:"L",home:"Panamá",away:"Croacia",date:"2026-06-22",time:"16:00",venue:"Vancouver"},
  {id:"L5",group:"L",home:"Inglaterra",away:"Croacia",date:"2026-06-26",time:"20:00",venue:"Foxborough"},
  {id:"L6",group:"L",home:"Ghana",away:"Panamá",date:"2026-06-26",time:"20:00",venue:"Vancouver"},
];

// Knockout bracket — Round of 32 (fixed matchups where possible)
const R32_SLOTS = [
  {id:"r32_0", label:"1°A vs 2°B", home_src:{g:"A",pos:1}, away_src:{g:"B",pos:2}, date:"2026-06-28", time:"16:00", venue:"Los Ángeles"},
  {id:"r32_1", label:"1°B vs 2°A", home_src:{g:"B",pos:1}, away_src:{g:"A",pos:2}, date:"2026-06-28", time:"22:00", venue:"Los Ángeles"},
  {id:"r32_2", label:"1°C vs 2°F", home_src:{g:"C",pos:1}, away_src:{g:"F",pos:2}, date:"2026-06-29", time:"14:00", venue:"Houston"},
  {id:"r32_3", label:"1°F vs 2°C", home_src:{g:"F",pos:1}, away_src:{g:"C",pos:2}, date:"2026-06-29", time:"22:00", venue:"Guadalajara"},
  {id:"r32_4", label:"1°E vs 2°I", home_src:{g:"E",pos:1}, away_src:{g:"I",pos:2}, date:"2026-06-29", time:"17:30", venue:"Foxborough"},
  {id:"r32_5", label:"1°I vs 2°E", home_src:{g:"I",pos:1}, away_src:{g:"E",pos:2}, date:"2026-06-30", time:"18:00", venue:"East Rutherford"},
  {id:"r32_6", label:"1°D vs 2°G", home_src:{g:"D",pos:1}, away_src:{g:"G",pos:2}, date:"2026-07-01", time:"18:00", venue:"Santa Clara"},
  {id:"r32_7", label:"1°G vs 2°D", home_src:{g:"G",pos:1}, away_src:{g:"D",pos:2}, date:"2026-07-01", time:"17:00", venue:"Seattle"},
  {id:"r32_8", label:"1°J vs 2°K", home_src:{g:"J",pos:1}, away_src:{g:"K",pos:2}, date:"2026-07-02", time:"19:00", venue:"Miami"},
  {id:"r32_9", label:"1°K vs 2°J", home_src:{g:"K",pos:1}, away_src:{g:"J",pos:2}, date:"2026-07-02", time:"22:30", venue:"Kansas City"},
  {id:"r32_10",label:"1°H vs 2°L", home_src:{g:"H",pos:1}, away_src:{g:"L",pos:2}, date:"2026-07-03", time:"16:00", venue:"Dallas"},
  {id:"r32_11",label:"1°L vs 2°H", home_src:{g:"L",pos:1}, away_src:{g:"H",pos:2}, date:"2026-07-03", time:"19:00", venue:"Philadelphia"},
  {id:"r32_12",label:"1°E vs 3°mejor", home_src:{g:"E",pos:1}, away_src:null, date:"2026-06-29", time:"17:30", venue:"Foxborough"},
  {id:"r32_13",label:"1°A vs 3°mejor", home_src:{g:"A",pos:1}, away_src:null, date:"2026-07-01", time:"22:00", venue:"Ciudad de México"},
  {id:"r32_14",label:"1°L vs 3°mejor", home_src:{g:"L",pos:1}, away_src:null, date:"2026-07-01", time:"15:00", venue:"Atlanta"},
  {id:"r32_15",label:"1°E vs 3°mejor", home_src:{g:"E",pos:1}, away_src:null, date:"2026-07-02", time:"16:00", venue:"Arlington"},
];

// ─── SCORING ──────────────────────────────────────────────────────────────────
function scoreGroup(pred, off) {
  if (!off || off.home == null || off.home === "" || off.away == null || off.away === "") return null;
  const oh=+off.home, oa=+off.away, ph=+(pred?.home??-1), pa=+(pred?.away??-1);
  if (isNaN(oh)||isNaN(oa)||ph<0||pa<0) return null;
  const oR=oh>oa?"H":oh<oa?"A":"D", pR=ph>pa?"H":ph<pa?"A":"D";
  let p=0;
  if(oR===pR) p+=2;
  if(ph===oh&&pa===oa) p+=8;
  else { if(ph===oh) p+=1; if(pa===oa) p+=1; }
  return p;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "";
  const [y,m,day] = d.split("-");
  const months = ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${parseInt(day)} ${months[parseInt(m)]}`;
}

function ageOk(dob) {
  const now = new Date(), birth = new Date(dob);
  const age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  return age > 18 || (age === 18 && (m > 0 || (m === 0 && now.getDate() >= birth.getDate())));
}

function hashColor(str) {
  let h=0; for(let i=0;i<str.length;i++) h=str.charCodeAt(i)+((h<<5)-h);
  return `hsl(${Math.abs(h)%360},40%,30%)`;
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [view, setView]       = useState("splash"); // splash|login|register|groups_list|group|predictions|ranking|profile
  const [activeGroup, setActiveGroup] = useState(null);
  const [toast, setToast]     = useState(null);
  const [loading, setLoading] = useState(true);

  const toast$ = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),2500); };

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else { setLoading(false); setView("splash"); }
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else { setProfile(null); setView("splash"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(uid) {
    setLoading(true);
    const {data} = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data);
    setLoading(false);
    setView(data ? "groups_list" : "splash");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setView("splash");
  }

  if (loading) return <Splash/>;

  const ctx = { session, profile, setProfile, activeGroup, setActiveGroup, setView, toast$, signOut };

  return (
    <Page>
      {view==="splash"       && <SplashView ctx={ctx}/>}
      {view==="login"        && <LoginView ctx={ctx}/>}
      {view==="register"     && <RegisterView ctx={ctx}/>}
      {view==="groups_list"  && <GroupsListView ctx={ctx}/>}
      {view==="group"        && <GroupView ctx={ctx}/>}
      {view==="predictions"  && <PredictionsView ctx={ctx}/>}
      {view==="ranking"      && <RankingView ctx={ctx}/>}
      {view==="admin"        && <AdminView ctx={ctx}/>}
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </Page>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",background:C.bg}}>
      <div style={{fontSize:56,marginBottom:16}}>⚽</div>
      <div style={{...grad, fontSize:11,letterSpacing:3,marginBottom:8}}>Cargando...</div>
    </div>
  );
}

function SplashView({ctx}) {
  const {setView} = ctx;
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"48px 24px 32px"}}>
        <div style={{position:"relative",marginBottom:24}}>
          <div style={{fontSize:64,filter:"drop-shadow(0 0 20px rgba(0,200,224,0.4))"}}>⚽</div>
        </div>
        <div style={{fontSize:10,letterSpacing:4,color:C.sub2,marginBottom:6,textTransform:"uppercase"}}>Baprode</div>
        <h1 style={{...gradText,fontSize:36,fontWeight:800,textAlign:"center",lineHeight:1.1,margin:0}}>
          Mundial<br/>2026
        </h1>
        <p style={{color:C.sub,fontSize:13,marginTop:10,letterSpacing:0.5}}>USA · México · Canadá</p>
      </div>
      <div style={{padding:"0 20px 48px",display:"flex",flexDirection:"column",gap:10}}>
        <GradBtn onClick={()=>setView("login")}>Iniciar sesión</GradBtn>
        <Btn2 onClick={()=>setView("register")}>Crear cuenta</Btn2>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function LoginView({ctx}) {
  const {setView, toast$, setProfile} = ctx;
  const [email,setEmail]=useState(""), [pw,setPw]=useState(""), [loading,setLoading]=useState(false);

  async function login() {
    if (!email||!pw) return toast$("Completá todos los campos","err");
    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({email, password:pw});
    if (error) { toast$(error.message,"err"); setLoading(false); }
  }

  async function forgotPw() {
    if (!email) return toast$("Ingresá tu email primero","err");
    await supabase.auth.resetPasswordForEmail(email);
    toast$("Email de recuperación enviado");
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Bar title="Iniciar sesión" onBack={()=>setView("splash")}/>
      <div style={{padding:"24px 20px",display:"flex",flexDirection:"column",gap:14}}>
        <Field label="Email" value={email} onChange={setEmail} type="email"/>
        <Field label="Contraseña" value={pw} onChange={setPw} type="password"/>
        <GradBtn onClick={login} disabled={loading}>{loading?"Ingresando...":"Entrar"}</GradBtn>
        <button onClick={forgotPw} style={{background:"none",border:"none",color:C.sub2,
          fontSize:13,cursor:"pointer",padding:"4px 0",fontFamily:font}}>
          Olvidé mi contraseña
        </button>
        <div style={{textAlign:"center",marginTop:8}}>
          <span style={{color:C.sub,fontSize:13}}>¿No tenés cuenta? </span>
          <button onClick={()=>setView("register")} style={{background:"none",border:"none",
            color:C.accentS,fontSize:13,cursor:"pointer",fontFamily:font,fontWeight:600}}>
            Registrate
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterView({ctx}) {
  const {setView, toast$} = ctx;
  const [f,setF] = useState({nombre:"",dni:"",dob:"",email:"",nick:"",pw:"",cel:""});
  const [loading,setLoading] = useState(false);
  const upd = k => v => setF(p=>({...p,[k]:v}));

  async function register() {
    if (!f.nombre||!f.dni||!f.dob||!f.email||!f.nick||!f.pw)
      return toast$("Completá los campos obligatorios","err");
    if (!ageOk(f.dob)) return toast$("Debés ser mayor de 18 años","err");
    setLoading(true);
    const {data,error} = await supabase.auth.signUp({email:f.email, password:f.pw,
      options:{data:{nombre:f.nombre,dni:f.dni,dob:f.dob,nick:f.nick,cel:f.cel}}});
    if (error) { toast$(error.message,"err"); setLoading(false); return; }
    // insert profile
    await supabase.from("profiles").insert({
      id: data.user.id, nombre:f.nombre, dni:f.dni, dob:f.dob,
      email:f.email, nick:f.nick, cel:f.cel, is_admin:false
    });
    toast$("¡Cuenta creada! Revisá tu email");
    setLoading(false);
    setView("login");
  }

  return (
    <div style={{minHeight:"100vh"}}>
      <Bar title="Crear cuenta" onBack={()=>setView("splash")}/>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:40}}>
        <SectionLabel>Datos personales</SectionLabel>
        <Field label="Nombre completo *" value={f.nombre} onChange={upd("nombre")}/>
        <Field label="DNI *" value={f.dni} onChange={upd("dni")} type="number"/>
        <Field label="Fecha de nacimiento *" value={f.dob} onChange={upd("dob")} type="date"/>
        <SectionLabel>Cuenta</SectionLabel>
        <Field label="Email *" value={f.email} onChange={upd("email")} type="email"/>
        <Field label="Nick (nombre en el juego) *" value={f.nick} onChange={upd("nick")}/>
        <Field label="Contraseña *" value={f.pw} onChange={upd("pw")} type="password"/>
        <Field label="Celular (opcional)" value={f.cel} onChange={upd("cel")} type="tel"/>
        <div style={{marginTop:4}}>
          <GradBtn onClick={register} disabled={loading}>{loading?"Creando...":"Crear cuenta"}</GradBtn>
        </div>
      </div>
    </div>
  );
}

// ─── GROUPS LIST ──────────────────────────────────────────────────────────────
function GroupsListView({ctx}) {
  const {profile,setView,setActiveGroup,toast$,signOut} = ctx;
  const [myGroups,setMyGroups] = useState([]);
  const [loading,setLoading]   = useState(true);
  const [showJoin,setShowJoin] = useState(false);
  const [showCreate,setShowCreate] = useState(false);

  useEffect(()=>{ fetchGroups(); },[]);

  async function fetchGroups() {
    setLoading(true);
    const {data} = await supabase
      .from("group_members").select("group_id, groups(id,name,max_members,created_by,updated_at)")
      .eq("user_id", profile.id);
    setMyGroups(data?.map(d=>d.groups).filter(Boolean)||[]);
    setLoading(false);
  }

  if (profile?.is_admin) return <AdminView ctx={ctx}/>;

  return (
    <div style={{minHeight:"100vh"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
        <div>
          <div style={{fontSize:10,color:C.sub,letterSpacing:1,textTransform:"uppercase"}}>Bienvenido</div>
          <div style={{fontSize:16,fontWeight:700,color:C.text}}>{profile?.nick||profile?.nombre}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <IconBtn onClick={()=>setShowCreate(true)} title="Crear grupo">＋</IconBtn>
          <IconBtn onClick={signOut} title="Salir">⏻</IconBtn>
        </div>
      </div>

      <div style={{padding:"16px",paddingBottom:100}}>
        <SectionLabel>Mis grupos</SectionLabel>
        {loading && <p style={{color:C.sub,fontSize:13,textAlign:"center",marginTop:24}}>Cargando...</p>}
        {!loading && myGroups.length===0 && (
          <div style={{textAlign:"center",marginTop:32,color:C.sub,fontSize:13}}>
            <div style={{fontSize:32,marginBottom:12}}>🏟</div>
            <p>No estás en ningún grupo todavía</p>
          </div>
        )}
        {myGroups.map(g=>(
          <div key={g.id} style={{...card,cursor:"pointer",marginBottom:10}}
            onClick={()=>{setActiveGroup(g);setView("group");}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:12,background:hashColor(g.name),
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:18,fontWeight:700,color:"#fff"}}>
                {g.name[0]}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,color:C.text}}>{g.name}</div>
                <div style={{fontSize:11,color:C.sub,marginTop:2}}>
                  Última act: {g.updated_at ? new Date(g.updated_at).toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}) : "—"}
                </div>
              </div>
              <span style={{color:C.sub2,fontSize:20}}>›</span>
            </div>
          </div>
        ))}

        <div style={{marginTop:16}}>
          <Btn2 onClick={()=>setShowJoin(true)}>Unirse a un grupo</Btn2>
        </div>
      </div>

      {showCreate && <CreateGroupModal profile={profile} onClose={()=>setShowCreate(false)} onCreated={()=>{fetchGroups();setShowCreate(false);}} toast$={toast$}/>}
      {showJoin   && <JoinGroupModal profile={profile} onClose={()=>setShowJoin(false)} onJoined={()=>{fetchGroups();setShowJoin(false);}} toast$={toast$}/>}
    </div>
  );
}

function CreateGroupModal({profile,onClose,onCreated,toast$}) {
  const [name,setName]=useState(""), [max,setMax]=useState("10"), [loading,setLoading]=useState(false);
  async function create() {
    if (!name) return toast$("Ingresá un nombre","err");
    setLoading(true);
    const {data,error} = await supabase.from("groups")
      .insert({name,max_members:+max,created_by:profile.id}).select().single();
    if (error) { toast$(error.message,"err"); setLoading(false); return; }
    await supabase.from("group_members").insert({group_id:data.id,user_id:profile.id,role:"admin"});
    onCreated();
  }
  return (
    <Modal title="Crear grupo" onClose={onClose}>
      <Field label="Nombre del grupo" value={name} onChange={setName}/>
      <div style={{marginTop:12}}>
        <Field label="Máximo de participantes" value={max} onChange={setMax} type="number"/>
      </div>
      <div style={{marginTop:16}}>
        <GradBtn onClick={create} disabled={loading}>{loading?"Creando...":"Crear"}</GradBtn>
      </div>
    </Modal>
  );
}

function JoinGroupModal({profile,onClose,onJoined,toast$}) {
  const [q,setQ]=useState(""), [results,setResults]=useState([]), [loading,setLoading]=useState(false);

  async function search() {
    if (!q) return;
    const {data} = await supabase.from("groups").select("*").ilike("name",`%${q}%`).limit(10);
    setResults(data||[]);
  }

  async function join(g) {
    setLoading(true);
    const {data:members} = await supabase.from("group_members").select("*").eq("group_id",g.id);
    if (members?.length >= g.max_members) { toast$("El grupo está lleno","err"); setLoading(false); return; }
    const already = members?.find(m=>m.user_id===profile.id);
    if (already) { toast$("Ya sos miembro de este grupo","err"); setLoading(false); return; }
    await supabase.from("group_members").insert({group_id:g.id,user_id:profile.id,role:"member"});
    toast$("¡Te uniste al grupo!");
    onJoined();
  }

  return (
    <Modal title="Unirse a grupo" onClose={onClose}>
      <div style={{display:"flex",gap:8}}>
        <input style={{...inp,flex:1}} placeholder="Buscar grupo..." value={q} onChange={e=>setQ(e.target.value)}/>
        <button onClick={search} style={{...gradBtnS,padding:"0 14px",fontSize:13}}>Buscar</button>
      </div>
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8}}>
        {results.map(g=>(
          <div key={g.id} style={{...card,display:"flex",alignItems:"center",gap:10}}>
            <span style={{flex:1,fontSize:14,color:C.text}}>{g.name}</span>
            <span style={{fontSize:11,color:C.sub}}>Máx {g.max_members}</span>
            <button onClick={()=>join(g)} style={{...gradBtnS,padding:"6px 12px",fontSize:12}} disabled={loading}>
              Unirse
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── GROUP VIEW ───────────────────────────────────────────────────────────────
function GroupView({ctx}) {
  const {profile,activeGroup,setView,toast$} = ctx;
  const [members,setMembers] = useState([]);
  const [selectedUser,setSelectedUser] = useState(null);

  useEffect(()=>{ fetchMembers(); },[]);

  async function fetchMembers() {
    const {data} = await supabase.from("group_members")
      .select("user_id, role, profiles(id,nick,nombre)")
      .eq("group_id",activeGroup.id);
    setMembers(data||[]);
  }

  const updatedAt = activeGroup?.updated_at
    ? new Date(activeGroup.updated_at).toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires",
        day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})
    : "Sin datos cargados";

  return (
    <div style={{minHeight:"100vh"}}>
      <Bar title={activeGroup?.name} onBack={()=>setView("groups_list")}/>

      {/* Last update banner */}
      <div style={{margin:"12px 16px 0",background:C.surface2,borderRadius:10,
        padding:"10px 14px",border:`1px solid ${C.border}`,
        display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14}}>🕐</span>
        <div>
          <div style={{fontSize:10,color:C.sub,letterSpacing:0.5}}>Última actualización oficial</div>
          <div style={{fontSize:13,fontWeight:600,color:C.accentS}}>{updatedAt}</div>
        </div>
      </div>

      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
        <GradBtn onClick={()=>setView("predictions")}>📋 Mis predicciones</GradBtn>
        <Btn2 onClick={()=>setView("ranking")}>🏆 Ranking del grupo</Btn2>
      </div>

      <div style={{padding:"0 16px 16px"}}>
        <SectionLabel>Miembros ({members.length}/{activeGroup?.max_members})</SectionLabel>
        {members.map(m=>(
          <div key={m.user_id} style={{...card,marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
            <Ava name={m.profiles?.nick||m.profiles?.nombre||"?"} size={34}/>
            <span style={{flex:1,fontSize:14,color:m.user_id===profile.id?C.accentS:C.text}}>
              {m.profiles?.nick||m.profiles?.nombre}
              {m.user_id===profile.id?" (vos)":""}
            </span>
            {m.role==="admin" && <span style={{fontSize:10,color:C.gold,background:"rgba(255,208,96,0.1)",
              padding:"2px 8px",borderRadius:10,border:"1px solid rgba(255,208,96,0.2)"}}>Admin</span>}
            {m.user_id!==profile.id && (
              <button onClick={()=>setSelectedUser(m)} style={{background:"none",border:`1px solid ${C.border}`,
                color:C.sub2,borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:font}}>
                Ver planilla
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedUser && (
        <ViewUserPredModal user={selectedUser} group={activeGroup} onClose={()=>setSelectedUser(null)}/>
      )}
    </div>
  );
}

// ─── PREDICTIONS ──────────────────────────────────────────────────────────────
function PredictionsView({ctx}) {
  const {profile,activeGroup,setView,toast$} = ctx;
  const [tab,setTab]       = useState("groups");
  const [activeGrp,setActiveGrp] = useState("A");
  const [preds,setPreds]   = useState({});
  const [official,setOfficial] = useState({});
  const [saving,setSaving] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  useEffect(()=>{ loadData(); },[]);

  async function loadData() {
    // load official results
    const {data:off} = await supabase.from("official_results").select("*");
    const offMap={};
    off?.forEach(r=>{ offMap[r.match_id]=r; });
    setOfficial(offMap);

    // load my preds for this group
    const {data:myPreds} = await supabase.from("predictions")
      .select("*").eq("user_id",profile.id).eq("group_id",activeGroup.id);

    if (myPreds?.length > 0) {
      const map={};
      myPreds.forEach(p=>{ map[p.match_id]=p; });
      setPreds(map);
    } else {
      // check if user has preds in other groups
      const {data:otherPreds} = await supabase.from("predictions")
        .select("*").eq("user_id",profile.id).neq("group_id",activeGroup.id).limit(1);
      if (otherPreds?.length>0) setShowCopyModal(true);
    }
  }

  async function copyFromExisting() {
    const {data:otherPreds} = await supabase.from("predictions")
      .select("*").eq("user_id",profile.id).neq("group_id",activeGroup.id);
    const map={};
    otherPreds?.forEach(p=>{ map[p.match_id]={...p,group_id:activeGroup.id,id:undefined}; });
    setPreds(map);
    setShowCopyModal(false);
    toast$("Planilla cargada. Guardá cuando quieras");
  }

  function upd(matchId,field,val) {
    setPreds(p=>({...p,[matchId]:{...(p[matchId]||{}),[field]:val}}));
  }

  async function save() {
    setSaving(true);
    const rows = Object.entries(preds).map(([match_id,p])=>({
      user_id:profile.id, group_id:activeGroup.id, match_id,
      home:p.home??null, away:p.away??null, winner:p.winner??null,
      pen_home:p.pen_home??null, pen_away:p.pen_away??null
    }));
    await supabase.from("predictions").upsert(rows, {onConflict:"user_id,group_id,match_id"});
    setSaving(false);
    toast$("Guardado ✓");
  }

  const sortedGroupMatches = [...GROUP_MATCHES.filter(m=>m.group===activeGrp)]
    .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));

  return (
    <div style={{minHeight:"100vh"}}>
      <Bar title="Mis predicciones" onBack={()=>setView("group")}/>
      <Tabs items={[{id:"groups",label:"Grupos"},{id:"knockout",label:"Cruces"}]}
        active={tab} onSelect={setTab}/>

      {tab==="groups" && (
        <>
          <Tabs items={Object.keys(GROUPS).map(g=>({id:g,label:g}))} active={activeGrp}
            onSelect={setActiveGrp} small/>
          <div style={{padding:"10px 14px 100px"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
              {GROUPS[activeGrp].map(t=><span key={t} style={pill}>{t}</span>)}
            </div>
            {sortedGroupMatches.map(m=>(
              <PredMatchCard key={m.id} match={m}
                pred={preds[m.id]||{}}
                off={official[m.id]||{}}
                onUpd={(f,v)=>upd(m.id,f,v)}
              />
            ))}
          </div>
        </>
      )}

      {tab==="knockout" && (
        <div style={{padding:"10px 14px 100px"}}>
          <div style={{...card,marginBottom:12,padding:"12px 14px"}}>
            <p style={{color:C.sub,fontSize:13,margin:0,lineHeight:1.6}}>
              Los cruces se completan automáticamente según los resultados de grupos. 
              Podés predecir el resultado de cada partido una vez que los equipos estén definidos.
            </p>
          </div>
          {R32_SLOTS.slice(0,12).map((slot,i)=>(
            <KOPredCard key={slot.id} slot={slot}
              pred={preds[slot.id]||{}}
              off={official[slot.id]||{}}
              onUpd={(f,v)=>upd(slot.id,f,v)}
            />
          ))}
        </div>
      )}

      {/* Save bar */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:480,background:C.bg,borderTop:`1px solid ${C.border}`,
        padding:"12px 16px calc(12px + env(safe-area-inset-bottom))",zIndex:20}}>
        <GradBtn onClick={save} disabled={saving}>{saving?"Guardando...":"Guardar predicciones"}</GradBtn>
      </div>

      {showCopyModal && (
        <Modal title="Planilla existente" onClose={()=>setShowCopyModal(false)}>
          <p style={{color:C.sub,fontSize:14,lineHeight:1.6,marginBottom:16}}>
            Ya tenés una planilla en otro grupo. ¿Querés usarla como base o empezar de cero?
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <GradBtn onClick={copyFromExisting}>Usar planilla existente</GradBtn>
            <Btn2 onClick={()=>setShowCopyModal(false)}>Empezar de cero</Btn2>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PredMatchCard({match,pred,off,onUpd}) {
  const hasOff = off.home!=null&&off.home!==""&&off.away!=null&&off.away!=="";
  const sc = hasOff ? scoreGroup(pred,off) : null;
  const isDraw = hasOff && +off.home===+off.away;

  return (
    <div style={{...card,marginBottom:10}}>
      {/* Date/venue */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:10,color:C.sub2,letterSpacing:0.5}}>
          {fmtDate(match.date)} · {match.time} hs · {match.venue}
        </span>
        {sc!=null && <PtsBadge pts={sc}/>}
      </div>
      {/* Score row */}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{flex:1,fontSize:13,color:C.sub,lineHeight:1.3}}>{match.home}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <ScoreBox value={pred.home??""} onChange={v=>onUpd("home",v)}
            state={hasOff?(+pred.home===+off.home?"ok":"err"):null}/>
          <span style={{color:C.border2,fontSize:13,fontFamily:mono}}>—</span>
          <ScoreBox value={pred.away??""} onChange={v=>onUpd("away",v)}
            state={hasOff?(+pred.away===+off.away?"ok":"err"):null}/>
        </div>
        <span style={{flex:1,fontSize:13,color:C.sub,textAlign:"right",lineHeight:1.3}}>{match.away}</span>
      </div>
      {hasOff && (
        <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
          <span style={{color:C.sub,fontSize:11}}>Oficial: {off.home}–{off.away}</span>
        </div>
      )}
    </div>
  );
}

function KOPredCard({slot,pred,off,onUpd}) {
  const hasOff = !!off.winner;
  const isDraw = pred.home!=="" && pred.away!=="" && +pred.home===+pred.away;
  const showPen = isDraw;

  return (
    <div style={{...card,marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:10,color:C.sub2,letterSpacing:0.5}}>
          {fmtDate(slot.date)} · {slot.time} hs · {slot.venue}
        </span>
        <span style={{fontSize:10,color:C.sub,background:C.surface2,
          padding:"2px 8px",borderRadius:10,border:`1px solid ${C.border}`}}>{slot.label}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <div>
          <div style={{fontSize:10,color:C.sub,marginBottom:4}}>Equipo 1</div>
          <input style={inp} value={pred.t1||slot.home_src?`${slot.home_src?.g} 1°`:""} readOnly
            placeholder={slot.label?.split(" vs ")[0]}/>
        </div>
        <div>
          <div style={{fontSize:10,color:C.sub,marginBottom:4}}>Equipo 2</div>
          <input style={inp} value={pred.t2||""} readOnly
            placeholder={slot.label?.split(" vs ")[1]}/>
        </div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
        <ScoreBox value={pred.home??""} onChange={v=>onUpd("home",v)}/>
        <span style={{color:C.border2,fontSize:13,fontFamily:mono}}>—</span>
        <ScoreBox value={pred.away??""} onChange={v=>onUpd("away",v)}/>
        {showPen && <span style={{fontSize:10,color:C.gold,marginLeft:4}}>⚡ Penales</span>}
      </div>
      {showPen && (
        <div style={{display:"flex",gap:8,padding:"10px",background:C.surface2,
          borderRadius:8,border:`1px solid ${C.border}`}}>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:C.sub,marginBottom:4}}>Penales E1</div>
            <input type="number" style={inp} value={pred.pen_home||""}
              onChange={e=>onUpd("pen_home",e.target.value)} min="0"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:C.sub,marginBottom:4}}>Penales E2</div>
            <input type="number" style={inp} value={pred.pen_away||""}
              onChange={e=>onUpd("pen_away",e.target.value)} min="0"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:C.sub,marginBottom:4}}>Ganador</div>
            <input style={inp} value={pred.winner||""} onChange={e=>onUpd("winner",e.target.value)}
              placeholder="País"/>
          </div>
        </div>
      )}
      {!showPen && (
        <div>
          <div style={{fontSize:10,color:C.sub,marginBottom:4}}>Ganador</div>
          <input style={inp} value={pred.winner||""} onChange={e=>onUpd("winner",e.target.value)}
            placeholder="País"/>
        </div>
      )}
    </div>
  );
}

// ─── RANKING ─────────────────────────────────────────────────────────────────
function RankingView({ctx}) {
  const {profile,activeGroup,setView} = ctx;
  const [ranking,setRanking] = useState([]);
  const [official,setOfficial] = useState({});
  const [loading,setLoading]   = useState(true);

  useEffect(()=>{ loadRanking(); },[]);

  async function loadRanking() {
    const {data:off} = await supabase.from("official_results").select("*");
    const offMap={};
    off?.forEach(r=>{ offMap[r.match_id]=r; });
    setOfficial(offMap);

    const {data:members} = await supabase.from("group_members")
      .select("user_id, profiles(id,nick,nombre)").eq("group_id",activeGroup.id);

    const results = await Promise.all(members.map(async m=>{
      const {data:preds} = await supabase.from("predictions")
        .select("*").eq("user_id",m.user_id).eq("group_id",activeGroup.id);
      let pts=0;
      preds?.forEach(p=>{
        const sc=scoreGroup(p,offMap[p.match_id]);
        if(sc!=null) pts+=sc;
      });
      return {name:m.profiles?.nick||m.profiles?.nombre, pts, uid:m.user_id};
    }));
    setRanking(results.sort((a,b)=>b.pts-a.pts));
    setLoading(false);
  }

  const medals=["🥇","🥈","🥉"];

  return (
    <div style={{minHeight:"100vh"}}>
      <Bar title={`Ranking · ${activeGroup?.name}`} onBack={()=>setView("group")}/>
      <div style={{padding:"16px 14px 80px"}}>
        {loading && <p style={{color:C.sub,textAlign:"center",marginTop:24}}>Calculando...</p>}
        {ranking.map((r,i)=>(
          <div key={r.uid} style={{
            ...rankRow,
            background: r.uid===profile.id?"rgba(0,200,224,0.07)":C.surface,
            borderLeft:`2px solid ${r.uid===profile.id?C.accentS:i<3?"rgba(0,200,224,0.25)":C.border}`,
            marginBottom:8,
          }}>
            <span style={{width:28,fontSize:i<3?20:12,textAlign:"center",flexShrink:0,
              color:i===0?C.gold:i===1?"#C0C0C0":i===2?"#CD7F32":C.sub}}>
              {medals[i]||`${i+1}`}
            </span>
            <Ava name={r.name} size={32}/>
            <span style={{flex:1,fontSize:14,fontWeight:r.uid===profile.id?600:400,
              color:r.uid===profile.id?C.accentS:C.text,fontFamily:font}}>{r.name}</span>
            <span style={{fontFamily:mono,fontSize:18,fontWeight:700,color:C.text}}>{r.pts}</span>
            <span style={{fontSize:10,color:C.sub,marginLeft:3}}>pts</span>
          </div>
        ))}
        {!loading && ranking.every(r=>r.pts===0) && (
          <p style={{color:C.sub,textAlign:"center",marginTop:40,fontSize:13}}>Sin resultados oficiales aún</p>
        )}
      </div>
    </div>
  );
}

// ─── VIEW USER PREDICTIONS (read-only) ───────────────────────────────────────
function ViewUserPredModal({user,group,onClose}) {
  const [preds,setPreds]=useState({});
  const [official,setOfficial]=useState({});
  const [ag,setAg]=useState("A");
  useEffect(()=>{
    (async()=>{
      const {data:off} = await supabase.from("official_results").select("*");
      const offMap={}; off?.forEach(r=>{offMap[r.match_id]=r;}); setOfficial(offMap);
      const {data:p} = await supabase.from("predictions").select("*")
        .eq("user_id",user.user_id).eq("group_id",group.id);
      const map={}; p?.forEach(x=>{map[x.match_id]=x;}); setPreds(map);
    })();
  },[]);
  const name = user.profiles?.nick||user.profiles?.nombre;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,overflowY:"auto"}}>
      <div style={{background:C.bg,minHeight:"100%",maxWidth:480,margin:"0 auto"}}>
        <Bar title={`Planilla de ${name}`} onBack={onClose}/>
        <Tabs items={Object.keys(GROUPS).map(g=>({id:g,label:g}))} active={ag} onSelect={setAg} small/>
        <div style={{padding:"10px 14px 40px"}}>
          {GROUP_MATCHES.filter(m=>m.group===ag)
            .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))
            .map(m=>(
            <div key={m.id} style={{...card,marginBottom:8}}>
              <div style={{fontSize:10,color:C.sub2,marginBottom:6}}>
                {fmtDate(m.date)} · {m.time} hs
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{flex:1,fontSize:13,color:C.sub}}>{m.home}</span>
                <span style={{fontFamily:mono,fontSize:16,fontWeight:700,color:C.text,minWidth:60,textAlign:"center"}}>
                  {preds[m.id]?.home??"-"} — {preds[m.id]?.away??"-"}
                </span>
                <span style={{flex:1,fontSize:13,color:C.sub,textAlign:"right"}}>{m.away}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminView({ctx}) {
  const {setView,signOut} = ctx;
  const [tab,setTab]=useState("results");
  const [ag,setAg]=useState("A");
  const [official,setOfficial]=useState({});
  const [saving,setSaving]=useState(false);
  const toast$ = ctx.toast$;

  useEffect(()=>{ loadOfficial(); },[]);

  async function loadOfficial() {
    const {data} = await supabase.from("official_results").select("*");
    const map={}; data?.forEach(r=>{map[r.match_id]=r;}); setOfficial(map);
  }

  function upd(matchId,field,val) {
    setOfficial(p=>({...p,[matchId]:{...(p[matchId]||{match_id:matchId}),[field]:val}}));
  }

  async function save() {
    setSaving(true);
    const rows=Object.values(official).map(r=>({
      match_id:r.match_id, home:r.home??null, away:r.away??null,
      winner:r.winner??null, pen_home:r.pen_home??null, pen_away:r.pen_away??null
    }));
    await supabase.from("official_results").upsert(rows,{onConflict:"match_id"});
    // update all groups' updated_at
    await supabase.from("groups").update({updated_at:new Date().toISOString()}).neq("id","");
    setSaving(false);
    toast$("Resultados guardados ✓");
  }

  const sortedGroupMatches = [...GROUP_MATCHES.filter(m=>m.group===ag)]
    .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));

  return (
    <div style={{minHeight:"100vh"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{...gradText,fontSize:15,fontWeight:700}}>⚙️ Panel Admin</div>
        <IconBtn onClick={signOut}>⏻</IconBtn>
      </div>
      <Tabs items={[{id:"results",label:"Resultados"},{id:"groups_admin",label:"Grupos"}]}
        active={tab} onSelect={setTab}/>

      {tab==="results" && (
        <>
          <Tabs items={Object.keys(GROUPS).map(g=>({id:g,label:g}))} active={ag} onSelect={setAg} small/>
          <div style={{padding:"10px 14px 100px"}}>
            {sortedGroupMatches.map(m=>(
              <div key={m.id} style={{...card,marginBottom:10}}>
                <div style={{fontSize:10,color:C.sub2,marginBottom:8}}>
                  {fmtDate(m.date)} · {m.time} hs · {m.venue}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{flex:1,fontSize:13,color:C.sub}}>{m.home}</span>
                  <ScoreBox value={official[m.id]?.home??""} onChange={v=>upd(m.id,"home",v)}/>
                  <span style={{color:C.border2,fontSize:13,fontFamily:mono}}>—</span>
                  <ScoreBox value={official[m.id]?.away??""} onChange={v=>upd(m.id,"away",v)}/>
                  <span style={{flex:1,fontSize:13,color:C.sub,textAlign:"right"}}>{m.away}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
            width:"100%",maxWidth:480,background:C.bg,borderTop:`1px solid ${C.border}`,
            padding:"12px 16px calc(12px + env(safe-area-inset-bottom))",zIndex:20}}>
            <GradBtn onClick={save} disabled={saving}>{saving?"Guardando...":"Guardar resultados"}</GradBtn>
          </div>
        </>
      )}

      {tab==="groups_admin" && <AdminGroupsTab toast$={toast$}/>}
    </div>
  );
}

function AdminGroupsTab({toast$}) {
  const [groups,setGroups]=useState([]);
  useEffect(()=>{ supabase.from("groups").select("*,group_members(count)").then(({data})=>setGroups(data||[])); },[]);

  async function updateMax(id,val) {
    await supabase.from("groups").update({max_members:+val}).eq("id",id);
    setGroups(p=>p.map(g=>g.id===id?{...g,max_members:+val}:g));
    toast$("Actualizado");
  }

  return (
    <div style={{padding:"12px 14px 40px"}}>
      {groups.map(g=>(
        <div key={g.id} style={{...card,marginBottom:10}}>
          <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:8}}>{g.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:C.sub,flex:1}}>Máx participantes</span>
            <input type="number" style={{...inp,width:70,textAlign:"center"}}
              defaultValue={g.max_members}
              onBlur={e=>updateMax(g.id,e.target.value)}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Page({children}) {
  return <div style={{minHeight:"100vh",background:C.bg,color:C.text,
    fontFamily:font,maxWidth:480,margin:"0 auto",position:"relative"}}>{children}</div>;
}

function Bar({title,onBack}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",
      borderBottom:`1px solid ${C.border}`,background:C.bg,
      position:"sticky",top:0,zIndex:10}}>
      {onBack && <button onClick={onBack} style={{background:"none",border:"none",
        color:C.sub2,fontSize:22,cursor:"pointer",padding:"0 4px",lineHeight:1}}>←</button>}
      <span style={{fontSize:15,fontWeight:700,color:C.text,flex:1}}>{title}</span>
    </div>
  );
}

function Tabs({items,active,onSelect,small}) {
  return (
    <div style={{display:"flex",overflowX:"auto",borderBottom:`1px solid ${C.border}`,
      scrollbarWidth:"none",background:C.bg}}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>onSelect(it.id)} style={{
          background:"none",border:"none",cursor:"pointer",whiteSpace:"nowrap",fontFamily:font,
          padding:small?"8px 12px":"10px 16px",
          fontSize:small?12:13,fontWeight:600,
          color:active===it.id?C.accentS:C.sub,
          borderBottom:`2px solid ${active===it.id?C.accentS:"transparent"}`,
        }}>{it.label}</button>
      ))}
    </div>
  );
}

function Field({label,value,onChange,type="text"}) {
  return (
    <div>
      <div style={{fontSize:11,color:C.sub,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>{label}</div>
      <input type={type} style={inp} value={value} onChange={e=>onChange(e.target.value)}/>
    </div>
  );
}

function ScoreBox({value,onChange,state}) {
  const col=state==="ok"?C.green:state==="err"?C.red:C.border2;
  return (
    <input type="number" min="0" max="20" value={value} onChange={e=>onChange&&onChange(e.target.value)}
      style={{width:42,height:42,textAlign:"center",background:C.surface2,
        border:`1.5px solid ${col}`,borderRadius:8,
        color:state==="ok"?C.green:state==="err"?C.red:C.text,
        fontSize:18,fontWeight:700,fontFamily:mono,outline:"none",
        MozAppearance:"textfield"}}
    />
  );
}

function PtsBadge({pts}) {
  return (
    <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,
      background:pts>0?"rgba(76,223,154,0.12)":"rgba(255,255,255,0.04)",
      color:pts>0?C.green:C.sub,
      border:`1px solid ${pts>0?"rgba(76,223,154,0.3)":C.border}`}}>
      {pts} pts
    </span>
  );
}

function GradBtn({onClick,children,disabled}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%",padding:"15px",borderRadius:12,border:"none",cursor:disabled?"not-allowed":"pointer",
      fontSize:15,fontWeight:700,letterSpacing:0.3,fontFamily:font,
      background:disabled?"#1a2a3a":C.accent,
      color:disabled?C.sub:"#040a10",
      boxShadow:disabled?"none":`0 0 20px rgba(0,200,224,0.25)`,
    }}>{children}</button>
  );
}

function Btn2({onClick,children}) {
  return (
    <button onClick={onClick} style={{
      width:"100%",padding:"13px",borderRadius:12,
      border:`1px solid ${C.border}`,cursor:"pointer",
      fontSize:14,fontWeight:600,fontFamily:font,
      background:C.surface,color:C.text,
    }}>{children}</button>
  );
}

function IconBtn({onClick,children,title}) {
  return (
    <button onClick={onClick} title={title} style={{
      background:C.surface,border:`1px solid ${C.border}`,
      borderRadius:10,width:38,height:38,cursor:"pointer",
      color:C.sub2,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",
    }}>{children}</button>
  );
}

function SectionLabel({children}) {
  return <div style={{fontSize:10,color:C.sub,letterSpacing:1,textTransform:"uppercase",
    marginBottom:10,marginTop:4}}>{children}</div>;
}

function Ava({name,size=34}) {
  const h=hashColor(name);
  let initials=name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:h,flexShrink:0,
      display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:size*0.35,fontWeight:700,color:"rgba(255,255,255,0.8)"}}>
      {initials}
    </div>
  );
}

function Modal({title,onClose,children}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:50,
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.surface,borderRadius:"20px 20px 0 0",
        width:"100%",maxWidth:480,padding:"24px 20px 32px",
        border:`1px solid ${C.border}`,borderBottom:"none"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:16,fontWeight:700,color:C.text,flex:1}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",
            color:C.sub,fontSize:22,cursor:"pointer"}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({msg,type}) {
  return (
    <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",
      background:type==="err"?"rgba(224,92,106,0.15)":"rgba(0,200,224,0.12)",
      border:`1px solid ${type==="err"?C.red:C.accentS}`,
      color:type==="err"?C.red:C.accentS,
      padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:600,
      letterSpacing:0.3,zIndex:100,whiteSpace:"nowrap",
      boxShadow:"0 4px 24px rgba(0,0,0,0.5)",fontFamily:font}}>
      {msg}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const inp = {
  width:"100%",background:C.surface2,border:`1px solid ${C.border}`,
  borderRadius:10,color:C.text,padding:"11px 13px",fontSize:14,
  boxSizing:"border-box",fontFamily:font,outline:"none",
};

const card = {
  background:C.surface,borderRadius:14,padding:"14px",
  border:`1px solid ${C.border}`,
};

const pill = {
  fontSize:12,color:C.sub2,background:C.surface2,
  padding:"4px 11px",borderRadius:20,border:`1px solid ${C.border}`,
};

const rankRow = {
  display:"flex",alignItems:"center",gap:10,
  padding:"12px 14px",borderRadius:12,
};

const gradText = {
  background:C.accent,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
  backgroundClip:"text",
};

const grad = {
  background:C.accent,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
};

const gradBtnS = {
  background:C.accent,border:"none",borderRadius:8,cursor:"pointer",
  fontSize:13,fontWeight:700,color:"#040a10",fontFamily:font,
};
