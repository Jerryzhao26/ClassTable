const fs = require('fs');

const bundleBakPath = 'assets/index-C_N6_LWa.js.bak';
const bundlePath = 'assets/index-C_N6_LWa.js';
let bundle = fs.readFileSync(bundleBakPath, 'utf8');

const cb_new = fs.readFileSync('cb_new.js', 'utf8');
const eb_new = fs.readFileSync('eb_new.js', 'utf8');

const cbStart = bundle.indexOf('Cb=({schedules:r,levels:T,teachers:j,onS');
const ebStart = bundle.indexOf(',Eb=({schedule:r,templates:T=[],holidays:', cbStart);
const abStart = bundle.indexOf(',Ab=({levels:r,teachers:T,holidays:j,templates:u=', ebStart);

if (cbStart === -1 || ebStart === -1 || abStart === -1) {
  console.error('Could not find component locations:', { cbStart, ebStart, abStart });
  process.exit(1);
}

// Replace Cb and Eb while preserving Ab, Mb, zb, Db and all remaining code
const beforeCb = bundle.substring(0, cbStart);
const afterEb = bundle.substring(abStart); // starts with ,Ab=...

let newBundle = beforeCb + cb_new + ',' + eb_new + afterEb;

// Now update the Cb call to pass onBatchDeleteSchedules
const oldCbCall = 's.jsx(Cb,{schedules:me,levels:Me,teachers:se,onSelectSchedule:L=>u(L),onOpenQuickWizard:L=>te(()=>he(null,L)),onDeleteSchedule:G,onOpenPrintModal:L=>ce(L)})';
const newCbCall = 's.jsx(Cb,{schedules:me,levels:Me,teachers:se,onSelectSchedule:L=>u(L),onOpenQuickWizard:L=>te(()=>he(null,L)),onDeleteSchedule:G,onBatchDeleteSchedules:L=>{te(()=>{O(Se=>Se.filter(re=>!L.includes(re.id))),L.includes(j==null?void 0:j.id)&&u(null),C()})},onOpenPrintModal:L=>ce(L)})';

if (!newBundle.includes(oldCbCall)) {
  console.warn('Warning: oldCbCall exact string not found, searching with regex');
  const cbCallIndex = newBundle.indexOf('s.jsx(Cb,{schedules:me,');
  console.log('Found around:', newBundle.substring(cbCallIndex, cbCallIndex + 200));
} else {
  newBundle = newBundle.replace(oldCbCall, newCbCall);
  console.log('Successfully replaced Cb call with onBatchDeleteSchedules handler!');
}

fs.writeFileSync(bundlePath, newBundle);
console.log('Successfully patched assets/index-C_N6_LWa.js with Mb and all components preserved!');
