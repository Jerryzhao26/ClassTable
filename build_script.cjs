const fs = require('fs');

const cb_new_code = `Cb=({schedules:r,levels:T,teachers:j,onSelectSchedule:u,onOpenQuickWizard:N,onDeleteSchedule:D,onBatchDeleteSchedules:batchDel,onOpenPrintModal:Q})=>{
  const [H, R] = _.useState("");
  const [b, X] = _.useState("all");
  const [S, Z] = _.useState("all");
  const [V, ie] = _.useState("all");
  const [Y, ae] = _.useState("grid");
  const [J, de] = _.useState(null);
  const [B, F] = _.useState(null);
  const [selectedScheduleIds, setSelectedScheduleIds] = _.useState(new Set());
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = _.useState(false);
  const [batchNotice, setBatchNotice] = _.useState("");

  const ve = (O, Me) => {
    Me.stopPropagation();
    const pe = bf(O);
    navigator.clipboard.writeText(pe);
    de(O.id);
    setTimeout(() => de(null), 2500);
  };

  const xe = _.useMemo(() => r.filter(O => {
    const Me = O.className.toLowerCase().includes(H.toLowerCase()) ||
               O.teacher.toLowerCase().includes(H.toLowerCase()) ||
               O.levelName.toLowerCase().includes(H.toLowerCase());
    const pe = b === "all" || O.levelId === b;
    const ye = S === "all" || O.frequency === S;
    const P = V === "all" || O.teacher === V;
    return Me && pe && ye && P;
  }), [r, H, b, S, V]);

  const I = r.filter(O => O.frequency === "1x_week").length;
  const me = r.filter(O => O.frequency === "2x_week").length;

  const toggleSelectSchedule = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedScheduleIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllSchedules = () => {
    const allSelected = xe.length > 0 && xe.every(O => selectedScheduleIds.has(O.id));
    if (allSelected) {
      setSelectedScheduleIds(prev => {
        const next = new Set(prev);
        xe.forEach(O => next.delete(O.id));
        return next;
      });
    } else {
      setSelectedScheduleIds(prev => {
        const next = new Set(prev);
        xe.forEach(O => next.add(O.id));
        return next;
      });
    }
  };

  const clearScheduleSelection = () => {
    setSelectedScheduleIds(new Set());
  };

  const selectedSchedulesList = _.useMemo(() => {
    return r.filter(O => selectedScheduleIds.has(O.id));
  }, [r, selectedScheduleIds]);

  const totalLessonsInSelected = _.useMemo(() => {
    return selectedSchedulesList.reduce((acc, cur) => acc + (cur.lessons ? cur.lessons.length : (cur.totalLessons || 0)), 0);
  }, [selectedSchedulesList]);

  const executeBatchDelete = () => {
    const count = selectedScheduleIds.size;
    if (count === 0) return;
    const ids = Array.from(selectedScheduleIds);
    if (batchDel) {
      batchDel(ids);
    } else {
      ids.forEach(id => D(id));
    }
    setSelectedScheduleIds(new Set());
    setIsBatchDeleteModalOpen(false);
    setBatchNotice("已成功批量删除 " + count + " 个已排班级课程！");
    setTimeout(() => setBatchNotice(""), 4000);
  };

  return s.jsxs("div", {
    className: "space-y-6 max-w-7xl mx-auto pb-12",
    children: [
      s.jsxs("div", {
        className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm",
        children: [
          s.jsxs("div", {
            children: [
              s.jsxs("div", {
                className: "flex items-center space-x-2",
                children: [
                  s.jsx("h1", { className: "text-xl font-extrabold text-slate-900 tracking-tight", children: "Beavers 班级课程进度表" }),
                  s.jsxs("span", { className: "bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2.5 py-0.5 rounded-full font-bold", children: ["共 ", r.length, " 个班级"] })
                ]
              }),
              s.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "统一维护各班级别进度、上课时段与教研进度，支持一键推算生成、批量删除已排课程、Excel导出与家校通知文案复制。" })
            ]
          }),
          s.jsxs("div", {
            className: "flex items-center space-x-3",
            children: [
              selectedScheduleIds.size > 0 && s.jsxs("button", {
                onClick: () => setIsBatchDeleteModalOpen(true),
                className: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-md shadow-rose-200 transition-all flex items-center space-x-1.5 animate-pulse",
                children: [
                  s.jsx(Tt, { className: "w-4 h-4" }),
                  s.jsxs("span", { children: ["批量删除已选 (", selectedScheduleIds.size, ")"] })
                ]
              }),
              s.jsxs("button", {
                onClick: N,
                className: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-md shadow-indigo-200 transition-all flex items-center space-x-2",
                children: [
                  s.jsx(sl, { className: "w-4 h-4 text-amber-300" }),
                  s.jsx("span", { children: "智能自动排课" })
                ]
              })
            ]
          })
        ]
      }),
      batchNotice && s.jsxs("div", {
        className: "bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between border border-emerald-600 animate-fadeIn",
        children: [
          s.jsxs("div", {
            className: "flex items-center space-x-2",
            children: [
              s.jsx(us, { className: "w-4 h-4 text-emerald-100" }),
              s.jsx("span", { children: batchNotice })
            ]
          }),
          s.jsx("button", { onClick: () => setBatchNotice(""), className: "text-white/80 hover:text-white font-bold text-sm px-1", children: "✕" })
        ]
      }),
      s.jsx("div", {
        className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3",
        children: s.jsxs("div", {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center",
          children: [
            s.jsxs("div", {
              className: "lg:col-span-4 relative",
              children: [
                s.jsx(_i, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
                s.jsx("input", {
                  type: "text",
                  value: H,
                  onChange: O => R(O.target.value),
                  placeholder: "搜索班级名称 / 老师 / 级别...",
                  className: "w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                })
              ]
            }),
            s.jsx("div", {
              className: "lg:col-span-3",
              children: s.jsxs("select", {
                value: b,
                onChange: O => X(O.target.value),
                className: "w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                children: [
                  s.jsx("option", { value: "all", children: "所有级别 (全部)" }),
                  T.map(O => s.jsx("option", { value: O.id, children: O.name }, O.id))
                ]
              })
            }),
            s.jsx("div", {
              className: "lg:col-span-2",
              children: s.jsxs("select", {
                value: S,
                onChange: O => Z(O.target.value),
                className: "w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold text-slate-700",
                children: [
                  s.jsx("option", { value: "all", children: "频次 (全部)" }),
                  s.jsxs("option", { value: "1x_week", children: ["⚡ 一周一次班 (", I, ")"] }),
                  s.jsxs("option", { value: "2x_week", children: ["🔥 一周两次班 (", me, ")"] })
                ]
              })
            }),
            s.jsx("div", {
              className: "lg:col-span-2",
              children: s.jsxs("select", {
                value: V,
                onChange: O => ie(O.target.value),
                className: "w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                children: [
                  s.jsx("option", { value: "all", children: "所有授课老师" }),
                  j.map(O => s.jsx("option", { value: O.name, children: O.name }, O.id))
                ]
              })
            }),
            s.jsx("div", {
              className: "lg:col-span-1 flex justify-end",
              children: s.jsxs("div", {
                className: "inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100",
                children: [
                  s.jsx("button", {
                    onClick: () => ae("grid"),
                    className: "p-1.5 rounded-md " + (Y === "grid" ? "bg-white text-indigo-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-700"),
                    title: "网格卡片视图",
                    children: s.jsx(Im, { className: "w-4 h-4" })
                  }),
                  s.jsx("button", {
                    onClick: () => ae("table"),
                    className: "p-1.5 rounded-md " + (Y === "table" ? "bg-white text-indigo-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-700"),
                    title: "列表表格视图",
                    children: s.jsx(eb, { className: "w-4 h-4" })
                  })
                ]
              })
            })
          ]
        })
      }),
      selectedScheduleIds.size > 0 && s.jsxs("div", {
        className: "bg-indigo-900 text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 border border-indigo-700 animate-fadeIn",
        children: [
          s.jsxs("div", {
            className: "flex items-center space-x-3",
            children: [
              s.jsx("span", {
                className: "w-8 h-8 rounded-full bg-indigo-500/40 border border-indigo-400 flex items-center justify-center font-bold text-sm text-indigo-100 shrink-0",
                children: selectedScheduleIds.size
              }),
              s.jsxs("div", {
                children: [
                  s.jsxs("h4", { className: "font-bold text-sm flex items-center space-x-2", children: [
                    s.jsx("span", { children: "已勾选 " + selectedScheduleIds.size + " 个已排班级" }),
                    s.jsx("span", { className: "text-[11px] font-normal text-indigo-200", children: "(当前筛选列表共 " + xe.length + " 班)" })
                  ]}),
                  s.jsxs("p", { className: "text-xs text-indigo-200 mt-0.5", children: ["合计包含 ", s.jsx("strong", { className: "text-white", children: totalLessonsInSelected }), " 节排课明细"] })
                ]
              })
            ]
          }),
          s.jsxs("div", {
            className: "flex items-center space-x-2 flex-wrap gap-1.5",
            children: [
              s.jsx("button", {
                type: "button",
                onClick: toggleSelectAllSchedules,
                className: "px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-xs font-semibold rounded-lg transition-colors",
                children: (xe.length > 0 && xe.every(O => selectedScheduleIds.has(O.id))) ? "取消全选" : "全选当前班级"
              }),
              s.jsx("button", {
                type: "button",
                onClick: clearScheduleSelection,
                className: "px-3 py-1.5 bg-indigo-800/70 hover:bg-indigo-700 text-xs font-semibold rounded-lg transition-colors",
                children: "清空勾选"
              }),
              s.jsxs("button", {
                type: "button",
                onClick: () => setIsBatchDeleteModalOpen(true),
                className: "px-4 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs rounded-lg shadow-md flex items-center space-x-1.5 transition-all hover:scale-105 ml-1",
                children: [
                  s.jsx(Tt, { className: "w-4 h-4" }),
                  s.jsxs("span", { children: ["批量删除已选 (", selectedScheduleIds.size, ")"] })
                ]
              })
            ]
          })
        ]
      }),
      xe.length === 0 ? s.jsxs("div", {
        className: "text-center py-16 bg-white rounded-2xl border border-slate-200",
        children: [
          s.jsx("p", { className: "text-slate-500 font-medium text-sm", children: "没有找到符合筛选条件的班级课表" }),
          s.jsxs("button", {
            onClick: N,
            className: "mt-3 text-indigo-600 text-xs font-bold hover:underline inline-flex items-center space-x-1",
            children: [
              s.jsx(sl, { className: "w-3.5 h-3.5" }),
              s.jsx("span", { children: "新建排课表" })
            ]
          })
        ]
      }) : Y === "grid" ? s.jsx("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
        children: xe.map(O => {
          const Me = O.lessons.filter(se => se.status === "completed").length;
          const pe = O.totalLessons || O.lessons.length;
          const ye = Math.round(Me / (pe || 1) * 100);
          const P = O.lessons.find(se => se.status === "scheduled");
          const isSelected = selectedScheduleIds.has(O.id);
          return s.jsxs("div", {
            className: "bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden group " + (isSelected ? "border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-50/10" : "border-slate-200 hover:border-indigo-300"),
            children: [
              s.jsxs("div", {
                className: "p-5 space-y-3.5",
                children: [
                  s.jsxs("div", {
                    className: "flex items-start justify-between gap-2",
                    children: [
                      s.jsxs("div", {
                        className: "flex items-start space-x-2.5",
                        children: [
                          s.jsx("input", {
                            type: "checkbox",
                            checked: isSelected,
                            onChange: se => toggleSelectSchedule(O.id, se),
                            onClick: se => se.stopPropagation(),
                            className: "w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0",
                            title: "勾选以批量操作"
                          }),
                          s.jsxs("div", {
                            children: [
                              s.jsx("h3", {
                                onClick: () => u(O),
                                className: "font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer",
                                children: O.className
                              }),
                              s.jsxs("div", {
                                className: "flex items-center space-x-1.5 mt-1",
                                children: [
                                  s.jsxs("span", {
                                    className: "font-extrabold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px] flex items-center space-x-1",
                                    children: [
                                      s.jsx(Nt, { className: "w-3 h-3 text-amber-600" }),
                                      s.jsx("span", { children: O.textbook || "Big Fun 1" })
                                    ]
                                  }),
                                  s.jsx("span", {
                                    className: "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase " + (O.frequency === "1x_week" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-emerald-50 text-emerald-800 border border-emerald-100"),
                                    children: O.frequency === "1x_week" ? "一周一次" : "一周两次"
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }),
                      s.jsx("span", {
                        className: "bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100 shrink-0",
                        children: O.levelName
                      })
                    ]
                  }),
                  s.jsxs("div", {
                    className: "space-y-1.5 text-xs text-slate-500",
                    children: [
                      s.jsxs("div", {
                        className: "flex items-center space-x-2",
                        children: [
                          s.jsx(Io, { className: "w-3.5 h-3.5 text-slate-400" }),
                          s.jsxs("span", { children: ["教师: ", s.jsx("strong", { className: "text-slate-700 font-semibold", children: O.teacher })] })
                        ]
                      }),
                      s.jsxs("div", {
                        className: "flex items-center space-x-2",
                        children: [
                          s.jsx(rs, { className: "w-3.5 h-3.5 text-slate-400" }),
                          s.jsxs("span", { children: [O.startDate, " 至 ", O.endDate] })
                        ]
                      }),
                      s.jsxs("div", {
                        className: "flex items-start space-x-2 text-indigo-700",
                        children: [
                          s.jsx(Na, { className: "w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" }),
                          s.jsx("span", { className: "font-semibold text-[11px]", children: O.slots.map(se => al[se.dayOfWeek] + " " + se.startTime + "-" + se.endTime).join(" / ") })
                        ]
                      })
                    ]
                  }),
                  P && s.jsxs("div", {
                    className: "p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs flex items-center justify-between",
                    children: [
                      s.jsxs("div", {
                        children: [
                          s.jsx("span", { className: "text-[10px] text-indigo-700 font-bold uppercase tracking-wider block", children: "下一课次" }),
                          s.jsxs("span", { className: "font-bold text-slate-800", children: [P.date, " (", P.dayOfWeekStr, ")"] })
                        ]
                      }),
                      s.jsxs("div", {
                        className: "text-right",
                        children: [
                          s.jsx("span", { className: "bg-indigo-600 text-white text-xs font-mono font-bold px-2 py-0.5 rounded", children: P.lessonCode }),
                          s.jsx("span", { className: "block text-[10px] text-slate-500 truncate max-w-[120px]", children: P.topic })
                        ]
                      })
                    ]
                  }),
                  s.jsxs("div", {
                    className: "space-y-1 pt-1",
                    children: [
                      s.jsxs("div", {
                        className: "flex items-center justify-between text-xs font-semibold",
                        children: [
                          s.jsx("span", { className: "text-slate-600", children: "已上课次进度:" }),
                          s.jsxs("span", { className: "text-indigo-600 font-bold", children: [Me, " / ", pe, " 课 (", ye, "%)"] })
                        ]
                      }),
                      s.jsx("div", {
                        className: "w-full bg-slate-100 h-2 rounded-full overflow-hidden",
                        children: s.jsx("div", { className: "bg-indigo-600 h-full transition-all duration-300", style: { width: ye + "%" } })
                      })
                    ]
                  })
                ]
              }),
              s.jsxs("div", {
                className: "bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs",
                children: [
                  s.jsx("button", {
                    onClick: se => ve(O, se),
                    className: "font-medium transition-colors flex items-center space-x-1 px-2 py-1 rounded " + (J === O.id ? "bg-emerald-100 text-emerald-800 font-bold" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-200"),
                    title: "复制发给家长的进度通知",
                    children: J === O.id ? s.jsxs(s.Fragment, { children: [s.jsx(us, { className: "w-3.5 h-3.5 text-emerald-600" }), s.jsx("span", { children: "已复制通知文案" })] }) : s.jsxs(s.Fragment, { children: [s.jsx(wi, { className: "w-3.5 h-3.5" }), s.jsx("span", { children: "家校通知" })] })
                  }),
                  s.jsxs("div", {
                    className: "flex items-center space-x-2",
                    children: [
                      s.jsxs("button", {
                        onClick: se => { se.stopPropagation(); N(O.id); },
                        className: "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80 font-bold px-2 py-1 rounded-md transition-colors flex items-center space-x-1 mr-1",
                        title: "为此班追加排课",
                        children: [s.jsx(rs, { className: "w-3 h-3 text-amber-600" }), s.jsx("span", { children: "追加排课" })]
                      }),
                      s.jsx("button", {
                        onClick: se => { se.stopPropagation(); mf(O); },
                        className: "text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200",
                        title: "导出 Excel / CSV",
                        children: s.jsx(Nf, { className: "w-4 h-4" })
                      }),
                      s.jsx("button", {
                        onClick: se => { se.stopPropagation(); Q(O); },
                        className: "text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200",
                        title: "打印进度表",
                        children: s.jsx(ji, { className: "w-4 h-4" })
                      }),
                      s.jsx("button", {
                        onClick: se => { se.stopPropagation(); F(O); },
                        className: "text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50",
                        title: "删除班级",
                        children: s.jsx(Tt, { className: "w-4 h-4" })
                      }),
                      s.jsxs("button", {
                        onClick: () => u(O),
                        className: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ml-1",
                        children: [s.jsx("span", { children: "管理" }), s.jsx(Fo, { className: "w-3.5 h-3.5" })]
                      })
                    ]
                  })
                ]
              })
            ]
          }, O.id);
        })
      }) : s.jsx("div", {
        className: "bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto",
        children: s.jsxs("table", {
          className: "w-full text-left text-xs",
          children: [
            s.jsx("thead", {
              className: "bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200",
              children: s.jsxs("tr", {
                children: [
                  s.jsx("th", {
                    className: "py-3.5 px-3 w-10 text-center text-[11px]",
                    children: s.jsx("input", {
                      type: "checkbox",
                      checked: xe.length > 0 && xe.every(O => selectedScheduleIds.has(O.id)),
                      onChange: toggleSelectAllSchedules,
                      className: "w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer",
                      title: "全选/取消全选"
                    })
                  }),
                  s.jsx("th", { className: "py-3.5 px-4 text-[11px]", children: "班级名称" }),
                  s.jsx("th", { className: "py-3.5 px-4 text-[11px]", children: "关联教材" }),
                  s.jsx("th", { className: "py-3.5 px-4 text-[11px]", children: "级别" }),
                  s.jsx("th", { className: "py-3.5 px-4 text-[11px]", children: "频次" }),
                  s.jsx("th", { className: "py-3.5 px-4 text-[11px]", children: "授课老师" }),
                  s.jsx("th", { className: "py-3.5 px-4 text-[11px]", children: "上课时间段" }),
                  s.jsx("th", { className: "py-3.5 px-4 text-[11px]", children: "进度 (已完成/总数)" }),
                  s.jsx("th", { className: "py-3.5 px-4 text-[11px]", children: "首/末课日期" }),
                  s.jsx("th", { className: "py-3.5 px-4 text-right text-[11px]", children: "操作" })
                ]
              })
            }),
            s.jsx("tbody", {
              className: "divide-y divide-slate-100",
              children: xe.map(O => {
                const Me = O.lessons.filter(pe => pe.status === "completed").length;
                const isSelected = selectedScheduleIds.has(O.id);
                return s.jsxs("tr", {
                  className: "transition-colors " + (isSelected ? "bg-indigo-50/60 hover:bg-indigo-50" : "hover:bg-slate-50"),
                  children: [
                    s.jsx("td", {
                      className: "py-3.5 px-3 text-center",
                      onClick: pe => pe.stopPropagation(),
                      children: s.jsx("input", {
                        type: "checkbox",
                        checked: isSelected,
                        onChange: pe => toggleSelectSchedule(O.id, pe),
                        className: "w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      })
                    }),
                    s.jsx("td", { className: "py-3.5 px-4 font-bold text-slate-900", children: O.className }),
                    s.jsx("td", {
                      className: "py-3.5 px-4",
                      children: s.jsxs("span", {
                        className: "font-extrabold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs flex items-center space-x-1 w-fit",
                        children: [
                          s.jsx(Nt, { className: "w-3 h-3 text-amber-600" }),
                          s.jsx("span", { children: O.textbook || "Big Fun 1" })
                        ]
                      })
                    }),
                    s.jsx("td", { className: "py-3.5 px-4 font-semibold text-indigo-600", children: O.levelName }),
                    s.jsx("td", {
                      className: "py-3.5 px-4",
                      children: s.jsx("span", {
                        className: "px-2 py-0.5 rounded font-bold text-[10px] uppercase " + (O.frequency === "1x_week" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-800"),
                        children: O.frequency === "1x_week" ? "一周一次" : "一周两次"
                      })
                    }),
                    s.jsx("td", { className: "py-3.5 px-4 text-slate-700 font-medium", children: O.teacher }),
                    s.jsx("td", { className: "py-3.5 px-4 text-slate-600", children: O.slots.map(pe => al[pe.dayOfWeek] + " " + pe.startTime).join(", ") }),
                    s.jsx("td", {
                      className: "py-3.5 px-4",
                      children: s.jsxs("span", {
                        className: "font-bold text-slate-800",
                        children: [Me, " / ", O.totalLessons]
                      })
                    }),
                    s.jsxs("td", { className: "py-3.5 px-4 text-slate-500 text-[11px]", children: [O.startDate, " ~ ", O.endDate] }),
                    s.jsxs("td", {
                      className: "py-3.5 px-4 text-right space-x-2",
                      children: [
                        s.jsx("button", { onClick: () => u(O), className: "text-indigo-600 font-bold hover:underline", children: "查看进度表" }),
                        s.jsx("button", { onClick: pe => ve(O, pe), className: "text-slate-600 hover:text-slate-900", children: "通知" }),
                        s.jsx("button", { onClick: pe => { pe.stopPropagation(); F(O); }, className: "text-rose-600 hover:text-rose-800 font-semibold", children: "删除" })
                      ]
                    })
                  ]
                }, O.id);
              })
            })
          ]
        })
      }),
      B && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4",
          children: [
            s.jsxs("div", {
              className: "flex items-center space-x-3 text-rose-600",
              children: [
                s.jsx("div", { className: "w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0", children: s.jsx(Tt, { className: "w-5 h-5 text-rose-600" }) }),
                s.jsxs("div", {
                  children: [
                    s.jsx("h3", { className: "font-extrabold text-slate-900 text-base", children: "确认彻底删除班级？" }),
                    s.jsx("p", { className: "text-xs text-slate-500", children: "该操作不可撤销，班级进度表数据将清除。" })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1",
              children: [
                s.jsxs("div", { className: "flex justify-between", children: [s.jsx("span", { className: "text-slate-500", children: "班级名称：" }), s.jsx("span", { className: "font-bold text-slate-900", children: B.className })] }),
                s.jsxs("div", { className: "flex justify-between", children: [s.jsx("span", { className: "text-slate-500", children: "课程级别：" }), s.jsx("span", { className: "font-semibold text-indigo-600", children: B.levelName })] }),
                s.jsxs("div", { className: "flex justify-between", children: [s.jsx("span", { className: "text-slate-500", children: "授课教师：" }), s.jsx("span", { className: "font-medium text-slate-800", children: B.teacher })] })
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-2",
              children: [
                s.jsx("button", { type: "button", onClick: () => F(null), className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-colors", children: "取消" }),
                s.jsx("button", { type: "button", onClick: () => { D(B.id); F(null); }, className: "px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-sm transition-all", children: "确认彻底删除" })
              ]
            })
          ]
        })
      }),
      isBatchDeleteModalOpen && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp",
          children: [
            s.jsxs("div", {
              className: "flex items-center space-x-3 text-rose-600",
              children: [
                s.jsx("div", { className: "w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0", children: s.jsx(Tt, { className: "w-5 h-5 text-rose-600" }) }),
                s.jsxs("div", {
                  children: [
                    s.jsx("h3", { className: "font-extrabold text-slate-900 text-base", children: "确认批量删除已选排课班级？" }),
                    s.jsx("p", { className: "text-xs text-slate-500", children: "此操作不可撤销，所选班级的全部排课明细与进度数据将被彻底清除。" })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "p-3.5 bg-rose-50/70 rounded-xl border border-rose-100 text-xs text-rose-950 space-y-1.5 font-medium",
              children: [
                s.jsxs("div", {
                  className: "flex justify-between items-center font-bold",
                  children: [
                    s.jsx("span", { children: "待删除班级总数：" }),
                    s.jsxs("span", { className: "text-rose-700 font-mono text-sm", children: [selectedScheduleIds.size, " 个班级"] })
                  ]
                }),
                s.jsxs("div", {
                  className: "flex justify-between items-center font-bold",
                  children: [
                    s.jsx("span", { children: "涉及排课总课次：" }),
                    s.jsxs("span", { className: "text-rose-700 font-mono text-sm", children: [totalLessonsInSelected, " 节排课"] })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "space-y-1.5 max-h-48 overflow-y-auto pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50",
              children: [
                s.jsx("div", { className: "text-[11px] font-bold text-slate-400 px-1 mb-1", children: "即将删除的班级清单：" }),
                selectedSchedulesList.map(O => s.jsxs("div", {
                  className: "p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between",
                  children: [
                    s.jsxs("div", {
                      children: [
                        s.jsx("span", { className: "font-bold text-slate-900", children: O.className }),
                        s.jsxs("span", { className: "text-slate-400 ml-2 text-[11px]", children: ["(", O.levelName, " · ", O.teacher, ")"] })
                      ]
                    }),
                    s.jsxs("span", { className: "font-mono text-slate-600 text-[11px] bg-slate-100 px-2 py-0.5 rounded font-semibold", children: [O.lessons ? O.lessons.length : O.totalLessons, " 节课"] })
                  ]
                }, O.id))
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-2 border-t border-slate-100",
              children: [
                s.jsx("button", {
                  type: "button",
                  onClick: () => setIsBatchDeleteModalOpen(false),
                  className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-colors",
                  children: "取消"
                }),
                s.jsxs("button", {
                  type: "button",
                  onClick: executeBatchDelete,
                  className: "px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-sm transition-all flex items-center space-x-1.5",
                  children: [
                    s.jsx(Tt, { className: "w-4 h-4" }),
                    s.jsxs("span", { children: ["确认批量删除 (", selectedScheduleIds.size, " 个班级)"] })
                  ]
                })
              ]
            })
          ]
        })
      })
    ]
  });
}`;

