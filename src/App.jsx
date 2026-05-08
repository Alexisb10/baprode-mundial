import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iffjdqfwdawqfxwowdqp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZmpkcWZ3ZGF3cWZ4d293ZHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTgyNjIsImV4cCI6MjA5MzU5NDI2Mn0.J3oSgvOBNbO7Kg26HeKiDagkBbrMNsgm5tkClA_0QXI";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TOURNAMENT_START = new Date("2026-06-11T00:00:00-03:00");
const isLocked = () => new Date() >= TOURNAMENT_START;

const C = {
  bg:"#050a10",surface:"#091520",surface2:"#0d1e2e",
  border:"#0e2a40",border2:"#153a55",text:"#d4ecf8",
  sub:"#2e6880",sub2:"#4a90a8",
  accent:"linear-gradient(135deg, #2280ff 0%, #00b8d4 50%, #00e5cc 100%)",
  accentS:"#00c8e0",accentB:"#2280ff",
  green:"#4cdf9a",red:"#e05c6a",gold:"#ffd060",
};
const font = "'DM Sans','Segoe UI',system-ui,sans-serif";
const mono = "'DM Mono','Fira Mono',monospace";
const b = (color) => "1px solid " + color;
const b2 = (color) => "2px solid " + color;
const b3 = (color) => "3px solid " + color;

const GROUPS = {
  A:["Mexico","Corea del Sur","Sudáfrica","Chequia"],
  B:["Canadá","Bosnia-Herz.","Qatar","Suiza"],
  C:["Brasil","Marruecos","Haití","Escocia"],
  D:["USA","Paraguay","Australia","Türkiye"],
  E:["Alemania","Curazao","Costa Marfil","Ecuador"],
  F:["Países Bajos","Japón","Suecia","Túnez"],
  G:["Bélgica","Egipto","Irán","Nueva Zelanda"],
  H:["España","Arabia Saudita","Uruguay","Cabo Verde"],
  I:["Francia","Senegal","Noruega","Irak"],
  J:["Argentina","Argelia","Austria","Jordania"],
  K:["Portugal","Colombia","Uzbekistán","DR Congo"],
  L:["Inglaterra","Croacia","Ghana","Panamá"],
};

const ALL_TEAMS = Object.values(GROUPS).flat().sort();

const GROUP_MATCHES = [
  {id:"A1",group:"A",home:"Mexico",away:"Sudáfrica",date:"2026-06-11",time:"16:00",venue:"Ciudad de México"},
  {id:"A2",group:"A",home:"Corea del Sur",away:"Chequia",date:"2026-06-11",time:"23:00",venue:"Zapopan"},
  {id:"A3",group:"A",home:"Mexico",away:"Chequia",date:"2026-06-15",time:"23:00",venue:"Ciudad de México"},
  {id:"A4",group:"A",home:"Corea del Sur",away:"Sudáfrica",date:"2026-06-15",time:"20:00",venue:"Zapopan"},
  {id:"A5",group:"A",home:"Mexico",away:"Corea del Sur",date:"2026-06-19",time:"23:00",venue:"Ciudad de México"},
  {id:"A6",group:"A",home:"Sudáfrica",away:"Chequia",date:"2026-06-19",time:"23:00",venue:"Zapopan"},
  {id:"B1",group:"B",home:"Canadá",away:"Bosnia-Herz.",date:"2026-06-12",time:"16:00",venue:"Toronto"},
  {id:"B2",group:"B",home:"Qatar",away:"Suiza",date:"2026-06-13",time:"16:00",venue:"Santa Clara"},
  {id:"B3",group:"B",home:"Canadá",away:"Suiza",date:"2026-06-17",time:"16:00",venue:"Toronto"},
  {id:"B4",group:"B",home:"Qatar",away:"Bosnia-Herz.",date:"2026-06-17",time:"20:00",venue:"Santa Clara"},
  {id:"B5",group:"B",home:"Canadá",away:"Qatar",date:"2026-06-21",time:"20:00",venue:"Toronto"},
  {id:"B6",group:"B",home:"Bosnia-Herz.",away:"Suiza",date:"2026-06-21",time:"20:00",venue:"Kansas City"},
  {id:"C1",group:"C",home:"Brasil",away:"Marruecos",date:"2026-06-13",time:"19:00",venue:"East Rutherford"},
  {id:"C2",group:"C",home:"Haití",away:"Escocia",date:"2026-06-13",time:"22:00",venue:"Foxborough"},
  {id:"C3",group:"C",home:"Brasil",away:"Escocia",date:"2026-06-17",time:"22:00",venue:"East Rutherford"},
  {id:"C4",group:"C",home:"Marruecos",away:"Haití",date:"2026-06-17",time:"19:00",venue:"Foxborough"},
  {id:"C5",group:"C",home:"Brasil",away:"Haití",date:"2026-06-21",time:"16:00",venue:"East Rutherford"},
  {id:"C6",group:"C",home:"Escocia",away:"Marruecos",date:"2026-06-21",time:"16:00",venue:"Foxborough"},
  {id:"D1",group:"D",home:"USA",away:"Paraguay",date:"2026-06-12",time:"22:00",venue:"Los Ángeles"},
  {id:"D2",group:"D",home:"Australia",away:"Türkiye",date:"2026-06-13",time:"13:00",venue:"Philadelphia"},
  {id:"D3",group:"D",home:"USA",away:"Türkiye",date:"2026-06-17",time:"13:00",venue:"Los Ángeles"},
  {id:"D4",group:"D",home:"Paraguay",away:"Australia",date:"2026-06-17",time:"22:00",venue:"Philadelphia"},
  {id:"D5",group:"D",home:"USA",away:"Australia",date:"2026-06-22",time:"20:00",venue:"Los Ángeles"},
  {id:"D6",group:"D",home:"Türkiye",away:"Paraguay",date:"2026-06-22",time:"20:00",venue:"Philadelphia"},
  {id:"E1",group:"E",home:"Alemania",away:"Costa Marfil",date:"2026-06-14",time:"16:00",venue:"Atlanta"},
  {id:"E2",group:"E",home:"Curazao",away:"Ecuador",date:"2026-06-14",time:"22:00",venue:"Seattle"},
  {id:"E3",group:"E",home:"Alemania",away:"Ecuador",date:"2026-06-18",time:"16:00",venue:"Atlanta"},
  {id:"E4",group:"E",home:"Costa Marfil",away:"Curazao",date:"2026-06-18",time:"22:00",venue:"Seattle"},
  {id:"E5",group:"E",home:"Alemania",away:"Curazao",date:"2026-06-22",time:"16:00",venue:"Atlanta"},
  {id:"E6",group:"E",home:"Ecuador",away:"Costa Marfil",date:"2026-06-22",time:"16:00",venue:"Seattle"},
  {id:"F1",group:"F",home:"Países Bajos",away:"Túnez",date:"2026-06-14",time:"13:00",venue:"Miami"},
  {id:"F2",group:"F",home:"Japón",away:"Suecia",date:"2026-06-14",time:"19:00",venue:"Dallas"},
  {id:"F3",group:"F",home:"Países Bajos",away:"Suecia",date:"2026-06-18",time:"13:00",venue:"Miami"},
  {id:"F4",group:"F",home:"Túnez",away:"Japón",date:"2026-06-18",time:"19:00",venue:"Dallas"},
  {id:"F5",group:"F",home:"Países Bajos",away:"Japón",date:"2026-06-22",time:"22:00",venue:"Miami"},
  {id:"F6",group:"F",home:"Suecia",away:"Túnez",date:"2026-06-22",time:"22:00",venue:"Dallas"},
  {id:"G1",group:"G",home:"Bélgica",away:"Irán",date:"2026-06-15",time:"13:00",venue:"Dallas"},
  {id:"G2",group:"G",home:"Egipto",away:"Nueva Zelanda",date:"2026-06-15",time:"16:00",venue:"Seattle"},
  {id:"G3",group:"G",home:"Bélgica",away:"Nueva Zelanda",date:"2026-06-19",time:"13:00",venue:"Dallas"},
  {id:"G4",group:"G",home:"Irán",away:"Egipto",date:"2026-06-19",time:"16:00",venue:"Seattle"},
  {id:"G5",group:"G",home:"Bélgica",away:"Egipto",date:"2026-06-23",time:"20:00",venue:"Dallas"},
  {id:"G6",group:"G",home:"Nueva Zelanda",away:"Irán",date:"2026-06-23",time:"20:00",venue:"Seattle"},
  {id:"H1",group:"H",home:"España",away:"Arabia Saudita",date:"2026-06-15",time:"19:00",venue:"Kansas City"},
  {id:"H2",group:"H",home:"Uruguay",away:"Cabo Verde",date:"2026-06-15",time:"22:00",venue:"Miami"},
  {id:"H3",group:"H",home:"España",away:"Cabo Verde",date:"2026-06-19",time:"19:00",venue:"Kansas City"},
  {id:"H4",group:"H",home:"Arabia Saudita",away:"Uruguay",date:"2026-06-19",time:"22:00",venue:"Miami"},
  {id:"H5",group:"H",home:"España",away:"Uruguay",date:"2026-06-23",time:"16:00",venue:"Kansas City"},
  {id:"H6",group:"H",home:"Cabo Verde",away:"Arabia Saudita",date:"2026-06-23",time:"16:00",venue:"Miami"},
  {id:"I1",group:"I",home:"Francia",away:"Senegal",date:"2026-06-16",time:"13:00",venue:"Atlanta"},
  {id:"I2",group:"I",home:"Noruega",away:"Irak",date:"2026-06-16",time:"16:00",venue:"Los Ángeles"},
  {id:"I3",group:"I",home:"Francia",away:"Irak",date:"2026-06-20",time:"13:00",venue:"Atlanta"},
  {id:"I4",group:"I",home:"Senegal",away:"Noruega",date:"2026-06-20",time:"16:00",venue:"Los Ángeles"},
  {id:"I5",group:"I",home:"Francia",away:"Noruega",date:"2026-06-24",time:"20:00",venue:"Atlanta"},
  {id:"I6",group:"I",home:"Irak",away:"Senegal",date:"2026-06-24",time:"20:00",venue:"Los Ángeles"},
  {id:"J1",group:"J",home:"Argentina",away:"Argelia",date:"2026-06-16",time:"19:00",venue:"Miami"},
  {id:"J2",group:"J",home:"Austria",away:"Jordania",date:"2026-06-16",time:"22:00",venue:"East Rutherford"},
  {id:"J3",group:"J",home:"Argentina",away:"Jordania",date:"2026-06-20",time:"19:00",venue:"Miami"},
  {id:"J4",group:"J",home:"Argelia",away:"Austria",date:"2026-06-20",time:"22:00",venue:"East Rutherford"},
  {id:"J5",group:"J",home:"Argentina",away:"Austria",date:"2026-06-24",time:"16:00",venue:"Miami"},
  {id:"J6",group:"J",home:"Jordania",away:"Argelia",date:"2026-06-24",time:"16:00",venue:"East Rutherford"},
  {id:"K1",group:"K",home:"Portugal",away:"Uzbekistán",date:"2026-06-17",time:"13:00",venue:"Kansas City"},
  {id:"K2",group:"K",home:"Colombia",away:"DR Congo",date:"2026-06-17",time:"16:00",venue:"Santa Clara"},
  {id:"K3",group:"K",home:"Portugal",away:"DR Congo",date:"2026-06-21",time:"13:00",venue:"Kansas City"},
  {id:"K4",group:"K",home:"Uzbekistán",away:"Colombia",date:"2026-06-21",time:"16:00",venue:"Santa Clara"},
  {id:"K5",group:"K",home:"Portugal",away:"Colombia",date:"2026-06-25",time:"20:00",venue:"Kansas City"},
  {id:"K6",group:"K",home:"DR Congo",away:"Uzbekistán",date:"2026-06-25",time:"20:00",venue:"Santa Clara"},
  {id:"L1",group:"L",home:"Inglaterra",away:"Panamá",date:"2026-06-18",time:"13:00",venue:"Foxborough"},
  {id:"L2",group:"L",home:"Croacia",away:"Ghana",date:"2026-06-18",time:"16:00",venue:"Vancouver"},
  {id:"L3",group:"L",home:"Inglaterra",away:"Ghana",date:"2026-06-22",time:"13:00",venue:"Foxborough"},
  {id:"L4",group:"L",home:"Panamá",away:"Croacia",date:"2026-06-22",time:"16:00",venue:"Vancouver"},
  {id:"L5",group:"L",home:"Inglaterra",away:"Croacia",date:"2026-06-26",time:"20:00",venue:"Foxborough"},
  {id:"L6",group:"L",home:"Ghana",away:"Panamá",date:"2026-06-26",time:"20:00",venue:"Vancouver"},
];

