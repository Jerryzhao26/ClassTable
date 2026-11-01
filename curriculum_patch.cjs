// Apply textbook ownership to the generated browser bundle. Keep the legacy
// level fields in stored records for compatibility with existing schedules.
const fs = require('node:fs');
const defaults = JSON.parse(fs.readFileSync('default-curriculum.json', 'utf8'));
module.exports = function patchCurriculum(bundle) {
  function replace(oldText, newText) {
    if (!bundle.includes(oldText)) throw new Error('Curriculum patch target missing: ' + oldText.slice(0, 80));
    bundle = bundle.replace(oldText, newText);
  }
  // These are curriculum defaults only. Never embed backup schedules or staff data.
  replace('Vo=[Ih,Ph,em,tm,lm,am]', 'Vo=' + JSON.stringify(defaults.templates));
  const oldBooks = bundle.match(/yi=\[[^\]]*\]/);
  if (!oldBooks) throw new Error('Default textbook list not found');
  replace(oldBooks[0], 'yi=' + JSON.stringify(defaults.customTextbooks));
  replace('return im()}),[Me,pe]=_.useState', 'return []}),[Me,pe]=_.useState');
  replace('Db=({schedules:r,onSelectSchedule:T})=>{const[j,u]=_.useState(2026),[N,D]=_.useState(8)', 'Db=({schedules:r,onSelectSchedule:T})=>{const[j,u]=_.useState(()=>new Date().getFullYear()),[N,D]=_.useState(()=>new Date().getMonth())');
  // New classes use the selected textbook, not legacy level codes, in their name.
  replace('[Y,ae]=_.useState("2026秋-Big Fun 1-01班"),[J,de]=_.useState("Big Fun 1")', '[Y,ae]=_.useState(`${new Date().getFullYear()}-${((u.find(t=>t.id===Q)||u[0])?.textbook)||"教材"}-01班`),[J,de]=_.useState(((u.find(t=>t.id===Q)||u[0])?.textbook)||"教材")');
  replace('if(matchedTpl){Z(matchedTpl.id);X(!0)}else{X(!1)}', 'if(matchedTpl){Z(matchedTpl.id);X(!0)}else{Z(u[0]?.id||"");X(!0)}');
  replace('lt=`2026秋-${(re==null?void 0:re.name.split(" ")[0])||"K1"}-${Te}(周${w})01班`', 'lt=`${new Date().getFullYear()}-${J.trim()||"教材"}-${Te}(周${w})01班`');
  replace('onChange:w=>Z(w.target.value),className:"w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",children:u.map', 'onChange:w=>{Z(w.target.value);const selected=u.find(t=>t.id===w.target.value);selected&&selected.textbook&&de(selected.textbook)},className:"w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",children:u.map');
  // Each generated lesson owns its textbook, including when a class advances midmonth.
  replace('ue=_.useMemo(()=>Vt.map(w=>({...w,lessonCode:', 'ue=_.useMemo(()=>Vt.map(w=>({...w,textbook:J.trim()||(Se==null?void 0:Se.textbook)||"未设教材",lessonCode:');
  replace('[Vt,M,Fe]),oe=', '[Vt,M,Fe,J,Se]),oe=');
  replace('const combinedLessons=[...(targetClass.lessons||[]),...reindexedNewLessons];', 'const combinedLessons=[...(targetClass.lessons||[]).map(lesson=>({...lesson,textbook:lesson.textbook||targetClass.textbook||"未设教材"})),...reindexedNewLessons];');
  // A template with an explicit textbook must agree with the chosen textbook.
  replace('const updatedClass={...targetClass,', 'if(b&&Se&&Se.textbook&&J.trim()!==Se.textbook){alert("教材与课程模板不一致，请选择对应教材");return}const updatedClass={...targetClass,');
  replace('}else{const w={id:`cls_${Date.now()}`', '}else{if(b&&Se&&Se.textbook&&J.trim()!==Se.textbook){alert("教材与课程模板不一致，请选择对应教材");return}const w={id:`cls_${Date.now()}`');
  // The class information editor changes the current textbook without rewriting history.
  replace('textbook: Ne.trim() || "Big Fun 1",', 'textbook: Ne.trim() || "未设教材",\n                      lessons: r.lessons.map(lesson => ({...lesson, textbook: lesson.textbook || r.textbook || "未设教材"})),');
  // Per-lesson editing and display in the class progress view.
  replace('s.jsx("th", { className: "py-3 px-2 w-14 text-[11px]", children: "星期" }),', 's.jsx("th", { className: "py-3 px-2 w-14 text-[11px]", children: "星期" }),s.jsx("th", { className: "py-3 px-2 w-32 text-[11px]", children: "教材" }),');
  replace('const createdLesson = {\n      id: "les_ins_"', 'const createdLesson = {\n      textbook: (orig[targetIdx] || orig[targetIdx - 1] || {}).textbook || r.textbook || "未设教材",\n      id: "les_ins_"');
  replace('s.jsx("td", { className: "py-2.5 px-2 text-slate-600 font-medium", children: M.dayOfWeekStr }),', 's.jsx("td", { className: "py-2.5 px-2 text-slate-600 font-medium", children: M.dayOfWeekStr }),\n                    s.jsx("td", { className: "py-2.5 px-2", children: s.jsx("input", { type: "text", value: M.textbook || r.textbook || "", onChange: ze => bt(M.id, "textbook", ze.target.value), title: "本节课使用的教材", className: "w-32 px-2 py-1 text-xs border border-amber-200 rounded" }) }),');
  replace('const Fe = M.lessonCode.toLowerCase().includes(b.toLowerCase()) ||', 'const Fe = (M.textbook || r.textbook || "").toLowerCase().includes(b.toLowerCase()) || M.lessonCode.toLowerCase().includes(b.toLowerCase()) ||');
  // Calendar cell and detail modal use the lesson's textbook.
  replace('s.jsx("span", { children: d.lessonCode }),', 's.jsx("span", { children: (d.textbook || y.textbook || "未设教材") + " · " + d.lessonCode }),');
  replace('children: ["教材: ", J.schedule.textbook || "Big Fun 1"]', 'children: ["教材: ", J.lesson.textbook || J.schedule.textbook || "未设教材"]');
  replace('children: r.textbook || "Big Fun 1"', 'children: (window.ClassTableTextbook.current(r).upcoming ? "即将使用: " : "当前教材: ") + window.ClassTableTextbook.current(r).textbook');
  // Excel rows and textbook filter must be evaluated per lesson.
  replace('if (exportTextbookFilter !== "all" && classTextbook !== exportTextbookFilter) return;\n      (sched.lessons || []).forEach(les => {', '(sched.lessons || []).forEach(les => {\n        if (exportTextbookFilter !== "all" && (les.textbook || classTextbook) !== exportTextbookFilter) return;');
  replace('textbook: classTextbook,\n          classFrequency:', 'textbook: les.textbook || classTextbook,\n          classFrequency:');
  // The upgrade action changes textbook ownership from the selected lesson onward.
  replace('if(V<Q)return Z;const ie=b[V-Q];return ie?{...Z,unit:', 'if(V<Q)return {...Z,textbook:Z.textbook||r.textbook||"未设教材"};const ie=b[V-Q];return ie?{...Z,textbook:j.textbook||j.name,unit:');
  replace('return{...r,levelName:S,lessons:X,updatedAt:', 'return{...r,textbook:j.textbook||j.name,lessons:X,updatedAt:');
  replace('const T=["课次编号","上课日期","星期","时间段","单元","课程代码"', 'const T=["课次编号","上课日期","星期","时间段","教材","单元","课程代码"');
  replace('H.dayOfWeekStr,H.timeSlot,`U${H.unit}`', 'H.dayOfWeekStr,H.timeSlot,H.textbook||r.textbook||"未设教材",`U${H.unit}`');
  replace('级别: ${r.levelName}, 授课老师:', '当前教材: ${window.ClassTableTextbook.current(r).textbook}, 授课老师:');
  // A class label follows today's lesson date, including a future planned switch.
  replace('children: O.textbook || "Big Fun 1"', 'children: (window.ClassTableTextbook.current(O).upcoming ? "即将使用: " : "当前教材: ") + window.ClassTableTextbook.current(O).textbook');
  replace('children: P.lessonCode', 'children: (P.textbook || O.textbook || "未设教材") + " · " + P.lessonCode');
  replace('children: ["教材: ", y.textbook || (T && T.find(t => t.id === y.templateId)?.textbook) || "未设教材"]', 'children: [window.ClassTableTextbook.current(y).upcoming ? "即将使用: " : "当前教材: ", window.ClassTableTextbook.current(y).textbook]');
  replace('children: ["课次详情: ", J.lesson.lessonCode]', 'children: ["课次详情: ", J.lesson.textbook || J.schedule.textbook || "未设教材", " · ", J.lesson.lessonCode]');
  // Replace the obsolete level label in copied progress messages and print heading.
  replace('📚 课程级别：${r.levelName}', '📚 当前教材：${r.textbook || "未设教材"}');
  replace('📚 当前教材：${r.textbook || "未设教材"}', '📚 ${window.ClassTableTextbook.current(r).upcoming?"即将使用":"当前教材"}：${window.ClassTableTextbook.current(r).textbook}');
  replace('【${j.lessonCode}】', '【${j.textbook || r.textbook || "未设教材"} · ${j.lessonCode}】');
  // Hide the obsolete level selector while retaining its legacy data for compatibility.
  replace('s.jsx("button",{type:"button",onClick:()=>X(!1),className:`px-2.5 py-0.5 rounded-full transition-colors ${b?"text-slate-500 hover:text-slate-900":"bg-indigo-600 text-white shadow-xs"}`,children:"基础级别规则"})', 'null');
  replace('填入班级信息、周几上课、级别，系统自动按照 Beaver 教学大纲规律推算后续日期与 U1L1、U1L2 课次编号', '填入班级信息、周几上课和教材模板，系统自动推算后续日期与课次编号');
  return bundle;
};
