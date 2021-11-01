import { WebPlugin } from '@capacitor/core';

import { SafeAreaInsetsChangeEventName } from './definitions';

import type { SafeAreaInsets, SafeAreaPlugin, SafeAreaInsetsResult } from './definitions';

/**
 * There should be no device inset values on Web browsers.
 */
const insets: SafeAreaInsets = {
  top: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-top')),
  bottom: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-bottom')),
  left: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-left')),
  right: Number.parseInt(document.documentElement.style.getPropertyValue('--safe-area-inset-right'))
};

export class SafeAreaWeb extends WebPlugin implements SafeAreaPlugin {

  async refresh(): Promise<void> {
    this.notifyListeners(SafeAreaInsetsChangeEventName, {
      insets: insets
    });
  }

  getSafeAreaInsets(): Promise<SafeAreaInsetsResult> {
    return new Promise<SafeAreaInsetsResult>((resolve) => {
      resolve({ insets: insets });
    });
  }
}
