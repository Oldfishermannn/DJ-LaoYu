# Phase 2.5 — UI/UX 重设计「氛围电台」

> 从 SimonePlan.md 抽出的 UI/UX 重设计完整 spec。后续被 v1.1.1（交互重塑）和 v1.2（Fog 视觉）逐步实施。
> 部分设想（Smart Adapt / Max 档大功能）延后到 v1.3 + v2.0。

---

## 设计理念

**产品定位**：氛围电台（Mood Radio）— 不是播放器，是电台。选台就完了。
**交互原则**：零引导 — 所有操作必须自解释，不需要任何教程或提示。
**UI 语言**：全英文（面向英文用户为主）。

## 4 页结构（上下滑动，不变）

| 页面 | 定位 | 改动 |
|------|------|------|
| **Page 0 沉浸页** | AI 创作体验 | **重写：LIVE + DNA + Evolve + 滑块** |
| **Page 1 主页** | 频谱 + 调台控制 | **重写控件** |
| **Page 2 频道页** | Tab 频道列表 + 收藏 | **完全重写** |
| **Page 3 设置页** | 所有设置项 | **扩展内容** |

## Page 1 主页 — 改动

**当前**：♡ | ◁ | ▶ | ▷ | ↻（收藏、上一首、播放、下一首、刷新）
**改为**：完整的 AI 电台主页

**主页 UI 不变，只改控件逻辑**：
- 频谱 carousel、风格名显示、播放器视觉 — **全部保持现有 UI 不动**
- 只改 PlayControlView 的按钮：去掉 ♡（收藏）和 ↻（刷新），保留 ◁ ▶ ▷
- ◁ ▷ 功能改为调台：
   - Free：随机跳到任意风格
   - Pro/Max：在当前分类内循环切换

**改动文件**：
- `Simone/Views/PlayControlView.swift` — 只删按钮，不改布局/样式
- `Simone/Models/AppState.swift` — 添加 currentCategory、categoryStyles、energy/mood 属性

## Page 2 频道页 — 完全重写

**当前**：MiniPlayer + 收藏 + 推荐 + 演化 + 定时
**改为**：MiniPlayer + Tab 频道列表

**Tab 栏**：`♡ Favorites | Chill | Jazz | Electronic | Ambient | Cinematic`

- **♡ Favorites Tab**（第一个）：显示所有已收藏的风格
- **分类 Tab**：该分类下的所有风格列表，每个风格右侧有 ♡ 按钮
- **列表底部**：「+ New Style」入口
  - Free：🔒 弹升级弹窗
  - Pro：标签拼接页面（Genre + Mood + Instrument 选择）
  - Max：标签拼接 + 顶部「Direct Input」自由文本框
- 点击风格 = 直接切台播放
- 点击 ♡ = 收藏/取消

**改动文件**：
- `Simone/Views/DetailsView.swift` — 完全重写为 Tab + 列表结构
- `Simone/Models/MusicStyle.swift` — MoodStyle 添加 `category: StyleCategory` 字段
- 新建 `Simone/Models/StyleCategory.swift` — 分类枚举 + 每个分类的颜色

**分类定义（传统流派，10 个，Tab 栏横向滚动）**：
```swift
enum StyleCategory: String, CaseIterable, Codable {
    case lofi, jazz, blues, rnb, rock, pop, electronic, classical, ambient, folk

    var displayName: String { ... }  // "Lo-fi", "Jazz", "Blues", "R&B", ...
    var color: Color { ... }  // MorandiPalette 颜色
}
```

**预设风格（每分类 3-4 个，上架前测试 Lyria 生成效果，不行的砍）**：
| 分类 | 风格 |
|------|------|
| Lo-fi | Lo-fi Chill, Lo-fi Jazz, Lo-fi Rain |
| Jazz | Night Jazz, Café Jazz, Smooth Jazz, Bossa Nova |
| Blues | Slow Blues, Delta Blues, Chicago Blues |
| R&B | Smooth R&B, Neo Soul, Slow Jam |
| Rock | Soft Rock, Indie Rock, Post Rock |
| Pop | Dream Pop, Synth Pop, Chill Pop |
| Electronic | Synthwave, Deep House, Downtempo |
| Classical | Solo Piano, String Quartet, Orchestral |
| Ambient | Space Drift, Rain, Forest, Ocean |
| Folk | Acoustic Folk, Fingerstyle, Campfire |

## Page 3 设置页 — 扩展

**当前**：API Key 管理 + 连接状态
**改为**：完整设置中心

设置项（从上到下）：
1. **Evolve** ⓘ — Lock / 10s / 1m / 5m + 主页动效开关
   - ⓘ 点击弹提示："Music subtly shifts over time, like a DJ slowly changing the vibe. 10s = fast changes, 5m = slow drift, Lock = stay the same."
2. **Sleep Timer** — Off / 30m / 1h / 2h
3. **Smart Adapt** — 环境感知开关
   - Time-aware：根据时间自动调整氛围（早上明亮、深夜低沉）
   - Weather-aware：根据天气加入音乐纹理（需定位权限，可选）
3. **Visualizers**
   - 内置 18 个可选，开关控制是否出现在主页/沉浸页
   - 拖拽排序
   - 「Generate Custom Visualizer」入口（付费功能 🔒）
4. **API Key** — 保持现有 APIKeySettingsView
5. **About** — 版本号、隐私政策链接

