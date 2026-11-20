// Verrou Révision : toutes les N minutes, l'écran se bloque sur une série de QCM (pédicurie, podologie, anatomie).
// Les écrans sont dans verrou.html (style du site) ; ici on ne fait que la barre des menus, la minuterie et le blocage.
import AppKit
import WebKit

let D = UserDefaults.standard
let site = Bundle.main.resourceURL!.appendingPathComponent("site")

final class KeyWindow: NSWindow { override var canBecomeKey: Bool { true } }

final class App: NSObject, NSApplicationDelegate, WKScriptMessageHandler {
    var item: NSStatusItem!
    var lockWindows: [NSWindow] = []
    var choixWindow: NSWindow?
    var locked: Bool { !lockWindows.isEmpty }

    var cfg: [String: Any] { (try? JSONSerialization.jsonObject(with: Data((D.string(forKey: "cfg") ?? "{}").utf8))) as? [String: Any] ?? [:] }
    var interval: Double { Double(cfg["interval"] as? Int ?? 60) * 60 }
    var due: Date {
        get { D.object(forKey: "due") as? Date ?? Date().addingTimeInterval(interval) }
        set { D.set(newValue, forKey: "due") }
    }

    func applicationDidFinishLaunching(_ n: Notification) {
        item = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        item.button?.image = NSImage(systemSymbolName: "graduationcap.fill", accessibilityDescription: "Révisions")
        let m = NSMenu()
        for (t, a, k) in [("Choisir mes révisions…", #selector(openChoix), ","), ("Réviser maintenant", #selector(lock), "r")] {
            m.addItem(withTitle: t, action: a, keyEquivalent: k).target = self
        }
        m.addItem(.separator())
        m.addItem(NSMenuItem(title: "Quitter", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))
        item.menu = m
        if D.object(forKey: "due") == nil { due = Date().addingTimeInterval(interval) }
        Timer.scheduledTimer(withTimeInterval: 15, repeats: true) { [weak self] _ in self?.tick() }
        tick()
        if CommandLine.arguments.contains("--choix") { openChoix() }
    }

    func tick() {
        guard !locked else { return }
        let left = due.timeIntervalSinceNow
        item.button?.title = " \(max(0, Int(left / 60))) min"
        if left <= 0 { lock() }
    }

    func webView(_ page: String) -> WKWebView {
        let c = WKWebViewConfiguration()
        c.userContentController.add(self, name: "verrou")
        c.userContentController.addUserScript(WKUserScript(source: "window.CFG = \(D.string(forKey: "cfg") ?? "{}");", injectionTime: .atDocumentStart, forMainFrameOnly: true))
        let w = WKWebView(frame: .zero, configuration: c)
        w.loadFileURL(URL(string: "mac/verrou.html#\(page)", relativeTo: site)!, allowingReadAccessTo: site)
        return w
    }

    // messages de la page : save (le choix), close, done (série finie), urgence
    func userContentController(_ u: WKUserContentController, didReceive msg: WKScriptMessage) {
        guard let b = msg.body as? [String: Any] else { return }
        if let s = b["save"], let d = try? JSONSerialization.data(withJSONObject: s) {
            let old = interval
            D.set(String(data: d, encoding: .utf8), forKey: "cfg")
            if interval != old { due = Date().addingTimeInterval(interval); tick() }
        }
        if b["close"] != nil { choixWindow?.close() }
        if b["done"] != nil { unlock(retryIn: interval) }
        if b["urgence"] != nil { unlock(retryIn: 10 * 60) }
    }

    @objc func openChoix() {
        if choixWindow == nil {
            let w = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 760, height: 820), styleMask: [.titled, .closable, .resizable], backing: .buffered, defer: false)
            w.title = "Mes révisions"; w.isReleasedWhenClosed = false; w.center()
            choixWindow = w
        }
        choixWindow!.contentView = webView("choix")   // rechargée à chaque ouverture : le choix est à jour
        NSApp.activate(ignoringOtherApps: true)
        choixWindow!.makeKeyAndOrderFront(nil)
    }

    @objc func lock() {
        guard !locked else { return }
        choixWindow?.close()
        NSApp.setActivationPolicy(.regular)
        NSApp.activate(ignoringOtherApps: true)
        NSApp.presentationOptions = [.hideDock, .hideMenuBar, .disableProcessSwitching, .disableForceQuit,
                                     .disableSessionTermination, .disableHideApplication, .disableAppleMenu]
        for (i, screen) in NSScreen.screens.enumerated() {
            let w = KeyWindow(contentRect: screen.frame, styleMask: .borderless, backing: .buffered, defer: false)
            w.level = .screenSaver
            w.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary]
            w.backgroundColor = NSColor(calibratedRed: 0.957, green: 0.925, blue: 0.851, alpha: 1)
            w.setFrame(screen.frame, display: true)
            if i == 0 { let v = webView("lock"); w.contentView = v; w.initialFirstResponder = v }
            w.makeKeyAndOrderFront(nil)
            lockWindows.append(w)
        }
        lockWindows.first?.makeKey()
        // si on arrive quand même à changer d'app, on revient
        NSWorkspace.shared.notificationCenter.addObserver(self, selector: #selector(refocus), name: NSWorkspace.didActivateApplicationNotification, object: nil)
    }

    @objc func refocus() {
        guard locked else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { NSApp.activate(ignoringOtherApps: true); self.lockWindows.forEach { $0.orderFrontRegardless() } }
    }

    func unlock(retryIn: Double) {
        guard locked else { return }
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        lockWindows.forEach { $0.orderOut(nil) }; lockWindows = []
        NSApp.presentationOptions = []
        NSApp.setActivationPolicy(.accessory)
        due = Date().addingTimeInterval(retryIn)
        tick()
    }
}

let app = NSApplication.shared
let delegate = App()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
