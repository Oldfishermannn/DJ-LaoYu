# Simone Inc. 团队状态板

> 每个员工状态变化时**必须**覆盖更新自己那行（不 append）。
> 状态字段：🟢 IDLE（待命）/ 🟡 WORKING（在干活）/ 🔴 BLOCKED（卡住）/ ✅ DONE（刚交付）
> **Stale 规则**：更新时间超过 24h 自动视为过期，下次看到这一行的员工或 COO 必须主动刷新（要么真干活、要么改状态，不能装在线）。
> CEO 扫一眼：`cat docs/team-status.md`

| 角色 | 状态 | 当前任务 / 最新交付 | 更新时间 |
|---|---|---|---|
| COO 小克（主窗口） | ✅ DONE（等 CEO Cmd+R） | v1.4a Signature **V5.13 双活**：① **Favorites 频道删除**（Channel.favorites/pinnedStyles/favoritesVisualizer 全清 · old rawKey "favorites" → .category(.lofi) 静默迁移 · AppState init 清 UserDefaults · DetailsView/Tier.favoriteStyle 清理）② **窗户 icon 变新 genre = Ambient**（StyleCategory 第 6 个 · 夜窗薄雾蓝 130/148/186 · instrumentPool = pads/drones/reverb + strings/celesta/piano · defaultVisualizer = nightWindow · 6 presets：eno/drone/neoclassical/rain/cinematic/space）③ **ElectronicSignatureView 新建**（Eurorack 3U modular synth · 冷调蓝黑 studio · 2×2 旋钮阵 + 4×2 mini-jack + 2 根琴橘/teal patch cable 时间正弦摆动不耦合音频 · 背景 8 块 rack LED 映射频谱 · hero 模组无 wobble，只在 treble shimmer 高光）· pbxproj 已加 file ref · SpectrumCarouselView dispatch else-if .electronic · verify-build ✅ · Xcode 待开 | 2026-04-21 |
| Strategist | ✅ DONE | Signature draft + plan 双交付：[`draft`](docs/v1.4a-signature-visualizers-draft.md)（5 频道全语法 3 配方）+ [`plan`](docs/v1.4a-signature-visualizers-plan.md)（CEO 拍板跳 Part 1/2 直上 Lo-fi 单频道单审 · M1-M5 里程碑 · 独立分支 `feature/v1.4a-signature-lofi` off main 不碰 v1.3 · 3-4 天完工 · COO 接手/clear 接力 prompt 已备）· 审过 Lo-fi 再按模板开 Jazz/Rock/R&B/Electronic | 2026-04-21 |
| PM | 🟡 WORKING（待上岗） | 本轮：v1.3 商业化文案预启动 → docs/v1.3-appstore-copy-draft.md | 2026-04-19 16:58 |
| Release Engineer | ✅ DONE | v1.2.1 build 11 submit to App Store 完成（COO 直操 push_metadata.py）· 撤 v1.2 pending · version record rename 1.2→1.2.1 · WAITING_FOR_REVIEW | 2026-04-19 23:08 |
| Assistant | ✅ DONE | memory 体检完：4 过期 / 2 冲突 / 6 缺失 / 3 合并建议 → docs/memory-audit-2026-04-19.md | 2026-04-19 17:05 |
| UI/UX Engineer | ✅ DONE | v1.2 UI/UX 诊断完：Fog/Morandi 分裂、字号过小、pause 自动缩图、手势嵌套、纵滑无 affordance — 等 CEO 定开刀顺序 | 2026-04-19 15:02 |
| iOS Engineer | 🟡 WORKING | v1.2.1 UI 包 #1/#2/#3 落地中（接 docs/v1.2.1-ui-tokens.md，同分支 feature/v1.2.1-evolve-depth，HEAD e237704 之后）— 上一活 PromptBuilder ✅ 已合（4 commits 247b157→e237704） | 2026-04-19 18:35 |

---

## 使用规约

**员工写**：状态一变就回来覆盖自己那行 + 更新时间。简短。
**CEO 看**：`cat /Users/oldfisherman/Desktop/simone/docs/team-status.md`
**COO 调度**：发现谁卡了 / 谁闲了 / 谁状态行超 24h 没动 → 主动刷新或重新分配活
