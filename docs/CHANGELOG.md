# Simone Changelog

> 已 ship 版本的历史档案。SimonePlan.md 不再留长篇 Phase 细节，全部归档到这里。
> 当前/规划中版本见 `SimonePlan.md`。

---

## v1.2 — Fog City Nocturne 视觉重设计 ✅

**Ship**: 2026-04-19 合入 iOS main · merge commit `842b589` · 锚点 tag `v1.1.1-pre-v1.2-merge`
**Spec**: `docs/superpowers/specs/2026-04-18-simone-fog-redesign.md`（Fog v5 最终锁定版）

**做了什么**：晚 11 点地下酒吧的雾玻璃感——换皮不改骨。对标 Teenage Engineering 说明书 / Aesop 产品页。

**4 个改动点**：
- `ImmersiveView.swift` — 底部 Music DNA 标签 + Unbounded Light 字体
- `ChannelPageView.swift` — 列表去卡片化，虚线分隔，Fraunces 斜体副标
- `SettingsView.swift` — 一屏化章节列表（Evolve/AutoTune/Sleep/Spectrum/Colophon）
- 新增 `FogTheme.swift` + 字体资源（Unbounded / Fraunces / Archivo 三族 OFL license，+2.82MB）

**底层零改动**：音频引擎、频谱逻辑、频道数据、BYOK 全不动。

**2026-04-19 补做**（大图叙事 + 横滑 bug 修复）：
- ✅ `496db7d` 横滑切台不自动启动播放
- ✅ `df4cf1a` R&B Liquor 大图加 decanter + coaster + 吧台线
- ✅ `182b57e` Rock Ember 大图加炭木堆 + 灰烬地板
- ❌ Electronic Matrix 两版"叙事减法"被否掉（夜街、synthwave 条纹日）→ 回退到 4 栋楼天际线（`324711f`）。**教训**：Electronic 审美方向 = 城市天际线群像 > 单物件叙事

---

## v1.1.1 — 交互重塑 ✅

**Ship**: 2026-04-18 实测确认已 ship 到 iOS main · commit 范围 `1626c88..fb43a5f` → polish 至 `da09746`
**Spec**: `docs/superpowers/specs/2026-04-16-v1.1.1-interaction-redesign-design.md`

**做了什么**：App 内凡是横滑都是换频道。主页 + 沉浸页 + 详情页手势统一，主页 UI 零视觉改动。

**6 个抓手全部落地**：
- ✅ Channel 数据模型（`.favorites` + 10 `.category` 枚举）
- ✅ 横滑换频道（SpectrumCarouselView Channel-bound）
- ✅ ◁ ▷ 分类内循环
- ✅ Evolve 修对（新建 `EvolveVocabulary.swift` + PromptBuilder 接入）
- ✅ Auto Tune（`autoTuneEnabled: Bool = false` + 25min drift）
- ✅ 详情页横滑 11-page TabView + dial
- ✅ 可视化器入口下移到 SettingsView

**延后到 v1.3**：Flow/Tune/Studio 命名 + 🔒 标记 + 升级弹窗 + "+ New Style" 入口 + StoreKit 2。

---

## v1.1.0 — 稳定性修复 ✅

**Ship**: 2026-04-16

**做了什么**：消除用户流失点，把 v1.0 地基打牢。**所有稳定性改动走后台不可见方案，不主动打断用户。**

- ✅ 30s Ring Buffer（`AudioBufferQueue` 容量 30s/5.76MB，超容量丢最老）——切后台/锁屏/网络抖动期间不断音
- ✅ 卡死 watchdog（`AudioEngine` 每 3s 检查 `isPlaying && isUnderrun && 10s 无 chunk` → 自动重连）
- ✅ NowPlaying artwork（512×512 频道色渐变 + logo + 风格名）
- ✅ Trial 残留代码清理

**撤回项**（违反"不破坏沉浸感"原则）：~~25min 自动换台~~ — 用户正聆听时强制跳台违反 "Evolve 不换台" 红线。

**单元测试**：`AudioBufferQueueTests` 13/13 通过。

---

## v1.0 — 上架 App Store 🎉

**Ship**: 2026-04-16 成功上架 · Bundle `com.simone.ios` · Team `9YD5W53S9K`

**架构决策**：BYOK + 内置试用 Key + 客户端直连 Google WebSocket，**零服务器**。App 直连 `wss://generativelanguage.googleapis.com/...BidiGenerateMusic?key=API_KEY`，Keychain 存 user key，`APIKeyConfig.builtInKey` 从 `Info.plist` 读（XOR 混淆 + 字节数组拆分）。

**核心改造**：
- ✅ Phase 1 — `LyriaClient.swift` 重写直连 Google WebSocket + ~30s 会话轮转 + snake→camel case 转换
- ✅ Phase 1 — `KeychainHelper.swift` Keychain CRUD + `APIKeySettingsView.swift`
- ✅ Phase 2 — `UIRequiresFullScreen = true` + 1024×1024 App Icon + 深色 LaunchScreen
- ✅ Phase 3 — App Store Connect 配置（老鱼手动）
- ✅ Phase 4 — Archive + TestFlight 内测
- ✅ Phase 5 — 提交审核通过

**成本**：Apple Developer $99/年（≈$8/月）· Lyria API 目前免费 · 零服务器成本

**审核风险对策**：
- 需要联网 → 内置试用 Key 审核员直接能用
- Lyria 实验模型 → 描述注明 AI-generated 降低预期
- 隐私政策 → `docs/privacy.html`
