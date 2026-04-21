# CEO 想法时间线 (Append-Only)

> 老鱼随时丢的细碎想法，Assistant 原文记录 + 结构化解读。
> **规则**: 只追加，不删改；升级后在 status 标记 `promoted → Proposal #NNN`。

---

## 条目模板

```
## YYYY-MM-DD HH:MM
- **type**: visual-friction / audio-bug / copy-tweak / feature-request / risk / other
- **channel**: Jazz / Electronic / Lo-Fi / Classical / Ambient / 全局
- **raw**: CEO 原话
- **interpreted**: Assistant 的结构化解读
- **status**: logged / promoted → Proposal #NNN / dropped (理由)
```

---

## 2026-04-19 14:00 — 批次 5 条

### #1 新用户引导
- **type**: feature-request / onboarding
- **channel**: 全局
- **raw**: 做新用户引导
- **interpreted**: 首启流程。可能涵盖：频道概念讲解 / BYOK 填写 / visualizer 演示 / evolve 交互教学。切入重心待 CEO 澄清
- **status**: logged (待聚焦)

### #2 广告 动物蹦迪
- **type**: marketing / creative (推测)
- **channel**: 全局
- **raw**: 广告 动物蹦迪
- **interpreted**: 含义不明。候选：① App Store Preview 视频素材概念 ② TikTok/小红书 投放风格 ③ App 内彩蛋动画（某频道动物跳舞）
- **status**: logged (需澄清)

### #3 根据 Spotify 歌单定制电台
- **type**: feature-request
- **channel**: 全局
- **raw**: 根据 spotify 歌单定制电台
- **interpreted**: 用户导入 Spotify 歌单 → Simone 提取风格特征 → 生成个性化电台/频道
- **status**: logged
- **技术备注**: Spotify API scope (`playlist-read-private`) / 风格特征 → Lyria prompt 映射 / 版权边界 / v1.3+ 资源级抓手

### #4 Jam 模式
- **type**: feature-request
- **channel**: 全局
- **raw**: jam 模式
- **interpreted**: 含义不明。候选：① Free Jam Club（吉他手 jam 工具）合并进 Simone ② Simone 内新加 "用户演奏 + AI 伴奏" 模式 ③ 多频道混搭即兴模式
- **status**: logged (需澄清)

### #5 Evolve 倒酒动画
- **type**: visual-enhancement
- **channel**: 可能与 liquor visualizer 相关
- **raw**: evolve 有动画 倒酒
- **interpreted**: evolve 模式（场景演化 / 频道过渡）加入液体"倒酒"动画。推测是 liquor visualizer 的动态增强，或频道切换时的过场效果
- **status**: logged (推测待验证)

---

## 2026-04-19 14:10 — CEO 澄清回合

- **#2 广告**: 选 1b — 外部投放素材风格（TikTok/小红书钩子画面里出现动物蹦迪）
- **#4 Jam 模式**: 不是合并 Free Jam Club，也不是用户弹奏。是**播放中乐器轮流 solo**（吉他 solo → 贝斯 solo → 鼓 solo 的 jam session 感）
- **#5 Evolve 动画**: **每次 evolve 触发时的反馈动画**，per-channel 独立设计。例子：R&B 频道 = 右边酒瓶给左边酒杯倒酒

**升级决策**: 5 条全部澄清/够分量，promoted → Proposal #001–#005

---
