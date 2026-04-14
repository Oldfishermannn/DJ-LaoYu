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
