package com.capacitor.plugin.safearea;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.util.Log;
import android.view.DisplayCutout;
import android.view.OrientationEventListener;
import android.view.View;
import android.view.WindowInsets;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatCallback;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SafeArea")
public class SafeAreaPlugin extends Plugin implements SensorEventListener
{
    private static final String KEY_INSET = "insets";
    private static final String EVENT_ON_INSETS_CHANGED = "safeAreaInsetChanged";
    private SafeAreaInsets insets = new SafeAreaInsets();

    @Override
    public void load()
    {
        super.load();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            this.getActivity().getWindow().getDecorView().getRootView()
                        .setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                            @Override
                            public WindowInsets onApplyWindowInsets(View view, WindowInsets windowInsets)
                            {
                                SafeAreaPlugin.this.onChanged();
                                return windowInsets;
                            }
                        });
        }
    }

    @PluginMethod
    public void refresh(PluginCall call)
    {
        this.doNotify();
        call.resolve();
    }

    @PluginMethod
    public void getSafeAreaInsets(PluginCall call)
    {
        JSObject ret = new JSObject();
        ret.put(SafeAreaPlugin.KEY_INSET, this.insets.toJSON());
        call.resolve(ret);
    }

    @Override
    protected void handleOnResume()
    {
        super.handleOnResume();

        SensorManager sm = (SensorManager) this.getBridge().getActivity().getSystemService(Context.SENSOR_SERVICE);
        sm.registerListener(this, sm.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR), SensorManager.SENSOR_DELAY_NORMAL);
    }

    @Override
    protected void handleOnPause()
    {
        super.handleOnPause();

        SensorManager sm = (SensorManager) this.getBridge().getActivity().getSystemService(Context.SENSOR_SERVICE);
        sm.unregisterListener(this);
    }

    protected int getSafeArea(SafeAreaInsets cache)
    {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
            Log.d(SafeAreaPlugin.class.toString(), String.format("Requires at least %d+", Build.VERSION_CODES.P));

            cache.clear();
            return SafeAreaInsetResult.ERROR;
        }

        WindowInsets windowInsets = this.getBridge().getActivity().getWindow().getDecorView().getRootWindowInsets();

        if (windowInsets == null) {
            Log.d(SafeAreaPlugin.class.toString(), "WindowInsets is not available.");

            cache.clear();
            return SafeAreaInsetResult.ERROR;
        }

        float density = this.getBridge().getActivity().getResources().getDisplayMetrics().density;
        boolean changed = false;

        int top = 0; // We hide the status bar, so this is always 0 unless there is a display cutout.
        DisplayCutout displayCutout = windowInsets.getDisplayCutout();
        if (displayCutout != null) {
            top = Math.round(displayCutout.getSafeInsetTop() / density);
        }
        else {
            Log.i(SafeAreaPlugin.class.toString(), "DisplayCutout is not available.");
        }
        int bottom = Math.round((windowInsets.getSystemWindowInsetBottom()) / density);
        int left = Math.round((windowInsets.getSystemWindowInsetLeft()) / density);
        int right = Math.round((windowInsets.getSystemWindowInsetRight()) / density);

        if (cache.top() != top) {
            cache.top(top);
            changed = true;
        }

        if (cache.bottom() != bottom) {
            cache.bottom(bottom);
            changed = true;
        }

        if (cache.right() != right) {
            cache.right(right);
            changed = true;
        }

        if (cache.left() != left) {
            cache.left(left);
            changed = true;
        }

        if (changed == true) {
            Log.i(SafeAreaPlugin.class.toString(), "Safe area changed: "
                        + "{ top: " + cache.top()
                        + ", right: " + cache.right()
                        + ", bottom: " + cache.bottom()
                        + ", left: " + cache.left() + " }");
        }
        return changed ? SafeAreaInsetResult.CHANGE : SafeAreaInsetResult.NO_CHANGE;
    }

    private void onChanged()
    {
        int result = SafeAreaPlugin.this.getSafeArea(SafeAreaPlugin.this.insets);

        switch (result)
        {
        case SafeAreaInsetResult.ERROR:
        case SafeAreaInsetResult.NO_CHANGE:
            return;
        }

        SafeAreaPlugin.this.doNotify();
    }

    @Override
    public void onSensorChanged(SensorEvent event)
    {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
            this.onChanged();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy)
    { /* Do Nothing... */ }

    protected void doNotify()
    {
        this.notifyListeners(SafeAreaPlugin.EVENT_ON_INSETS_CHANGED, this.insets.toJSON());
    }

    public static class SafeAreaInsetResult
    {
        public static final int ERROR = -1;
        public static final int NO_CHANGE = 0;
        public static final int CHANGE = 1;
    }
}
