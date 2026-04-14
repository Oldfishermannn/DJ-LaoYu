# Simone Native App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a macOS Menu Bar + iOS SwiftUI app that connects to Google Lyria RealTime API via WebSocket, plays AI-generated instrumental BGM, and displays 5 swipeable spectrum visualizer styles with glassmorphism UI.

**Architecture:** Single Xcode project with two targets (macOS + iOS). SwiftUI views are 100% shared. Platform differences handled via `#if os()` in the app entry point only. Audio via AVAudioEngine with vDSP FFT. WebSocket via URLSessionWebSocketTask connecting to existing Python bridge server (`local_server.py`).

**Tech Stack:** SwiftUI, AVAudioEngine, Accelerate (vDSP), URLSessionWebSocketTask, Metal/Core Animation

---

## File Structure

```
SimoneApp/
├── SimoneApp.swift                    — App entry, #if os() for MenuBarExtra vs WindowGroup
├── Models/
│   ├── Scene.swift                    — Scene enum (Study, Drive, Workout, Cook, Date, Chill)
│   ├── MusicStyle.swift               — Style enum (Jazz, Lofi, Ambient, Funk, Bossa, Electronic)
│   ├── VisualizerStyle.swift          — Visualizer enum (Fountain, Aurora, Vinyl, SilkWave, Constellation)
│   └── AppState.swift                 — @Observable app state
├── Audio/
│   ├── AudioEngine.swift              — AVAudioEngine PCM playback + FFT
│   └── AudioBufferQueue.swift         — Thread-safe circular buffer for PCM chunks
├── Network/
│   ├── LyriaClient.swift              — WebSocket client
│   └── PromptBuilder.swift            — Scene+Style → weighted prompts array
├── Views/
│   ├── ContentView.swift              — Main layout (shared macOS/iOS)
│   ├── ScenePillsView.swift           — Two-row pills (scene + style)
│   ├── SpectrumCarouselView.swift     — Swipeable container for 5 visualizers
│   ├── Visualizers/
│   │   ├── SpectrumDataProvider.swift — Protocol + FFT data bridge
│   │   ├── FountainView.swift         — Arch frame + bars + reflection
│   │   ├── AuroraView.swift           — Layered gradient curves (DEFAULT)
│   │   ├── VinylView.swift            — Radial bars around rotating disc
│   │   ├── SilkWaveView.swift         — Bezier curve waves
│   │   └── ConstellationView.swift    — Star points with connections
│   ├── ExpandableCardView.swift       — Volume + params + Auto-Evolve
│   └── PlayControlView.swift          — Play/pause button + scene info
└── Resources/
    └── Assets.xcassets                — Menu bar icon, Morandi color set
```

---

### Task 1: Xcode Project Setup

**Files:**
- Create: `SimoneApp/` Xcode project with macOS + iOS targets

- [ ] **Step 1: Create Xcode project**

Open Xcode → File → New → Project → Multiplatform → App
- Product Name: `Simone`
- Team: Your Apple Developer account
- Organization Identifier: `com.simone`
- Interface: SwiftUI
- Language: Swift
- Storage: None
- Testing: Include Tests

Or via command line, create the project directory structure:

```bash
mkdir -p SimoneApp/Simone
mkdir -p SimoneApp/Simone/Models
mkdir -p SimoneApp/Simone/Audio
mkdir -p SimoneApp/Simone/Network
mkdir -p SimoneApp/Simone/Views
mkdir -p SimoneApp/Simone/Views/Visualizers
mkdir -p SimoneApp/Simone/Resources
mkdir -p SimoneApp/SimoneTests
```

- [ ] **Step 2: Configure project settings**

In Xcode project settings:
- macOS Deployment Target: 14.0
- iOS Deployment Target: 17.0
- Add Capabilities:
  - macOS: Network (Outgoing Connections)
  - iOS: Background Modes → Audio
- Add Frameworks: Accelerate.framework (for vDSP FFT)

- [ ] **Step 3: Create Assets.xcassets color set**

Create `SimoneApp/Simone/Resources/Assets.xcassets` with Morandi color definitions:

```
Assets.xcassets/
├── MorandiRose.colorset/Contents.json    — #c4a69d
├── MorandiSage.colorset/Contents.json    — #a3ab8f
├── MorandiBlue.colorset/Contents.json    — #8e9aaf
├── MorandiMauve.colorset/Contents.json   — #b5a0b5
├── MorandiSand.colorset/Contents.json    — #c9bfaa
├── AppBackground.colorset/Contents.json  — #2a2a2e
└── MenuBarIcon.imageset/                 — 16x16 music note icon
```

- [ ] **Step 4: Commit**

```bash
git add SimoneApp/
git commit -m "feat: scaffold Xcode project with macOS + iOS targets"
```

---

### Task 2: Models — Scene, MusicStyle, VisualizerStyle

**Files:**
- Create: `SimoneApp/Simone/Models/Scene.swift`
- Create: `SimoneApp/Simone/Models/MusicStyle.swift`
- Create: `SimoneApp/Simone/Models/VisualizerStyle.swift`

- [ ] **Step 1: Create Scene.swift**

```swift
// SimoneApp/Simone/Models/Scene.swift
import Foundation

enum Scene: String, CaseIterable, Identifiable {
    case study, drive, workout, cook, date, chill

    var id: String { rawValue }

    var label: String {
        switch self {
        case .study: "Study"
        case .drive: "Drive"
        case .workout: "Workout"
        case .cook: "Cook"
        case .date: "Date"
        case .chill: "Chill"
        }
    }

    var prompt: String {
        switch self {
        case .study: "study background quiet unobtrusive"
        case .drive: "driving steady rhythmic cruising"
        case .workout: "high-energy intense driving powerful"
        case .cook: "cozy warm kitchen gentle upbeat"
        case .date: "late night dark moody sparse romantic"
        case .chill: "relaxed chill laid-back vibe"
        }
    }

    var promptWeight: Float { 0.3 }
}
```

- [ ] **Step 2: Create MusicStyle.swift**

```swift
// SimoneApp/Simone/Models/MusicStyle.swift
import Foundation

enum MusicStyle: String, CaseIterable, Identifiable {
    case jazz, lofi, ambient, funk, bossa, electronic

    var id: String { rawValue }

    var label: String {
        switch self {
        case .jazz: "Jazz"
        case .lofi: "Lo-fi"
        case .ambient: "Ambient"
        case .funk: "Funk"
        case .bossa: "Bossa"
        case .electronic: "Electronic"
        }
    }

    var prompt: String {
        switch self {
        case .jazz: "Smooth jazz with walking upright bass and brushed drums"
        case .lofi: "Lo-fi hip hop with dusty vinyl crackle and mellow Rhodes piano"
        case .ambient: "Ambient music with ethereal synth pads and gentle arpeggiated piano"
        case .funk: "Funky groove with slap bass guitar and tight clavinet riffs"
        case .bossa: "Bossa nova with nylon acoustic guitar and soft brushed snare"
        case .electronic: "Electronic music with analog Moog synths and TR-909 drums"
        }
    }

    var promptWeight: Float { 1.0 }
}
```

- [ ] **Step 3: Create VisualizerStyle.swift**

