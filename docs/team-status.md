# Simone Inc. 团队状态板

> 每个员工状态变化时**必须**覆盖更新自己那行（不 append）。
> 状态字段：🟢 IDLE（待命）/ 🟡 WORKING（在干活）/ 🔴 BLOCKED（卡住）/ ✅ DONE（刚交付）
> **Stale 规则**：更新时间超过 24h 自动视为过期，下次看到这一行的员工或 COO 必须主动刷新（要么真干活、要么改状态，不能装在线）。
> CEO 扫一眼：`cat docs/team-status.md`

| 角色 | 状态 | 当前任务 / 最新交付 | 更新时间 |
|---|---|---|---|
| COO 小克（主窗口） | ✅ DONE（等 CEO Cmd+R） | v1.4a Signature **Electronic Pedalboard v4**（CEO "把灯 光和耳机去掉 画出这些效果器 整齐排列在合成器下方 要求 比例和颜色必须一致"，附 5 款 iconic pedal 参考图）：v3 lamp/headphones 全删（drawPianoLamp / drawHeadphonesOnCabinet / drawHeadphoneCup / drawStudioRimLight / drawStudioLayer 5 个 func 清掉 + 死代码 drawPanelLightSweep 一并删）· 换方向 = **琴手另一副装备**（synth + pedals 是工作室真实 signal chain）· 新加 **drawPedalboard** 放独立 static Canvas + `.drawingGroup()` + `.opacity(deckAlpha)` 单独层（~400 ops 绘制量绝不能进 30 FPS dynamic，compositor-level 淡入零 per-frame 成本）· 5 款 iconic pedals 按真实长宽比 + 真实色并排：①**TS808 Tube Screamer** jade 绿 (W/H 0.58) — 3 旋钮三角排布 (DRIVE / TONE / LEVEL) + 红 LED + TUBE SCREAMER serif 印字 + 大 footswitch · ②**BigSky** 天蓝 (1.42) + ③**TimeLine** 暗灰 (1.42) 共享 drawStrymonChassis — 左上 dot-matrix 显示 + 右上 encoder + 12 LED 环 (7 lit) + 中排 5 小 knob + 下排 3 footswitch 带 LED + 斜体 serif logo · ④**RAT** 哑光黑 (0.72) — 3 旋钮 + DIST/FILT/VOL 白底黑字标 + 红 LED + 粗衬线 "RAT" 黑字 + footswitch · ⑤**Centavo/Klon** 金黄 (1.32) — 3 旋钮 (GAIN/TREBLE/OUTPUT) + 琥珀 LED + 黑描线 centaur 剪影（body/head/neck/legs/tail，墨黑印章质感）+ CENTAVO serif + footswitch · 共享 drawPedalChassis (上暗下深 gradient + 4 corner screw + upper-left 白 bevel / lower-right 黑 shade) + drawPedalKnob (chrome radial + indicator line + cast shadow) + drawPedalFootswitch (hex nut base + chrome stomper) + drawPedalLED (bezel + white core)· 整排 ground shadow 连通· 5 原则对齐：物件感>UI（每台都是 3D 金属盒不是 UI chip）· 沉浸优先（全静，pedal LED 常亮不 blink）· 克制温度（绿/蓝/灰/黑/金真实配色）· 侧光（统一 upper-left highlight）· 动而非跳（synth 本体保留音频联动，pedalboard 不动）· verify-build ✅ | 2026-04-22 |
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