const KO_SLOTS = [
  {id:"r32_0",phase:"r32",label:"1A vs 2B",date:"2026-06-28",time:"16:00",venue:"Los Angeles"},
  {id:"r32_1",phase:"r32",label:"1B vs 2A",date:"2026-06-28",time:"22:00",venue:"Los Angeles"},
  {id:"r32_2",phase:"r32",label:"1C vs 2F",date:"2026-06-29",time:"14:00",venue:"Houston"},
  {id:"r32_3",phase:"r32",label:"1F vs 2C",date:"2026-06-29",time:"22:00",venue:"Guadalajara"},
  {id:"r32_4",phase:"r32",label:"1E vs 2I",date:"2026-06-29",time:"17:30",venue:"Foxborough"},
  {id:"r32_5",phase:"r32",label:"1I vs 2E",date:"2026-06-30",time:"18:00",venue:"East Rutherford"},
  {id:"r32_6",phase:"r32",label:"1D vs 2G",date:"2026-07-01",time:"18:00",venue:"Santa Clara"},
  {id:"r32_7",phase:"r32",label:"1G vs 2D",date:"2026-07-01",time:"17:00",venue:"Seattle"},
  {id:"r32_8",phase:"r32",label:"1J vs 2K",date:"2026-07-02",time:"19:00",venue:"Miami"},
  {id:"r32_9",phase:"r32",label:"1K vs 2J",date:"2026-07-02",time:"22:30",venue:"Kansas City"},
  {id:"r32_10",phase:"r32",label:"1H vs 2L",date:"2026-07-03",time:"16:00",venue:"Dallas"},
  {id:"r32_11",phase:"r32",label:"1L vs 2H",date:"2026-07-03",time:"19:00",venue:"Philadelphia"},
  {id:"r16_0",phase:"r16",label:"Octavos 1",date:"2026-07-05",time:"16:00",venue:"Por definir"},
  {id:"r16_1",phase:"r16",label:"Octavos 2",date:"2026-07-05",time:"20:00",venue:"Por definir"},
  {id:"r16_2",phase:"r16",label:"Octavos 3",date:"2026-07-06",time:"16:00",venue:"Por definir"},
  {id:"r16_3",phase:"r16",label:"Octavos 4",date:"2026-07-06",time:"20:00",venue:"Por definir"},
  {id:"r16_4",phase:"r16",label:"Octavos 5",date:"2026-07-07",time:"16:00",venue:"Por definir"},
  {id:"r16_5",phase:"r16",label:"Octavos 6",date:"2026-07-07",time:"20:00",venue:"Por definir"},
  {id:"r16_6",phase:"r16",label:"Octavos 7",date:"2026-07-08",time:"16:00",venue:"Por definir"},
  {id:"r16_7",phase:"r16",label:"Octavos 8",date:"2026-07-08",time:"20:00",venue:"Por definir"},
  {id:"qf_0",phase:"qf",label:"Cuartos 1",date:"2026-07-11",time:"16:00",venue:"Por definir"},
  {id:"qf_1",phase:"qf",label:"Cuartos 2",date:"2026-07-11",time:"20:00",venue:"Por definir"},
  {id:"qf_2",phase:"qf",label:"Cuartos 3",date:"2026-07-12",time:"16:00",venue:"Por definir"},
  {id:"qf_3",phase:"qf",label:"Cuartos 4",date:"2026-07-12",time:"20:00",venue:"Por definir"},
  {id:"sf_0",phase:"sf",label:"Semifinal 1",date:"2026-07-14",time:"20:00",venue:"Por definir"},
  {id:"sf_1",phase:"sf",label:"Semifinal 2",date:"2026-07-15",time:"20:00",venue:"Por definir"},
  {id:"3rd_0",phase:"3rd",label:"3 y 4 puesto",date:"2026-07-18",time:"16:00",venue:"Por definir"},
  {id:"f_0",phase:"f",label:"Final",date:"2026-07-19",time:"16:00",venue:"East Rutherford"},
];

const KO_PTS = {
  r32:{team:5,goal:5,pen:7},r16:{team:5,goal:5,pen:7},
  qf:{team:10,goal:5,pen:7},sf:{team:15,goal:5,pen:7},
  f:{team:20,goal:7,pen:10},"3rd":{team:20,goal:7,pen:10},
};

function scoreGroup(pred, off) {
  if (!off||off.home==null||off.home===""||off.away==null||off.away==="") return null;
  const oh=+off.home,oa=+off.away,ph=+(pred&&pred.home!=null?pred.home:-1),pa=+(pred&&pred.away!=null?pred.away:-1);
  if (isNaN(oh)||isNaN(oa)||ph<0||pa<0) return null;
  const oR=oh>oa?"H":oh<oa?"A":"D",pR=ph>pa?"H":ph<pa?"A":"D";
  let p=0;
  if (oR===pR) p+=4;
  if (ph===oh) p+=2;
  if (pa===oa) p+=2;
  if (ph===oh&&pa===oa) p+=2;
  return p;
}

function scoreKO(pred, off, phase) {
  if (!off||!off.home_team||!off.away_team) return null;
  let p=0;
  const pts=KO_PTS[phase];
  if (!pts) return null;
  const offTeams=[off.home_team,off.away_team].filter(Boolean);
  const predTeams=[pred&&pred.home_team,pred&&pred.away_team].filter(Boolean);
  if (phase==="r32") {
    predTeams.forEach(function(t,i){
      if (!t) return;
      if (offTeams[i]===t) p+=5;
      else if (offTeams.indexOf(t)>=0) p+=2;
    });
  } else {
    predTeams.forEach(function(t){
      if(t&&offTeams.indexOf(t)>=0) p+=pts.team;
    });
  }
  const oh=+(off.home!=null?off.home:-1),oa=+(off.away!=null?off.away:-1);
  const ph=+(pred&&pred.home!=null?pred.home:-1),pa=+(pred&&pred.away!=null?pred.away:-1);
  if (oh>=0&&ph>=0&&ph===oh) p+=pts.goal;
  if (oa>=0&&pa>=0&&pa===oa) p+=pts.goal;
  const predDraw=ph>=0&&pa>=0&&ph===pa;
  const offHasPen=off.pen_home!=null&&off.pen_home!==""&&off.pen_away!=null&&off.pen_away!=="";
  if (predDraw&&offHasPen) {
    const oph=+off.pen_home,opa=+off.pen_away;
    const pph=+(pred&&pred.pen_home!=null?pred.pen_home:-1),ppa=+(pred&&pred.pen_away!=null?pred.pen_away:-1);
    if (pph===oph) p+=pts.pen;
    if (ppa===opa) p+=pts.pen;
  }
  return p;
}

function scorePred(pred, off, matchId) {
  var slot=null;
  for (var i=0;i<KO_SLOTS.length;i++){if(KO_SLOTS[i].id===matchId){slot=KO_SLOTS[i];break;}}
  if (slot) return scoreKO(pred,off,slot.phase)||0;
  return scoreGroup(pred,off)||0;
}

function scoreExtras(extras, official) {
  var p=0;
  if (!official) return p;
  if (extras&&extras.champion&&official.champion&&extras.champion===official.champion) p+=50;
  if (extras&&extras.runner_up&&official.runner_up&&extras.runner_up===official.runner_up) p+=30;
  if (extras&&extras.third&&official.third&&extras.third===official.third) p+=20;
  if (extras&&extras.fourth&&official.fourth&&extras.fourth===official.fourth) p+=20;
  return p;
}

function fmtDate(d) {
  if (!d) return "";
  var parts=d.split("-");
  var months=["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return parseInt(parts[2])+" "+months[parseInt(parts[1])];
}

function ageOk(dob) {
  var now=new Date(),birth=new Date(dob);
  var age=now.getFullYear()-birth.getFullYear();
  var m=now.getMonth()-birth.getMonth();
  return age>18||(age===18&&(m>0||(m===0&&now.getDate()>=birth.getDate())));
}

function hashColor(str) {
  var h=0;for(var i=0;i<str.length;i++)h=str.charCodeAt(i)+((h<<5)-h);
  return "hsl("+Math.abs(h)%360+",40%,30%)";
}

export default function App() {
  const [session,setSession]=useState(null);
  const [profile,setProfile]=useState(null);
  const [view,setView]=useState("splash");
  const [activeGroup,setActiveGroup]=useState(null);
  const [toast,setToast]=useState(null);
  const [loading,setLoading]=useState(true);
  const [hasNewResults,setHasNewResults]=useState(false);

  const showToast=(msg,type)=>{setToast({msg,type:type||"ok"});setTimeout(()=>setToast(null),2500);};

  useEffect(()=>{
    supabase.auth.getSession().then(function(r){
      var s=r.data.session;
      setSession(s);
      if(s) loadProfile(s.user.id);
      else{setLoading(false);setView("splash");}
    });
    var sub=supabase.auth.onAuthStateChange(function(_,s){
      setSession(s);
      if(s) loadProfile(s.user.id);
      else{setProfile(null);setView("splash");}
    });
    return function(){sub.data.subscription.unsubscribe();};
  },[]);

  useEffect(()=>{
    if (!profile) return;
    var lastSeen=localStorage.getItem("last_seen_results")||"";
    supabase.from("groups").select("updated_at").order("updated_at",{ascending:false}).limit(1).then(function(r){
      if(r.data&&r.data[0]&&r.data[0].updated_at&&r.data[0].updated_at>lastSeen) setHasNewResults(true);
    });
  },[profile]);

  function loadProfile(uid){
    setLoading(true);
    supabase.from("profiles").select("*").eq("id",uid).single().then(function(r){
      setProfile(r.data);setLoading(false);
      setView(r.data?"groups_list":"splash");
    });
  }

  function signOut(){supabase.auth.signOut();setView("splash");}
  function markResultsSeen(){localStorage.setItem("last_seen_results",new Date().toISOString());setHasNewResults(false);}

  if(loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}><div style={{fontSize:56}}>⚽</div></div>;

  var ctx={session,profile,setProfile,activeGroup,setActiveGroup,setView,toast$:showToast,signOut,hasNewResults,markResultsSeen};

  return (
    <Page>
      {view==="splash"&&<SplashView ctx={ctx}/>}
      {view==="login"&&<LoginView ctx={ctx}/>}
      {view==="register"&&<RegisterView ctx={ctx}/>}
      {view==="groups_list"&&<GroupsListView ctx={ctx}/>}
      {view==="group"&&<GroupView ctx={ctx}/>}
      {view==="predictions"&&<PredictionsView ctx={ctx}/>}
      {view==="ranking"&&<RankingView ctx={ctx}/>}
      {view==="global_ranking"&&<GlobalRankingView ctx={ctx}/>}
      {view==="official"&&<OfficialResultsView ctx={ctx}/>}
      {view==="reglamento"&&<ReglamentoView ctx={ctx}/>}
      {view==="contacto"&&<ContactoView ctx={ctx}/>}
      {view==="admin"&&<AdminView ctx={ctx}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </Page>
  );
}

function Page({children}){return <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:font,maxWidth:480,margin:"0 auto",position:"relative"}}>{children}</div>;}

