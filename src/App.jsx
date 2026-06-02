import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iffjdqfwdawqfxwowdqp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZmpkcWZ3ZGF3cWZ4d293ZHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTgyNjIsImV4cCI6MjA5MzU5NDI2Mn0.J3oSgvOBNbO7Kg26HeKiDagkBbrMNsgm5tkClA_0QXI";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Primer partido: México vs Sudáfrica, 11/06 16:00 hora local México (UTC-6) = 19:00 ART
const TOURNAMENT_START = new Date("2026-06-11T19:00:00-03:00");
// Las predicciones de usuarios se bloquean 1h antes del primer partido
const PREDICTIONS_LOCK = new Date(TOURNAMENT_START.getTime() - 60*60*1000);
const isLocked = () => new Date() >= PREDICTIONS_LOCK;

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
  {id:"A3",group:"A",home:"Mexico",away:"Chequia",date:"2026-06-24",time:"22:00",venue:"Ciudad de México"},
  {id:"A4",group:"A",home:"Corea del Sur",away:"Sudáfrica",date:"2026-06-24",time:"22:00",venue:"Monterrey"},
  {id:"A5",group:"A",home:"Mexico",away:"Corea del Sur",date:"2026-06-18",time:"22:00",venue:"Zapopan"},
  {id:"A6",group:"A",home:"Sudáfrica",away:"Chequia",date:"2026-06-18",time:"13:00",venue:"Atlanta"},
  {id:"B1",group:"B",home:"Canadá",away:"Bosnia-Herz.",date:"2026-06-12",time:"16:00",venue:"Toronto"},
  {id:"B2",group:"B",home:"Qatar",away:"Suiza",date:"2026-06-13",time:"16:00",venue:"Santa Clara"},
  {id:"B3",group:"B",home:"Canadá",away:"Suiza",date:"2026-06-24",time:"16:00",venue:"Vancouver"},
  {id:"B4",group:"B",home:"Qatar",away:"Bosnia-Herz.",date:"2026-06-24",time:"16:00",venue:"Seattle"},
  {id:"B5",group:"B",home:"Canadá",away:"Qatar",date:"2026-06-18",time:"19:00",venue:"Vancouver"},
  {id:"B6",group:"B",home:"Bosnia-Herz.",away:"Suiza",date:"2026-06-18",time:"16:00",venue:"Los Ángeles"},
  {id:"C1",group:"C",home:"Brasil",away:"Marruecos",date:"2026-06-13",time:"19:00",venue:"East Rutherford"},
  {id:"C2",group:"C",home:"Haití",away:"Escocia",date:"2026-06-13",time:"22:00",venue:"Foxborough"},
  {id:"C3",group:"C",home:"Brasil",away:"Escocia",date:"2026-06-24",time:"19:00",venue:"Miami"},
  {id:"C4",group:"C",home:"Marruecos",away:"Haití",date:"2026-06-24",time:"19:00",venue:"Atlanta"},
  {id:"C5",group:"C",home:"Brasil",away:"Haití",date:"2026-06-19",time:"21:30",venue:"Philadelphia"},
  {id:"C6",group:"C",home:"Escocia",away:"Marruecos",date:"2026-06-19",time:"19:00",venue:"Foxborough"},
  {id:"D1",group:"D",home:"USA",away:"Paraguay",date:"2026-06-12",time:"22:00",venue:"Los Ángeles"},
  {id:"D2",group:"D",home:"Australia",away:"Türkiye",date:"2026-06-14",time:"01:00",venue:"Vancouver"},
  {id:"D3",group:"D",home:"USA",away:"Türkiye",date:"2026-06-25",time:"23:00",venue:"Los Ángeles"},
  {id:"D4",group:"D",home:"Paraguay",away:"Australia",date:"2026-06-25",time:"23:00",venue:"Santa Clara"},
  {id:"D5",group:"D",home:"USA",away:"Australia",date:"2026-06-19",time:"16:00",venue:"Seattle"},
  {id:"D6",group:"D",home:"Türkiye",away:"Paraguay",date:"2026-06-20",time:"00:00",venue:"Santa Clara"},
  {id:"E1",group:"E",home:"Alemania",away:"Costa Marfil",date:"2026-06-20",time:"17:00",venue:"Toronto"},
  {id:"E2",group:"E",home:"Curazao",away:"Ecuador",date:"2026-06-20",time:"21:00",venue:"Kansas City"},
  {id:"E3",group:"E",home:"Alemania",away:"Ecuador",date:"2026-06-25",time:"17:00",venue:"East Rutherford"},
  {id:"E4",group:"E",home:"Costa Marfil",away:"Curazao",date:"2026-06-25",time:"17:00",venue:"Philadelphia"},
  {id:"E5",group:"E",home:"Alemania",away:"Curazao",date:"2026-06-14",time:"14:00",venue:"Houston"},
  {id:"E6",group:"E",home:"Ecuador",away:"Costa Marfil",date:"2026-06-14",time:"20:00",venue:"Philadelphia"},
  {id:"F1",group:"F",home:"Países Bajos",away:"Túnez",date:"2026-06-25",time:"20:00",venue:"Kansas City"},
  {id:"F2",group:"F",home:"Japón",away:"Suecia",date:"2026-06-25",time:"20:00",venue:"Dallas"},
  {id:"F3",group:"F",home:"Países Bajos",away:"Suecia",date:"2026-06-20",time:"14:00",venue:"Houston"},
  {id:"F4",group:"F",home:"Túnez",away:"Japón",date:"2026-06-21",time:"01:00",venue:"Monterrey"},
  {id:"F5",group:"F",home:"Países Bajos",away:"Japón",date:"2026-06-14",time:"17:00",venue:"Dallas"},
  {id:"F6",group:"F",home:"Suecia",away:"Túnez",date:"2026-06-14",time:"23:00",venue:"Monterrey"},
  {id:"G1",group:"G",home:"Bélgica",away:"Irán",date:"2026-06-21",time:"16:00",venue:"Los Ángeles"},
  {id:"G2",group:"G",home:"Egipto",away:"Nueva Zelanda",date:"2026-06-21",time:"22:00",venue:"Vancouver"},
  {id:"G3",group:"G",home:"Bélgica",away:"Nueva Zelanda",date:"2026-06-27",time:"00:00",venue:"Vancouver"},
  {id:"G4",group:"G",home:"Irán",away:"Egipto",date:"2026-06-27",time:"00:00",venue:"Seattle"},
  {id:"G5",group:"G",home:"Bélgica",away:"Egipto",date:"2026-06-15",time:"16:00",venue:"Seattle"},
  {id:"G6",group:"G",home:"Nueva Zelanda",away:"Irán",date:"2026-06-15",time:"22:00",venue:"Los Ángeles"},
  {id:"H1",group:"H",home:"España",away:"Arabia Saudita",date:"2026-06-21",time:"13:00",venue:"Atlanta"},
  {id:"H2",group:"H",home:"Uruguay",away:"Cabo Verde",date:"2026-06-21",time:"19:00",venue:"Miami"},
  {id:"H3",group:"H",home:"España",away:"Cabo Verde",date:"2026-06-15",time:"13:00",venue:"Atlanta"},
  {id:"H4",group:"H",home:"Arabia Saudita",away:"Uruguay",date:"2026-06-15",time:"19:00",venue:"Miami"},
  {id:"H5",group:"H",home:"España",away:"Uruguay",date:"2026-06-26",time:"21:00",venue:"Zapopan"},
  {id:"H6",group:"H",home:"Cabo Verde",away:"Arabia Saudita",date:"2026-06-26",time:"21:00",venue:"Houston"},
  {id:"I1",group:"I",home:"Francia",away:"Senegal",date:"2026-06-16",time:"16:00",venue:"East Rutherford"},
  {id:"I2",group:"I",home:"Noruega",away:"Irak",date:"2026-06-16",time:"19:00",venue:"Foxborough"},
  {id:"I3",group:"I",home:"Francia",away:"Irak",date:"2026-06-22",time:"18:00",venue:"Philadelphia"},
  {id:"I4",group:"I",home:"Senegal",away:"Noruega",date:"2026-06-22",time:"21:00",venue:"East Rutherford"},
  {id:"I5",group:"I",home:"Francia",away:"Noruega",date:"2026-06-26",time:"16:00",venue:"Foxborough"},
  {id:"I6",group:"I",home:"Irak",away:"Senegal",date:"2026-06-26",time:"16:00",venue:"Toronto"},
  {id:"J1",group:"J",home:"Argentina",away:"Argelia",date:"2026-06-16",time:"22:00",venue:"Kansas City"},
  {id:"J2",group:"J",home:"Austria",away:"Jordania",date:"2026-06-17",time:"01:00",venue:"Santa Clara"},
  {id:"J3",group:"J",home:"Argentina",away:"Jordania",date:"2026-06-27",time:"23:00",venue:"Dallas"},
  {id:"J4",group:"J",home:"Argelia",away:"Austria",date:"2026-06-27",time:"23:00",venue:"Kansas City"},
  {id:"J5",group:"J",home:"Argentina",away:"Austria",date:"2026-06-22",time:"14:00",venue:"Dallas"},
  {id:"J6",group:"J",home:"Jordania",away:"Argelia",date:"2026-06-23",time:"00:00",venue:"Santa Clara"},
  {id:"K1",group:"K",home:"Portugal",away:"Uzbekistán",date:"2026-06-23",time:"14:00",venue:"Houston"},
  {id:"K2",group:"K",home:"Colombia",away:"DR Congo",date:"2026-06-23",time:"23:00",venue:"Zapopan"},
  {id:"K3",group:"K",home:"Portugal",away:"DR Congo",date:"2026-06-17",time:"14:00",venue:"Houston"},
  {id:"K4",group:"K",home:"Uzbekistán",away:"Colombia",date:"2026-06-17",time:"23:00",venue:"Ciudad de México"},
  {id:"K5",group:"K",home:"Portugal",away:"Colombia",date:"2026-06-27",time:"20:30",venue:"Miami"},
  {id:"K6",group:"K",home:"DR Congo",away:"Uzbekistán",date:"2026-06-27",time:"20:30",venue:"Atlanta"},
  {id:"L1",group:"L",home:"Inglaterra",away:"Panamá",date:"2026-06-27",time:"18:00",venue:"East Rutherford"},
  {id:"L2",group:"L",home:"Croacia",away:"Ghana",date:"2026-06-27",time:"18:00",venue:"Philadelphia"},
  {id:"L3",group:"L",home:"Inglaterra",away:"Ghana",date:"2026-06-23",time:"17:00",venue:"Foxborough"},
  {id:"L4",group:"L",home:"Panamá",away:"Croacia",date:"2026-06-23",time:"20:00",venue:"Toronto"},
  {id:"L5",group:"L",home:"Inglaterra",away:"Croacia",date:"2026-06-17",time:"17:00",venue:"Dallas"},
  {id:"L6",group:"L",home:"Ghana",away:"Panamá",date:"2026-06-17",time:"20:00",venue:"Toronto"},
];

const KO_SLOTS = [
  // Round of 32 — 16 partidos oficiales FIFA
  {id:"r32_0",phase:"r32",label:"M73: 2°A vs 2°B",date:"2026-06-28",time:"16:00",venue:"Los Ángeles"},
  {id:"r32_1",phase:"r32",label:"M74: 1°E vs Mejor 3° (A/B/C/D/F)",date:"2026-06-29",time:"17:30",venue:"Foxborough"},
  {id:"r32_2",phase:"r32",label:"M75: 1°F vs 2°C",date:"2026-06-29",time:"22:00",venue:"Monterrey"},
  {id:"r32_3",phase:"r32",label:"M76: 1°C vs 2°F",date:"2026-06-29",time:"14:00",venue:"Houston"},
  {id:"r32_4",phase:"r32",label:"M77: 1°I vs Mejor 3° (C/D/F/G/H)",date:"2026-06-30",time:"18:00",venue:"East Rutherford"},
  {id:"r32_5",phase:"r32",label:"M78: 2°E vs 2°I",date:"2026-06-30",time:"14:00",venue:"Dallas"},
  {id:"r32_6",phase:"r32",label:"M79: 1°A vs Mejor 3° (C/E/F/H/I)",date:"2026-06-30",time:"22:00",venue:"Ciudad de México"},
  {id:"r32_7",phase:"r32",label:"M80: 1°L vs Mejor 3° (E/H/I/J/K)",date:"2026-07-01",time:"13:00",venue:"Atlanta"},
  {id:"r32_8",phase:"r32",label:"M81: 1°D vs Mejor 3° (B/E/F/I/J)",date:"2026-07-01",time:"21:00",venue:"Santa Clara"},
  {id:"r32_9",phase:"r32",label:"M82: 1°G vs Mejor 3° (A/E/H/I/J)",date:"2026-07-01",time:"17:00",venue:"Seattle"},
  {id:"r32_10",phase:"r32",label:"M83: 2°K vs 2°L",date:"2026-07-02",time:"20:00",venue:"Toronto"},
  {id:"r32_11",phase:"r32",label:"M84: 1°H vs 2°J",date:"2026-07-02",time:"16:00",venue:"Los Ángeles"},
  {id:"r32_12",phase:"r32",label:"M85: 1°B vs Mejor 3° (E/F/G/I/J)",date:"2026-07-03",time:"00:00",venue:"Vancouver"},
  {id:"r32_13",phase:"r32",label:"M86: 1°J vs 2°H",date:"2026-07-03",time:"19:00",venue:"Miami"},
  {id:"r32_14",phase:"r32",label:"M87: 1°K vs Mejor 3° (D/E/I/J/L)",date:"2026-07-03",time:"22:30",venue:"Kansas City"},
  {id:"r32_15",phase:"r32",label:"M88: 2°D vs 2°G",date:"2026-07-03",time:"15:00",venue:"Dallas"},
  // Round of 16 — 8 partidos
  {id:"r16_0",phase:"r16",label:"M89: W74 vs W77",date:"2026-07-04",time:"18:00",venue:"Philadelphia"},
  {id:"r16_1",phase:"r16",label:"M90: W73 vs W75",date:"2026-07-04",time:"14:00",venue:"Houston"},
  {id:"r16_2",phase:"r16",label:"M91: W76 vs W78",date:"2026-07-05",time:"17:00",venue:"East Rutherford"},
  {id:"r16_3",phase:"r16",label:"M92: W79 vs W80",date:"2026-07-05",time:"21:00",venue:"Ciudad de México"},
  {id:"r16_4",phase:"r16",label:"M93: W83 vs W84",date:"2026-07-06",time:"16:00",venue:"Dallas"},
  {id:"r16_5",phase:"r16",label:"M94: W81 vs W82",date:"2026-07-06",time:"21:00",venue:"Seattle"},
  {id:"r16_6",phase:"r16",label:"M95: W86 vs W88",date:"2026-07-07",time:"13:00",venue:"Atlanta"},
  {id:"r16_7",phase:"r16",label:"M96: W85 vs W87",date:"2026-07-07",time:"17:00",venue:"Vancouver"},
  // Cuartos de final — 4 partidos
  {id:"qf_0",phase:"qf",label:"Cuartos 1: W89 vs W90",date:"2026-07-09",time:"17:00",venue:"Foxborough"},
  {id:"qf_1",phase:"qf",label:"Cuartos 2: W93 vs W94",date:"2026-07-10",time:"16:00",venue:"Los Ángeles"},
  {id:"qf_2",phase:"qf",label:"Cuartos 3: W91 vs W92",date:"2026-07-11",time:"18:00",venue:"Miami"},
  {id:"qf_3",phase:"qf",label:"Cuartos 4: W95 vs W96",date:"2026-07-11",time:"22:00",venue:"Kansas City"},
  // Semifinales
  {id:"sf_0",phase:"sf",label:"Semifinal 1",date:"2026-07-14",time:"16:00",venue:"Dallas"},
  {id:"sf_1",phase:"sf",label:"Semifinal 2",date:"2026-07-15",time:"16:00",venue:"Atlanta"},
  // 3° y 4° puesto
  {id:"3rd_0",phase:"3rd",label:"3° y 4° puesto",date:"2026-07-18",time:"18:00",venue:"Miami"},
  // Final
  {id:"f_0",phase:"f",label:"Final",date:"2026-07-19",time:"16:00",venue:"East Rutherford"},
];

// Sistema Opción B (doc 5):
// - presence: puntos por país que CLASIFICÓ a esta fase (aparece en algún slot oficial)
// - slot: bonus adicional SOLO en r32 si el país está en el slot exacto predicho
// - goal: puntos por número exacto de goles por equipo (solo si matchup detectado)
//         penales se evalúan con la misma regla y el mismo valor que goles
const KO_PTS = {
  r32: {presence:4,  slot:10, goal:6},
  r16: {presence:12,          goal:6},
  qf:  {presence:18,          goal:6},
  sf:  {presence:24,          goal:6},
  "3rd":{presence:30,         goal:6},
  f:   {presence:36,          goal:6},
};

// Define which match feeds into which next match (and as home/away)
// Note: only 12 r32 matches feed into 8 r16 (top performers advance)
const KO_NEXT = {
  // R32 -> R16 (bracket oficial FIFA 2026)
  r32_1:{next:"r16_0",pos:"home"},r32_4:{next:"r16_0",pos:"away"},
  r32_0:{next:"r16_1",pos:"home"},r32_2:{next:"r16_1",pos:"away"},
  r32_3:{next:"r16_2",pos:"home"},r32_5:{next:"r16_2",pos:"away"},
  r32_6:{next:"r16_3",pos:"home"},r32_7:{next:"r16_3",pos:"away"},
  r32_10:{next:"r16_4",pos:"home"},r32_11:{next:"r16_4",pos:"away"},
  r32_8:{next:"r16_5",pos:"home"},r32_9:{next:"r16_5",pos:"away"},
  r32_13:{next:"r16_6",pos:"home"},r32_15:{next:"r16_6",pos:"away"},
  r32_12:{next:"r16_7",pos:"home"},r32_14:{next:"r16_7",pos:"away"},
  // R16 -> QF
  r16_0:{next:"qf_0",pos:"home"},r16_1:{next:"qf_0",pos:"away"},
  r16_4:{next:"qf_1",pos:"home"},r16_5:{next:"qf_1",pos:"away"},
  r16_2:{next:"qf_2",pos:"home"},r16_3:{next:"qf_2",pos:"away"},
  r16_6:{next:"qf_3",pos:"home"},r16_7:{next:"qf_3",pos:"away"},
  // QF -> SF -> Final
  qf_0:{next:"sf_0",pos:"home"},qf_1:{next:"sf_0",pos:"away"},
  qf_2:{next:"sf_1",pos:"home"},qf_3:{next:"sf_1",pos:"away"},
  sf_0:{next:"f_0",pos:"home"},sf_1:{next:"f_0",pos:"away"},
};

// El perdedor de cada semifinal va al partido por el 3° puesto
const KO_LOSER_NEXT = {
  sf_0:{next:"3rd_0",pos:"home"},
  sf_1:{next:"3rd_0",pos:"away"},
};

// ========== METADATA ESTRUCTURADA DE SLOTS ==========
// Parsea los labels de KO_SLOTS para generar metadata utilizable.
// Para r32: extrae posición/grupo o lista de grupos posibles para terceros.
// Para r16+: deriva de KO_NEXT (winner del slot anterior alimenta este slot).
function parseSlotSide(s){
  var m1=s.match(/^(\d)°([A-L])$/);
  if(m1) return {type:"pos",pos:+m1[1],group:m1[2]};
  var m2=s.match(/Mejor 3°\s*\(([A-L/]+)\)/);
  if(m2) return {type:"third",groups:m2[1].split("/")};
  return {type:"unknown",raw:s};
}
function buildSlotMeta(){
  var meta={};
  // r32: parsing directo del label
  KO_SLOTS.filter(function(s){return s.phase==="r32";}).forEach(function(s){
    var after=s.label.split(":").slice(1).join(":").trim();
    var parts=after.split(" vs ").map(function(x){return x.trim();});
    meta[s.id]={home:parseSlotSide(parts[0]||""),away:parseSlotSide(parts[1]||"")};
  });
  // r16+, final: derivado de KO_NEXT inverso (ganadores)
  var inv={};
  Object.keys(KO_NEXT).forEach(function(from){
    var to=KO_NEXT[from];
    if(!inv[to.next])inv[to.next]={};
    inv[to.next][to.pos]={type:"winner_of",from:from};
  });
  // 3°/4° puesto: derivado de KO_LOSER_NEXT (perdedores de semis)
  Object.keys(KO_LOSER_NEXT).forEach(function(from){
    var to=KO_LOSER_NEXT[from];
    if(!inv[to.next])inv[to.next]={};
    inv[to.next][to.pos]={type:"loser_of",from:from};
  });
  KO_SLOTS.filter(function(s){return s.phase!=="r32";}).forEach(function(s){
    meta[s.id]={home:(inv[s.id]&&inv[s.id].home)||{type:"unknown"},away:(inv[s.id]&&inv[s.id].away)||{type:"unknown"}};
  });
  return meta;
}
const KO_SLOT_META=buildSlotMeta();

// Texto legible para el header del picker (ej "1° del Grupo A", "Mejor 3° de A/B/C/D/F")
function slotPosLabel(side){
  if(!side) return "";
  if(side.type==="pos") return side.pos+"° del Grupo "+side.group;
  if(side.type==="third") return "Mejor 3° de "+side.groups.join("/");
  if(side.type==="winner_of") return "Ganador de "+side.from;
  if(side.type==="loser_of") return "Perdedor de "+side.from;
  return "";
}

// ========== CÁLCULO DE TABLA DE GRUPOS ==========
// Calcula la tabla de un grupo a partir de los marcadores cargados.
// scores: {match_id: {home, away}} (puede ser preds del usuario o results oficiales).
// Devuelve array de 4 equipos ordenados por pts → DG → GF → alfabético.
// Cada item: {team, pts, w, d, l, gf, ga, gd, played, hasAll}
function calcGroupStandings(group,scores){
  var teams=GROUPS[group]||[];
  var matches=GROUP_MATCHES.filter(function(m){return m.group===group;});
  var stats={};
  teams.forEach(function(t){stats[t]={team:t,pts:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,played:0};});
  var allPlayed=true;
  matches.forEach(function(m){
    var s=scores&&scores[m.id];
    var h=s&&s.home,a=s&&s.away;
    if(h==null||h===""||a==null||a===""){allPlayed=false;return;}
    h=+h;a=+a;
    if(isNaN(h)||isNaN(a)){allPlayed=false;return;}
    stats[m.home].played++;stats[m.away].played++;
    stats[m.home].gf+=h;stats[m.home].ga+=a;
    stats[m.away].gf+=a;stats[m.away].ga+=h;
    if(h>a){stats[m.home].w++;stats[m.home].pts+=3;stats[m.away].l++;}
    else if(h<a){stats[m.away].w++;stats[m.away].pts+=3;stats[m.home].l++;}
    else{stats[m.home].d++;stats[m.away].d++;stats[m.home].pts+=1;stats[m.away].pts+=1;}
  });
  Object.keys(stats).forEach(function(t){stats[t].gd=stats[t].gf-stats[t].ga;stats[t].hasAll=allPlayed;});
  var arr=teams.map(function(t){return stats[t];});
  arr.sort(function(a,b){
    if(b.pts!==a.pts)return b.pts-a.pts;
    if(b.gd!==a.gd)return b.gd-a.gd;
    if(b.gf!==a.gf)return b.gf-a.gf;
    return a.team.localeCompare(b.team);
  });
  return arr;
}

// Ranking global de los 12 terceros (mismos criterios FIFA calculables)
function calcThirdsRanking(scores){
  var thirds=[];
  Object.keys(GROUPS).forEach(function(g){
    var s=calcGroupStandings(g,scores);
    if(s[2]&&s[2].played>0)thirds.push(Object.assign({},s[2],{group:g}));
  });
  thirds.sort(function(a,b){
    if(b.pts!==a.pts)return b.pts-a.pts;
    if(b.gd!==a.gd)return b.gd-a.gd;
    if(b.gf!==a.gf)return b.gf-a.gf;
    return a.team.localeCompare(b.team);
  });
  return thirds;
}

