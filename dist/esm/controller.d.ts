import type { PluginListenerHandle } from '@capacitor/core';
import type { SafeAreaInsets, SafeAreaInsetsChangedCallback, SafeAreaPlugin } from './definitions';
export declare class SafeAreaController {
    private instance;
    private listeners;
    private callback;
    private insets;
    constructor(instance: SafeAreaPlugin);
    /**
     * Load initial inset values and apply styles to document root.
     */
    load(): Promise<void>;
    /**
     * Add a listener to receive callbacks when {@link EventOnInsetsChanged} events occur.
     * TIP: Un-register listeners via {@link PluginListenerHandle.remove} when no longer needed
     * or memory leaks will occur.
     */
    addListener(listener: SafeAreaInsetsChangedCallback): PluginListenerHandle;
    private removeListener;
    /**
     * Remove all listener registrations.
     */
    removeAllListeners(): void;
    /**
     * Detect new inset values and fire {@link EventOnInsetsChanged}.
     */
    refresh(): Promise<void>;
    /**
     * Get the current {@link SafeAreaInsets}.
     */
    getInsets(): SafeAreaInsets;
    /**
     * Detach this controller from inset detection.
     */
    unload(): void;
    private notifyListeners;
    private updateInsets;
    private injectCSSVariables;
}
