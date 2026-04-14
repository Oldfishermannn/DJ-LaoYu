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
