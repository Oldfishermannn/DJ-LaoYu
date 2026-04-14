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
                ForEach(Array(styles.enumerated()), id: \.element.id) { index, _ in
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
