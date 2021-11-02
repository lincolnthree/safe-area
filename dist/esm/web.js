import { WebPlugin } from '@capacitor/core';
import { SafeAreaInsetsChangeEventName } from './definitions';
/**
 * There should be no device inset values on Web browsers.
 */
const insets = {
    top: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-top')),
    bottom: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-bottom')),
    left: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-left')),
    right: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-right'))
};
export class SafeAreaWeb extends WebPlugin {
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
//# sourceMappingURL=web.js.map