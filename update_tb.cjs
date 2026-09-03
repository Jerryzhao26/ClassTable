const fs = require('fs');
const vm = require('vm');

let code = fs.readFileSync('tb_new.js', 'utf8');

// 1. Update component signature
const oldSignature = 'Tb=({schedules:r,templates:T,teachers:j,onSelectSchedule:u,onOpenWizard:N,onUpdateLessonStatus:D,onExportBackup:propExportBackup})=>{';
const newSignature = 'Tb=({schedules:r,templates:T,teachers:j,onSelectSchedule:u,onOpenWizard:N,onUpdateLessonStatus:D,onExportBackup:propExportBackup,onRestoreBackup:propRestoreBackup})=>{';

if (!code.includes(oldSignature)) {
  console.error('oldSignature not found');
  process.exit(1);
}
code = code.replace(oldSignature, newSignature);

// 2. Add restore backup state and functions right after showNotice
const targetNoticeEnd = '    setTimeout(() => setNotice(""), 3500);\n  };';
const restoreLogic = `    setTimeout(() => setNotice(""), 3500);
  };

  // Local Backup Restore State & Handlers
  const [restoreConfirmData, setRestoreConfirmData] = _.useState(null);
  const restoreFileInputRef = _.useRef(null);

  const handleTriggerRestoreFile = () => {
    if (restoreFileInputRef.current) {
      restoreFileInputRef.current.click();
    }
  };

  const handleRestoreFileSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed && (parsed.schedules || parsed.templates || parsed.levels || parsed.teachers)) {
          setRestoreConfirmData(parsed);
        } else {
          showNotice("所选文件格式不正确：未检测到有效的排课或模板备份数据 (.json)", "error");
        }
      } catch (err) {
        showNotice("读取并解析备份文件失败: " + err.message, "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExecuteRestore = () => {
    if (!restoreConfirmData) return;
    try {
      if (typeof propRestoreBackup === "function") {
        propRestoreBackup(restoreConfirmData, (applied) => {
          const sCount = (applied.schedules || []).length;
          const tCount = (applied.templates || []).length;
          showNotice(\`🎉 成功从本地备份恢复数据！已载入 \${sCount} 个班级排课与 \${tCount} 套课程体系模板。\`, "success");
        });
      } else {
        if (restoreConfirmData.schedules) localStorage.setItem("beavers_schedules", JSON.stringify(restoreConfirmData.schedules));
        if (restoreConfirmData.templates) localStorage.setItem("beavers_templates", JSON.stringify(restoreConfirmData.templates));
        if (restoreConfirmData.levels) localStorage.setItem("beavers_levels", JSON.stringify(restoreConfirmData.levels));
        if (restoreConfirmData.holidays) localStorage.setItem("beavers_holidays", JSON.stringify(restoreConfirmData.holidays));
        if (restoreConfirmData.teachers) localStorage.setItem("beavers_teachers", JSON.stringify(restoreConfirmData.teachers));
        if (restoreConfirmData.customTextbooks) localStorage.setItem("beavers_custom_textbooks", JSON.stringify(restoreConfirmData.customTextbooks));
        showNotice("🎉 本地数据已恢复成功！", "success");
        setTimeout(() => window.location.reload(), 1000);
      }
      setRestoreConfirmData(null);
    } catch (err) {
      showNotice("恢复备份失败: " + err.message, "error");
    }
  };`;

if (!code.includes(targetNoticeEnd)) {
  console.error('targetNoticeEnd not found');
  process.exit(1);
}
code = code.replace(targetNoticeEnd, restoreLogic);

