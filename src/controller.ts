import { Capacitor } from '@capacitor/core';

import type { PluginListenerHandle } from '@capacitor/core';

import type { SafeAreaInsets, SafeAreaInsetsChangedCallback, SafeAreaPlugin } from './definitions';

export class SafeAreaController {
	private listeners: SafeAreaInsetsChangedCallback[];
	private callback: PluginListenerHandle | undefined;

	private insets: SafeAreaInsets = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};

	constructor(private instance: SafeAreaPlugin) {
		this.callback = undefined;
		this.listeners = [];
	}

	/**
	 * Load initial inset values and apply styles to document root.
	 */
	load(): Promise<void> {
		this.unload();
		this.callback = this.instance.addListener("safeAreaInsetChanged", (insets: SafeAreaInsets) => {
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
	addListener(listener: SafeAreaInsetsChangedCallback): PluginListenerHandle {
		this.listeners.push(listener);
		return { remove: async () => this.removeListener(listener) };
	}

	private removeListener(listener: SafeAreaInsetsChangedCallback): void {
		const index = this.listeners.indexOf(listener);
		if (index >= 0) {
			delete this.listeners[index]
		};
	}

	/**
	 * Remove all listener registrations.
	 */
	removeAllListeners(): void {
		this.listeners.length = 0;
	}

	/**
	 * Detect new inset values and fire {@link EventOnInsetsChanged}.
	 */
	async refresh(): Promise<void> {
		const { insets } = await this.instance.getSafeAreaInsets();

		this.updateInsets(insets);
		this.injectCSSVariables();
		this.notifyListeners();
	}

	/**
	 * Get the current {@link SafeAreaInsets}.
	 */
	getInsets(): SafeAreaInsets {
		return this.insets;
	}

	/**
	 * Detach this controller from inset detection.
	 */
	unload(): void {
		this.callback?.remove();
	}

	private notifyListeners() {
		this.listeners.forEach((listener) => listener(this.insets));
	}

	private updateInsets(insets: SafeAreaInsets) {
		this.insets = insets;
	}

	private injectCSSVariables() {
		for (const inset in this.insets) {
			switch (Capacitor.getPlatform()) {
				case "android":
				case "ios": {
					document.documentElement.style.setProperty(`--${Capacitor.getPlatform()}-safe-area-inset-${inset}`, `${this.insets[inset]}px`);
					document.documentElement.style.setProperty(`--safe-area-inset-${inset}`, `var(--${Capacitor.getPlatform()}-safe-area-inset-${inset}, env(safe-area-inset-${inset}))`);
				} break;
				default: {
					document.documentElement.style.setProperty(`--safe-area-inset-${inset}`, `env(safe-area-inset-${inset}`);
				} break;
			}
		}
	}

};