// Devuelve los equipos elegibles para un lado de un slot, ordenados según marcadores.
// Para "pos": los 4 equipos del grupo, con el de la posición indicada arriba.
// Para "third": los grupos posibles, cada uno con sus 4 equipos.
// Para "winner_of": no aplica (auto-fill).
function eligibleTeamsForSide(side,scores){
  if(!side)return null;
  if(side.type==="pos"){
    var standings=calcGroupStandings(side.group,scores);
    var hasAll=standings[0]&&standings[0].hasAll;
    return {kind:"single",group:side.group,expectedPos:side.pos,teams:standings,complete:hasAll};
  }
  if(side.type==="third"){
    var byGroup={};
    side.groups.forEach(function(g){
      var s=calcGroupStandings(g,scores);
      byGroup[g]={teams:s,complete:s[0]&&s[0].hasAll};
    });
    return {kind:"third",groups:side.groups,byGroup:byGroup};
  }
  return null;
}

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

// ========== EVALUACIÓN DE ESTADO DE UN SLOT KO ==========
// Helper compartido entre scoring (scoreKO) y visualización (KOMatchCard).
// Retorna:
//   - homeState/awayState: por país:
//       "exact"    -> ubicación exacta (solo posible en R32)
//       "presence" -> clasificó a la fase pero no en esta ubicación (R32) o simplemente clasificó (R16+)
//       "none"     -> no clasificó
//       null       -> sin equipo predicho
//   - hasMatchup: true si los dos países predichos jugaron entre sí en algún slot de la misma fase
//   - matchedOff: row oficial del slot donde ocurrió el matchup (para extraer goles)
//   - swapped: true si predHome aparece como away en matchedOff (afecta cómo mapear goles)
function koEvalState(pred, phase, allOfficial){
  if (!pred) return {homeState:null,awayState:null,hasMatchup:false,matchedOff:null,swapped:false};
  var predHome=pred.home_team||null;
  var predAway=pred.away_team||null;
  var slotId=pred.match_id;

  function countryInPhase(country){
    if (!country || !allOfficial) return false;
    for (var i=0;i<KO_SLOTS.length;i++){
      var s=KO_SLOTS[i];
      if (s.phase!==phase) continue;
      var o=allOfficial[s.id];
      if (o && (o.home_team===country || o.away_team===country)) return true;
    }
    return false;
  }

  function slotExact(country, pos){
    if (!country || !slotId || !allOfficial) return false;
    var meta=KO_SLOT_META[slotId];
    if (!meta) return false;
    var side=meta[pos];
    if (!side) return false;
     if (side.type==="pos" || side.type==="third"){
      var o=allOfficial[slotId];
      if (!o) return false;
      return (pos==="home"?o.home_team:o.away_team)===country;
    }
    return false;
  }

  function stateOf(country, pos){
    if (!country) return null;
    if (phase==="r32"){
      if (slotExact(country,pos)) return "exact";
      if (countryInPhase(country)) return "presence";
      return "none";
    } else {
      if (countryInPhase(country)) return "presence";
      return "none";
    }
  }

  var homeState=stateOf(predHome,"home");
  var awayState=stateOf(predAway,"away");

  var hasMatchup=false, matchedOff=null, swapped=false;
  if (predHome && predAway && allOfficial){
    var pSet=[predHome,predAway].sort().join("|");
    for (var i=0;i<KO_SLOTS.length;i++){
      var s=KO_SLOTS[i];
      if (s.phase!==phase) continue;
      var o=allOfficial[s.id];
      if (!o||!o.home_team||!o.away_team) continue;
      var oSet=[o.home_team,o.away_team].sort().join("|");
      if (oSet===pSet){
        hasMatchup=true;
        matchedOff=o;
        swapped=(o.home_team!==predHome);
        break;
      }
    }
  }

  return {homeState:homeState,awayState:awayState,hasMatchup:hasMatchup,matchedOff:matchedOff,swapped:swapped};
}

// ========== SCORING KO (sistema Opción B doc 5) ==========
// Regla R32: por país, NO aditiva. Si ubicación exacta: +slot (10). Si solo presencia: +presence (4).
// Otras fases: solo presencia (12/18/24/30/36 según fase).
// Goles y penales: solo cuando hay matchup detectado, +goal (6) por equipo cuyo número coincide.
function scoreKO(pred, off, phase, allOfficial) {
  if (!pred) return null;
  var pts=KO_PTS[phase];
  if (!pts) return null;
  if (!allOfficial) return 0;

  var ev=koEvalState(pred,phase,allOfficial);
  if (!ev.homeState && !ev.awayState) return 0;

  // Puntos por país (NO aditivo en R32)
  function ptsFor(state){
    if (state==="exact") return pts.slot||pts.presence;
    if (state==="presence") return pts.presence;
    return 0;
  }
  var p=ptsFor(ev.homeState)+ptsFor(ev.awayState);

  // Goles y penales solo si matchup detectado
  if (ev.matchedOff){
    var ph=+(pred.home!=null && pred.home!==""?pred.home:-1);
    var pa=+(pred.away!=null && pred.away!==""?pred.away:-1);
    var oh=+(ev.matchedOff.home!=null && ev.matchedOff.home!==""?ev.matchedOff.home:-1);
    var oa=+(ev.matchedOff.away!=null && ev.matchedOff.away!==""?ev.matchedOff.away:-1);
    if (ph>=0 && pa>=0 && oh>=0 && oa>=0){
      var offForPredHome = ev.swapped ? oa : oh;
      var offForPredAway = ev.swapped ? oh : oa;
      if (ph===offForPredHome) p+=pts.goal;
      if (pa===offForPredAway) p+=pts.goal;

      var predDraw = ph===pa;
      var offHasPen = ev.matchedOff.pen_home!=null && ev.matchedOff.pen_home!=="" &&
                      ev.matchedOff.pen_away!=null && ev.matchedOff.pen_away!=="";
      if (predDraw && offHasPen){
        var pph=+(pred.pen_home!=null && pred.pen_home!==""?pred.pen_home:-1);
        var ppa=+(pred.pen_away!=null && pred.pen_away!==""?pred.pen_away:-1);
        if (pph>=0 && ppa>=0){
          var oph=+ev.matchedOff.pen_home, opa=+ev.matchedOff.pen_away;
          var offPenForPredHome = ev.swapped ? opa : oph;
          var offPenForPredAway = ev.swapped ? oph : opa;
          if (pph===offPenForPredHome) p+=pts.goal;
          if (ppa===offPenForPredAway) p+=pts.goal;
        }
      }
    }
  }

  return p;
}

function scorePred(pred, off, matchId, allOfficial) {
  var slot=null;
  for (var i=0;i<KO_SLOTS.length;i++){if(KO_SLOTS[i].id===matchId){slot=KO_SLOTS[i];break;}}
  if (slot) return scoreKO(pred,off,slot.phase,allOfficial)||0;
  return scoreGroup(pred,off)||0;
}

function scoreExtras(extras, official) {
  var p=0;
  if (!official) return p;
  if (extras&&extras.champion&&official.champion&&extras.champion===official.champion) p+=55;
  if (extras&&extras.runner_up&&official.runner_up&&extras.runner_up===official.runner_up) p+=35;
  if (extras&&extras.third&&official.third&&extras.third===official.third) p+=35;
  if (extras&&extras.fourth&&official.fourth&&extras.fourth===official.fourth) p+=35;
  return p;
}

// ========== STATS DE USUARIO + DESEMPATE (doc 5 sección 4) ==========
// Calcula puntos totales y criterios de desempate para una planilla.
// - pts: puntos totales (grupos + KO + extras opcional)
// - exactMatches: cuenta de marcadores exactos en grupos + KO (KO solo cuenta si hay marco verde / partido exacto)
// - exactSlotsR32: cuenta de ubicaciones R32 exactas (por país, 0..32)
// - goalsDiff: |total goles predichos - total goles oficiales|, incluye penales cuando aplica
function calcUserStats(preds, offMap, extras, officialExtras){
  var pts=0;
  var exactMatches=0;
  var exactSlotsR32=0;
  var predGoalsTotal=0;
  var offGoalsTotal=0;

  (preds||[]).forEach(function(p){
    var off=offMap[p.match_id];
    if (!off) return;
    pts+=scorePred(p,off,p.match_id,offMap);

    var ph=+(p.home!=null && p.home!==""?p.home:NaN);
    var pa=+(p.away!=null && p.away!==""?p.away:NaN);
    var oh=+(off.home!=null && off.home!==""?off.home:NaN);
    var oa=+(off.away!=null && off.away!==""?off.away:NaN);

    var koSlot=null;
    for (var i=0;i<KO_SLOTS.length;i++){
      if (KO_SLOTS[i].id===p.match_id){koSlot=KO_SLOTS[i];break;}
    }
    var isKO=!!koSlot;

    // Diferencia de goles: sumar oficiales (siempre) y predichos (si están)
    if (!isNaN(oh) && !isNaN(oa)){
      offGoalsTotal += oh+oa;
      var oph=+(off.pen_home!=null && off.pen_home!==""?off.pen_home:NaN);
      var opa=+(off.pen_away!=null && off.pen_away!==""?off.pen_away:NaN);
      if (!isNaN(oph) && !isNaN(opa)) offGoalsTotal += oph+opa;
    }
    if (!isNaN(ph) && !isNaN(pa)){
      predGoalsTotal += ph+pa;
      // Penales predichos solo si la pred fue empate
      if (ph===pa){
        var pph=+(p.pen_home!=null && p.pen_home!==""?p.pen_home:NaN);
        var ppa=+(p.pen_away!=null && p.pen_away!==""?p.pen_away:NaN);
        if (!isNaN(pph) && !isNaN(ppa)) predGoalsTotal += pph+ppa;
      }
    }

    // Marcadores exactos
    if (!isNaN(ph) && !isNaN(pa) && !isNaN(oh) && !isNaN(oa)){
      if (isKO){
        var ev=koEvalState(p,koSlot.phase,offMap);
        if (ev.hasMatchup && ev.matchedOff){
          var mh=+ev.matchedOff.home, ma=+ev.matchedOff.away;
          if (!isNaN(mh) && !isNaN(ma)){
            var offForPredH = ev.swapped ? ma : mh;
            var offForPredA = ev.swapped ? mh : ma;
            if (ph===offForPredH && pa===offForPredA) exactMatches++;
          }
        }
        if (koSlot.phase==="r32"){
          if (ev.homeState==="exact") exactSlotsR32++;
          if (ev.awayState==="exact") exactSlotsR32++;
        }
      } else {
        if (ph===oh && pa===oa) exactMatches++;
      }
    }
  });

  if (extras || officialExtras){
    pts += scoreExtras(extras,officialExtras);
  }

  return {
    pts: pts,
    exactMatches: exactMatches,
    exactSlotsR32: exactSlotsR32,
    goalsDiff: Math.abs(predGoalsTotal-offGoalsTotal)
  };
}

// Comparador con cascada de 3 criterios. Para usar con Array.sort().
// Si después de los 3 criterios sigue empatado, retorna 0 (premio compartido).
function tiebreakCompare(a, b){
  if (b.pts !== a.pts) return b.pts - a.pts;
  if (b.exactMatches !== a.exactMatches) return b.exactMatches - a.exactMatches;
  if (b.exactSlotsR32 !== a.exactSlotsR32) return b.exactSlotsR32 - a.exactSlotsR32;
  return a.goalsDiff - b.goalsDiff; // menor diferencia gana
}

// Marca filas de un ranking ya ordenado con `tied: true` cuando hay empate de pts con vecinos
function markTies(rankingArr){
  return rankingArr.map(function(r,i){
    var tieUp = i>0 && rankingArr[i-1].pts===r.pts;
    var tieDown = i<rankingArr.length-1 && rankingArr[i+1].pts===r.pts;
    return Object.assign({},r,{tied: tieUp||tieDown});
  });
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
  const [installPrompt,setInstallPrompt]=useState(null);
  const [showIOSInstall,setShowIOSInstall]=useState(false);
  const [pendingInvite,setPendingInvite]=useState(null); // {seq, group: {id, name, ...}}

  // ===== Detección de invite link al cargar la app =====
  // Si la URL tiene ?invite=001 (o sessionStorage tiene un invite pendiente del registro),
  // cargar el grupo y dejarlo en pendingInvite. El procesamiento (modal de confirmación + join)
  // ocurre cuando profile esté listo, en otro useEffect.
  useEffect(function(){
    var seq=null;
    try {
      var params=new URLSearchParams(window.location.search);
      seq=params.get("invite");
    } catch(e){}
    if (!seq) {
      try { seq=sessionStorage.getItem("baprode_pending_invite"); } catch(e){}
    }
    if (!seq) return;
    var seqNum=parseInt(seq,10);
    if (isNaN(seqNum)) return;
    // Limpiar URL para que el query no se quede pegado al historial
    try {
      sessionStorage.setItem("baprode_pending_invite",String(seqNum));
      var clean=window.location.pathname+window.location.hash;
      window.history.replaceState({},"",clean);
    } catch(e){}
    supabase.from("groups").select("id,name,max_members,invite_seq,join_code").eq("invite_seq",seqNum).maybeSingle().then(function(r){
      if (r.data) setPendingInvite({seq:seqNum,group:r.data});
      else {
        // Grupo no existe — limpiar
        try { sessionStorage.removeItem("baprode_pending_invite"); } catch(e){}
      }
    });
  },[]);

  // Detección iOS y modo standalone (PWA ya instalada)
  var isIOS = (typeof navigator!=="undefined") && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var isStandalone = (typeof window!=="undefined") && (
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    (window.navigator && window.navigator.standalone===true)
  );

  // Inyectar meta tags iOS al montar (si no existen ya en index.html)
  useEffect(function(){
    function ensureMeta(name,content,isLink){
      var sel=isLink?'link[rel="'+name+'"]':'meta[name="'+name+'"]';
      if (document.head.querySelector(sel)) return;
      var el=document.createElement(isLink?"link":"meta");
      if (isLink){el.rel=name;el.href=content;}
      else{el.name=name;el.content=content;}
      document.head.appendChild(el);
    }
    ensureMeta("apple-mobile-web-app-capable","yes");
    ensureMeta("apple-mobile-web-app-status-bar-style","black-translucent");
    ensureMeta("apple-mobile-web-app-title","Baprode");
    ensureMeta("apple-touch-icon","/icons/icon-192.png",true);
  },[]);

  useEffect(function(){
    function handler(e){e.preventDefault();setInstallPrompt(e);}
    window.addEventListener("beforeinstallprompt",handler);
    return function(){window.removeEventListener("beforeinstallprompt",handler);};
  },[]);

  function doInstall(){
    if(!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(function(){setInstallPrompt(null);});
  }

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
    supabase.from("profiles").select("*").eq("id",uid).maybeSingle().then(function(r){
      if (r.data){
        setProfile(r.data);setLoading(false);
        setView("groups_list");
        if(window.location.search) window.history.replaceState({},"","/");
        return;
      }
      supabase.auth.getUser().then(function(au){
        var u=au.data&&au.data.user, md=u&&u.user_metadata;
        if (!u||!md||!md.nombre){
          supabase.auth.signOut();setProfile(null);setLoading(false);setView("splash");
          showToast("Tu cuenta tiene un problema. Contactá al administrador.","err");
          return;
        }
        supabase.from("profiles").insert({id:uid,nombre:md.nombre,dni:md.dni||"",dob:md.dob||null,email:u.email,nick:md.nick||"",cel:md.cel||"",is_admin:false}).select().single().then(function(insR){
          if (insR.error){
            supabase.from("profiles").select("*").eq("id",uid).maybeSingle().then(function(rr){
              if (rr.data){setProfile(rr.data);setLoading(false);setView("groups_list");}
              else{supabase.auth.signOut();setProfile(null);setLoading(false);setView("splash");showToast("Error creando perfil: "+insR.error.message,"err");}
            });
            return;
          }
          setProfile(insR.data);setLoading(false);setView("groups_list");
          if(window.location.search) window.history.replaceState({},"","/");
        });
      });
    });
  }

  function signOut(){supabase.auth.signOut();setView("splash");}
  function markResultsSeen(){localStorage.setItem("last_seen_results",new Date().toISOString());setHasNewResults(false);}

  if(loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}><div style={{fontSize:56}}>⚽</div></div>;

  var ctx={session,profile,setProfile,activeGroup,setActiveGroup,setView,toast$:showToast,signOut,hasNewResults,markResultsSeen,installPrompt,doInstall,isIOS:isIOS,isStandalone:isStandalone,openIOSInstall:function(){setShowIOSInstall(true);}};

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
      {view==="stats"&&<StatsView ctx={ctx}/>}
      {view==="contacto"&&<ContactoView ctx={ctx}/>}
      {view==="fixture"&&<FixtureView ctx={ctx}/>}
      {view==="admin"&&<AdminView ctx={ctx}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      {showIOSInstall&&<Modal title="Instalar en iPhone" onClose={function(){setShowIOSInstall(false);}}>
        <div style={{display:"flex",flexDirection:"column",gap:14,fontSize:14,color:C.text,lineHeight:1.6}}>
          <p style={{margin:0,color:C.sub}}>Apple no permite instalar la app con un solo toque. Es manual pero rápido:</p>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px",background:C.surface2,borderRadius:10,border:b(C.border)}}>
            <span style={{fontSize:20,minWidth:24,textAlign:"center"}}>1</span>
            <span>Tocá el ícono de <b>Compartir</b> <span style={{fontSize:18,verticalAlign:"middle"}}>⬆️</span> en la barra de Safari (abajo en iPhone, arriba en iPad).</span>
          </div>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px",background:C.surface2,borderRadius:10,border:b(C.border)}}>
            <span style={{fontSize:20,minWidth:24,textAlign:"center"}}>2</span>
            <span>Desplazate y tocá <b>"Agregar a pantalla de inicio"</b>.</span>
          </div>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px",background:C.surface2,borderRadius:10,border:b(C.border)}}>
            <span style={{fontSize:20,minWidth:24,textAlign:"center"}}>3</span>
            <span>Tocá <b>"Agregar"</b> arriba a la derecha. Listo, el ícono queda en tu pantalla de inicio.</span>
          </div>
          <div style={{fontSize:11,color:C.sub2,marginTop:4,lineHeight:1.5}}>
            Importante: tiene que estar abierto en <b>Safari</b>. Si estás en Chrome o Instagram Browser, no va a funcionar — abrí el link directo en Safari.
          </div>
          <GradBtn onClick={function(){setShowIOSInstall(false);}}>Entendido</GradBtn>
        </div>
      </Modal>}
      {pendingInvite&&profile&&<Modal title="Te invitaron a un grupo" onClose={function(){
        setPendingInvite(null);
        try { sessionStorage.removeItem("baprode_pending_invite"); } catch(e){}
      }}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <p style={{margin:0,color:C.text,fontSize:14,lineHeight:1.6,textAlign:"center"}}>¿Querés unirte al grupo</p>
          <p style={{margin:0,color:C.accentS,fontSize:20,fontWeight:700,textAlign:"center"}}>{pendingInvite.group.name}?</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:10}}>
            <GradBtn onClick={function(){
              var g=pendingInvite.group;
              supabase.from("group_members").select("user_id").eq("group_id",g.id).then(function(r){
                var members=r.data||[];
                var already=members.find(function(m){return m.user_id===profile.id;});
                if (already){
                  showToast("Ya sos miembro de este grupo");
                  setPendingInvite(null);
                  try { sessionStorage.removeItem("baprode_pending_invite"); } catch(e){}
                  setActiveGroup(g);
                  setView("group");
                  return;
                }
                if (members.length>=g.max_members){
                  showToast("El grupo está lleno","err");
                  setPendingInvite(null);
                  try { sessionStorage.removeItem("baprode_pending_invite"); } catch(e){}
                  return;
                }
                supabase.from("group_members").insert({group_id:g.id,user_id:profile.id,role:"member"}).then(function(res){
                  if (res.error){ showToast("Error: "+res.error.message,"err"); return; }
                  showToast("Te uniste al grupo!");
                  setPendingInvite(null);
                  try { sessionStorage.removeItem("baprode_pending_invite"); } catch(e){}
                  setActiveGroup(g);
                  setView("group");
                });
              });
            }}>Sí, unirme</GradBtn>
            <Btn2 onClick={function(){
              setPendingInvite(null);
              try { sessionStorage.removeItem("baprode_pending_invite"); } catch(e){}
            }}>No, gracias</Btn2>
          </div>
        </div>
      </Modal>}
    </Page>
  );
}

function Page({children}){return <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:font,maxWidth:480,margin:"0 auto",position:"relative"}}>{children}</div>;}

function Bar({title,onBack}){
  return <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:b(C.border),background:C.bg,position:"sticky",top:0,zIndex:10}}>
    {onBack&&<button onClick={onBack} style={{background:"none",border:"none",color:C.accentS,fontSize:32,fontWeight:800,cursor:"pointer",padding:"4px 10px",lineHeight:1}}>&#8592;</button>}
    <span style={{fontSize:17,fontWeight:700,color:C.text,flex:1}}>{title}</span>
  </div>;
}

function Tabs({items,active,onSelect,small}){
  return <div style={{display:"flex",overflowX:"auto",borderBottom:b(C.border),scrollbarWidth:"none",background:C.bg,justifyContent:small?"center":"flex-start"}}>
    {items.map(function(it){
      return <button key={it.id} onClick={function(){onSelect(it.id);}} style={{background:"none",border:"none",borderBottom:active===it.id?b2(C.accentS):b2("transparent"),cursor:"pointer",whiteSpace:"nowrap",fontFamily:font,padding:small?"8px 9px":"10px 16px",fontSize:small?13:13,fontWeight:600,color:active===it.id?C.accentS:C.sub}}>{it.label}</button>;
    })}
  </div>;
}

function Field({label,value,onChange,type}){
  return <div>
    <div style={{fontSize:12,color:C.text,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase",fontWeight:700}}>{label}</div>
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

function SectionLabel({children}){return <div style={{fontSize:13,color:C.accentS,letterSpacing:1,textTransform:"uppercase",marginBottom:10,marginTop:4,fontWeight:700}}>{children}</div>;}

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
      <GradBtn onClick={function(){setView("login");}}>Iniciar sesión</GradBtn>
      <Btn2 onClick={function(){setView("register");}}>Crear cuenta</Btn2>
      {ctx.installPrompt&&<button onClick={ctx.doInstall} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"none",border:"1.5px solid "+C.accentS,borderRadius:8,color:C.accentS,fontSize:13,fontWeight:700,padding:"12px 20px",cursor:"pointer",fontFamily:font,letterSpacing:0.3}}>⬇ Descargar app</button>}
      {!ctx.installPrompt&&ctx.isIOS&&!ctx.isStandalone&&<button onClick={ctx.openIOSInstall} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"none",border:"1.5px solid "+C.accentS,borderRadius:8,color:C.accentS,fontSize:13,fontWeight:700,padding:"12px 20px",cursor:"pointer",fontFamily:font,letterSpacing:0.3}}>📱 Instalar en iPhone</button>}
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
          if(r2.error){toast$("Contraseña incorrecta","err");setLoading(false);}
        });
      });
    } else {
      supabase.auth.signInWithPassword({email:emailToUse,password:pw}).then(function(r){
        if(r.error){toast$("Email o contraseña incorrectos","err");setLoading(false);}
      });
    }
  }

  function forgotPw(){
    if(!identifier) return toast$("Ingresa tu email primero","err");
    if(identifier.indexOf("@")<0) return toast$("Usa tu email para recuperar contraseña","err");
    supabase.auth.resetPasswordForEmail(identifier,{redirectTo:"https://baprode-mundial.vercel.app"});
    toast$("Email de recuperación enviado");
  }

  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <Bar title="Iniciar sesión" onBack={function(){setView("splash");}}/>
    <div style={{padding:"24px 20px",display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <div style={{fontSize:12,color:C.text,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase",fontWeight:700}}>Email o Nick</div>
        <input style={inp} placeholder="email o nick" value={identifier} onChange={function(e){setIdentifier(e.target.value);}}/>
      </div>
      <div>
        <div style={{fontSize:12,color:C.text,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase",fontWeight:700}}>Contraseña</div>
        <div style={{position:"relative"}}>
          <input type={showPw?"text":"password"} style={Object.assign({},inp,{paddingRight:44})} placeholder="..." value={pw} onChange={function(e){setPw(e.target.value);}}/>
          <button onClick={function(){setShowPw(function(p){return !p;});}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.sub2,fontSize:16,padding:0}}>{showPw?"O":"O"}</button>
        </div>
      </div>
      <GradBtn onClick={login} disabled={loading}>{loading?"Ingresando...":"Entrar"}</GradBtn>
      <button onClick={forgotPw} style={{background:"none",border:"none",color:C.sub2,fontSize:14,cursor:"pointer",padding:"4px 0",fontFamily:font,fontWeight:600}}>Olvidé mi contraseña</button>
      <div style={{textAlign:"center",marginTop:8}}>
        <span style={{color:C.sub2,fontSize:14}}>¿No tenés cuenta? </span>
        <button onClick={function(){setView("register");}} style={{background:"none",border:"none",color:C.accentS,fontSize:14,cursor:"pointer",fontFamily:font,fontWeight:700}}>Registrate</button>
      </div>
      <button onClick={function(){setView("contacto");}} style={{background:"none",border:"none",color:C.sub2,fontSize:13,cursor:"pointer",fontFamily:font,padding:"4px 0",textAlign:"center"}}>¿Problemas? Contactar administrador</button>
      {ctx.installPrompt&&<button onClick={ctx.doInstall} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"none",border:"1.5px solid "+C.accentS,borderRadius:8,color:C.accentS,fontSize:13,fontWeight:700,padding:"12px 20px",cursor:"pointer",fontFamily:font,letterSpacing:0.3}}>⬇ Descargar app</button>}
      {!ctx.installPrompt&&ctx.isIOS&&!ctx.isStandalone&&<button onClick={ctx.openIOSInstall} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"none",border:"1.5px solid "+C.accentS,borderRadius:8,color:C.accentS,fontSize:13,fontWeight:700,padding:"12px 20px",cursor:"pointer",fontFamily:font,letterSpacing:0.3}}>📱 Instalar en iPhone</button>}
    </div>
  </div>;
}

