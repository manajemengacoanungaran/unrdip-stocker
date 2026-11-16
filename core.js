var I={chart:'<path d="M3 3v18h18"/><path d="M8 16v-5M13 16V7M18 16v-8"/>',check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',book:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',factory:'<path d="M3 21V11l6 4v-4l6 4V5h4v16z"/>',truck:'<path d="M2 6h11v10H2zM13 9h4l4 3v4h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',sheet:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l3 12h11l2-8H6"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6M17 5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-5-4-5.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',store:'<path d="M3 11 12 3l9 8M5 10v11h14V10M10 21v-6h4v6"/>',arrow:'<path d="M7 17 17 7M8 7h9v9"/>'};
var PICK=["chart","check","book","factory","truck","link","box","sheet","cart","users","clock","store"];
var svg=(k,c="")=>`<svg viewBox="0 0 24 24" class="${c}" aria-hidden="true">${I[k]||I.link}</svg>`;
var esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
var okUrl=u=>/^https?:\/\/\S+$/i.test(u||"");
var $=s=>document.querySelector(s);
var clone=o=>JSON.parse(JSON.stringify(o));
var CFG=window.STOCKER_CONFIG||{},LK="stocker-draft-v2";
const DEF={
 "brand": {
  "title": "STOCKER UNRDIP",
  "sub": "̶A̶F̶R̶I̶Z̶A̶L̶  - JOO - DZIKRA - DZUL",
  "tag": "TIDAK ADA ALIANSI, PATUHI STOCKER",
  "logoText": "UNRDIP SERASI",
  "logoLink": "https://github.com/FLAME-XD",
  "foot": "readme.md dev code from flamexyz as joo"
 },
 "groups": [
  {
   "title": "",
   "items": [
    {
     "icon": "chart",
     "name": "STOCK OPNAME",
     "desc": "KITCHEN - FROZEN - DS",
     "url": "https://docs.google.com/spreadsheets/d/19vD6NEm25E1RDbRO-ZoAGP7Sxk-oRKhIr5hIveCfrTU/edit?gid=0#gid=0"
    },
    {
     "icon": "check",
     "name": "STOCKER CHECKLIST",
     "desc": "VERIFIKASI BUAH & SABILA",
     "url": "https://docs.google.com/spreadsheets/d/1DI26esYwlxWfB2vhqpBOZAzppmIIIhuQMlP_2Vt5Zg0/edit?gid=1532603933#gid=1532603933"
    },
    {
     "icon": "book",
     "name": "BUKU BELANJA GUDANG",
     "desc": "PENCATATAN BARANG KELUAR",
     "url": "https://docs.google.com/spreadsheets/d/1MdFq7YX0ibsPyS4_Wy4Ij78ocQVqhZrRB7HZ9TqwQjA/edit?gid=1237498272#gid=1237498272"
    }
   ]
  },
  {
   "title": "",
   "items": [
    {
     "icon": "factory",
     "name": "INCOMING INTERNAL",
     "desc": "PENGISIAN DATA BARANG MASUK FROZEN & DRY",
     "url": "https://docs.google.com/spreadsheets/d/1_h0tmoVGY8WV5iRbi94aI2pUiXDgP_9lW1X9JtTHiNc/edit?gid=1993383670#gid=1993383670"
    },
    {
     "icon": "truck",
     "name": "INCOMING EKSTERNAL",
     "desc": "PENGISIAN DATA BARANG MASUK SABILA & SINOK",
     "url": "https://docs.google.com/spreadsheets/d/1bgUj4KnSnfhjg1gM3dSTA2NwQxP5ARyItqvk42BhX80/edit?gid=207191212#gid=207191212"
    }
   ]
  }
 ]
};
function norm(d){if(!d||!d.groups)return null;const a=x=>Array.isArray(x)?x:Object.values(x||{});return{brand:{...DEF.brand,...d.brand},groups:a(d.groups).map(g=>({title:g.title||"",items:a(g.items)}))}}
function cached(){try{return norm(JSON.parse(localStorage.getItem(LK)))}catch(e){return null}}
async function loadPublished(){try{const r=await fetch("data.json",{cache:"no-store"});if(r.ok){const d=norm(await r.json());if(d)return d}}catch(e){}return clone(DEF)}
function renderPage(D){const b=D.brand;
  $("#t-title").textContent=b.title;$("#t-logo").textContent=b.logoText;$("#t-tag").textContent=b.tag;$("#t-foot").textContent=b.foot;
  $("#t-sub").innerHTML=b.sub.split(/\s*·\s*|\s+-\s+/).map(x=>x.trim()).filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join("");
  $("#brand").href=okUrl(b.logoLink)?b.logoLink:"#";
  $("#main").innerHTML=D.groups.map(g=>`<section>${g.title?`<h2>${esc(g.title)}</h2>`:""}`+(g.items.length?`<div class="grid">`+g.items.map(i=>`<a class="card" href="${okUrl(i.url)?esc(i.url):"#"}" target="_blank" rel="noopener noreferrer"><span class="ico">${svg(i.icon)}</span><span class="tx"><b>${esc(i.name)}</b><small>${esc(i.desc)}</small></span>${svg("arrow","go")}</a>`).join("")+`</div>`:`<p class="empty">Belum ada link di grup ini.</p>`)+`</section>`).join("")}
