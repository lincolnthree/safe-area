var capacitorSafeArea = (function (exports, core) {
    'use strict';

    class SafeAreaController {
        constructor(instance) {
            this.instance = instance;
            this.insets = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };
            this.callback = undefined;
            this.listeners = [];
        }
        /**
         * Load initial inset values and apply styles to document root.
         */
        load() {
            this.unload();
            this.callback = this.instance.addListener("safeAreaInsetChanged", (insets) => {
                this.updateInsets(insets);
                this.injectCSSVariables();
                this.notifyListeners();
            });
            return this.refresh();
        }
        /**
         * Add a listener to receive callbacks when {@link EventOnInsetsChanged} events occur.
         * TIP: Un-register listeners via {@link PluginListenerHandle.remove} when no longer needed
         * or memory leaks will occur.
         */
        addListener(listener) {
            this.listeners.push(listener);
            return { remove: async () => this.removeListener(listener) };
        }
        removeListener(listener) {
            const index = this.listeners.indexOf(listener);
            if (index >= 0) {
                delete this.listeners[index];
            }
        }
        /**
         * Remove all listener registrations.
         */
        removeAllListeners() {
            this.listeners.length = 0;
        }
        /**
         * Detect new inset values and fire {@link EventOnInsetsChanged}.
         */
        async refresh() {
            const { insets } = await this.instance.getSafeAreaInsets();
            this.updateInsets(insets);
            this.injectCSSVariables();
            this.notifyListeners();
        }
        /**
         * Get the current {@link SafeAreaInsets}.
         */
        getInsets() {
            return this.insets;
        }
        /**
         * Detach this controller from inset detection.
         */
        unload() {
            var _a;
            (_a = this.callback) === null || _a === void 0 ? void 0 : _a.remove();
        }
        notifyListeners() {
            this.listeners.forEach((listener) => listener(this.insets));
        }
        updateInsets(insets) {
            this.insets = insets;
        }
        injectCSSVariables() {
            for (const inset in this.insets) {
                switch (core.Capacitor.getPlatform()) {
                    case "android":
                    case "ios":
                        {
                            document.documentElement.style.setProperty(`--${core.Capacitor.getPlatform()}-safe-area-inset-${inset}`, `${this.insets[inset]}px`);
                            document.documentElement.style.setProperty(`--safe-area-inset-${inset}`, `var(--${core.Capacitor.getPlatform()}-safe-area-inset-${inset}, env(safe-area-inset-${inset}))`);
                        }
                        break;
                    default:
                        {
                            document.documentElement.style.setProperty(`--safe-area-inset-${inset}`, `env(safe-area-inset-${inset}`);
                        }
                        break;
                }
            }
        }
    }

    const SafeAreaInsetsChangeEventName = "safeAreaInsetChanged";

    const SafeArea = core.registerPlugin('SafeArea', {
        web: () => Promise.resolve().then(function () { return web; }).then(m => new m.SafeAreaWeb()),
    });
    const SafeAreaControl = new SafeAreaController(SafeArea);

    /**
     * There should be no device inset values on Web browsers.
     */
    const insets = {
        top: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-top')),
        bottom: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-bottom')),
        left: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-left')),
        right: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-right'))
    };
    class SafeAreaWeb extends core.WebPlugin {
        async refresh() {
            this.notifyListeners(SafeAreaInsetsChangeEventName, {
                insets: insets
            });
        }
        getSafeAreaInsets() {
            return new Promise((resolve) => {
                resolve({ insets: insets });
            });
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SafeAreaWeb: SafeAreaWeb
    });

    exports.SafeArea = SafeArea;
    exports.SafeAreaControl = SafeAreaControl;
    exports.SafeAreaInsetsChangeEventName = SafeAreaInsetsChangeEventName;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
