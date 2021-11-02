import type { PluginListenerHandle } from "@capacitor/core";
export interface SafeAreaPlugin {
    /**
     * Detect new inset values and fire {@link EventOnInsetsChanged}.
     */
    refresh(): Promise<void>;
    /**
     * Get the current {@link SafeAreaInsets}.
     */
    getSafeAreaInsets(): Promise<SafeAreaInsetsResult>;
    /**
     * Add a listener to receive callbacks when {@link EventOnInsetsChanged} events occur.
     * TIP: Un-register listeners via {@link PluginListenerHandle.remove} when no longer needed
     * or memory leaks will occur.
     */
    addListener(eventName: "safeAreaInsetChanged", listener: SafeAreaInsetsChangedCallback): PluginListenerHandle;
}
/**
 * SafeArea inset values.
 */
export interface SafeAreaInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
    [key: string]: number;
}
export interface SafeAreaInsetsResult {
    insets: SafeAreaInsets;
}
export declare type SafeAreaInsetsChangedCallback = (insets: SafeAreaInsets) => void;
export declare const SafeAreaInsetsChangeEventName = "safeAreaInsetChanged";
