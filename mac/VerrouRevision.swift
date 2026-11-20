// Verrou Révision : toutes les N minutes, l'écran se bloque sur une série de QCM tirés de data/quiz.js.
// On ne sort qu'en répondant juste à tout (les ratées reviennent en fin de série).
// Icône dans la barre des menus : choisir les fiches, le nombre de questions, l'intervalle.
import AppKit
import JavaScriptCore

struct Q { let id: String; let fiche: String; let text: String; let good: String; let choices: [String] }

let D = UserDefaults.standard
func setting(_ k: String, _ def: Int) -> Int { D.object(forKey: k) == nil ? def : D.integer(forKey: k) }

// --- Données : on évalue les fichiers JS du site tels quels ---
func loadData() -> (fiches: [(id: String, title: String)], qs: [Q]) {
    let ctx = JSContext()!
    ctx.evaluateScript("var window = this;")
    for f in ["quiz", "pedi", "podo"] {
        if let u = Bundle.main.url(forResource: f, withExtension: "js"), let s = try? String(contentsOf: u, encoding: .utf8) { ctx.evaluateScript(s) }
    }
    let json = ctx.evaluateScript("""
      JSON.stringify(Object.keys(QUIZ).map(function(id){
        var p = (window.PEDI||[]).concat(window.PODO||[]).find(function(x){return x.id===id});
        return {id:id, title: p ? p.title : id, q: [].concat.apply([], QUIZ[id].map(function(s){return s.q||[]}))};
      }))
    """)?.toString() ?? "[]"
    let arr = (try? JSONSerialization.jsonObject(with: Data(json.utf8))) as? [[String: Any]] ?? []
    var fiches: [(String, String)] = [], qs: [Q] = []
    for f in arr {
        let id = f["id"] as! String, title = f["title"] as! String
        let before = qs.count
        for s in f["q"] as? [String] ?? [] {
            // « question | bonne || fausse ; fausse » : seuls les QCM se corrigent sans tricher
            let parts = s.components(separatedBy: " | ")
            guard parts.count == 2, parts[1].contains("||") else { continue }
            let r = parts[1].components(separatedBy: "||")
            let good = r[0].trimmingCharacters(in: .whitespaces)
            let bad = r[1].components(separatedBy: ";").map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }
            qs.append(Q(id: id, fiche: title, text: parts[0], good: good, choices: ([good] + bad).shuffled()))
        }
        if qs.count > before { fiches.append((id, title)) }
    }
    return (fiches, qs)
}

final class App: NSObject, NSApplicationDelegate {
    let data = loadData()
    var item: NSStatusItem!
    var windows: [NSWindow] = []
    var queue: [Q] = [], done = 0, total = 0
    var label = NSTextField(wrappingLabelWithString: ""), sub = NSTextField(labelWithString: ""), stack = NSStackView()
    var locked: Bool { !windows.isEmpty }

    var interval: Int { setting("interval", 60) }
    var count: Int { setting("count", 10) }
    var chosen: Set<String> { Set(D.stringArray(forKey: "fiches") ?? []) } // vide = toutes
    var due: Date {
        get { D.object(forKey: "due") as? Date ?? Date().addingTimeInterval(Double(interval) * 60) }
        set { D.set(newValue, forKey: "due") }
    }

    func applicationDidFinishLaunching(_ n: Notification) {
        item = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        item.button?.image = NSImage(systemSymbolName: "graduationcap.fill", accessibilityDescription: "Révisions")
        if D.object(forKey: "due") == nil { due = Date().addingTimeInterval(Double(interval) * 60) }
        buildMenu()
        Timer.scheduledTimer(withTimeInterval: 15, repeats: true) { [weak self] _ in self?.tick() }
        tick()
    }

    func tick() {
        guard !locked else { return }
        let left = due.timeIntervalSinceNow
        item.button?.title = " \(max(0, Int(left / 60))) min"
        if left <= 0 { lock() }
    }

