import Foundation
import Observation

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
        #if os(iOS)
        audioEngine.updateNowPlaying(
            scene: selectedScene?.label ?? "Simone",
            style: selectedStyle?.label
        )
        #endif
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