```swift
// SimoneApp/Simone/Models/VisualizerStyle.swift
import Foundation

enum VisualizerStyle: String, CaseIterable, Identifiable {
    case fountain, aurora, vinyl, silkWave, constellation

    var id: String { rawValue }

    var label: String {
        switch self {
        case .fountain: "Fountain"
        case .aurora: "Aurora"
        case .vinyl: "Vinyl"
        case .silkWave: "Silk Wave"
        case .constellation: "Constellation"
        }
    }

    static var defaultStyle: VisualizerStyle { .aurora }
}
```

- [ ] **Step 4: Commit**

```bash
git add SimoneApp/Simone/Models/
git commit -m "feat: add Scene, MusicStyle, VisualizerStyle models"
```

---

### Task 3: Network — PromptBuilder

**Files:**
- Create: `SimoneApp/Simone/Network/PromptBuilder.swift`
- Create: `SimoneApp/SimoneTests/PromptBuilderTests.swift`

- [ ] **Step 1: Write the test**

```swift
// SimoneApp/SimoneTests/PromptBuilderTests.swift
import Testing
@testable import Simone

@Test func buildPromptsWithStyleOnly() {
    let prompts = PromptBuilder.build(scene: nil, style: .jazz)
    #expect(prompts.count == 1)
    #expect(prompts[0].text == "Smooth jazz with walking upright bass and brushed drums")
    #expect(prompts[0].weight == 1.0)
}

@Test func buildPromptsWithSceneOnly() {
    let prompts = PromptBuilder.build(scene: .study, style: nil)
    #expect(prompts.count == 1)
    #expect(prompts[0].text == "study background quiet unobtrusive")
    #expect(prompts[0].weight == 0.3)
}

@Test func buildPromptsWithBothMixed() {
    let prompts = PromptBuilder.build(scene: .drive, style: .lofi)
    #expect(prompts.count == 2)
    #expect(prompts[0].text == "Lo-fi hip hop with dusty vinyl crackle and mellow Rhodes piano")
    #expect(prompts[0].weight == 1.0)
    #expect(prompts[1].text == "driving steady rhythmic cruising")
    #expect(prompts[1].weight == 0.3)
}

@Test func buildPromptsWithNeitherReturnsEmpty() {
    let prompts = PromptBuilder.build(scene: nil, style: nil)
    #expect(prompts.isEmpty)
}

@Test func toJSONProducesValidFormat() throws {
    let prompts = PromptBuilder.build(scene: .chill, style: .ambient)
    let json = PromptBuilder.toJSON(prompts: prompts)
    let data = try JSONSerialization.jsonObject(with: json) as! [String: Any]
    #expect(data["command"] as? String == "set_prompts")
    let promptsArray = data["prompts"] as! [[String: Any]]
    #expect(promptsArray.count == 2)
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `xcodebuild test -scheme Simone -destination 'platform=macOS'`
Expected: FAIL — `PromptBuilder` not defined

- [ ] **Step 3: Write PromptBuilder implementation**

```swift
// SimoneApp/Simone/Network/PromptBuilder.swift
import Foundation

struct WeightedPrompt: Codable {
    let text: String
    let weight: Float
}

enum PromptBuilder {
    static func build(scene: Scene?, style: MusicStyle?) -> [WeightedPrompt] {
        var prompts: [WeightedPrompt] = []
        if let style {
            prompts.append(WeightedPrompt(text: style.prompt, weight: style.promptWeight))
        }
        if let scene {
            prompts.append(WeightedPrompt(text: scene.prompt, weight: scene.promptWeight))
        }
        return prompts
    }

    static func toJSON(prompts: [WeightedPrompt]) -> Data {
        let payload: [String: Any] = [
            "command": "set_prompts",
            "prompts": prompts.map { ["text": $0.text, "weight": $0.weight] }
        ]
        return try! JSONSerialization.data(withJSONObject: payload)
    }

    static func commandJSON(_ command: String) -> Data {
        try! JSONSerialization.data(withJSONObject: ["command": command])
    }