const DAYS=Array.from({length:31},function(_,i){return String(i+1).padStart(2,"0");});
const MONTHS_WHEEL=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const YEARS=Array.from({length:90},function(_,i){return String(2006-i);});

function WheelPicker({items,value,onChange,width}){
  var w=width||70;
  var idx=items.indexOf(value);
  var ITEM_H=36;
  var VISIBLE_H=120;
  var PAD=42;
  return <div style={{width:w,height:VISIBLE_H,overflow:"hidden",position:"relative",cursor:"ns-resize"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:40,background:"linear-gradient(to bottom,"+C.surface2+",transparent)",zIndex:2,pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:40,background:"linear-gradient(to top,"+C.surface2+",transparent)",zIndex:2,pointerEvents:"none"}}/>
    <div style={{position:"absolute",top:"50%",left:0,right:0,height:36,marginTop:-18,border:b(C.accentS),borderRadius:8,background:"rgba(0,200,224,0.08)",zIndex:1,pointerEvents:"none"}}/>
    <div style={{overflowY:"scroll",height:"100%",scrollSnapType:"y mandatory",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}} onScroll={function(e){var el=e.target;var i=Math.min(Math.max(Math.round(el.scrollTop/ITEM_H),0),items.length-1);if(items[i]&&items[i]!==value)onChange(items[i]);}}>
      <div style={{height:PAD}}/>
      {items.map(function(item,i){return <div key={item} style={{height:ITEM_H,display:"flex",alignItems:"center",justifyContent:"center",scrollSnapAlign:"center",fontSize:15,fontWeight:i===idx?700:400,color:i===idx?C.accentS:C.sub,fontFamily:mono,transition:"all 0.1s"}}>{item}</div>;})}
      <div style={{height:PAD}}/>
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
    <div style={{fontSize:12,color:C.text,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase",fontWeight:700}}>Fecha de nacimiento *</div>
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
          <div style={{textAlign:"center"}}><div style={{fontSize:9,color:C.sub2,marginBottom:4}}>DÍA</div><WheelPicker items={DAYS} value={day} onChange={function(d){update(year,MONTHS_WHEEL[monthIdx],d);}} width={60}/></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:9,color:C.sub2,marginBottom:4}}>MES</div><WheelPicker items={MONTHS_WHEEL} value={MONTHS_WHEEL[monthIdx]} onChange={function(m){update(year,m,day);}} width={72}/></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:9,color:C.sub2,marginBottom:4}}>AÑO</div><WheelPicker items={YEARS} value={year} onChange={function(y){update(y,MONTHS_WHEEL[monthIdx],day);}} width={72}/></div>
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
    if(!ageOk(f.dob)) return toast$("Debes ser mayor de 18 años","err");
    setLoading(true);
    supabase.auth.signUp({email:f.email,password:f.pw,options:{data:{nombre:f.nombre,dni:f.dni,dob:f.dob,nick:f.nick,cel:f.cel}}}).then(function(r){
      if(r.error){toast$(r.error.message,"err");setLoading(false);return;}
        supabase.from("profiles").insert({id:r.data.user.id,nombre:f.nombre,dni:f.dni,dob:f.dob,email:f.email,nick:f.nick,cel:f.cel,is_admin:false}).then(function(insR){
        if (insR && insR.error) console.log("Profile insert error:",insR.error.message);
        toast$("Cuenta creada! Ya podes ingresar");
        setLoading(false);setView("login");
      });
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
      <Field label="Contraseña *" value={f.pw} onChange={upd("pw")} type="password"/>
      <div style={{marginTop:4}}><GradBtn onClick={register} disabled={loading}>{loading?"Creando...":"Crear cuenta"}</GradBtn></div>
      <p style={{fontSize:12,color:C.sub2,textAlign:"center",lineHeight:1.6,margin:0}}>Debes ser mayor de 18 años para registrarte</p>
    </div>
  </div>;
}

function ContactoView({ctx}){
  var setView=ctx.setView,toast$=ctx.toast$;
  const [f,setF]=useState({nombre:"",nick:"",motivo:"",telefono:"+54 "});
  const [loading,setLoading]=useState(false);
  function upd(k){return function(v){setF(function(p){var n=Object.assign({},p);n[k]=v;return n;});};}

  function enviar(){
    if(!f.nombre||!f.motivo) return toast$("Completa nombre y motivo","err");
    if(!f.telefono||f.telefono.replace(/\D/g,"").length<6) return toast$("Ingresa un teléfono válido (el superadmin te contactará por ahí)","err");
    setLoading(true);
    supabase.from("contact_requests").insert({nombre:f.nombre,nick:f.nick,motivo:f.motivo,telefono:f.telefono,created_at:new Date().toISOString()}).then(function(){
      toast$("Solicitud enviada. El administrador te contactara pronto");
      setLoading(false);
      setTimeout(function(){setView("splash");},2000);
    });
  }

  return <div style={{minHeight:"100vh"}}>
    <Bar title="Contactar Administrador" onBack={function(){setView("splash");}}/>
    <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
      <div style={Object.assign({},card,{padding:"12px 14px",background:"rgba(0,200,224,0.05)",border:b(C.accentS)})}>
        <p style={{color:C.sub,fontSize:13,margin:0,lineHeight:1.6}}>Si tenes problemas para acceder, completa el formulario. El superadmin te va a responder por el teléfono que dejes.</p>
      </div>
      <Field label="Nombre completo *" value={f.nombre} onChange={upd("nombre")}/>
      <Field label="Nick o email de la cuenta" value={f.nick} onChange={upd("nick")}/>
      <Field label="Teléfono * (incluí prefijo país)" value={f.telefono} onChange={upd("telefono")}/>
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
      {section(C.accentS,"Cómo participar",<span style={{fontSize:13}}>
        Una vez registrado, para obtener tu planilla y cargar predicciones, deberás <b>unirte a un grupo</b> o <b>crear un grupo</b> nuevo. Una vez dentro, vas a poder completar toda la competencia.<br/><br/>
        El <b style={{color:C.red}}>11 de junio de 2026</b> la planilla se bloquea por completo: a partir de esa fecha no se puede modificar nada.
      </span>)}

      {section(C.accentS,"Código del grupo",<span style={{fontSize:13}}>
        Cada grupo tiene un <b>código de 5 dígitos</b> visible para todos sus miembros. Para entrar a un grupo ya creado, vas a tener que ingresar ese código, que te lo facilita cualquier miembro.<br/><br/>
        <span style={{color:C.sub,fontSize:11}}>De esta forma garantizamos que nadie ajeno o desconocido entre al grupo.</span>
      </span>)}

      {section(C.accentS,"Fase de Grupos",<span><b style={{color:C.gold}}>4 pts</b> resultado (L/E/V)<br/><b style={{color:C.gold}}>2 pts</b> goles equipo local exactos<br/><b style={{color:C.gold}}>2 pts</b> goles equipo visitante exactos<br/><b style={{color:C.gold}}>2 pts</b> extra si marcador exacto<br/><span style={{color:C.sub,fontSize:11}}>Max 10 pts por partido</span></span>)}

      {section(C.gold,"Fase Eliminatoria — cómo se puntúa",<span style={{fontSize:12}}>
        Cada país predicho en un cruce suma <b>presencia</b> si clasificó a esa ronda (aparece en el bracket oficial, sin importar la ubicación).<br/>
        En <b>16avos</b> hay un puntaje mayor por <b>ubicación exacta</b>: o sumás 10 (ubicación exacta) o sumás 4 (clasificó a otra ubicación). No son aditivos.<br/>
        De <b>8vos en adelante</b> solo cuenta presencia (las llaves cascadean desde 16avos).
      </span>)}

      {section(C.gold,"Puntos por país",<span>
        <b style={{color:C.gold}}>16avos</b>: 10 pts si ubicación exacta, 4 pts si clasificó a otra ubicación<br/>
        <b style={{color:C.gold}}>8vos</b>: 12 pts<br/>
        <b style={{color:C.gold}}>Cuartos</b>: 18 pts<br/>
        <b style={{color:C.gold}}>Semis</b>: 24 pts<br/>
        <b style={{color:C.gold}}>3°/4° puesto</b>: 30 pts<br/>
        <b style={{color:C.gold}}>Final</b>: 36 pts<br/>
        <span style={{color:C.sub,fontSize:11}}>En 3°/4° y Final, ubicación y partido exacto colapsan (un único partido por fase).</span>
      </span>)}

      {section(C.green,"Goles y penales (partido exacto)",<span>
        Si los dos países que predijiste para un cruce coinciden con un partido <b>real de la misma ronda</b> (sin importar orden ni ubicación), se activa el <b>marco verde</b> exterior — es un "partido exacto".<br/>
        Con marco verde se evalúan los goles <b>por equipo de manera independiente</b>:<br/>
        <b style={{color:C.green}}>6 pts</b> por cada equipo cuyo número de goles coincide.<br/>
        Si predijiste empate y el partido fue a penales, los penales se evalúan con la misma regla:<br/>
        <b style={{color:C.green}}>6 pts</b> por cada equipo cuyo número de penales coincide.<br/>
        <span style={{color:C.sub,fontSize:11}}>Sin marco verde, los goles no suman puntos aunque coincidan.</span>
      </span>)}

      {section(C.accentS,"Cómo leer los colores",<span style={{fontSize:12}}>
        <b style={{color:C.green}}>Marco verde exterior</b>: partido exacto (los dos países jugaron entre sí en esa ronda).<br/><br/>
        <b>En 16avos</b> (3 estados por país):<br/>
        🟢 verde: ubicación exacta<br/>
        🟡 amarillo: clasificó, pero a otra ubicación<br/>
        🔴 rojo: no clasificó<br/><br/>
        <b>De 8vos en adelante</b> (2 estados):<br/>
        🔵 azul: clasificó<br/>
        🔴 rojo: no clasificó<br/>
        <span style={{color:C.sub,fontSize:11}}>El azul reemplaza al verde para no confundirse con "ubicación exacta" — desde 8vos no hay ubicaciones a elegir, solo se evalúa si tu predicción llegó a esta ronda.</span>
      </span>)}

      {section(C.green,"Puntos Extras",<span><b style={{color:C.green}}>55 pts</b> Campeón<br/><b style={{color:C.green}}>35 pts</b> Subcampeón<br/><b style={{color:C.green}}>35 pts</b> 3° puesto<br/><b style={{color:C.green}}>35 pts</b> 4° puesto</span>)}

      {section(C.sub2,"Desempate",<span style={{fontSize:12}}>
        En caso de empate de puntos, se aplican estos criterios en orden:<br/>
        1. Mayor cantidad de <b>marcadores exactos</b> en todo el torneo (grupos + KO)<br/>
        2. Mayor cantidad de <b>slots exactos en 16avos</b><br/>
        3. <b>Menor diferencia</b> entre el total de goles predichos y el total real (incluye penales)<br/>
        <span style={{color:C.sub,fontSize:11}}>Si persiste empate después de los 3 criterios: premio compartido.</span>
      </span>)}

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
    supabase.from("group_members").select("group_id, groups(id,name,max_members,created_by,updated_at,join_code,invite_seq)").eq("user_id",profile.id).then(function(r){
      setMyGroups((r.data||[]).map(function(d){return d.groups;}).filter(Boolean));
      setLoading(false);
    });
  }

  if(profile&&profile.is_admin) return <AdminView ctx={ctx}/>;

  function shareApp(){
    var msg="Unite al prode del Mundial 2026! https://baprode-mundial.vercel.app";
    if(navigator.share){
      navigator.share({title:"Baprode Mundial 2026",text:msg});
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
        RESULTADOS OFICIALES
        {hasNewResults&&<span style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:C.red}}/>}
      </button>
      <button onClick={function(){setView("global_ranking");}} style={{flex:1,padding:"10px",borderRadius:10,border:b(C.border),background:C.surface,color:C.gold,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>Ranking global</button>
    </div>
    <div style={{padding:"8px 16px 0"}}>
      <button onClick={function(){setView("stats");}} style={{width:"100%",padding:"10px",borderRadius:10,border:b(C.border),background:C.surface,color:"#c084fc",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Estadísticas del torneo</button>
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
      <div style={{marginTop:10}}><Btn2 onClick={function(){setShowCreate(true);}}>Crear grupo</Btn2></div>
      <div style={{marginTop:10}}><Btn2 onClick={function(){
        var url="https://baprode-mundial.vercel.app";
        var msg="Sumate a Baprode Mundial 2026, la app de pronósticos del Mundial. Entrá acá: "+url;
        if (navigator.share){
          navigator.share({title:"Baprode Mundial 2026",text:msg}).catch(function(){});
        } else if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(msg).then(function(){toast$("Mensaje copiado, pegalo donde quieras");}).catch(function(){toast$("No se pudo copiar","err");});
        } else {
          toast$("Compartí este link: "+url);
        }
      }}>Invitar amigo</Btn2></div>
    </div>
    {showCreate&&<CreateGroupModal profile={profile} onClose={function(){setShowCreate(false);}} onCreated={function(newGroup){setShowCreate(false);fetchGroups();setActiveGroup(newGroup);setView("group");}} toast$={toast$}/>}
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
    var join_code=String(Math.floor(Math.random()*100000)).padStart(5,"0");
    supabase.from("groups").insert({name:name,max_members:+max,created_by:profile.id,join_code:join_code}).select().single().then(function(r){
      if(r.error){toast$(r.error.message,"err");setLoading(false);return;}
      supabase.from("group_members").insert({group_id:r.data.id,user_id:profile.id,role:"admin"}).then(function(){
        onCreated(r.data);
      });
    });
  }
  return <Modal title="Crear grupo" onClose={onClose}>
    <Field label="Nombre del grupo" value={name} onChange={setName}/>
    <div style={{marginTop:12}}><Field label="Maximo de participantes" value={max} onChange={setMax} type="number"/></div>
    <div style={{marginTop:12,padding:"10px 12px",background:"rgba(0,200,224,0.05)",borderRadius:8,border:b("rgba(0,200,224,0.15)")}}>
      <p style={{color:C.sub2,fontSize:11,margin:0,lineHeight:1.5}}>Se generara una clave de 5 digitos. Cualquier miembro podra verla y compartirla para que otros se sumen.</p>
    </div>
    <div style={{marginTop:16}}><GradBtn onClick={create} disabled={loading}>{loading?"Creando...":"Crear"}</GradBtn></div>
  </Modal>;
}

function PinInput({value,onChange,length,error,disabled}){
  const inputRef=useRef(null);
  const len=length||5;
  useEffect(function(){
    if(inputRef.current) inputRef.current.focus();
  },[]);
  function handleChange(e){
    if(disabled) return;
    var v=e.target.value.replace(/\D/g,"").slice(0,len);
    onChange(v);
  }
  return <div style={{position:"relative"}} onClick={function(){if(inputRef.current&&!disabled) inputRef.current.focus();}}>
    <input
      ref={inputRef}
      type="tel"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      maxLength={len}
      disabled={disabled}
      style={{position:"absolute",opacity:0,top:0,left:0,width:"100%",height:"100%",border:"none",background:"transparent",fontSize:16,caretColor:"transparent"}}
    />
    <div style={{display:"flex",gap:10,justifyContent:"center",pointerEvents:"none"}}>
      {Array.from({length:len}).map(function(_,i){
        var ch=value[i]||"";
        var filled=!!ch;
        var current=i===value.length&&!disabled;
        var brd=error?C.red:(current?C.accentS:(filled?C.border2:C.border));
        return <div key={i} style={{
          width:46,height:56,borderRadius:10,
          border:b2(brd),
          background:C.surface2,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:24,fontWeight:700,color:error?C.red:C.text,
          fontFamily:mono,
          transition:"border-color 0.15s, color 0.15s"
        }}>{ch}</div>;
      })}
    </div>
  </div>;
}

function JoinGroupModal({profile,onClose,onJoined,toast$}){
  const [q,setQ]=useState("");
  const [allGroups,setAllGroups]=useState([]);
  const [loadingList,setLoadingList]=useState(true);
  const [loading,setLoading]=useState(false);
  const [pendingGroup,setPendingGroup]=useState(null);
  const [code,setCode]=useState("");
  const [codeError,setCodeError]=useState(false);

  // Cargar TODOS los grupos al abrir, ordenados alfabéticamente
  useEffect(function(){
    supabase.from("groups").select("*").order("name",{ascending:true}).then(function(r){
      setAllGroups(r.data||[]);
      setLoadingList(false);
    });
  },[]);

  // Filtro en vivo
  var filtered=allGroups.filter(function(g){
    if (!q) return true;
    return (g.name||"").toLowerCase().indexOf(q.toLowerCase())>=0;
  });

  function startJoin(g){
    setPendingGroup(g);
    setCode("");
    setCodeError(false);
  }

  useEffect(function(){
    if(code.length===5&&pendingGroup&&!loading){
      attemptJoin(code);
    }
  },[code]);

  function attemptJoin(entered){
    if(!pendingGroup) return;
    if(entered!==pendingGroup.join_code){
      setCodeError(true);
      setTimeout(function(){setCode("");setCodeError(false);},900);
      return;
    }
    setLoading(true);
    supabase.from("group_members").select("*").eq("group_id",pendingGroup.id).then(function(r){
      var members=r.data||[];
      if(members.length>=pendingGroup.max_members){toast$("El grupo esta lleno","err");setLoading(false);setPendingGroup(null);return;}
      var already=members.find(function(m){return m.user_id===profile.id;});
      if(already){toast$("Ya sos miembro","err");setLoading(false);setPendingGroup(null);return;}
      supabase.from("group_members").insert({group_id:pendingGroup.id,user_id:profile.id,role:"member"}).then(function(){
        toast$("Te uniste al grupo!");onJoined();
      });
    });
  }

  if(pendingGroup){
    return <Modal title={pendingGroup.name} onClose={function(){setPendingGroup(null);setCode("");setCodeError(false);}}>
      <p style={{color:C.sub2,fontSize:13,textAlign:"center",marginBottom:6,lineHeight:1.5}}>Ingresa la clave de 5 digitos</p>
      <p style={{color:C.sub,fontSize:11,textAlign:"center",marginBottom:20,lineHeight:1.5}}>Pedisela a alguien que ya este en el grupo</p>
      <PinInput value={code} onChange={function(v){setCode(v);setCodeError(false);}} length={5} error={codeError} disabled={loading}/>
      <div style={{height:24,marginTop:14,textAlign:"center"}}>
        {codeError&&<span style={{color:C.red,fontSize:12,fontWeight:600}}>Clave incorrecta</span>}
        {loading&&<span style={{color:C.accentS,fontSize:12,fontWeight:600}}>Ingresando...</span>}
      </div>
    </Modal>;
  }

  return <Modal title="Unirse a grupo" onClose={onClose}>
    <input style={Object.assign({},inp)} placeholder="Buscar grupo por nombre..." value={q} onChange={function(e){setQ(e.target.value);}}/>
    <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8,maxHeight:380,overflowY:"auto"}}>
      {loadingList&&<div style={{textAlign:"center",color:C.sub,fontSize:12,padding:20}}>Cargando grupos...</div>}
      {!loadingList&&filtered.length===0&&<div style={{textAlign:"center",color:C.sub,fontSize:12,padding:20}}>{q?"Ningún grupo coincide":"No hay grupos creados"}</div>}
      {filtered.map(function(g){
        return <div key={g.id} style={Object.assign({},card,{display:"flex",alignItems:"center",gap:10,padding:"10px 12px"})}>
          <span style={{flex:1,fontSize:13,color:C.text}}>{g.name}</span>
          <span style={{fontSize:10,color:C.sub2}}>max {g.max_members}</span>
          <button onClick={function(){startJoin(g);}} style={Object.assign({},gradBtnS,{padding:"6px 12px",fontSize:12})} disabled={loading}>Unirse</button>
        </div>;
      })}
    </div>
  </Modal>;
}

