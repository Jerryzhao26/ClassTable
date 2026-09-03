const fs = require('fs');
const vm = require('vm');

const bundleBakPath = 'assets/index-C_N6_LWa.js.bak';
const bundlePath = 'assets/index-C_N6_LWa.js';

let bundle = fs.readFileSync(bundleBakPath, 'utf8');

const cleanCode = (code) => code.trim().replace(/;+$/, '');

// Ensure all modular components are built and read
const hb_new = cleanCode(fs.readFileSync('hb_new.js', 'utf8'));
const tb_new = cleanCode(fs.readFileSync('tb_new.js', 'utf8'));
const cb_new = cleanCode(fs.readFileSync('cb_new.js', 'utf8'));
const eb_new = cleanCode(fs.readFileSync('eb_new.js', 'utf8'));

const hbStart = bundle.indexOf('_b=({activeTab:r,setActiveTab:T,');
const tbStart = bundle.indexOf(',Tb=({schedules:r,templates:T,teachers:j,', hbStart);
const cbStart = bundle.indexOf(',Cb=({schedules:r,levels:T,teachers:j,', tbStart);
const ebStart = bundle.indexOf(',Eb=({schedule:r,templates:T=[],holidays:', cbStart);
const abStart = bundle.indexOf(',Ab=({levels:r,teachers:T,holidays:j,templates:u=', ebStart);

if (hbStart === -1 || tbStart === -1 || cbStart === -1 || ebStart === -1 || abStart === -1) {
  console.error('Could not find component locations:', { hbStart, tbStart, cbStart, ebStart, abStart });
  process.exit(1);
}

const beforeHb = bundle.substring(0, hbStart);
let afterEb = bundle.substring(abStart); // starts with ,Ab=...

// 1. Inject exportLocalBackup and restoreLocalBackup definition right after const d=()=>({version:"1.0.0",...});
const oldDDef = 'const d=()=>({version:"1.0.0",updatedAt:new Date().toLocaleString(),templates:xe,schedules:me,levels:Me,holidays:ye,teachers:se,customTextbooks:A});';
const newDDef = 'const d=()=>({version:"1.0.0",updatedAt:new Date().toLocaleString(),templates:xe,schedules:me,levels:Me,holidays:ye,teachers:se,customTextbooks:A});const exportLocalBackup=()=>{try{const L=d(),blob=new Blob([JSON.stringify(L,null,2)],{type:"application/json;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a"),dateStr=new Date().toISOString().split("T")[0];a.setAttribute("href",url),a.setAttribute("download",`Beavers_排课系统全量备份_${dateStr}.json`),document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(url);return L}catch(e){console.error("Backup export error:",e);return null}};const restoreLocalBackup=(data,cb)=>{if(!data||(!data.schedules&&!data.templates&&!data.levels))return!1;te(()=>{Ve(data),C(),cb&&cb(data)});return!0};';

if (!afterEb.includes(oldDDef)) {
  console.error('oldDDef not found in afterEb');
  process.exit(1);
}
afterEb = afterEb.replace(oldDDef, newDDef);

// 2. Update _b call in App root to pass onExportBackup:exportLocalBackup, onRestoreBackup:restoreLocalBackup
const oldBCall = 's.jsx(_b,{activeTab:r,setActiveTab:L=>{T(L),L!=="schedules"&&u(null)},totalClassesCount:Et,activeLessonsThisWeekCount:At,onOpenQuickWizard:()=>te(()=>he()),isEditAuthorized:Q,onOpenAuthModal:()=>b(!0),onLockEdit:()=>H(!1),gistId:Z,onOpenGistModal:()=>ve(!0)})';
const newBCall = 's.jsx(_b,{activeTab:r,setActiveTab:L=>{T(L),L!=="schedules"&&u(null)},totalClassesCount:Et,activeLessonsThisWeekCount:At,onOpenQuickWizard:()=>te(()=>he()),isEditAuthorized:Q,onOpenAuthModal:()=>b(!0),onLockEdit:()=>H(!1),gistId:Z,onOpenGistModal:()=>ve(!0),onExportBackup:exportLocalBackup,onRestoreBackup:restoreLocalBackup})';

if (!afterEb.includes(oldBCall)) {
  console.error('oldBCall not found in afterEb');
  process.exit(1);
}
afterEb = afterEb.replace(oldBCall, newBCall);

// 3. Update Tb call in App root to pass onExportBackup:exportLocalBackup, onRestoreBackup:restoreLocalBackup
const oldTbCall = 's.jsx(Tb,{schedules:me,templates:xe,teachers:se,onSelectSchedule:L=>{u(L),T("schedules")},onOpenWizard:()=>te(()=>he()),onUpdateLessonStatus:Ne})';
const newTbCall = 's.jsx(Tb,{schedules:me,templates:xe,teachers:se,onSelectSchedule:L=>{u(L),T("schedules")},onOpenWizard:()=>te(()=>he()),onUpdateLessonStatus:Ne,onExportBackup:exportLocalBackup,onRestoreBackup:restoreLocalBackup})';