function Bar({title,onBack}){
  return <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:b(C.border),background:C.bg,position:"sticky",top:0,zIndex:10}}>
    {onBack&&<button onClick={onBack} style={{background:"none",border:"none",color:C.sub2,fontSize:22,cursor:"pointer",padding:"0 4px",lineHeight:1}}>&#8592;</button>}
    <span style={{fontSize:15,fontWeight:700,color:C.text,flex:1}}>{title}</span>
  </div>;
}

function Tabs({items,active,onSelect,small}){
  return <div style={{display:"flex",overflowX:"auto",borderBottom:b(C.border),scrollbarWidth:"none",background:C.bg}}>
    {items.map(function(it){
      return <button key={it.id} onClick={function(){onSelect(it.id);}} style={{background:"none",border:"none",borderBottom:active===it.id?b2(C.accentS):b2("transparent"),cursor:"pointer",whiteSpace:"nowrap",fontFamily:font,padding:small?"8px 12px":"10px 16px",fontSize:small?12:13,fontWeight:600,color:active===it.id?C.accentS:C.sub}}>{it.label}</button>;
    })}
  </div>;
}

function Field({label,value,onChange,type}){
  return <div>
    <div style={{fontSize:11,color:C.sub,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>{label}</div>
    <input type={type||"text"} style={inp} value={value} onChange={function(e){onChange(e.target.value);}}/>
  </div>;
}

function GradBtn({onClick,children,disabled}){
  return <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"15px",borderRadius:12,border:"none",cursor:disabled?"not-allowed":"pointer",fontSize:15,fontWeight:700,letterSpacing:0.3,fontFamily:font,background:disabled?"#1a2a3a":C.accent,color:disabled?C.sub:"#040a10",boxShadow:disabled?"none":"0 0 20px rgba(0,200,224,0.25)"}}>{children}</button>;
}

function Btn2({onClick,children}){
  return <button onClick={onClick} style={{width:"100%",padding:"13px",borderRadius:12,border:b(C.border),cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:font,background:C.surface,color:C.text}}>{children}</button>;
}

function IconBtn({onClick,children,title}){
  return <button onClick={onClick} title={title} style={{background:C.surface,border:b(C.border),borderRadius:10,width:38,height:38,cursor:"pointer",color:C.sub2,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</button>;
}

function SectionLabel({children}){return <div style={{fontSize:10,color:C.sub,letterSpacing:1,textTransform:"uppercase",marginBottom:10,marginTop:4}}>{children}</div>;}

function Ava({name,size}){
  var sz=size||34;
  var h=hashColor(name);
  var initials=name.split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();
  return <div style={{width:sz,height:sz,borderRadius:"50%",background:h,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*0.35,fontWeight:700,color:"rgba(255,255,255,0.8)"}}>{initials}</div>;
}

function Modal({title,onClose,children}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
    <div style={{background:C.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,padding:"24px 20px 32px",border:b(C.border),borderBottom:"none"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
        <span style={{fontSize:16,fontWeight:700,color:C.text,flex:1}}>{title}</span>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.sub,fontSize:22,cursor:"pointer"}}>&#x2715;</button>
      </div>
      {children}
    </div>
  </div>;
}

function Toast({msg,type}){
  var bg=type==="err"?"rgba(224,92,106,0.15)":"rgba(0,200,224,0.12)";
  var col=type==="err"?C.red:C.accentS;
  return <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:bg,border:b(col),color:col,padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:600,letterSpacing:0.3,zIndex:100,whiteSpace:"nowrap",boxShadow:"0 4px 24px rgba(0,0,0,0.5)",fontFamily:font}}>{msg}</div>;
}

function ScoreBox({value,onChange,state,readOnly}){
  var col=state==="ok"?C.green:state==="err"?C.red:C.border2;
  var color=state==="ok"?C.green:state==="err"?C.red:C.text;
  return <input type="number" min="0" max="20" value={value} readOnly={readOnly} onChange={function(e){if(!readOnly&&onChange)onChange(e.target.value);}} style={{width:42,height:42,textAlign:"center",background:C.surface2,border:"1.5px solid "+col,borderRadius:8,color:color,fontSize:18,fontWeight:700,fontFamily:mono,outline:"none",opacity:readOnly?0.7:1}}/>;
}

function PtsBadge({pts}){
  var bg=pts>0?"rgba(76,223,154,0.12)":"rgba(255,255,255,0.04)";
  var col=pts>0?C.green:C.sub;
  var bdr=pts>0?"1px solid rgba(76,223,154,0.3)":b(C.border);
  return <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:bg,color:col,border:bdr}}>{pts} pts</span>;
}

var inp={width:"100%",background:C.surface2,border:b(C.border),borderRadius:10,color:C.text,padding:"11px 13px",fontSize:14,boxSizing:"border-box",fontFamily:font,outline:"none"};
var card={background:C.surface,borderRadius:14,padding:"14px",border:b(C.border)};
var pill={fontSize:12,color:C.sub2,background:C.surface2,padding:"4px 11px",borderRadius:20,border:b(C.border)};
var rankRow={display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12};
var gradText={background:C.accent,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"};
var gradBtnS={background:C.accent,border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,color:"#040a10",fontFamily:font};

function SplashView({ctx}){
  var setView=ctx.setView;
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:C.bg}}>
    <style>{"@keyframes ballFloat{0%,100%{transform:translateY(0px) rotate(0deg);}50%{transform:translateY(-12px) rotate(8deg);}}@keyframes ballGlow{0%,100%{filter:drop-shadow(0 0 20px #2280ff88);}50%{filter:drop-shadow(0 0 28px #00e5cc88);}}"}</style>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 24px 32px"}}>
      <div style={{fontSize:90,marginBottom:20,lineHeight:1,animation:"ballFloat 2.5s ease-in-out infinite, ballGlow 2.4s ease-in-out infinite"}}>&#x26BD;</div>
      <div style={{fontSize:10,letterSpacing:4,color:C.sub2,marginBottom:6,textTransform:"uppercase"}}>Baprode</div>
      <h1 style={Object.assign({},gradText,{fontSize:36,fontWeight:800,textAlign:"center",lineHeight:1.1,margin:0})}>Mundial<br/>2026</h1>
      <p style={{color:C.sub,fontSize:13,marginTop:10,letterSpacing:0.5}}>USA &middot; Mexico &middot; Canada</p>
    </div>
    <div style={{padding:"0 20px 48px",display:"flex",flexDirection:"column",gap:10}}>
      <GradBtn onClick={function(){setView("login");}}>Iniciar sesion</GradBtn>
      <Btn2 onClick={function(){setView("register");}}>Crear cuenta</Btn2>
      <button onClick={function(){setView("contacto");}} style={{background:"none",border:"none",color:C.sub,fontSize:12,cursor:"pointer",fontFamily:font,padding:"4px 0",textAlign:"center"}}>Problemas para ingresar? Contactar administrador</button>
    </div>
  </div>;
}

