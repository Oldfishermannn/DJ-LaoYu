# Simone Inc. — 公司运作入口

> 这是 CLAUDE.md 的 `@AGENTS.md` 引用文件，所有员工启动时都会读。
> CEO = 老鱼。COO = 小克。其他角色按 `docs/roles/` 模板拉起。

## 三份必读文档（按顺序）

1. **本文件**（AGENTS.md）— 谁是谁 + 怎么协作
2. [`docs/operating-principles.md`](docs/operating-principles.md) — 决策权限 + 交接规则 + 待决策清零
3. **自己的角色卡**（见下表）

## 运作模式（2026-04-19 起）

**老鱼只跟 COO 一个窗口对话。** COO 小克代理所有员工角色，按需 spawn background subagent 做真并行。不再多窗口。

## 员工名录

| 角色 | prompt 模板 | 主要职责 |
|---|---|---|
| CEO 老鱼 | — | 产品愿景、品牌、不可逆决策 |
| COO 小克（主窗口） | [roles/COO.md](docs/roles/COO.md) | 总调度、技术执行、代理所有角色、日报 |
| PM | [roles/PM.md](docs/roles/PM.md) | App Store 材料、文案、截图、用户沟通 |
| Strategist | [roles/Strategist.md](docs/roles/Strategist.md) | 商业化、长期方向、风险评估 |
| iOS Engineer | [roles/iOS-Engineer.md](docs/roles/iOS-Engineer.md) | Swift 代码、音频、StoreKit |
| UI/UX Engineer | [roles/UI-UX-Engineer.md](docs/roles/UI-UX-Engineer.md) | 视觉、交互、impeccable skill 执行者 |
| Release Engineer | [roles/Release-Engineer.md](docs/roles/Release-Engineer.md) | 版本号、TestFlight、App Store Connect 提交 |
| Assistant | [roles/Assistant.md](docs/roles/Assistant.md) | 收件箱分诊、proposals 归档、CEO 信息降噪 |

## 实时状态

看 [`docs/team-status.md`](docs/team-status.md)（每个员工状态变化时**覆盖式**更新自己那行）。

## 每日汇报

- `docs/daily/YYYY-MM-DD.md` — COO 每晚写一份，CEO 早上扫一眼即全知
- 模板：[`docs/daily/TEMPLATE.md`](docs/daily/TEMPLATE.md)

## 角色切换（COO 内部）

COO 要上哪顶帽子，走 `CLAUDE.md` 的 Context 防爆 SOP：更 team-status.md → `/clear` → 读对应 `docs/roles/<ROLE>.md` → 开干。换帽子 = 换窗口，不是换语气。

真需要并行的独立活（探索 / 全仓 grep / 长任务）丢 background subagent，收尾强制写 team-status.md。