**改动文件**：
- `Simone/Views/APIKeySettingsView.swift` — 重命名为 `SettingsView.swift`，扩展为完整设置页
- `Simone/Models/AppState.swift` — 添加可视化器排序/启用状态持久化

## Page 0 沉浸页 — 重写为 AI 体验页

**当前**：全屏频谱，无 UI
**改为**：AI 创作沉浸体验

布局（从上到下）：
1. **LIVE · Generating** — 绿色脉冲标记，强调实时生成
2. **全屏频谱可视化** — 高密度渲染（density:2）
3. **音乐 DNA** — 淡色显示 `jazz · warm · piano · 92bpm`
4. **风格名**
5. **Evolve 呼吸环** — 可视化"音乐正在演变"状态
6. **Energy / Mood 实时滑块**
   - Free/Pro：显示但 🔒 锁定，拖动弹升级提示
   - Max：可拖动，实时改变音乐

**改动文件**：
- `Simone/Views/ImmersiveView.swift` — 重写，加入 LIVE/DNA/Evolve/滑块

## 数据模型改动汇总

**`MusicStyle.swift`**：
- MoodStyle 添加 `category: StyleCategory` 字段
- 20 个预设全部标注分类
- `generateNewStyles()` 生成的风格也需要分类

**`AppState.swift`**：
- 新增 `currentCategory: StyleCategory`（当前选中分类，默认 .chill）
- 新增 `stylesInCurrentCategory: [MoodStyle]` 计算属性
- 新增 `nextStyleInCategory()` / `prevStyleInCategory()` 方法
- 移除 `exploredStyles`（推荐功能去掉了）
- 演化 + 定时逻辑保持不变，只是 UI 入口移到设置页

## 付费分层（三档）

| | Free | Pro | Max |
|---|---|---|---|
| **播放** | 不限时长 | 不限时长 | 不限时长 |
| **调台** | 只能随机（◁ ▷ 随机跳） | 选分类 + 选具体风格 | 同 Pro |
| **频道页** | 能看，灰色 🔒 点不了 | 完全解锁 | 完全解锁 |
| **收藏** | 不能 | 可以 | 可以 |
| **生成新风格** | 无 | 拼标签（Genre+Mood+Instrument） | 自由打字输入 prompt |
| **可视化器** | 18 内置 | 18 内置 + 排序 | +生成自定义可视化器 |
| **控制** | 演化 + 定时 | 演化 + 定时 | +全参数（BPM、temperature 等） |
| **App 主题** | Default 固定 | Default 固定 | 6 套深度定制主题（按钮/频谱/背景/字体/动效全套） |
| **多风格混合** | 无 | 无 | 同时叠加两个风格播放 |
| **离线电台** | 无 | 无 | 录制风格保存本地，无网可听 |
| **导出** | 无 | 无 | 下载片段 |

**定价**（原 Phase 2.5 方案，v1.3 重新定）：
| | 月付 | 买断 |
|---|---|---|
| Pro | $1.99/月 | $9.99 一次性 |
| Max | $4.99/月 | $19.99 一次性（含 Pro 全部功能） |
- 已有 Pro 买断 → 升 Max 补差价 $10
- 视觉引导买断（大按钮 + "最划算"标签），月付小字

**Free 转化逻辑**：随机电台不限时 → 想选风格？→ 频道页看得到但 🔒 → 升级 Pro
**升级弹窗**：点 🔒 弹出 → Pro/Max 买断大按钮 + 月付小字链接 + "稍后再说"
**首次体验**：打开 App → 主页频谱静止 + "Lo-fi Chill" + ▶ → 用户按 ▶ 开始播放
**API Key**：全部档位用内置 Key，设置页保留 BYOK 入口（不强推）
**Key 保护**：XOR 混淆 + 字节数组拆分，运行时组装。不明文存储，防 `strings` 提取和普通反编译。
**付费实现**：StoreKit 2，无需登录系统（Apple ID = 账号）
**v1.0 实现策略**：Free 功能完整可用 + Pro/Max 入口占位（🔒 标记 + 升级弹窗 UI，不接 StoreKit）—— v1.3 真接入

## 实现顺序（历史参考）

1. `APIKeyObfuscator.swift` — Key 混淆工具（XOR + 字节数组），替换 LyriaClient 硬编码 Key
2. `StyleCategory.swift` — 分类枚举
3. `MusicStyle.swift` — MoodStyle 加 category，20 个预设分类
4. `AppState.swift` — currentCategory + 分类内导航方法
5. `PlayControlView.swift` — 精简为 ◁ ▶ ▷ 三按钮
6. `DetailsView.swift` — 完全重写为 Tab + 频道列表
7. `APIKeySettingsView.swift` → `SettingsView.swift` — 扩展为完整设置页
8. `ContentView.swift` — Page 3 指向 SettingsView

## 验证清单

1. 主页 ◁ ▷ 在当前分类内循环切换，切换后立即播放
2. 频道页 Tab 切换显示对应分类的风格列表
3. 频道页 ♡ 收藏 Tab 显示所有已收藏风格
4. 点击频道页中的风格直接切台播放
5. 点 ♡ 收藏/取消收藏，收藏 Tab 实时更新
6. 设置页演化/定时功能正常工作
7. 设置页可视化器排序/开关正常
8. 付费入口显示但标记为 🔒（不实现功能）
9. 所有页面零引导 — 不需要文字解释