function GroupView({ctx}){
  var profile=ctx.profile,activeGroup=ctx.activeGroup,setView=ctx.setView,setActiveGroup=ctx.setActiveGroup,toast$=ctx.toast$;
  const [members,setMembers]=useState([]);
  const [completed,setCompleted]=useState({});
  const [myFilled,setMyFilled]=useState(0);
  const [selectedUser,setSelectedUser]=useState(null);
  const [showManage,setShowManage]=useState(false);
  const [showStats,setShowStats]=useState(false);
  const [leaveStep,setLeaveStep]=useState(0); // 0=none, 1=first confirm, 2=second confirm
  const [leaving,setLeaving]=useState(false);
  const [myRole,setMyRole]=useState(null);

  useEffect(function(){fetchMembers();},[]);

  function fetchMembers(){
    supabase.from("group_members").select("user_id,role,profiles(id,nick,nombre)").eq("group_id",activeGroup.id).then(function(r){
      var mem=r.data||[];
      setMembers(mem);
      var me=mem.find(function(m){return m.user_id===profile.id;});
      setMyRole(me&&me.role);
      supabase.from("predictions").select("user_id,home,away").eq("group_id",activeGroup.id).then(function(p){
        var done={},mine=0;
        (p.data||[]).forEach(function(x){
          done[x.user_id]=(done[x.user_id]||0)+1;
          if(x.user_id===profile.id&&x.home!=null&&x.home!==""&&x.away!=null&&x.away!=="") mine++;
        });
        setCompleted(done); setMyFilled(mine);
      });
    });
  }

  var updatedAt=activeGroup&&activeGroup.updated_at?new Date(activeGroup.updated_at).toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"Sin datos";
  var isGroupAdmin=myRole==="admin"||(activeGroup&&activeGroup.created_by===profile.id);

  function shareGroup(){
    var url="https://baprode-mundial.vercel.app";
    var seq=activeGroup&&activeGroup.invite_seq;
    var link=seq?(url+"?invite="+String(seq).padStart(3,"0")):url;
    var text=seq
      ? "Unite a mi grupo \""+activeGroup.name+"\" en Baprode Mundial 2026. Abrí este link: "+link
      : "Unite a mi grupo \""+activeGroup.name+"\" en Baprode Mundial 2026! Ingresa, busca el grupo y pedime la clave.";
    if(navigator.share) navigator.share({title:"Baprode",text:text});
    else{navigator.clipboard.writeText(text);toast$("Texto copiado");}
  }

  function copyJoinCode(){
    if(!activeGroup||!activeGroup.join_code) return;
    navigator.clipboard.writeText(activeGroup.join_code);
    toast$("Clave copiada");
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
    {activeGroup&&activeGroup.join_code&&<div style={{margin:"10px 16px 0",background:"rgba(0,200,224,0.05)",borderRadius:10,padding:"10px 14px",border:b("rgba(0,200,224,0.2)"),display:"flex",alignItems:"center",gap:10}}>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:C.sub,letterSpacing:0.5,textTransform:"uppercase"}}>Clave del grupo</div>
        <div style={{fontSize:20,fontWeight:700,color:C.accentS,fontFamily:mono,letterSpacing:4,marginTop:2}}>{activeGroup.join_code}</div>
      </div>
      <button onClick={copyJoinCode} style={{background:C.surface2,border:b(C.border2),color:C.accentS,borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Copiar</button>
    </div>}
    <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{position:"relative"}}>
        <GradBtn onClick={function(){setView("predictions");}}>{isLocked()?"Ver mis predicciones":"Mis predicciones"}</GradBtn>
        <span style={{position:"absolute",top:6,right:10,fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:8,background:myFilled>=104?"#0a2472":"rgba(224,92,106,0.18)",color:myFilled>=104?"#fff":C.red,border:b(myFilled>=104?"#0a2472":"rgba(224,92,106,0.45)"),pointerEvents:"none"}}>{myFilled>=104?"Completo":("Faltan "+(104-myFilled))}</span>
      </div>
      <button onClick={function(){setView("ranking");}} style={{width:"100%",padding:"13px",borderRadius:12,border:b(C.gold),cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:font,background:"rgba(255,208,96,0.05)",color:C.gold}}>Ranking del grupo</button>
      <div style={{display:"flex",gap:8}}>
        <button onClick={function(){setShowStats(true);}} style={{flex:1,padding:"11px",borderRadius:12,border:b(C.border),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:C.surface,color:C.green}}>Mis stats</button>
        <button onClick={function(){setView("fixture");}} style={{flex:1,padding:"11px",borderRadius:12,border:b(C.border),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:C.surface,color:C.accentS}}>RESULTADOS OFICIALES</button>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={function(){setView("reglamento");}} style={{flex:1,padding:"11px",borderRadius:12,border:b(C.border),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:C.surface,color:C.sub2}}>Reglamento</button>
        <button onClick={shareGroup} style={{flex:1,padding:"11px",borderRadius:12,border:b(C.border),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:C.surface,color:C.sub2}}>Invitar</button>
      </div>
      {isGroupAdmin&&<Btn2 onClick={function(){setShowManage(true);}}>Administrar grupo</Btn2>}
      {activeGroup&&activeGroup.created_by!==profile.id&&<button onClick={function(){setLeaveStep(1);}} style={{width:"100%",padding:"12px",borderRadius:12,border:b("rgba(224,92,106,0.4)"),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:"transparent",color:C.red,marginTop:8}}>Salir del grupo</button>}
    </div>
    <div style={{padding:"0 16px 16px"}}>
      <SectionLabel>Miembros ({members.length}/{activeGroup&&activeGroup.max_members})</SectionLabel>
      {members.map(function(m){
        var hasPlanilla=completed[m.user_id]>0;
        return <div key={m.user_id} style={Object.assign({},card,{marginBottom:8,display:"flex",alignItems:"center",gap:10})}>
          <Ava name={(m.profiles&&(m.profiles.nick||m.profiles.nombre))||"?"} size={34}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,color:m.user_id===profile.id?C.accentS:C.text,display:"flex",alignItems:"center",gap:6}}>
              {m.profiles&&(m.profiles.nick||m.profiles.nombre)}{m.user_id===profile.id?" (vos)":""}
              {hasPlanilla&&<span title="Planilla completada" style={{color:C.green,fontSize:14}}>&#10003;</span>}
            </div>
            {m.profiles&&m.profiles.nombre&&m.profiles.nick&&<div style={{fontSize:11,color:C.sub,marginTop:1}}>({m.profiles.nombre})</div>}
          </div>
          {m.role==="admin"&&<span style={{fontSize:10,color:C.gold,background:"rgba(255,208,96,0.1)",padding:"2px 8px",borderRadius:10,border:"1px solid rgba(255,208,96,0.2)"}}>Admin</span>}
          {m.user_id!==profile.id&&<button onClick={function(){setSelectedUser(m);}} style={{background:"none",border:b(C.border),color:C.sub2,borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:font}}>Ver planilla</button>}
        </div>;
      })}
    </div>
    {selectedUser&&<ViewUserPredModal user={selectedUser} group={activeGroup} onClose={function(){setSelectedUser(null);}}/>}
    {showManage&&<ManageGroupModal group={activeGroup} onClose={function(){setShowManage(false);}} onUpdated={function(updated){setActiveGroup(updated);setShowManage(false);}} toast$={toast$}/>}
    {showStats&&<StatsModal profile={profile} group={activeGroup} onClose={function(){setShowStats(false);}}/>}
    {leaveStep===1&&<Modal title="Salir del grupo" onClose={function(){if(!leaving)setLeaveStep(0);}}>
      <p style={{color:C.text,fontSize:14,lineHeight:1.6,marginBottom:16,textAlign:"center"}}>¿Seguro que querés salir del grupo <b>{activeGroup&&activeGroup.name}</b>?</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={function(){setLeaveStep(2);}} disabled={leaving} style={{width:"100%",padding:"12px",borderRadius:12,border:b(C.red),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:"rgba(224,92,106,0.08)",color:C.red}}>Sí, quiero salir</button>
        <Btn2 onClick={function(){setLeaveStep(0);}}>Cancelar</Btn2>
      </div>
    </Modal>}
    {leaveStep===2&&<Modal title="Última confirmación" onClose={function(){if(!leaving)setLeaveStep(0);}}>
      <p style={{color:C.text,fontSize:14,lineHeight:1.6,marginBottom:8,textAlign:"center"}}>Esto va a <b style={{color:C.red}}>borrar todas tus predicciones y extras</b> de este grupo. La acción no se puede deshacer.</p>
      <p style={{color:C.sub,fontSize:12,lineHeight:1.5,marginBottom:16,textAlign:"center"}}>¿Confirmás?</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button disabled={leaving} onClick={function(){
          setLeaving(true);
          var gid=activeGroup.id;
          Promise.all([
            supabase.from("predictions").delete().eq("user_id",profile.id).eq("group_id",gid),
            supabase.from("prediction_extras").delete().eq("user_id",profile.id).eq("group_id",gid),
            supabase.from("group_members").delete().eq("user_id",profile.id).eq("group_id",gid),
          ]).then(function(results){
            var err=results.find(function(r){return r.error;});
            if (err){ toast$("Error al salir: "+err.error.message,"err"); setLeaving(false); return; }
            toast$("Saliste del grupo");
            setLeaveStep(0);
            setLeaving(false);
            setActiveGroup(null);
            setView("groups_list");
          });
        }} style={{width:"100%",padding:"12px",borderRadius:12,border:b(C.red),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:C.red,color:"#fff",opacity:leaving?0.6:1}}>{leaving?"Saliendo...":"Sí, borrar todo y salir"}</button>
        <Btn2 onClick={function(){setLeaveStep(0);}}>Cancelar</Btn2>
      </div>
    </Modal>}
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

function StandingsTable({group,scores}){
  var arr=calcGroupStandings(group,scores);
  var th={padding:"6px 6px",fontSize:10,color:C.sub2,textAlign:"center",fontWeight:600,letterSpacing:0.3,textTransform:"uppercase"};
  var td={padding:"7px 6px",fontSize:12,color:C.text,textAlign:"center",fontFamily:mono};
  var ptsTd=Object.assign({},td,{fontSize:14,fontWeight:800,color:C.gold});
  var ptsTh=Object.assign({},th,{color:C.gold});
  return <div style={Object.assign({},card,{padding:"10px 8px",marginTop:14,overflowX:"auto"})}>
    <div style={{fontSize:11,color:C.accentS,letterSpacing:1,textTransform:"uppercase",marginBottom:6,padding:"0 6px",fontWeight:700}}>Tabla de posiciones</div>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>
        <th style={Object.assign({},th,{textAlign:"left",paddingLeft:8})}>Equipo</th>
        <th style={th}>PJ</th><th style={th}>G</th><th style={th}>E</th><th style={th}>P</th>
        <th style={th}>GF</th><th style={th}>GC</th><th style={th}>DG</th>
        <th style={ptsTh}>Pts</th>
      </tr></thead>
      <tbody>
        {arr.map(function(r,i){
          return <tr key={r.team} style={{borderTop:i>0?b(C.border):"none"}}>
            <td style={Object.assign({},td,{textAlign:"left",paddingLeft:8,fontFamily:font,fontWeight:600,color:C.text})}>{i+1}. {r.team}</td>
            <td style={td}>{r.played}</td>
            <td style={td}>{r.w}</td>
            <td style={td}>{r.d}</td>
            <td style={td}>{r.l}</td>
            <td style={td}>{r.gf}</td>
            <td style={td}>{r.ga}</td>
            <td style={Object.assign({},td,{color:r.gd>0?C.green:r.gd<0?C.red:C.text})}>{r.gd>0?"+"+r.gd:r.gd}</td>
            <td style={ptsTd}>{r.pts}</td>
          </tr>;
        })}
      </tbody>
    </table>
  </div>;
}