function LoginView({ctx}){
  var setView=ctx.setView,toast$=ctx.toast$;
  const [identifier,setIdentifier]=useState("");
  const [pw,setPw]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [loading,setLoading]=useState(false);

  function login(){
    if(!identifier||!pw) return toast$("Completa todos los campos","err");
    setLoading(true);
    var emailToUse=identifier;
    if(identifier.indexOf("@")<0){
      supabase.from("profiles").select("email").ilike("nick",identifier).maybeSingle().then(function(r){
        if(!r.data){toast$("Usuario no encontrado","err");setLoading(false);return;}
        supabase.auth.signInWithPassword({email:r.data.email,password:pw}).then(function(r2){
          if(r2.error){toast$("Contrasena incorrecta","err");setLoading(false);}
        });
      });
    } else {
      supabase.auth.signInWithPassword({email:emailToUse,password:pw}).then(function(r){
        if(r.error){toast$("Email o contrasena incorrectos","err");setLoading(false);}
      });
    }
  }

  function forgotPw(){
    if(!identifier) return toast$("Ingresa tu email primero","err");
    if(identifier.indexOf("@")<0) return toast$("Usa tu email para recuperar contrasena","err");
    supabase.auth.resetPasswordForEmail(identifier,{redirectTo:"https://baprode-mundial.vercel.app"});
    toast$("Email de recuperacion enviado");
  }

  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <Bar title="Iniciar sesion" onBack={function(){setView("splash");}}/>
    <div style={{padding:"24px 20px",display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <div style={{fontSize:11,color:C.sub,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>Email o Nick</div>
        <input style={inp} placeholder="email o nick" value={identifier} onChange={function(e){setIdentifier(e.target.value);}}/>
      </div>
      <div>
        <div style={{fontSize:11,color:C.sub,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>Contrasena</div>
        <div style={{position:"relative"}}>
          <input type={showPw?"text":"password"} style={Object.assign({},inp,{paddingRight:44})} placeholder="..." value={pw} onChange={function(e){setPw(e.target.value);}}/>
          <button onClick={function(){setShowPw(function(p){return !p;});}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.sub2,fontSize:16,padding:0}}>{showPw?"O":"O"}</button>
        </div>
      </div>
      <GradBtn onClick={login} disabled={loading}>{loading?"Ingresando...":"Entrar"}</GradBtn>
      <button onClick={forgotPw} style={{background:"none",border:"none",color:C.sub2,fontSize:13,cursor:"pointer",padding:"4px 0",fontFamily:font}}>Olvide mi contrasena</button>
      <div style={{textAlign:"center",marginTop:8}}>
        <span style={{color:C.sub,fontSize:13}}>No tenes cuenta? </span>
        <button onClick={function(){setView("register");}} style={{background:"none",border:"none",color:C.accentS,fontSize:13,cursor:"pointer",fontFamily:font,fontWeight:600}}>Registrate</button>
      </div>
      <button onClick={function(){setView("contacto");}} style={{background:"none",border:"none",color:C.sub,fontSize:12,cursor:"pointer",fontFamily:font,padding:"4px 0",textAlign:"center"}}>Problemas? Contactar administrador</button>
    </div>
  </div>;
}

const DAYS=Array.from({length:31},function(_,i){return String(i+1).padStart(2,"0");});
const MONTHS_WHEEL=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const YEARS=Array.from({length:90},function(_,i){return String(2006-i);});

function WheelPicker({items,value,onChange,width}){
  var w=width||70;
  var idx=items.indexOf(value);
  return <div style={{width:w,height:120,overflow:"hidden",position:"relative",cursor:"ns-resize"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:40,background:"linear-gradient(to bottom,"+C.surface2+",transparent)",zIndex:2,pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:40,background:"linear-gradient(to top,"+C.surface2+",transparent)",zIndex:2,pointerEvents:"none"}}/>
    <div style={{position:"absolute",top:"50%",left:0,right:0,height:36,marginTop:-18,border:b(C.accentS),borderRadius:8,background:"rgba(0,200,224,0.08)",zIndex:1,pointerEvents:"none"}}/>
    <div style={{overflowY:"scroll",height:"100%",scrollSnapType:"y mandatory",scrollbarWidth:"none",paddingTop:42,paddingBottom:42}} onScroll={function(e){var el=e.target;var i=Math.round(el.scrollTop/36);if(items[i]&&items[i]!==value)onChange(items[i]);}}>
      {items.map(function(item,i){return <div key={item} style={{height:36,display:"flex",alignItems:"center",justifyContent:"center",scrollSnapAlign:"start",fontSize:15,fontWeight:i===idx?700:400,color:i===idx?C.accentS:C.sub,fontFamily:mono,transition:"all 0.1s"}}>{item}</div>;})}
    </div>
  </div>;
}

function DOBPicker({value,onChange}){
  const [open,setOpen]=useState(false);
  const [temp,setTemp]=useState(value||"2000-01-01");
  var parts=temp.split("-");
  var year=parts[0],month=parts[1],day=parts[2];
  var monthIdx=parseInt(month)-1;
  function update(y,m,d){var mm=String(MONTHS_WHEEL.indexOf(m)+1).padStart(2,"0");setTemp(y+"-"+mm+"-"+d);}
  function confirm(){onChange(temp);setOpen(false);}
  function displayDate(v){if(!v)return"";var p=v.split("-");return p[2]+" "+MONTHS_WHEEL[parseInt(p[1])-1]+" "+p[0];}
  return <div>
    <div style={{fontSize:11,color:C.sub,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>Fecha de nacimiento *</div>
    <button onClick={function(){setOpen(true);}} style={Object.assign({},inp,{textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"})}>
      <span style={{color:value&&value!=="2000-01-01"?C.text:C.sub}}>{value&&value!=="2000-01-01"?displayDate(value):"Seleccionar fecha"}</span>
      <span style={{color:C.sub2,fontSize:16}}>&#128197;</span>
    </button>
    {open&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,padding:"20px 20px 32px",border:b(C.border),borderBottom:"none"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:16}}>
          <span style={{flex:1,fontSize:15,fontWeight:700,color:C.text}}>Fecha de nacimiento</span>
          <button onClick={function(){setOpen(false);}} style={{background:"none",border:"none",color:C.sub,fontSize:22,cursor:"pointer"}}>&#x2715;</button>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:9,color:C.sub,marginBottom:4}}>DIA</div><WheelPicker items={DAYS} value={day} onChange={function(d){update(year,MONTHS_WHEEL[monthIdx],d);}} width={60}/></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:9,color:C.sub,marginBottom:4}}>MES</div><WheelPicker items={MONTHS_WHEEL} value={MONTHS_WHEEL[monthIdx]} onChange={function(m){update(year,m,day);}} width={72}/></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:9,color:C.sub,marginBottom:4}}>ANO</div><WheelPicker items={YEARS} value={year} onChange={function(y){update(y,MONTHS_WHEEL[monthIdx],day);}} width={72}/></div>
        </div>
        <GradBtn onClick={confirm}>Confirmar</GradBtn>
      </div>
    </div>}
  </div>;
}

function RegisterView({ctx}){
  var setView=ctx.setView,toast$=ctx.toast$;
  const [f,setF]=useState({nombre:"",dni:"",dob:"2000-01-01",email:"",nick:"",pw:"",cel:""});
  const [loading,setLoading]=useState(false);
  function upd(k){return function(v){setF(function(p){var n=Object.assign({},p);n[k]=v;return n;});};}

  function register(){
    if(!f.nombre||!f.dni||!f.dob||!f.email||!f.nick||!f.pw) return toast$("Completa los campos obligatorios","err");
    if(!ageOk(f.dob)) return toast$("Debes ser mayor de 18 anos","err");
    setLoading(true);
    supabase.auth.signUp({email:f.email,password:f.pw,options:{data:{nombre:f.nombre,dni:f.dni,dob:f.dob,nick:f.nick,cel:f.cel}}}).then(function(r){
      if(r.error){toast$(r.error.message,"err");setLoading(false);return;}
      supabase.from("profiles").insert({id:r.data.user.id,nombre:f.nombre,dni:f.dni,dob:f.dob,email:f.email,nick:f.nick,cel:f.cel,is_admin:false});
      toast$("Cuenta creada! Ya podes ingresar");
      setLoading(false);setView("login");
    });
  }

  return <div style={{minHeight:"100vh"}}>
    <Bar title="Crear cuenta" onBack={function(){setView("splash");}}/>
    <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14,paddingBottom:40}}>
      <SectionLabel>Datos personales</SectionLabel>
      <Field label="Nombre completo *" value={f.nombre} onChange={upd("nombre")}/>
      <Field label="DNI *" value={f.dni} onChange={upd("dni")} type="number"/>
      <DOBPicker value={f.dob} onChange={upd("dob")}/>
      <SectionLabel>Cuenta</SectionLabel>
      <Field label="Email *" value={f.email} onChange={upd("email")} type="email"/>
      <Field label="Nick *" value={f.nick} onChange={upd("nick")}/>
      <Field label="Contrasena *" value={f.pw} onChange={upd("pw")} type="password"/>
      <div style={{marginTop:4}}><GradBtn onClick={register} disabled={loading}>{loading?"Creando...":"Crear cuenta"}</GradBtn></div>
      <p style={{fontSize:11,color:C.sub,textAlign:"center",lineHeight:1.6,margin:0}}>Debes ser mayor de 18 anos para registrarte</p>
    </div>
  </div>;
}

function ContactoView({ctx}){
  var setView=ctx.setView,toast$=ctx.toast$;
  const [f,setF]=useState({nombre:"",nick:"",motivo:""});
  const [loading,setLoading]=useState(false);
  function upd(k){return function(v){setF(function(p){var n=Object.assign({},p);n[k]=v;return n;});};}

  function enviar(){
    if(!f.nombre||!f.motivo) return toast$("Completa nombre y motivo","err");
    setLoading(true);
    supabase.from("contact_requests").insert({nombre:f.nombre,nick:f.nick,motivo:f.motivo,created_at:new Date().toISOString()}).then(function(){
      toast$("Solicitud enviada. El administrador te contactara pronto");
      setLoading(false);
      setTimeout(function(){setView("splash");},2000);
    });
  }

  return <div style={{minHeight:"100vh"}}>
    <Bar title="Contactar Administrador" onBack={function(){setView("splash");}}/>
    <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
      <div style={Object.assign({},card,{padding:"12px 14px",background:"rgba(0,200,224,0.05)",border:b(C.accentS)})}>
        <p style={{color:C.sub,fontSize:13,margin:0,lineHeight:1.6}}>Si tenes problemas para acceder, completa el formulario.</p>
      </div>
      <Field label="Nombre completo *" value={f.nombre} onChange={upd("nombre")}/>
      <Field label="Nick o email de la cuenta" value={f.nick} onChange={upd("nick")}/>
      <div>
        <div style={{fontSize:11,color:C.sub,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>Motivo *</div>
        <textarea style={Object.assign({},inp,{height:100,resize:"none"})} placeholder="Describe tu problema..." value={f.motivo} onChange={function(e){upd("motivo")(e.target.value);}}/>
      </div>
      <GradBtn onClick={enviar} disabled={loading}>{loading?"Enviando...":"Enviar solicitud"}</GradBtn>
    </div>
  </div>;
}

function ReglamentoView({ctx}){
  var setView=ctx.setView,activeGroup=ctx.activeGroup;
  function back(){if(activeGroup) setView("group"); else setView("groups_list");}
  var section=function(color,title,children){
    return <div style={Object.assign({},card,{borderLeft:b3(color),marginBottom:12})}>
      <div style={{fontSize:12,color:color,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{title}</div>
      <div style={{fontSize:13,color:C.text,lineHeight:1.8}}>{children}</div>
    </div>;
  };
  return <div style={{minHeight:"100vh"}}>
    <Bar title="Reglamento" onBack={back}/>
    <div style={{padding:"16px 16px 40px",display:"flex",flexDirection:"column",gap:4}}>
      {section(C.accentS,"Fase de Grupos",<span><b style={{color:C.gold}}>4 pts</b> resultado (L/E/V)<br/><b style={{color:C.gold}}>2 pts</b> goles equipo local exactos<br/><b style={{color:C.gold}}>2 pts</b> goles equipo visitante exactos<br/><b style={{color:C.gold}}>2 pts</b> extra si marcador exacto<br/><span style={{color:C.sub,fontSize:11}}>Max 10 pts por partido</span></span>)}
      {section(C.gold,"32avos y Octavos",<span><b style={{color:C.gold}}>5 pts</b> pais en posicion exacta<br/><b style={{color:C.gold}}>2 pts</b> pais clasifico pero en otra posicion<br/><b style={{color:C.gold}}>5 pts</b> goles por equipo<br/><b style={{color:C.gold}}>7 pts</b> penales por equipo (si predijiste empate)</span>)}
      {section(C.gold,"Cuartos",<span><b style={{color:C.gold}}>10 pts</b> pais en esa instancia<br/><b style={{color:C.gold}}>5 pts</b> goles por equipo<br/><b style={{color:C.gold}}>7 pts</b> penales por equipo</span>)}
      {section(C.gold,"Semifinales",<span><b style={{color:C.gold}}>15 pts</b> pais en esa instancia<br/><b style={{color:C.gold}}>5 pts</b> goles por equipo<br/><b style={{color:C.gold}}>7 pts</b> penales por equipo</span>)}
      {section(C.gold,"Final y 3/4 puesto",<span><b style={{color:C.gold}}>20 pts</b> pais en esa instancia<br/><b style={{color:C.gold}}>7 pts</b> goles por equipo<br/><b style={{color:C.gold}}>10 pts</b> penales por equipo</span>)}
      {section(C.green,"Puntos Extras",<span><b style={{color:C.green}}>50 pts</b> Campeon<br/><b style={{color:C.green}}>30 pts</b> Subcampeon<br/><b style={{color:C.green}}>20 pts</b> 3 puesto<br/><b style={{color:C.green}}>20 pts</b> 4 puesto</span>)}
      {section(C.sub2,"Desempate",<span>1. Acerto el campeon<br/>2. Mas partidos con marcador exacto<br/>3. Total de goles mas cercano al real</span>)}
      {section(C.red,"Cierre de planillas",<span>Las predicciones se bloquean el <b>11 de junio de 2026</b>. No se aceptan modificaciones una vez iniciado el Mundial.</span>)}
    </div>
  </div>;
}

function GroupsListView({ctx}){
  var profile=ctx.profile,setView=ctx.setView,setActiveGroup=ctx.setActiveGroup,toast$=ctx.toast$,signOut=ctx.signOut,hasNewResults=ctx.hasNewResults,markResultsSeen=ctx.markResultsSeen;
  const [myGroups,setMyGroups]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showJoin,setShowJoin]=useState(false);
  const [showCreate,setShowCreate]=useState(false);

  useEffect(function(){fetchGroups();},[]);

  function fetchGroups(){
    setLoading(true);
    supabase.from("group_members").select("group_id, groups(id,name,max_members,created_by,updated_at)").eq("user_id",profile.id).then(function(r){
      setMyGroups((r.data||[]).map(function(d){return d.groups;}).filter(Boolean));
      setLoading(false);
    });
  }

  if(profile&&profile.is_admin) return <AdminView ctx={ctx}/>;

  function shareApp(){
    if(navigator.share){
      navigator.share({title:"Baprode Mundial 2026",text:"Unite al prode del Mundial 2026!",url:"https://baprode-mundial.vercel.app"});
    } else {
      navigator.clipboard.writeText("https://baprode-mundial.vercel.app");
      toast$("Link copiado!");
    }
  }

  return <div style={{minHeight:"100vh"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:b(C.border)}}>
      <div>
        <div style={{fontSize:10,color:C.sub,letterSpacing:1,textTransform:"uppercase"}}>Bienvenido</div>
        <div style={{fontSize:16,fontWeight:700,color:C.text}}>{profile&&(profile.nick||profile.nombre)}</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <IconBtn onClick={shareApp} title="Invitar amigo">&#128228;</IconBtn>
        <IconBtn onClick={function(){setShowCreate(true);}} title="Crear grupo">+</IconBtn>
        <IconBtn onClick={signOut} title="Salir">&#9211;</IconBtn>
      </div>
    </div>
    <div style={{padding:"12px 16px 0",display:"flex",gap:8}}>
      <button onClick={function(){markResultsSeen();setView("official");}} style={{flex:1,padding:"10px",borderRadius:10,border:b(C.border),background:C.surface,color:C.accentS,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,display:"flex",alignItems:"center",justifyContent:"center",gap:6,position:"relative"}}>
        Resultados
        {hasNewResults&&<span style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:C.red}}/>}
      </button>
      <button onClick={function(){setView("global_ranking");}} style={{flex:1,padding:"10px",borderRadius:10,border:b(C.border),background:C.surface,color:C.gold,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>Ranking global</button>
    </div>
    <div style={{padding:"8px 16px 0"}}>
      <button onClick={function(){setView("reglamento");}} style={{width:"100%",padding:"10px",borderRadius:10,border:b(C.border),background:C.surface,color:C.sub2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Reglamento</button>
    </div>
    {isLocked()&&<div style={{margin:"12px 16px 0",background:"rgba(224,92,106,0.08)",borderRadius:10,padding:"10px 14px",border:b(C.red),display:"flex",alignItems:"center",gap:8}}>
      <span>&#128274;</span>
      <div style={{fontSize:12,color:C.red}}>Las planillas estan cerradas. El torneo ya comenzo.</div>
    </div>}
    <div style={{padding:"16px",paddingBottom:100}}>
      <SectionLabel>Mis grupos</SectionLabel>
      {loading&&<p style={{color:C.sub,fontSize:13,textAlign:"center",marginTop:24}}>Cargando...</p>}
      {!loading&&myGroups.length===0&&<div style={{textAlign:"center",marginTop:32,color:C.sub,fontSize:13}}><div style={{fontSize:32,marginBottom:12}}>&#127959;</div><p>No estas en ningun grupo todavia</p></div>}
      {myGroups.map(function(g){
        return <div key={g.id} style={Object.assign({},card,{cursor:"pointer",marginBottom:10})} onClick={function(){setActiveGroup(g);setView("group");}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:42,height:42,borderRadius:12,background:hashColor(g.name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#fff"}}>{g.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:C.text}}>{g.name}</div>
              <div style={{fontSize:11,color:C.sub,marginTop:2}}>Ultima act: {g.updated_at?new Date(g.updated_at).toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"sin datos"}</div>
            </div>
            <span style={{color:C.sub2,fontSize:20}}>&#8250;</span>
          </div>
        </div>;
      })}
      <div style={{marginTop:16}}><Btn2 onClick={function(){setShowJoin(true);}}>Unirse a un grupo</Btn2></div>
    </div>
    {showCreate&&<CreateGroupModal profile={profile} onClose={function(){setShowCreate(false);}} onCreated={function(){fetchGroups();setShowCreate(false);}} toast$={toast$}/>}
    {showJoin&&<JoinGroupModal profile={profile} onClose={function(){setShowJoin(false);}} onJoined={function(){fetchGroups();setShowJoin(false);}} toast$={toast$}/>}
  </div>;
}

function CreateGroupModal({profile,onClose,onCreated,toast$}){
  const [name,setName]=useState("");
  const [max,setMax]=useState("10");
  const [loading,setLoading]=useState(false);
  function create(){
    if(!name) return toast$("Ingresa un nombre","err");
    setLoading(true);
    supabase.from("groups").insert({name:name,max_members:+max,created_by:profile.id}).select().single().then(function(r){
      if(r.error){toast$(r.error.message,"err");setLoading(false);return;}
      supabase.from("group_members").insert({group_id:r.data.id,user_id:profile.id,role:"admin"});
      onCreated();
    });
  }
  return <Modal title="Crear grupo" onClose={onClose}>
    <Field label="Nombre del grupo" value={name} onChange={setName}/>
    <div style={{marginTop:12}}><Field label="Maximo de participantes" value={max} onChange={setMax} type="number"/></div>
    <div style={{marginTop:16}}><GradBtn onClick={create} disabled={loading}>{loading?"Creando...":"Crear"}</GradBtn></div>
  </Modal>;
}

function JoinGroupModal({profile,onClose,onJoined,toast$}){
  const [q,setQ]=useState("");
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(false);
  function search(){
    if(!q) return;
    supabase.from("groups").select("*").ilike("name","%"+q+"%").limit(10).then(function(r){setResults(r.data||[]);});
  }
  function join(g){
    setLoading(true);
    supabase.from("group_members").select("*").eq("group_id",g.id).then(function(r){
      var members=r.data||[];
      if(members.length>=g.max_members){toast$("El grupo esta lleno","err");setLoading(false);return;}
      var already=members.find(function(m){return m.user_id===profile.id;});
      if(already){toast$("Ya sos miembro de este grupo","err");setLoading(false);return;}
      supabase.from("group_members").insert({group_id:g.id,user_id:profile.id,role:"member"}).then(function(){
        toast$("Te uniste al grupo!");onJoined();
      });
    });
  }
  return <Modal title="Unirse a grupo" onClose={onClose}>
    <div style={{display:"flex",gap:8}}>
      <input style={Object.assign({},inp,{flex:1})} placeholder="Buscar grupo..." value={q} onChange={function(e){setQ(e.target.value);}}/>
      <button onClick={search} style={Object.assign({},gradBtnS,{padding:"0 14px",fontSize:13})}>Buscar</button>
    </div>
    <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8}}>
      {results.map(function(g){
        return <div key={g.id} style={Object.assign({},card,{display:"flex",alignItems:"center",gap:10})}>
          <span style={{flex:1,fontSize:14,color:C.text}}>{g.name}</span>
          <span style={{fontSize:11,color:C.sub}}>Max {g.max_members}</span>
          <button onClick={function(){join(g);}} style={Object.assign({},gradBtnS,{padding:"6px 12px",fontSize:12})} disabled={loading}>Unirse</button>
        </div>;
      })}
    </div>
  </Modal>;
}

function GroupView({ctx}){
  var profile=ctx.profile,activeGroup=ctx.activeGroup,setView=ctx.setView,setActiveGroup=ctx.setActiveGroup,toast$=ctx.toast$;
  const [members,setMembers]=useState([]);
  const [selectedUser,setSelectedUser]=useState(null);
  const [showManage,setShowManage]=useState(false);
  const [myRole,setMyRole]=useState(null);

  useEffect(function(){fetchMembers();},[]);

  function fetchMembers(){
    supabase.from("group_members").select("user_id,role,profiles(id,nick,nombre)").eq("group_id",activeGroup.id).then(function(r){
      setMembers(r.data||[]);
      var me=(r.data||[]).find(function(m){return m.user_id===profile.id;});
      setMyRole(me&&me.role);
    });
  }

  var updatedAt=activeGroup&&activeGroup.updated_at?new Date(activeGroup.updated_at).toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"Sin datos";
  var isGroupAdmin=myRole==="admin"||(activeGroup&&activeGroup.created_by===profile.id);

  function shareGroup(){
    var url="https://baprode-mundial.vercel.app";
    var text="Unite a mi grupo \""+activeGroup.name+"\" en Baprode Mundial 2026!";
    if(navigator.share) navigator.share({title:"Baprode",text:text,url:url});
    else{navigator.clipboard.writeText(text+" "+url);toast$("Link copiado");}
  }

  return <div style={{minHeight:"100vh"}}>
    <Bar title={activeGroup&&activeGroup.name} onBack={function(){setView("groups_list");}}/>
    <div style={{margin:"12px 16px 0",background:C.surface2,borderRadius:10,padding:"10px 14px",border:b(C.border),display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:14}}>&#128336;</span>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:C.sub,letterSpacing:0.5}}>Ultima actualizacion oficial</div>
        <div style={{fontSize:13,fontWeight:600,color:C.accentS}}>{updatedAt}</div>
      </div>
    </div>
    <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
      <GradBtn onClick={function(){setView("predictions");}}>{isLocked()?"Ver mis predicciones":"Mis predicciones"}</GradBtn>
      <Btn2 onClick={function(){setView("ranking");}}>Ranking del grupo</Btn2>
      <div style={{display:"flex",gap:8}}>
        <button onClick={function(){setView("reglamento");}} style={{flex:1,padding:"11px",borderRadius:12,border:b(C.border),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:C.surface,color:C.sub2}}>Reglamento</button>
        <button onClick={shareGroup} style={{flex:1,padding:"11px",borderRadius:12,border:b(C.border),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:C.surface,color:C.sub2}}>Invitar</button>
      </div>
      {isGroupAdmin&&<button onClick={function(){setShowManage(true);}} style={{width:"100%",padding:"13px",borderRadius:12,border:b(C.gold),cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:font,background:"rgba(255,208,96,0.05)",color:C.gold}}>Administrar grupo</button>}
    </div>
    <div style={{padding:"0 16px 16px"}}>
      <SectionLabel>Miembros ({members.length}/{activeGroup&&activeGroup.max_members})</SectionLabel>
      {members.map(function(m){
        return <div key={m.user_id} style={Object.assign({},card,{marginBottom:8,display:"flex",alignItems:"center",gap:10})}>
          <Ava name={(m.profiles&&(m.profiles.nick||m.profiles.nombre))||"?"} size={34}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,color:m.user_id===profile.id?C.accentS:C.text}}>{m.profiles&&(m.profiles.nick||m.profiles.nombre)}{m.user_id===profile.id?" (vos)":""}</div>
            {m.profiles&&m.profiles.nombre&&m.profiles.nick&&<div style={{fontSize:11,color:C.sub,marginTop:1}}>({m.profiles.nombre})</div>}
          </div>
          {m.role==="admin"&&<span style={{fontSize:10,color:C.gold,background:"rgba(255,208,96,0.1)",padding:"2px 8px",borderRadius:10,border:"1px solid rgba(255,208,96,0.2)"}}>Admin</span>}
          {m.user_id!==profile.id&&<button onClick={function(){setSelectedUser(m);}} style={{background:"none",border:b(C.border),color:C.sub2,borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:font}}>Ver planilla</button>}
        </div>;
      })}
    </div>
    {selectedUser&&<ViewUserPredModal user={selectedUser} group={activeGroup} onClose={function(){setSelectedUser(null);}}/>}
    {showManage&&<ManageGroupModal group={activeGroup} onClose={function(){setShowManage(false);}} onUpdated={function(updated){setActiveGroup(updated);setShowManage(false);}} toast$={toast$}/>}
  </div>;
}

function ManageGroupModal({group,onClose,onUpdated,toast$}){
  const [max,setMax]=useState(String(group.max_members));
  const [loading,setLoading]=useState(false);
  function save(){
    var val=parseInt(max);
    if(isNaN(val)||val<1) return toast$("Valor invalido","err");
    setLoading(true);
    supabase.from("groups").update({max_members:val}).eq("id",group.id).select().single().then(function(r){
      if(r.error){toast$(r.error.message,"err");setLoading(false);return;}
      toast$("Grupo actualizado");onUpdated(r.data);
    });
  }
  return <Modal title={"Administrar - "+group.name} onClose={onClose}>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:12,color:C.sub,marginBottom:8,lineHeight:1.5}}>Podes cambiar el maximo de participantes.</div>
      <Field label="Maximo de participantes" value={max} onChange={setMax} type="number"/>
    </div>
    <GradBtn onClick={save} disabled={loading}>{loading?"Guardando...":"Guardar cambios"}</GradBtn>
  </Modal>;
}

function OfficialResultsView({ctx}){
  var setView=ctx.setView;
  const [ag,setAg]=useState("A");
  const [official,setOfficial]=useState({});
  const [loading,setLoading]=useState(true);

  useEffect(function(){
    supabase.from("official_results").select("*").then(function(r){
      var map={};(r.data||[]).forEach(function(x){map[x.match_id]=x;});setOfficial(map);setLoading(false);
    });
  },[]);

  var sortedMatches=GROUP_MATCHES.filter(function(m){return m.group===ag;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);});
  var hasAnyResult=Object.values(official).some(function(r){return r.home!=null&&r.home!=="";});

  return <div style={{minHeight:"100vh"}}>
    <Bar title="Resultados Oficiales" onBack={function(){setView("groups_list");}}/>
    <Tabs items={Object.keys(GROUPS).map(function(g){return {id:g,label:g};})} active={ag} onSelect={setAg} small/>
    {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:32}}>Cargando...</p>}
    {!loading&&!hasAnyResult&&<div style={{textAlign:"center",marginTop:48,padding:"0 24px"}}><div style={{fontSize:40,marginBottom:12}}>&#9203;</div><div style={{color:C.sub,fontSize:14}}>El torneo aun no comenzo</div></div>}
    {!loading&&<div style={{padding:"10px 14px 40px"}}>
      {sortedMatches.map(function(m){
        var off=official[m.id];
        var played=off&&off.home!=null&&off.home!=="";
        return <div key={m.id} style={Object.assign({},card,{marginBottom:10,borderLeft:played?b3(C.accentS):b3(C.border)})}>
          <div style={{fontSize:10,color:C.sub2,marginBottom:8}}>{fmtDate(m.date)} - {m.time} hs - {m.venue}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{flex:1,fontSize:14,color:C.text,fontWeight:played?600:400}}>{m.home}</span>
            <div style={{minWidth:70,textAlign:"center",background:played?C.surface2:"transparent",borderRadius:8,padding:played?"6px 12px":"4px 12px",border:played?b(C.border):"none"}}>
              {played?<span style={{fontFamily:mono,fontSize:20,fontWeight:800,color:C.text}}>{off.home} - {off.away}</span>:<span style={{color:C.sub,fontSize:13}}>vs</span>}
            </div>
            <span style={{flex:1,fontSize:14,color:C.text,fontWeight:played?600:400,textAlign:"right"}}>{m.away}</span>
          </div>
        </div>;
      })}
    </div>}
  </div>;
}

function GlobalRankingView({ctx}){
  var profile=ctx.profile,setView=ctx.setView;
  const [ranking,setRanking]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(function(){
    Promise.all([
      supabase.from("official_results").select("*"),
      supabase.from("predictions").select("user_id,match_id,home,away,pen_home,pen_away,winner,home_team,away_team"),
      supabase.from("prediction_extras").select("*"),
      supabase.from("official_extras").select("*").single(),
    ]).then(function(results){
      var offMap={};(results[0].data||[]).forEach(function(r){offMap[r.match_id]=r;});
      var allPreds=results[1].data||[];
      var extrasMap={};(results[2].data||[]).forEach(function(e){extrasMap[e.user_id]=e;});
      var offExtras=results[3].data;
      if(!allPreds.length){setLoading(false);return;}
      var byUser={};
      allPreds.forEach(function(p){if(!byUser[p.user_id])byUser[p.user_id]=[];byUser[p.user_id].push(p);});
      var uids=Object.keys(byUser);
      supabase.from("profiles").select("id,nick,nombre").in("id",uids).then(function(r2){
        var profMap={};(r2.data||[]).forEach(function(p){profMap[p.id]=p;});
        var res=uids.map(function(uid){
          var pts=0;
          byUser[uid].forEach(function(p){pts+=scorePred(p,offMap[p.match_id],p.match_id);});
          pts+=scoreExtras(extrasMap[uid],offExtras);
          var prof=profMap[uid];
          return{uid:uid,pts:pts,nick:prof&&prof.nick||"?",nombre:prof&&prof.nombre||""};
        });
        setRanking(res.sort(function(a,b){return b.pts-a.pts;}));
        setLoading(false);
      });
    });
  },[]);

  var medals=["gold","silver","bronze"];
  var medalEmoji=["&#127941;","&#129352;","&#129353;"];
  return <div style={{minHeight:"100vh"}}>
    <Bar title="Ranking Global" onBack={function(){setView("groups_list");}}/>
    <div style={{padding:"16px 14px 80px"}}>
      <div style={Object.assign({},card,{marginBottom:16,padding:"10px 14px",background:"rgba(255,208,96,0.05)",border:b("rgba(255,208,96,0.2)")})}><p style={{color:C.sub,fontSize:12,margin:0,lineHeight:1.6}}>Todos los participantes de la plataforma, sin importar el grupo.</p></div>
      {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:24}}>Calculando...</p>}
      {ranking.map(function(r,i){
        var isMine=r.uid===profile.id;
        return <div key={r.uid} style={Object.assign({},rankRow,{background:isMine?"rgba(0,200,224,0.07)":C.surface,borderLeft:isMine?b2(C.accentS):i<3?b2("rgba(255,208,96,0.4)"):b2(C.border),marginBottom:8})}>
          <span style={{width:28,fontSize:i<3?20:12,textAlign:"center",flexShrink:0,color:i===0?C.gold:i===1?"#C0C0C0":i===2?"#CD7F32":C.sub}} dangerouslySetInnerHTML={{__html:i<3?medalEmoji[i]:(i+1)+"."}}/>
          <Ava name={r.nick} size={32}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:isMine?700:500,color:isMine?C.accentS:C.text}}>{r.nick}</div>
            {r.nombre&&<div style={{fontSize:11,color:C.sub,marginTop:1}}>({r.nombre})</div>}
          </div>
          <span style={{fontFamily:mono,fontSize:18,fontWeight:700,color:C.text}}>{r.pts}</span>
          <span style={{fontSize:10,color:C.sub,marginLeft:3}}>pts</span>
        </div>;
      })}
      {!loading&&ranking.every(function(r){return r.pts===0;})&&<p style={{color:C.sub,textAlign:"center",marginTop:40,fontSize:13}}>Sin resultados oficiales aun</p>}
    </div>
  </div>;
}

function TeamSelector({value,onChange,locked}){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  var filtered=q?ALL_TEAMS.filter(function(t){return t.toLowerCase().indexOf(q.toLowerCase())>=0;}):ALL_TEAMS;
  return <div>
    <button onClick={function(){if(!locked)setOpen(true);}} style={Object.assign({},inp,{textAlign:"left",cursor:locked?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"})}>
      <span style={{color:value?C.text:C.sub}}>{value||"Seleccionar equipo..."}</span>
      {!locked&&<span style={{color:C.sub2,fontSize:12}}>v</span>}
    </button>
    {open&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:C.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,padding:"20px 20px 0",border:b(C.border),borderBottom:"none",maxHeight:"70vh",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:12}}>
          <span style={{flex:1,fontSize:15,fontWeight:700,color:C.text}}>Seleccionar equipo</span>
          <button onClick={function(){setOpen(false);setQ("");}} style={{background:"none",border:"none",color:C.sub,fontSize:22,cursor:"pointer"}}>&#x2715;</button>
        </div>
        <input style={Object.assign({},inp,{marginBottom:12})} placeholder="Buscar..." value={q} onChange={function(e){setQ(e.target.value);}} autoFocus/>
        <div style={{overflowY:"auto",paddingBottom:20}}>
          {filtered.map(function(t){
            return <button key={t} onClick={function(){onChange(t);setOpen(false);setQ("");}} style={{width:"100%",padding:"12px 14px",background:value===t?"rgba(0,200,224,0.1)":C.surface2,border:value===t?b(C.accentS):b(C.border),borderRadius:8,color:value===t?C.accentS:C.text,fontSize:14,cursor:"pointer",fontFamily:font,textAlign:"left",marginBottom:6}}>{t}</button>;
          })}
        </div>
      </div>
    </div>}
  </div>;
}

function PredictionsView({ctx}){
  var profile=ctx.profile,activeGroup=ctx.activeGroup,setView=ctx.setView,toast$=ctx.toast$;
  const [tab,setTab]=useState("groups");
  const [activeGrp,setActiveGrp]=useState("A");
  const [preds,setPreds]=useState({});
  const [official,setOfficial]=useState({});
  const [extras,setExtras]=useState({champion:"",runner_up:"",third:"",fourth:""});
  const [officialExtras,setOfficialExtras]=useState(null);
  const [saving,setSaving]=useState(false);
  const [showCopyModal,setShowCopyModal]=useState(false);
  var locked=isLocked();

  useEffect(function(){loadData();},[]);

  function loadData(){
    Promise.all([
      supabase.from("official_results").select("*"),
      supabase.from("predictions").select("*").eq("user_id",profile.id).eq("group_id",activeGroup.id),
      supabase.from("prediction_extras").select("*").eq("user_id",profile.id).eq("group_id",activeGroup.id).single(),
      supabase.from("official_extras").select("*").single(),
    ]).then(function(results){
      var offMap={};(results[0].data||[]).forEach(function(r){offMap[r.match_id]=r;});setOfficial(offMap);
      var myPreds=results[1].data||[];
      if(myPreds.length>0){var map={};myPreds.forEach(function(p){map[p.match_id]=p;});setPreds(map);}
      else{
        supabase.from("predictions").select("*").eq("user_id",profile.id).neq("group_id",activeGroup.id).limit(1).then(function(r){
          if(r.data&&r.data.length>0) setShowCopyModal(true);
        });
      }
      if(results[2].data) setExtras({champion:results[2].data.champion||"",runner_up:results[2].data.runner_up||"",third:results[2].data.third||"",fourth:results[2].data.fourth||""});
      if(results[3].data) setOfficialExtras(results[3].data);
    });
  }

  function copyFromExisting(){
    supabase.from("predictions").select("*").eq("user_id",profile.id).neq("group_id",activeGroup.id).then(function(r){
      var map={};(r.data||[]).forEach(function(p){map[p.match_id]=Object.assign({},p,{group_id:activeGroup.id,id:undefined});});
      setPreds(map);setShowCopyModal(false);toast$("Planilla cargada. Guarda cuando quieras");
    });
  }

  function upd(matchId,field,val){
    if(locked) return;
    setPreds(function(p){var n=Object.assign({},p);n[matchId]=Object.assign({},n[matchId]||{});n[matchId][field]=val;return n;});
  }

  function save(){
    if(locked) return toast$("Las planillas estan cerradas","err");
    setSaving(true);
    var rows=Object.keys(preds).map(function(match_id){
      var p=preds[match_id];
      return {user_id:profile.id,group_id:activeGroup.id,match_id:match_id,home:p.home!=null?p.home:null,away:p.away!=null?p.away:null,winner:p.winner||null,pen_home:p.pen_home||null,pen_away:p.pen_away||null,home_team:p.home_team||null,away_team:p.away_team||null};
    });
    Promise.all([
      supabase.from("predictions").upsert(rows,{onConflict:"user_id,group_id,match_id"}),
      supabase.from("prediction_extras").upsert({user_id:profile.id,group_id:activeGroup.id,champion:extras.champion||null,runner_up:extras.runner_up||null,third:extras.third||null,fourth:extras.fourth||null},{onConflict:"user_id,group_id"}),
    ]).then(function(){setSaving(false);toast$("Guardado");});
  }

  var sortedGroupMatches=GROUP_MATCHES.filter(function(m){return m.group===activeGrp;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);});

  return <div style={{minHeight:"100vh"}}>
    <Bar title="Mis predicciones" onBack={function(){setView("group");}}/>
    {locked&&<div style={{margin:"8px 14px",background:"rgba(224,92,106,0.08)",borderRadius:8,padding:"8px 12px",border:b(C.red),fontSize:12,color:C.red}}>Planilla cerrada - solo lectura</div>}
    <Tabs items={[{id:"groups",label:"Grupos"},{id:"knockout",label:"Cruces"},{id:"extras",label:"Extras"}]} active={tab} onSelect={setTab}/>

    {tab==="groups"&&<>
      <Tabs items={Object.keys(GROUPS).map(function(g){return{id:g,label:g};})} active={activeGrp} onSelect={setActiveGrp} small/>
      <div style={{padding:"10px 14px 100px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{GROUPS[activeGrp].map(function(t){return <span key={t} style={pill}>{t}</span>;})}</div>
        {sortedGroupMatches.map(function(m){
          return <PredMatchCard key={m.id} match={m} pred={preds[m.id]||{}} off={official[m.id]||{}} onUpd={function(f,v){upd(m.id,f,v);}} locked={locked}/>;
        })}
      </div>
    </>}

    {tab==="knockout"&&<div style={{padding:"10px 14px 100px"}}>
      {["r32","r16","qf","sf","3rd","f"].map(function(phase){
        var slots=KO_SLOTS.filter(function(s){return s.phase===phase;});
        if(!slots.length) return null;
        var phaseLabels={r32:"32avos",r16:"Octavos",qf:"Cuartos",sf:"Semifinales","3rd":"3 y 4 puesto",f:"Final"};
        return <div key={phase}>
          <div style={{fontSize:11,color:C.accentS,letterSpacing:1,textTransform:"uppercase",marginBottom:8,marginTop:16}}>{phaseLabels[phase]}</div>
          {slots.map(function(slot){
            return <KOPredCard key={slot.id} slot={slot} pred={preds[slot.id]||{}} off={official[slot.id]||{}} onUpd={function(f,v){upd(slot.id,f,v);}} phase={phase} locked={locked}/>;
          })}
        </div>;
      })}
    </div>}

    {tab==="extras"&&<div style={{padding:"10px 14px 100px"}}>
      <div style={Object.assign({},card,{marginBottom:16,padding:"12px 14px",background:"rgba(255,208,96,0.05)",border:b("rgba(255,208,96,0.2)")})}>
        <p style={{color:C.sub,fontSize:13,margin:0,lineHeight:1.6}}>Predicciones especiales con puntos extra.</p>
      </div>
      {[{key:"champion",label:"Campeon",pts:50},{key:"runner_up",label:"Subcampeon",pts:30},{key:"third",label:"3 puesto",pts:20},{key:"fourth",label:"4 puesto",pts:20}].map(function(item){
        var offVal=officialExtras&&officialExtras[item.key];
        var predVal=extras[item.key];
        var correct=offVal&&predVal&&offVal===predVal;
        var incorrect=offVal&&predVal&&offVal!==predVal;
        return <div key={item.key} style={Object.assign({},card,{marginBottom:10,borderLeft:correct?b3(C.green):incorrect?b3(C.red):b3(C.border)})}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:14,fontWeight:600,color:C.text}}>{item.label}</span>
            <span style={{fontSize:11,color:C.gold,background:"rgba(255,208,96,0.1)",padding:"2px 8px",borderRadius:10,border:"1px solid rgba(255,208,96,0.2)"}}>{item.pts} pts</span>
          </div>
          {offVal&&<div style={{fontSize:11,color:C.sub,marginBottom:6}}>Oficial: <b style={{color:correct?C.green:C.accentS}}>{offVal}</b></div>}
          <TeamSelector value={extras[item.key]} onChange={function(v){if(!locked)setExtras(function(p){var n=Object.assign({},p);n[item.key]=v;return n;});}} locked={locked}/>
        </div>;
      })}
    </div>}

    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.bg,borderTop:b(C.border),padding:"12px 16px",zIndex:20}}>
      <GradBtn onClick={save} disabled={saving||locked}>{locked?"Planilla cerrada":saving?"Guardando...":"Guardar predicciones"}</GradBtn>
    </div>

    {showCopyModal&&<Modal title="Planilla existente" onClose={function(){setShowCopyModal(false);}}>
      <p style={{color:C.sub,fontSize:14,lineHeight:1.6,marginBottom:16}}>Ya tenes una planilla en otro grupo. Usar como base o empezar de cero?</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <GradBtn onClick={copyFromExisting}>Usar planilla existente</GradBtn>
        <Btn2 onClick={function(){setShowCopyModal(false);}}>Empezar de cero</Btn2>
      </div>
    </Modal>}
  </div>;
}