    static func configJSON(_ config: [String: Any]) -> Data {
        let payload: [String: Any] = ["command": "set_config", "config": config]
        return try! JSONSerialization.data(withJSONObject: payload)
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `xcodebuild test -scheme Simone -destination 'platform=macOS'`
Expected: All 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add SimoneApp/Simone/Network/PromptBuilder.swift SimoneApp/SimoneTests/PromptBuilderTests.swift
git commit -m "feat: add PromptBuilder with weighted prompt generation"
```

---

### Task 4: Network — LyriaClient (WebSocket)

**Files:**
- Create: `SimoneApp/Simone/Network/LyriaClient.swift`

- [ ] **Step 1: Create LyriaClient**

```swift
// SimoneApp/Simone/Network/LyriaClient.swift
import Foundation

enum LyriaConnectionState {
    case disconnected, connecting, connected, reconnecting
}

@Observable
final class LyriaClient {
    var connectionState: LyriaConnectionState = .disconnected
    var statusMessage: String = ""

    var onAudioChunk: ((Data) -> Void)?
    var onConnected: (() -> Void)?

    private var webSocket: URLSessionWebSocketTask?
    private var session: URLSession
    private var serverURL: URL
    private var autoReconnect = true

    init(serverURL: URL = URL(string: "ws://localhost:8765/ws")!) {
        self.serverURL = serverURL
        self.session = URLSession(configuration: .default)
    }

    func connect() {
        guard connectionState == .disconnected else { return }
        connectionState = .connecting
        statusMessage = "正在连接 Lyria..."

        webSocket = session.webSocketTask(with: serverURL)
        webSocket?.resume()
        receiveMessage()
    }

    func disconnect() {
        autoReconnect = false
        webSocket?.cancel(with: .goingAway, reason: nil)
        webSocket = nil
        connectionState = .disconnected
        statusMessage = "已断开"
    }

    func sendPrompts(_ prompts: [WeightedPrompt]) {
        send(PromptBuilder.toJSON(prompts: prompts))
    }

    func sendCommand(_ command: String) {
        send(PromptBuilder.commandJSON(command))
    }

    func sendConfig(_ config: [String: Any]) {
        send(PromptBuilder.configJSON(config))
    }

    private func send(_ data: Data) {
        guard let string = String(data: data, encoding: .utf8) else { return }
        webSocket?.send(.string(string)) { [weak self] error in
            if let error {
                self?.statusMessage = "发送失败: \(error.localizedDescription)"
            }
        }
    }

    private func receiveMessage() {
        webSocket?.receive { [weak self] result in
            guard let self else { return }
            switch result {
            case .success(let message):
                self.handleMessage(message)
                self.receiveMessage()
            case .failure(let error):
                self.handleDisconnect(error: error)
            }
        }
    }

    private func handleMessage(_ message: URLSessionWebSocketTask.Message) {
        switch message {
        case .string(let text):
            guard let data = text.data(using: .utf8),
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let type = json["type"] as? String else { return }

            switch type {
            case "audio":
                if let b64String = json["data"] as? String,
                   let audioData = Data(base64Encoded: b64String) {
                    onAudioChunk?(audioData)
                }
            case "status":
                let msg = json["message"] as? String ?? ""
                statusMessage = msg
                if msg == "connected" {
                    connectionState = .connected
                    onConnected?()
                } else if msg == "reconnecting" {
                    connectionState = .reconnecting
                }
            case "error":
                statusMessage = json["message"] as? String ?? "未知错误"
            default:
                break
            }
        case .data:
            break // We only use text frames
        @unknown default:
            break
        }
    }

    private func handleDisconnect(error: Error) {
        connectionState = .disconnected
        statusMessage = "连接断开"
        if autoReconnect {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
                self?.connectionState = .disconnected
                self?.connect()
            }
        }
    }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add SimoneApp/Simone/Network/LyriaClient.swift
git commit -m "feat: add LyriaClient WebSocket with auto-reconnect"
```

---

### Task 5: Audio — AudioBufferQueue

**Files:**
- Create: `SimoneApp/Simone/Audio/AudioBufferQueue.swift`
- Create: `SimoneApp/SimoneTests/AudioBufferQueueTests.swift`

- [ ] **Step 1: Write the test**

```swift
// SimoneApp/SimoneTests/AudioBufferQueueTests.swift
import Testing
@testable import Simone

@Test func enqueueAndDequeue() {
    let queue = AudioBufferQueue()
    let chunk = Data([0x00, 0x01, 0x02, 0x03])
    queue.enqueue(chunk)
    #expect(queue.count == 1)
    let result = queue.dequeue()
    #expect(result == chunk)
    #expect(queue.count == 0)
}

@Test func dequeueEmptyReturnsNil() {
    let queue = AudioBufferQueue()
    #expect(queue.dequeue() == nil)
}

@Test func drainAllReturnsAllChunks() {
    let queue = AudioBufferQueue()
    queue.enqueue(Data([0x01]))
    queue.enqueue(Data([0x02]))
    queue.enqueue(Data([0x03]))
    let all = queue.drainAll()
    #expect(all.count == 3)
    #expect(queue.count == 0)
}

@Test func clearRemovesAll() {
    let queue = AudioBufferQueue()
    queue.enqueue(Data([0x01]))
    queue.enqueue(Data([0x02]))
    queue.clear()
    #expect(queue.count == 0)
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `xcodebuild test -scheme Simone -destination 'platform=macOS'`
Expected: FAIL — `AudioBufferQueue` not defined

- [ ] **Step 3: Write AudioBufferQueue**

```swift
// SimoneApp/Simone/Audio/AudioBufferQueue.swift
import Foundation

final class AudioBufferQueue: @unchecked Sendable {
    private var queue: [Data] = []
    private let lock = NSLock()

    var count: Int {
        lock.lock()
        defer { lock.unlock() }
        return queue.count
    }

    func enqueue(_ chunk: Data) {
        lock.lock()
        defer { lock.unlock() }
        queue.append(chunk)
    }

    func dequeue() -> Data? {
        lock.lock()
        defer { lock.unlock() }
        return queue.isEmpty ? nil : queue.removeFirst()
    }

    func drainAll() -> [Data] {
        lock.lock()
        defer { lock.unlock() }
        let all = queue
        queue.removeAll()
        return all
    }

    func clear() {
        lock.lock()
        defer { lock.unlock() }
        queue.removeAll()
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `xcodebuild test -scheme Simone -destination 'platform=macOS'`
Expected: All 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add SimoneApp/Simone/Audio/AudioBufferQueue.swift SimoneApp/SimoneTests/AudioBufferQueueTests.swift
git commit -m "feat: add thread-safe AudioBufferQueue"
```

---

### Task 6: Audio — AudioEngine (PCM Playback + FFT)

**Files:**
- Create: `SimoneApp/Simone/Audio/AudioEngine.swift`

- [ ] **Step 1: Create AudioEngine**

```swift
// SimoneApp/Simone/Audio/AudioEngine.swift
import AVFoundation
import Accelerate

@Observable
final class AudioEngine {
    // FFT output — visualizers read this array (128 bins, 0.0-1.0 normalized)
    var spectrumData: [Float] = Array(repeating: 0, count: 128)
    var isPlaying = false
    var volume: Float = 0.65 {
        didSet { playerNode?.volume = volume }
    }

    private let sampleRate: Double = 48000
    private let channels: AVAudioChannelCount = 2
    private let bufferMin = 3

    private var engine: AVAudioEngine?
    private var playerNode: AVAudioPlayerNode?
    private let bufferQueue = AudioBufferQueue()
    private var chunkCount = 0
    private var isDraining = false

    // FFT
    private let fftSize = 256
    private var fftSetup: vDSP_DFT_Setup?
    private var analyserBuffer: [Float] = []
    private let analyserLock = NSLock()

    init() {
        fftSetup = vDSP_DFT_zop_CreateSetup(nil, vDSP_Length(fftSize), .FORWARD)
    }

    deinit {
        stop()
        if let setup = fftSetup {
            vDSP_DFT_DestroySetup(setup)
        }
    }

    func start() {
        guard engine == nil else { return }

        #if os(iOS)
        let audioSession = AVAudioSession.sharedInstance()
        try? audioSession.setCategory(.playback, mode: .default)
        try? audioSession.setActive(true)
        #endif

        let engine = AVAudioEngine()
        let player = AVAudioPlayerNode()
        player.volume = volume

        engine.attach(player)

        let format = AVAudioFormat(
            standardFormatWithSampleRate: sampleRate,
            channels: channels
        )!

        engine.connect(player, to: engine.mainMixerNode, format: format)

        // Install tap on main mixer for FFT analysis
        let fftSize = self.fftSize
        engine.mainMixerNode.installTap(
            onBus: 0,
            bufferSize: AVAudioFrameCount(fftSize),
            format: nil
        ) { [weak self] buffer, _ in
            self?.processFFT(buffer: buffer)
        }

        do {
            try engine.start()
            player.play()
            self.engine = engine
            self.playerNode = player
            isPlaying = true
        } catch {
            print("AudioEngine start failed: \(error)")
        }
    }

    func stop() {
        playerNode?.stop()
        engine?.mainMixerNode.removeTap(onBus: 0)
        engine?.stop()
        engine = nil
        playerNode = nil
        isPlaying = false
        bufferQueue.clear()
        chunkCount = 0
        spectrumData = Array(repeating: 0, count: 128)
    }

    func pause() {
        playerNode?.pause()
        isPlaying = false
    }

    func resume() {
        playerNode?.play()
        isPlaying = true
    }

    /// Called by LyriaClient when a new PCM chunk arrives.
    /// Data is raw PCM16 stereo 48kHz (already base64-decoded).
    func handleAudioChunk(_ data: Data) {
        bufferQueue.enqueue(data)
        chunkCount += 1

        if !isDraining && bufferQueue.count >= bufferMin {
            drainQueue()
        } else if isDraining {
            drainQueue()
        }
    }

    func clearQueue() {
        bufferQueue.clear()
        isDraining = false
    }

    // MARK: - Private

    private func drainQueue() {
        guard let player = playerNode, let engine, engine.isRunning else { return }
        isDraining = true

        let format = AVAudioFormat(
            standardFormatWithSampleRate: sampleRate,
            channels: channels
        )!

        let chunks = bufferQueue.drainAll()
        for chunk in chunks {
            let numBytes = chunk.count - (chunk.count % (Int(channels) * 2))
            guard numBytes > 0 else { continue }

            let numSamples = numBytes / (Int(channels) * 2)
            guard let pcmBuffer = AVAudioPCMBuffer(
                pcmFormat: format,
                frameCapacity: AVAudioFrameCount(numSamples)
            ) else { continue }

            pcmBuffer.frameLength = AVAudioFrameCount(numSamples)

            chunk.withUnsafeBytes { rawPtr in
                let int16Ptr = rawPtr.bindMemory(to: Int16.self)
                for ch in 0..<Int(channels) {
                    guard let channelData = pcmBuffer.floatChannelData?[ch] else { continue }
                    for i in 0..<numSamples {
                        channelData[i] = Float(int16Ptr[i * Int(channels) + ch]) / 32768.0
                    }
                }
            }

            // Also feed analyser buffer for FFT (use left channel)
            if let leftChannel = pcmBuffer.floatChannelData?[0] {
                analyserLock.lock()
                analyserBuffer.append(contentsOf: UnsafeBufferPointer(
                    start: leftChannel,
                    count: numSamples
                ))
                // Keep only last fftSize samples
                if analyserBuffer.count > fftSize * 2 {
                    analyserBuffer.removeFirst(analyserBuffer.count - fftSize * 2)
                }
                analyserLock.unlock()
            }

            player.scheduleBuffer(pcmBuffer)
        }
    }

    private func processFFT(buffer: AVAudioPCMBuffer) {
        guard let setup = fftSetup,
              let channelData = buffer.floatChannelData?[0] else { return }

        let frameCount = Int(buffer.frameLength)
        guard frameCount >= fftSize else { return }

        var realIn = [Float](repeating: 0, count: fftSize)
        var imagIn = [Float](repeating: 0, count: fftSize)
        var realOut = [Float](repeating: 0, count: fftSize)
        var imagOut = [Float](repeating: 0, count: fftSize)

        // Copy samples and apply Hann window
        for i in 0..<fftSize {
            let window = 0.5 * (1.0 - cos(2.0 * .pi * Float(i) / Float(fftSize)))
            realIn[i] = channelData[i] * window
        }

        vDSP_DFT_Execute(setup, &realIn, &imagIn, &realOut, &imagOut)

        // Compute magnitudes for first half (128 bins)
        let binCount = fftSize / 2
        var magnitudes = [Float](repeating: 0, count: binCount)
        for i in 0..<binCount {
            magnitudes[i] = sqrt(realOut[i] * realOut[i] + imagOut[i] * imagOut[i])
        }

        // Normalize to 0-1 range with log scale
        var maxMag: Float = 0
        vDSP_maxv(magnitudes, 1, &maxMag, vDSP_Length(binCount))
        if maxMag > 0 {
            var scale = 1.0 / maxMag
            vDSP_vsmul(magnitudes, 1, &scale, &magnitudes, 1, vDSP_Length(binCount))
        }

        // Smooth with previous frame
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            for i in 0..<binCount {
                self.spectrumData[i] = self.spectrumData[i] * 0.7 + magnitudes[i] * 0.3
            }
        }
    }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add SimoneApp/Simone/Audio/AudioEngine.swift
git commit -m "feat: add AudioEngine with PCM16 playback and vDSP FFT"
```

---

### Task 7: AppState — Observable State

**Files:**
- Create: `SimoneApp/Simone/Models/AppState.swift`

- [ ] **Step 1: Create AppState**

```swift
// SimoneApp/Simone/Models/AppState.swift
import Foundation

@Observable
final class AppState {
    // Selection
    var selectedScene: Scene? = nil
    var selectedStyle: MusicStyle? = nil
    var selectedVisualizer: VisualizerStyle = .aurora

    // Playback
    var isGenerating = false
    var statusMessage = ""

    // Auto-Evolve
    enum EvolveMode: String, CaseIterable {
        case locked = "锁定"
        case auto15 = "15 min"
        case auto30 = "30 min"
        case auto60 = "60 min"
    }
    var evolveMode: EvolveMode = .locked

    // Config
    var temperature: Float = 1.1
    var guidance: Float = 4.0

    // Details card
    var isDetailsExpanded = false

    // Dependencies
    let audioEngine = AudioEngine()
    let lyriaClient = LyriaClient()

    init() {
        lyriaClient.onAudioChunk = { [weak self] data in
            self?.audioEngine.handleAudioChunk(data)
        }
        lyriaClient.onConnected = { [weak self] in
            self?.sendCurrentPrompts()
        }
    }

    // MARK: - Actions

    func selectScene(_ scene: Scene) {
        if selectedScene == scene {
            selectedScene = nil
        } else {
            selectedScene = scene
        }
        applySelection()
    }

    func selectStyle(_ style: MusicStyle) {
        if selectedStyle == style {
            selectedStyle = nil
        } else {
            selectedStyle = style
        }
        applySelection()
    }

    func togglePlayPause() {
        if audioEngine.isPlaying {
            lyriaClient.sendCommand("pause")
            audioEngine.pause()
        } else if lyriaClient.connectionState == .connected {
            lyriaClient.sendCommand("play")
            audioEngine.resume()
        } else {
            audioEngine.start()
            lyriaClient.connect()
            isGenerating = true
        }
    }

    func shuffle() {
        // "换换口味" — resend current prompts to trigger new generation
        sendCurrentPrompts()
    }

    // MARK: - Private

    private func applySelection() {
        let prompts = PromptBuilder.build(scene: selectedScene, style: selectedStyle)
        guard !prompts.isEmpty else { return }

        if lyriaClient.connectionState == .disconnected {
            audioEngine.start()
            lyriaClient.connect()
            isGenerating = true
        } else {
            audioEngine.clearQueue()
            lyriaClient.sendPrompts(prompts)
        }
    }

    private func sendCurrentPrompts() {
        let prompts = PromptBuilder.build(scene: selectedScene, style: selectedStyle)
        guard !prompts.isEmpty else { return }
        lyriaClient.sendPrompts(prompts)
        lyriaClient.sendCommand("play")

        let config: [String: Any] = [
            "temperature": temperature,
            "guidance": guidance
        ]
        lyriaClient.sendConfig(config)
    }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add SimoneApp/Simone/Models/AppState.swift
git commit -m "feat: add AppState with scene/style selection and playback control"
```

---

### Task 8: Views — ScenePillsView

**Files:**
- Create: `SimoneApp/Simone/Views/ScenePillsView.swift`

- [ ] **Step 1: Create ScenePillsView**

```swift
// SimoneApp/Simone/Views/ScenePillsView.swift
import SwiftUI

struct PillButton: View {
    let label: String
    let isActive: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 12, weight: .medium))
                .tracking(0.3)
                .padding(.horizontal, 16)
                .padding(.vertical, 6)
                .background(
                    isActive
                        ? Color("MorandiRose").opacity(0.2)
                        : Color.white.opacity(0.04)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(
                            isActive
                                ? Color("MorandiRose").opacity(0.4)
                                : Color.white.opacity(0.08),
                            lineWidth: 1
                        )
                )
                .clipShape(RoundedRectangle(cornerRadius: 20))
                .foregroundStyle(isActive ? Color("MorandiRose") : Color.white.opacity(0.8))
        }
        .buttonStyle(.plain)
        .animation(.spring(response: 0.4, dampingFraction: 0.7), value: isActive)
    }
}

struct ScenePillsView: View {
    @Bindable var state: AppState

    var body: some View {
        VStack(spacing: 10) {
            // Row 1: Scenes
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(Scene.allCases) { scene in
                        PillButton(
                            label: scene.label,
                            isActive: state.selectedScene == scene
                        ) {
                            state.selectScene(scene)
                        }
                    }
                }
                .padding(.horizontal, 4)
            }

            // Row 2: Styles
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(MusicStyle.allCases) { style in
                        PillButton(
                            label: style.label,
                            isActive: state.selectedStyle == style
                        ) {
                            state.selectStyle(style)
                        }
                    }
                }
                .padding(.horizontal, 4)
            }
        }
        .padding(20)
        .background(.ultraThinMaterial)
    }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add SimoneApp/Simone/Views/ScenePillsView.swift
git commit -m "feat: add ScenePillsView with two-row mixable pills"
```

---

### Task 9: Views — Spectrum Visualizers (5 styles)

**Files:**
- Create: `SimoneApp/Simone/Views/Visualizers/SpectrumDataProvider.swift`
- Create: `SimoneApp/Simone/Views/Visualizers/FountainView.swift`
- Create: `SimoneApp/Simone/Views/Visualizers/AuroraView.swift`
- Create: `SimoneApp/Simone/Views/Visualizers/VinylView.swift`
- Create: `SimoneApp/Simone/Views/Visualizers/SilkWaveView.swift`
- Create: `SimoneApp/Simone/Views/Visualizers/ConstellationView.swift`

- [ ] **Step 1: Create SpectrumDataProvider protocol**

```swift
// SimoneApp/Simone/Views/Visualizers/SpectrumDataProvider.swift
import SwiftUI

/// Morandi color palette for spectrum bars
enum MorandiPalette {
    static let rose = Color(red: 196/255, green: 166/255, blue: 157/255)
    static let mauve = Color(red: 181/255, green: 160/255, blue: 181/255)
    static let sage = Color(red: 163/255, green: 171/255, blue: 143/255)
    static let blue = Color(red: 142/255, green: 154/255, blue: 175/255)
    static let sand = Color(red: 201/255, green: 191/255, blue: 170/255)

    static let all: [Color] = [rose, mauve, sage, blue, sand]

    static func color(at index: Int) -> Color {
        all[index % all.count]
    }
}
```

- [ ] **Step 2: Create FountainView**

```swift
// SimoneApp/Simone/Views/Visualizers/FountainView.swift
import SwiftUI

struct FountainView: View {
    let spectrumData: [Float]
    private let barCount = 24

    var body: some View {
        VStack(spacing: 0) {
            // Arch top
            RoundedRectangle(cornerRadius: 140)
                .stroke(Color.white.opacity(0.06), lineWidth: 1)
                .frame(height: 40)
                .mask(
                    VStack(spacing: 0) {
                        Color.black
                        Color.clear.frame(height: 20)
                    }
                )
                .background(
                    LinearGradient(
                        colors: [Color.white.opacity(0.04), .clear],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 140))
                    .mask(
                        VStack(spacing: 0) {
                            Color.black
                            Color.clear.frame(height: 20)
                        }
                    )
                )

            // Bars
            HStack(alignment: .bottom, spacing: 5) {
                ForEach(0..<barCount, id: \.self) { i in
                    let bin = i * (spectrumData.count / barCount)
                    let value = bin < spectrumData.count ? CGFloat(spectrumData[bin]) : 0
                    let height = max(8, value * 130)
                    let color = MorandiPalette.color(at: i)

                    RoundedRectangle(cornerRadius: 3)
                        .fill(
                            LinearGradient(
                                colors: [color.opacity(0.9), color.opacity(0.3)],
                                startPoint: .bottom,
                                endPoint: .top
                            )
                        )
                        .frame(width: 6, height: height)
                        .shadow(color: color.opacity(0.4), radius: 4, y: -2)
                }
            }
            .frame(height: 140, alignment: .bottom)
            .overlay(
                // Side borders
                HStack {
                    Rectangle().fill(Color.white.opacity(0.06)).frame(width: 1)
                    Spacer()
                    Rectangle().fill(Color.white.opacity(0.06)).frame(width: 1)
                }
            )

            // Pool line
            LinearGradient(
                colors: [.clear, MorandiPalette.rose.opacity(0.2), MorandiPalette.mauve.opacity(0.2), MorandiPalette.rose.opacity(0.2), .clear],
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(height: 1)

            // Reflection
            HStack(alignment: .top, spacing: 5) {
                ForEach(0..<barCount, id: \.self) { i in
                    let bin = i * (spectrumData.count / barCount)
                    let value = bin < spectrumData.count ? CGFloat(spectrumData[bin]) : 0
                    let height = max(4, value * 78)
                    let color = MorandiPalette.color(at: i)

                    RoundedRectangle(cornerRadius: 3)
                        .fill(color.opacity(0.8))
                        .frame(width: 6, height: height)
                }
            }
            .frame(height: 28, alignment: .top)
            .scaleEffect(y: -1)
            .opacity(0.06)
            .mask(
                LinearGradient(
                    colors: [.clear, .white],
                    startPoint: .bottom,
                    endPoint: .top
                )
            )
        }
        .padding(.horizontal, 16)
    }
}
```

- [ ] **Step 3: Create AuroraView (default)**

```swift
// SimoneApp/Simone/Views/Visualizers/AuroraView.swift
import SwiftUI

struct AuroraView: View {
    let spectrumData: [Float]

    var body: some View {
        Canvas { context, size in
            let w = size.width
            let h = size.height
            let layerCount = 4
            let colors: [Color] = [
                MorandiPalette.rose,
                MorandiPalette.mauve,
                MorandiPalette.sage,
                MorandiPalette.blue,
            ]

            for layer in 0..<layerCount {
                let offset = Float(layer) * 0.15
                var path = Path()
                path.move(to: CGPoint(x: 0, y: h))

                let points = 32
                for i in 0...points {
                    let x = w * CGFloat(i) / CGFloat(points)
                    let bin = (i * spectrumData.count / points)
                        .clamped(to: 0..<spectrumData.count)
                    let value = spectrumData[bin]
                    let baseY = h * (0.6 - CGFloat(layer) * 0.08)
                    let amplitude = h * 0.35 * CGFloat(value + offset * 0.5)
                    let y = baseY - amplitude

                    if i == 0 {
                        path.addLine(to: CGPoint(x: x, y: y))
                    } else {
                        let prevX = w * CGFloat(i - 1) / CGFloat(points)
                        let cx = (prevX + x) / 2
                        path.addQuadCurve(
                            to: CGPoint(x: x, y: y),
                            control: CGPoint(x: cx, y: y - CGFloat(value) * 20)
                        )
                    }
                }

                path.addLine(to: CGPoint(x: w, y: h))
                path.closeSubpath()

                context.opacity = 0.25 - Double(layer) * 0.04
                context.fill(
                    path,
                    with: .linearGradient(
                        Gradient(colors: [
                            colors[layer].opacity(0.8),
                            colors[layer].opacity(0.1)
                        ]),
                        startPoint: CGPoint(x: w/2, y: 0),
                        endPoint: CGPoint(x: w/2, y: h)
                    )
                )
            }
        }
        .frame(height: 180)
    }
}

private extension Int {
    func clamped(to range: Range<Int>) -> Int {
        Swift.max(range.lowerBound, Swift.min(self, range.upperBound - 1))
    }
}
```

- [ ] **Step 4: Create VinylView**

```swift
// SimoneApp/Simone/Views/Visualizers/VinylView.swift
import SwiftUI

struct VinylView: View {
    let spectrumData: [Float]
    @State private var rotation: Double = 0

    var body: some View {
        ZStack {
            // Rotating disc
            Circle()
                .fill(
                    RadialGradient(
                        colors: [Color.white.opacity(0.08), Color.white.opacity(0.02)],
                        center: .center,
                        startRadius: 20,
                        endRadius: 60
                    )
                )
                .frame(width: 120, height: 120)
                .overlay(
                    Circle()
                        .stroke(Color.white.opacity(0.1), lineWidth: 0.5)
                )
                .rotationEffect(.degrees(rotation))

            // Center label
            Circle()
                .fill(MorandiPalette.rose.opacity(0.3))
                .frame(width: 30, height: 30)
                .rotationEffect(.degrees(rotation))

            // Radial spectrum bars
            Canvas { context, size in
                let center = CGPoint(x: size.width/2, y: size.height/2)
                let barCount = 24
                let innerRadius: CGFloat = 65
                let maxBarLength: CGFloat = 40

                for i in 0..<barCount {
                    let angle = (Double(i) / Double(barCount)) * 2 * .pi - .pi / 2
                    let bin = (i * spectrumData.count / barCount)
                        .clamped(to: 0..<spectrumData.count)
                    let value = CGFloat(spectrumData[bin])
                    let barLength = max(4, value * maxBarLength)

                    let x1 = center.x + innerRadius * cos(angle)
                    let y1 = center.y + innerRadius * sin(angle)
                    let x2 = center.x + (innerRadius + barLength) * cos(angle)
                    let y2 = center.y + (innerRadius + barLength) * sin(angle)

                    var path = Path()
                    path.move(to: CGPoint(x: x1, y: y1))
                    path.addLine(to: CGPoint(x: x2, y: y2))

                    let color = MorandiPalette.color(at: i)
                    context.stroke(path, with: .color(color.opacity(0.8)), lineWidth: 3)
                }
            }
        }
        .frame(height: 180)
        .onAppear {
            withAnimation(.linear(duration: 8).repeatForever(autoreverses: false)) {
                rotation = 360
            }
        }
    }
}

private extension Int {
    func clamped(to range: Range<Int>) -> Int {
        Swift.max(range.lowerBound, Swift.min(self, range.upperBound - 1))
    }
}
```

- [ ] **Step 5: Create SilkWaveView**

```swift
// SimoneApp/Simone/Views/Visualizers/SilkWaveView.swift
import SwiftUI

struct SilkWaveView: View {
    let spectrumData: [Float]

    var body: some View {
        Canvas { context, size in
            let w = size.width
            let h = size.height
            let waveCount = 5
            let colors: [Color] = [
                MorandiPalette.rose,
                MorandiPalette.mauve,
                MorandiPalette.sage,
                MorandiPalette.blue,
                MorandiPalette.sand,
            ]

            for wave in 0..<waveCount {
                var path = Path()
                let baseY = h * (0.3 + CGFloat(wave) * 0.12)
                let phaseOffset = Float(wave) * 0.2

                path.move(to: CGPoint(x: 0, y: baseY))

                let segments = 48
                for i in 0...segments {
                    let x = w * CGFloat(i) / CGFloat(segments)
                    let bin = (i * spectrumData.count / segments)
                        .clamped(to: 0..<spectrumData.count)
                    let value = spectrumData[bin] + phaseOffset * 0.3
                    let amplitude = h * 0.15 * CGFloat(value)
                    let y = baseY - amplitude

                    if i == 0 {
                        path.addLine(to: CGPoint(x: x, y: y))
                    } else {
                        let prevX = w * CGFloat(i - 1) / CGFloat(segments)
                        path.addQuadCurve(
                            to: CGPoint(x: x, y: y),
                            control: CGPoint(x: (prevX + x) / 2, y: y + 5)
                        )
                    }
                }

                context.stroke(
                    path,
                    with: .color(colors[wave].opacity(0.5)),
                    lineWidth: 2
                )
            }
        }
        .frame(height: 180)
    }
}

private extension Int {
    func clamped(to range: Range<Int>) -> Int {
        Swift.max(range.lowerBound, Swift.min(self, range.upperBound - 1))
    }
}
```

- [ ] **Step 6: Create ConstellationView**

```swift
// SimoneApp/Simone/Views/Visualizers/ConstellationView.swift
import SwiftUI

struct ConstellationView: View {
    let spectrumData: [Float]

    var body: some View {
        Canvas { context, size in
            let w = size.width
            let h = size.height
            let starCount = 24

            struct Star {
                let position: CGPoint
                let brightness: CGFloat
                let color: Color
            }

            var stars: [Star] = []

            for i in 0..<starCount {
                let bin = (i * spectrumData.count / starCount)
                    .clamped(to: 0..<spectrumData.count)
                let value = CGFloat(spectrumData[bin])

                // Distribute stars in a pattern
                let angle = Double(i) / Double(starCount) * 2 * .pi
                let radius = w * 0.3 * (0.5 + value * 0.5)
                let x = w/2 + radius * cos(angle)
                let y = h/2 + radius * sin(angle) * 0.6

                let star = Star(
                    position: CGPoint(x: x, y: y),
                    brightness: value,
                    color: MorandiPalette.color(at: i)
                )
                stars.append(star)
            }

            // Draw connections between nearby stars
            for i in 0..<stars.count {
                for j in (i+1)..<stars.count {
                    let dist = hypot(
                        stars[i].position.x - stars[j].position.x,
                        stars[i].position.y - stars[j].position.y
                    )
                    if dist < w * 0.25 {
                        var line = Path()
                        line.move(to: stars[i].position)
                        line.addLine(to: stars[j].position)
                        let opacity = (1 - dist / (w * 0.25)) * 0.15
                        context.stroke(
                            line,
                            with: .color(.white.opacity(opacity)),
                            lineWidth: 0.5
                        )
                    }
                }
            }

            // Draw stars
            for star in stars {
                let size = 2 + star.brightness * 6
                let rect = CGRect(
                    x: star.position.x - size/2,
                    y: star.position.y - size/2,
                    width: size,
                    height: size
                )
                context.fill(
                    Path(ellipseIn: rect),
                    with: .color(star.color.opacity(0.4 + Double(star.brightness) * 0.6))
                )

                // Glow
                let glowSize = size * 3
                let glowRect = CGRect(
                    x: star.position.x - glowSize/2,
                    y: star.position.y - glowSize/2,
                    width: glowSize,
                    height: glowSize
                )
                context.fill(
                    Path(ellipseIn: glowRect),
                    with: .color(star.color.opacity(Double(star.brightness) * 0.15))
                )
            }
        }
        .frame(height: 180)
    }
}

private extension Int {
    func clamped(to range: Range<Int>) -> Int {
        Swift.max(range.lowerBound, Swift.min(self, range.upperBound - 1))
    }
}
```

- [ ] **Step 7: Verify all compile**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 8: Commit**

```bash
git add SimoneApp/Simone/Views/Visualizers/
git commit -m "feat: add 5 spectrum visualizer styles (Fountain, Aurora, Vinyl, SilkWave, Constellation)"
```

---

### Task 10: Views — SpectrumCarouselView (Swipeable Container)

**Files:**
- Create: `SimoneApp/Simone/Views/SpectrumCarouselView.swift`

- [ ] **Step 1: Create SpectrumCarouselView with spring physics**

```swift
// SimoneApp/Simone/Views/SpectrumCarouselView.swift
import SwiftUI

struct SpectrumCarouselView: View {
    @Bindable var state: AppState
    let spectrumData: [Float]

    @State private var dragOffset: CGFloat = 0
    @State private var currentIndex: Int = 1 // Aurora is default (index 1)

    private let styles = VisualizerStyle.allCases

    var body: some View {
        VStack(spacing: 12) {
            GeometryReader { geo in
                let width = geo.size.width

                HStack(spacing: 0) {
                    ForEach(Array(styles.enumerated()), id: \.element.id) { index, style in
                        visualizerView(for: style)
                            .frame(width: width)
                    }
                }
                .offset(x: -CGFloat(currentIndex) * width + dragOffset)
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            dragOffset = value.translation.width
                        }
                        .onEnded { value in
                            let threshold = width * 0.25
                            var newIndex = currentIndex

                            if value.translation.width < -threshold {
                                newIndex = min(currentIndex + 1, styles.count - 1)
                            } else if value.translation.width > threshold {
                                newIndex = max(currentIndex - 1, 0)
                            }

                            withAnimation(.spring(response: 0.45, dampingFraction: 0.75)) {
                                currentIndex = newIndex
                                dragOffset = 0
                                state.selectedVisualizer = styles[newIndex]
                            }
                        }
                )
                .animation(.spring(response: 0.3, dampingFraction: 0.8), value: dragOffset)
            }
            .frame(height: 180)
            .clipped()

            // Dot indicators
            HStack(spacing: 6) {
                ForEach(Array(styles.enumerated()), id: \.element.id) { index, style in
                    Circle()
                        .fill(
                            index == currentIndex
                                ? MorandiPalette.rose
                                : Color.white.opacity(0.2)
                        )
                        .frame(width: 6, height: 6)
                        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: currentIndex)
                }
            }
        }
    }

    @ViewBuilder
    private func visualizerView(for style: VisualizerStyle) -> some View {
        switch style {
        case .fountain:
            FountainView(spectrumData: spectrumData)
        case .aurora:
            AuroraView(spectrumData: spectrumData)
        case .vinyl:
            VinylView(spectrumData: spectrumData)
        case .silkWave:
            SilkWaveView(spectrumData: spectrumData)
        case .constellation:
            ConstellationView(spectrumData: spectrumData)
        }
    }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add SimoneApp/Simone/Views/SpectrumCarouselView.swift
git commit -m "feat: add SpectrumCarouselView with spring-damped swipe physics"
```

---

### Task 11: Views — ExpandableCardView

**Files:**
- Create: `SimoneApp/Simone/Views/ExpandableCardView.swift`

- [ ] **Step 1: Create ExpandableCardView**

```swift
// SimoneApp/Simone/Views/ExpandableCardView.swift
import SwiftUI

struct ExpandableCardView: View {
    @Bindable var state: AppState

    var body: some View {
        VStack(spacing: 0) {
            // Toggle button
            Button {
                withAnimation(.spring(response: 0.5, dampingFraction: 0.75)) {
                    state.isDetailsExpanded.toggle()
                }
            } label: {
                Text(state.isDetailsExpanded ? "hide" : "details")
                    .font(.system(size: 10))
                    .tracking(1)
                    .textCase(.uppercase)
                    .foregroundStyle(.white.opacity(0.25))
            }
            .buttonStyle(.plain)
            .padding(.vertical, 8)

            // Expandable content
            if state.isDetailsExpanded {
                VStack(spacing: 16) {
                    // Volume slider
                    HStack(spacing: 12) {
                        Image(systemName: "speaker.fill")
                            .font(.system(size: 12))
                            .foregroundStyle(.white.opacity(0.4))

                        Slider(value: Binding(
                            get: { state.audioEngine.volume },
                            set: { state.audioEngine.volume = $0 }
                        ), in: 0...1)
                        .tint(MorandiPalette.rose)

                        Image(systemName: "speaker.wave.3.fill")
                            .font(.system(size: 12))
                            .foregroundStyle(.white.opacity(0.4))
                    }

                    // Temperature / Guidance
                    HStack {
                        Text("Temperature: \(String(format: "%.1f", state.temperature))")
                        Spacer()
                        Text("Guidance: \(String(format: "%.1f", state.guidance))")
                    }
                    .font(.system(size: 10))
                    .tracking(1)
                    .textCase(.uppercase)
                    .foregroundStyle(.white.opacity(0.2))

                    // Auto-Evolve picker
                    HStack(spacing: 8) {
                        ForEach(AppState.EvolveMode.allCases, id: \.rawValue) { mode in
                            Button {
                                state.evolveMode = mode
                            } label: {
                                Text(mode.rawValue)
                                    .font(.system(size: 10, weight: .medium))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .background(
                                        state.evolveMode == mode
                                            ? MorandiPalette.mauve.opacity(0.2)
                                            : Color.white.opacity(0.04)
                                    )
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(
                                        state.evolveMode == mode
                                            ? MorandiPalette.mauve
                                            : .white.opacity(0.5)
                                    )
                            }
                            .buttonStyle(.plain)
                        }

                        Spacer()

                        // Shuffle button ("换换口味")
                        Button {
                            state.shuffle()
                        } label: {
                            Image(systemName: "shuffle")
                                .font(.system(size: 12))
                                .padding(8)
                                .background(MorandiPalette.sand.opacity(0.15))
                                .clipShape(Circle())
                                .foregroundStyle(MorandiPalette.sand)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
    }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add SimoneApp/Simone/Views/ExpandableCardView.swift
git commit -m "feat: add ExpandableCardView with volume, params, Auto-Evolve controls"
```

---

### Task 12: Views — PlayControlView

**Files:**
- Create: `SimoneApp/Simone/Views/PlayControlView.swift`

- [ ] **Step 1: Create PlayControlView**

```swift
// SimoneApp/Simone/Views/PlayControlView.swift
import SwiftUI

struct PlayControlView: View {
    @Bindable var state: AppState

    private var sceneName: String {
        if let scene = state.selectedScene, let style = state.selectedStyle {
            return "\(scene.label) × \(style.label)"
        } else if let scene = state.selectedScene {
            return scene.label
        } else if let style = state.selectedStyle {
            return style.label
        }
        return "Simone"
    }

    private var sceneDesc: String {
        if let style = state.selectedStyle {
            return style.prompt.prefix(30) + "..."
        } else if let scene = state.selectedScene {
            return scene.prompt.prefix(30) + "..."
        }
        return "选一个场景或风格开始"
    }

    var body: some View {
        HStack(spacing: 14) {
            // Play/Pause button
            Button {
                state.togglePlayPause()
            } label: {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [MorandiPalette.rose, MorandiPalette.mauve],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 44, height: 44)
                        .shadow(color: MorandiPalette.rose.opacity(0.3), radius: 8, y: 4)

                    Image(systemName: state.audioEngine.isPlaying ? "pause.fill" : "play.fill")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(Color(red: 0.23, green: 0.22, blue: 0.21))
                }
            }
            .buttonStyle(.plain)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: state.audioEngine.isPlaying)

            // Scene info
            VStack(alignment: .leading, spacing: 2) {
                Text(sceneName)
                    .font(.system(size: 15, weight: .medium))
                    .tracking(0.5)
                    .foregroundStyle(Color(white: 0.88))

                Text(sceneDesc)
                    .font(.system(size: 11))
                    .foregroundStyle(.white.opacity(0.4))
                    .tracking(0.3)
            }

            Spacer()

            // Music note decoration
            Text("♬")
                .font(.system(size: 20))
                .foregroundStyle(.white.opacity(0.15))
        }
        .padding(16)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.08), lineWidth: 1)
        )
        .padding(.horizontal, 20)
        .padding(.bottom, 20)
    }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add SimoneApp/Simone/Views/PlayControlView.swift
git commit -m "feat: add PlayControlView with gradient play button and scene info"
```

---

### Task 13: Views — ContentView (Main Layout)

**Files:**
- Create: `SimoneApp/Simone/Views/ContentView.swift`

- [ ] **Step 1: Create ContentView**

```swift
// SimoneApp/Simone/Views/ContentView.swift
import SwiftUI

struct ContentView: View {
    @State var state = AppState()

    var body: some View {
        ZStack {
            // Background
            Color(red: 0.165, green: 0.165, blue: 0.18)
                .ignoresSafeArea()

            // Ambient glow
            RadialGradient(
                colors: [MorandiPalette.rose.opacity(0.06), .clear],
                center: .top,
                startRadius: 0,
                endRadius: 300
            )
            .ignoresSafeArea()

            // Noise texture overlay
            Rectangle()
                .fill(.ultraThinMaterial.opacity(0.02))
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // 1. Scene + Style pills
                ScenePillsView(state: state)

                // 2. Spectrum visualizer carousel
                SpectrumCarouselView(
                    state: state,
                    spectrumData: state.audioEngine.spectrumData
                )
                .padding(.top, 8)

                // 3. Expandable details card
                ExpandableCardView(state: state)

                // 4. Play control panel
                PlayControlView(state: state)
            }
        }
        .frame(width: 340)
        .frame(minHeight: 420)
    }
}

#Preview {
    ContentView()
}
```

- [ ] **Step 2: Verify it compiles and preview renders**

Run: `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add SimoneApp/Simone/Views/ContentView.swift
git commit -m "feat: add ContentView composing all UI components"
```

---

### Task 14: App Entry — SimoneApp (macOS MenuBarExtra + iOS WindowGroup)

**Files:**
- Create: `SimoneApp/Simone/SimoneApp.swift`

- [ ] **Step 1: Create SimoneApp with platform-specific entry**

```swift
// SimoneApp/Simone/SimoneApp.swift
import SwiftUI

@main
struct SimoneApp: App {
    var body: some Scene {
        #if os(macOS)
        MenuBarExtra {
            ContentView()
        } label: {
            Label("Simone", systemImage: "music.note")
        }
        .menuBarExtraStyle(.window)
        #else
        WindowGroup {
            ContentView()
                .preferredColorScheme(.dark)
        }
        #endif
    }
}
```

- [ ] **Step 2: For iOS, add Info.plist background audio capability**

Add to iOS target's Info.plist:
```xml
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
</array>
```

- [ ] **Step 3: Build for both platforms**

Run (macOS): `xcodebuild build -scheme Simone -destination 'platform=macOS'`
Run (iOS): `xcodebuild build -scheme Simone -destination 'generic/platform=iOS'`
Expected: Both BUILD SUCCEEDED

- [ ] **Step 4: Commit**

```bash
git add SimoneApp/Simone/SimoneApp.swift
git commit -m "feat: add SimoneApp entry with macOS MenuBarExtra and iOS WindowGroup"
```

---

### Task 15: Integration Test — End to End

**Files:**
- No new files

- [ ] **Step 1: Start Python bridge server**

```bash
cd /Users/oldfisherman/Desktop/simone
python -u local_server.py
```

Expected: `Server started on ws://localhost:8765/ws`

- [ ] **Step 2: Run macOS app from Xcode**

1. Open `SimoneApp/Simone.xcodeproj` in Xcode
2. Select macOS target
3. Cmd+R to run
4. Menu bar should show music note icon ♫
5. Click icon → Popover appears

- [ ] **Step 3: Test scene selection**

1. Click "Study" pill → should connect to Lyria via WebSocket
2. Wait for "connected" status
3. Audio should start playing after ~3 seconds buffering
4. Spectrum visualizer (Aurora) should animate with music

- [ ] **Step 4: Test style mixing**

1. While Study is playing, click "Jazz" in style row
2. Music style should transition to jazz + study mood
3. Both pills should be highlighted

- [ ] **Step 5: Test visualizer swiping**

1. Swipe left on spectrum area → should switch to Vinyl with spring bounce
2. Swipe right → back to Aurora
3. Dot indicators should update
4. All 5 styles should render correctly

- [ ] **Step 6: Test play controls**

1. Click pause button → music pauses, icon changes to play
2. Click play → music resumes
3. Expand details → volume slider works
4. Collapse details → smooth animation

- [ ] **Step 7: Test background playback**

1. Click away from Popover to close it
2. Music should continue playing in background
3. Click menu bar icon again → Popover reappears with current state

- [ ] **Step 8: Commit final state**

```bash
git add -A
git commit -m "feat: Simone macOS Menu Bar App MVP complete"
```

---

### Task 16: iOS-Specific Adaptations

**Files:**
- Modify: `SimoneApp/Simone/Audio/AudioEngine.swift`

- [ ] **Step 1: Add NowPlaying info for iOS lock screen**

Add to `AudioEngine.swift`:

```swift
#if os(iOS)
import MediaPlayer

extension AudioEngine {
    func updateNowPlaying(scene: String, style: String?) {
        var info = [String: Any]()
        info[MPMediaItemPropertyTitle] = style.map { "\(scene) × \($0)" } ?? scene
        info[MPMediaItemPropertyArtist] = "Simone"
        info[MPNowPlayingInfoPropertyIsLiveStream] = true
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
    }

    func setupRemoteCommandCenter(
        onPlay: @escaping () -> Void,
        onPause: @escaping () -> Void
    ) {
        let center = MPRemoteCommandCenter.shared()
        center.playCommand.addTarget { _ in
            onPlay()
            return .success
        }
        center.pauseCommand.addTarget { _ in
            onPause()
            return .success
        }
    }
}
#endif
```

- [ ] **Step 2: Wire up NowPlaying in AppState**

Add to `AppState.init()`:

```swift
#if os(iOS)
audioEngine.setupRemoteCommandCenter(
    onPlay: { [weak self] in
        self?.lyriaClient.sendCommand("play")
        self?.audioEngine.resume()
    },
    onPause: { [weak self] in
        self?.lyriaClient.sendCommand("pause")
        self?.audioEngine.pause()
    }
)
#endif
```

Update `applySelection()` to call:
```swift
#if os(iOS)
audioEngine.updateNowPlaying(
    scene: selectedScene?.label ?? "Simone",
    style: selectedStyle?.label
)
#endif
```

- [ ] **Step 3: Build for iOS simulator**

Run: `xcodebuild build -scheme Simone -destination 'platform=iOS Simulator,name=iPhone 16'`
Expected: BUILD SUCCEEDED

- [ ] **Step 4: Commit**

```bash
git add SimoneApp/Simone/Audio/AudioEngine.swift SimoneApp/Simone/Models/AppState.swift
git commit -m "feat: add iOS lock screen NowPlaying and remote command support"
```
