package com.apysoft.gymmemoir;

import android.Manifest;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "RestAlarm")
public class RestAlarmPlugin extends Plugin {
    private static final int REQUEST_CODE = 5001;
    private static final int NOTIFICATION_PERMISSION_REQUEST_CODE = 5002;

    @PluginMethod
    public void schedule(PluginCall call) {
        Long atMillis = call.getLong("at");

        if (atMillis == null) {
            call.reject("Missing 'at' timestamp");
            return;
        }

        requestNotificationPermissionIfNeeded();

        AlarmManager alarmManager = getAlarmManager();
        PendingIntent pendingIntent = buildPendingIntent();

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
                alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMillis, pendingIntent);
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMillis, pendingIntent);
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, atMillis, pendingIntent);
            }
        } catch (SecurityException error) {
            // Sin permiso de alarma exacta: se agenda de forma inexacta como respaldo.
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMillis, pendingIntent);
        }

        call.resolve();
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        PendingIntent pendingIntent = buildPendingIntent();
        getAlarmManager().cancel(pendingIntent);
        pendingIntent.cancel();
        call.resolve();
    }

    @PluginMethod
    public void setPreferences(PluginCall call) {
        boolean vibration = call.getBoolean("vibration", true);
        boolean sound = call.getBoolean("sound", true);

        RestAlarmPrefs.save(getContext(), vibration, sound);

        call.resolve();
    }

    private AlarmManager getAlarmManager() {
        return (AlarmManager) getContext().getSystemService(Context.ALARM_SERVICE);
    }

    private void requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU || getActivity() == null) {
            return;
        }

        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                getActivity(),
                new String[] {Manifest.permission.POST_NOTIFICATIONS},
                NOTIFICATION_PERMISSION_REQUEST_CODE);
        }
    }

    private PendingIntent buildPendingIntent() {
        Intent intent = new Intent(getContext(), RestAlarmReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getBroadcast(getContext(), REQUEST_CODE, intent, flags);
    }
}