function PredMatchCard({match,pred,off,onUpd,locked}){
  var hasOff=off&&off.home!=null&&off.home!==""&&off.away!=null&&off.away!=="";
  var sc=hasOff?scoreGroup(pred,off):null;
  return <div style={Object.assign({},card,{marginBottom:10,opacity:locked?0.85:1})}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontSize:10,color:C.sub2,letterSpacing:0.5}}>{fmtDate(match.date)} - {match.time} hs - {match.venue}</span>
      {sc!=null&&<PtsBadge pts={sc}/>}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{flex:1,fontSize:13,color:C.sub,lineHeight:1.3}}>{match.home}</span>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <ScoreBox value={pred.home!=null?pred.home:""} onChange={function(v){onUpd("home",v);}} state={hasOff?(+pred.home===+off.home?"ok":"err"):null} readOnly={locked}/>
        <span style={{color:C.border2,fontSize:13,fontFamily:mono}}>-</span>
        <ScoreBox value={pred.away!=null?pred.away:""} onChange={function(v){onUpd("away",v);}} state={hasOff?(+pred.away===+off.away?"ok":"err"):null} readOnly={locked}/>
      </div>
      <span style={{flex:1,fontSize:13,color:C.sub,textAlign:"right",lineHeight:1.3}}>{match.away}</span>
    </div>
    {hasOff&&<div style={{marginTop:8,paddingTop:8,borderTop:b(C.border)}}><span style={{color:C.sub,fontSize:11}}>Oficial: {off.home}-{off.away}</span></div>}
  </div>;
}

