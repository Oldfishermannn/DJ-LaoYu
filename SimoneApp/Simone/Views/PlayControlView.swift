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
            return String(style.prompt.prefix(30)) + "..."
        } else if let scene = state.selectedScene {
            return String(scene.prompt.prefix(30)) + "..."
        }
        return "选一个场景或风格开始"
    }

    var body: some View {
        HStack(spacing: 14) {
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
