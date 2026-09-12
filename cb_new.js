Cb=({schedules:r,levels:T,teachers:j,onSelectSchedule:u,onOpenQuickWizard:N,onDeleteSchedule:D,onBatchDeleteSchedules:batchDel,onOpenPrintModal:Q})=>{
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
                      s.jsxs("span", {
                        className: "bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 shrink-0 flex items-center space-x-1",
                        children: [
                          s.jsx(Io, { className: "w-3 h-3 text-slate-400" }),
                          s.jsx("span", { children: O.teacher })
                        ]
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
}