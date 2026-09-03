const fs = require('fs');
const vm = require('vm');

let hb = fs.readFileSync('hb_current.js', 'utf8');

// 1. Update signature
const oldSig = '_b=({activeTab:r,setActiveTab:T,totalClassesCount:j,activeLessonsThisWeekCount:u,onOpenQuickWizard:N,isEditAuthorized:D,onOpenAuthModal:Q,onLockEdit:H,gistId:R,onOpenGistModal:b})=>';
const newSig = '_b=({activeTab:r,setActiveTab:T,totalClassesCount:j,activeLessonsThisWeekCount:u,onOpenQuickWizard:N,isEditAuthorized:D,onOpenAuthModal:Q,onLockEdit:H,gistId:R,onOpenGistModal:b,onExportBackup:propExportBackup})=>';

if (!hb.includes(oldSig)) {
  console.error('oldSig not found in hb');
  process.exit(1);
}
hb = hb.replace(oldSig, newSig);

// 2. Insert one-click backup button in header buttons
const oldTarget = 'D?s.jsxs("button",{onClick:H,className:"inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700';

const backupButtonCode = `s.jsxs("button",{type:"button",onClick:()=>{if(typeof propExportBackup==="function"){propExportBackup();}else{try{const payload={version:"1.0.0",exportedAt:new Date().toLocaleString(),exportTimestamp:new Date().toISOString(),system:"Beavers Education 课程进度表管理系统",schedules:JSON.parse(localStorage.getItem("beavers_schedules")||"[]"),templates:JSON.parse(localStorage.getItem("beavers_templates")||"[]"),levels:JSON.parse(localStorage.getItem("beavers_levels")||"[]"),holidays:JSON.parse(localStorage.getItem("beavers_holidays")||"[]"),teachers:JSON.parse(localStorage.getItem("beavers_teachers")||"[]"),customTextbooks:JSON.parse(localStorage.getItem("beavers_custom_textbooks")||"[]")};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");const dateStr=new Date().toISOString().split("T")[0];a.setAttribute("href",url);a.setAttribute("download",\`Beavers_排课系统全量备份_\${dateStr}.json\`);document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);}catch(e){console.error("Backup failed",e);}}},className:"inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs group",title:"一键导出排课系统全量备份到本地 (.json)",children:[s.jsx(Nf,{className:"w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 transition-colors"}),s.jsx("span",{className:"hidden sm:inline",children:"一键本地备份"}),s.jsx("span",{className:"sm:hidden",children:"备份"})]}),` + oldTarget;

if (!hb.includes(oldTarget)) {
  console.error('oldTarget not found in hb');
  process.exit(1);
}
hb = hb.replace(oldTarget, backupButtonCode);

fs.writeFileSync('hb_new.js', hb);
console.log('Successfully created hb_new.js');

try {
  new vm.Script(hb);
  console.log('SUCCESS: hb_new.js syntax is valid!');
} catch (e) {
  console.error('Syntax error in hb_new.js:', e);
}
