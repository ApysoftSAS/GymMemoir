package com.apysoft.gymmemoir;

import android.content.Context;
import android.content.SharedPreferences;

// Prefs nativas compartidas entre el plugin (JS) y el receiver (dispara aunque la app esté cerrada).
final class RestAlarmPrefs {
    private static final String PREFS_NAME = "RestAlarmPrefs";
    private static final String KEY_VIBRATION = "vibration";
    private static final String KEY_SOUND = "sound";

    private RestAlarmPrefs() {}

    static void save(Context context, boolean vibration, boolean sound) {
        prefs(context).edit()
            .putBoolean(KEY_VIBRATION, vibration)
            .putBoolean(KEY_SOUND, sound)
            .apply();
    }

    static boolean isVibrationEnabled(Context context) {
        return prefs(context).getBoolean(KEY_VIBRATION, true);
    }

    static boolean isSoundEnabled(Context context) {
        return prefs(context).getBoolean(KEY_SOUND, true);
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }
}
