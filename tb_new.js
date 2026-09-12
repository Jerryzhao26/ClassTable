Tb=({schedules:r,templates:T,teachers:j,onSelectSchedule:u,onOpenWizard:N,onUpdateLessonStatus:D,onExportBackup:propExportBackup,onRestoreBackup:propRestoreBackup})=>{
  const [hideEmptyMonth, setHideEmptyMonth] = _.useState(true);
  const Q = _.useMemo(() => {
    if (r.length > 0 && r[0].startDate) {
      const K = r[0].startDate.split("-");
      if (K.length >= 2) return { year: parseInt(K[0]), month: parseInt(K[1]) - 1 };
    }
    const y = new Date;
    return { year: y.getFullYear(), month: y.getMonth() };
  }, [r]);

  const [H, R] = _.useState(Q.year);
  const [b, X] = _.useState(Q.month);
  const [S, Z] = _.useState("all");
  const [V, ie] = _.useState("all");
  const [Y, ae] = _.useState("");
  const [J, de] = _.useState(null);
  const [B, F] = _.useState("");
  const [ve, xe] = _.useState("");
  const [I, me] = _.useState("");

  // Notice toast state
  const [notice, setNotice] = _.useState("");
  const [noticeType, setNoticeType] = _.useState("success");

  const showNotice = (msg, type = "success") => {
    setNotice(msg);
    setNoticeType(type);
    setTimeout(() => setNotice(""), 3500);
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
          showNotice(`🎉 成功从本地备份恢复数据！已载入 ${sCount} 个班级排课与 ${tCount} 套课程体系模板。`, "success");
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
  };

  // Excel Export with Date Range state
  const [isExportExcelModalOpen, setIsExportExcelModalOpen] = _.useState(false);
  const [exportStartDate, setExportStartDate] = _.useState(() => {
    const mStr = String(Q.month + 1).padStart(2, "0");
    return `${Q.year}-${mStr}-01`;
  });
  const [exportEndDate, setExportEndDate] = _.useState(() => {
    const mStr = String(Q.month + 1).padStart(2, "0");
    const lastDay = new Date(Q.year, Q.month + 1, 0).getDate();
    return `${Q.year}-${mStr}-${String(lastDay).padStart(2, "0")}`;
  });
  const [exportTeacherFilter, setExportTeacherFilter] = _.useState("all");
  const [exportClassScope, setExportClassScope] = _.useState("all");
  const [includeStatus, setIncludeStatus] = _.useState({
    completed: true,
    scheduled: true,
    cancelled: false,
    makeup: true
  });
  const [presetRangeKey, setPresetRangeKey] = _.useState("currentMonth");

  // Keep default export range in sync when user navigates months
  _.useEffect(() => {
    if (presetRangeKey === "currentMonth") {
      const mStr = String(b + 1).padStart(2, "0");
      const lastDay = new Date(H, b + 1, 0).getDate();
      setExportStartDate(`${H}-${mStr}-01`);
      setExportEndDate(`${H}-${mStr}-${String(lastDay).padStart(2, "0")}`);
    }
  }, [H, b, presetRangeKey]);

  const applyPresetRange = (key) => {
    setPresetRangeKey(key);
    if (key === "currentMonth") {
      const mStr = String(b + 1).padStart(2, "0");
      const lastDay = new Date(H, b + 1, 0).getDate();
      setExportStartDate(`${H}-${mStr}-01`);
      setExportEndDate(`${H}-${mStr}-${String(lastDay).padStart(2, "0")}`);
    } else if (key === "nextMonth") {
      const nextYear = b === 11 ? H + 1 : H;
      const nextMonth = b === 11 ? 0 : b + 1;
      const mStr = String(nextMonth + 1).padStart(2, "0");
      const lastDay = new Date(nextYear, nextMonth + 1, 0).getDate();
      setExportStartDate(`${nextYear}-${mStr}-01`);
      setExportEndDate(`${nextYear}-${mStr}-${String(lastDay).padStart(2, "0")}`);
    } else if (key === "quarter") {
      const startMStr = String(b + 1).padStart(2, "0");
      const endYear = (b + 2) >= 12 ? H + 1 : H;
      const endMonth = (b + 2) % 12;
      const endMStr = String(endMonth + 1).padStart(2, "0");
      const lastDay = new Date(endYear, endMonth + 1, 0).getDate();
      setExportStartDate(`${H}-${startMStr}-01`);
      setExportEndDate(`${endYear}-${endMStr}-${String(lastDay).padStart(2, "0")}`);
    } else if (key === "currentYear") {
      setExportStartDate(`${H}-01-01`);
      setExportEndDate(`${H}-12-31`);
    } else if (key === "all") {
      let allDates = [];
      r.forEach(sched => (sched.lessons || []).forEach(l => { if (l.date) allDates.push(l.date); }));
      if (allDates.length > 0) {
        allDates.sort();
        setExportStartDate(allDates[0]);
        setExportEndDate(allDates[allDates.length - 1]);
      } else {
        setExportStartDate(`${H}-01-01`);
        setExportEndDate(`${H}-12-31`);
      }
    }
  };

  const O = () => { b === 0 ? (R(H - 1), X(11)) : X(b - 1); };
  const Me = () => { b === 11 ? (R(H + 1), X(0)) : X(b + 1); };
  const pe = () => { const y = new Date; R(y.getFullYear()); X(y.getMonth()); };

  const ye = _.useMemo(() => {
    const y = new Date(H, b + 1, 0).getDate(),
      K = [],
      ce = new Date().toISOString().split("T")[0],
      te = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    for (let d = 1; d <= y; d++) {
      const C = new Date(H, b, d),
        $ = C.getFullYear(),
        W = String(C.getMonth() + 1).padStart(2, "0"),
        G = String(d).padStart(2, "0"),
        he = `${$}-${W}-${G}`,
        Ne = C.getDay(),
        Ve = Ne === 0 || Ne === 6;
      K.push({ dayNum: d, dateStr: he, dayOfWeekStr: te[Ne], isWeekend: Ve, isToday: he === ce });
    }
    return K;
  }, [H, b]);

  const P = _.useMemo(() => {
    const currentMonthStr = `${H}-${String(b + 1).padStart(2, "0")}`;
    return r.filter(y => {
      const K = S === "all" || y.teacher === S,
        ce = V === "all" || y.levelName.includes(V),
        te = Y === "" || y.className.toLowerCase().includes(Y.toLowerCase()) || y.teacher.toLowerCase().includes(Y.toLowerCase()) || y.classroom.toLowerCase().includes(Y.toLowerCase()),
        hasLessons = y.lessons && y.lessons.some(d => d.date && d.date.startsWith(currentMonthStr));
      return K && ce && te && (!hideEmptyMonth || hasLessons);
    });
  }, [r, S, V, Y, H, b, hideEmptyMonth]);

  const se = _.useMemo(() => {
    const y = `${H}-${String(b + 1).padStart(2, "0")}`;
    let K = 0, ce = 0;
    P.forEach(te => {
      te.lessons.forEach(d => {
        d.date.startsWith(y) && (K++, d.status === "completed" && ce++);
      });
    });
    return { activeClasses: P.length, totalLessonsThisMonth: K, completedLessonsThisMonth: ce, scheduledLessonsThisMonth: K - ce };
  }, [P, H, b]);

  const _e = (y, K) => {
    de({ schedule: y, lesson: K });
    me(K.lessonCode);
    F(K.topic);
    xe(K.note || "");
  };

  const A = () => {
    J && (D(J.schedule.id, J.lesson.id, J.lesson.status, ve, B, I), de(null));
  };

  // Filter lessons for Excel Overview Export
  const exportMatchingLessons = _.useMemo(() => {
    if (!exportStartDate || !exportEndDate) return [];
    const sourceSchedules = exportClassScope === "current" ? P : r;
    const list = [];
    sourceSchedules.forEach(sched => {
      (sched.lessons || []).forEach(les => {
        if (!les.date) return;
        if (les.date < exportStartDate || les.date > exportEndDate) return;
        const teacherMatch = exportTeacherFilter === "all" || les.teacher === exportTeacherFilter || sched.teacher === exportTeacherFilter;
        if (!teacherMatch) return;
        if (les.status && includeStatus[les.status] === false) return;
        list.push({
          scheduleId: sched.id,
          className: sched.className,
          levelName: sched.levelName || "",
          textbook: sched.textbook || (T && T.find(t => t.id === sched.templateId)?.textbook) || "未设教材",
          classFrequency: sched.frequency === "1x_week" ? "一周一次" : sched.frequency === "2x_week" ? "一周两次" : "多频/自定义",
          lessonId: les.id,
          lessonIndex: les.lessonIndex,
          date: les.date,
          dayOfWeekStr: les.dayOfWeekStr || "",
          timeSlot: les.timeSlot || "",
          unit: les.unit || "",
          lessonCode: les.lessonCode || `第${les.lessonIndex}次`,
          topic: les.topic || "",
          teacher: les.teacher || sched.teacher || "",
          classroom: les.classroom || sched.classroom || "",
          status: les.status || "scheduled",
          note: les.note || ""
        });
      });
    });

    list.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.timeSlot !== b.timeSlot) return a.timeSlot.localeCompare(b.timeSlot);
      return a.className.localeCompare(b.className);
    });
    return list;
  }, [r, P, exportClassScope, exportStartDate, exportEndDate, exportTeacherFilter, includeStatus]);

  const exportStats = _.useMemo(() => {
    const totalLessons = exportMatchingLessons.length;
    const uniqueClasses = new Set(exportMatchingLessons.map(x => x.className)).size;
    const uniqueTeachers = new Set(exportMatchingLessons.map(x => x.teacher).filter(Boolean)).size;
    const completed = exportMatchingLessons.filter(x => x.status === "completed").length;
    const scheduled = exportMatchingLessons.filter(x => x.status === "scheduled").length;
    const cancelled = exportMatchingLessons.filter(x => x.status === "cancelled").length;
    const makeup = exportMatchingLessons.filter(x => x.status === "makeup").length;
    return { totalLessons, uniqueClasses, uniqueTeachers, completed, scheduled, cancelled, makeup };
  }, [exportMatchingLessons]);

  // One-click local backup
  const handleExportBackup = () => {
    try {
      let backupPayload;
      if (typeof propExportBackup === "function") {
        backupPayload = propExportBackup();
      }
      if (!backupPayload) {
        let storedTemplates = T, storedLevels = [], storedHolidays = [], storedCustomTextbooks = [];
        try { storedTemplates = JSON.parse(localStorage.getItem("beavers_templates") || "null") || T; } catch(e){}
        try { storedLevels = JSON.parse(localStorage.getItem("beavers_levels") || "null") || []; } catch(e){}
        try { storedHolidays = JSON.parse(localStorage.getItem("beavers_holidays") || "null") || []; } catch(e){}
        try { storedCustomTextbooks = JSON.parse(localStorage.getItem("beavers_custom_textbooks") || "null") || []; } catch(e){}
        backupPayload = {
          version: "1.0.0",
          exportedAt: new Date().toLocaleString(),
          exportTimestamp: new Date().toISOString(),
          system: "Beavers Education 课程进度表管理系统",
          schedules: r,
          templates: storedTemplates,
          levels: storedLevels,
          holidays: storedHolidays,
          teachers: j,
          customTextbooks: storedCustomTextbooks
        };
        const jsonString = JSON.stringify(backupPayload, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const dateStr = new Date().toISOString().split("T")[0];
        a.setAttribute("href", url);
        a.setAttribute("download", `Beavers_排课系统全量备份_${dateStr}.json`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      showNotice(`✅ 全量备份已成功导出到本地！已保存 ${r.length} 个班级排课及系统数据的完整 JSON 备份文件。`, "success");
    } catch (err) {
      console.error("Backup export failed:", err);
      showNotice("❌ 导出备份失败: " + err.message, "error");
    }
  };

  // Download Overview Excel CSV
  const handleDownloadOverviewExcel = () => {
    if (exportMatchingLessons.length === 0) {
      showNotice("⚠️ 当前选定时间区间（" + exportStartDate + " 至 " + exportEndDate + "）或筛选条件下暂无课次，请调整起止日期或勾选包含状态后再导出！", "error");
      return;
    }

    const statusLabels = {
      completed: "已上课",
      scheduled: "待上课",
      cancelled: "停课/调休",
      makeup: "补课"
    };

    const escapeCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const metaRows = [
      [`Beavers Education (比伯斯教育) - 班级排课总览表`],
      [`导出时间区间:`, `${exportStartDate} 至 ${exportEndDate}`],
      [`导出时间:`, new Date().toLocaleString()],
      [`统计概览:`, `覆盖班级: ${exportStats.uniqueClasses} 个`, `总课次: ${exportStats.totalLessons} 节`, `已上课: ${exportStats.completed} 节`, `待上课: ${exportStats.scheduled} 节`, `涉及教师: ${exportStats.uniqueTeachers} 位`],
      []
    ];

    const headers = [
      "序号",
      "上课日期",
      "星期",
      "上课时间段",
      "班级名称",
      "授课教师",
      "教材版本",
      "课次序号",
      "课程代码",
      "教学主题与内容安排",
      "教室",
      "课次状态",
      "课后学情备注"
    ];

    const dataRows = exportMatchingLessons.map((item, idx) => [
      idx + 1,
      item.date,
      item.dayOfWeekStr,
      escapeCell(item.timeSlot),
      escapeCell(item.className),
      escapeCell(item.teacher),
      escapeCell(item.textbook || "未设教材"),
      `第${item.lessonIndex}次`,
      escapeCell(item.lessonCode),
      escapeCell(item.topic),
      escapeCell(item.classroom),
      statusLabels[item.status] || item.status,
      escapeCell(item.note)
    ]);

    const csvContent = "\uFEFF" + [
      ...metaRows.map(row => row.join(",")),
      headers.join(","),
      ...dataRows.map(row => row.join(","))
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", downloadUrl);
    a.setAttribute("download", `Beavers_排课总览_${exportStartDate}_至_${exportEndDate}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    setIsExportExcelModalOpen(false);
    showNotice(`🎉 已成功导出排课总览 Excel 表格（${exportStartDate} 至 ${exportEndDate}），共包含 ${exportStats.totalLessons} 节课次数据！`, "success");
  };

  return s.jsxs("div", {
    className: "space-y-5 pb-12",
    children: [
      // Notification banner
      notice && s.jsxs("div", {
        className: `px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-between animate-fadeIn ${
          noticeType === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
        }`,
        children: [
          s.jsxs("div", {
            className: "flex items-center space-x-2",
            children: [
              s.jsx(noticeType === "error" ? yf : Ko, { className: "w-4 h-4 text-white/90" }),
              s.jsx("span", { children: notice })
            ]
          }),
          s.jsx("button", { onClick: () => setNotice(""), className: "text-white/80 hover:text-white font-bold text-sm px-1", children: "✕" })
        ]
      }),

      // Header Banner
      s.jsxs("div", {
        className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4",
        children: [
          s.jsxs("div", {
            children: [
              s.jsxs("div", {
                className: "flex items-center space-x-2 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1",
                children: [
                  s.jsx(sl, { className: "w-4 h-4 text-amber-500" }),
                  s.jsx("span", { children: "Beavers Education 运营视图" })
                ]
              }),
              s.jsxs("h1", {
                className: "text-xl font-black text-slate-900 tracking-tight flex items-center space-x-3",
                children: [
                  s.jsx("span", { children: "月度班级进度总览矩阵" }),
                  s.jsxs("span", {
                    className: "text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 font-mono",
                    children: [H, "年", b + 1, "月"]
                  })
                ]
              }),
              s.jsx("p", {
                className: "text-xs text-slate-500 mt-1",
                children: "班级纵向横向陈列，展示本月每个班的课次安排、对应教学内容及上课状态，支持自定义时间区间导出 Excel 与一键本地备份。"
              })
            ]
          }),

          // Action Buttons Cluster - Highly Visible Export & Import Tools
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
                        s.jsx("span", { children: "下载排课总览 Excel" }),
                        s.jsx("span", { className: "bg-white/25 text-emerald-100 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold", children: "XLSX" })
                      ]}),
                      s.jsx("span", { className: "text-[10px] text-emerald-100/90 font-normal mt-0.5 block", children: "自定义区间 · 导出/下载总览表格" })
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
          })
        ]
      }),

      // Filters and Stats Bar
      s.jsxs("div", {
        className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4",
        children: [
          s.jsxs("div", {
            className: "flex items-center space-x-3",
            children: [
              s.jsxs("div", {
                className: "flex items-center bg-slate-100 rounded-full p-1 border border-slate-200/80",
                children: [
                  s.jsx("button", {
                    onClick: O,
                    className: "p-1.5 hover:bg-white rounded-full text-slate-700 shadow-2xs transition-all",
                    title: "上一个月",
                    children: s.jsx(vf, { className: "w-4 h-4" })
                  }),
                  s.jsxs("span", {
                    className: "px-4 text-xs font-black text-slate-900 font-mono min-w-[100px] text-center",
                    children: [H, "年 ", b + 1, "月"]
                  }),
                  s.jsx("button", {
                    onClick: Me,
                    className: "p-1.5 hover:bg-white rounded-full text-slate-700 shadow-2xs transition-all",
                    title: "下一个月",
                    children: s.jsx(Fo, { className: "w-4 h-4" })
                  })
                ]
              }),
              s.jsxs("button", {
                onClick: pe,
                className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-colors flex items-center space-x-1",
                children: [
                  s.jsx(rs, { className: "w-3.5 h-3.5 text-indigo-600" }),
                  s.jsx("span", { children: "回到本月" })
                ]
              })
            ]
          }),

          s.jsxs("div", {
            className: "flex flex-wrap items-center gap-2.5 text-xs",
            children: [
              s.jsxs("div", {
                className: "flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200",
                children: [
                  s.jsx(Io, { className: "w-3.5 h-3.5 text-slate-400" }),
                  s.jsxs("select", {
                    value: S,
                    onChange: y => Z(y.target.value),
                    className: "bg-transparent font-bold text-slate-700 focus:outline-none",
                    children: [
                      s.jsx("option", { value: "all", children: "全部授课教师" }),
                      j.map(y => s.jsx("option", { value: y.name, children: y.name }, y.id))
                    ]
                  })
                ]
              }),
              s.jsxs("div", {
                className: "relative",
                children: [
                  s.jsx(_i, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" }),
                  s.jsx("input", {
                    type: "text",
                    value: Y,
                    onChange: y => ae(y.target.value),
                    placeholder: "搜索班级名称...",
                    className: "pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-40"
                  })
                ]
              }),
              s.jsxs("label", {
                className: "flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors select-none",
                children: [
                  s.jsx("input", {
                    type: "checkbox",
                    checked: hideEmptyMonth,
                    onChange: y => setHideEmptyMonth(y.target.checked),
                    className: "rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  }),
                  s.jsx("span", { children: "自动隐藏当月无课班级" })
                ]
              })
            ]
          }),

          s.jsxs("div", {
            className: "flex items-center space-x-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 text-xs",
            children: [
              s.jsxs("div", {
                className: "text-center",
                children: [
                  s.jsx("span", { className: "text-[10px] text-slate-400 block font-bold", children: "在读班级" }),
                  s.jsxs("span", { className: "font-extrabold text-slate-900", children: [se.activeClasses, " 个"] })
                ]
              }),
              s.jsx("div", { className: "h-6 w-px bg-slate-200" }),
              s.jsxs("div", {
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
                title: "打开排课总览 Excel 表格下载与筛选对话框",
                children: [
                  s.jsx(Nf, { className: "w-3.5 h-3.5 text-emerald-600" }),
                  s.jsx("span", { children: "下载排课总览 Excel" })
                ]
              })
            ]
          })
        ]
      }),

      // Schedule Matrix Table
      s.jsx("div", {
        className: "bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden",
        children: P.length === 0 ? s.jsxs("div", {
          className: "p-12 text-center text-slate-400 space-y-2",
          children: [
            s.jsx(rs, { className: "w-10 h-10 mx-auto text-slate-300" }),
            s.jsx("p", { className: "font-bold text-sm text-slate-600", children: "暂无符合条件的班级排课数据" }),
            s.jsx("p", { className: "text-xs", children: "请通过“新建班级排课”创建新班级，或调整筛选条件。" })
          ]
        }) : s.jsx("div", {
          className: "overflow-x-auto relative max-h-[750px] no-scrollbar",
          children: s.jsxs("table", {
            className: "w-full text-left border-collapse border-spacing-0",
            children: [
              s.jsx("thead", {
                className: "bg-slate-50 sticky top-0 z-20 shadow-xs border-b border-slate-200",
                children: s.jsxs("tr", {
                  children: [
                    s.jsx("th", {
                      className: "sticky left-0 z-30 bg-slate-100 p-3 min-w-[210px] w-[210px] border-r border-slate-200 font-bold text-xs text-slate-700 shadow-xs",
                      children: s.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          s.jsx("span", { children: "班级 / 教师 / 教材" }),
                          s.jsxs("span", { className: "text-[10px] font-mono text-slate-400", children: [b + 1, "月 (共", ye.length, "天)"] })
                        ]
                      })
                    }),
                    ye.map(y => s.jsxs("th", {
                      className: `p-2 min-w-[125px] max-w-[130px] border-r border-slate-200 text-center font-mono ${
                        y.isToday ? "bg-indigo-100/80 text-indigo-900 border-indigo-300" : y.isWeekend ? "bg-slate-100/60 text-slate-700" : "bg-slate-50 text-slate-600"
                      }`,
                      children: [
                        s.jsx("div", { className: "text-[10px] font-bold uppercase tracking-wider", children: y.dayOfWeekStr }),
                        s.jsxs("div", { className: "text-sm font-black mt-0.5", children: [y.dayNum, " 日"] }),
                        y.isToday && s.jsx("span", {
                          className: "inline-block mt-0.5 bg-indigo-600 text-white text-[9px] px-1.5 rounded-full font-sans font-bold",
                          children: "Today"
                        })
                      ]
                    }, y.dateStr))
                  ]
                })
              }),
              s.jsx("tbody", {
                className: "divide-y divide-slate-200",
                children: P.map(y => {
                  const K = y.lessons.filter(te => te.status === "completed").length,
                    ce = y.totalLessons;
                  return s.jsxs("tr", {
                    className: "hover:bg-slate-50/50 transition-colors",
                    children: [
                      s.jsx("td", {
                        className: "sticky left-0 z-10 bg-white border-r border-slate-200 p-3 shadow-xs",
                        children: s.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            s.jsxs("div", {
                              className: "flex items-center justify-between cursor-pointer group",
                              onClick: () => u(y),
                              title: `点击查看 ${y.className} 班级排课明细`,
                              children: [
                                s.jsx("span", {
                                  className: "font-black text-xs text-slate-900 group-hover:text-indigo-600 group-hover:underline truncate max-w-[155px]",
                                  children: y.className
                                }),
                                s.jsx(of, { className: "w-3 h-3 text-slate-300 group-hover:text-indigo-600 shrink-0" })
                              ]
                            }),
                            s.jsxs("div", {
                              className: "space-y-1 text-[11px]",
                              children: [
                                s.jsxs("div", {
                                  className: "flex items-center space-x-1.5 text-slate-700 font-semibold truncate",
                                  title: `教师: ${y.teacher}`,
                                  children: [
                                    s.jsx(Io, { className: "w-3 h-3 text-indigo-500 shrink-0" }),
                                    s.jsxs("span", { className: "truncate", children: ["教师: ", y.teacher] })
                                  ]
                                }),
                                s.jsxs("div", {
                                  className: "flex items-center space-x-1.5 text-amber-900 bg-amber-50/90 border border-amber-200/80 px-1.5 py-0.5 rounded text-[10px] font-bold truncate max-w-[195px]",
                                  title: `教材: ${y.textbook || (T && T.find(t => t.id === y.templateId)?.textbook) || "未设教材"}`,
                                  children: [
                                    s.jsx(Nt, { className: "w-3 h-3 text-amber-600 shrink-0" }),
                                    s.jsxs("span", { className: "truncate", children: ["教材: ", y.textbook || (T && T.find(t => t.id === y.templateId)?.textbook) || "未设教材"] })
                                  ]
                                })
                              ]
                            }),
                            s.jsxs("div", {
                              className: "flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100",
                              children: [
                                s.jsx("span", { children: "进度:" }),
                                s.jsxs("span", { className: "font-bold text-slate-700", children: [K, "/", ce] }),
                                s.jsxs("span", { className: "text-indigo-600 font-bold", children: [Math.round(ce > 0 ? (K / ce) * 100 : 0), "%"] })
                              ]
                            })
                          ]
                        })
                      }),
                      ye.map(te => {
                        const d = y.lessons.find(C => C.date === te.dateStr);
                        return s.jsx("td", {
                          className: `p-1.5 border-r border-slate-200 text-center align-top min-w-[125px] max-w-[130px] transition-colors ${
                            te.isToday ? "bg-indigo-50/20" : te.isWeekend ? "bg-slate-50/40" : ""
                          }`,
                          children: d ? s.jsxs("div", {
                            onClick: () => _e(y, d),
                            className: `p-2 rounded-xl text-left cursor-pointer transition-all hover:scale-[1.02] shadow-2xs border text-[11px] ${
                              d.status === "completed" ? "bg-emerald-50 border-emerald-200 text-emerald-950" :
                              d.status === "cancelled" ? "bg-rose-50 border-rose-200 text-rose-800 opacity-60 line-through" :
                              d.status === "makeup" ? "bg-amber-50 border-amber-200 text-amber-950" :
                              "bg-indigo-50/70 border-indigo-200 text-indigo-950 hover:bg-indigo-50"
                            }`,
                            children: [
                              s.jsxs("div", {
                                className: "flex items-center justify-between font-mono text-[10px] font-bold pb-1 border-b border-black/5",
                                children: [
                                  s.jsx("span", { children: d.lessonCode }),
                                  s.jsx("span", { className: "opacity-75 font-normal", children: d.timeSlot ? d.timeSlot.split("-")[0] : "" })
                                ]
                              }),
                              s.jsx("div", {
                                className: "font-bold mt-1 line-clamp-1 text-slate-800 leading-tight",
                                title: d.topic,
                                children: d.topic || "常规授课"
                              }),
                              d.note && s.jsx("div", {
                                className: "text-[10px] text-slate-500 line-clamp-1 italic mt-0.5",
                                children: d.note
                              })
                            ]
                          }) : s.jsx("div", {
                            className: "h-12 flex items-center justify-center",
                            children: s.jsx("span", { className: "text-[10px] text-slate-300", children: "—" })
                          })
                        }, te.dateStr);
                      })
                    ]
                  }, y.id);
                })
              })
            ]
          })
        })
      }),

      // Single Lesson Edit Modal
      J && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4",
          children: [
            s.jsxs("div", {
              className: "flex items-center justify-between border-b border-slate-100 pb-3",
              children: [
                s.jsxs("div", {
                  children: [
                    s.jsx("span", {
                      className: "text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100",
                      children: J.schedule.className
                    }),
                    s.jsxs("h3", {
                      className: "font-extrabold text-slate-900 text-base mt-1 flex items-center space-x-2",
                      children: [
                        s.jsxs("span", { children: ["课次详情: ", J.lesson.lessonCode] }),
                        s.jsxs("span", { className: "text-xs text-slate-500 font-mono font-normal", children: ["(", J.lesson.date, " ", J.lesson.dayOfWeekStr, ")"] })
                      ]
                    })
                  ]
                }),
                s.jsx("button", { onClick: () => de(null), className: "text-slate-400 hover:text-slate-600 p-1 rounded-full", children: s.jsx(zl, { className: "w-5 h-5" }) })
              ]
            }),
            s.jsxs("div", {
              className: "space-y-3 text-xs",
              children: [
                s.jsxs("div", {
                  className: "bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1",
                  children: [
                    s.jsxs("div", {
                      className: "flex items-center justify-between text-slate-600",
                      children: [
                        s.jsxs("span", { children: ["授课教师: ", s.jsx("strong", { className: "text-slate-800", children: J.lesson.teacher })] }),
                        s.jsxs("span", { children: ["教室: ", s.jsx("strong", { className: "text-slate-800", children: J.lesson.classroom })] })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60 font-mono",
                      children: [
                        s.jsxs("span", {
                          className: "flex items-center space-x-1 font-sans text-amber-800 font-bold",
                          children: [
                            s.jsx(Nt, { className: "w-3 h-3 text-amber-600" }),
                            s.jsxs("span", { children: ["教材: ", J.schedule.textbook || "Big Fun 1"] })
                          ]
                        }),
                        s.jsxs("span", { children: ["时段: ", J.lesson.timeSlot] })
                      ]
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "grid grid-cols-3 gap-2",
                  children: [
                    s.jsxs("div", {
                      className: "col-span-1",
                      children: [
                        s.jsx("label", { className: "font-bold text-slate-700 block mb-1", children: "课次编号" }),
                        s.jsx("input", {
                          type: "text",
                          value: I,
                          onChange: y => me(y.target.value),
                          className: "w-full px-2.5 py-1.5 border border-indigo-200 rounded-md bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold text-indigo-700 text-xs",
                          placeholder: "如 U1L1"
                        })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "col-span-2",
                      children: [
                        s.jsx("label", { className: "font-bold text-slate-700 block mb-1", children: "课堂内容" }),
                        s.jsx("input", {
                          type: "text",
                          value: B,
                          onChange: y => F(y.target.value),
                          className: "w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-xs text-slate-800"
                        })
                      ]
                    })
                  ]
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("label", { className: "font-bold text-slate-700 block mb-1", children: "课后教学备注 / 学情反馈" }),
                    s.jsx("input", {
                      type: "text",
                      value: ve,
                      onChange: y => xe(y.target.value),
                      placeholder: "可记录学生出勤或作业布置...",
                      className: "w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-between items-center pt-2 border-t border-slate-100",
              children: [
                s.jsxs("button", {
                  onClick: () => { u(J.schedule); de(null); },
                  className: "text-indigo-600 font-bold text-xs hover:underline flex items-center space-x-1",
                  children: [
                    s.jsx("span", { children: "进入完整班级课表" }),
                    s.jsx(of, { className: "w-3.5 h-3.5" })
                  ]
                }),
                s.jsxs("div", {
                  className: "flex space-x-2",
                  children: [
                    s.jsx("button", { onClick: () => de(null), className: "px-3 py-1.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-full", children: "取消" }),
                    s.jsx("button", { onClick: A, className: "px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full shadow-xs", children: "保存修改" })
                  ]
                })
              ]
            })
          ]
        })
      }),

      // Export Overview Excel with Custom Date Range Modal
      isExportExcelModalOpen && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col",
          children: [
            // Modal Header
            s.jsxs("div", {
              className: "p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0 gap-3",
              children: [
                s.jsxs("div", {
                  className: "flex items-center space-x-3 min-w-0",
                  children: [
                    s.jsx("div", {
                      className: "w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200",
                      children: s.jsx(Nf, { className: "w-5 h-5" })
                    }),
                    s.jsxs("div", {
                      className: "min-w-0",
                      children: [
                        s.jsx("h3", { className: "text-base font-black text-slate-900 truncate", children: "导出排课总览 (Excel 表格)" }),
                        s.jsx("p", { className: "text-xs text-slate-500 mt-0.5 truncate hidden sm:block", children: "自定义时间区间与多维度筛选，生成标准 Excel 课程进度总览并导出为本地表格" })
                      ]
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "flex items-center space-x-2 shrink-0",
                  children: [
                    s.jsxs("button", {
                      type: "button",
                      onClick: handleDownloadOverviewExcel,
                      className: "px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black rounded-xl shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/30 transition-all flex items-center space-x-1.5 text-xs cursor-pointer",
                      title: "立即下载当前筛选的排课总览 Excel 表格",
                      children: [
                        s.jsx(Nf, { className: "w-4 h-4 text-emerald-100 stroke-[2.5]" }),
                        s.jsxs("span", { children: ["立即下载 Excel (", exportStats.totalLessons, "节)"] })
                      ]
                    }),
                    s.jsx("button", {
                      type: "button",
                      onClick: () => setIsExportExcelModalOpen(false),
                      className: "p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer",
                      title: "关闭对话框",
                      children: s.jsx(zl, { className: "w-5 h-5" })
                    })
                  ]
                })
              ]
            }),

            // Modal Body
            s.jsxs("div", {
              className: "p-5 overflow-y-auto space-y-4 text-xs flex-1 min-h-0",
              children: [
                // Quick Date Range Presets
                s.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    s.jsxs("label", {
                      className: "block font-extrabold text-slate-800 text-xs flex items-center justify-between",
                      children: [
                        s.jsx("span", { children: "1. 快捷选择时间区间" }),
                        s.jsx("span", { className: "font-normal text-slate-400 text-[11px]", children: "点击一键填入常用周期" })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "flex flex-wrap gap-2",
                      children: [
                        [
                          { key: "currentMonth", label: `本月全部 (${H}年${b + 1}月)` },
                          { key: "nextMonth", label: "次月排课" },
                          { key: "quarter", label: "近3个月 (本季度)" },
                          { key: "currentYear", label: `${H}全年度` },
                          { key: "all", label: "系统全量排课" }
                        ].map(item => s.jsx("button", {
                          key: item.key,
                          type: "button",
                          onClick: () => applyPresetRange(item.key),
                          className: `px-3 py-1.5 rounded-full font-bold transition-all text-xs border ${
                            presetRangeKey === item.key
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                          }`,
                          children: item.label
                        }))
                      ]
                    })
                  ]
                }),

                // Custom Date Range Inputs
                s.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200",
                  children: [
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "开始日期 (起始)" }),
                        s.jsx("input", {
                          type: "date",
                          value: exportStartDate,
                          onChange: e => {
                            setExportStartDate(e.target.value);
                            setPresetRangeKey("custom");
                          },
                          className: "w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        })
                      ]
                    }),
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "结束日期 (截止)" }),
                        s.jsx("input", {
                          type: "date",
                          value: exportEndDate,
                          onChange: e => {
                            setExportEndDate(e.target.value);
                            setPresetRangeKey("custom");
                          },
                          className: "w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        })
                      ]
                    })
                  ]
                }),

                // Filter controls
                s.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                  children: [
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "2. 授课教师筛选" }),
                        s.jsxs("select", {
                          value: exportTeacherFilter,
                          onChange: e => setExportTeacherFilter(e.target.value),
                          className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600",
                          children: [
                            s.jsx("option", { value: "all", children: "全部授课教师 (不限)" }),
                            j.map(teach => s.jsx("option", { value: teach.name, children: teach.name }, teach.id))
                          ]
                        })
                      ]
                    }),
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "3. 班级范围" }),
                        s.jsxs("select", {
                          value: exportClassScope,
                          onChange: e => setExportClassScope(e.target.value),
                          className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600",
                          children: [
                            s.jsxs("option", { value: "all", children: ["全部在读班级 (共 ", r.length, " 个班)"] }),
                            s.jsxs("option", { value: "current", children: ["当前总览筛选班级 (共 ", P.length, " 个班)"] })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Status Checkboxes
                s.jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    s.jsx("label", { className: "block font-bold text-slate-700", children: "4. 导出课次状态包含" }),
                    s.jsxs("div", {
                      className: "flex flex-wrap gap-4 pt-1",
                      children: [
                        s.jsxs("label", {
                          className: "inline-flex items-center space-x-1.5 cursor-pointer text-slate-700 select-none",
                          children: [
                            s.jsx("input", {
                              type: "checkbox",
                              checked: includeStatus.completed,
                              onChange: e => setIncludeStatus(prev => ({ ...prev, completed: e.target.checked })),
                              className: "rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                            }),
                            s.jsx("span", { children: "已上课 (completed)" })
                          ]
                        }),
                        s.jsxs("label", {
                          className: "inline-flex items-center space-x-1.5 cursor-pointer text-slate-700 select-none",
                          children: [
                            s.jsx("input", {
                              type: "checkbox",
                              checked: includeStatus.scheduled,
                              onChange: e => setIncludeStatus(prev => ({ ...prev, scheduled: e.target.checked })),
                              className: "rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                            }),
                            s.jsx("span", { children: "待上课 (scheduled)" })
                          ]
                        }),
                        s.jsxs("label", {
                          className: "inline-flex items-center space-x-1.5 cursor-pointer text-slate-700 select-none",
                          children: [
                            s.jsx("input", {
                              type: "checkbox",
                              checked: includeStatus.cancelled,
                              onChange: e => setIncludeStatus(prev => ({ ...prev, cancelled: e.target.checked })),
                              className: "rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                            }),
                            s.jsx("span", { children: "停课/节假日 (cancelled)" })
                          ]
                        }),
                        s.jsxs("label", {
                          className: "inline-flex items-center space-x-1.5 cursor-pointer text-slate-700 select-none",
                          children: [
                            s.jsx("input", {
                              type: "checkbox",
                              checked: includeStatus.makeup,
                              onChange: e => setIncludeStatus(prev => ({ ...prev, makeup: e.target.checked })),
                              className: "rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                            }),
                            s.jsx("span", { children: "补课 (makeup)" })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Live Stats & Preview Box
                s.jsxs("div", {
                  className: "bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3",
                  children: [
                    s.jsxs("div", {
                      className: "flex items-center justify-between border-b border-slate-200 pb-2",
                      children: [
                        s.jsxs("div", {
                          className: "flex items-center space-x-2",
                          children: [
                            s.jsx("span", { className: "font-extrabold text-slate-900", children: "导出数据统计概览" }),
                            s.jsxs("span", {
                              className: "font-mono font-bold text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded",
                              children: ["匹配总课次: ", exportStats.totalLessons, " 节"]
                            })
                          ]
                        }),
                        s.jsxs("button", {
                          type: "button",
                          onClick: handleDownloadOverviewExcel,
                          className: "px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs",
                          title: "立即下载当前筛选统计的排课总览数据",
                          children: [
                            s.jsx(Nf, { className: "w-3.5 h-3.5 stroke-[2.5]" }),
                            s.jsx("span", { children: "立即下载此数据" })
                          ]
                        })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-center",
                      children: [
                        s.jsxs("div", {
                          className: "bg-white p-2 rounded-lg border border-slate-100",
                          children: [
                            s.jsx("span", { className: "text-[10px] text-slate-400 block", children: "覆盖班级" }),
                            s.jsxs("span", { className: "font-black text-slate-800 text-sm", children: [exportStats.uniqueClasses, " 个"] })
                          ]
                        }),
                        s.jsxs("div", {
                          className: "bg-white p-2 rounded-lg border border-slate-100",
                          children: [
                            s.jsx("span", { className: "text-[10px] text-slate-400 block", children: "涉及教师" }),
                            s.jsxs("span", { className: "font-black text-slate-800 text-sm", children: [exportStats.uniqueTeachers, " 位"] })
                          ]
                        }),
                        s.jsxs("div", {
                          className: "bg-white p-2 rounded-lg border border-slate-100",
                          children: [
                            s.jsx("span", { className: "text-[10px] text-slate-400 block", children: "已上课" }),
                            s.jsxs("span", { className: "font-black text-emerald-600 text-sm", children: [exportStats.completed, " 节"] })
                          ]
                        }),
                        s.jsxs("div", {
                          className: "bg-white p-2 rounded-lg border border-slate-100",
                          children: [
                            s.jsx("span", { className: "text-[10px] text-slate-400 block", children: "待上课" }),
                            s.jsxs("span", { className: "font-black text-indigo-600 text-sm", children: [exportStats.scheduled, " 节"] })
                          ]
                        })
                      ]
                    }),

                    // Preview list (first 4 items)
                    exportMatchingLessons.length > 0 ? s.jsxs("div", {
                      className: "space-y-1.5 pt-1",
                      children: [
                        s.jsx("div", { className: "text-[11px] font-bold text-slate-500", children: "课次抽样预览 (前 4 条):" }),
                        s.jsx("div", {
                          className: "space-y-1 max-h-28 overflow-y-auto no-scrollbar",
                          children: exportMatchingLessons.slice(0, 4).map((item, idx) => s.jsxs("div", {
                            key: idx,
                            className: "flex items-center justify-between text-[11px] bg-white px-2.5 py-1.5 rounded border border-slate-100 font-mono",
                            children: [
                              s.jsxs("div", {
                                className: "flex items-center space-x-2 truncate font-sans",
                                children: [
                                  s.jsx("span", { className: "font-bold text-slate-800", children: item.date }),
                                  s.jsx("span", { className: "text-slate-400", children: item.dayOfWeekStr }),
                                  s.jsx("span", { className: "font-bold text-indigo-600 truncate", children: item.className }),
                                  s.jsx("span", { className: "text-slate-500", children: item.lessonCode })
                                ]
                              }),
                              s.jsxs("div", {
                                className: "flex items-center space-x-1.5 shrink-0 font-sans",
                                children: [
                                  s.jsx("span", { className: "text-slate-500", children: item.teacher }),
                                  s.jsx("span", {
                                    className: `px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                      item.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                                      item.status === "cancelled" ? "bg-rose-50 text-rose-700" :
                                      "bg-indigo-50 text-indigo-700"
                                    }`,
                                    children: item.status === "completed" ? "已上课" : item.status === "cancelled" ? "停课" : "待上课"
                                  })
                                ]
                              })
                            ]
                          }))
                        })
                      ]
                    }) : s.jsx("div", {
                      className: "text-center py-2 text-rose-600 font-bold text-xs",
                      children: "⚠️ 所选时间区间或筛选条件内无课次，请调整起止日期或勾选更多状态。"
                    }),

                    // Prominent Download Callout Box right inside the card!
                    s.jsxs("div", {
                      className: "bg-emerald-50/90 border-2 border-emerald-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 shadow-xs",
                      children: [
                        s.jsxs("div", {
                          className: "flex items-center space-x-3 text-left w-full sm:w-auto",
                          children: [
                            s.jsx("div", {
                              className: "w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300/40",
                              children: s.jsx(Nf, { className: "w-5 h-5 stroke-[2.5]" })
                            }),
                            s.jsxs("div", {
                              children: [
                                s.jsxs("div", {
                                  className: "font-black text-sm text-slate-900 flex items-center space-x-2",
                                  children: [
                                    s.jsx("span", { children: "下载排课总览 Excel 表格" }),
                                    s.jsxs("span", { className: "text-xs bg-emerald-200/80 text-emerald-900 font-mono px-2 py-0.5 rounded-full font-extrabold", children: [exportStats.totalLessons, " 节课次"] })
                                  ]
                                }),
                                s.jsx("div", {
                                  className: "text-xs text-slate-500 mt-0.5",
                                  children: "包含完整的班级、授课教师、教材版本、课次序号与进度明细"
                                })
                              ]
                            })
                          ]
                        }),
                        s.jsxs("button", {
                          type: "button",
                          onClick: handleDownloadOverviewExcel,
                          className: "w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-emerald-700/25 ring-2 ring-emerald-400/40 transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer shrink-0",
                          title: "立即下载排课总览 Excel 表格 (.csv / .xlsx)",
                          children: [
                            s.jsx(Nf, { className: "w-4 h-4 text-emerald-100 stroke-[2.5]" }),
                            s.jsxs("span", { children: ["立即下载 Excel 表格"] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Modal Footer Actions
            s.jsxs("div", {
              className: "p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 shadow-xs",
              children: [
                s.jsx("button", {
                  type: "button",
                  onClick: () => setIsExportExcelModalOpen(false),
                  className: "px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-xs cursor-pointer",
                  children: "取消"
                }),
                s.jsxs("button", {
                  type: "button",
                  onClick: handleDownloadOverviewExcel,
                  className: "px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] text-white font-black rounded-xl shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400/30 transition-all flex items-center space-x-2 text-xs cursor-pointer",
                  title: "立即下载排课总览 Excel 表格",
                  children: [
                    s.jsx(Nf, { className: "w-4.5 h-4.5 text-emerald-100 stroke-[2.5]" }),
                    s.jsxs("span", { children: ["立即下载排课总览 Excel 表格 (共 ", exportStats.totalLessons, " 节课)"] })
                  ]
                })
              ]
            })
          ]
        })
      })
,
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
};