function OfficialResultsView({ctx}){
  var setView=ctx.setView;
  const [tab,setTab]=useState("groups");
  const [ag,setAg]=useState("A");
  const [koPhase,setKoPhase]=useState("r32");
  const [official,setOfficial]=useState({});
  const [loading,setLoading]=useState(true);

  useEffect(function(){
    supabase.from("official_results").select("*").then(function(r){
      var map={};(r.data||[]).forEach(function(x){map[x.match_id]=x;});setOfficial(map);setLoading(false);
    });
  },[]);

  var sortedMatches=GROUP_MATCHES.filter(function(m){return m.group===ag;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);});
  var hasAnyResult=Object.values(official).some(function(r){return r.home!=null&&r.home!==""; });

  var koSlots=KO_SLOTS.filter(function(s){return s.phase===koPhase;});
  var koPhaseLabels={r32:"16avos",r16:"Octavos",qf:"Cuartos",sf:"Semis","3rd":"3/4",f:"Final"};
  var koPhaseList=["r32","r16","qf","sf","3rd","f"];

  return <div style={{minHeight:"100vh"}}>
    <Bar title="Resultados Oficiales" onBack={function(){setView("groups_list");}}/>
    <div style={{padding:"12px 14px 0",display:"flex",gap:8}}>
      <button onClick={function(){setTab("groups");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="groups"?b(C.accentS):b(C.border),background:tab==="groups"?"rgba(0,200,224,0.1)":C.surface,color:tab==="groups"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Grupos</button>
      <button onClick={function(){setTab("ko");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="ko"?b(C.accentS):b(C.border),background:tab==="ko"?"rgba(0,200,224,0.1)":C.surface,color:tab==="ko"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Eliminatoria</button>
    </div>

    {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:32}}>Cargando...</p>}
    {!loading&&!hasAnyResult&&<div style={{textAlign:"center",marginTop:48,padding:"0 24px"}}><div style={{fontSize:40,marginBottom:12}}>&#9203;</div><div style={{color:C.sub,fontSize:14}}>El torneo aun no comenzo</div></div>}

    {!loading&&tab==="groups"&&<>
      <Tabs items={Object.keys(GROUPS).map(function(g){return {id:g,label:g};})} active={ag} onSelect={setAg} small/>
      <div style={{padding:"10px 14px 40px"}}>
        {sortedMatches.map(function(m){
          var off=official[m.id];
          var played=off&&off.home!=null&&off.home!=="";
          return <div key={m.id} style={Object.assign({},card,{padding:"10px 12px",marginBottom:6,borderLeft:played?b3(C.accentS):b3(C.border)})}>
            <div style={{fontSize:9,color:C.sub2,marginBottom:4}}>{fmtDate(m.date)} - {m.time} hs - {m.venue}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{flex:1,fontSize:13,color:C.text,fontWeight:played?600:400}}>{m.home}</span>
              <div style={{minWidth:60,textAlign:"center",background:played?C.surface2:"transparent",borderRadius:6,padding:played?"3px 10px":"2px 10px",border:played?b(C.border):"none"}}>
                {played?<span style={{fontFamily:mono,fontSize:17,fontWeight:800,color:C.text}}>{off.home} - {off.away}</span>:<span style={{color:C.sub,fontSize:12}}>vs</span>}
              </div>
              <span style={{flex:1,fontSize:13,color:C.text,fontWeight:played?600:400,textAlign:"right"}}>{m.away}</span>
            </div>
          </div>;
        })}
        <StandingsTable group={ag} scores={official}/>
      </div>
    </>}

    {!loading&&tab==="ko"&&<>
      <div style={{display:"flex",overflowX:"auto",gap:6,padding:"10px 14px 0",scrollbarWidth:"none"}}>
        {koPhaseList.map(function(p){
          return <button key={p} onClick={function(){setKoPhase(p);}} style={{padding:"8px 14px",borderRadius:20,border:koPhase===p?b(C.accentS):b(C.border),background:koPhase===p?"rgba(0,200,224,0.1)":C.surface,color:koPhase===p?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,whiteSpace:"nowrap"}}>{koPhaseLabels[p]}</button>;
        })}
      </div>
      <div style={{padding:"12px 14px 40px"}}>
        {koSlots.map(function(s){
          var off=official[s.id];
          var played=off&&off.home!=null&&off.home!=="";
          return <div key={s.id} style={Object.assign({},card,{marginBottom:10,borderLeft:played?b3(C.accentS):b3(C.border)})}>
            <div style={{fontSize:10,color:C.sub2,marginBottom:6}}>{s.label} - {fmtDate(s.date)} - {s.time} hs - {s.venue}</div>
            {(off&&(off.home_team||off.away_team))?<>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <span style={{flex:1,fontSize:14,color:C.text,fontWeight:600}}>{off.home_team||"?"}</span>
                <div style={{minWidth:70,textAlign:"center",background:C.surface2,borderRadius:8,padding:"6px 12px",border:b(C.border)}}>
                  {played?<span style={{fontFamily:mono,fontSize:20,fontWeight:800,color:C.text}}>{off.home}-{off.away}</span>:<span style={{color:C.sub,fontSize:14}}>vs</span>}
                </div>
                <span style={{flex:1,fontSize:14,color:C.text,fontWeight:600,textAlign:"right"}}>{off.away_team||"?"}</span>
              </div>
              {played&&off.pen_home!=null&&off.pen_home!==""&&<div style={{fontSize:11,color:C.gold,marginTop:6,textAlign:"center"}}>Penales: {off.pen_home}-{off.pen_away}</div>}
            </>:<div style={{fontSize:12,color:C.sub,marginTop:4}}>Por jugar</div>}
          </div>;
        })}
      </div>
    </>}
  </div>;
}

function GlobalRankingView({ctx}){
  var profile=ctx.profile,setView=ctx.setView;
  const [tab,setTab]=useState("individual");
  const [ranking,setRanking]=useState([]);
  const [groupsRanking,setGroupsRanking]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");

  useEffect(function(){
    Promise.all([
      supabase.from("official_results").select("*"),
      supabase.from("predictions").select("user_id,group_id,match_id,home,away,pen_home,pen_away,winner,home_team,away_team"),
      supabase.from("prediction_extras").select("*"),
      supabase.from("official_extras").select("*").single(),
      supabase.from("groups").select("id,name,invite_seq"),
      supabase.from("group_members").select("group_id,user_id"),
    ]).then(function(results){
      var offMap={};(results[0].data||[]).forEach(function(r){offMap[r.match_id]=r;});
      var allPreds=results[1].data||[];
      var extrasMap={};(results[2].data||[]).forEach(function(e){extrasMap[e.user_id]=e;});
      var offExtras=results[3].data;
      var groups=results[4].data||[];
      var allMembers=results[5].data||[];

      // Agrupar preds por user+group
      var byUserGroup={};
      allPreds.forEach(function(p){
        if(!byUserGroup[p.user_id])byUserGroup[p.user_id]={};
        var gid=p.group_id||"default";
        if(!byUserGroup[p.user_id][gid])byUserGroup[p.user_id][gid]=[];
        byUserGroup[p.user_id][gid].push(p);
      });
      // Agrupar miembros por grupo
      var membersByGroup={};
      allMembers.forEach(function(m){
        if(!membersByGroup[m.group_id])membersByGroup[m.group_id]=[];
        membersByGroup[m.group_id].push(m.user_id);
      });

      var uids=Object.keys(byUserGroup);
      supabase.from("public_profiles").select("id,nick,nombre").in("id",uids.length?uids:["00000000-0000-0000-0000-000000000000"]).then(function(r2){
        var profMap={};(r2.data||[]).forEach(function(p){profMap[p.id]=p;});

        // ===== Ranking INDIVIDUAL: mejor planilla por usuario =====
        var resInd=uids.map(function(uid){
          var bestStats=null;
          Object.keys(byUserGroup[uid]).forEach(function(gid){
            var stats=calcUserStats(byUserGroup[uid][gid],offMap,extrasMap[uid],offExtras);
            if (!bestStats || tiebreakCompare(stats,bestStats)<0) bestStats=stats;
          });
          if (!bestStats) bestStats={pts:0,exactMatches:0,exactSlotsR32:0,goalsDiff:0};
          var prof=profMap[uid];
          return{uid:uid,pts:bestStats.pts,exactMatches:bestStats.exactMatches,exactSlotsR32:bestStats.exactSlotsR32,goalsDiff:bestStats.goalsDiff,nick:prof&&prof.nick||"?",nombre:prof&&prof.nombre||""};
        });
        setRanking(markTies(resInd.sort(tiebreakCompare)));

        // ===== Ranking POR GRUPOS =====
        // Para cada grupo: tomar miembros, calcular pts de cada uno EN ESE GRUPO, aplicar regla:
        //   - menos de 6 miembros → no aparece
        //   - 6-10 → promedio de todos
        //   - 11+ → promedio de los 5 mejores + 5 peores
        var resGroups=groups.map(function(g){
          var memberIds=membersByGroup[g.id]||[];
          if (memberIds.length<6) return null;
          var memberPts=memberIds.map(function(uid){
            var preds=(byUserGroup[uid]&&byUserGroup[uid][g.id])||[];
            var stats=calcUserStats(preds,offMap,extrasMap[uid],offExtras);
            return stats.pts;
          });
          memberPts.sort(function(a,b){return b-a;}); // descendente
          var sample;
          if (memberPts.length<=10){
            sample=memberPts;
          } else {
            // top 5 + bottom 5
            sample=memberPts.slice(0,5).concat(memberPts.slice(-5));
          }
          var avg=sample.length? sample.reduce(function(a,b){return a+b;},0)/sample.length : 0;
          return {gid:g.id,name:g.name,seq:g.invite_seq,members:memberIds.length,avg:Math.round(avg*100)/100};
        }).filter(function(x){return x;});
        resGroups.sort(function(a,b){return b.avg-a.avg;});
        setGroupsRanking(resGroups);
        setLoading(false);
      });
    });
  },[]);

  var medals=["gold","silver","bronze"];
  var medalEmoji=["&#127941;","&#129352;","&#129353;"];
  return <div style={{minHeight:"100vh"}}>
    <Bar title="Ranking Global" onBack={function(){setView("groups_list");}}/>
    <div style={{padding:"12px 14px 0",display:"flex",gap:8}}>
      <button onClick={function(){setTab("individual");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="individual"?b(C.accentS):b(C.border),background:tab==="individual"?"rgba(0,200,224,0.1)":C.surface,color:tab==="individual"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Individual</button>
      <button onClick={function(){setTab("groups");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="groups"?b(C.accentS):b(C.border),background:tab==="groups"?"rgba(0,200,224,0.1)":C.surface,color:tab==="groups"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Por grupos</button>
    </div>
    <div style={{padding:"16px 14px 100px"}}>
      {tab==="individual"&&<>
        <div style={Object.assign({},card,{marginBottom:12,padding:"10px 14px",background:"rgba(255,208,96,0.05)",border:b("rgba(255,208,96,0.2)")})}><p style={{color:C.sub,fontSize:12,margin:0,lineHeight:1.6}}>Todos los participantes de la plataforma. Para usuarios con varias planillas se toma la mejor.</p></div>
        <input type="text" placeholder="Buscar por nick o nombre" value={search} onChange={function(e){setSearch(e.target.value);}} style={Object.assign({},inp,{marginBottom:14,fontSize:13,padding:"10px 13px"})}/>
        {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:24}}>Calculando...</p>}
        {(function(){
          var withRank=ranking.map(function(r,i){return Object.assign({},r,{rank:i+1});});
          var q=search.trim().toLowerCase();
          var list=q?withRank.filter(function(r){return (r.nick||"").toLowerCase().indexOf(q)>=0||(r.nombre||"").toLowerCase().indexOf(q)>=0;}):withRank;
          if(!loading&&q&&list.length===0)return <p style={{color:C.sub,textAlign:"center",marginTop:24,fontSize:13}}>Sin coincidencias para "{search}"</p>;
          return list.map(function(r){
            var i=r.rank-1;
            var isMine=r.uid===profile.id;
            return <div key={r.uid} style={Object.assign({},rankRow,{background:isMine?"rgba(0,200,224,0.07)":C.surface,borderLeft:isMine?b2(C.accentS):i<3?b2("rgba(255,208,96,0.4)"):b2(C.border),marginBottom:8})}>
              <span style={{width:28,fontSize:i<3?20:14,fontWeight:i<3?400:700,textAlign:"center",flexShrink:0,color:i===0?C.gold:i===1?"#C0C0C0":i===2?"#CD7F32":C.accentS}} dangerouslySetInnerHTML={{__html:i<3?medalEmoji[i]:(i+1)+"."}}/>
              <Ava name={r.nick} size={32}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:isMine?700:500,color:isMine?C.accentS:C.text}}>{r.nick}{r.tied&&<span title="Empatado en puntos — desempate por criterios" style={{marginLeft:6,fontSize:11,color:C.gold,fontWeight:700}}>=</span>}</div>
                {r.nombre&&<div style={{fontSize:11,color:C.sub,marginTop:1}}>({r.nombre})</div>}
              </div>
              <span style={{fontFamily:mono,fontSize:18,fontWeight:700,color:C.text}}>{r.pts}</span>
              <span style={{fontSize:10,color:C.sub,marginLeft:3}}>pts</span>
            </div>;
          });
        })()}
        {!loading&&!search.trim()&&ranking.every(function(r){return r.pts===0;})&&<p style={{color:C.sub,textAlign:"center",marginTop:40,fontSize:13}}>Sin resultados oficiales aun</p>}
      </>}

      {tab==="groups"&&<>
        <div style={Object.assign({},card,{marginBottom:16,padding:"10px 14px",background:"rgba(255,208,96,0.05)",border:b("rgba(255,208,96,0.2)")})}><p style={{color:C.sub,fontSize:12,margin:0,lineHeight:1.6}}>Promedio de puntos por grupo. Mínimo 6 miembros para aparecer. Grupos de 6 a 10 promedian todos; de 11+ promedian los 5 mejores y los 5 peores.</p></div>
        {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:24}}>Calculando...</p>}
        {!loading&&groupsRanking.length===0&&<p style={{color:C.sub,textAlign:"center",marginTop:40,fontSize:13}}>Sin grupos con suficientes miembros (mínimo 6).</p>}
        {groupsRanking.map(function(g,i){
          return <div key={g.gid} style={Object.assign({},rankRow,{background:C.surface,borderLeft:i<3?b2("rgba(255,208,96,0.4)"):b2(C.border),marginBottom:8})}>
            <span style={{width:28,fontSize:i<3?20:14,fontWeight:i<3?400:700,textAlign:"center",flexShrink:0,color:i===0?C.gold:i===1?"#C0C0C0":i===2?"#CD7F32":C.accentS}} dangerouslySetInnerHTML={{__html:i<3?medalEmoji[i]:(i+1)+"."}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:500,color:C.text}}>{g.name}</div>
              <div style={{fontSize:11,color:C.sub,marginTop:1}}>{g.members} miembros</div>
            </div>
            <span style={{fontFamily:mono,fontSize:18,fontWeight:700,color:C.text}}>{g.avg}</span>
            <span style={{fontSize:10,color:C.sub,marginLeft:3}}>prom</span>
          </div>;
        })}
      </>}
    </div>
    {tab==="individual"&&!loading&&(function(){
      var myIdx=ranking.findIndex(function(r){return r.uid===profile.id;});
      if(myIdx<0)return null;
      var me=ranking[myIdx];
      var rank=myIdx+1;
      return <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface2,borderTop:b2(C.accentS),padding:"10px 14px",zIndex:50,display:"flex",alignItems:"center",gap:10,boxShadow:"0 -4px 14px rgba(0,0,0,0.5)"}}>
        <span style={{fontSize:9,color:C.sub2,fontWeight:700,letterSpacing:0.5}}>TU POS.</span>
        <span style={{width:28,fontSize:rank<=3?20:13,textAlign:"center",flexShrink:0,color:rank===1?C.gold:rank===2?"#C0C0C0":rank===3?"#CD7F32":C.accentS,fontWeight:700,fontFamily:mono}} dangerouslySetInnerHTML={{__html:rank<=3?medalEmoji[rank-1]:rank+"."}}/>
        <Ava name={me.nick} size={28}/>
        <div style={{flex:1,minWidth:0,overflow:"hidden"}}>
          <div style={{fontSize:13,fontWeight:700,color:C.accentS,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{me.nick}</div>
        </div>
        <span style={{fontFamily:mono,fontSize:16,fontWeight:700,color:C.text}}>{me.pts}</span>
        <span style={{fontSize:10,color:C.sub}}>pts</span>
      </div>;
    })()}
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
  const [faltan,setFaltan]=useState(null);
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
      var byId={};myPreds.forEach(function(p){byId[p.match_id]=p;});
      // Fill-forward: re-cascada de equipos KO desde ganadores previos (no pisa nada).
      var FF_ORDER=["r32_0","r32_1","r32_2","r32_3","r32_4","r32_5","r32_6","r32_7","r32_8","r32_9","r32_10","r32_11","r32_12","r32_13","r32_14","r32_15","r16_0","r16_1","r16_2","r16_3","r16_4","r16_5","r16_6","r16_7","qf_0","qf_1","qf_2","qf_3","sf_0","sf_1"];
      FF_ORDER.forEach(function(sid){
        var sp=byId[sid]; if(!sp||!sp.winner) return;
        var nx=KO_NEXT[sid];
        if(nx){
          var dst=byId[nx.next]||{match_id:nx.next,user_id:profile.id,group_id:activeGroup.id};
          var tf=nx.pos==="home"?"home_team":"away_team";
          if(!dst[tf]){ dst=Object.assign({},dst); dst[tf]=sp.winner; byId[nx.next]=dst; }
        }
        var ln=KO_LOSER_NEXT[sid];
        if(ln&&sp.home_team&&sp.away_team){
          var loser=sp.winner===sp.home_team?sp.away_team:(sp.winner===sp.away_team?sp.home_team:null);
          if(loser){
            var ldst=byId[ln.next]||{match_id:ln.next,user_id:profile.id,group_id:activeGroup.id};
            var lf=ln.pos==="home"?"home_team":"away_team";
            if(!ldst[lf]){ ldst=Object.assign({},ldst); ldst[lf]=loser; byId[ln.next]=ldst; }
          }
        }
      });
      var REQUIRED=[];for(var gi=0;gi<GROUP_MATCHES.length;gi++)REQUIRED.push(GROUP_MATCHES[gi].id);for(var si=0;si<KO_SLOTS.length;si++)REQUIRED.push(KO_SLOTS[si].id);
      var f=0;REQUIRED.forEach(function(id){var x=byId[id];var ok=x&&x.home!=null&&x.home!==""&&x.away!=null&&x.away!=="";if(!ok)f++;});
      setFaltan(f);
      if(myPreds.length>0){setPreds(byId);}
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

    // Paso 4 — Validación cruzada R32: ningún país puede aparecer en dos slots distintos.
    // El frontend ya bloquea en el picker, pero acá hay una segunda defensa antes de guardar.
    var r32SlotIds={};
    for (var i=0;i<KO_SLOTS.length;i++){
      if (KO_SLOTS[i].phase==="r32") r32SlotIds[KO_SLOTS[i].id]=true;
    }
    var seenTeams={}; // team -> primer slotId donde apareció
    var duplicate=null;
    Object.keys(preds).forEach(function(matchId){
      if (!r32SlotIds[matchId]) return;
      var p=preds[matchId];
      ["home_team","away_team"].forEach(function(field){
        var t=p&&p[field];
        if (!t || duplicate) return;
        if (seenTeams[t]){
          duplicate={team:t,first:seenTeams[t],second:matchId};
        } else {
          seenTeams[t]=matchId;
        }
      });
    });
    if (duplicate){
      return toast$(duplicate.team+" aparece en dos cruces de 16avos ("+duplicate.first+" y "+duplicate.second+"). Corregilo antes de guardar.","err");
    }

    setSaving(true);
    var rows=Object.keys(preds).map(function(match_id){
      var p=preds[match_id];
      return {user_id:profile.id,group_id:activeGroup.id,match_id:match_id,home:p.home!=null?p.home:null,away:p.away!=null?p.away:null,winner:p.winner||null,pen_home:p.pen_home||null,pen_away:p.pen_away||null,home_team:p.home_team||null,away_team:p.away_team||null};
    });
    // Extras se derivan de los partidos Final y 3°/4°
    var finalPred=preds["f_0"]||{};
    var thirdPred=preds["3rd_0"]||{};
    function _loser(pred){
      if (!pred||!pred.winner||!pred.home_team||!pred.away_team) return null;
      if (pred.winner===pred.home_team) return pred.away_team;
      if (pred.winner===pred.away_team) return pred.home_team;
      return null;
    }
    var derivedExtras={
      champion: finalPred.winner||null,
      runner_up: _loser(finalPred),
      third: thirdPred.winner||null,
      fourth: _loser(thirdPred),
    };
    Promise.all([
      supabase.from("predictions").upsert(rows,{onConflict:"user_id,group_id,match_id"}),
      supabase.from("prediction_extras").upsert({user_id:profile.id,group_id:activeGroup.id,champion:derivedExtras.champion,runner_up:derivedExtras.runner_up,third:derivedExtras.third,fourth:derivedExtras.fourth},{onConflict:"user_id,group_id"}),
    ]).then(function(){
      setSaving(false);
      var REQUIRED=[];for(var gi=0;gi<GROUP_MATCHES.length;gi++)REQUIRED.push(GROUP_MATCHES[gi].id);for(var si=0;si<KO_SLOTS.length;si++)REQUIRED.push(KO_SLOTS[si].id);
      var f=0;REQUIRED.forEach(function(id){var x=preds[id];var ok=x&&x.home!=null&&x.home!==""&&x.away!=null&&x.away!=="";if(!ok)f++;});
      setFaltan(f);
      toast$("Guardado");
    });
  }

  var sortedGroupMatches=GROUP_MATCHES.filter(function(m){return m.group===activeGrp;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);});

  return <div style={{minHeight:"100vh"}}>
    <Bar title="Mis predicciones" onBack={function(){setView("group");}}/>
    {faltan!=null&&<div style={{margin:"10px 14px 0",background:faltan===0?"rgba(76,223,154,0.08)":"rgba(224,92,106,0.08)",borderRadius:10,padding:"10px 14px",border:b(faltan===0?C.green:C.red),display:"flex",alignItems:"center",gap:10}}>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:C.sub,letterSpacing:0.5,textTransform:"uppercase"}}>Estado de tu planilla</div>
        <div style={{fontSize:15,fontWeight:700,color:faltan===0?C.green:C.red,marginTop:2}}>{faltan===0?"COMPLETA":"FALTA COMPLETAR"}</div>
      </div>
      {faltan>0&&<div style={{fontSize:12,color:C.red,fontWeight:600,fontFamily:mono}}>{faltan} partido{faltan===1?"":"s"}</div>}
    </div>}
    {locked&&<div style={{margin:"8px 14px",background:"rgba(224,92,106,0.08)",borderRadius:8,padding:"8px 12px",border:b(C.red),fontSize:12,color:C.red}}>Planilla cerrada - solo lectura</div>}
    <div style={{padding:"12px 14px 0",display:"flex",gap:8}}>
      <button onClick={function(){setTab("groups");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="groups"?b(C.accentS):b(C.border),background:tab==="groups"?"rgba(0,200,224,0.1)":C.surface,color:tab==="groups"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Grupos</button>
      <button onClick={function(){setTab("knockout");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="knockout"?b(C.accentS):b(C.border),background:tab==="knockout"?"rgba(0,200,224,0.1)":C.surface,color:tab==="knockout"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Cruces</button>
      <button onClick={function(){setTab("extras");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="extras"?b(C.accentS):b(C.border),background:tab==="extras"?"rgba(0,200,224,0.1)":C.surface,color:tab==="extras"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Extras</button>
    </div>

    {tab==="groups"&&<>
      <Tabs items={Object.keys(GROUPS).map(function(g){return{id:g,label:g};})} active={activeGrp} onSelect={setActiveGrp} small/>
      <div style={{padding:"10px 14px 100px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{GROUPS[activeGrp].map(function(t){return <span key={t} style={pill}>{t}</span>;})}</div>
        {sortedGroupMatches.map(function(m){
          return <PredMatchCard key={m.id} match={m} pred={preds[m.id]||{}} off={official[m.id]||{}} onUpd={function(f,v){upd(m.id,f,v);}} locked={locked}/>;
        })}
      </div>
    </>}

    {tab==="knockout"&&<KOBracket preds={preds} official={official} onUpd={upd} setPreds={setPreds} locked={locked} onReglamento={function(){setView("reglamento");}}/>}

    {tab==="extras"&&<div style={{padding:"10px 14px 100px"}}>
      <div style={Object.assign({},card,{marginBottom:16,padding:"12px 14px",background:"rgba(255,208,96,0.05)",border:b("rgba(255,208,96,0.2)")})}>
        <p style={{color:C.sub,fontSize:13,margin:0,lineHeight:1.6}}>Estas predicciones se derivan automáticamente de tus partidos de <b>Final</b> y <b>3°/4°</b>. Para cambiarlas, andá a Cruces y modificá esos partidos.</p>
      </div>
      {(function(){
        // Cascada: Campeón/Subcampeón = winner/loser del Final. 3°/4° = winner/loser del 3°-4°.
        var finalPred=preds["f_0"]||{};
        var thirdPred=preds["3rd_0"]||{};
        function loser(pred){
          if (!pred||!pred.winner||!pred.home_team||!pred.away_team) return null;
          if (pred.winner===pred.home_team) return pred.away_team;
          if (pred.winner===pred.away_team) return pred.home_team;
          return null;
        }
        var derived={
          champion: finalPred.winner||null,
          runner_up: loser(finalPred),
          third: thirdPred.winner||null,
          fourth: loser(thirdPred),
        };
        return [{key:"champion",label:"Campeon",pts:55,source:"Final"},{key:"runner_up",label:"Subcampeon",pts:35,source:"Final"},{key:"third",label:"3 puesto",pts:35,source:"3°/4°"},{key:"fourth",label:"4 puesto",pts:35,source:"3°/4°"}].map(function(item){
          var offVal=officialExtras&&officialExtras[item.key];
          var predVal=derived[item.key];
          var correct=offVal&&predVal&&offVal===predVal;
          var incorrect=offVal&&predVal&&offVal!==predVal;
          return <div key={item.key} style={Object.assign({},card,{marginBottom:10,borderLeft:correct?b3(C.green):incorrect?b3(C.red):b3(C.border)})}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:14,fontWeight:600,color:C.text}}>{item.label}</span>
              <span style={{fontSize:11,color:C.gold,background:"rgba(255,208,96,0.1)",padding:"2px 8px",borderRadius:10,border:"1px solid rgba(255,208,96,0.2)"}}>{item.pts} pts</span>
            </div>
            {offVal&&<div style={{fontSize:11,color:C.sub,marginBottom:6}}>Oficial: <b style={{color:C.text,fontSize:13,fontWeight:700}}>{offVal}</b></div>}
            <div style={Object.assign({},inp,{padding:"10px 12px",fontSize:14,color:predVal?C.text:C.sub2,fontStyle:predVal?"normal":"italic",cursor:"default"})}>
              {predVal||"Pendiente"}
            </div>
            <div style={{fontSize:10,color:C.sub2,marginTop:6,letterSpacing:0.3}}>Derivado de {item.source}</div>
          </div>;
        });
      })()}
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
  var oR=null,pR=null;
  if(hasOff){
    var oh2=+off.home,oa2=+off.away;
    var ph2=+(pred&&pred.home!=null?pred.home:-1),pa2=+(pred&&pred.away!=null?pred.away:-1);
    if(!isNaN(oh2)&&!isNaN(oa2))oR=oh2>oa2?"H":oh2<oa2?"A":"D";
    if(ph2>=0&&pa2>=0)pR=ph2>pa2?"H":ph2<pa2?"A":"D";
  }
  return <div style={Object.assign({},card,{marginBottom:10,opacity:locked?0.85:1})}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontSize:10,color:C.sub2,letterSpacing:0.5}}>{fmtDate(match.date)} - {match.time} hs - {match.venue}</span>
      {sc!=null&&<PtsBadge pts={sc}/>}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{flex:1,fontSize:14,color:C.text,fontWeight:700,lineHeight:1.3}}>{match.home}</span>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <ScoreBox value={pred.home!=null?pred.home:""} onChange={function(v){onUpd("home",v);}} state={hasOff?(+pred.home===+off.home?"ok":"err"):null} readOnly={locked}/>
        <span style={{color:C.border2,fontSize:13,fontFamily:mono}}>-</span>
        <ScoreBox value={pred.away!=null?pred.away:""} onChange={function(v){onUpd("away",v);}} state={hasOff?(+pred.away===+off.away?"ok":"err"):null} readOnly={locked}/>
      </div>
      <span style={{flex:1,fontSize:14,color:C.text,fontWeight:700,textAlign:"right",lineHeight:1.3}}>{match.away}</span>
    </div>
    {hasOff&&<div style={{marginTop:8,paddingTop:8,borderTop:b(C.border),display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{color:C.sub,fontSize:11}}>Oficial: <b style={{color:C.text,fontSize:13,fontWeight:700}}>{off.home}-{off.away}</b></span>
      {oR&&pR&&<div style={{display:"flex",gap:4}}>
        {[["L","H"],["E","D"],["V","A"]].map(function(pair){
          var lbl=pair[0],code=pair[1];
          var isOff=oR===code,isPred=pR===code;
          var borderCol=isOff&&isPred?C.green:isOff?C.green:isPred?C.red:"rgba(255,255,255,0.1)";
          var bgCol=isOff&&isPred?"rgba(76,223,154,0.15)":isOff?"rgba(76,223,154,0.08)":isPred?"rgba(224,92,106,0.15)":"transparent";
          var txtCol=isOff?C.green:isPred?C.red:C.sub2;
          return <div key={lbl} style={{width:24,height:24,borderRadius:5,border:"1.5px solid "+borderCol,background:bgCol,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:mono,color:txtCol}}>{lbl}</div>;
        })}
      </div>}
    </div>}
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
          var stats=calcUserStats(r.data||[],offMap,extrasMap[m.user_id],offExtras);
          return{nick:m.profiles&&(m.profiles.nick||"?")||"?",nombre:m.profiles&&m.profiles.nombre||"",pts:stats.pts,exactMatches:stats.exactMatches,exactSlotsR32:stats.exactSlotsR32,goalsDiff:stats.goalsDiff,uid:m.user_id};
        });
      })).then(function(res){
        var sorted=res.sort(tiebreakCompare);
        setRanking(markTies(sorted));
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
          <span style={{width:28,fontSize:i<3?20:14,fontWeight:i<3?400:700,textAlign:"center",flexShrink:0,color:i===0?C.gold:i===1?"#C0C0C0":i===2?"#CD7F32":C.accentS}} dangerouslySetInnerHTML={{__html:i<3?medals[i]:(i+1)+"."}}/>
          <Ava name={r.nick} size={32}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:isMine?600:400,color:isMine?C.accentS:C.text}}>{r.nick}{r.tied&&<span title="Empatado en puntos — desempate por criterios" style={{marginLeft:6,fontSize:11,color:C.gold,fontWeight:700}}>=</span>}</div>
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
  const [official,setOfficial]=useState({});
  const [mainTab,setMainTab]=useState("grupos");
  const [ag,setAg]=useState("A");
  const [koPhase,setKoPhase]=useState("r32");
  var koPhaseLabels={r32:"16avos",r16:"Octavos",qf:"Cuartos",sf:"Semis","3rd":"3/4",f:"Final"};
  var koPhaseList=["r32","r16","qf","sf","3rd","f"];
  useEffect(function(){
    Promise.all([
      supabase.from("predictions").select("*").eq("user_id",user.user_id).eq("group_id",group.id),
      supabase.from("official_results").select("*"),
    ]).then(function(results){
      var predMap={};(results[0].data||[]).forEach(function(x){predMap[x.match_id]=x;});setPreds(predMap);
      var offMap={};(results[1].data||[]).forEach(function(r){offMap[r.match_id]=r;});setOfficial(offMap);
    });
  },[]);
  var name=user.profiles&&(user.profiles.nick||user.profiles.nombre)||"?";
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,overflowY:"auto"}}>
    <div style={{background:C.bg,minHeight:"100%",maxWidth:480,margin:"0 auto"}}>
      <Bar title={"Planilla de "+name} onBack={onClose}/>
      <Tabs items={[{id:"grupos",label:"Grupos"},{id:"cruces",label:"Cruces"}]} active={mainTab} onSelect={setMainTab}/>
      {mainTab==="grupos"&&<>
        <Tabs items={Object.keys(GROUPS).map(function(g){return{id:g,label:g};})} active={ag} onSelect={setAg} small/>
        <div style={{padding:"10px 14px 40px"}}>
          {GROUP_MATCHES.filter(function(m){return m.group===ag;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);}).map(function(m){
            return <PredMatchCard key={m.id} match={m} pred={preds[m.id]||{}} off={official[m.id]||{}} onUpd={function(){}} locked={true}/>;
          })}
        </div>
      </>}
      {mainTab==="cruces"&&<>
        <div style={{display:"flex",overflowX:"auto",gap:6,padding:"10px 14px 0",scrollbarWidth:"none"}}>
          {koPhaseList.map(function(p){
            return <button key={p} onClick={function(){setKoPhase(p);}} style={{padding:"8px 14px",borderRadius:20,border:koPhase===p?b(C.accentS):b(C.border),background:koPhase===p?"rgba(0,200,224,0.1)":C.surface,color:koPhase===p?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,whiteSpace:"nowrap"}}>{koPhaseLabels[p]}</button>;
          })}
        </div>
        <div style={{padding:"12px 14px 40px"}}>
          {KO_SLOTS.filter(function(s){return s.phase===koPhase;}).map(function(slot){
            return <KOMatchCard key={slot.id} slot={slot} pred={preds[slot.id]||{}} off={official[slot.id]||{}} onUpd={function(){}} preds={preds} setPreds={setPreds} locked={true} allOfficial={official}/>;
          })}
        </div>
      </>}
    </div>
  </div>;
}