    // --- Menu ---
    func buildMenu() {
        let m = NSMenu()
        m.addItem(withTitle: "\(data.qs.count) QCM chargés", action: nil, keyEquivalent: "")
        m.addItem(.separator())
        m.addItem(NSMenuItem(title: "Réviser maintenant", action: #selector(lock), keyEquivalent: "r"))
        let fm = NSMenu(), sel = chosen
        fm.addItem(NSMenuItem(title: "Toutes les fiches", action: #selector(allFiches), keyEquivalent: ""))
        fm.addItem(.separator())
        for f in data.fiches {
            let it = NSMenuItem(title: f.title, action: #selector(toggleFiche(_:)), keyEquivalent: "")
            it.representedObject = f.id
            it.state = sel.isEmpty || sel.contains(f.id) ? .on : .off
            fm.addItem(it)
        }
        let fi = NSMenuItem(title: sel.isEmpty ? "Fiches : toutes" : "Fiches : \(sel.count)", action: nil, keyEquivalent: "")
        fi.submenu = fm; m.addItem(fi)
        m.addItem(choiceMenu("Questions par série", [5, 10, 15, 20], count, "count", "%d questions"))
        m.addItem(choiceMenu("Toutes les", [30, 45, 60, 90, 120], interval, "interval", "%d min"))
        m.addItem(.separator())
        m.addItem(NSMenuItem(title: "Quitter", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))
        m.items.forEach { if $0.action != nil && $0.target == nil && $0.action != #selector(NSApplication.terminate(_:)) { $0.target = self } }
        fm.items.forEach { $0.target = self }
        item.menu = m
    }

    func choiceMenu(_ title: String, _ vals: [Int], _ cur: Int, _ key: String, _ fmt: String) -> NSMenuItem {
        let sm = NSMenu()
        for v in vals {
            let it = NSMenuItem(title: String(format: fmt, v), action: #selector(setChoice(_:)), keyEquivalent: "")
            it.representedObject = [key, v]; it.state = v == cur ? .on : .off; it.target = self
            sm.addItem(it)
        }
        let it = NSMenuItem(title: "\(title) : \(String(format: fmt, cur))", action: nil, keyEquivalent: ""); it.submenu = sm
        return it
    }

    @objc func setChoice(_ s: NSMenuItem) {
        let a = s.representedObject as! [Any]
        D.set(a[1], forKey: a[0] as! String)
        if a[0] as! String == "interval" { due = Date().addingTimeInterval(Double(interval) * 60) }
        buildMenu(); tick()
    }
    @objc func allFiches() { D.removeObject(forKey: "fiches"); buildMenu() }
    @objc func toggleFiche(_ s: NSMenuItem) {
        let id = s.representedObject as! String
        var sel = chosen.isEmpty ? Set(data.fiches.map(\.id)) : chosen
        if sel.contains(id) { sel.remove(id) } else { sel.insert(id) }
        if sel.count == data.fiches.count || sel.isEmpty { D.removeObject(forKey: "fiches") } else { D.set(Array(sel), forKey: "fiches") }
        buildMenu()
    }

    // --- Verrou ---
    @objc func lock() {
        guard !locked else { return }
        let sel = chosen
        let pool = data.qs.filter { sel.isEmpty || sel.contains($0.id) }
        guard !pool.isEmpty else { due = Date().addingTimeInterval(Double(interval) * 60); return } // rien à demander : on ne bloque pas
        queue = Array(pool.shuffled().prefix(count)); done = 0; total = queue.count

        NSApp.setActivationPolicy(.regular)
        NSApp.activate(ignoringOtherApps: true)
        NSApp.presentationOptions = [.hideDock, .hideMenuBar, .disableProcessSwitching, .disableForceQuit,
                                     .disableSessionTermination, .disableHideApplication, .disableAppleMenu]
        for (i, screen) in NSScreen.screens.enumerated() {
            let w = KeyWindow(contentRect: screen.frame, styleMask: .borderless, backing: .buffered, defer: false)
            w.level = .screenSaver
            w.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary]
            w.backgroundColor = NSColor(calibratedRed: 0.98, green: 0.96, blue: 0.9, alpha: 1)
            w.setFrame(screen.frame, display: true)
            if i == 0 { w.contentView = makeQuizView() }
            w.makeKeyAndOrderFront(nil)
            windows.append(w)
        }
        windows.first?.makeKey()
        show()
        // si on arrive quand même à changer d'app, on revient
        NSWorkspace.shared.notificationCenter.addObserver(self, selector: #selector(refocus), name: NSWorkspace.didActivateApplicationNotification, object: nil)
    }

    @objc func refocus() {
        guard locked else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { NSApp.activate(ignoringOtherApps: true); self.windows.forEach { $0.orderFrontRegardless() } }
    }

    func makeQuizView() -> NSView {
        let v = NSView()
        label.font = .systemFont(ofSize: 30, weight: .semibold); label.alignment = .center
        sub.font = .systemFont(ofSize: 16); sub.textColor = .secondaryLabelColor; sub.alignment = .center
        stack.orientation = .vertical; stack.spacing = 14
        let urgence = NSButton(title: "Urgence", target: self, action: #selector(emergency(_:)))
        urgence.bezelStyle = .inline; urgence.font = .systemFont(ofSize: 11)
        let all = NSStackView(views: [sub, label, stack])
        all.orientation = .vertical; all.spacing = 30
        for x in [all, urgence] as [NSView] { x.translatesAutoresizingMaskIntoConstraints = false; v.addSubview(x) }
        NSLayoutConstraint.activate([
            all.centerXAnchor.constraint(equalTo: v.centerXAnchor), all.centerYAnchor.constraint(equalTo: v.centerYAnchor),
            all.widthAnchor.constraint(equalToConstant: 760), label.widthAnchor.constraint(equalToConstant: 760),
            urgence.trailingAnchor.constraint(equalTo: v.trailingAnchor, constant: -20), urgence.bottomAnchor.constraint(equalTo: v.bottomAnchor, constant: -20),
        ])
        return v
    }

    func show() {
        stack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        guard let q = queue.first else { return unlock() }
        sub.stringValue = "\(done) / \(total) bonnes réponses · \(q.fiche)"
        label.stringValue = q.text
        for (i, c) in q.choices.enumerated() {
            let b = NSButton(title: "\(i + 1). \(c)", target: self, action: #selector(answer(_:)))
            b.bezelStyle = .rounded; b.controlSize = .large; b.font = .systemFont(ofSize: 18)
            b.keyEquivalent = "\(i + 1)"; b.tag = i
            b.widthAnchor.constraint(equalToConstant: 760).isActive = true
            stack.addArrangedSubview(b)
        }
    }

    @objc func answer(_ b: NSButton) {
        let q = queue.removeFirst()
        if q.choices[b.tag] == q.good {
            done += 1; show()
        } else {
            // raté : on montre la bonne réponse, la question revient à la fin (choix remélangés)
            queue.append(Q(id: q.id, fiche: q.fiche, text: q.text, good: q.good, choices: q.choices.shuffled()))
            NSSound.beep()
            stack.arrangedSubviews.forEach { $0.removeFromSuperview() }
            let r = NSTextField(wrappingLabelWithString: "✗  Réponse : \(q.good)")
            r.font = .systemFont(ofSize: 22, weight: .medium); r.textColor = .systemRed; r.alignment = .center
            let ok = NSButton(title: "Compris (Entrée)", target: self, action: #selector(next)); ok.keyEquivalent = "\r"; ok.controlSize = .large
            stack.addArrangedSubview(r); stack.addArrangedSubview(ok)
        }
    }
    @objc func next() { show() }

    // Soupape de sécurité : 2 minutes d'attente, et la série revient 10 minutes plus tard.
    @objc func emergency(_ b: NSButton) {
        b.isEnabled = false
        var s = 120
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] t in
            s -= 1; b.title = "Urgence : déblocage dans \(s) s"
            if s <= 0 { t.invalidate(); self?.unlock(retryIn: 10) }
        }
    }

    func unlock(retryIn: Int? = nil) {
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        windows.forEach { $0.orderOut(nil) }; windows = []
        NSApp.presentationOptions = []
        NSApp.setActivationPolicy(.accessory)
        due = Date().addingTimeInterval(Double(retryIn ?? interval) * 60)
        tick()
    }
}

final class KeyWindow: NSWindow { override var canBecomeKey: Bool { true } }

if CommandLine.arguments.contains("--check") {
    let d = loadData()
    print("\(d.fiches.count) fiches, \(d.qs.count) QCM")
    assert(d.qs.count > 100 && d.qs.allSatisfy { $0.choices.contains($0.good) && $0.choices.count >= 2 })
    exit(0)
}
let app = NSApplication.shared
let delegate = App()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
