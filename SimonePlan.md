# Simone 路线图

> **当前作战室**——规划中的版本在这里看，已 ship 的历史折叠到 `docs/CHANGELOG.md`。
> 每个 Phase 开工前单独 brainstorm 细节，spec 写到 `docs/superpowers/specs/`。

---

## TL;DR

- **当前状态**：v1.2.1 build 11 已提交审核（WAITING_FOR_REVIEW 2026-04-19）· v1.3 商业化 kick-off 中，等 CEO 审批价格表
- **下一个锚点**：v1.3 ship（商业化真接入）
- **发版节奏**：2 周 1 版，串行发布，上一版 ship 前不开下一版
- **战略顺序**：先稳 → 再变（交互）→ 再美（UI）→ **再赚**（商业化）→ 再连（平台 + 跨设备 + Studio 兑现）

---

## 版本状态板

| 版本 | 主题 | 状态 | 详见 |
|---|---|---|---|
| v1.0 | 上架 App Store | ✅ 2026-04-16 | `docs/CHANGELOG.md` |
| v1.1.0 | 稳定性 | ✅ 2026-04-16 | `docs/CHANGELOG.md` |
| v1.1.1 | 交互重塑 | ✅ 2026-04-18 | `docs/CHANGELOG.md` |
| v1.2 | Fog City Nocturne 视觉 | ✅ 2026-04-19 merge `842b589` | `docs/CHANGELOG.md` |
| **v1.2.1** | **Evolve 深度化（付费前置）** | 🧪 **WAITING_FOR_REVIEW** | 下方 |
| **v1.3** | **商业化** | 🧪 **kick-off，等价格审批** | `docs/v1.3-monetization-draft.md` + 下方硬约束 |
| v1.4a | 系统集成 + 频谱三层耦合 | 📋 规划中（3-4 周） | `docs/v1.4-roadmap.md` |
| v1.4b | Studio 档兑现 | 📋 规划中（3-4 周） | `docs/v1.4-roadmap.md` |
| v1.4c | 跨设备与生态 | 📋 规划中（2-3 周） | `docs/v1.4-roadmap.md` |

**注**：v2.0 音乐表现力（Smart Adapt / Slow Jam / BPM UI）2026-04-20 老鱼拍板**不做了**。**但频谱三层耦合保留并升级至 v1.4a 作为 v1.2.1 体感保险**（战略师 2026-04-20 建议 B 已批）。原 v2.1 + v2.2 拆为 v1.4a/b/c 三版，每版独立 ship。

---

## 硬依赖约束（顺序不能反）

### 1. v1.3 前置：v1.2.1 实测撑住 30+ 分钟不疲劳

**规则**：v1.2.1 灰度后老鱼自测体感必须从"15 分钟腻"→"30+ 分钟不想切"。未达标不得开 v1.3 商业化。

**为什么**：Simone 只覆盖"睡前"场景，通勤（20-30 分钟）/ 工作（30-90 分钟）/ 派对（60+ 分钟）撑不住 → 直接进 v1.3 收费 → 7 天试用期里用户工作时 20 分钟烦了就关 → D7 Free→Paid ≥ 3% 目标崩 → MRR ≥ $100 成功判定碎。

**失败预案**：灰度后仍 15-20 分钟腻 → **v1.4a 的频谱三层耦合前置到 v1.3 前执行**（顺序变为 v1.2.1 → v1.4a 局部 → v1.3 → v1.4a 剩余），视觉跟上听觉治疲劳。正常路径下频谱三层耦合随 v1.4a 一起 ship（在 v1.3 之后）。

### 2. v1.4 前置：v1.3 收费跑满 + D7 留存不掉

**规则**：v1.3 Ship 后至少跑 2 周，D7 留存（第 7 天还回来的用户比例）不低于 v1.2.1 基线，才开 v1.4。

**为什么**：v1.4 是"把 App 延伸到锁屏/Widget + 兑现 Studio 付费功能"，如果 v1.3 收费把留存直接砸了（付费墙赶走免费用户），再扩生态没意义。先确认收费模型不破坏核心体验。

---

## v1.2.1 — Evolve 深度化（付费前置）

**状态**：✅ 2026-04-19 晚直提 App Store 审核。build 11 (UUID `733c2d23…`) attach 到 version record `c1c8fa7d` · submission `b76bd517` **WAITING_FOR_REVIEW**。锚点 tag `v1.2.1-pre-evolve-depth` · feature 分支 `feature/v1.2.1-evolve-depth` HEAD `75a187d`。

### 核心抓手

当前 Evolve 实现（v1.1.1 已落地 `EvolveVocabulary.swift`）：**词典轮转 + temperature 抖动**——结果是玄学波动。

v1.2.1 升级方向：**按三个音乐维度分别调制**，让 Evolve 听起来"有方向"而不是"有随机"：

- [x] **instruments 维度**：每个频道定义 core / accent / optional 三层乐器池。加减动作受 Evolve 挡位约束：10s 挡每次 ±1 件 optional、1m 挡 ±1 件 accent、5m 挡可能整组换
- [x] **density 维度**：新增 density 标量（0.3-1.0），映射到 prompt 里的 "sparse/moderate/dense/full arrangement" 描述词
- [x] **energy 维度**：新增 energy 标量（0.3-1.0），映射到 "laid-back/steady/driving/intense"
- [x] **三维度独立触发**：每次 Evolve tick 随机挑 1-2 个维度改（不全改），避免突变感
- [x] **Lock 挡真锁死**：三个维度全部冻结当前值，不抖 temperature

