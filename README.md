# @capacitor-community/safe-area

Exposes the safe area insets from native iOS/Android devices to Capacitor projects.
Based on the original work from https://github.com/capacitor-community/safe-area

## Install

```bash
npm install git@github.com:lincolnthree/safe-area.git
npx cap sync
```

## Usage
Register the plugin via the entry file of your project. Ensure the import does not get Minified.

```javascript
import { SafeAreaControl } from '@capacitor-community/safe-area';

/*
 * Initialize automatic inset detection, add styles to document element.
 */
SafeAreaControl.load();

/* Get current insets */
SafeAreaControl.getInsets();

/* Add a listener for inset value changes */
SafeAreaControl.addListener((insets) => {
    // Do something with insets
});

/*
 * Trigger an update and fire new inset values.
 */
SafeAreaControl.refresh();

/*
 * Stop listening for and updating inset values in the document.
 */
SafeAreaControl.unload();
```

## Configure

To get full screen mode use this in your main activity. Requires Android **28+**

```java
@Override
public void onResume() {
super.onResume();

// Requires API 28+
this.getWindow().getAttributes().layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;

View decorView = this.getWindow().getDecorView();

decorView.setSystemUiVisibility(
		View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
				// Set the content to appear under the system bars so that the
				// content doesn't resize when the system bars hide and show.
				| View.SYSTEM_UI_FLAG_LAYOUT_STABLE
				| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
				| View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
				// Hide the nav bar and status bar
				| View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
				| View.SYSTEM_UI_FLAG_FULLSCREEN);
}
  ```

## Maintainers

| Maintainer | GitHub | Social |
| -----------| -------| -------|
| Lincoln Baxter, III | [lincolnthree](https://github.com/lincolnthree) | [@lincolnthree](https://twitter.com/lincolnthree) |

## API

<docgen-index>

* [`refresh()`](#refresh)
* [`getSafeAreaInsets()`](#getsafeareainsets)
* [`addListener(...)`](#addlistener)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### refresh()

```typescript
refresh() => any
```

Detect new inset values and fire {@link EventOnInsetsChanged}.

**Returns:** <code>any</code>

--------------------


### getSafeAreaInsets()

```typescript
getSafeAreaInsets() => any
```

Get the current {@link <a href="#safeareainsets">SafeAreaInsets</a>}.

**Returns:** <code>any</code>

--------------------


### addListener(...)

```typescript
addListener(eventName: "safeAreaInsetChanged", listener: SafeAreaInsetsChangedCallback) => PluginListenerHandle
```

Add a listener to receive callbacks when {@link EventOnInsetsChanged} events occur. 
TIP: Un-register listeners via {@link <a href="#pluginlistenerhandle">PluginListenerHandle.remove</a>} when no longer needed 
or memory leaks will occur.

| Param           | Type                                                                           |
| --------------- | ------------------------------------------------------------------------------ |
| **`eventName`** | <code>"safeAreaInsetChanged"</code>                                            |
| **`listener`**  | <code>(insets: <a href="#safeareainsets">SafeAreaInsets</a>) =&gt; void</code> |

**Returns:** <code><a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### Interfaces


#### SafeAreaInsetsResult

| Prop         | Type                                                      |
| ------------ | --------------------------------------------------------- |
| **`insets`** | <code><a href="#safeareainsets">SafeAreaInsets</a></code> |


#### SafeAreaInsets

SafeArea inset values.

| Prop         | Type                |
| ------------ | ------------------- |
| **`top`**    | <code>number</code> |
| **`right`**  | <code>number</code> |
| **`bottom`** | <code>number</code> |
| **`left`**   | <code>number</code> |


#### PluginListenerHandle

| Prop         | Type                      |
| ------------ | ------------------------- |
| **`remove`** | <code>() =&gt; any</code> |

</docgen-api>