if (!afterEb.includes(oldTbCall)) {
  console.error('oldTbCall not found in afterEb');
  process.exit(1);
}
afterEb = afterEb.replace(oldTbCall, newTbCall);

// 4. Update Cb call in App root to pass onBatchDeleteSchedules
const oldCbCall = 's.jsx(Cb,{schedules:me,levels:Me,teachers:se,onSelectSchedule:L=>u(L),onOpenQuickWizard:L=>te(()=>he(null,L)),onDeleteSchedule:G,onOpenPrintModal:L=>ce(L)})';
const newCbCall = 's.jsx(Cb,{schedules:me,levels:Me,teachers:se,onSelectSchedule:L=>u(L),onOpenQuickWizard:L=>te(()=>he(null,L)),onDeleteSchedule:G,onBatchDeleteSchedules:L=>{te(()=>{O(Se=>Se.filter(re=>!L.includes(re.id))),L.includes(j==null?void 0:j.id)&&u(null),C()})},onOpenPrintModal:L=>ce(L)})';

if (!afterEb.includes(oldCbCall)) {
  console.error('oldCbCall not found in afterEb');
  process.exit(1);
}
afterEb = afterEb.replace(oldCbCall, newCbCall);

// 5. In Rb (cloud sync modal), add local backup export & restore card
const oldRbSyncTarget = 's.jsxs("button",{type:"button",onClick:Me,disabled:J,className:"flex flex-col items-center justify-center p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl font-bold text-xs transition-all disabled:opacity-50 group",children:[s.jsx(Am,{className:"w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform"}),s.jsx("span",{children:"自动创建全新 Gist 数据库"}),s.jsx("span",{className:"text-[10px] text-emerald-700 font-normal mt-0.5",children:"初始化全新 Gist ID"})]})]})]}),';

const newRbBackupCard = oldRbSyncTarget + `s.jsxs("div",{className:"space-y-3 pt-3 border-t border-slate-100",children:[s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsx("h4",{className:"font-extrabold text-xs text-slate-900 uppercase tracking-wider",children:"本地离线备份与还原 (免 Token / 离线可用)"}),s.jsx("span",{className:"text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold",children:"双重备份"})]}),s.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[s.jsxs("button",{type:"button",onClick:()=>{try{const L=Q(),blob=new Blob([JSON.stringify(L,null,2)],{type:"application/json;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a"),dateStr=new Date().toISOString().split("T")[0];a.setAttribute("href",url),a.setAttribute("download",\`Beavers_排课系统全量备份_\${dateStr}.json\`),document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(url),F({type:"success",text:"✅ 已成功将当前全量排课与系统配置导出保存到本地备份！"})}catch(e){F({type:"error",text:"导出本地备份失败: "+e.message})}},className:"flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs transition-all hover:border-slate-300 shadow-2xs group text-left",children:[s.jsx("div",{className:"w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors",children:s.jsx(Nf,{className:"w-4 h-4"})}),s.jsxs("div",{children:[s.jsx("div",{className:"text-slate-900 font-bold",children:"一键导出本地备份"}),s.jsx("div",{className:"text-[10px] text-slate-500 font-normal",children:"下载 .json 格式全量数据"})]})]}),s.jsxs("label",{className:"flex items-center space-x-3 p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs transition-all hover:border-slate-300 shadow-2xs cursor-pointer group text-left",children:[s.jsx("div",{className:"w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors",children:s.jsx(Om,{className:"w-4 h-4"})}),s.jsxs("div",{className:"flex-1",children:[s.jsx("div",{className:"text-slate-900 font-bold",children:"从本地文件恢复数据"}),s.jsx("div",{className:"text-[10px] text-slate-500 font-normal",children:"读取本地 .json 备份覆盖"})]}),s.jsx("input",{type:"file",accept:".json",className:"hidden",onChange:e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader;r.onload=ev=>{try{const data=JSON.parse(ev.target.result);if(data&&(data.schedules||data.templates)){H(data),F({type:"success",text:\`🎉 成功从本地备份载入数据！包含 \${(data.schedules||[]).length} 个班级排课与 \${(data.templates||[]).length} 套模板。\`})}else{F({type:"error",text:"未识别到有效的排课或模板数据，请确认文件格式。"})}}catch(err){F({type:"error",text:"读取备份文件失败: "+err.message})}},r.readAsText(f),e.target.value=""}})]})]})]}),`;

if (!afterEb.includes(oldRbSyncTarget)) {
  console.error('oldRbSyncTarget not found in afterEb');
  process.exit(1);
}
afterEb = afterEb.replace(oldRbSyncTarget, newRbBackupCard);

// Construct new bundle with updated components: _b, Tb, Cb, Eb
let newBundle = beforeHb + hb_new + ',' + tb_new + ',' + cb_new + ',' + eb_new + afterEb;

console.log('Validating final bundle syntax with vm.Script...');
try {
  new vm.Script(newBundle);
  console.log('Bundle syntax is 100% valid!');
} catch (e) {
  console.error('Fatal bundle syntax error:', e);
  process.exit(1);
}

fs.writeFileSync(bundlePath, newBundle);
console.log('SUCCESS: Successfully patched assets/index-C_N6_LWa.js with all new features!');
