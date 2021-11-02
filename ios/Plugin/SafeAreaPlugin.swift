import Foundation
import Capacitor

func makeSafeArea(top: Int, bottom: Int, right: Int, left: Int) -> [String: Int] {
    return [
        "top": top,
        "right": right,
        "bottom": bottom,
        "left": left
    ];
}

let EVENT_ON_INSETS_CHANGED = "safeAreaInsetChanged"

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(SafeAreaPlugin)
public class SafeAreaPlugin: CAPPlugin {
    public static let ViewWillTransitionToEvent = NSNotification.Name(rawValue: "SafeAreaPlugin.ViewWillTransitionToEvent")
    private var insets = makeSafeArea(top: 0, bottom: 0, right: 0, left: 0)

    @objc func refresh(_ call: CAPPluginCall) {
        self.refreshInternal()
        call.resolve()
    }

    private func refreshInternal() {
        var window: UIWindow? = nil;
        if #available(iOS 13.0, *) {
            window = UIApplication.shared.windows.first
        }
        else if #available(iOS 11.0, *) {
            window = UIApplication.shared.keyWindow
        }

        let safeFrame = window?.safeAreaLayoutGuide.layoutFrame;

        let top = Int(safeFrame!.minY)
        let right = Int((window?.frame.maxX ?? safeFrame!.maxX) - safeFrame!.maxX)
        let bottom = Int((window?.frame.maxY ?? safeFrame!.maxY) - safeFrame!.maxY)
        let left = Int(safeFrame!.minX)

        self.changeSafeArea(top: top, right: right, bottom: bottom, left: left)
    }

    @objc func getSafeAreaInsets(_ call: CAPPluginCall) {
        call.resolve([ "insets": self.insets ])
    }

    override public func load() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.onDidBecomeActive),
            name: UIApplication.didBecomeActiveNotification,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.onWillResignActive),
            name: UIApplication.willResignActiveNotification,
            object: nil
        )

        if #available(iOS 13.0, *) {
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(self.onViewWillTransitionTo),
                name: SafeAreaPlugin.ViewWillTransitionToEvent,
                object: nil
            )
        }
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    @objc func onDidBecomeActive() {
        self.refreshInternal()
    }

    @objc func onWillResignActive() {}

    @objc func onViewWillTransitionTo(event: NSNotification) {
        self.refreshInternal()
    }

    func changeSafeArea(top: Int, right: Int, bottom: Int, left: Int) {
        self.insets = makeSafeArea(top: top, bottom: bottom, right: right, left: left)
        self.notifyListeners(EVENT_ON_INSETS_CHANGED, data: self.insets)
    }
}

extension CAPBridgeViewController {
    public override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews();
        NotificationCenter.default.post(
            name: SafeAreaPlugin.ViewWillTransitionToEvent,
            object: nil
        )
    }
}
