# Memory 体检报告 — 2026-04-19

扫描范围：`/Users/oldfisherman/.claude/projects/-Users-oldfisherman/memory/` 下 29 个 .md 文件。
对比源：global CLAUDE.md、simone/CLAUDE.md、simone/AGENTS.md、docs/operating-principles.md、docs/daily/2026-04-19.md、docs/team-status.md。

---

## 1. 过期的（4 条）

- `feedback_remind_rotate_key.md` — 2026-04-18 设置的"下次 session 开头提醒旋换 Gemini key"，memory 自身写明"提醒完就删掉"，至今 5 天未见处理记录，要么确认已旋换后删，要么下次 Lyria 相关 session 执行一次后删。
- `project_simone_v1_launched.md` — 2026-04-16 上架已 3 天，且公司已推进到 v1.2 上架（见 CLAUDE.md）/v1.2.1 规划/v1.3 商业化启动，"v1.0 已上架"作为里程碑可保留但 description 应更新到 v1.2，避免后续员工误以为当前版本还是 v1.0。
- `project_free_jam_club.md` — 状态停留在 7 天前"MP3 伴奏可用 + 下一步接 Lyria"，老鱼主力已全面转 Simone（daily 2026-04-19 无任何 free-jam-club 动作），项目是否还在动需要 CEO 确认，否则归档为 historical。
- `feedback_plan_update.md` — 9 天前 DimsumRPG 项目的"每 Phase 更新计划书"，该项目在当前 Simone/cine-companion 主线外，若已停更可归档；规则本身已被 `feedback_plan_mode_phases.md` 的通用版覆盖。

## 2. 冲突的（2 条）

- `feedback_multi_window_parallel.md`（2026-04-19 晚已改写为"单对话 COO 代理"） vs `feedback_simone_team_status.md` — 后者 description/body 仍描述"多窗口角色协作"、"被 spawn 在多窗口里工作"，与新单对话模式不一致（team-status.md 现为 COO 任务板），需要改写为"COO 代理各角色时覆盖对应行"。
- `user_identity.md` 写"主要项目：cine-companion" vs 当前公司运作/daily/CLAUDE.md 显示主力项目是 Simone（v1.2 刚 merge、v1.3 商业化启动），主项目字段过时需更新。

_注_：`feedback_parallel_employee.md` 和 `feedback_ceo_no_wait.md` 已核对，均已在 2026-04-19 改写为 background agent 方案，与新模式一致，无残留多窗口论述。

## 3. 缺失的（6 条）

- **可逆原则** — simone/CLAUDE.md L99-108 + operating-principles.md L56-58 明文"所有操作必须可逆"（git 粒度/不破坏性删除/feature flag/schema 双写/TestFlight 可回滚），memory 无对应条目，目前只 feedback_checkpoint_before_refactor.md 覆盖了音频 checkpoint 这一子集。
- **0-决策原则 / CEO 决策清单三类** — operating-principles.md L7-21 定义🔴三类（不可逆的钱/对外发布/产品定位）必须回 CEO，其余员工自决；memory 只有 `feedback_ceo_decision_fatigue.md` 讲"不要堆决策"但没记三类清单的边界定义。
- **Audio/Music 项目规则** — global CLAUDE.md 写 "Magenta RealTime (self-hosted) NOT Lyria cloud API"，memory 里 `reference_lyria_realtime.md` / `reference_lyria_harness.md` 讲的全是 Lyria，没有"别混淆 Magenta 和 Lyria"的防错条目。
- **Environment Constraints** — global CLAUDE.md 明文 "不要在 Claude Code 里跑 sudo/交互 prompt/claude doctor/npm update -g"，memory 无对应条目，新 session 员工可能仍会尝试。
- **Scope Discipline** — global CLAUDE.md 写 "验证可行性/实验必须隔离项目或分支，不改现有 working project"，memory 无对应条目。
- **team-status.md 即时更新 + daily 日报机制** — operating-principles.md L48-54 + AGENTS.md 定义 "COO 每晚写 docs/daily/YYYY-MM-DD.md 固定三段"，memory 里只有 `feedback_simone_team_status.md` 讲 status 板，没有 daily 日报机制的条目。

## 4. 合并建议（3 组）

- **Lyria 音频开发套件**（5 条 → 1 条聚合 + 保留 references）：`feedback_hmr_audio.md` / `feedback_python_unbuffered.md` / `feedback_gemini_before_lyria.md` / `feedback_checkpoint_before_refactor.md` / `feedback_standalone_api_test.md` 可合并为一条 "Lyria/Audio 开发铁律"（HMR硬刷 + unbuffered + Gemini 先行 + 改前 checkpoint + 新 API 先独立测试），两份 reference（realtime + harness）保留单独条目。
- **CEO 服务三件套**（3 条 → 1 条）：`feedback_ceo_no_wait.md` / `feedback_parallel_employee.md` / `feedback_ceo_decision_fatigue.md` 主题高度重合（CEO 不空等 + background agent 填空隙 + 不堆决策），可合并为 "CEO 时间最贵：并行 + 自决 + 不堆决策"一条；`feedback_multi_window_parallel.md` 作为"单对话 COO 代理"模式单独保留。
- **Simone visualizer 视觉**（2 条 → 1 条）：`feedback_simone_visualizers.md`（21 case + 5 频道默认）和 `feedback_simone_electronic_visualizer.md`（Electronic 要密度）可合并为 "Simone v1.2 visualizer 口径"，把 Electronic/Matrix 密度要求并入 5 频道默认表的注释里。

---

**统计**：过期 4 条 / 冲突 2 条 / 缺失 6 条 / 合并建议 3 组（涉及 10 条 memory）。