function KOPredCard({slot,pred,off,onUpd,phase,locked}){
  var isDraw=pred.home!==""&&pred.away!==""&&+pred.home===+pred.away;
  var pts=KO_PTS[phase];
  return <div style={Object.assign({},card,{marginBottom:10,opacity:locked?0.85:1})}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontSize:10,color:C.sub2,letterSpacing:0.5}}>{fmtDate(slot.date)} - {slot.time} hs</span>
      <span style={{fontSize:10,color:C.sub,background:C.surface2,padding:"2px 8px",borderRadius:10,border:b(C.border)}}>{slot.label}</span>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:8}}>
      <input style={Object.assign({},inp,{flex:1})} placeholder="Equipo local" value={pred.home_team||""} onChange={function(e){onUpd("home_team",e.target.value);}} readOnly={locked}/>
      <input style={Object.assign({},inp,{flex:1})} placeholder="Equipo visitante" value={pred.away_team||""} onChange={function(e){onUpd("away_team",e.target.value);}} readOnly={locked}/>
    </div>
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
      <ScoreBox value={pred.home!=null?pred.home:""} onChange={function(v){onUpd("home",v);}} readOnly={locked}/>
      <span style={{color:C.border2,fontSize:13,fontFamily:mono}}>-</span>
      <ScoreBox value={pred.away!=null?pred.away:""} onChange={function(v){onUpd("away",v);}} readOnly={locked}/>
      {isDraw&&<span style={{fontSize:10,color:C.gold,marginLeft:4}}>Penales</span>}
      <span style={{fontSize:10,color:C.sub,marginLeft:"auto"}}>{pts&&pts.team}pts/eq</span>
    </div>
    {isDraw&&<div style={{display:"flex",gap:8,padding:"10px",background:C.surface2,borderRadius:8,border:b(C.border)}}>
      <div style={{flex:1}}><div style={{fontSize:10,color:C.sub,marginBottom:4}}>Pen E1</div><input type="number" style={inp} value={pred.pen_home||""} onChange={function(e){onUpd("pen_home",e.target.value);}} min="0" readOnly={locked}/></div>
      <div style={{flex:1}}><div style={{fontSize:10,color:C.sub,marginBottom:4}}>Pen E2</div><input type="number" style={inp} value={pred.pen_away||""} onChange={function(e){onUpd("pen_away",e.target.value);}} min="0" readOnly={locked}/></div>
      <div style={{flex:1}}><div style={{fontSize:10,color:C.sub,marginBottom:4}}>Ganador</div><input style={inp} value={pred.winner||""} onChange={function(e){onUpd("winner",e.target.value);}} placeholder="Pais" readOnly={locked}/></div>
    </div>}
    {!isDraw&&<div><div style={{fontSize:10,color:C.sub,marginBottom:4}}>Ganador</div><input style={inp} value={pred.winner||""} onChange={function(e){onUpd("winner",e.target.value);}} placeholder="Pais" readOnly={locked}/></div>}
  </div>;
}