function AdminView({ctx}){
  var signOut=ctx.signOut,toast$=ctx.toast$,profile=ctx.profile;
  var isSuperAdmin=profile&&profile.nick==="superadmin";
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
    var clean=function(v){return(v===""||v==null||(typeof v==="string"&&v.trim()===""))?null:v;};var cleanNum=function(v){var c=clean(v);return c==null?null:parseInt(c,10);};var rows=Object.values(official).map(function(r){return{match_id:r.match_id,home:cleanNum(r.home),away:cleanNum(r.away),winner:clean(r.winner),pen_home:cleanNum(r.pen_home),pen_away:cleanNum(r.pen_away),home_team:clean(r.home_team),away_team:clean(r.away_team)};});
    Promise.all([
      supabase.from("official_results").upsert(rows,{onConflict:"match_id"}),
      supabase.from("official_extras").upsert({id:1,champion:officialExtras.champion||null,runner_up:officialExtras.runner_up||null,third:officialExtras.third||null,fourth:officialExtras.fourth||null},{onConflict:"id"}),
      supabase.from("groups").update({updated_at:new Date().toISOString()}).not("id","is",null),
    ]).then(function(results){
      setSaving(false);
      var errors=results.filter(function(r){return r.error;}).map(function(r){return r.error.message;});
      if(errors.length>0){toast$("Error: "+errors[0],"err");}
      else{toast$("Guardado");}
    });
  }
  const [koPhase,setKoPhase]=useState("r32");
  const [resultPhase,setResultPhase]=useState("grupos");

  var sortedGroupMatches=GROUP_MATCHES.filter(function(m){return m.group===ag;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);});
  var koPhaseLabels={r32:"16avos",r16:"Octavos",qf:"Cuartos",sf:"Semis","3rd":"3/4",f:"Final"};
  var koPhaseList=["r32","r16","qf","sf","3rd","f"];
  var koSlots=KO_SLOTS.filter(function(s){return s.phase===koPhase;});

  return <div style={{minHeight:"100vh"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:b(C.border)}}>
      <div style={Object.assign({},gradText,{fontSize:15,fontWeight:700})}>Panel Admin</div>
      <IconBtn onClick={signOut}>&#9211;</IconBtn>
    </div>
    <Tabs items={[{id:"results",label:"Resultados"},{id:"extras_admin",label:"Extras"},{id:"groups_admin",label:"Grupos"},{id:"usuarios",label:"Usuarios"},{id:"contacts",label:"Contactos"+(contactRequests.length>0?" ("+contactRequests.length+")":"")},...(isSuperAdmin?[{id:"stats_admin",label:"Stats"}]:[])]} active={tab} onSelect={setTab}/>

    {tab==="results"&&<>
      <div style={{display:"flex",gap:0,borderBottom:b(C.border)}}>
        {["grupos","eliminatorias"].map(function(p){
          return <button key={p} onClick={function(){setResultPhase(p);}} style={{flex:1,padding:"10px",border:"none",borderBottom:resultPhase===p?b2(C.accentS):"2px solid transparent",background:"none",color:resultPhase===p?C.accentS:C.sub,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:font,textTransform:"capitalize"}}>{p==="grupos"?"Fase de Grupos":"Fase Eliminatoria"}</button>;
        })}
      </div>

      {resultPhase==="grupos"&&<>
        <Tabs items={Object.keys(GROUPS).map(function(g){return{id:g,label:g};})} active={ag} onSelect={setAg} small/>
        <div style={{padding:"10px 14px 100px"}}>
          {sortedGroupMatches.map(function(m){
            return <div key={m.id} style={Object.assign({},card,{marginBottom:10})}>
              <div style={{fontSize:10,color:C.sub2,marginBottom:8}}>{fmtDate(m.date)} - {m.time} hs - {m.venue}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{flex:1,fontSize:13,color:C.text}}>{m.home}</span>
                <ScoreBox value={official[m.id]&&official[m.id].home!=null?official[m.id].home:""} onChange={function(v){upd(m.id,"home",v);}}/>
                <span style={{color:C.border2,fontSize:13,fontFamily:mono}}>-</span>
                <ScoreBox value={official[m.id]&&official[m.id].away!=null?official[m.id].away:""} onChange={function(v){upd(m.id,"away",v);}}/>
                <span style={{flex:1,fontSize:13,color:C.text,textAlign:"right"}}>{m.away}</span>
              </div>
            </div>;
          })}
        </div>
      </>}

      {resultPhase==="eliminatorias"&&<>
        <div style={{display:"flex",overflowX:"auto",gap:6,padding:"10px 14px 0",scrollbarWidth:"none"}}>
          {koPhaseList.map(function(p){
            return <button key={p} onClick={function(){setKoPhase(p);}} style={{padding:"8px 14px",borderRadius:20,border:koPhase===p?b(C.accentS):b(C.border),background:koPhase===p?"rgba(0,200,224,0.1)":C.surface,color:koPhase===p?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,whiteSpace:"nowrap"}}>{koPhaseLabels[p]}</button>;
          })}
        </div>
        <div style={{padding:"10px 14px 100px"}}>
          {koSlots.map(function(slot){
            return <KOMatchCard
              key={slot.id}
              slot={slot}
              pred={official[slot.id]||{}}
              off={{}}
              onUpd={upd}
              preds={official}
              setPreds={setOfficial}
              locked={false}
              scoresForCalc={official}
              isAdmin={true}
              allOfficial={official}
            />;
          })}
        </div>
      </>}

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

    {tab==="usuarios"&&<AdminUsersTab toast$={toast$}/>}

    {tab==="stats_admin"&&isSuperAdmin&&<AdminStatsTab/>}
    {tab==="contacts"&&<div style={{padding:"12px 14px 40px"}}>
      {contactRequests.length===0&&<p style={{color:C.sub,textAlign:"center",marginTop:24}}>Sin solicitudes pendientes</p>}
      {contactRequests.map(function(c){
        function resolve(){
          supabase.rpc("admin_resolve_contact",{contact_id:c.id}).then(function(r){
            if(r.error){return;}
            setContactRequests(function(p){return p.filter(function(x){return x.id!==c.id;});});
          });
        }
        return <div key={c.id} style={Object.assign({},card,{marginBottom:10})}>
          <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>{c.nombre}</div>
          {c.nick&&<div style={{fontSize:12,color:C.sub2,marginBottom:4}}>Nick/email: {c.nick}</div>}
          {c.telefono&&<div style={{fontSize:12,color:C.accentS,marginBottom:6}}>📞 <a href={"tel:"+(c.telefono||"").replace(/\s/g,"")} style={{color:C.accentS,textDecoration:"none",fontWeight:600}}>{c.telefono}</a></div>}
          <div style={{fontSize:13,color:C.sub,lineHeight:1.5}}>{c.motivo}</div>
          <div style={{fontSize:10,color:C.sub,marginTop:6,marginBottom:10}}>{new Date(c.created_at).toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires"})}</div>
          <button onClick={resolve} style={{width:"100%",padding:"8px",borderRadius:8,border:b(C.green),background:"rgba(76,223,154,0.05)",color:C.green,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>&#10003; Marcar como resuelto</button>
        </div>;
      })}
    </div>}
  </div>;
}

function AdminUsersTab({toast$}){
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);
  const [showReset,setShowReset]=useState(false);
  const [viewPlanilla,setViewPlanilla]=useState(null);
  const [query,setQuery]=useState("");
  const [realizado,setRealizado]=useState(function(){
    try{return JSON.parse(localStorage.getItem("pw_realizado")||"[]");}catch(e){return[];}
  });

  useEffect(function(){
    supabase.from("profiles").select("id,nick,nombre,email,is_admin,created_at,group_members(group_id,groups(id,name))").order("nick",{ascending:true}).then(function(r){
      setUsers(r.data||[]);
      setLoading(false);
    });
  },[]);

  function toggleRealizado(uid){
    setRealizado(function(prev){
      var next=prev.includes(uid)?prev.filter(function(x){return x!==uid;}):[...prev,uid];
      localStorage.setItem("pw_realizado",JSON.stringify(next));
      return next;
    });
  }

  var filtered=users.filter(function(u){
    if(u.nick==="superadmin") return false;
    if(!query) return true;
    var q=query.toLowerCase();
    return (u.nick&&u.nick.toLowerCase().includes(q))||(u.nombre&&u.nombre.toLowerCase().includes(q));
  });

  return <div style={{padding:"12px 14px 40px"}}>
    <input style={Object.assign({},inp,{marginBottom:12})} placeholder="Buscar por nick o nombre..." value={query} onChange={function(e){setQuery(e.target.value);}}/>
    <div style={{fontSize:11,color:C.sub2,marginBottom:10}}>{filtered.length} usuario{filtered.length!==1?"s":""}</div>
    {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:24}}>Cargando...</p>}
    {filtered.map(function(u){
      var done=realizado.includes(u.id);
      var grupo=u.group_members&&u.group_members[0]&&u.group_members[0].groups;
      return <div key={u.id} style={Object.assign({},card,{marginBottom:8})}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <Ava name={u.nick||u.nombre} size={34}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:done?C.sub:C.text}}>{u.nick||u.nombre}</div>
            {u.nombre&&u.nick&&<div style={{fontSize:11,color:C.sub,marginTop:1}}>{u.nombre}</div>}
            {grupo&&<div style={{fontSize:10,color:C.accentS,marginTop:1}}>Grupo: {grupo.name}</div>}
          </div>
          <button onClick={function(){setSelected(u);setShowReset(true);}} style={{background:"none",border:b(C.border2),color:C.accentS,borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font}}>Reset pw</button>
        </div>
        <div style={{display:"flex",gap:6}}>
          {grupo&&<button onClick={function(){setViewPlanilla({user_id:u.id,profiles:{nick:u.nick,nombre:u.nombre}});}} style={{flex:1,padding:"7px",borderRadius:8,border:b(C.border),background:"none",color:C.sub2,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font}}>Ver planilla</button>}
          <button onClick={function(){toggleRealizado(u.id);}} style={{flex:1,padding:"7px",borderRadius:8,border:done?b(C.green):b(C.border),background:done?"rgba(76,223,154,0.08)":"transparent",color:done?C.green:C.sub,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font}}>
            {done?"✓ Realizado":"Marcar realizado"}
          </button>
        </div>
      </div>;
    })}
    {showReset&&selected&&<ResetPasswordModal user={selected} onClose={function(){setShowReset(false);setSelected(null);}} toast$={toast$}/>}
    {viewPlanilla&&<ViewUserPredModal user={viewPlanilla} group={users.find(function(u){return u.id===viewPlanilla.user_id;})&&users.find(function(u){return u.id===viewPlanilla.user_id;}).group_members&&users.find(function(u){return u.id===viewPlanilla.user_id;}).group_members[0]&&users.find(function(u){return u.id===viewPlanilla.user_id;}).group_members[0].groups} onClose={function(){setViewPlanilla(null);}}/>}
  </div>;
}

function ResetPasswordModal({user,onClose,toast$}){
  const [newPw,setNewPw]=useState("");
  const [loading,setLoading]=useState(false);
  const [showPw,setShowPw]=useState(false);

  function sendEmail(){
    setLoading(true);
    supabase.auth.resetPasswordForEmail(user.email,{redirectTo:"https://baprode-mundial.vercel.app"}).then(function(){
      toast$("Email enviado a "+user.email);
      setLoading(false);
      onClose();
    });
  }

  function setDirectPw(){
    if(!newPw||newPw.length<6) return toast$("Minimo 6 caracteres","err");
    setLoading(true);
    supabase.rpc("admin_reset_password",{target_user_id:user.id,new_password:newPw}).then(function(r){
      if(r.error){toast$(r.error.message,"err");setLoading(false);return;}
      toast$("Contrasena actualizada");
      setLoading(false);
      onClose();
    });
  }

  function copyMsg(){
    if(!newPw) return toast$("Escribi la contrasena primero","err");
    var msg="Hola "+( user.nick||user.nombre)+"! Tu contrasena de Baprode fue restablecida. Tu nueva contrasena es: "+newPw+" — Ingresa con tu nick y esta contrasena. Podes cambiarla desde \"Olvide mi contrasena\" cuando quieras.";
    navigator.clipboard.writeText(msg);
    toast$("Mensaje copiado");
  }

  return <Modal title={"Reset: "+(user.nick||user.nombre)} onClose={onClose}>
    <div style={{marginBottom:16,padding:"10px 12px",background:C.surface2,borderRadius:8,border:b(C.border)}}>
      <div style={{fontSize:11,color:C.sub}}>Email del usuario</div>
      <div style={{fontSize:13,color:C.text,marginTop:2}}>{user.email}</div>
    </div>

    <div style={{marginBottom:16}}>
      <div style={{fontSize:12,color:C.sub2,fontWeight:600,marginBottom:8}}>OPCION A — Enviar email de recuperacion</div>
      <p style={{fontSize:11,color:C.sub,margin:"0 0 10px",lineHeight:1.5}}>Le llega un link al email. El usuario cambia su propia contrasena.</p>
      <Btn2 onClick={sendEmail} disabled={loading}>Enviar email a {user.email}</Btn2>
    </div>

    <div style={{borderTop:b(C.border),paddingTop:16}}>
      <div style={{fontSize:12,color:C.sub2,fontWeight:600,marginBottom:8}}>OPCION B — Poner contrasena directamente</div>
      <p style={{fontSize:11,color:C.sub,margin:"0 0 10px",lineHeight:1.5}}>Para cuando el usuario no puede acceder al email.</p>
      <div style={{position:"relative",marginBottom:10}}>
        <input
          type={showPw?"text":"password"}
          style={Object.assign({},inp,{paddingRight:44})}
          placeholder="Nueva contrasena (min 6 caracteres)"
          value={newPw}
          onChange={function(e){setNewPw(e.target.value);}}
        />
        <button onClick={function(){setShowPw(function(p){return !p;});}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.sub2,fontSize:13,fontFamily:font}}>{showPw?"Ocultar":"Ver"}</button>
      </div>
      <GradBtn onClick={setDirectPw} disabled={loading||!newPw}>{loading?"Guardando...":"Establecer contrasena"}</GradBtn>
      {newPw&&<div style={{marginTop:10}}><Btn2 onClick={copyMsg}>Copiar mensaje para el usuario</Btn2></div>}
    </div>
  </Modal>;
}

function AdminGroupsTab({toast$}){
  const [groups,setGroups]=useState([]);
  const [selectedGroup,setSelectedGroup]=useState(null);
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
      var count=g.group_members&&g.group_members[0]&&g.group_members[0].count||0;
      return <div key={g.id} style={Object.assign({},card,{marginBottom:10})}>
        <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600,color:C.text}}>{g.name}</div>
            <div style={{fontSize:11,color:C.sub,marginTop:2}}>{count}/{g.max_members} miembros · Clave: {g.join_code||"—"}</div>
          </div>
          <button onClick={function(){setSelectedGroup(g);}} style={{background:"none",border:b(C.accentS),color:C.accentS,borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font}}>Ver</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:C.sub,flex:1}}>Max participantes</span>
          <input type="number" style={Object.assign({},inp,{width:70,textAlign:"center"})} defaultValue={g.max_members} onBlur={function(e){updateMax(g.id,e.target.value);}}/>
        </div>
      </div>;
    })}
    {selectedGroup&&<AdminGroupDetailModal group={selectedGroup} onClose={function(){setSelectedGroup(null);}}/>}
  </div>;
}

function AdminGroupDetailModal({group,onClose}){
  const [ranking,setRanking]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selectedUser,setSelectedUser]=useState(null);
  const [showStats,setShowStats]=useState(null);
  const [confirmRemove,setConfirmRemove]=useState(null); // {uid, nick}
  const [removing,setRemoving]=useState(false);

  function removeMember(uid){
    setRemoving(true);
    supabase.rpc("admin_remove_member",{target_user_id:uid,target_group_id:group.id}).then(function(res){
      setRemoving(false);
      if (res.error){
        alert("No se pudo sacar al miembro: "+res.error.message);
        return;
      }
      setRanking(function(prev){return prev.filter(function(r){return r.uid!==uid;});});
      setConfirmRemove(null);
    });
  }

  useEffect(function(){
    Promise.all([
      supabase.from("official_results").select("*"),
      supabase.from("group_members").select("user_id,role,profiles(id,nick,nombre)").eq("group_id",group.id),
      supabase.from("prediction_extras").select("*").eq("group_id",group.id),
      supabase.from("official_extras").select("*").single(),
    ]).then(function(results){
      var offMap={};(results[0].data||[]).forEach(function(r){offMap[r.match_id]=r;});
      var members=results[1].data||[];
      var extrasMap={};(results[2].data||[]).forEach(function(e){extrasMap[e.user_id]=e;});
      var offExtras=results[3].data;
      Promise.all(members.map(function(m){
        return supabase.from("predictions").select("*").eq("user_id",m.user_id).eq("group_id",group.id).then(function(r){
          var stats=calcUserStats(r.data||[],offMap,extrasMap[m.user_id],offExtras);
          var hasPlanilla=(r.data||[]).length>0;
          return{nick:m.profiles&&(m.profiles.nick||"?")||"?",nombre:m.profiles&&m.profiles.nombre||"",pts:stats.pts,exactMatches:stats.exactMatches,exactSlotsR32:stats.exactSlotsR32,goalsDiff:stats.goalsDiff,uid:m.user_id,role:m.role,hasPlanilla:hasPlanilla,profiles:m.profiles};
        });
      })).then(function(res){
        setRanking(markTies(res.sort(tiebreakCompare)));
        setLoading(false);
      });
    });
  },[]);

  var medals=["🥇","🥈","🥉"];
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,overflowY:"auto"}}>
    <div style={{background:C.bg,minHeight:"100%",maxWidth:480,margin:"0 auto"}}>
      <Bar title={group.name} onBack={onClose}/>
      <div style={{margin:"12px 16px",background:"rgba(0,200,224,0.05)",borderRadius:10,padding:"10px 14px",border:b("rgba(0,200,224,0.2)"),display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:C.sub,letterSpacing:0.5,textTransform:"uppercase"}}>Clave del grupo</div>
          <div style={{fontSize:20,fontWeight:700,color:C.accentS,fontFamily:mono,letterSpacing:4,marginTop:2}}>{group.join_code||"—"}</div>
        </div>
        <div style={{fontSize:12,color:C.sub}}>{ranking.length}/{group.max_members} miembros</div>
      </div>
      <div style={{padding:"0 16px 40px"}}>
        <SectionLabel>Ranking</SectionLabel>
        {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:16}}>Calculando...</p>}
        {ranking.map(function(r,i){
          return <div key={r.uid} style={Object.assign({},card,{marginBottom:8,borderLeft:i<3?b3(C.accentS):b3(C.border)})}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{width:28,fontSize:i<3?20:14,fontWeight:i<3?400:700,textAlign:"center",flexShrink:0,color:i===0?C.gold:i===1?"#C0C0C0":i===2?"#CD7F32":C.accentS}}>{i<3?medals[i]:(i+1)+"."}</span>
              <Ava name={r.nick} size={32}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:C.text,display:"flex",alignItems:"center",gap:6}}>
                  {r.nick}
                  {r.hasPlanilla&&<span style={{color:C.green,fontSize:12}}>✓</span>}
                  {r.role==="admin"&&<span style={{fontSize:9,color:C.gold,background:"rgba(255,208,96,0.1)",padding:"1px 6px",borderRadius:8,border:"1px solid rgba(255,208,96,0.2)"}}>Admin</span>}
                </div>
                {r.nombre&&<div style={{fontSize:11,color:C.sub,marginTop:1}}>({r.nombre})</div>}
              </div>
              <span style={{fontFamily:mono,fontSize:18,fontWeight:700,color:C.text}}>{r.pts}<span style={{fontSize:10,color:C.sub,marginLeft:3}}>pts</span></span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={function(){setSelectedUser({user_id:r.uid,profiles:r.profiles});}} style={{flex:1,padding:"7px",borderRadius:8,border:b(C.border),background:"none",color:C.sub2,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font}}>Ver planilla</button>
              <button onClick={function(){setShowStats({uid:r.uid,nick:r.nick});}} style={{flex:1,padding:"7px",borderRadius:8,border:b(C.border),background:"none",color:C.green,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font}}>Ver stats</button>
              <button onClick={function(){setConfirmRemove({uid:r.uid,nick:r.nick});}} style={{flex:1,padding:"7px",borderRadius:8,border:b("rgba(224,92,106,0.4)"),background:"none",color:C.red,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font}}>Sacar</button>
            </div>
          </div>;
        })}
      </div>
    </div>
    {selectedUser&&<ViewUserPredModal user={selectedUser} group={group} onClose={function(){setSelectedUser(null);}}/>}
    {showStats&&<AdminUserStatsModal uid={showStats.uid} nick={showStats.nick} group={group} onClose={function(){setShowStats(null);}}/>}
    {confirmRemove&&<Modal title="Sacar del grupo" onClose={function(){if(!removing)setConfirmRemove(null);}}>
      <p style={{color:C.text,fontSize:14,lineHeight:1.6,marginBottom:12,textAlign:"center"}}>¿Sacar a <b>{confirmRemove.nick}</b> del grupo?</p>
      <p style={{color:C.sub,fontSize:12,lineHeight:1.5,marginBottom:16,textAlign:"center"}}>Esto borra todas sus predicciones, extras y membresía de este grupo. No se puede deshacer.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button disabled={removing} onClick={function(){removeMember(confirmRemove.uid);}} style={{width:"100%",padding:"12px",borderRadius:12,border:b(C.red),cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:font,background:C.red,color:"#fff",opacity:removing?0.6:1}}>{removing?"Sacando...":"Sí, sacar"}</button>
        <Btn2 onClick={function(){if(!removing)setConfirmRemove(null);}}>Cancelar</Btn2>
      </div>
    </Modal>}
  </div>;
}

function AdminUserStatsModal({uid,nick,group,onClose}){
  const [stats,setStats]=useState(null);
  useEffect(function(){
    Promise.all([
      supabase.from("predictions").select("*").eq("user_id",uid).eq("group_id",group.id),
      supabase.from("official_results").select("*"),
      supabase.from("prediction_extras").select("*").eq("user_id",uid).eq("group_id",group.id).maybeSingle(),
      supabase.from("official_extras").select("*").single(),
    ]).then(function(r){
      var preds=r[0].data||[];
      var offMap={};(r[1].data||[]).forEach(function(x){offMap[x.match_id]=x;});
      var extras=r[2]&&r[2].data;
      var offExtras=r[3]&&r[3].data;

      // Stats con desempate (Paso 3)
      var ds=calcUserStats(preds,offMap,extras,offExtras);

      // Stats legacy (racha y % de acierto): se mantiene la lógica vieja por compatibilidad visual
      var total=preds.length,exact=0,result=0,played=0,bestStreak=0,curStreak=0;
      preds.sort(function(a,b){return (a.match_id||"").localeCompare(b.match_id||"");});
      preds.forEach(function(p){
        var off=offMap[p.match_id];
        if(!off||off.home==null||off.home==="") return;
        played++;
        var oh=+off.home,oa=+off.away,ph=+p.home,pa=+p.away;
        if(isNaN(oh)||isNaN(oa)||isNaN(ph)||isNaN(pa)) return;
        if(ph===oh&&pa===oa){exact++;curStreak++;if(curStreak>bestStreak)bestStreak=curStreak;}
        else{
          var oR=oh>oa?"H":oh<oa?"A":"D",pR=ph>pa?"H":ph<pa?"A":"D";
          if(oR===pR){result++;curStreak++;if(curStreak>bestStreak)bestStreak=curStreak;}
          else curStreak=0;
        }
      });
      setStats({total:total,played:played,exactMatches:ds.exactMatches,result:result,totalPts:ds.pts,bestStreak:bestStreak,pct:played?Math.round(((exact+result)/played)*100):0,exactSlotsR32:ds.exactSlotsR32,goalsDiff:ds.goalsDiff});
    });
  },[]);
  return <Modal title={"Stats: "+nick} onClose={onClose}>
    {!stats&&<p style={{color:C.sub,textAlign:"center"}}>Cargando...</p>}
    {stats&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between"})}><span style={{color:C.sub,fontSize:13}}>Predicciones cargadas</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.total}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between"})}><span style={{color:C.sub,fontSize:13}}>Partidos jugados</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.played}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.green)})}><span style={{color:C.sub,fontSize:13}}>Marcadores exactos</span><span style={{color:C.green,fontWeight:700,fontFamily:mono}}>{stats.exactMatches}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.accentS)})}><span style={{color:C.sub,fontSize:13}}>Resultado correcto</span><span style={{color:C.accentS,fontWeight:700,fontFamily:mono}}>{stats.result}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.gold)})}><span style={{color:C.sub,fontSize:13}}>Total puntos</span><span style={{color:C.gold,fontWeight:700,fontFamily:mono}}>{stats.totalPts}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between"})}><span style={{color:C.sub,fontSize:13}}>Mejor racha</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.bestStreak}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between"})}><span style={{color:C.sub,fontSize:13}}>% acierto</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.pct}%</span></div>
      <div style={{borderTop:b(C.border),paddingTop:8,marginTop:4}}>
        <div style={{fontSize:10,color:C.sub2,letterSpacing:0.5,textTransform:"uppercase",marginBottom:6,padding:"0 4px"}}>Desempate</div>
        <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.gold),marginBottom:8})}><span style={{color:C.sub,fontSize:13}}>Ubicaciones R32 exactas</span><span style={{color:C.gold,fontWeight:700,fontFamily:mono}}>{stats.exactSlotsR32}</span></div>
        <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.sub2)})}><span style={{color:C.sub,fontSize:13}}>Diferencia goles vs oficial</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.goalsDiff}</span></div>
      </div>
    </div>}
  </Modal>;
}

function FixtureView({ctx}){
  var setView=ctx.setView,activeGroup=ctx.activeGroup;
  const [tab,setTab]=useState("groups");
  const [ag,setAg]=useState("A");
  const [koPhase,setKoPhase]=useState("r32");
  const [official,setOfficial]=useState({});
  const [loading,setLoading]=useState(true);

  useEffect(function(){
    supabase.from("official_results").select("*").then(function(r){
      var map={};(r.data||[]).forEach(function(x){map[x.match_id]=x;});setOfficial(map);setLoading(false);
    });
  },[]);

  function back(){if(activeGroup) setView("group"); else setView("groups_list");}

  var sortedMatches=GROUP_MATCHES.filter(function(m){return m.group===ag;}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time);});

  var koSlots=KO_SLOTS.filter(function(s){return s.phase===koPhase;});
  var koPhaseLabels={r32:"16avos",r16:"Octavos",qf:"Cuartos",sf:"Semis","3rd":"3/4",f:"Final"};
  var koPhaseList=["r32","r16","qf","sf","3rd","f"];

  return <div style={{minHeight:"100vh"}}>
    <Bar title="Fixture completo" onBack={back}/>
    <div style={{padding:"12px 14px 0",display:"flex",gap:8}}>
      <button onClick={function(){setTab("groups");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="groups"?b(C.accentS):b(C.border),background:tab==="groups"?"rgba(0,200,224,0.1)":C.surface,color:tab==="groups"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Grupos</button>
      <button onClick={function(){setTab("ko");}} style={{flex:1,padding:"10px",borderRadius:10,border:tab==="ko"?b(C.accentS):b(C.border),background:tab==="ko"?"rgba(0,200,224,0.1)":C.surface,color:tab==="ko"?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font}}>Eliminatoria</button>
    </div>

    {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:32}}>Cargando...</p>}

    {!loading&&tab==="groups"&&<>
      <Tabs items={Object.keys(GROUPS).map(function(g){return {id:g,label:g};})} active={ag} onSelect={setAg} small/>
      <div style={{padding:"10px 14px 40px"}}>
        {sortedMatches.map(function(m){
          var off=official[m.id];
          var played=off&&off.home!=null&&off.home!=="";
          return <div key={m.id} style={Object.assign({},card,{padding:"10px 12px",marginBottom:6,borderLeft:played?b3(C.accentS):b3(C.border)})}>
            <div style={{fontSize:9,color:C.sub2,marginBottom:4}}>{fmtDate(m.date)} - {m.time} hs - {m.venue}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{flex:1,fontSize:13,color:C.text,fontWeight:played?600:400}}>{m.home}</span>
              <div style={{minWidth:60,textAlign:"center",background:played?C.surface2:"transparent",borderRadius:6,padding:played?"3px 10px":"2px 10px",border:played?b(C.border):"none"}}>
                {played?<span style={{fontFamily:mono,fontSize:17,fontWeight:800,color:C.text}}>{off.home} - {off.away}</span>:<span style={{color:C.sub,fontSize:12}}>vs</span>}
              </div>
              <span style={{flex:1,fontSize:13,color:C.text,fontWeight:played?600:400,textAlign:"right"}}>{m.away}</span>
            </div>
          </div>;
        })}
        <StandingsTable group={ag} scores={official}/>
      </div>
    </>}

    {!loading&&tab==="ko"&&<>
      <div style={{display:"flex",overflowX:"auto",gap:6,padding:"10px 14px 0",scrollbarWidth:"none"}}>
        {koPhaseList.map(function(p){
          return <button key={p} onClick={function(){setKoPhase(p);}} style={{padding:"8px 14px",borderRadius:20,border:koPhase===p?b(C.accentS):b(C.border),background:koPhase===p?"rgba(0,200,224,0.1)":C.surface,color:koPhase===p?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,whiteSpace:"nowrap"}}>{koPhaseLabels[p]}</button>;
        })}
      </div>
      <div style={{padding:"12px 14px 40px"}}>
        {koSlots.map(function(s){
          var off=official[s.id];
          var played=off&&off.home!=null&&off.home!=="";
          return <div key={s.id} style={Object.assign({},card,{marginBottom:10,borderLeft:played?b3(C.accentS):b3(C.border)})}>
            <div style={{fontSize:10,color:C.sub2,marginBottom:6}}>{s.label} - {fmtDate(s.date)} - {s.time} hs - {s.venue}</div>
            {(off&&(off.home_team||off.away_team))?<>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <span style={{flex:1,fontSize:14,color:C.text,fontWeight:600}}>{off.home_team||"?"}</span>
                <div style={{minWidth:70,textAlign:"center",background:C.surface2,borderRadius:8,padding:"6px 12px",border:b(C.border)}}>
                  {played?<span style={{fontFamily:mono,fontSize:20,fontWeight:800,color:C.text}}>{off.home}-{off.away}</span>:<span style={{color:C.sub,fontSize:14}}>vs</span>}
                </div>
                <span style={{flex:1,fontSize:14,color:C.text,fontWeight:600,textAlign:"right"}}>{off.away_team||"?"}</span>
              </div>
              {played&&off.pen_home!=null&&off.pen_home!==""&&<div style={{fontSize:11,color:C.gold,marginTop:6,textAlign:"center"}}>Penales: {off.pen_home}-{off.pen_away}</div>}
            </>:<div style={{fontSize:12,color:C.sub,marginTop:4}}>Por jugar</div>}
          </div>;
        })}
      </div>
    </>}
  </div>;
}