### 实施范围（单文件 + 一个新模型，风险极小）

**改动**：`PromptBuilder.swift` · `EvolveVocabulary.swift` · `Channel.swift`（补 `instrumentPool`）· `AppState.swift`（内部 `currentDensity`/`currentEnergy`）
**不碰**：AudioEngine · LyriaClient · Visualizer · Views 全系。纯 prompts 侧升级。

### 验收标准（老鱼自测体感）

- Lock 挡：守 30 分钟应该几乎不变（当前 5-10 分钟腻 → 期望 ≥ 20 分钟）
- 10s 挡：守 30 分钟应该能听出至少 5 次"有乐器加减"瞬间
- 1m 挡：守 60 分钟应该有明显"能量曲线"
- **总体目标：从 15 分钟腻 → 撑 30+ 分钟不想切**

### 红线（沿用品牌原则）

- ❌ 不做"突然风格转变"——每次 Evolve 最多改 2 个维度
- ❌ 不做"跨频道漂移"——Jazz 不会 Evolve 成 Electronic
- ❌ 不做 UI 暴露——density/energy 是后台状态，Studio 档之外不给看（v2.0 再开放）

### 可逆性

- Revert `EvolveVocabulary.swift` 回到 v1.2 行为
- Channel 新增字段是 additive，老逻辑不受影响
- `currentDensity`/`currentEnergy` 默认 0.6，旧代码读不到也安全

---

## v1.3 — 商业化（StoreKit 2 + 付费分层真接入）

**详细 spec**：`docs/superpowers/specs/2026-04-19-v1.3-monetization-impl.md`
**商业模型 draft**：`docs/v1.3-monetization-draft.md`
**单位经济学**：`docs/v1.3-unit-economics.md`

**状态**：🧪 2026-04-19 夜 kick-off · feature 分支 `feature/v1.3-monetization` off v1.2.1 · P0 checkpoint + P1 Tier 模型 + P2 StoreKitManager 骨架已推（build 通过）· **等 CEO 审批价格表 / UsageLimiter 策略 / Introductory Offer 后推 P3-P6**。

**核心目标**：Flow/Tune/Studio 付费分层真生效（v1.0 的全免费解锁分拆），早期用户红利锁定。

**执行前硬约束**：上方「硬依赖约束 #1」——v1.2.1 实测撑 30+ 分钟才能开工。

**验收**：Flow 用户点 🔒 弹升级 · Tune 购买解锁对应功能 · Studio 可用 Direct Input · 前 100 名看到 50% off 促销价。

---

## v1.4a — iOS 系统集成 + 频谱三层耦合（3-4 周）

**定位**：把 Simone 延伸到锁屏 / 灵动岛 / Widget + 用视觉跟上听觉治 30 分钟疲劳感。
**前置**：上方「硬依赖约束 #2」（v1.3 跑满 2 周 + D7 留存不掉）。
**核心**：
- **iOS 系统集成**（原 v2.1，2 周）：频谱快照 Artwork + 锁屏 ◁▷ 切风格 + 灵动岛 Live Activity + 中号 Widget + API Key 反调试加固
- **频谱三层耦合**（原 v2.0 A 抓手，2026-04-20 升级为 v1.4a 必做，1-2 周）：11 个 visualizer 按 high/mid/low 三层频段分别驱动 · 独立时间相位 · Evolve 触发涟漪 · 动态 MorandiPalette

详见 `docs/v1.4-roadmap.md`。

## v1.4b — Studio 档兑现（3-4 周）

**定位**：v1.3 卖出 Studio 档（$19.99）后，把应许的大功能真的落地。
**前置**：v1.4a Ship + D7 留存不掉。
**核心**：多风格混合 · 离线电台 · 下载片段导出 · Custom Visualizer · 6 套深度主题。

详见 `docs/v1.4-roadmap.md`。

## v1.4c — 跨设备与生态（2-3 周）

**定位**：Mac / iPad / CloudKit 扩生态。
**前置**：v1.4b Ship。
**核心**：Mac 独立上架 · iPad 横屏适配 · CloudKit 跨设备同步 · Studio 档数据统计看板 · 每日氛围推送。

详见 `docs/v1.4-roadmap.md`。

---

## 设计参考（非版本，但所有 PM/UI/UX 必读）

- **`docs/brand-pillars.md`**——Simone 品牌与产品框架（Flow/Tune/Studio 分层逻辑、Evolve 红线、产品人格）
- **`docs/phase-2.5-ux-redesign.md`**——氛围电台 UI/UX 完整 spec（4 页架构、付费分层详图，v1.1.1 + v1.2 已部分实施）

---

## 执行原则

- **每个 Phase 开工前单独 brainstorm 细节**，spec 落到 `docs/superpowers/specs/`
- **Phase 间不混合**：上一个 version ship 前不开下一个 version
- **每个 Phase 完成立刻更新本文件 + `CLAUDE.md`**
- **改完代码立刻 push**（老鱼看 TestFlight）
- **角色 / Phase 切换走 `CLAUDE.md` 的 Context 防爆 SOP**

分工见 `AGENTS.md`。状态看 `docs/team-status.md`。