// 3. Update Banner Action Buttons Cluster & Subtitle
const oldBannerCluster = `          // Action Buttons Cluster
          s.jsxs("div", {
            className: "flex flex-wrap items-center gap-2.5 shrink-0",
            children: [
              s.jsxs("button", {
                type: "button",
                onClick: handleExportBackup,
                className: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-full shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-1.5 group",
                title: "一键导出全量排课与系统备份数据到本地 (.json)",
                children: [
                  s.jsx(Nf, { className: "w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 transition-colors" }),
                  s.jsx("span", { children: "一键本地备份" })
                ]
              }),
              s.jsxs("button", {
                type: "button",
                onClick: () => setIsExportExcelModalOpen(true),
                className: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center space-x-1.5 shadow-emerald-200/50",
                title: "自定义时间区间导出排课总览 Excel 表格",
                children: [
                  s.jsx(Nf, { className: "w-4 h-4 text-emerald-100" }),
                  s.jsx("span", { children: "导出总览 Excel" })
                ]
              }),
              s.jsxs("button", {
                onClick: N,
                className: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-sm transition-colors flex items-center space-x-1.5",
                children: [
                  s.jsx(sl, { className: "w-4 h-4 text-amber-300" }),
                  s.jsx("span", { children: "新建班级排课" })
                ]
              })
            ]
          })`;

const newBannerCluster = `          // Action Buttons Cluster - Highly Visible Export & Import Tools
          s.jsxs("div", {
            className: "flex flex-wrap items-center gap-3 shrink-0",
            children: [
              // Hidden file input for restore
              s.jsx("input", {
                type: "file",
                ref: restoreFileInputRef,
                accept: ".json",
                className: "hidden",
                onChange: handleRestoreFileSelected
              }),

              // 1. Super Prominent Export Excel Button
              s.jsxs("button", {
                type: "button",
                onClick: () => setIsExportExcelModalOpen(true),
                className: "relative group overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/40 border border-emerald-500 transition-all flex items-center space-x-2.5 cursor-pointer",
                title: "自定义起止时间区间，导出排课总览与明细 Excel 表格",
                children: [
                  s.jsx("div", {
                    className: "w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform",
                    children: s.jsx(Nf, { className: "w-4 h-4 text-white stroke-[2.5]" })
                  }),
                  s.jsxs("div", {
                    className: "text-left leading-tight",
                    children: [
                      s.jsxs("span", { className: "block text-xs font-black tracking-wide text-white flex items-center space-x-1.5", children: [
                        s.jsx("span", { children: "导出总览 Excel" }),
                        s.jsx("span", { className: "bg-white/25 text-emerald-100 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold", children: "XLSX" })
                      ]}),
                      s.jsx("span", { className: "text-[10px] text-emerald-100/90 font-normal mt-0.5 block", children: "自定义区间 · 教师 · 状态" })
                    ]
                  })
                ]
              }),

              // 2. Clear One-Click Restore Local Backup Button
              s.jsxs("button", {
                type: "button",
                onClick: handleTriggerRestoreFile,
                className: "bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 hover:border-indigo-300 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2 cursor-pointer group",
                title: "选择本地 .json 备份文件一键恢复系统数据",
                children: [
                  s.jsx("div", {
                    className: "w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-200 transition-colors",
                    children: s.jsx(Om, { className: "w-4 h-4" })
                  }),
                  s.jsxs("div", {
                    className: "text-left leading-tight",
                    children: [
                      s.jsxs("span", { className: "block text-xs font-extrabold text-indigo-900 flex items-center space-x-1", children: [
                        s.jsx("span", { children: "一键导入恢复" }),
                        s.jsx("span", { className: "bg-indigo-200/60 text-indigo-800 text-[9px] px-1 rounded font-mono font-bold", children: "JSON" })
                      ]}),
                      s.jsx("span", { className: "text-[10px] text-indigo-600/80 font-normal mt-0.5 block", children: "读取本地备份覆盖" })
                    ]
                  })
                ]
              }),

              // 3. One-Click Local Backup Button
              s.jsxs("button", {
                type: "button",
                onClick: handleExportBackup,
                className: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2 cursor-pointer group",
                title: "一键导出全量排课与系统配置备份到本地 (.json)",
                children: [
                  s.jsx("div", {
                    className: "w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors",
                    children: s.jsx(Nf, { className: "w-4 h-4 group-hover:text-indigo-600" })
                  }),
                  s.jsxs("div", {
                    className: "text-left leading-tight",
                    children: [
                      s.jsx("span", { className: "block text-xs font-extrabold text-slate-800", children: "一键本地备份" }),
                      s.jsx("span", { className: "text-[10px] text-slate-500 font-normal mt-0.5 block", children: "下载全量备份数据" })
                    ]
                  })
                ]
              }),

              // 4. New Schedule Wizard Button
              s.jsxs("button", {
                type: "button",
                onClick: N,
                className: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center space-x-2",
                children: [
                  s.jsx(sl, { className: "w-4 h-4 text-amber-300" }),
                  s.jsx("span", { children: "新建班级排课" })
                ]
              })
            ]
          })`;