function StatsModal({profile,group,onClose}){
  const [stats,setStats]=useState(null);
  useEffect(function(){
    Promise.all([
      supabase.from("predictions").select("*").eq("user_id",profile.id).eq("group_id",group.id),
      supabase.from("official_results").select("*"),
      supabase.from("prediction_extras").select("*").eq("user_id",profile.id).eq("group_id",group.id).maybeSingle(),
      supabase.from("official_extras").select("*").single(),
    ]).then(function(r){
      var preds=r[0].data||[];
      var offMap={};(r[1].data||[]).forEach(function(x){offMap[x.match_id]=x;});
      var extras=r[2]&&r[2].data;
      var offExtras=r[3]&&r[3].data;

      // Stats con desempate
      var ds=calcUserStats(preds,offMap,extras,offExtras);

      // Stats legacy para racha y % de acierto
      var total=preds.length,exact=0,result=0,played=0,bestStreak=0,curStreak=0;
      preds.sort(function(a,b){return (a.match_id||"").localeCompare(b.match_id||"");});
      preds.forEach(function(p){
        var off=offMap[p.match_id];
        if(!off||off.home==null||off.home==="") return;
        played++;
        var oh=+off.home,oa=+off.away,ph=+p.home,pa=+p.away;
        if(isNaN(oh)||isNaN(oa)||isNaN(ph)||isNaN(pa)) return;
        if(ph===oh&&pa===oa){exact++;curStreak++;if(curStreak>bestStreak)bestStreak=curStreak;}
        else{
          var oR=oh>oa?"H":oh<oa?"A":"D",pR=ph>pa?"H":ph<pa?"A":"D";
          if(oR===pR){result++;curStreak++;if(curStreak>bestStreak)bestStreak=curStreak;}
          else curStreak=0;
        }
      });
      setStats({total:total,played:played,exactMatches:ds.exactMatches,result:result,totalPts:ds.pts,bestStreak:bestStreak,pct:played?Math.round(((exact+result)/played)*100):0,exactSlotsR32:ds.exactSlotsR32,goalsDiff:ds.goalsDiff});
    });
  },[]);
  return <Modal title="Mis estadisticas" onClose={onClose}>
    {!stats&&<p style={{color:C.sub,textAlign:"center"}}>Cargando...</p>}
    {stats&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between"})}><span style={{color:C.sub,fontSize:13}}>Predicciones cargadas</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.total}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between"})}><span style={{color:C.sub,fontSize:13}}>Partidos jugados</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.played}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.green)})}><span style={{color:C.sub,fontSize:13}}>Marcadores exactos</span><span style={{color:C.green,fontWeight:700,fontFamily:mono}}>{stats.exactMatches}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.accentS)})}><span style={{color:C.sub,fontSize:13}}>Resultado correcto</span><span style={{color:C.accentS,fontWeight:700,fontFamily:mono}}>{stats.result}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.gold)})}><span style={{color:C.sub,fontSize:13}}>Total puntos</span><span style={{color:C.gold,fontWeight:700,fontFamily:mono}}>{stats.totalPts}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between"})}><span style={{color:C.sub,fontSize:13}}>Mejor racha</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.bestStreak}</span></div>
      <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between"})}><span style={{color:C.sub,fontSize:13}}>% acierto</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.pct}%</span></div>
      <div style={{borderTop:b(C.border),paddingTop:8,marginTop:4}}>
        <div style={{fontSize:10,color:C.sub2,letterSpacing:0.5,textTransform:"uppercase",marginBottom:6,padding:"0 4px"}}>Desempate</div>
        <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.gold),marginBottom:8})}><span style={{color:C.sub,fontSize:13}}>Ubicaciones R32 exactas</span><span style={{color:C.gold,fontWeight:700,fontFamily:mono}}>{stats.exactSlotsR32}</span></div>
        <div style={Object.assign({},card,{display:"flex",justifyContent:"space-between",borderLeft:b3(C.sub2)})}><span style={{color:C.sub,fontSize:13}}>Diferencia goles vs oficial</span><span style={{color:C.text,fontWeight:700,fontFamily:mono}}>{stats.goalsDiff}</span></div>
      </div>
    </div>}
  </Modal>;
}

function KOBracket({preds,official,onUpd,setPreds,locked,onReglamento}){
  const [phase,setPhase]=useState("r32");
  var phaseLabels={r32:"16avos",r16:"Octavos",qf:"Cuartos",sf:"Semis","3rd":"3/4",f:"Final"};
  var phaseList=["r32","r16","qf","sf","3rd","f"];
  var slots=KO_SLOTS.filter(function(s){return s.phase===phase;});

  // Pill de leyenda: cambia según la fase activa
  // R32: verde (exacta) / amarillo (mal ubicado) / rojo (no clasificó) + marco verde matchup
  // R16+: azul (clasificó) / rojo (no clasificó) + marco verde matchup
  function legendChip(color,label){
    return <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 8px",borderRadius:14,border:"1px solid "+color,background:"transparent"}}>
      <span style={{width:10,height:10,borderRadius:"50%",background:color,display:"inline-block"}}/>
      <span style={{fontSize:10,color:C.text,fontWeight:500}}>{label}</span>
    </div>;
  }
  var isR32=phase==="r32";

  return <>
    <div style={{display:"flex",overflowX:"auto",gap:6,padding:"10px 14px 0",scrollbarWidth:"none"}}>
      {phaseList.map(function(p){
        return <button key={p} onClick={function(){setPhase(p);}} style={{padding:"8px 14px",borderRadius:20,border:phase===p?b(C.accentS):b(C.border),background:phase===p?"rgba(0,200,224,0.1)":C.surface,color:phase===p?C.accentS:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:font,whiteSpace:"nowrap"}}>{phaseLabels[p]}</button>;
      })}
    </div>

    {/* Pill de leyenda + botón Reglamento */}
    <div style={{padding:"10px 14px 0",display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
      {isR32 ? <>
        {legendChip(C.green,"Ubicación exacta")}
        {legendChip(C.gold,"Mal ubicado")}
        {legendChip(C.red,"No clasificó")}
      </> : <>
        {legendChip(C.accentB,"Clasificó")}
        {legendChip(C.red,"No clasificó")}
      </>}
      {legendChip(C.green,"Partido exacto (marco)")}
    </div>
    {onReglamento&&<div style={{padding:"8px 14px 0"}}>
      <button onClick={onReglamento} style={{width:"100%",padding:"10px",borderRadius:10,border:b(C.accentS),background:"rgba(0,200,224,0.06)",color:C.accentS,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:font}}>📖 Reglamento</button>
    </div>}

    <div style={{padding:"12px 14px 100px"}}>
      {slots.map(function(slot){
        return <KOMatchCard key={slot.id} slot={slot} pred={preds[slot.id]||{}} off={official[slot.id]||{}} onUpd={onUpd} preds={preds} setPreds={setPreds} locked={locked} allOfficial={official}/>;
      })}
    </div>
  </>;
}

// ========== CASCADA DE CAMBIOS EN BRACKET ==========
// Cuando un equipo cambia en un slot, limpia recursivamente los descendientes:
// el equipo derivado del ganador (KO_NEXT) y del perdedor (KO_LOSER_NEXT) se invalidan.
function cascadeClearDescendants(state,slotId){
  var n=Object.assign({},state);
  function clearChain(sId){
    [KO_NEXT[sId],KO_LOSER_NEXT[sId]].forEach(function(link){
      if(!link)return;
      var d=link.next;
      n[d]=Object.assign({},n[d]||{match_id:d});
      n[d][link.pos+"_team"]=null;
      n[d].home=null;n[d].away=null;
      n[d].pen_home=null;n[d].pen_away=null;
      n[d].winner=null;
      clearChain(d);
    });
  }
  clearChain(slotId);
  return n;
}

// Aplica cambio de equipo en el picker: actualiza el equipo, limpia marcadores
// del slot (matchup cambió) y propaga a todos los descendientes.
function applyTeamChange(state,slotId,pos,newTeam){
  var n=Object.assign({},state);
  n[slotId]=Object.assign({},n[slotId]||{match_id:slotId});
  n[slotId][pos+"_team"]=newTeam;
  n[slotId].home=null;n[slotId].away=null;
  n[slotId].pen_home=null;n[slotId].pen_away=null;
  n[slotId].winner=null;
  return cascadeClearDescendants(n,slotId);
}

// Cuando cambia el ganador de un slot (por marcador o por penales): propaga
// el ganador al siguiente slot vía KO_NEXT, el perdedor a 3°/4° vía KO_LOSER_NEXT,
// y limpia descendientes si cualquier equipo derivado cambió.
function applyWinnerChange(state,slotId,newWinner,homeTeam,awayTeam){
  var n=Object.assign({},state);
  n[slotId]=Object.assign({},n[slotId]||{match_id:slotId});
  n[slotId].winner=newWinner||null;
  // Propagar ganador
  if(newWinner&&KO_NEXT[slotId]){
    var nx=KO_NEXT[slotId];
    n[nx.next]=Object.assign({},n[nx.next]||{match_id:nx.next});
    var oldT=n[nx.next][nx.pos+"_team"];
    if(oldT!==newWinner){
      n[nx.next][nx.pos+"_team"]=newWinner;
      n[nx.next].home=null;n[nx.next].away=null;
      n[nx.next].pen_home=null;n[nx.next].pen_away=null;
      n[nx.next].winner=null;
      n=cascadeClearDescendants(n,nx.next);
    }
  }
  // Propagar perdedor a 3°/4°
  if(newWinner&&KO_LOSER_NEXT[slotId]){
    var loser=newWinner===homeTeam?awayTeam:(newWinner===awayTeam?homeTeam:null);
    if(loser){
      var ln=KO_LOSER_NEXT[slotId];
      n[ln.next]=Object.assign({},n[ln.next]||{match_id:ln.next});
      var oldL=n[ln.next][ln.pos+"_team"];
      if(oldL!==loser){
        n[ln.next][ln.pos+"_team"]=loser;
        n[ln.next].home=null;n[ln.next].away=null;
        n[ln.next].pen_home=null;n[ln.next].pen_away=null;
        n[ln.next].winner=null;
        n=cascadeClearDescendants(n,ln.next);
      }
    }
  }
  return n;
}

// ========== TEAM SLOT PICKER ==========
// Selector de equipo para slots de fase eliminatoria.
// - Para r32: abre modal con dropdown ordenado según los marcadores del usuario/admin.
// - Para r16+: solo lectura, muestra el equipo derivado del ganador del feeder.
// - Para 3°/4°: solo lectura, muestra el perdedor de la semi correspondiente.
function TeamSlotPicker({slotId,pos,value,onChange,scores,isAdmin,locked,colorState,showLabel}){
  const [open,setOpen]=useState(false);
  const [thirdGroupOpen,setThirdGroupOpen]=useState(null);
  var meta=KO_SLOT_META[slotId];
  if(!meta) return <input style={Object.assign({},inp,{padding:"8px 10px",fontSize:13})} value={value||""} readOnly placeholder="?"/>;
  var side=meta[pos];
  if(!side) return null;

  // showLabel default: true. Cuando marco verde activo, KOMatchCard pasa showLabel=false
  var labelVisible=showLabel!==false;

  // Mapeo de colorState a color de borde de la celda
  // "exact"    -> verde
  // "presence" en R32 -> amarillo
  // "presence" en R16+ -> azul
  // "none"     -> rojo
  // null/undefined -> borde normal
  // Para distinguir presence R32 vs R16+, le pasamos el phase implícito desde colorState directamente
  // (KOMatchCard sabe qué state es y le pasa el color final, no el state crudo)
  var stateBorder=null;
  if (colorState==="exact") stateBorder=C.green;
  else if (colorState==="presence_r32") stateBorder=C.gold;
  else if (colorState==="presence_ko") stateBorder=C.accentB;
  else if (colorState==="none") stateBorder=C.red;

  // Auto-fill: octavos en adelante (incluye final y 3°/4°)
  var isAutoFill=side.type==="winner_of"||side.type==="loser_of";
  var posDesc=slotPosLabel(side);

  if(isAutoFill){
    var autoStyle=Object.assign({},inp,{padding:"8px 10px",fontSize:13,opacity:value?1:0.5,color:value?C.text:C.sub2,fontStyle:value?"normal":"italic"});
    if (stateBorder) autoStyle.border="1.5px solid "+stateBorder;
    return <div style={{flex:1}}>
      {labelVisible&&<div style={{fontSize:9,color:C.sub,marginBottom:3}}>{posDesc.toUpperCase()}</div>}
      <div style={autoStyle}>{value||"Por definir"}</div>
    </div>;
  }

  // r32: clickeable
  function pick(team){
    onChange(team);
    setOpen(false);
    setThirdGroupOpen(null);
  }

  // Equipos ya tomados en otros slots de r32 (no incluye el equipo actual de este slot/pos)
  function getTakenTeams(){
    var taken={};
    var src=scores||{};
    Object.keys(src).forEach(function(sid){
      if(sid.indexOf("r32_")!==0)return;
      var p=src[sid]||{};
      if(sid===slotId){
        // del slot actual, solo cuenta el equipo del OTRO lado
        var otherField=pos==="home"?"away_team":"home_team";
        if(p[otherField])taken[p[otherField]]=true;
      } else {
        if(p.home_team)taken[p.home_team]=true;
        if(p.away_team)taken[p.away_team]=true;
      }
    });
    return taken;
  }
  var takenTeams=getTakenTeams();

  function renderTable(group,teams){
    var allFilled=teams[0]&&teams[0].hasAll;
    return <div>
      {isAdmin&&value&&<button onClick={function(){pick(null);}} style={{display:"flex",alignItems:"center",width:"100%",padding:"12px 14px",marginBottom:10,borderRadius:10,border:b(C.red),background:"rgba(224,92,106,0.1)",color:C.red,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:font,textAlign:"left"}}>Vaciar este equipo (dejar sin definir)</button>}
      <div style={{fontSize:11,color:allFilled?C.sub:C.gold,marginBottom:8,padding:"8px 10px",background:allFilled?"rgba(0,200,224,0.06)":"rgba(255,208,96,0.08)",borderRadius:8,border:b(allFilled?C.border:"rgba(255,208,96,0.3)")}}>
        {allFilled
          ? (isAdmin?"Según los marcadores oficiales así quedó el grupo. Pero podés elegir libremente.":"Según tu pronóstico así quedó el grupo. Pero podés elegir libremente.")
          : "Completá los pronósticos del grupo para ver el orden estimado. Mientras tanto, lista en orden original."}
      </div>
      {teams.map(function(t,i){
        var isSel=value===t.team;
        var isTaken=takenTeams[t.team]&&!isSel;
        return <button key={t.team} onClick={function(){if(!isTaken)pick(t.team);}} disabled={isTaken} style={{display:"flex",alignItems:"center",width:"100%",padding:"12px 14px",marginBottom:6,borderRadius:10,border:isSel?b(C.accentS):b(C.border),background:isSel?"rgba(0,200,224,0.1)":C.surface2,color:isTaken?C.sub2:C.text,fontSize:14,fontWeight:isSel?700:500,cursor:isTaken?"not-allowed":"pointer",fontFamily:font,textAlign:"left",gap:10,opacity:isTaken?0.35:1}}>
          <span style={{width:22,fontSize:12,color:isSel?C.accentS:C.sub2,fontWeight:700,fontFamily:mono}}>{i+1}°</span>
          <span style={{flex:1}}>{t.team}</span>
          {isTaken&&<span style={{fontSize:9,color:C.sub2,fontStyle:"italic"}}>ya elegido</span>}
          {!isTaken&&allFilled&&<span style={{fontSize:10,color:C.sub,fontFamily:mono}}>{t.pts}pts {t.gd>=0?"+":""}{t.gd}</span>}
        </button>;
      })}
    </div>;
  }

  function renderPicker(){
    if(side.type==="pos"){
      var standings=calcGroupStandings(side.group,scores);
      return renderTable(side.group,standings);
    }
    if(side.type==="third"){
      if(thirdGroupOpen){
        var standings2=calcGroupStandings(thirdGroupOpen,scores);
        return <div>
          <button onClick={function(){setThirdGroupOpen(null);}} style={{background:"none",border:"none",color:C.sub2,fontSize:13,cursor:"pointer",marginBottom:10,padding:"4px 0"}}>&larr; Volver a elegir grupo</button>
          <div style={{fontSize:12,color:C.sub,marginBottom:8}}>Grupo {thirdGroupOpen}</div>
          {renderTable(thirdGroupOpen,standings2)}
        </div>;
      }
      return <div>
        <div style={{fontSize:11,color:C.sub,marginBottom:10,padding:"8px 10px",background:"rgba(0,200,224,0.06)",borderRadius:8,border:b(C.border)}}>
          Elegí el grupo cuyo 3° clasifica a este slot. Después elegís el equipo.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:8}}>
          {side.groups.map(function(g){
            var s=calcGroupStandings(g,scores);
            var third=s[2];
            return <button key={g} onClick={function(){setThirdGroupOpen(g);}} style={{padding:"14px 10px",borderRadius:10,border:b(C.border),background:C.surface2,color:C.text,cursor:"pointer",fontFamily:font,textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:700,color:C.accentS,marginBottom:4}}>Grupo {g}</div>
              {third&&third.hasAll&&<div style={{fontSize:11,color:C.sub}}>3°: {third.team}</div>}
              {third&&!third.hasAll&&<div style={{fontSize:10,color:C.sub2,fontStyle:"italic"}}>incompleto</div>}
            </button>;
          })}
        </div>
      </div>;
    }
    return null;
  }

  return <>
    <div style={{flex:1}}>
      {labelVisible&&<div style={{fontSize:9,color:C.sub,marginBottom:3}}>{posDesc.toUpperCase()}</div>}
      <button onClick={function(){if(!locked)setOpen(true);}} disabled={locked} style={Object.assign({},inp,{padding:"8px 10px",fontSize:13,textAlign:"left",cursor:locked?"default":"pointer",color:value?C.text:C.sub2,fontFamily:font},stateBorder?{border:"1.5px solid "+stateBorder}:{})}>{value||"Elegir equipo"}</button>
    </div>
    {open&&<Modal title={posDesc} onClose={function(){setOpen(false);setThirdGroupOpen(null);}}>
      {renderPicker()}
    </Modal>}
  </>;
}