// Now let's create the updated Eb component (schedule detail view)
const eb_new_code = `Eb=({schedule:r,templates:T=[],holidays:j=[],onUpdateSchedule:u,onDeleteSchedule:N,onBack:D,onOpenPrintModal:Q})=>{
  const [H, R] = _.useState("all");
  const [b, X] = _.useState("");
  const [S, Z] = _.useState(null);
  const [V, ie] = _.useState(!1);
  const [Y, ae] = _.useState(!1);
  const [J, de] = _.useState(7);
  const [B, F] = _.useState(!1);
  const [ve, xe] = _.useState(1);
  const [I, me] = _.useState(1);
  const [O, Me] = _.useState("请假/休课顺延");
  const [pe, ye] = _.useState(!1);
  const [P, se] = _.useState(1);
  const [_e, A] = _.useState("");
  const [y, K] = _.useState(1);
  const [ce, te] = _.useState(1);
  const [d, C] = _.useState(!1);
  const [$, W] = _.useState(!1);
  const [G, he] = _.useState(r.className);
  const [Ne, Ve] = _.useState(r.textbook || "Big Fun 1");
  const [He, Et] = _.useState(r.teacher);
  const [At, L] = _.useState(r.classroom);
  const [Se, re] = _.useState([]);
  const [nt, Qe] = _.useState("");

  // Batch delete lesson state
  const [selectedLessonIds, setSelectedLessonIds] = _.useState(new Set());
  const [isBatchLessonModalOpen, setIsBatchLessonModalOpen] = _.useState(false);
  const [autoRenumberLessons, setAutoRenumberLessons] = _.useState(true);
  const [singleLessonToDelete, setSingleLessonToDelete] = _.useState(null);

  const Mt = r.lessons.filter(M => {
    const ze = H === "all" ||
               (H === "completed" && M.status === "completed") ||
               (H === "scheduled" && M.status === "scheduled") ||
               (H === "cancelled" && (M.status === "cancelled" || M.status === "holiday"));
    const Fe = M.lessonCode.toLowerCase().includes(b.toLowerCase()) ||
               M.topic.toLowerCase().includes(b.toLowerCase()) ||
               M.date.includes(b);
    return ze && Fe;
  });

  const bt = (M, ze, Fe) => {
    const h = r.lessons.map(q => q.id === M ? { ...q, [ze]: Fe } : q);
    u({ ...r, lessons: h, updatedAt: new Date().toISOString().split("T")[0] });
  };

  const ft = () => {
    if (J <= 0) return;
    const M = r.lessons.map(Fe => {
      if (Fe.status === "scheduled") {
        const h = new Date(Fe.date);
        h.setDate(h.getDate() + J);
        const q = h.toISOString().split("T")[0];
        const ee = h.getDay();
        return {
          ...Fe,
          date: q,
          dayOfWeekStr: al[ee],
          note: Fe.note ? Fe.note + " (延期" + J + "天)" : "[已统一延期" + J + "天]"
        };
      }
      return Fe;
    });
    const ze = M[M.length - 1];
    u({
      ...r,
      endDate: ze ? ze.date : r.endDate,
      lessons: M,
      updatedAt: new Date().toISOString().split("T")[0]
    });
    ae(!1);
    alert("已将后续所有未上课次统一延期 " + J + " 天");
  };

  const Vt = () => {
    const M = bf(r);
    navigator.clipboard.writeText(M);
    ie(!0);
    setTimeout(() => ie(!1), 2500);
  };

  // Batch lesson delete helpers
  const toggleSelectLesson = (id) => {
    setSelectedLessonIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllFilteredLessons = () => {
    const allSelected = Mt.length > 0 && Mt.every(M => selectedLessonIds.has(M.id));
    if (allSelected) {
      setSelectedLessonIds(prev => {
        const next = new Set(prev);
        Mt.forEach(M => next.delete(M.id));
        return next;
      });
    } else {
      setSelectedLessonIds(prev => {
        const next = new Set(prev);
        Mt.forEach(M => next.add(M.id));
        return next;
      });
    }
  };

  const clearLessonSelection = () => {
    setSelectedLessonIds(new Set());
  };

  const confirmBatchDeleteLessons = () => {
    const count = selectedLessonIds.size;
    if (count === 0) return;
    re(prev => [...prev, r]);
    let remaining = r.lessons.filter(M => !selectedLessonIds.has(M.id));
    if (autoRenumberLessons) {
      remaining = remaining.map((M, idx) => ({ ...M, lessonIndex: idx + 1 }));
    }
    const lastLesson = remaining[remaining.length - 1];
    const newEndDate = lastLesson ? lastLesson.date : r.startDate;
    u({
      ...r,
      lessons: remaining,
      totalLessons: remaining.length,
      endDate: newEndDate,
      updatedAt: new Date().toISOString().split("T")[0]
    });
    setSelectedLessonIds(new Set());
    setIsBatchLessonModalOpen(false);
    Qe("已成功批量删除 " + count + " 节已排课次！");
    setTimeout(() => Qe(""), 4000);
  };

  const confirmSingleLessonDelete = (lesson) => {
    re(prev => [...prev, r]);
    let remaining = r.lessons.filter(M => M.id !== lesson.id);
    if (autoRenumberLessons) {
      remaining = remaining.map((M, idx) => ({ ...M, lessonIndex: idx + 1 }));
    }
    const lastLesson = remaining[remaining.length - 1];
    const newEndDate = lastLesson ? lastLesson.date : r.startDate;
    u({
      ...r,
      lessons: remaining,
      totalLessons: remaining.length,
      endDate: newEndDate,
      updatedAt: new Date().toISOString().split("T")[0]
    });
    setSingleLessonToDelete(null);
    Qe("已删除第 " + lesson.lessonIndex + " 课【" + lesson.lessonCode + "】！");
    setTimeout(() => Qe(""), 4000);
  };

  return s.jsxs("div", {
    className: "space-y-6 max-w-7xl mx-auto pb-12",
    children: [
      s.jsxs("div", {
        className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4",
        children: [
          s.jsxs("div", {
            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4",
            children: [
              s.jsxs("div", {
                className: "flex items-center space-x-3",
                children: [
                  s.jsxs("button", {
                    onClick: D,
                    className: "p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors",
                    title: "返回班级列表",
                    children: s.jsx(xm, { className: "w-4 h-4" })
                  }),
                  s.jsxs("div", {
                    children: [
                      s.jsxs("div", {
                        className: "flex items-center space-x-2",
                        children: [
                          s.jsx("h1", { className: "text-lg font-extrabold text-slate-900 tracking-tight", children: r.className }),
                          s.jsxs("span", {
                            className: "font-extrabold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-xs flex items-center space-x-1",
                            children: [
                              s.jsx(Nt, { className: "w-3 h-3 text-amber-600" }),
                              s.jsx("span", { children: r.textbook || "Big Fun 1" })
                            ]
                          }),
                          s.jsx("span", {
                            className: "bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-2 py-0.5 rounded-md",
                            children: r.levelName
                          })
                        ]
                      }),
                      s.jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: ["班级代码: ", r.id, " | 最近更新: ", r.updatedAt || r.startDate] })
                    ]
                  })
                ]
              }),
              s.jsxs("div", {
                className: "flex items-center space-x-2 flex-wrap gap-1",
                children: [
                  s.jsxs("button", {
                    onClick: Vt,
                    className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center space-x-1",
                    children: [
                      V ? s.jsx(us, { className: "w-3.5 h-3.5 text-emerald-600" }) : s.jsx(wi, { className: "w-3.5 h-3.5 text-slate-500" }),
                      s.jsx("span", { children: V ? "已复制通知" : "家校通知" })
                    ]
                  }),
                  s.jsxs("button", {
                    onClick: () => mf(r),
                    className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center space-x-1",
                    children: [
                      s.jsx(Nf, { className: "w-3.5 h-3.5 text-slate-500" }),
                      s.jsx("span", { children: "导出 Excel" })
                    ]
                  }),
                  s.jsxs("button", {
                    onClick: () => Q(r),
                    className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center space-x-1",
                    children: [
                      s.jsx(ji, { className: "w-3.5 h-3.5 text-slate-500" }),
                      s.jsx("span", { children: "打印排课单" })
                    ]
                  }),
                  s.jsxs("button", {
                    onClick: () => W(!0),
                    className: "px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold transition-colors flex items-center space-x-1",
                    children: [
                      s.jsx(sn, { className: "w-3.5 h-3.5 text-indigo-600" }),
                      s.jsx("span", { children: "修改基本信息" })
                    ]
                  }),
                  N && s.jsx("button", {
                    onClick: () => C(!0),
                    className: "p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-xs font-bold transition-colors",
                    title: "删除此班级进度表",
                    children: s.jsx(Tt, { className: "w-3.5 h-3.5" })
                  })
                ]
              })
            ]
          }),
          s.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600",
            children: [
              s.jsxs("div", {
                className: "space-y-0.5",
                children: [
                  s.jsx("span", { className: "text-slate-400 block", children: "授课教师:" }),
                  s.jsxs("span", {
                    className: "font-bold text-slate-800 flex items-center space-x-1",
                    children: [
                      s.jsx(Io, { className: "w-3.5 h-3.5 text-indigo-600" }),
                      s.jsx("span", { children: r.teacher })
                    ]
                  })
                ]
              }),
              s.jsxs("div", {
                className: "space-y-0.5",
                children: [
                  s.jsx("span", { className: "text-slate-400 block", children: "上课教室:" }),
                  s.jsxs("span", {
                    className: "font-bold text-slate-800 flex items-center space-x-1",
                    children: [
                      s.jsx(Wo, { className: "w-3.5 h-3.5 text-indigo-600" }),
                      s.jsx("span", { children: r.classroom })
                    ]
                  })
                ]
              }),
              s.jsxs("div", {
                className: "space-y-0.5",
                children: [
                  s.jsx("span", { className: "text-slate-400 block", children: "固定排课时段:" }),
                  s.jsxs("span", {
                    className: "font-bold text-slate-800 flex items-center space-x-1",
                    children: [
                      s.jsx(Na, { className: "w-3.5 h-3.5 text-amber-600" }),
                      s.jsx("span", { children: r.slots.map(M => al[M.dayOfWeek] + " " + M.startTime + "-" + M.endTime).join(" / ") })
                    ]
                  })
                ]
              }),
              s.jsxs("div", {
                className: "space-y-0.5",
                children: [
                  s.jsx("span", { className: "text-slate-400 block", children: "开课与预结课日期:" }),
                  s.jsxs("span", {
                    className: "font-bold text-slate-800 flex items-center space-x-1",
                    children: [
                      s.jsx(rs, { className: "w-3.5 h-3.5 text-indigo-600" }),
                      s.jsxs("span", { children: [r.startDate, " 至 ", r.endDate] })
                    ]
                  })
                ]
              })
            ]
          }),
          (() => {
            const M = Sa(new Date);
            const ze = r.lessons.filter(q => q.date <= M).length;
            const Fe = Math.max(0, r.totalLessons - ze);
            const h = Math.round(ze / (r.totalLessons || 1) * 100);
            return s.jsxs("div", {
              className: "bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-slate-50 border border-indigo-100 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs",
              children: [
                s.jsxs("div", {
                  className: "flex items-center space-x-3",
                  children: [
                    s.jsxs("div", { className: "w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs shrink-0", children: [h, "%"] }),
                    s.jsxs("div", {
                      children: [
                        s.jsxs("div", { className: "font-bold text-slate-800 flex items-center space-x-2", children: [
                          s.jsxs("span", { children: ["📅 课程完成度自动呈现 (今日: ", M, ")"] }),
                          s.jsx("span", { className: "text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200", children: "按时间节点实时判定" })
                        ]}),
                        s.jsxs("div", { className: "text-slate-600 space-x-3 mt-1 font-medium", children: [
                          s.jsxs("span", { children: ["截至今日已上课: ", s.jsx("strong", { className: "text-indigo-700 font-bold", children: ze }), " 节"] }),
                          s.jsx("span", { className: "text-slate-300", children: "|" }),
                          s.jsxs("span", { children: ["剩余待上: ", s.jsx("strong", { className: "text-amber-700 font-bold", children: Fe }), " 节"] }),
                          s.jsx("span", { className: "text-slate-300", children: "|" }),
                          s.jsxs("span", { children: ["全期总排课: ", s.jsx("strong", { className: "text-slate-800 font-bold", children: r.totalLessons }), " 节"] })
                        ]})
                      ]
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "flex items-center space-x-2 self-start md:self-center flex-wrap gap-2",
                  children: [
                    Se.length > 0 && s.jsxs("button", {
                      type: "button",
                      onClick: () => {
                        const q = Se[Se.length - 1];
                        re(ee => ee.slice(0, ee.length - 1));
                        u(q);
                        Qe("已成功撤回上一次操作，课表恢复原样！");
                        setTimeout(() => Qe(""), 4000);
                      },
                      className: "px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-extrabold text-xs shadow-xs flex items-center space-x-1.5 transition-all hover:scale-[1.02] animate-pulse",
                      title: "撤回上一次操作，恢复先前的课表数据",
                      children: [
                        s.jsx(Si, { className: "w-3.5 h-3.5" }),
                        s.jsxs("span", { children: ["↩️ 撤回上一次操作 (", Se.length, ")"] })
                      ]
                    }),
                    s.jsxs("button", {
                      type: "button",
                      onClick: () => {
                        const q = r.lessons.find(ee => ee.date >= M) || r.lessons[0];
                        xe(q ? q.lessonIndex : 1);
                        F(!0);
                      },
                      className: "px-3.5 py-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-lg font-bold text-xs shadow-2xs flex items-center space-x-1.5 transition-all hover:scale-[1.02]",
                      title: "因请假休课或临时调课，将指定课次及后续课程整体往后顺延",
                      children: [
                        s.jsx(Na, { className: "w-3.5 h-3.5 text-amber-600" }),
                        s.jsx("span", { children: "休课顺延重排" })
                      ]
                    }),
                    s.jsxs("button", {
                      type: "button",
                      onClick: () => {
                        const q = r.lessons.find(ee => ee.date >= M) || r.lessons[0];
                        se(q ? q.lessonIndex : 1);
                        T && T.length > 0 && A(T[0].id);
                        ye(!0);
                      },
                      className: "px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all hover:scale-[1.02]",
                      title: "中途升班、更换教材或调整教学路线",
                      children: [
                        s.jsx(sl, { className: "w-3.5 h-3.5 text-amber-300" }),
                        s.jsx("span", { children: "中途升级/换教材" })
                      ]
                    })
                  ]
                })
              ]
            });
          })(),
          nt && s.jsxs("div", {
            className: "bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between border border-emerald-600 animate-fadeIn",
            children: [
              s.jsxs("div", {
                className: "flex items-center space-x-2",
                children: [
                  s.jsx(us, { className: "w-4 h-4 text-emerald-100" }),
                  s.jsx("span", { children: nt })
                ]
              }),
              s.jsx("button", { onClick: () => Qe(""), className: "text-white/80 hover:text-white font-bold text-sm px-1", children: "✕" })
            ]
          })
        ]
      }),
      s.jsxs("div", {
        className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3",
        children: [
          s.jsxs("div", {
            className: "flex items-center space-x-2 flex-wrap gap-2",
            children: [
              s.jsxs("span", { className: "text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200", children: ["全部课次 (", r.lessons.length, " 节)"] }),
              selectedLessonIds.size > 0 && s.jsxs("span", { className: "text-xs font-extrabold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200", children: ["已勾选 ", selectedLessonIds.size, " 节"] }),
              s.jsx("span", { className: "text-[11px] text-slate-400", children: "💡 勾选左侧选择框可批量删除已排课次，每一行支持单独顺延或删除。" })
            ]
          }),
          s.jsxs("div", {
            className: "flex items-center space-x-2 flex-wrap gap-2",
            children: [
              s.jsxs("div", {
                className: "relative",
                children: [
                  s.jsx(_i, { className: "w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" }),
                  s.jsx("input", {
                    type: "text",
                    value: b,
                    onChange: M => X(M.target.value),
                    placeholder: "搜索课次代码/主题...",
                    className: "pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48"
                  })
                ]
              }),
              s.jsxs("button", {
                onClick: () => ae(!0),
                className: "px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-bold transition-colors flex items-center space-x-1",
                title: "因天气或突发休课，一键顺延后续所有课次",
                children: [
                  s.jsx(Ni, { className: "w-3.5 h-3.5 text-amber-600" }),
                  s.jsx("span", { children: "一键顺延后续课次" })
                ]
              })
            ]
          })
        ]
      }),
      selectedLessonIds.size > 0 && s.jsxs("div", {
        className: "bg-rose-900 text-white p-3.5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 border border-rose-700 animate-fadeIn",
        children: [
          s.jsxs("div", {
            className: "flex items-center space-x-3",
            children: [
              s.jsx("span", {
                className: "w-7 h-7 rounded-full bg-rose-600 border border-rose-400 flex items-center justify-center font-bold text-xs text-white shrink-0",
                children: selectedLessonIds.size
              }),
              s.jsxs("div", {
                children: [
                  s.jsxs("span", { className: "font-bold text-xs", children: ["已勾选 ", selectedLessonIds.size, " 节排课 (当前列表共 ", Mt.length, " 节)"] }),
                  s.jsx("p", { className: "text-[11px] text-rose-200", children: "支持批量移除指定课次并自动连贯重排序号。" })
                ]
              })
            ]
          }),
          s.jsxs("div", {
            className: "flex items-center space-x-2",
            children: [
              s.jsx("button", {
                type: "button",
                onClick: toggleSelectAllFilteredLessons,
                className: "px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-xs font-semibold rounded-lg transition-colors",
                children: Mt.length > 0 && Mt.every(M => selectedLessonIds.has(M.id)) ? "取消全选" : "全选当前课次"
              }),
              s.jsx("button", {
                type: "button",
                onClick: clearLessonSelection,
                className: "px-3 py-1.5 bg-rose-800/70 hover:bg-rose-700 text-xs font-semibold rounded-lg transition-colors",
                children: "清空选择"
              }),
              s.jsxs("button", {
                type: "button",
                onClick: () => setIsBatchLessonModalOpen(true),
                className: "px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 transition-all hover:scale-105",
                children: [
                  s.jsx(Tt, { className: "w-3.5 h-3.5 text-rose-600" }),
                  s.jsxs("span", { children: ["批量删除选中课次 (", selectedLessonIds.size, ")"] })
                ]
              })
            ]
          })
        ]
      }),
      s.jsx("div", {
        className: "bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto",
        children: s.jsxs("table", {
          className: "w-full text-left text-xs",
          children: [
            s.jsx("thead", {
              className: "bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 sticky top-16 z-10",
              children: s.jsxs("tr", {
                children: [
                  s.jsx("th", {
                    className: "py-3 px-2 w-10 text-center text-[11px]",
                    children: s.jsx("input", {
                      type: "checkbox",
                      checked: Mt.length > 0 && Mt.every(M => selectedLessonIds.has(M.id)),
                      onChange: toggleSelectAllFilteredLessons,
                      className: "w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer",
                      title: "全选当前列表课次"
                    })
                  }),
                  s.jsx("th", { className: "py-3 px-2 w-12 text-center text-[11px]", children: "课次" }),
                  s.jsx("th", { className: "py-3 px-3 w-28 text-[11px]", children: "上课日期" }),
                  s.jsx("th", { className: "py-3 px-2 w-14 text-[11px]", children: "星期" }),
                  s.jsx("th", { className: "py-3 px-3 w-24 text-[11px]", children: "时间段" }),
                  s.jsx("th", { className: "py-3 px-3 w-28 text-[11px]", children: "课次编号 (可修改)" }),
                  s.jsx("th", { className: "py-3 px-3 text-[11px]", children: "课堂内容" }),
                  s.jsx("th", { className: "py-3 px-3 w-24 text-[11px]", children: "授课老师" }),
                  s.jsx("th", { className: "py-3 px-3 w-20 text-[11px]", children: "教室" }),
                  s.jsx("th", { className: "py-3 px-3 w-32 text-[11px]", children: "备注/休课因由" }),
                  s.jsx("th", { className: "py-3 px-3 w-28 text-center text-[11px]", children: "快捷操作" })
                ]
              })
            }),
            s.jsx("tbody", {
              className: "divide-y divide-slate-100",
              children: Mt.length === 0 ? s.jsx("tr", {
                children: s.jsx("td", { colSpan: 11, className: "text-center py-10 text-slate-400", children: "没有找到符合条件的课次记录" })
              }) : Mt.map(M => {
                const isSelected = selectedLessonIds.has(M.id);
                return s.jsxs("tr", {
                  className: "transition-colors " + (isSelected ? "bg-rose-50/50 hover:bg-rose-50" : "hover:bg-indigo-50/30 odd:bg-white even:bg-slate-50/30"),
                  children: [
                    s.jsx("td", {
                      className: "py-2.5 px-2 text-center",
                      children: s.jsx("input", {
                        type: "checkbox",
                        checked: isSelected,
                        onChange: () => toggleSelectLesson(M.id),
                        className: "w-3.5 h-3.5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                      })
                    }),
                    s.jsx("td", { className: "py-2.5 px-2 text-center text-slate-400 font-mono font-bold", children: M.lessonIndex }),
                    s.jsx("td", {
                      className: "py-2.5 px-3",
                      children: s.jsx("input", {
                        type: "date",
                        value: M.date,
                        onChange: ze => bt(M.id, "date", ze.target.value),
                        className: "bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded px-1 py-0.5 text-xs font-semibold text-slate-800"
                      })
                    }),
                    s.jsx("td", { className: "py-2.5 px-2 text-slate-600 font-medium", children: M.dayOfWeekStr }),
                    s.jsx("td", { className: "py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap", children: M.timeSlot }),
                    s.jsx("td", {
                      className: "py-2.5 px-3",
                      children: s.jsx("input", {
                        type: "text",
                        value: M.lessonCode,
                        onChange: ze => bt(M.id, "lessonCode", ze.target.value),
                        className: "w-24 px-2 py-1 font-mono font-bold text-[11px] bg-indigo-50/80 hover:bg-white focus:bg-white border border-indigo-200 hover:border-indigo-400 focus:border-indigo-600 rounded-md text-indigo-800 outline-none transition-all shadow-2xs",
                        title: "可直接编辑修改具体课次编号 (如 U1L1, U2L3, Review1)"
                      })
                    }),
                    s.jsx("td", {
                      className: "py-2.5 px-3",
                      children: s.jsx("input", {
                        type: "text",
                        value: M.topic,
                        onChange: ze => bt(M.id, "topic", ze.target.value),
                        className: "w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded px-2 py-1 text-xs text-slate-800 font-medium"
                      })
                    }),
                    s.jsx("td", {
                      className: "py-2.5 px-3",
                      children: s.jsx("input", {
                        type: "text",
                        value: M.teacher,
                        onChange: ze => bt(M.id, "teacher", ze.target.value),
                        className: "w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded px-1.5 py-0.5 text-xs text-slate-700"
                      })
                    }),
                    s.jsx("td", { className: "py-2.5 px-3 text-slate-500 text-[11px]", children: M.classroom }),
                    s.jsx("td", {
                      className: "py-2.5 px-3",
                      children: s.jsx("input", {
                        type: "text",
                        value: M.note || "",
                        placeholder: "添加备注...",
                        onChange: ze => bt(M.id, "note", ze.target.value),
                        className: "w-full bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded px-1.5 py-0.5 text-slate-500 text-[11px]"
                      })
                    }),
                    s.jsxs("td", {
                      className: "py-2.5 px-3 text-center space-x-1.5 whitespace-nowrap",
                      children: [
                        s.jsxs("button", {
                          type: "button",
                          onClick: () => { xe(M.lessonIndex); me(1); F(!0); },
                          className: "inline-flex items-center space-x-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold transition-all shadow-2xs",
                          title: "顺延此课：将第 " + M.lessonIndex + " 课及后续所有课程顺延 1 次课",
                          children: [
                            s.jsx(Na, { className: "w-3 h-3 text-amber-600" }),
                            s.jsx("span", { children: "顺延" })
                          ]
                        }),
                        s.jsx("button", {
                          type: "button",
                          onClick: () => setSingleLessonToDelete(M),
                          className: "inline-flex items-center p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors",
                          title: "删除此节课次",
                          children: s.jsx(Tt, { className: "w-3.5 h-3.5" })
                        })
                      ]
                    })
                  ]
                }, M.id);
              })
            })
          ]
        })
      }),
      Y && s.jsx("div", {
        className: "fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4",
          children: [
            s.jsxs("div", {
              className: "flex items-center justify-between border-b border-slate-100 pb-3",
              children: [
                s.jsxs("h3", {
                  className: "font-bold text-slate-900 text-base flex items-center space-x-2",
                  children: [
                    s.jsx(Ni, { className: "w-5 h-5 text-amber-600" }),
                    s.jsx("span", { children: "一键批量顺延后续课次" })
                  ]
                }),
                s.jsx("button", { onClick: () => ae(!1), className: "text-slate-400 hover:text-slate-600 text-lg font-bold", children: "✕" })
              ]
            }),
            s.jsxs("div", {
              className: "space-y-4 text-xs",
              children: [
                s.jsxs("div", {
                  className: "p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-amber-900 leading-relaxed",
                  children: [
                    s.jsx("p", { className: "font-bold", children: "适用场景：" }),
                    s.jsx("p", { className: "mt-0.5", children: "全校统一定期放假、因恶劣天气停课等情况。将后续所有未上的课次日期整体向后顺延指定天数。" })
                  ]
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "整体延期天数 (天)" }),
                    s.jsx("input", {
                      type: "number",
                      min: 1,
                      max: 60,
                      value: J,
                      onChange: M => de(parseInt(M.target.value) || 0),
                      className: "w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900"
                    })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-2 border-t border-slate-100",
              children: [
                s.jsx("button", { onClick: () => ae(!1), className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full", children: "取消" }),
                s.jsx("button", { onClick: ft, className: "px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-full shadow-sm", children: "确认统一顺延" })
              ]
            })
          ]
        })
      }),
      B && s.jsx("div", {
        className: "fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4",
          children: [
            s.jsxs("div", {
              className: "flex items-center justify-between border-b border-slate-100 pb-3",
              children: [
                s.jsxs("h3", {
                  className: "font-bold text-slate-900 text-base flex items-center space-x-2",
                  children: [
                    s.jsx(Na, { className: "w-5 h-5 text-amber-600" }),
                    s.jsx("span", { children: "单次请假 / 休课顺延重排" })
                  ]
                }),
                s.jsx("button", { onClick: () => F(!1), className: "text-slate-400 hover:text-slate-600 text-lg font-bold", children: "✕" })
              ]
            }),
            s.jsxs("div", {
              className: "space-y-4 text-xs",
              children: [
                s.jsxs("div", {
                  className: "p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 leading-relaxed",
                  children: [
                    s.jsx("p", { className: "font-bold", children: "顺延规则说明：" }),
                    s.jsx("p", { className: "mt-0.5", children: "将选定课次及其后续所有课程在原固定时间段规则上往后推迟，保持原有的教学大纲与主题序列不变。" })
                  ]
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "从哪一节课开始顺延？" }),
                    s.jsx("select", {
                      value: ve,
                      onChange: M => xe(parseInt(M.target.value) || 1),
                      className: "w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-800",
                      children: r.lessons.map(M => s.jsxs("option", { value: M.lessonIndex, children: ["第 ", M.lessonIndex, " 课 (", M.date, ") - ", M.lessonCode, ": ", M.topic] }, M.id))
                    })
                  ]
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "顺延课次数" }),
                    s.jsx("input", {
                      type: "number",
                      min: 1,
                      max: 20,
                      value: I,
                      onChange: M => me(parseInt(M.target.value) || 1),
                      className: "w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900"
                    })
                  ]
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "休课/顺延备注说明" }),
                    s.jsx("input", {
                      type: "text",
                      value: O,
                      onChange: M => Me(M.target.value),
                      placeholder: "例如：五一节假日调课 / 学员请假顺延",
                      className: "w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-2 border-t border-slate-100",
              children: [
                s.jsx("button", { onClick: () => F(!1), className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full", children: "取消" }),
                s.jsx("button", {
                  onClick: () => {
                    re(M => [...M, r]);
                    const ze = (function(M, ee, Fe, h) {
                      const q = [...M.lessons];
                      const qe = q.findIndex(Ye => Ye.lessonIndex === ee);
                      if (qe === -1) return M;
                      const Ke = M.slots;
                      let We = new Date(q[qe].date + "T00:00:00");
                      for (let Ye = qe; Ye < q.length; Ye++) {
                        for (let ze_step = 0; ze_step < Fe; ze_step++) {
                          We.setDate(We.getDate() + 1);
                          while (!Ke.some(ct => ct.dayOfWeek === We.getDay())) {
                            We.setDate(We.getDate() + 1);
                          }
                        }
                        const yr = We.getFullYear();
                        const mo = String(We.getMonth() + 1).padStart(2, "0");
                        const dy = String(We.getDate()).padStart(2, "0");
                        const nextDate = yr + "-" + mo + "-" + dy;
                        const dow = We.getDay();
                        q[Ye] = {
                          ...q[Ye],
                          date: nextDate,
                          dayOfWeekStr: al[dow],
                          note: q[Ye].note ? q[Ye].note + " | " + h : "[" + h + "]"
                        };
                      }
                      const lastLesson = q[q.length - 1];
                      return {
                        ...M,
                        endDate: lastLesson ? lastLesson.date : M.endDate,
                        lessons: q,
                        updatedAt: new Date().toISOString().split("T")[0]
                      };
                    })(r, ve, I, O);
                    u(ze);
                    F(!1);
                    Qe("已成功完成休课顺延重排！");
                    setTimeout(() => Qe(""), 4000);
                  },
                  className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full shadow-sm",
                  children: "确认顺延并重排"
                })
              ]
            })
          ]
        })
      }),
      pe && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4",
          children: [
            s.jsxs("div", {
              className: "flex items-center space-x-3 text-indigo-600 border-b border-slate-100 pb-3",
              children: [
                s.jsx("div", { className: "w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0", children: s.jsx(sl, { className: "w-5 h-5 text-amber-500" }) }),
                s.jsxs("div", {
                  children: [
                    s.jsx("h3", { className: "font-extrabold text-slate-900 text-base", children: "课程中途升级 / 更换教材级别" }),
                    s.jsx("p", { className: "text-xs text-slate-500", children: "在已有班级课表中指定课次起切换为新教材大纲，保持已有开课日期，自动替换后续教学主题。" })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "space-y-3 text-xs",
              children: [
                s.jsxs("div", {
                  children: [
                    s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "选择生效课次 (从此课起开始使用新教材)" }),
                    s.jsx("select", {
                      value: P,
                      onChange: M => se(parseInt(M.target.value) || 1),
                      className: "w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-800",
                      children: r.lessons.map(M => s.jsxs("option", { value: M.lessonIndex, children: ["第 ", M.lessonIndex, " 课 (", M.date, ") - 当前【", M.lessonCode, ": ", M.topic, "】"] }, M.id))
                    })
                  ]
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "目标教材模板" }),
                    s.jsx("select", {
                      value: _e,
                      onChange: M => {
                        A(M.target.value);
                        const ze = T.find(Fe => Fe.id === M.target.value);
                        ze && ze.startUnitNum !== void 0 && K(ze.startUnitNum);
                      },
                      className: "w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-800",
                      children: T.map(M => s.jsxs("option", { value: M.id, children: [M.name, " [", M.category, "] (", M.unitsCount, " 单元 / ", M.lessonsPerUnit, " 课/单元)"] }, M.id))
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "grid grid-cols-2 gap-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100",
                  children: [
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-indigo-900 mb-1", children: "新教材起始 Unit 单元" }),
                        s.jsxs("div", {
                          className: "flex items-center space-x-1",
                          children: [
                            s.jsx("span", { className: "font-bold text-indigo-700", children: "Unit" }),
                            s.jsx("input", {
                              type: "number",
                              min: 0,
                              max: 20,
                              value: y,
                              onChange: M => K(parseInt(M.target.value) || 0),
                              className: "w-20 px-2 py-1 bg-white border border-indigo-300 rounded font-bold text-center text-slate-800"
                            })
                          ]
                        }),
                        s.jsx("span", { className: "text-[10px] text-slate-500 mt-0.5 block", children: "支持从 Unit 0 或 Unit 1 开始" })
                      ]
                    }),
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-indigo-900 mb-1", children: "新教材起始 Lesson 课次" }),
                        s.jsxs("div", {
                          className: "flex items-center space-x-1",
                          children: [
                            s.jsx("span", { className: "font-bold text-indigo-700", children: "Lesson" }),
                            s.jsx("input", {
                              type: "number",
                              min: 1,
                              max: 20,
                              value: ce,
                              onChange: M => te(parseInt(M.target.value) || 1),
                              className: "w-20 px-2 py-1 bg-white border border-indigo-300 rounded font-bold text-center text-slate-800"
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),
                (() => {
                  const M = T.find(ze => ze.id === _e);
                  return M ? s.jsxs("div", {
                    className: "p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 space-y-1 text-[11px]",
                    children: [
                      s.jsxs("div", { className: "font-bold text-slate-800 flex items-center justify-between", children: [s.jsxs("span", { children: ["✨ 切换预览 (", M.name, ")："] }), s.jsx("span", { className: "text-indigo-600 font-semibold", children: M.category })] }),
                      s.jsxs("p", { children: ["• 将第 ", s.jsx("strong", { children: P }), " 课至第 ", s.jsx("strong", { children: r.totalLessons }), " 课（共 ", r.totalLessons - P + 1, " 节课）的大纲内容替换为【", M.name, "】从 Unit ", y, " Lesson ", ce, " 开始的教学序列。"] }),
                      s.jsx("p", { className: "text-slate-500", children: "• 各课次原有的上课日期、时间段、授课老师和教室保持全盘不变。" })
                    ]
                  }) : null;
                })()
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-3 border-t border-slate-100",
              children: [
                s.jsx("button", { type: "button", onClick: () => ye(!1), className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl", children: "取消" }),
                s.jsxs("button", {
                  type: "button",
                  onClick: () => {
                    const M = T.find(Fe => Fe.id === _e);
                    if (!M) return;
                    const ze = Fh(r, P, M, y, ce);
                    u(ze);
                    ye(!1);
                  },
                  className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1",
                  children: [
                    s.jsx(sl, { className: "w-3.5 h-3.5" }),
                    s.jsx("span", { children: "确认按新教材更新后续课程" })
                  ]
                })
              ]
            })
          ]
        })
      }),
      $ && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4",
          children: [
            s.jsxs("div", {
              className: "flex items-center justify-between border-b border-slate-100 pb-3",
              children: [
                s.jsxs("div", { className: "flex items-center space-x-2", children: [s.jsx(sn, { className: "w-5 h-5 text-indigo-600" }), s.jsx("h3", { className: "font-extrabold text-slate-900 text-base", children: "修改班级基本信息与教材" })] }),
                s.jsx("button", { type: "button", onClick: () => W(!1), className: "p-1 text-slate-400 hover:text-slate-600 rounded-full", children: s.jsx(zm, { className: "w-5 h-5" }) })
              ]
            }),
            s.jsxs("div", {
              className: "space-y-3 text-xs",
              children: [
                s.jsxs("div", {
                  children: [
                    s.jsxs("label", { className: "block font-bold text-slate-700 mb-1", children: ["班级名称 ", s.jsx("span", { className: "text-rose-500", children: "*" })] }),
                    s.jsx("input", { type: "text", value: G, onChange: M => he(M.target.value), className: "w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" })
                  ]
                }),
                s.jsxs("div", {
                  children: [
                    s.jsxs("label", { className: "block font-bold text-amber-900 mb-1 flex items-center space-x-1", children: [s.jsx(Nt, { className: "w-3.5 h-3.5 text-amber-600" }), s.jsxs("span", { children: ["教材全称 (Textbook) ", s.jsx("span", { className: "text-rose-500", children: "*" })] })] }),
                    s.jsx("input", {
                      type: "text",
                      value: Ne,
                      onChange: M => Ve(M.target.value),
                      placeholder: "例: Big Fun 1 / Pearson Big English 1",
                      className: "w-full px-3 py-2 border border-amber-300 rounded-xl font-bold text-amber-950 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                    }),
                    s.jsx("p", { className: "text-[10px] text-slate-400 mt-1", children: "修改后总视图及本班级所有课表中均会同步实时更新此教材名称。" })
                  ]
                }),
                s.jsxs("div", {
                  className: "grid grid-cols-2 gap-3",
                  children: [
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "授课老师" }),
                        s.jsx("input", { type: "text", value: He, onChange: M => Et(M.target.value), className: "w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" })
                      ]
                    }),
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "上课教室" }),
                        s.jsx("input", { type: "text", value: At, onChange: M => L(M.target.value), className: "w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" })
                      ]
                    })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-3 border-t border-slate-100",
              children: [
                s.jsx("button", { type: "button", onClick: () => W(!1), className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl", children: "取消" }),
                s.jsx("button", {
                  type: "button",
                  onClick: () => {
                    if (!G.trim()) { alert("请输入班级名称"); return; }
                    u({
                      ...r,
                      className: G.trim(),
                      textbook: Ne.trim() || "Big Fun 1",
                      teacher: He.trim() || r.teacher,
                      classroom: At.trim() || r.classroom
                    });
                    W(!1);
                  },
                  className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs",
                  children: "保存更新信息"
                })
              ]
            })
          ]
        })
      }),
      d && N && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4",
          children: [
            s.jsxs("div", {
              className: "flex items-center space-x-3 text-rose-600",
              children: [
                s.jsx("div", { className: "w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0", children: s.jsx(Tt, { className: "w-5 h-5 text-rose-600" }) }),
                s.jsxs("div", {
                  children: [
                    s.jsxs("h3", { className: "font-extrabold text-slate-900 text-base", children: ["确认彻底删除班级【", r.className, "】？"] }),
                    s.jsx("p", { className: "text-xs text-slate-500", children: "删除后此班级的课表和进度数据将全盘清空，且不可恢复。" })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-2",
              children: [
                s.jsx("button", { type: "button", onClick: () => C(!1), className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full", children: "取消" }),
                s.jsx("button", {
                  type: "button",
                  onClick: () => { N(r.id); C(!1); },
                  className: "px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-sm",
                  children: "确认彻底删除"
                })
              ]
            })
          ]
        })
      }),
      singleLessonToDelete && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp",
          children: [
            s.jsxs("div", {
              className: "flex items-center space-x-3 text-rose-600",
              children: [
                s.jsx("div", { className: "w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0", children: s.jsx(Tt, { className: "w-5 h-5 text-rose-600" }) }),
                s.jsxs("div", {
                  children: [
                    s.jsxs("h3", { className: "font-extrabold text-slate-900 text-base", children: ["确认删除第 ", singleLessonToDelete.lessonIndex, " 课？"] }),
                    s.jsx("p", { className: "text-xs text-slate-500", children: "删除后此课次将被移除，班级排课总数将自动调整。" })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1",
              children: [
                s.jsxs("div", { className: "flex justify-between", children: [s.jsx("span", { className: "text-slate-500", children: "课次代码与主题：" }), s.jsxs("span", { className: "font-bold text-slate-900", children: [singleLessonToDelete.lessonCode, " - ", singleLessonToDelete.topic] })] }),
                s.jsxs("div", { className: "flex justify-between", children: [s.jsx("span", { className: "text-slate-500", children: "原定上课时间：" }), s.jsxs("span", { className: "font-semibold text-slate-700", children: [singleLessonToDelete.date, " (", singleLessonToDelete.dayOfWeekStr, ") ", singleLessonToDelete.timeSlot] })] })
              ]
            }),
            s.jsxs("div", {
              className: "flex items-center space-x-2 pt-1",
              children: [
                s.jsx("input", {
                  type: "checkbox",
                  id: "autoRenumberSingle",
                  checked: autoRenumberLessons,
                  onChange: e => setAutoRenumberLessons(e.target.checked),
                  className: "w-4 h-4 rounded text-indigo-600"
                }),
                s.jsx("label", { htmlFor: "autoRenumberSingle", className: "text-xs font-semibold text-slate-700 cursor-pointer", children: "自动重新按 1, 2, 3... 连续递增排列后续课次序号" })
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-2 border-t border-slate-100",
              children: [
                s.jsx("button", { type: "button", onClick: () => setSingleLessonToDelete(null), className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full", children: "取消" }),
                s.jsx("button", {
                  type: "button",
                  onClick: () => confirmSingleLessonDelete(singleLessonToDelete),
                  className: "px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-sm",
                  children: "确认删除此课"
                })
              ]
            })
          ]
        })
      }),
      isBatchLessonModalOpen && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp",
          children: [
            s.jsxs("div", {
              className: "flex items-center space-x-3 text-rose-600",
              children: [
                s.jsx("div", { className: "w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0", children: s.jsx(Tt, { className: "w-5 h-5 text-rose-600" }) }),
                s.jsxs("div", {
                  children: [
                    s.jsx("h3", { className: "font-extrabold text-slate-900 text-base", children: "确认批量删除选中的已排课次？" }),
                    s.jsx("p", { className: "text-xs text-slate-500", children: "删除后所选课次将从课表中剔除，班级总课次与结课日期将同步重新计算。" })
                  ]
                })
              ]
            }),
            s.jsxs("div", {
              className: "p-3.5 bg-rose-50/70 rounded-xl border border-rose-100 text-xs text-rose-950 space-y-1 font-medium",
              children: [
                s.jsxs("div", { className: "flex justify-between items-center font-bold", children: [s.jsx("span", { children: "待删除课次总数：" }), s.jsxs("span", { className: "text-rose-700 font-mono text-sm", children: [selectedLessonIds.size, " 节课"] })] }),
                s.jsxs("div", { className: "flex justify-between items-center", children: [s.jsx("span", { children: "删除后课表总数：" }), s.jsxs("span", { className: "font-bold text-slate-800", children: [r.lessons.length, " 节 ➔ ", r.lessons.length - selectedLessonIds.size, " 节"] })] })
              ]
            }),
            s.jsxs("div", {
              className: "space-y-1.5 max-h-48 overflow-y-auto pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50",
              children: [
                s.jsx("div", { className: "text-[11px] font-bold text-slate-400 px-1 mb-1", children: "即将删除的课次明细：" }),
                r.lessons.filter(M => selectedLessonIds.has(M.id)).map(M => s.jsxs("div", {
                  className: "p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between",
                  children: [
                    s.jsxs("div", {
                      children: [
                        s.jsxs("span", { className: "font-bold text-slate-900 font-mono", children: ["第 ", M.lessonIndex, " 课 [", M.lessonCode, "]"] }),
                        s.jsx("span", { className: "text-slate-600 ml-2 truncate max-w-[160px] inline-block align-bottom", children: M.topic })
                      ]
                    }),
                    s.jsxs("span", { className: "font-mono text-slate-500 text-[11px] bg-slate-100 px-2 py-0.5 rounded", children: [M.date, " ", M.timeSlot] })
                  ]
                }, M.id))
              ]
            }),
            s.jsxs("div", {
              className: "flex items-center space-x-2 pt-1",
              children: [
                s.jsx("input", {
                  type: "checkbox",
                  id: "autoRenumberBatch",
                  checked: autoRenumberLessons,
                  onChange: e => setAutoRenumberLessons(e.target.checked),
                  className: "w-4 h-4 rounded text-indigo-600 cursor-pointer"
                }),
                s.jsx("label", { htmlFor: "autoRenumberBatch", className: "text-xs font-semibold text-slate-700 cursor-pointer", children: "自动重新连续编号课次序号 (保持 1, 2, 3... 序号连贯递增)" })
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-2 border-t border-slate-100",
              children: [
                s.jsx("button", { type: "button", onClick: () => setIsBatchLessonModalOpen(false), className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full", children: "取消" }),
                s.jsxs("button", {
                  type: "button",
                  onClick: confirmBatchDeleteLessons,
                  className: "px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-sm flex items-center space-x-1.5",
                  children: [
                    s.jsx(Tt, { className: "w-4 h-4" }),
                    s.jsxs("span", { children: ["确认批量删除 (", selectedLessonIds.size, " 节课)"] })
                  ]
                })
              ]
            })
          ]
        })
      })
    ]
  });
}`;

fs.writeFileSync('cb_new.js', cb_new_code);
fs.writeFileSync('eb_new.js', eb_new_code);
console.log('Successfully wrote cb_new.js and eb_new.js');
