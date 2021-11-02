import { WebPlugin } from '@capacitor/core';
import type { SafeAreaPlugin, SafeAreaInsetsResult } from './definitions';
export declare class SafeAreaWeb extends WebPlugin implements SafeAreaPlugin {
    refresh(): Promise<void>;
    getSafeAreaInsets(): Promise<SafeAreaInsetsResult>;
}