if (!code.includes(oldBannerCluster)) {
  console.error('oldBannerCluster not found');
  process.exit(1);
}
code = code.replace(oldBannerCluster, newBannerCluster);

// 4. In Filters and Stats Bar, add quick Excel export shortcut
const oldStatsCluster = `              s.jsxs("div", {
                className: "text-center",
                children: [
                  s.jsx("span", { className: "text-[10px] text-slate-400 block font-bold", children: "本月排课" }),
                  s.jsxs("span", { className: "font-extrabold text-indigo-600", children: [se.totalLessonsThisMonth, " 节"] })
                ]
              })
            ]
          })`;

const newStatsCluster = `              s.jsxs("div", {
                className: "text-center",
                children: [
                  s.jsx("span", { className: "text-[10px] text-slate-400 block font-bold", children: "本月排课" }),
                  s.jsxs("span", { className: "font-extrabold text-indigo-600", children: [se.totalLessonsThisMonth, " 节"] })
                ]
              }),
              s.jsx("div", { className: "h-6 w-px bg-slate-200" }),
              s.jsxs("button", {
                type: "button",
                onClick: () => setIsExportExcelModalOpen(true),
                className: "px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-full transition-all shadow-2xs hover:shadow-xs flex items-center space-x-1.5 cursor-pointer shrink-0",
                title: "快速打开导出总览 Excel 对话框",
                children: [
                  s.jsx(Nf, { className: "w-3.5 h-3.5 text-emerald-600" }),
                  s.jsx("span", { children: "导出总览 Excel" })
                ]
              })
            ]
          })`;

if (!code.includes(oldStatsCluster)) {
  console.error('oldStatsCluster not found');
  process.exit(1);
}
code = code.replace(oldStatsCluster, newStatsCluster);

// 5. Enhance modal download button
const oldModalDownloadBtn = `                s.jsxs("button", {
                  type: "button",
                  onClick: handleDownloadOverviewExcel,
                  disabled: exportMatchingLessons.length === 0,
                  className: "px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 text-xs",
                  children: [
                    s.jsx(Nf, { className: "w-4 h-4 text-emerald-100" }),
                    s.jsxs("span", { children: ["下载 Excel 表格 (共 ", exportStats.totalLessons, " 节课)"] })
                  ]
                })`;

const newModalDownloadBtn = `                s.jsxs("button", {
                  type: "button",
                  onClick: handleDownloadOverviewExcel,
                  disabled: exportMatchingLessons.length === 0,
                  className: "px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] disabled:opacity-50 text-white font-black rounded-xl shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/30 transition-all flex items-center space-x-2 text-xs cursor-pointer",
                  children: [
                    s.jsx(Nf, { className: "w-4 h-4 text-emerald-100 stroke-[2.5]" }),
                    s.jsxs("span", { children: ["立即下载排课总览 Excel 表格 (共 ", exportStats.totalLessons, " 节课)"] })
                  ]
                })`;

if (code.includes(oldModalDownloadBtn)) {
  code = code.replace(oldModalDownloadBtn, newModalDownloadBtn);
}

// 6. Add Restore Confirmation Modal right before closing tags
const targetClosing = `    ]
  });
};`;

