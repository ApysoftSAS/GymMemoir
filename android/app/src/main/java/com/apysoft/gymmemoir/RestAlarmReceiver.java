package com.apysoft.gymmemoir;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import androidx.core.app.NotificationCompat;

// Suena y vibra usando el stream de ALARMA, que Android no silencia con el modo
// silencio/No Molestar (a diferencia de las notificaciones normales).
public class RestAlarmReceiver extends BroadcastReceiver {
    public static final String CHANNEL_ID = "rest-alarm";
    public static final int NOTIFICATION_ID = 2001;
    private static MediaPlayer mediaPlayer;

    @Override
    public void onReceive(Context context, Intent intent) {
        PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK, "GymMemoir:RestAlarmWakeLock");
        wakeLock.acquire(15000);

        try {
            if (RestAlarmPrefs.isSoundEnabled(context)) {
                playAlarmSound(context);
            }

            if (RestAlarmPrefs.isVibrationEnabled(context)) {
                vibrate(context);
            }

            showNotification(context);
        } finally {
            wakeLock.release();
        }
    }

    private void playAlarmSound(Context context) {
        try {
            stopSound();

            Uri soundUri = RingtoneManager.getActualDefaultRingtoneUri(context, RingtoneManager.TYPE_ALARM);
            if (soundUri == null) {
                soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            }

            mediaPlayer = new MediaPlayer();
            mediaPlayer.setAudioAttributes(new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build());
            mediaPlayer.setDataSource(context, soundUri);
            mediaPlayer.setOnCompletionListener(MediaPlayer::release);
            mediaPlayer.prepare();
            mediaPlayer.start();
        } catch (Exception error) {
            error.printStackTrace();
        }
    }

    private static void stopSound() {
        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
                mediaPlayer.release();
            } catch (Exception ignored) {
                // El reproductor ya pudo haberse liberado.
            }
            mediaPlayer = null;
        }
    }

    private void vibrate(Context context) {
        long[] pattern = {0, 400, 200, 400, 200, 400};

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            VibratorManager vibratorManager =
                (VibratorManager) context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
            vibratorManager.getDefaultVibrator().vibrate(VibrationEffect.createWaveform(pattern, -1));
        } else {
            Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1));
            } else {
                vibrator.vibrate(pattern, -1);
            }
        }
    }

    private void showNotification(Context context) {
        NotificationManager manager =
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                && manager.getNotificationChannel(CHANNEL_ID) == null) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID, "Alarma de descanso", NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Alerta de fin de descanso");
            // El sonido y la vibración ya los maneja este receiver directamente.
            channel.enableVibration(false);
            channel.setSound(null, null);
            manager.createNotificationChannel(channel);
        }

        Intent openAppIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        PendingIntent contentIntent = null;

        if (openAppIntent != null) {
            openAppIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            contentIntent = PendingIntent.getActivity(context, 0, openAppIntent, flags);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(context.getApplicationInfo().icon)
            .setContentTitle("Descanso terminado")
            .setContentText("Es momento de tu siguiente serie.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true);

        if (contentIntent != null) {
            builder.setContentIntent(contentIntent);
            builder.setFullScreenIntent(contentIntent, true);
        }

        manager.notify(NOTIFICATION_ID, builder.build());
    }
}
