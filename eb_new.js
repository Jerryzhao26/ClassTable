Eb=({schedule:r,templates:T=[],holidays:j=[],onUpdateSchedule:u,onDeleteSchedule:N,onBack:D,onOpenPrintModal:Q})=>{
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

  // Insert lesson state & helpers
  const [isInsertLessonModalOpen, setIsInsertLessonModalOpen] = _.useState(false);
  const [insertTargetPosition, setInsertTargetPosition] = _.useState(1);
  const [insertLessonCode, setInsertLessonCode] = _.useState("Review 1");
  const [insertLessonTopic, setInsertLessonTopic] = _.useState("阶段知识点综合复习与测评");
  const [insertLessonTeacher, setInsertLessonTeacher] = _.useState(r.teacher);
  const [insertLessonClassroom, setInsertLessonClassroom] = _.useState(r.classroom);
  const [insertLessonNote, setInsertLessonNote] = _.useState("特定插入课次");
  const [insertDateMode, setInsertDateMode] = _.useState("slot_shift"); // "slot_shift" | "custom"
  const [insertCustomDate, setInsertCustomDate] = _.useState(r.startDate || "");
  const [insertCustomTimeSlot, setInsertCustomTimeSlot] = _.useState("");
  const [insertAutoShiftSubsequent, setInsertAutoShiftSubsequent] = _.useState(true);

  const insertPresets = [
    { label: "🎯 复习课 (Review)", code: "Review", topic: "阶段知识点综合复习与重点强化", note: "阶段复习加课" },
    { label: "📝 阶段测验 (Quiz)", code: "Quiz", topic: "单元知识点测评与随堂测验", note: "阶段测验" },
    { label: "🏆 期中考 (Midterm)", code: "Midterm", topic: "期中能力综合测评与诊断", note: "期中考试" },
    { label: "🏅 期末总复习 (Final)", code: "Final Exam", topic: "期末全真结课总复习与综合评定", note: "期末总评" },
    { label: "💡 补课答疑 (Makeup)", code: "Makeup", topic: "难点攻坚与个别答疑加练", note: "补课答疑" },
    { label: "🎉 活动拓展 (Activity)", code: "Activity", topic: "阶段性教学成果汇报与实践课", note: "活动拓展课" }
  ];

  const getNextSlotDate = (afterDateStr, slots, holidaysList = []) => {
    let d = new Date(afterDateStr + "T00:00:00");
    d.setDate(d.getDate() + 1);
    const validSlots = slots && slots.length > 0 ? slots : [{ dayOfWeek: 3, startTime: "17:00", endTime: "18:30" }, { dayOfWeek: 6, startTime: "09:30", endTime: "11:00" }];
    const isValid = (dt) => {
      const dow = dt.getDay();
      if (!validSlots.some(s => s.dayOfWeek === dow)) return false;
      const yr = dt.getFullYear();
      const mo = String(dt.getMonth() + 1).padStart(2, "0");
      const dy = String(dt.getDate()).padStart(2, "0");
      const dStr = yr + "-" + mo + "-" + dy;
      if (holidaysList && holidaysList.length) {
        if (holidaysList.some(h => (h.date === dStr) || (h.startDate && h.endDate && dStr >= h.startDate && dStr <= h.endDate))) {
          return false;
        }
      }
      return true;
    };
    let safetyCounter = 0;
    while (!isValid(d) && safetyCounter < 180) {
      d.setDate(d.getDate() + 1);
      safetyCounter++;
    }
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const dy = String(d.getDate()).padStart(2, "0");
    const dow = d.getDay();
    const slot = validSlots.find(s => s.dayOfWeek === dow) || validSlots[0];
    return {
      date: yr + "-" + mo + "-" + dy,
      dayOfWeekStr: al[dow],
      timeSlot: slot ? (slot.startTime + "-" + slot.endTime) : "17:00-18:30"
    };
  };

  const openInsertLessonModal = (afterLessonIndex) => {
    const pos = afterLessonIndex !== undefined ? Math.max(1, Math.min(afterLessonIndex + 1, r.lessons.length + 1)) : r.lessons.length + 1;
    setInsertTargetPosition(pos);
    setInsertLessonCode("Review 1");
    setInsertLessonTopic("阶段知识点综合复习与测评");
    setInsertLessonTeacher(r.teacher);
    setInsertLessonClassroom(r.classroom);
    setInsertLessonNote("特定插入课次");
    setInsertDateMode("slot_shift");
    setInsertAutoShiftSubsequent(true);

    const targetIdx = pos - 1;
    if (targetIdx < r.lessons.length) {
      setInsertCustomDate(r.lessons[targetIdx].date);
      setInsertCustomTimeSlot(r.lessons[targetIdx].timeSlot);
    } else if (r.lessons.length > 0) {
      const nextInfo = getNextSlotDate(r.lessons[r.lessons.length - 1].date, r.slots, j);
      setInsertCustomDate(nextInfo.date);
      setInsertCustomTimeSlot(nextInfo.timeSlot);
    } else {
      setInsertCustomDate(r.startDate || new Date().toISOString().split("T")[0]);
      setInsertCustomTimeSlot("17:00-18:30");
    }
    setIsInsertLessonModalOpen(true);
  };

  const handleConfirmInsertLesson = () => {
    if (!insertLessonCode.trim()) {
      alert("请输入课次编号（例如 Review 1）");
      return;
    }
    re(prev => [...prev, r]);
    const orig = [...r.lessons];
    const targetIdx = Math.max(0, Math.min(insertTargetPosition - 1, orig.length));
    const slots = r.slots && r.slots.length > 0 ? r.slots : [{ dayOfWeek: 3, startTime: "17:00", endTime: "18:30" }, { dayOfWeek: 6, startTime: "09:30", endTime: "11:00" }];

    let newDate = "";
    let newDow = "";
    let newTime = "";

    const shiftedOrig = orig.map(l => ({ ...l }));

    if (insertAutoShiftSubsequent) {
      if (insertDateMode === "slot_shift") {
        if (targetIdx < orig.length) {
          newDate = orig[targetIdx].date;
          newDow = orig[targetIdx].dayOfWeekStr;
          newTime = orig[targetIdx].timeSlot;

          for (let i = targetIdx; i < orig.length; i++) {
            if (i + 1 < orig.length) {
              shiftedOrig[i].date = orig[i + 1].date;
              shiftedOrig[i].dayOfWeekStr = orig[i + 1].dayOfWeekStr;
              shiftedOrig[i].timeSlot = orig[i + 1].timeSlot;
            } else {
              const nextInfo = getNextSlotDate(orig[orig.length - 1].date, slots, j);
              shiftedOrig[i].date = nextInfo.date;
              shiftedOrig[i].dayOfWeekStr = nextInfo.dayOfWeekStr;
              shiftedOrig[i].timeSlot = nextInfo.timeSlot;
            }
          }
        } else {
          const nextInfo = orig.length > 0 ? getNextSlotDate(orig[orig.length - 1].date, slots, j) : { date: r.startDate, dayOfWeekStr: "周一", timeSlot: "17:00-18:30" };
          newDate = nextInfo.date;
          newDow = nextInfo.dayOfWeekStr;
          newTime = nextInfo.timeSlot;
        }
      } else {
        newDate = insertCustomDate;
        const dObj = new Date(insertCustomDate + "T00:00:00");
        newDow = al[dObj.getDay()];
        newTime = insertCustomTimeSlot || (slots[0] ? (slots[0].startTime + "-" + slots[0].endTime) : "17:00-18:30");

        for (let i = targetIdx; i < orig.length; i++) {
          if (i + 1 < orig.length) {
            shiftedOrig[i].date = orig[i + 1].date;
            shiftedOrig[i].dayOfWeekStr = orig[i + 1].dayOfWeekStr;
            shiftedOrig[i].timeSlot = orig[i + 1].timeSlot;
          } else {
            const nextInfo = getNextSlotDate(orig[orig.length - 1].date, slots, j);
            shiftedOrig[i].date = nextInfo.date;
            shiftedOrig[i].dayOfWeekStr = nextInfo.dayOfWeekStr;
            shiftedOrig[i].timeSlot = nextInfo.timeSlot;
          }
        }
      }
    } else {
      newDate = insertCustomDate || (targetIdx < orig.length ? orig[targetIdx].date : r.startDate);
      const dObj = new Date(newDate + "T00:00:00");
      newDow = al[dObj.getDay()];
      newTime = insertCustomTimeSlot || (targetIdx < orig.length ? orig[targetIdx].timeSlot : (slots[0] ? (slots[0].startTime + "-" + slots[0].endTime) : "17:00-18:30"));
    }

    const createdLesson = {
      id: "les_ins_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      lessonIndex: targetIdx + 1,
      date: newDate,
      dayOfWeekStr: newDow,
      timeSlot: newTime,
      lessonCode: insertLessonCode.trim(),
      topic: insertLessonTopic.trim() || "特定插入课次",
      teacher: insertLessonTeacher.trim() || r.teacher,
      classroom: insertLessonClassroom.trim() || r.classroom,
      status: "scheduled",
      note: insertLessonNote.trim() || "特定插入课次"
    };

    const resultLessons = [
      ...shiftedOrig.slice(0, targetIdx),
      createdLesson,
      ...shiftedOrig.slice(targetIdx)
    ].map((les, idx) => ({ ...les, lessonIndex: idx + 1 }));

    const lastLesson = resultLessons[resultLessons.length - 1];
    const newSchedule = {
      ...r,
      lessons: resultLessons,
      totalLessons: resultLessons.length,
      endDate: lastLesson ? lastLesson.date : r.endDate,
      updatedAt: new Date().toISOString().split("T")[0]
    };

    u(newSchedule);
    setIsInsertLessonModalOpen(false);
    const shiftedCount = insertAutoShiftSubsequent ? Math.max(0, orig.length - targetIdx) : 0;
    Qe("🎉 已成功在第 " + (targetIdx + 1) + " 课插入【" + createdLesson.lessonCode + " - " + createdLesson.topic + "】" + (shiftedCount > 0 ? "，后续 " + shiftedCount + " 节课次已自动往后顺延！" : "！"));
    setTimeout(() => Qe(""), 4500);
  };

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
                          s.jsxs("span", {
                            className: "bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-2 py-0.5 rounded-md flex items-center space-x-1",
                            children: [
                              s.jsx(Io, { className: "w-3 h-3 text-slate-400" }),
                              s.jsx("span", { children: r.teacher })
                            ]
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
                type: "button",
                onClick: () => openInsertLessonModal(r.lessons.length),
                className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center space-x-1 hover:scale-[1.02]",
                title: "在已有课表中插入特定课次，并自动将后续课次往后顺延",
                children: [
                  s.jsx("svg", {
                    className: "w-3.5 h-3.5 text-white",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    strokeWidth: 2.5,
                    children: s.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" })
                  }),
                  s.jsx("span", { children: "插入特定课次" })
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
                  s.jsx("th", { className: "py-3 px-3 w-36 text-center text-[11px]", children: "快捷操作" })
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
                      className: "py-2.5 px-3 text-center space-x-1 whitespace-nowrap",
                      children: [
                        s.jsxs("button", {
                          type: "button",
                          onClick: () => openInsertLessonModal(M.lessonIndex),
                          className: "inline-flex items-center space-x-0.5 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold transition-all shadow-2xs",
                          title: "在此课（第 " + M.lessonIndex + " 课）后插入新课次并自动顺延后续课次",
                          children: [
                            s.jsx("svg", {
                              className: "w-2.5 h-2.5 text-emerald-600",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              strokeWidth: 2.5,
                              children: s.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" })
                            }),
                            s.jsx("span", { children: "插课" })
                          ]
                        }),
                        s.jsxs("button", {
                          type: "button",
                          onClick: () => { xe(M.lessonIndex); me(1); F(!0); },
                          className: "inline-flex items-center space-x-0.5 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold transition-all shadow-2xs",
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
      }),
      isInsertLessonModalOpen && s.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4",
        children: s.jsxs("div", {
          className: "bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp max-h-[92vh] overflow-y-auto",
          children: [
            s.jsxs("div", {
              className: "flex items-center justify-between border-b border-slate-100 pb-3",
              children: [
                s.jsxs("div", {
                  className: "flex items-center space-x-3",
                  children: [
                    s.jsx("div", {
                      className: "w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0",
                      children: s.jsx("svg", {
                        className: "w-5 h-5 text-emerald-600",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        strokeWidth: 2.5,
                        children: s.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" })
                      })
                    }),
                    s.jsxs("div", {
                      children: [
                        s.jsx("h3", { className: "font-extrabold text-slate-900 text-base", children: "在班级课表中插入特定课次" }),
                        s.jsx("p", { className: "text-xs text-slate-500", children: "在指定课次处插入新课程，支持将后续课次自动依次往后顺延" })
                      ]
                    })
                  ]
                }),
                s.jsx("button", {
                  type: "button",
                  onClick: () => setIsInsertLessonModalOpen(false),
                  className: "text-slate-400 hover:text-slate-600 text-lg font-bold p-1 rounded-full hover:bg-slate-100 transition-colors",
                  children: "✕"
                })
              ]
            }),
            s.jsxs("div", {
              className: "space-y-4 text-xs",
              children: [
                s.jsxs("div", {
                  children: [
                    s.jsxs("label", {
                      className: "block font-bold text-slate-700 mb-1 flex items-center space-x-1.5",
                      children: [
                        s.jsx(rs, { className: "w-3.5 h-3.5 text-indigo-600" }),
                        s.jsx("span", { children: "1. 插入位置选择" }),
                        s.jsx("span", { className: "text-rose-500", children: "*" })
                      ]
                    }),
                    s.jsxs("select", {
                      value: insertTargetPosition,
                      onChange: e => {
                        const pos = parseInt(e.target.value) || 1;
                        setInsertTargetPosition(pos);
                        const targetIdx = pos - 1;
                        if (targetIdx < r.lessons.length) {
                          setInsertCustomDate(r.lessons[targetIdx].date);
                          setInsertCustomTimeSlot(r.lessons[targetIdx].timeSlot);
                        } else if (r.lessons.length > 0) {
                          const nextInfo = getNextSlotDate(r.lessons[r.lessons.length - 1].date, r.slots, j);
                          setInsertCustomDate(nextInfo.date);
                          setInsertCustomTimeSlot(nextInfo.timeSlot);
                        }
                      },
                      className: "w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
                      children: [
                        s.jsx("option", { value: 1, children: "第 1 课之前 (作为新的第 1 课插入)" }),
                        r.lessons.map(les => s.jsxs("option", {
                          value: les.lessonIndex + 1,
                          children: ["第 ", les.lessonIndex, " 课之后 (作为第 ", les.lessonIndex + 1, " 课插入) - 原【", les.lessonCode, ": ", les.topic.length > 18 ? les.topic.substring(0, 18) + "..." : les.topic, "】之后"]
                        }, les.id))
                      ]
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    s.jsx("span", { className: "text-[11px] font-bold text-slate-400 block", children: "快捷选择课次类型预设：" }),
                    s.jsx("div", {
                      className: "flex flex-wrap gap-1.5",
                      children: insertPresets.map(preset => s.jsx("button", {
                        key: preset.code,
                        type: "button",
                        onClick: () => {
                          setInsertLessonCode(preset.code);
                          setInsertLessonTopic(preset.topic);
                          setInsertLessonNote(preset.note);
                        },
                        className: "px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors",
                        children: preset.label
                      }))
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                  children: [
                    s.jsxs("div", {
                      children: [
                        s.jsxs("label", {
                          className: "block font-bold text-slate-700 mb-1",
                          children: ["课次编号 (Code) ", s.jsx("span", { className: "text-rose-500", children: "*" })]
                        }),
                        s.jsx("input", {
                          type: "text",
                          value: insertLessonCode,
                          onChange: e => setInsertLessonCode(e.target.value),
                          placeholder: "例如: Review 1, Quiz 1, U2-加课",
                          className: "w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        })
                      ]
                    }),
                    s.jsxs("div", {
                      children: [
                        s.jsxs("label", {
                          className: "block font-bold text-slate-700 mb-1",
                          children: ["课堂内容/主题 (Topic) ", s.jsx("span", { className: "text-rose-500", children: "*" })]
                        }),
                        s.jsx("input", {
                          type: "text",
                          value: insertLessonTopic,
                          onChange: e => setInsertLessonTopic(e.target.value),
                          placeholder: "例如: 阶段核心词汇语法综合复习",
                          className: "w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        })
                      ]
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "grid grid-cols-2 gap-3",
                  children: [
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "授课老师" }),
                        s.jsx("input", {
                          type: "text",
                          value: insertLessonTeacher,
                          onChange: e => setInsertLessonTeacher(e.target.value),
                          className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        })
                      ]
                    }),
                    s.jsxs("div", {
                      children: [
                        s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "上课教室" }),
                        s.jsx("input", {
                          type: "text",
                          value: insertLessonClassroom,
                          onChange: e => setInsertLessonClassroom(e.target.value),
                          className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        })
                      ]
                    })
                  ]
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("label", { className: "block font-bold text-slate-700 mb-1", children: "课次备注说明" }),
                    s.jsx("input", {
                      type: "text",
                      value: insertLessonNote,
                      onChange: e => setInsertLessonNote(e.target.value),
                      placeholder: "例如: 期中加练 / 阶段综合复习",
                      className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    })
                  ]
                }),
                s.jsxs("div", {
                  className: "p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3",
                  children: [
                    s.jsxs("div", {
                      className: "flex items-center space-x-2 text-slate-800 font-bold",
                      children: [
                        s.jsx(Na, { className: "w-4 h-4 text-emerald-600" }),
                        s.jsx("span", { children: "上课时间与顺延模式" })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        s.jsxs("label", {
                          className: "flex items-start space-x-2.5 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors",
                          children: [
                            s.jsx("input", {
                              type: "radio",
                              name: "insertDateMode",
                              value: "slot_shift",
                              checked: insertDateMode === "slot_shift",
                              onChange: () => setInsertDateMode("slot_shift"),
                              className: "mt-0.5 text-emerald-600 focus:ring-emerald-500"
                            }),
                            s.jsxs("div", {
                              className: "text-xs",
                              children: [
                                s.jsx("div", { className: "font-bold text-slate-900", children: "按固定周期顺延排课 (推荐)" }),
                                s.jsx("div", { className: "text-slate-500 text-[11px]", children: "新课次直接占用该课次排课日，原课次及后续所有课次顺次往后推迟 1 个排课周期，结课日期自动顺延。" })
                              ]
                            })
                          ]
                        }),
                        s.jsxs("label", {
                          className: "flex items-start space-x-2.5 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors",
                          children: [
                            s.jsx("input", {
                              type: "radio",
                              name: "insertDateMode",
                              value: "custom",
                              checked: insertDateMode === "custom",
                              onChange: () => setInsertDateMode("custom"),
                              className: "mt-0.5 text-emerald-600 focus:ring-emerald-500"
                            }),
                            s.jsxs("div", {
                              className: "text-xs w-full",
                              children: [
                                s.jsx("div", { className: "font-bold text-slate-900", children: "自定义指定新课日期与时段" }),
                                s.jsx("div", { className: "text-slate-500 text-[11px] mb-2", children: "手动指定新课的具体日期与时间，适用于节假日或周末临时集中加课。" }),
                                insertDateMode === "custom" && s.jsxs("div", {
                                  className: "grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100",
                                  children: [
                                    s.jsxs("div", {
                                      children: [
                                        s.jsx("span", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "新课上课日期" }),
                                        s.jsx("input", {
                                          type: "date",
                                          value: insertCustomDate,
                                          onChange: e => setInsertCustomDate(e.target.value),
                                          className: "w-full px-2 py-1 border border-slate-200 rounded-md text-xs font-bold"
                                        })
                                      ]
                                    }),
                                    s.jsxs("div", {
                                      children: [
                                        s.jsx("span", { className: "block text-[11px] font-bold text-slate-600 mb-1", children: "新课时间段" }),
                                        s.jsx("input", {
                                          type: "text",
                                          value: insertCustomTimeSlot,
                                          onChange: e => setInsertCustomTimeSlot(e.target.value),
                                          placeholder: "例如 17:00-18:30",
                                          className: "w-full px-2 py-1 border border-slate-200 rounded-md text-xs font-bold"
                                        })
                                      ]
                                    })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),
                    s.jsxs("div", {
                      className: "pt-1 flex items-center space-x-2",
                      children: [
                        s.jsx("input", {
                          type: "checkbox",
                          id: "insertAutoShiftSubsequent",
                          checked: insertAutoShiftSubsequent,
                          onChange: e => setInsertAutoShiftSubsequent(e.target.checked),
                          className: "w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        }),
                        s.jsx("label", {
                          htmlFor: "insertAutoShiftSubsequent",
                          className: "text-xs font-bold text-slate-800 cursor-pointer",
                          children: "后续课次自动往后顺延 (后续课次依次顺推 1 个排课周期，保持原大纲顺序)"
                        })
                      ]
                    })
                  ]
                }),
                (() => {
                  const targetIdx = Math.max(0, Math.min(insertTargetPosition - 1, r.lessons.length));
                  const affectedCount = insertAutoShiftSubsequent ? Math.max(0, r.lessons.length - targetIdx) : 0;
                  const slots = r.slots && r.slots.length > 0 ? r.slots : [{ dayOfWeek: 3, startTime: "17:00", endTime: "18:30" }];
                  let projDate = "";
                  if (insertDateMode === "slot_shift") {
                    if (targetIdx < r.lessons.length) {
                      projDate = r.lessons[targetIdx].date + " (" + r.lessons[targetIdx].dayOfWeekStr + ") " + r.lessons[targetIdx].timeSlot;
                    } else if (r.lessons.length > 0) {
                      const nxt = getNextSlotDate(r.lessons[r.lessons.length - 1].date, slots, j);
                      projDate = nxt.date + " (" + nxt.dayOfWeekStr + ") " + nxt.timeSlot;
                    } else {
                      projDate = r.startDate || "";
                    }
                  } else {
                    const dObj = new Date(insertCustomDate + "T00:00:00");
                    projDate = insertCustomDate + " (" + (al[dObj.getDay()] || "") + ") " + (insertCustomTimeSlot || "");
                  }
                  const lastLesDate = r.lessons.length > 0 ? getNextSlotDate(r.lessons[r.lessons.length - 1].date, slots, j).date : r.endDate;
                  return s.jsxs("div", {
                    className: "p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 space-y-1.5",
                    children: [
                      s.jsxs("div", {
                        className: "font-bold text-xs flex items-center justify-between",
                        children: [
                          s.jsxs("span", { children: ["📋 变动实时预览 (插入后共 ", r.lessons.length + 1, " 节课)："] }),
                          s.jsx("span", { className: "text-[10px] bg-emerald-200/80 text-emerald-900 font-extrabold px-2 py-0.5 rounded", children: "自动顺延生效" })
                        ]
                      }),
                      s.jsxs("p", {
                        children: [
                          "• 新增课次：",
                          s.jsxs("strong", { children: ["第 ", insertTargetPosition, " 课 【", insertLessonCode || "课次", ": ", insertLessonTopic || "未填", "】"] }),
                          s.jsxs("span", { className: "text-emerald-800 ml-1 font-mono text-[11px]", children: ["(", projDate, ")"] })
                        ]
                      }),
                      affectedCount > 0 ? s.jsxs("p", {
                        children: [
                          "• 顺延影响：",
                          s.jsxs("strong", { className: "text-emerald-900", children: ["后续 ", affectedCount, " 节排课将自动依次顺延 1 个排课日"] }),
                          s.jsxs("span", { className: "text-emerald-700 block mt-0.5", children: ["预计新结课日期将推迟至: ", s.jsx("strong", { className: "font-mono font-bold", children: lastLesDate })] })
                        ]
                      }) : s.jsx("p", {
                        className: "text-emerald-700",
                        children: "• 本次插入位于最后，无需顺延已有排课，总排课数增加 1 节。"
                      })
                    ]
                  });
                })()
              ]
            }),
            s.jsxs("div", {
              className: "flex justify-end space-x-2 pt-2 border-t border-slate-100",
              children: [
                s.jsx("button", {
                  type: "button",
                  onClick: () => setIsInsertLessonModalOpen(false),
                  className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl",
                  children: "取消"
                }),
                s.jsxs("button", {
                  type: "button",
                  onClick: handleConfirmInsertLesson,
                  className: "px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all hover:scale-[1.02]",
                  children: [
                    s.jsx("svg", {
                      className: "w-4 h-4 text-white",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: 2.5,
                      children: s.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" })
                    }),
                    s.jsx("span", { children: "确认插入并顺延课次" })
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