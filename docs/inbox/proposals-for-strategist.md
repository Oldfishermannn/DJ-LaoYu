# 待战略师评估的提案

> Assistant 从 `ceo-ideas-log.md` 升级而来。
> **升级触发**: 同点重复 2+ / 强烈语气 / 上架风险 / 同主题攒够 5 条模糊愿望。
> **战略师**: 在本文件里直接标决定 (✅ 进 plan / ❌ 不进 / ⏳ 再观察)。
> **Assistant**: 战略师标完决定后，归档到 `resolved.md`。`⏳` 状态留本文件等回流节点。

---

## 提案模板

```
## Proposal #NNN — 一句话主题
- **来源**: ceo-ideas-log.md 的时间戳列表
- **CEO 痛点**: 一句话
- **建议**: 1-3 个可选方向
- **影响**: 版本/上架/用户体验
- **战略师决定**: ⏳ 待评估
- **决定时间**:
- **流转**: 进 plan 后写到哪里 / 不进的理由
```

---

## Proposal #003 — Spotify 歌单定制电台
- **来源**: ceo-ideas-log.md 2026-04-19 14:00 #3
- **CEO 痛点**: 用户已有 Spotify 音乐品味，Simone 应该能"继承"这个品味生成个性化电台
- **建议**:
  - a) Spotify OAuth → 读歌单 → 抽风格特征（genre / tempo / mood）→ 转成 Lyria prompt 种子 → 生成专属频道
  - b) MVP：只读一个歌单，生成 1 个新频道（不替换现有 5 频道）
  - c) 迭代：多歌单 → 自定义命名 → 分享
- **影响**: **大抓手**，差异化；但牵涉 Spotify API 审核 + 版权边界（不能播 Spotify 原曲，只借风格）+ Lyria prompt 可控性；资源级投入，建议 v1.4+
- **技术风险**: Spotify scope `playlist-read-private` 审批 / 风格 → Lyria 映射准确度 / 用户预期管理（不是"放我的歌单"而是"像我的歌单风格的生成音乐"）
- **未决问**: 这是 v1.3 重点还是 v1.4 压轴？BYOK 时代能否先跑 Pro 功能？
- **战略师决定**: ❌ 不进（所有版本）—— 但战略师自行发起**二辩**，等 CEO 拍板 (a) 3 天调研路径 ✅/❌
- **决定时间**: 2026-04-19
- **当前状态**: ❌ **终裁 2026-04-19 17:30** — CEO 在 COO 讨论中否决全案（含 B/C 粘歌名绕开 TOS 方案）。产品定位冲突 + 精选库崩塌 + 替代方案（v2.0 抓手 D）已覆盖个性化需求。归档进 resolved，不再回流。
- **流转（战略师初判硬否决五条理由）**: **产品身份冲突 = 硬否决**，不是时机问题。
  1. **产品定位违反** —— Phase 2.6 明文「像电台不像工具，核心不是生成而是陪伴型氛围音乐体验」。Spotify 导入 = 把 Simone 变成「个性化推荐工具」，等于把 Simone 从"选台就完了"的电台定位扭成 Suno/Endel 中间形态，自废护城河
  2. **精选频道库被破坏** —— 10 个分类频道（Lo-fi/Jazz/Blues/R&B/Rock/Pop/Electronic/Classical/Ambient/Folk）是 Simone 精心策展的"频道库"，每个频道都有 core/accent/optional 乐器池设计（v1.2.1 要做的）。一旦开 Spotify 导入，每个用户都有自己的「my custom channel」，精选系统存在意义崩塌
  3. **Spotify API 政策红线** —— Spotify Web API 条款明确禁止「把 Spotify 用户数据导出到其他音乐生成服务」，OAuth scope 审批会被直接拒。历史上 Endel、Aimi 等 AI 音乐 App 都尝试过，都没通过
  4. **用户预期管理失败** —— 即便 API 通了，用户心智是「放我的歌单品味」，产品真实行为是「用 AI 生成类似风格的音乐」。用户下意识会拿 Lyria 生成 vs Spotify 原曲比较，**永远输**。这是死胡同
  5. **替代方向已在计划中** —— 个性化需求的正确解法是 v2.0 抓手 D「Slow Jam 推荐机制（基于用户播放时长 + 收藏行为推荐频道）」，Simone 内生的个性化 > 外部导入的个性化

