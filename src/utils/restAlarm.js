import { Capacitor, registerPlugin } from "@capacitor/core";

// Plugin nativo (android/.../RestAlarmPlugin.java) que agenda una alarma real
// (AlarmManager + stream de audio ALARM), la cual suena y vibra incluso con el
// teléfono en silencio y con la app en segundo plano o cerrada.
const RestAlarm = registerPlugin("RestAlarm");

export async function scheduleRestAlarm(atMillis) {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }

  try {
    await RestAlarm.schedule({ at: atMillis });
  } catch (error) {
    console.error("No se pudo programar la alarma de descanso", error);
  }
}

export async function cancelRestAlarm() {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }

  try {
    await RestAlarm.cancel();
  } catch (error) {
    console.error("No se pudo cancelar la alarma de descanso", error);
  }
}

export async function setAlarmPreferences({ vibration, sound }) {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }

  try {
    await RestAlarm.setPreferences({ vibration, sound });
  } catch (error) {
    console.error("No se pudieron guardar las preferencias de alarma", error);
  }
}