function RankingView({ctx}){
  var profile=ctx.profile,activeGroup=ctx.activeGroup,setView=ctx.setView;
  const [ranking,setRanking]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(function(){
    Promise.all([
      supabase.from("official_results").select("*"),
      supabase.from("group_members").select("user_id,profiles(id,nick,nombre)").eq("group_id",activeGroup.id),
      supabase.from("prediction_extras").select("*").eq("group_id",activeGroup.id),
      supabase.from("official_extras").select("*").single(),
    ]).then(function(results){
      var offMap={};(results[0].data||[]).forEach(function(r){offMap[r.match_id]=r;});
      var members=results[1].data||[];
      var extrasMap={};(results[2].data||[]).forEach(function(e){extrasMap[e.user_id]=e;});
      var offExtras=results[3].data;
      Promise.all(members.map(function(m){
        return supabase.from("predictions").select("*").eq("user_id",m.user_id).eq("group_id",activeGroup.id).then(function(r){
          var pts=0;
          (r.data||[]).forEach(function(p){pts+=scorePred(p,offMap[p.match_id],p.match_id);});
          pts+=scoreExtras(extrasMap[m.user_id],offExtras);
          return{nick:m.profiles&&(m.profiles.nick||"?")||"?",nombre:m.profiles&&m.profiles.nombre||"",pts:pts,uid:m.user_id};
        });
      })).then(function(res){
        setRanking(res.sort(function(a,b){return b.pts-a.pts;}));
        setLoading(false);
      });
    });
  },[]);

  var medals=["&#127941;","&#129352;","&#129353;"];
  return <div style={{minHeight:"100vh"}}>
    <Bar title={"Ranking - "+(activeGroup&&activeGroup.name)} onBack={function(){setView("group");}}/>
    <div style={{padding:"16px 14px 80px"}}>
      {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:24}}>Calculando...</p>}
      {ranking.map(function(r,i){
        var isMine=r.uid===profile.id;
        return <div key={r.uid} style={Object.assign({},rankRow,{background:isMine?"rgba(0,200,224,0.07)":C.surface,borderLeft:isMine?b2(C.accentS):i<3?b2("rgba(0,200,224,0.25)"):b2(C.border),marginBottom:8})}>
          <span style={{width:28,fontSize:i<3?20:12,textAlign:"center",flexShrink:0,color:i===0?C.gold:i===1?"#C0C0C0":i===2?"#CD7F32":C.sub}} dangerouslySetInnerHTML={{__html:i<3?medals[i]:(i+1)+"."}}/>
          <Ava name={r.nick} size={32}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:isMine?600:400,color:isMine?C.accentS:C.text}}>{r.nick}</div>
            {r.nombre&&<div style={{fontSize:11,color:C.sub,marginTop:1}}>({r.nombre})</div>}
          </div>
          <span style={{fontFamily:mono,fontSize:18,fontWeight:700,color:C.text}}>{r.pts}</span>
          <span style={{fontSize:10,color:C.sub,marginLeft:3}}>pts</span>
        </div>;
      })}
      {!loading&&ranking.every(function(r){return r.pts===0;})&&<p style={{color:C.sub,textAlign:"center",marginTop:40,fontSize:13}}>Sin resultados oficiales aun</p>}
    </div>
  </div>;
}

