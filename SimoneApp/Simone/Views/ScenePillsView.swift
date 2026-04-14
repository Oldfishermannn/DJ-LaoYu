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
                        ? Color(red: 196/255, green: 166/255, blue: 157/255).opacity(0.2)
                        : Color.white.opacity(0.04)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(
                            isActive
                                ? Color(red: 196/255, green: 166/255, blue: 157/255).opacity(0.4)
                                : Color.white.opacity(0.08),
                            lineWidth: 1
                        )
                )
                .clipShape(RoundedRectangle(cornerRadius: 20))
                .foregroundStyle(
                    isActive
                        ? Color(red: 196/255, green: 166/255, blue: 157/255)
                        : Color.white.opacity(0.8)
                )
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
