import SwiftUI

@main
struct SimoneApp: App {
    var body: some SwiftUI.Scene {
        MenuBarExtra {
            ContentView()
        } label: {
            Label("Simone", systemImage: "music.note")
        }
        .menuBarExtraStyle(.window)
    }
}
