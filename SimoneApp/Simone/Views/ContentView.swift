import SwiftUI

struct ContentView: View {
    @State var state = AppState()

    var body: some View {
        ZStack {
            Color(red: 0.165, green: 0.165, blue: 0.18)
                .ignoresSafeArea()

            RadialGradient(
                colors: [MorandiPalette.rose.opacity(0.06), .clear],
                center: .top,
                startRadius: 0,
                endRadius: 300
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                ScenePillsView(state: state)

                SpectrumCarouselView(
                    state: state,
                    spectrumData: state.audioEngine.spectrumData
                )
                .padding(.top, 8)

                ExpandableCardView(state: state)

                PlayControlView(state: state)
            }
        }
        .frame(width: 340)
        .frame(minHeight: 420)
    }
}

#Preview {
    ContentView()
        .preferredColorScheme(.dark)
}