function KOMatchCard({slot,pred,off,onUpd,preds,setPreds,locked,scoresForCalc,isAdmin,allOfficial}){
  var phase=slot.phase;
  var ph=pred.home,pa=pred.away;
  var isDraw=ph!=null&&pa!=null&&ph!==""&&pa!==""&&+ph===+pa;
  var hasOff=off&&off.home!=null&&off.home!=="";
  // pred puede venir sin match_id si es objeto recién creado; lo inyectamos para que scoreKO lea KO_SLOT_META
  var predWithId=pred.match_id?pred:Object.assign({},pred,{match_id:slot.id});
  var sc=hasOff?scoreKO(predWithId,off,phase,allOfficial):null;

  // ===== Evaluación visual del slot =====
  // En el admin (isAdmin=true), las celdas no llevan colores de semáforo porque ahí
  // se EDITAN los oficiales, no se evalúa una predicción contra ellos.
  var ev=(!isAdmin && allOfficial) ? koEvalState(predWithId,phase,allOfficial) : null;
  var hasMatchup = ev && ev.hasMatchup;

  // Color del borde de cada celda de país (cuando NO hay marco verde — si lo hay, el marco manda)
  function stateToColor(state){
    if (!state) return null;
    if (hasMatchup) return null; // marco verde tapa, dejamos celdas neutras
    if (state==="exact") return "exact";
    if (state==="presence") return phase==="r32" ? "presence_r32" : "presence_ko";
    if (state==="none") return "none";
    return null;
  }
  var homeCellColor=ev?stateToColor(ev.homeState):null;
  var awayCellColor=ev?stateToColor(ev.awayState):null;

  // Estado de cada gol/penal: "ok" si coincide con el oficial matcheado (por equipo), "err" si no
  // Solo se evalúa con marco verde activo
  var homeGoalState=null, awayGoalState=null, homePenState=null, awayPenState=null;
  if (hasMatchup && ev.matchedOff){
    var phN=+(pred.home!=null && pred.home!==""?pred.home:NaN);
    var paN=+(pred.away!=null && pred.away!==""?pred.away:NaN);
    var oh=+(ev.matchedOff.home!=null && ev.matchedOff.home!==""?ev.matchedOff.home:NaN);
    var oa=+(ev.matchedOff.away!=null && ev.matchedOff.away!==""?ev.matchedOff.away:NaN);
    if (!isNaN(phN) && !isNaN(oh) && !isNaN(oa)){
      var offForPredH=ev.swapped?oa:oh;
      homeGoalState = phN===offForPredH ? "ok" : "err";
    }
    if (!isNaN(paN) && !isNaN(oh) && !isNaN(oa)){
      var offForPredA=ev.swapped?oh:oa;
      awayGoalState = paN===offForPredA ? "ok" : "err";
    }
    // Penales (solo si pred fue empate y oficial fue a penales)
    var offHasPen=ev.matchedOff.pen_home!=null && ev.matchedOff.pen_home!=="" &&
                  ev.matchedOff.pen_away!=null && ev.matchedOff.pen_away!=="";
    if (isDraw && offHasPen){
      var pphN=+(pred.pen_home!=null && pred.pen_home!==""?pred.pen_home:NaN);
      var ppaN=+(pred.pen_away!=null && pred.pen_away!==""?pred.pen_away:NaN);
      var oph=+ev.matchedOff.pen_home, opa=+ev.matchedOff.pen_away;
      if (!isNaN(pphN)){
        homePenState = pphN===(ev.swapped?opa:oph) ? "ok" : "err";
      }
      if (!isNaN(ppaN)){
        awayPenState = ppaN===(ev.swapped?oph:opa) ? "ok" : "err";
      }
    }
  }

  // showLabel: cuando hay marco verde, no mostramos "1° DEL GRUPO X" — el marco indica que el slot ya no importa
  var showLabel = !hasMatchup;

  // Cambio de equipo desde el picker (solo r32; auto-fill no llama a esto)
  function changeTeam(pos,newTeam){
    if(locked)return;
    setPreds(function(p){return applyTeamChange(p,slot.id,pos,newTeam);});
  }

  // Cambio de marcador: si hay ganador claro, propaga; en empate, espera penales
  function setScore(field,val){
    if(locked)return;
    setPreds(function(p){
      var n=Object.assign({},p);
      n[slot.id]=Object.assign({},n[slot.id]||{match_id:slot.id});
      n[slot.id][field]=val;
      var nh=field==="home"?val:n[slot.id].home;
      var na=field==="away"?val:n[slot.id].away;
      if(nh!==""&&na!==""&&nh!=null&&na!=null){
        var nhn=+nh,nan=+na;
        if(!isNaN(nhn)&&!isNaN(nan)&&nhn!==nan){
          var winner=nhn>nan?n[slot.id].home_team:n[slot.id].away_team;
          if(winner) n=applyWinnerChange(n,slot.id,winner,n[slot.id].home_team,n[slot.id].away_team);
        } else if(!isNaN(nhn)&&!isNaN(nan)&&nhn===nan){
          n[slot.id].winner=null;
        }
      }
      return n;
    });
  }

  // Selección manual de ganador (caso penales en empate)
  function pickWinner(team){
    if(locked)return;
    setPreds(function(p){
      var cur=p[slot.id]||{};
      return applyWinnerChange(p,slot.id,team,cur.home_team,cur.away_team);
    });
  }

  // Penales: ahora auto-derivan el ganador. Si ambos penales tienen valor y son distintos,
  // el ganador es quien tiene mas goles y se cascadea via applyWinnerChange.
  function setPen(field,val){
    if(locked)return;
    setPreds(function(p){
      var n=Object.assign({},p);
      n[slot.id]=Object.assign({},n[slot.id]||{match_id:slot.id});
      n[slot.id][field]=val;
      var nph=field==="pen_home"?val:n[slot.id].pen_home;
      var npa=field==="pen_away"?val:n[slot.id].pen_away;
      var ht=n[slot.id].home_team,at=n[slot.id].away_team;
      if(nph!=null&&nph!==""&&npa!=null&&npa!==""&&ht&&at){
        var nphn=+nph,npan=+npa;
        if(!isNaN(nphn)&&!isNaN(npan)&&nphn!==npan){
          var w=nphn>npan?ht:at;
          n=applyWinnerChange(n,slot.id,w,ht,at);
        } else {
          // empate o invalidos -> sin ganador
          n[slot.id].winner=null;
        }
      } else {
        // alguno vacio -> sin ganador definido todavia
        n[slot.id].winner=null;
      }
      return n;
    });
  }

  // Estilo del contenedor: si matchup -> marco verde completo; si no, borderLeft según hay oficial o no
  var cardStyle=Object.assign({},card,{marginBottom:12,opacity:locked?0.85:1});
  if (hasMatchup) {
    cardStyle.border=b2(C.green);
    cardStyle.borderLeft=b2(C.green);
  } else {
    cardStyle.borderLeft=hasOff?b3(C.accentS):b3(C.border);
  }

  // Borde de los inputs de penales (no usan ScoreBox)
  function penStyle(state){
    var st=Object.assign({},inp,{width:50,textAlign:"center",padding:"8px"});
    if (state==="ok") st.border="1.5px solid "+C.green;
    else if (state==="err") st.border="1.5px solid "+C.red;
    return st;
  }

  return <div style={cardStyle}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontSize:10,color:C.sub2,letterSpacing:0.3}}>{slot.label} - {fmtDate(slot.date)} - {slot.time} hs</span>
      {sc!=null&&<PtsBadge pts={sc}/>}
    </div>
    <div style={{fontSize:10,color:C.sub,marginBottom:10}}>&#128205; {slot.venue}</div>

    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
      <TeamSlotPicker slotId={slot.id} pos="home" value={pred.home_team} onChange={function(t){changeTeam("home",t);}} scores={scoresForCalc||preds} isAdmin={isAdmin} locked={locked} colorState={homeCellColor} showLabel={showLabel}/>
      <ScoreBox value={ph!=null?ph:""} onChange={function(v){setScore("home",v);}} readOnly={locked} state={homeGoalState}/>
      <span style={{color:C.border2}}>-</span>
      <ScoreBox value={pa!=null?pa:""} onChange={function(v){setScore("away",v);}} readOnly={locked} state={awayGoalState}/>
      <TeamSlotPicker slotId={slot.id} pos="away" value={pred.away_team} onChange={function(t){changeTeam("away",t);}} scores={scoresForCalc||preds} isAdmin={isAdmin} locked={locked} colorState={awayCellColor} showLabel={showLabel}/>
    </div>

    {isDraw&&<div style={{padding:"10px",background:C.surface2,borderRadius:8,border:b("rgba(255,208,96,0.3)"),marginTop:6}}>
      <div style={{fontSize:10,color:C.gold,marginBottom:6,fontWeight:700,letterSpacing:0.5,textAlign:"center"}}>&#9917; PENALES</div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <div style={{flex:1}}/>
        <input type="number" min="0" style={penStyle(homePenState)} value={pred.pen_home||""} onChange={function(e){setPen("pen_home",e.target.value);}} readOnly={locked} placeholder="0"/>
        <span style={{color:C.sub2}}>-</span>
        <input type="number" min="0" style={penStyle(awayPenState)} value={pred.pen_away||""} onChange={function(e){setPen("pen_away",e.target.value);}} readOnly={locked} placeholder="0"/>
        <div style={{flex:1}}/>
      </div>
    </div>}

    {pred.winner&&<div style={{marginTop:6,fontSize:11,color:C.green}}>&#10003; Pasa: <b>{pred.winner}</b></div>}

    {hasOff&&<div style={{marginTop:8,paddingTop:8,borderTop:b(C.border),fontSize:11,color:C.sub}}>
      Oficial: <b style={{color:C.text}}>{off.home_team||"?"} {off.home}-{off.away} {off.away_team||"?"}</b>
      {off.pen_home!=null&&off.pen_home!==""&&<span> (pen {off.pen_home}-{off.pen_away})</span>}
    </div>}
  </div>;
}

function StatRow({label,value,sub,last}){
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:last?0:10,marginBottom:last?0:10,borderBottom:last?"none":b(C.border)}}>
    <span style={{fontSize:13,color:C.sub}}>{label}</span>
    <div style={{textAlign:"right"}}>
      <span style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:mono}}>{value}</span>
      {sub&&<div style={{fontSize:11,color:C.sub2}}>{sub}</div>}
    </div>
  </div>;
}

function AdminStatsTab(){
  const [loading,setLoading]=useState(true);
  const [totals,setTotals]=useState({users:0,withGroups:0,withKO:0,avgPts:0});
  const [groupRanking,setGroupRanking]=useState([]);
  useEffect(function(){
    Promise.all([
      supabase.from("profiles").select("id",{count:"exact"}).neq("nick","superadmin"),
      supabase.from("predictions").select("user_id,match_id,home,away"),
      supabase.from("official_results").select("*"),
      supabase.from("groups").select("id,name,group_members(user_id)"),
    ]).then(function(results){
      var total=results[0].count||0;
      var preds=results[1].data||[];
      var offMap={};(results[2].data||[]).forEach(function(o){offMap[o.match_id]=o;});
      var groups=results[3].data||[];
      var usersWithGroups=new Set(),usersWithKO=new Set(),byUser={};
      preds.forEach(function(p){
        if(GROUP_MATCHES.find(function(m){return m.id===p.match_id;}))usersWithGroups.add(p.user_id);
        if(KO_SLOTS.find(function(s){return s.id===p.match_id;}))usersWithKO.add(p.user_id);
        if(!byUser[p.user_id])byUser[p.user_id]=0;
        byUser[p.user_id]+=scorePred(p,offMap[p.match_id],p.match_id,offMap);
      });
      var uids=Object.keys(byUser);
      var avg=uids.length>0?Math.round(uids.reduce(function(s,uid){return s+byUser[uid];},0)/uids.length):0;
      setTotals({users:total,withGroups:usersWithGroups.size,withKO:usersWithKO.size,avgPts:avg});
      var gRank=groups.map(function(g){
        var members=g.group_members||[];
        var sum=members.reduce(function(s,m){return s+(byUser[m.user_id]||0);},0);
        return{name:g.name,members:members.length,avg:members.length>0?Math.round(sum/members.length):0};
      }).sort(function(a,b){return b.avg-a.avg;});
      setGroupRanking(gRank);
      setLoading(false);
    });
  },[]);
  return <div style={{padding:"12px 14px 40px"}}>
    {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:24}}>Cargando...</p>}
    {!loading&&<>
      <SectionLabel>Usuarios</SectionLabel>
      <div style={Object.assign({},card,{marginBottom:16})}>
        <StatRow label="Registrados" value={totals.users}/>
        <StatRow label="Con predicciones de grupos" value={totals.withGroups} sub={totals.users?Math.round(totals.withGroups/totals.users*100)+"%":"-"}/>
        <StatRow label="Con predicciones de cruces" value={totals.withKO} sub={totals.users?Math.round(totals.withKO/totals.users*100)+"%":"-"}/>
        <StatRow label="Promedio de puntos" value={totals.avgPts+" pts"} last/>
      </div>
      <SectionLabel>Ranking de grupos (promedio)</SectionLabel>
      <div style={Object.assign({},card,{marginBottom:16})}>
        {groupRanking.map(function(g,i){
          return <div key={g.name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<groupRanking.length-1?10:0}}>
            <span style={{width:20,fontSize:11,color:C.sub2,textAlign:"right"}}>{i+1}.</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:C.text,fontWeight:600}}>{g.name}</div>
              <div style={{fontSize:11,color:C.sub,marginTop:1}}>{g.members} participantes</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:mono}}>{g.avg}</div>
              <div style={{fontSize:10,color:C.sub}}>prom. pts</div>
            </div>
          </div>;
        })}
      </div>
    </>}
  </div>;
}

function StatsView({ctx}){
  var setView=ctx.setView;
  const [loading,setLoading]=useState(true);
  const [campeonStats,setCampeonStats]=useState([]);
  const [levStats,setLevStats]=useState([]);
  const [champShowAll,setChampShowAll]=useState(false);
  const [levOpenGroup,setLevOpenGroup]=useState(null);
  const [roundOpen,setRoundOpen]=useState(null);
  const [roundStats,setRoundStats]=useState({});
  const [matchAccuracy,setMatchAccuracy]=useState({best:null,worst:null});
  useEffect(function(){
    function fetchAllPredictions(){
      return new Promise(function(resolve){
        var all=[];
        function next(from){
          supabase.from("predictions").select("user_id,group_id,match_id,home,away,home_team,away_team,winner").order("user_id").order("group_id").order("match_id").range(from,from+999).then(function(r){
            var data=r.data||[];
            all=all.concat(data);
            if (data.length<1000) return resolve({data:all});
            next(from+1000);
          });
        }
        next(0);
      });
    }
    Promise.all([
      supabase.from("prediction_extras").select("user_id,champion"),
      fetchAllPredictions(),
      supabase.from("official_results").select("*"),
    ]).then(function(results){
      var extras=results[0].data||[];
      var preds=results[1].data||[];
      var offMap={};(results[2].data||[]).forEach(function(o){offMap[o.match_id]=o;});
      var champCount={};
      extras.forEach(function(e){if(e.champion)champCount[e.champion]=(champCount[e.champion]||0)+1;});
      var total=Object.values(champCount).reduce(function(s,x){return s+x;},0)||1;
      setCampeonStats(Object.keys(champCount).map(function(t){return{team:t,count:champCount[t]};}).sort(function(a,b){return b.count-a.count;}).map(function(t){return Object.assign(t,{pct:Math.round(t.count/total*100)});}));
      var matchVotes={};
      preds.forEach(function(p){
        var m=GROUP_MATCHES.find(function(m){return m.id===p.match_id;});
        if(!m)return;
        if(!matchVotes[p.match_id])matchVotes[p.match_id]={match:m,L:0,E:0,V:0,total:0};
        var ph=+(p.home!=null?p.home:-1),pa=+(p.away!=null?p.away:-1);
        if(ph<0||pa<0)return;
        if(ph>pa)matchVotes[p.match_id].L++;else if(ph<pa)matchVotes[p.match_id].V++;else matchVotes[p.match_id].E++;
        matchVotes[p.match_id].total++;
      });
      setLevStats(Object.values(matchVotes).filter(function(v){return v.total>0;}));
      var accuracy=[];
      Object.keys(matchVotes).forEach(function(mid){
        var off=offMap[mid];
        if(!off||off.home==null||off.away==null)return;
        var oh=+off.home,oa=+off.away;
        var offO=oh>oa?"L":oh<oa?"V":"E";
        var v=matchVotes[mid];
        var correct=offO==="L"?v.L:offO==="V"?v.V:v.E;
        if(v.total>0)accuracy.push({match:v.match,pct:Math.round(correct/v.total*100),total:v.total});
      });
      accuracy.sort(function(a,b){return b.pct-a.pct;});
      setMatchAccuracy({best:accuracy[0]||null,worst:accuracy[accuracy.length-1]||null});
      // Agrupar preds por planilla (user_id + group_id) para aplicar fill-forward de KO igual que PredictionsView.
      var planillas={};
      preds.forEach(function(p){
        var k=p.user_id+"|"+(p.group_id||"");
        if(!planillas[k]) planillas[k]={};
        planillas[k][p.match_id]=p;
      });
      // Fill-forward por planilla: cascadea winners → home_team/away_team del siguiente slot (no pisa datos).
      var FF_ORDER_STATS=["r32_0","r32_1","r32_2","r32_3","r32_4","r32_5","r32_6","r32_7","r32_8","r32_9","r32_10","r32_11","r32_12","r32_13","r32_14","r32_15","r16_0","r16_1","r16_2","r16_3","r16_4","r16_5","r16_6","r16_7","qf_0","qf_1","qf_2","qf_3","sf_0","sf_1"];
      Object.keys(planillas).forEach(function(k){
        var byId=planillas[k];
        FF_ORDER_STATS.forEach(function(sid){
          var sp=byId[sid]; if(!sp||!sp.winner) return;
          var nx=KO_NEXT[sid];
          if(nx){
            var dst=byId[nx.next]||{match_id:nx.next};
            var tf=nx.pos==="home"?"home_team":"away_team";
            if(!dst[tf]){ dst=Object.assign({},dst); dst[tf]=sp.winner; byId[nx.next]=dst; }
          }
          var ln=KO_LOSER_NEXT[sid];
          if(ln&&sp.home_team&&sp.away_team){
            var loser=sp.winner===sp.home_team?sp.away_team:(sp.winner===sp.away_team?sp.home_team:null);
            if(loser){
              var ldst=byId[ln.next]||{match_id:ln.next};
              var lf=ln.pos==="home"?"home_team":"away_team";
              if(!ldst[lf]){ ldst=Object.assign({},ldst); ldst[lf]=loser; byId[ln.next]=ldst; }
            }
          }
        });
      });
      // Conteo de teams por ronda (con datos derivados aplicados).
      var byRound={};
      Object.keys(planillas).forEach(function(k){
        var byId=planillas[k];
        Object.keys(byId).forEach(function(mid){
          var slot=KO_SLOTS.find(function(s){return s.id===mid;});
          if(!slot)return;
          var p=byId[mid];
          if(!byRound[slot.phase])byRound[slot.phase]={};
          [p.home_team,p.away_team].forEach(function(t){if(t)byRound[slot.phase][t]=(byRound[slot.phase][t]||0)+1;});
        });
      });
      var rs={};
      Object.keys(byRound).forEach(function(phase){rs[phase]=Object.keys(byRound[phase]).map(function(t){return{team:t,count:byRound[phase][t]};}).sort(function(a,b){return b.count-a.count;});});
      setRoundStats(rs);
      setLoading(false);
    });
  },[]);
  var phaseLabels={r32:"16avos",r16:"Octavos",qf:"Cuartos",sf:"Semis","3rd":"3/4",f:"Final"};
  var phaseOrder=["r32","r16","qf","sf","3rd","f"];
  return <div style={{minHeight:"100vh"}}>
    <Bar title="Estadísticas del torneo" onBack={function(){setView("groups_list");}}/>
    {loading&&<p style={{color:C.sub,textAlign:"center",marginTop:40}}>Cargando...</p>}
    {!loading&&<div style={{padding:"16px 14px 80px"}}>
      <SectionLabel>Campeón más elegido</SectionLabel>
      <div style={Object.assign({},card,{marginBottom:16})}>
        {campeonStats.length===0&&<p style={{color:C.sub,fontSize:12,textAlign:"center",margin:0}}>Sin datos aún</p>}
        {(champShowAll?campeonStats:campeonStats.slice(0,5)).map(function(t,i,arr){
          return <div key={t.team} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<arr.length-1?10:0}}>
            <span style={{width:20,fontSize:11,color:C.sub2,textAlign:"right"}}>{i+1}.</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                <span style={{fontSize:13,color:C.text}}>{t.team}</span>
                <span style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:mono}}>{t.count} <span style={{fontSize:11,fontWeight:400,color:C.sub}}>({t.pct}%)</span></span>
              </div>
              <div style={{height:4,background:C.surface2,borderRadius:2}}><div style={{height:4,width:t.pct+"%",background:"#c084fc",borderRadius:2}}/></div>
            </div>
          </div>;
        })}
        {campeonStats.length>5&&<button onClick={function(){setChampShowAll(function(v){return !v;});}} style={{width:"100%",marginTop:12,padding:"7px 0",fontSize:11,fontWeight:600,fontFamily:font,borderRadius:8,cursor:"pointer",border:b(C.border),background:C.surface,color:C.sub2}}>{champShowAll?"Ver menos":"Ver todos ("+campeonStats.length+")"}</button>}
      </div>
      {(matchAccuracy.best||matchAccuracy.worst)&&<>
        <SectionLabel>Precisión en partidos</SectionLabel>
        <div style={Object.assign({},card,{marginBottom:16})}>
          {matchAccuracy.best&&<div style={{marginBottom:matchAccuracy.worst?12:0}}>
            <div style={{fontSize:11,color:C.green,fontWeight:600,marginBottom:4}}>✓ MÁS ACERTADO</div>
            <div style={{fontSize:13,color:C.text}}>{matchAccuracy.best.match.home} vs {matchAccuracy.best.match.away}</div>
            <div style={{fontSize:11,color:C.sub,marginTop:2}}>{matchAccuracy.best.pct}% acertó — {matchAccuracy.best.total} predicciones</div>
          </div>}
          {matchAccuracy.worst&&<div style={{borderTop:matchAccuracy.best?b(C.border):"none",paddingTop:matchAccuracy.best?12:0}}>
            <div style={{fontSize:11,color:C.red,fontWeight:600,marginBottom:4}}>✗ MENOS ACERTADO</div>
            <div style={{fontSize:13,color:C.text}}>{matchAccuracy.worst.match.home} vs {matchAccuracy.worst.match.away}</div>
            <div style={{fontSize:11,color:C.sub,marginTop:2}}>{matchAccuracy.worst.pct}% acertó — {matchAccuracy.worst.total} predicciones</div>
          </div>}
        </div>
      </>}
      <SectionLabel>Pronósticos por partido (Grupos)</SectionLabel>
      {levStats.length===0&&<div style={Object.assign({},card,{marginBottom:16})}><p style={{color:C.sub,fontSize:12,textAlign:"center",margin:0}}>Sin datos aún</p></div>}
      {levStats.length>0&&(function(){
        // % que suman exactamente 100 (el tercero por diferencia para evitar 99/101)
        var pcts=function(v){
          var lP=Math.round(v.L/v.total*100),eP=Math.round(v.E/v.total*100);
          return {lP:lP,eP:eP,vP:100-lP-eP};
        };
        var byGroup={};
        levStats.forEach(function(v){
          if(!byGroup[v.match.group])byGroup[v.match.group]=[];
          byGroup[v.match.group].push(v);
        });
        Object.keys(byGroup).forEach(function(g){byGroup[g].sort(function(a,b){return a.match.id<b.match.id?-1:1;});});
        var allGroups=Object.keys(GROUPS);
        var open=levOpenGroup;
        var matches=open&&byGroup[open]?byGroup[open]:[];
        return <div style={Object.assign({},card,{marginBottom:16})}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {allGroups.map(function(g){
              var active=open===g;
              var has=!!byGroup[g];
              return <button key={g} onClick={function(){setLevOpenGroup(active?null:g);}} style={{padding:"10px 0",fontSize:13,fontWeight:700,fontFamily:font,borderRadius:8,cursor:"pointer",border:b(active?C.accentB:C.border),background:active?"rgba(34,128,255,0.15)":C.surface,color:active?C.accentS:(has?C.text:C.sub),opacity:has?1:0.5}}>{g}</button>;
            })}
          </div>
          {open&&<div style={{marginTop:14,paddingTop:14,borderTop:b(C.border)}}>
            {matches.length===0&&<p style={{color:C.sub,fontSize:12,textAlign:"center",margin:0}}>Sin votos en el grupo {open} aún</p>}
            {matches.map(function(v,i){
              var p=pcts(v);
              return <div key={v.match.id} style={{marginBottom:i<matches.length-1?14:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:C.sub}}>{v.match.home} vs {v.match.away}</span>
                  <span style={{fontSize:10,color:C.sub2,fontFamily:mono}}>{v.total} {v.total===1?"voto":"votos"}</span>
                </div>
                <div style={{display:"flex",gap:3,height:22}}>
                  <div style={{flex:p.lP||1,background:"rgba(76,223,154,0.2)",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.green,overflow:"hidden"}}>L {p.lP}%</div>
                  <div style={{flex:p.eP||1,background:"rgba(255,208,96,0.15)",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.gold,overflow:"hidden"}}>E {p.eP}%</div>
                  <div style={{flex:p.vP||1,background:"rgba(0,200,224,0.12)",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.accentS,overflow:"hidden"}}>V {p.vP}%</div>
                </div>
              </div>;
            })}
          </div>}
        </div>;
      })()}
      <SectionLabel>Equipos más elegidos por ronda</SectionLabel>
      {(function(){
        var avail=phaseOrder.filter(function(p){return roundStats[p]&&roundStats[p].length>0;});
        if(avail.length===0)return <div style={Object.assign({},card,{marginBottom:16})}><p style={{color:C.sub,fontSize:12,textAlign:"center",margin:0}}>Sin datos de cruces aún</p></div>;
        var open=roundOpen;
        var teams=open&&roundStats[open]?roundStats[open]:[];
        return <div style={Object.assign({},card,{marginBottom:16})}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
            {phaseOrder.map(function(phase){
              var has=roundStats[phase]&&roundStats[phase].length>0;
              var active=open===phase;
              return <button key={phase} disabled={!has} onClick={function(){setRoundOpen(active?null:phase);}} style={{padding:"10px 2px",fontSize:11,fontWeight:700,fontFamily:font,borderRadius:8,cursor:has?"pointer":"default",border:b(active?"#c084fc":C.border),background:active?"rgba(192,132,252,0.15)":C.surface,color:active?"#c084fc":(has?C.text:C.sub),opacity:has?1:0.4,textTransform:"uppercase",letterSpacing:0.3}}>{phaseLabels[phase]}</button>;
            })}
          </div>
          {open&&<div style={{marginTop:14,paddingTop:14,borderTop:b(C.border)}}>
            {teams.map(function(t,i){
              return <div key={t.team} style={{display:"flex",alignItems:"center",gap:8,marginBottom:i<teams.length-1?8:0}}>
                <span style={{fontSize:11,color:C.sub2,width:18,textAlign:"right"}}>{i+1}.</span>
                <span style={{flex:1,fontSize:13,color:C.text}}>{t.team}</span>
                <span style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:mono}}>{t.count}</span>
              </div>;
            })}
          </div>}
        </div>;
      })()}
    </div>}
  </div>;
}
