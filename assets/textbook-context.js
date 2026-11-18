(function (root) {
  'use strict';
  function localToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function current(schedule, today = localToday()) {
    const dated = (schedule.lessons || [])
      .filter(lesson => /^\d{4}-\d{2}-\d{2}$/.test(lesson.date || '') &&
        lesson.status !== 'cancelled' && lesson.status !== 'holiday')
      .sort((a, b) => a.date.localeCompare(b.date) || (a.lessonIndex || 0) - (b.lessonIndex || 0));
    const started = dated.filter(lesson => lesson.date <= today);
    // A planned transition cannot overtake an unfinished lesson.
    const nextUnfinished = dated.find(lesson => lesson.status !== 'completed');
    const lesson = nextUnfinished && nextUnfinished.date <= today
      ? nextUnfinished
      : started.at(-1) || dated[0];
    const previousBook = dated.slice(0, dated.indexOf(lesson)).reverse()
      .find(entry => entry.textbook && entry.textbook !== '未设教材')?.textbook;
    return {
      textbook: lesson?.textbook || previousBook || schedule.textbook || '未设教材',
      upcoming: !started.length && !!dated.length
    };
  }
  root.ClassTableTextbook = { current };
})(typeof window !== 'undefined' ? window : globalThis);
