import { registerPlugin } from '@capacitor/core';
import { SafeAreaController } from './controller';
const SafeArea = registerPlugin('SafeArea', {
    web: () => import('./web').then(m => new m.SafeAreaWeb()),
});
const SafeAreaControl = new SafeAreaController(SafeArea);
export * from './definitions';
export { SafeArea, SafeAreaControl };
//# sourceMappingURL=index.js.map