---

## Proposal #004 — Jam 模式：乐器轮换 Solo
- **来源**: ceo-ideas-log.md 2026-04-19 14:00 #4 + 14:10 澄清
- **CEO 痛点**: 当前频道是整体 ensemble 播放，缺少 jam session 的"聚光灯轮换"张力
- **建议**:
  - a) 在任意频道长按/开关进入 Jam 模式 → 当前生成自动进入"solo 轮换"模式（吉他 solo 8 小节 → 贝斯 solo 8 小节 → 鼓 solo 8 小节）
  - b) visualizer 同步聚光：当前 solo 的乐器在画面中被高亮（如 oscilloscope 变单色、其他乐器淡入背景）
  - c) 频道适配：Jazz/Electronic/R&B 最合适；Ambient/Classical 是否豁免？
- **影响**: **强产品人格**，让 Simone 从"陪伴背景"升级成"有现场感的 mini live"；视觉+音频双改动；中等投入
- **技术风险**: Lyria RealTime 是否支持"指定单乐器突出"的 prompt？需先做独立测试脚本（按 memory 规则）
- **未决问**: Jam 模式是默认开启还是用户触发？是否和 evolve 冲突？
- **战略师决定**: ⏳ 方向采纳，但**不进 v1.3 范围**；Lyria 单乐器可行性测试可以现在就跑
- **决定时间**: 2026-04-19
- **当前状态**: ⏳ 留 proposals，等 Lyria solo 测试结果（3 天内）
- **流转**:
  - **进 v2.x 候选池**，不进 v1.3/v2.0/v2.1 当前已定范围。理由：Jam 模式和 v1.2.1 Evolve 深度化是**同一问题的两种解**——Evolve 是"慢慢变"治持续疲劳，Jam 是"忽然高光"治节奏单调。**先验证 v1.2.1 能不能治 15 分钟腻，再决定要不要补 Jam**。如果 v1.2.1 + v2.0 抓手 A（频谱三层耦合）双管齐下能把"30 分钟不疲劳"做到，Jam 模式是锦上添花；如果做不到，Jam 变成必救牌，升级 v2.x 优先级
  - **Lyria 单乐器可行性测试立刻启动**（这个不等）—— 按 memory feedback_standalone_api_test 规则，在 `/tmp/lyria-solo-test/` 写 minimum viable 脚本，测 `"guitar solo"` / `"bass features here"` / `"drums take the lead"` 这三种 prompt 表达能否真的让 Lyria 把单乐器推到前景。测试 3 天，结果写回 `docs/inbox/proposals-for-strategist.md` 这条下面。如果 Lyria 不支持，这条直接降级（用 volume ducking / band-pass filter 后处理也能模拟 solo，但复杂度翻 3 倍）
  - **"默认开还是触发"的答案**：用户触发（长按频道 icon 或 Settings 里 toggle）。Simone 品牌是"温柔陪伴"，默认进 Jam 模式 = 强迫用户持续听 climax，破坏沉浸感。Jam 应该是"我想听点 live 感"时的主动选择
  - **和 Evolve 冲突**：不冲突。Jam 是"ensemble 结构层"调整（谁在前台），Evolve 是"参数调制层"调整（加减乐器/密度/能量）。理论上可叠加——Jam 模式下仍可 Evolve，表现为"solo 的那个乐器的 density/energy 跟着变"
  - **频道豁免**：Ambient / Classical 豁免合理，不适合 solo 概念。Jazz / R&B / Rock / Electronic / Blues 都合适。Lo-fi / Pop / Folk 边界情况（Lo-fi 可能适合"piano solo 段"但不适合"drum solo"，需要频道级别 solo 池设计）
  - **回流节点**：Lyria 测试结果 3 天内回，根据结果决定 Jam 进 v2.1 还是 v2.2

---
