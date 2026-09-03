_b=({activeTab:r,setActiveTab:T,totalClassesCount:j,activeLessonsThisWeekCount:u,onOpenQuickWizard:N,isEditAuthorized:D,onOpenAuthModal:Q,onLockEdit:H,gistId:R,onOpenGistModal:b,onExportBackup:propExportBackup,onRestoreBackup:propRestoreBackup})=>{
  const [headerNotice, setHeaderNotice] = _.useState(null);

  const triggerHeaderNotice = (msg, type = "success") => {
    setHeaderNotice({ msg, type });
    setTimeout(() => setHeaderNotice(null), 3500);
  };

  const handleHeaderRestore = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data && (data.schedules || data.templates || data.levels || data.teachers)) {
          if (typeof propRestoreBackup === "function") {
            propRestoreBackup(data, (applied) => {
              const sCount = (applied.schedules || []).length;
              const tCount = (applied.templates || []).length;
              triggerHeaderNotice(`🎉 成功恢复备份数据！已载入 ${sCount} 个班级排课与 ${tCount} 套课程体系模板。`, "success");
            });
          } else {
            if (data.schedules) localStorage.setItem("beavers_schedules", JSON.stringify(data.schedules));
            if (data.templates) localStorage.setItem("beavers_templates", JSON.stringify(data.templates));
            if (data.levels) localStorage.setItem("beavers_levels", JSON.stringify(data.levels));
            if (data.holidays) localStorage.setItem("beavers_holidays", JSON.stringify(data.holidays));
            if (data.teachers) localStorage.setItem("beavers_teachers", JSON.stringify(data.teachers));
            if (data.customTextbooks) localStorage.setItem("beavers_custom_textbooks", JSON.stringify(data.customTextbooks));
            triggerHeaderNotice("🎉 本地数据已恢复成功！", "success");
            setTimeout(() => window.location.reload(), 1000);
          }
        } else {
          triggerHeaderNotice("所选文件格式不正确：未检测到有效的排课或模板备份数据 (.json)", "error");
        }
      } catch (err) {
        triggerHeaderNotice("读取备份文件失败: " + err.message, "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return s.jsxs("header", {
    className: "bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs",
    children: [
      headerNotice && s.jsxs("div", {
        className: `px-4 py-2 text-xs font-bold text-center text-white flex items-center justify-center space-x-2 animate-fadeIn ${
          headerNotice.type === "error" ? "bg-rose-600" : "bg-emerald-600"
        }`,
        children: [
          s.jsx(headerNotice.type === "error" ? yf : Ko, { className: "w-4 h-4 text-white" }),
          s.jsx("span", { children: headerNotice.msg })
        ]
      }),
      s.jsxs("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        children: [
          s.jsxs("div", {
            className: "flex items-center justify-between h-16",
            children: [
              s.jsxs("div", {
                className: "flex items-center space-x-3 cursor-pointer",
                onClick: () => T("overview"),
                children: [
                  s.jsx("div", {
                    className: "w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200",
                    children: "B"
                  }),
                  s.jsxs("div", {
                    children: [
                      s.jsxs("div", {
                        className: "flex items-center space-x-2",
                        children: [
                          s.jsxs("span", {
                            className: "font-extrabold text-lg text-slate-900 tracking-tight",
                            children: ["Beavers ", s.jsx("span", { className: "text-indigo-600", children: "Education" })]
                          }),
                          s.jsx("span", {
                            className: "bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-indigo-100",
                            children: "比伯斯教育"
                          })
                        ]
                      }),
                      s.jsx("p", {
                        className: "text-xs text-slate-500 hidden sm:block",
                        children: "智能课程进度表与排课效率系统"
                      })
                    ]
                  })
                ]
              }),
              s.jsxs("div", {
                className: "hidden xl:flex items-center space-x-6 text-xs text-slate-600 bg-slate-50 py-1.5 px-3.5 rounded-full border border-slate-200",
                children: [
                  s.jsxs("div", {
                    className: "flex items-center space-x-1.5",
                    children: [
                      s.jsx("span", { className: "w-2 h-2 rounded-full bg-indigo-500 animate-pulse" }),
                      s.jsx("span", { children: "在培班级:" }),
                      s.jsxs("span", { className: "font-bold text-slate-800 text-sm", children: [j, " 个"] })
                    ]
                  }),
                  s.jsx("div", { className: "h-3 w-px bg-slate-300" }),
                  s.jsxs("div", {
                    className: "flex items-center space-x-1.5",
                    children: [
                      s.jsx("span", { children: "本月销课:" }),
                      s.jsxs("span", { className: "font-bold text-indigo-600 text-sm", children: [u, " 节"] })
                    ]
                  })
                ]
              }),
              s.jsxs("div", {
                className: "flex items-center space-x-2 sm:space-x-2.5",
                children: [
                  s.jsxs("button", {
                    onClick: b,
                    className: `inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                      R ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`,
                    title: "配置 GitHub Gist 云存储与在线共享",
                    children: [
                      s.jsx(jf, { className: `w-3.5 h-3.5 ${R ? "text-emerald-600" : "text-slate-500"}` }),
                      s.jsx("span", { className: "hidden sm:inline", children: R ? "云数据已关联" : "云端 Gist 同步" }),
                      s.jsx("span", { className: "sm:hidden", children: "云同步" })
                    ]
                  }),
                  // 一键导入恢复按钮
                  s.jsxs("label", {
                    className: "inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all shadow-2xs cursor-pointer group",
                    title: "选择本地 .json 备份文件一键恢复系统数据",
                    children: [
                      s.jsx(Om, { className: "w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" }),
                      s.jsx("span", { className: "hidden md:inline", children: "一键导入恢复" }),
                      s.jsx("span", { className: "md:hidden", children: "导入" }),
                      s.jsx("input", {
                        type: "file",
                        accept: ".json",
                        className: "hidden",
                        onChange: handleHeaderRestore
                      })
                    ]
                  }),
                  // 一键本地备份按钮
                  s.jsxs("button", {
                    type: "button",
                    onClick: () => {
                      if (typeof propExportBackup === "function") {
                        propExportBackup();
                      } else {
                        try {
                          const payload = {
                            version: "1.0.0",
                            exportedAt: new Date().toLocaleString(),
                            exportTimestamp: new Date().toISOString(),
                            system: "Beavers Education 课程进度表管理系统",
                            schedules: JSON.parse(localStorage.getItem("beavers_schedules") || "[]"),
                            templates: JSON.parse(localStorage.getItem("beavers_templates") || "[]"),
                            levels: JSON.parse(localStorage.getItem("beavers_levels") || "[]"),
                            holidays: JSON.parse(localStorage.getItem("beavers_holidays") || "[]"),
                            teachers: JSON.parse(localStorage.getItem("beavers_teachers") || "[]"),
                            customTextbooks: JSON.parse(localStorage.getItem("beavers_custom_textbooks") || "[]")
                          };
                          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          const dateStr = new Date().toISOString().split("T")[0];
                          a.setAttribute("href", url);
                          a.setAttribute("download", `Beavers_排课系统全量备份_${dateStr}.json`);
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } catch (e) {
                          console.error("Backup failed", e);
                        }
                      }
                    },
                    className: "inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs group",
                    title: "一键导出排课系统全量备份到本地 (.json)",
                    children: [
                      s.jsx(Nf, { className: "w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 transition-colors" }),
                      s.jsx("span", { className: "hidden md:inline", children: "一键本地备份" }),
                      s.jsx("span", { className: "md:hidden", children: "备份" })
                    ]
                  }),
                  D ? s.jsxs("button", {
                    onClick: H,
                    className: "inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all group",
                    title: "已解锁修改权限 (点击可重新上锁)",
                    children: [
                      s.jsx(lb, { className: "w-3.5 h-3.5 text-emerald-600 group-hover:text-rose-600" }),
                      s.jsx("span", { className: "hidden sm:inline", children: "编辑已解锁" }),
                      s.jsx("span", { className: "sm:hidden", children: "已解锁" })
                    ]
                  }) : s.jsxs("button", {
                    onClick: Q,
                    className: "inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all shadow-2xs",
                    title: "当前为只读模式，点击解锁编辑权限",
                    children: [
                      s.jsx(Sf, { className: "w-3.5 h-3.5 text-amber-600 animate-pulse" }),
                      s.jsxs("span", {
                        children: ["只读模式 ", s.jsx("span", { className: "text-[10px] underline font-normal ml-0.5", children: "解锁" })]
                      })
                    ]
                  }),
                  s.jsxs("button", {
                    onClick: N,
                    className: "inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-full shadow-lg shadow-indigo-200 transition-all focus:ring-2 focus:ring-indigo-500/20",
                    children: [
                      s.jsx(sl, { className: "w-4 h-4 text-amber-300" }),
                      s.jsx("span", { children: "新建班级" })
                    ]
                  })
                ]
              })
            ]
          }),
          s.jsxs("div", {
            className: "flex space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar border-t border-slate-100 pt-2 pb-2 text-sm",
            children: [
              s.jsxs("button", {
                onClick: () => T("overview"),
                className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap text-xs ${
                  r === "overview" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`,
                children: [
                  s.jsx(Im, { className: "w-4 h-4" }),
                  s.jsx("span", { children: "月度班级进度总览" }),
                  s.jsx("span", {
                    className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      r === "overview" ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-700"
                    }`,
                    children: "首页"
                  })
                ]
              }),
              s.jsxs("button", {
                onClick: () => T("schedules"),
                className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap text-xs ${
                  r === "schedules" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`,
                children: [
                  s.jsx(Nt, { className: "w-4 h-4" }),
                  s.jsx("span", { children: "班级课表与列表" })
                ]
              }),
              s.jsxs("button", {
                onClick: () => T("templates"),
                className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap text-xs ${
                  r === "templates" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`,
                children: [
                  s.jsx(pm, { className: "w-4 h-4 text-indigo-500" }),
                  s.jsx("span", { children: "课程体系与模板库" })
                ]
              }),
              s.jsxs("button", {
                onClick: () => T("wizard"),
                className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap text-xs ${
                  r === "wizard" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`,
                children: [
                  s.jsx(sl, { className: "w-4 h-4 text-amber-500" }),
                  s.jsx("span", { children: "排课向导 (自动建表)" })
                ]
              }),
              s.jsxs("button", {
                onClick: () => T("calendar"),
                className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap text-xs ${
                  r === "calendar" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`,
                children: [
                  s.jsx(jm, { className: "w-4 h-4" }),
                  s.jsx("span", { children: "机构全景日历" })
                ]
              }),
              s.jsxs("button", {
                onClick: () => T("holidays"),
                className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap text-xs ${
                  r === "holidays" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`,
                children: [
                  s.jsx(rs, { className: "w-4 h-4" }),
                  s.jsx("span", { children: "节假日与停课" })
                ]
              }),
              s.jsxs("button", {
                onClick: () => T("teachers"),
                className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap text-xs ${
                  r === "teachers" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`,
                children: [
                  s.jsx(jb, { className: "w-4 h-4" }),
                  s.jsx("span", { children: "授课教师协同" })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};
