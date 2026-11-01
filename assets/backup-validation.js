(function (root) {
  'use strict';
  const sections = ['schedules', 'templates', 'levels', 'holidays', 'teachers', 'customTextbooks'];
  const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

  function validateBackup(data) {
    if (!isObject(data)) throw new Error('备份必须是 JSON 对象');
    for (const section of sections) {
      if (!Array.isArray(data[section])) throw new Error(`${section} 必须是数组`);
      const ids = new Set();
      for (const item of data[section]) {
        if (!isObject(item)) throw new Error(`${section} 中包含无效条目`);
        if ('id' in item) {
          if ((typeof item.id !== 'string' && typeof item.id !== 'number') || String(item.id).trim() === '' || ids.has(String(item.id))) throw new Error(`${section} 中的 ID 无效或重复`);
          ids.add(String(item.id));
        }
      }
    }
    for (const schedule of data.schedules) {
      if (!schedule.id || !Array.isArray(schedule.lessons) || !Array.isArray(schedule.slots)) throw new Error('排课结构不完整');
      if (schedule.startDate !== undefined && !validDate(schedule.startDate)) throw new Error('排课开始日期无效');
      const lessonIds = new Set();
      for (const lesson of schedule.lessons) {
        if (!isObject(lesson) || !lesson.id || !validDate(lesson.date) || lessonIds.has(String(lesson.id))) throw new Error('课次 ID 或日期无效');
        lessonIds.add(String(lesson.id));
      }
    }
    for (const template of data.templates) {
      if (!template.id || !Array.isArray(template.units)) throw new Error('课程模板结构不完整');
      for (const unit of template.units) if (!isObject(unit) || !Array.isArray(unit.lessons)) throw new Error('模板单元结构不完整');
    }
    return data;
  }
  root.ClassTableBackup = { validateBackup };
  if (typeof module !== 'undefined' && module.exports) module.exports = { validateBackup };
})(typeof window !== 'undefined' ? window : globalThis);
