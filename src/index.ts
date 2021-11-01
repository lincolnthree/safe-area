import { registerPlugin } from '@capacitor/core';

import { SafeAreaController } from './controller';

import type { SafeAreaPlugin } from './definitions';

const SafeArea = registerPlugin<SafeAreaPlugin>('SafeArea', {
  web: () => import('./web').then(m => new m.SafeAreaWeb()),
});

const SafeAreaControl = new SafeAreaController(SafeArea);

export * from './definitions';
export { SafeArea, SafeAreaControl };
