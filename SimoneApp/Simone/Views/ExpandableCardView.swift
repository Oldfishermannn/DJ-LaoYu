import SwiftUI

struct ExpandableCardView: View {
    @Bindable var state: AppState

    var body: some View {
        VStack(spacing: 0) {
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

            if state.isDetailsExpanded {
                VStack(spacing: 16) {
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

                    HStack {
                        Text("Temperature: \(String(format: "%.1f", state.temperature))")
                        Spacer()
                        Text("Guidance: \(String(format: "%.1f", state.guidance))")
                    }
                    .font(.system(size: 10))
                    .tracking(1)
                    .textCase(.uppercase)
                    .foregroundStyle(.white.opacity(0.2))

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