const restoreModalSnippet = `,
      // Restore Confirmation Modal
      restoreConfirmData && s.jsx("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn",
        children: s.jsxs("div", {
          className: "bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp",
          children: [
            // Header
            s.jsxs("div", {
              className: "flex items-center space-x-3 pb-3 border-b border-slate-100",
              children: [
                s.jsx("div", {
                  className: "w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs",
                  children: s.jsx(Om, { className: "w-5 h-5" })
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("h3", { className: "text-base font-black text-slate-900", children: "确认导入本地备份数据" }),
                    s.jsx("p", { className: "text-xs text-slate-500", children: "已成功解析 .json 备份文件，请核对下方数据概要" })
                  ]
                })
              ]
            }),

            // Data summary card
            s.jsxs("div", {
              className: "bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3",
              children: [
                s.jsxs("div", {
                  className: "grid grid-cols-2 gap-3 text-xs",
                  children: [
                    s.jsxs("div", {
                      className: "bg-white p-3 rounded-xl border border-slate-200 shadow-2xs",
                      children: [
                        s.jsx("span", { className: "text-slate-400 block text-[11px]", children: "包含班级排课" }),
                        s.jsxs("span", { className: "text-base font-black text-slate-900", children: [(restoreConfirmData.schedules || []).length, " 个班级"] })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "bg-white p-3 rounded-xl border border-slate-200 shadow-2xs",
                      children: [
                        s.jsx("span", { className: "text-slate-400 block text-[11px]", children: "课程体系模板" }),
                        s.jsxs("span", { className: "text-base font-black text-indigo-600", children: [(restoreConfirmData.templates || []).length, " 套模板"] })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "bg-white p-3 rounded-xl border border-slate-200 shadow-2xs",
                      children: [
                        s.jsx("span", { className: "text-slate-400 block text-[11px]", children: "教师人员档案" }),
                        s.jsxs("span", { className: "text-base font-black text-slate-900", children: [(restoreConfirmData.teachers || []).length, " 位教师"] })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "bg-white p-3 rounded-xl border border-slate-200 shadow-2xs",
                      children: [
                        s.jsx("span", { className: "text-slate-400 block text-[11px]", children: "备份创建时间" }),
                        s.jsx("span", { className: "text-xs font-bold text-slate-700 truncate block mt-1", children: restoreConfirmData.exportedAt || restoreConfirmData.updatedAt || "未知时间" })
                      ]
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-2",
                  children: [
                    s.jsx(Sf, { className: "w-4 h-4 text-amber-600 shrink-0 mt-0.5" }),
                    s.jsxs("div", {
                      children: [
                        s.jsx("span", { className: "font-bold", children: "覆盖提示：" }),
                        s.jsx("span", { children: "导入备份将全量更新系统当前的班级排课、模板库及教师配置。若当前有重要未保存的排课，建议先点击“取消”并使用“一键本地备份”。" })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Action buttons
            s.jsxs("div", {
              className: "flex items-center justify-end space-x-3 pt-2",
              children: [
                s.jsx("button", {
                  type: "button",
                  onClick: () => setRestoreConfirmData(null),
                  className: "px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer",
                  children: "取消"
                }),
                s.jsxs("button", {
                  type: "button",
                  onClick: handleExecuteRestore,
                  className: "px-5 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center space-x-2 cursor-pointer hover:scale-102",
                  children: [
                    s.jsx(Om, { className: "w-4 h-4" }),
                    s.jsx("span", { children: "确认并立即覆盖恢复" })
                  ]
                })
              ]
            })
          ]
        })
      })
    ]
  });
};`;

if (!code.includes(targetClosing)) {
  console.error('targetClosing not found');
  process.exit(1);
}
code = code.replace(targetClosing, restoreModalSnippet);

// Validate with vm.Script
console.log('Validating modified tb_new.js syntax...');
try {
  new vm.Script(code);
  console.log('tb_new.js syntax is 100% valid!');
} catch (e) {
  console.error('Syntax error in tb_new.js:', e);
  process.exit(1);
}

fs.writeFileSync('tb_new.js', code);
console.log('Successfully updated tb_new.js!');
