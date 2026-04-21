@AGENTS.md

# Simone — AI Mood Radio

## TL;DR

- **是什么**：iOS/Mac AI 氛围电台，Google Lyria RealTime 实时生成器乐
- **架构**：客户端直连 Google WebSocket，零服务器，BYOK + 内置 Key
- **当前**：v1.0 已上架（2026-04-16），推进 v1.2.1（PromptBuilder）→ v1.3（商业化）
- **角色**：CEO = 老鱼 · COO = 小克 · 员工见 `AGENTS.md`
- **铁律**：一切可逆 · Phase 切换走 `/clear` SOP · 改完模拟器跑给老鱼看
- **唤醒**：先读 `SimonePlan.md` + `docs/team-status.md`

## 路线图

**已 ship**：v1.0（App Store）· v1.1.0 稳定性 · v1.1.1 交互重塑 · v1.2（2026-04-19 merge `842b589`, tag `v1.1.1-pre-v1.2-merge`）Fog City Nocturne

**规划中**（先稳 → 再变 → 再美 → 再赚 → 再爽 → 再连）：

| 版本 | 核心抓手 |
|---|---|
| **v1.2.1** 📋 | PromptBuilder 三维度（instruments/density/energy）调制，撑 30 分钟不疲劳 |
| **v1.3** 📋 | StoreKit 2 + Flow/Tune/Studio 分层 + 前 14 天 50% off 年订阅 |
| **v2.0** 📋 | 频谱三层耦合驱动 + BPM + Smart Adapt + Slow Jam |
| **v2.1** 📋 | 锁屏 ◁▷ + 灵动岛 + Widget + 反调试 |

完整规划见 `SimonePlan.md`。

## 技术栈

SwiftUI + AVFoundation + Keychain · Google Gemini Live Music API (`models/lyria-realtime-exp`) PCM 48kHz stereo · 客户端直连 WebSocket · BYOK + 内置 Key（XOR 混淆）· StoreKit 2（v1.3 接入）

## 目录速查

- `simone ios/` 上架版（独立 git）· `simone mac/` Mac 版
- `simone ios/Simone/`：`Network/` LyriaClient + Keychain + 混淆 + PromptBuilder · `Models/` AppState + MusicStyle + StyleCategory · `Views/` ContentView(4 页) + Settings + Visualizers
- `docs/` superpowers plans · roles 员工卡 · daily 日报 · team-status.md
- `_archive/` 老架构不再使用
- Bundle: `com.simone.ios` · Team `9YD5W53S9K`

## 产品定位

AI Mood Radio · 都市夜晚温柔陪伴 · 零引导自解释 · 默认 Lo-fi Chill · Flow/Tune/Studio 分层 · **Evolve 只做风格内微调不换台**

## 铁律

**一切可逆**：每抓手单独 commit · 不破坏性删除用 flag 覆盖 · 新交互留回退入口 · schema 保留旧 key 一版 · 每版 TestFlight 可回滚。

**UI/UX 任务动手前必须调 `plugin:impeccable:impeccable`**（visualizer / 字体 / 颜色 / 布局 / 交互 / 微调都算，纯功能不触发）。"再微调一下"也不豁免——凭感觉迭代会漂移回 AI slop（border-left 彩条 / cyan-on-dark / 景深 / 通用图表）。设计上下文 `.impeccable.md`。

## 改完必测

1. **打开模拟器给老鱼看**：`open "simone ios/Simone.xcodeproj"`，Cmd+R 跑 iPhone 15 Pro，老鱼亲眼看
2. **端到端听 30 秒音频**：HMR 对 AudioContext 不可靠，重启 app 从静默到出声整段听
3. **过 test list**（本次相关必测 + 无关抽样）：
   - [ ] 首屏 5 秒内出声（默认 Lo-fi Chill）
   - [ ] 横滑切频道 3 秒内出新声
   - [ ] Evolve 是风格内微调，不是硬切
   - [ ] 内置 Key 10 分钟不断流 · BYOK 无限用
   - [ ] Settings 开关杀 app 重启保留
   - [ ] 锁屏 artwork 正确 · 后台 5 分钟不被杀
   - [ ] 5 默认 visualizer（tape/oscilloscope/liquor/ember/matrix）切换正常

CI/快验：`./scripts/verify-build.sh`（iOS Engineer 报 DONE 前必跑）· 大改用 `./scripts/verify-build.sh --background` 边干边编

## Context 防爆 SOP

**Phase 切换 或 角色切换 都触发**四步：① 覆盖更新 `docs/team-status.md` 自己那行（时间戳 + DONE / BLOCKED / IN-PROGRESS）→ ② 主动 `/clear` → ③ 新窗口只读 CLAUDE.md + team-status.md + 对应 `docs/roles/<ROLE>.md` + 当前 phase plan → ④ 开干。

角色切换是关键：同一对话里从 engineer 换到 PM 不 clear，上顶帽子的 context 会污染下顶的判断。**换帽子 = 换窗口**，不是换语气。

探索类活（大文件 / 全仓 grep / debug）外包 `Explore` / `general-purpose` subagent，返回 ≤200 字总结。多条独立线用 worktree + 独立窗口（`superpowers:using-git-worktrees`）。

**Background subagent 完成时强制写 team-status.md**：所有 spawn 出去的 subagent，收尾必须覆盖更新自己那行（带时间戳 + 结果），COO 定期扫这一个文件即可，不用追每个 agent 的输出。
