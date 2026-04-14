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
