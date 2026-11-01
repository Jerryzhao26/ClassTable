(function (root) {
  'use strict';
  function localToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function current(schedule, today = localToday()) {
    const dated = (schedule.lessons || []).filter(lesson => /^\d{4}-\d{2}-\d{2}$/.test(lesson.date || '')).slice().sort((a, b) => a.date.localeCompare(b.date) || (a.lessonIndex || 0) - (b.lessonIndex || 0));
    const started = dated.filter(lesson => lesson.date <= today);
    const lesson = started.length ? started[started.length - 1] : dated[0];
    return { textbook: (lesson && lesson.textbook) || schedule.textbook || '未设教材', upcoming: !started.length && !!dated.length };
  }
  root.ClassTableTextbook = { current };
})(typeof window !== 'undefined' ? window : globalThis);
