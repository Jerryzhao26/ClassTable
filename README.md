# 比伯斯教育 (Beavers Education) - 课程进度表与智能排课协同管理系统

> 一个专为少儿英语及培训机构打造的课程进度表管理、智能排课向导、节假日自动避让与教师协同排课系统。

---

## 🌟 核心功能亮点 (Features)

1. **📊 班级进度与大盘概览 (Overview & Schedules)**
   - 全局查看机构所有班级的授课进度、已上/未上课次与状态监控。
   - 快捷查看近一周课表与各班进度卡片。
   - 支持生成与打印高颜值班级进度表 (纸质与PDF导出)。

2. **🧙‍♂️ 智能排课向导 (Smart Schedule Wizard)**
   - 支持**新建班级排课**与**现有班级追加排课 (追加后续课次/学期)**。
   - 自动联动节假日休课表，排课引擎智能跳过法定节假日并顺延。
   - 追加排课模式下自动锁定原班级名称与信息，首课自动接续上次结课日期与单元课号。

3. **📚 课程体系与模板库 (Course Templates)**
   - 预设 Big Fun 启蒙系列、Big English 少儿系列、Primary Focus 高阶系列等标准大纲。
   - 支持自定义教材大纲、课次规则 (正课、复习课、测评课)、单元主题与内容占位符。
   - 支持批量统一编辑课次主题与一键快速建班。

4. **📅 节假日与校休日管理 (Holidays & Closures)**
   - 统一配置国家法定节假日、寒暑假与全校教研休课安排。
   - 排课向导在计算日期时自动避开上述停课区间。

5. **👩‍🏫 授课教师排课协同 (Teachers Management)**
   - 管理讲师资料 (姓名、头衔、联系电话)。
   - 支持教师资料随时二次编辑与更新。
   - 查看每位教师名下的在培班级数量与周排课量大盘。

6. **🔒 权限与只读模式 (Read-Only Mode & Admin Auth)**
   - 系统支持只读与管理员解锁模式，保障数据不被误删或误篡改。
   - 支持 GitHub Gist 备份与云端多端同步。

---

## 🚀 快速开始 (Getting Started)

### 环境要求 (Prerequisites)
- [Node.js](https://nodejs.org/) (v18+ 推荐)
- npm / yarn / pnpm

### 本地运行步骤 (Local Setup)

1. **克隆仓库 (Clone Repository)**
   ```bash
   git clone https://github.com/YOUR_USERNAME/classtable.git
   cd classtable
   ```

2. **安装依赖 (Install Dependencies)**
   ```bash
   npm install
   ```

3. **启动开发服务器 (Run Development Server)**
   ```bash
   npm run dev
   # 或
   npm start
   ```

4. **访问应用 (Access Application)**
   打开浏览器访问: `http://localhost:3000`

---

## 📤 如何推送到 GitHub (GitHub Push Guide)

如果您是第一次推送到 GitHub，请在终端按顺序执行以下命令：

```bash
# 1. 初始化 Git 仓库 (如未初始化)
git init

# 2. 添加所有文件到暂存区
git add .

# 3. 提交首次 Commit
git commit -m "feat: initial commit for Beavers Education class schedule system"

# 4. 重命名主分支为 main
git branch -M main

# 5. 关联您的 GitHub 远程仓库 (请替换为您的实际仓库地址)
git remote add origin https://github.com/YOUR_USERNAME/classtable.git

# 6. 推送到 GitHub
git push -u origin main
```

---

## 🛠️ 技术栈 (Tech Stack)

- **前端/运行环境**: React / HTML5 / ES Modules / Tailwind CSS
- **后端支持**: Node.js + Express
- **图标与UI组件**: Lucide Icons, Clean Modern UI Archetype

---

## 📄 开源协议 (License)

本项目采用 [MIT License](LICENSE) 协议开源。