function ViewUserPredModal({user,group,onClose}){
  const [preds,setPreds]=useState({});
  const [ag,setAg]=useState("A");
  useEffect(function(){
    supabase.from("predictions").select("*").eq("user_id",user.user_id).eq("group_id",group.id).then(function(r){
      var map={};(r.data||[]).forEach(function(x){map[x.match_id]=x;});setPreds(map);
    });
  },[]);
  var name=user.profiles&&(user.profiles.nick||user.profiles.nombre)||"?";
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,overflowY:"auto"}}>
    <div style={{background:C.bg,minHeight:"100%",maxWidth:480,margin:"0 auto"}}>
      <Bar title={"Planilla de "+name} onBack={onClose}/>
      <Tabs items={Object.keys(GROUPS).map(function(g){return{id:g,label:g};})} active={ag} onSelect={setAg} small/>
      <div style={{padding:"10px 14px 40px"}}>
        {GROUP_MATCHES.filter(function(m){return m.group===ag;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);}).map(function(m){
          return <div key={m.id} style={Object.assign({},card,{marginBottom:8})}>
            <div style={{fontSize:10,color:C.sub2,marginBottom:6}}>{fmtDate(m.date)} - {m.time} hs</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{flex:1,fontSize:13,color:C.sub}}>{m.home}</span>
              <span style={{fontFamily:mono,fontSize:16,fontWeight:700,color:C.text,minWidth:60,textAlign:"center"}}>{preds[m.id]&&preds[m.id].home!=null?preds[m.id].home:"-"} - {preds[m.id]&&preds[m.id].away!=null?preds[m.id].away:"-"}</span>
              <span style={{flex:1,fontSize:13,color:C.sub,textAlign:"right"}}>{m.away}</span>
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}

function AdminView({ctx}){
  var signOut=ctx.signOut,toast$=ctx.toast$;
  const [tab,setTab]=useState("results");
  const [ag,setAg]=useState("A");
  const [official,setOfficial]=useState({});
  const [officialExtras,setOfficialExtras]=useState({champion:"",runner_up:"",third:"",fourth:""});
  const [saving,setSaving]=useState(false);
  const [contactRequests,setContactRequests]=useState([]);

  useEffect(function(){loadAll();},[]);

  function loadAll(){
    Promise.all([
      supabase.from("official_results").select("*"),
      supabase.from("official_extras").select("*").single(),
      supabase.from("contact_requests").select("*").order("created_at",{ascending:false}),
    ]).then(function(results){
      var map={};(results[0].data||[]).forEach(function(r){map[r.match_id]=r;});setOfficial(map);
      if(results[1].data) setOfficialExtras({champion:results[1].data.champion||"",runner_up:results[1].data.runner_up||"",third:results[1].data.third||"",fourth:results[1].data.fourth||""});
      setContactRequests(results[2].data||[]);
    });
  }

  function upd(matchId,field,val){setOfficial(function(p){var n=Object.assign({},p);n[matchId]=Object.assign({},n[matchId]||{match_id:matchId});n[matchId][field]=val;return n;});}

  function save(){
    setSaving(true);
    var rows=Object.values(official).map(function(r){return{match_id:r.match_id,home:r.home!=null?r.home:null,away:r.away!=null?r.away:null,winner:r.winner||null,pen_home:r.pen_home||null,pen_away:r.pen_away||null,home_team:r.home_team||null,away_team:r.away_team||null};});
    Promise.all([
      supabase.from("official_results").upsert(rows,{onConflict:"match_id"}),
      supabase.from("official_extras").upsert({id:1,champion:officialExtras.champion||null,runner_up:officialExtras.runner_up||null,third:officialExtras.third||null,fourth:officialExtras.fourth||null},{onConflict:"id"}),
      supabase.from("groups").update({updated_at:new Date().toISOString()}).neq("id",""),
    ]).then(function(){setSaving(false);toast$("Guardado");});
  }

  var sortedGroupMatches=GROUP_MATCHES.filter(function(m){return m.group===ag;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);});

  return <div style={{minHeight:"100vh"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:b(C.border)}}>
      <div style={Object.assign({},gradText,{fontSize:15,fontWeight:700})}>Panel Admin</div>
      <IconBtn onClick={signOut}>&#9211;</IconBtn>
    </div>
    <Tabs items={[{id:"results",label:"Resultados"},{id:"extras_admin",label:"Extras"},{id:"groups_admin",label:"Grupos"},{id:"contacts",label:"Contactos"+(contactRequests.length>0?" ("+contactRequests.length+")":"")}]} active={tab} onSelect={setTab}/>

    {tab==="results"&&<>
      <Tabs items={Object.keys(GROUPS).map(function(g){return{id:g,label:g};})} active={ag} onSelect={setAg} small/>
      <div style={{padding:"10px 14px 100px"}}>
        {sortedGroupMatches.map(function(m){
          return <div key={m.id} style={Object.assign({},card,{marginBottom:10})}>
            <div style={{fontSize:10,color:C.sub2,marginBottom:8}}>{fmtDate(m.date)} - {m.time} hs - {m.venue}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{flex:1,fontSize:13,color:C.sub}}>{m.home}</span>
              <ScoreBox value={official[m.id]&&official[m.id].home!=null?official[m.id].home:""} onChange={function(v){upd(m.id,"home",v);}}/>
              <span style={{color:C.border2,fontSize:13,fontFamily:mono}}>-</span>
              <ScoreBox value={official[m.id]&&official[m.id].away!=null?official[m.id].away:""} onChange={function(v){upd(m.id,"away",v);}}/>
              <span style={{flex:1,fontSize:13,color:C.sub,textAlign:"right"}}>{m.away}</span>
            </div>
          </div>;
        })}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.bg,borderTop:b(C.border),padding:"12px 16px",zIndex:20}}>
        <GradBtn onClick={save} disabled={saving}>{saving?"Guardando...":"Guardar resultados"}</GradBtn>
      </div>
    </>}

    {tab==="extras_admin"&&<div style={{padding:"12px 14px 100px"}}>
      <div style={Object.assign({},card,{marginBottom:16,padding:"12px 14px",background:"rgba(255,208,96,0.05)",border:b("rgba(255,208,96,0.2)")})}>
        <p style={{color:C.sub,fontSize:13,margin:0}}>Carga los resultados finales del torneo.</p>
      </div>
      {[{key:"champion",label:"Campeon"},{key:"runner_up",label:"Subcampeon"},{key:"third",label:"3 puesto"},{key:"fourth",label:"4 puesto"}].map(function(item){
        return <div key={item.key} style={Object.assign({},card,{marginBottom:10})}>
          <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:8}}>{item.label}</div>
          <TeamSelector value={officialExtras[item.key]} onChange={function(v){setOfficialExtras(function(p){var n=Object.assign({},p);n[item.key]=v;return n;});}} locked={false}/>
        </div>;
      })}
      <div style={{marginTop:16}}><GradBtn onClick={save} disabled={saving}>{saving?"Guardando...":"Guardar extras"}</GradBtn></div>
    </div>}

    {tab==="groups_admin"&&<AdminGroupsTab toast$={toast$}/>}

    {tab==="contacts"&&<div style={{padding:"12px 14px 40px"}}>
      {contactRequests.length===0&&<p style={{color:C.sub,textAlign:"center",marginTop:24}}>Sin solicitudes pendientes</p>}
      {contactRequests.map(function(c){
        return <div key={c.id} style={Object.assign({},card,{marginBottom:10})}>
          <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>{c.nombre}</div>
          {c.nick&&<div style={{fontSize:12,color:C.sub2,marginBottom:4}}>Nick/email: {c.nick}</div>}
          <div style={{fontSize:13,color:C.sub,lineHeight:1.5}}>{c.motivo}</div>
          <div style={{fontSize:10,color:C.sub,marginTop:6}}>{new Date(c.created_at).toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires"})}</div>
        </div>;
      })}
    </div>}
  </div>;
}

function AdminGroupsTab({toast$}){
  const [groups,setGroups]=useState([]);
  useEffect(function(){
    supabase.from("groups").select("*,group_members(count)").then(function(r){setGroups(r.data||[]);});
  },[]);
  function updateMax(id,val){
    supabase.from("groups").update({max_members:+val}).eq("id",id).then(function(){
      setGroups(function(p){return p.map(function(g){return g.id===id?Object.assign({},g,{max_members:+val}):g;});});
      toast$("Actualizado");
    });
  }
  return <div style={{padding:"12px 14px 40px"}}>
    {groups.map(function(g){
      return <div key={g.id} style={Object.assign({},card,{marginBottom:10})}>
        <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:8}}>{g.name}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:C.sub,flex:1}}>Max participantes</span>
          <input type="number" style={Object.assign({},inp,{width:70,textAlign:"center"})} defaultValue={g.max_members} onBlur={function(e){updateMax(g.id,e.target.value);}}/>
        </div>
      </div>;
    })}
  </div>;
}
