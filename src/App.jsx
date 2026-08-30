import { useEffect, useState } from "react";
import "./App.css";
import {
  cancelRestAlarm,
  scheduleRestAlarm,
  setAlarmPreferences,
} from "./utils/restAlarm";
import caminandoConMochila from "./assets/CaminandoConMochila.png";
import doblePulgarArriba from "./assets/DoblePulgarArriba.png";
import fuerteConPuño from "./assets/FuerteConPuño.png";
import hero from "./assets/hero.png";
import personaje07 from "./assets/personaje_07.png";
import saludoDeMano from "./assets/SaludoDeMano.png";
import senalandoAlFrente from "./assets/SeñalandoAlFrente.png";
import senalandoLaCabeza from "./assets/SeñalandoLaCabeza.png";

const motivationalEntries = [
  {
    quote: "¡Vamos! Una serie más. 💪",
    image: doblePulgarArriba,
  },
  {
    quote: "El esfuerzo de hoy construye tu fuerza de mañana.",
    image: fuerteConPuño,
  },
  {
    quote: "No pares ahora, ya empezaste. 🔥",
    image: senalandoAlFrente,
  },
  {
    quote: "Respira, recupera y vuelve con todo.",
    image: saludoDeMano,
  },
  {
    quote: "La disciplina te llevará donde la motivación no puede.",
    image: caminandoConMochila,
  },
  {
    quote: "El límite está en tu mente. 💪",
    image: senalandoLaCabeza,
  },
  {
    quote: "Sigue adelante. Ya llegaste demasiado lejos para parar.",
    image: hero,
  },
  {
    quote: "Hoy entrenas. Mañana agradecerás haberlo hecho.",
    image: personaje07,
  },
  {
    quote: "Cada repetición cuenta.",
    image: doblePulgarArriba,
  },
  {
    quote: "Tu única competencia eres tú mismo.",
    image: senalandoLaCabeza,
  },
  {
    quote: "No busques excusas, busca resultados.",
    image: fuerteConPuño,
  },
  {
    quote: "La siguiente serie puede ser tu mejor serie. 🔥",
    image: senalandoAlFrente,
  },
];

const restPresets = [30, 60, 90, 120, 180];

const colorPalette = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ef4444",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#eab308",
];

const backgroundPalette = [
  "#111827",
  "#1f2937",
  "#0f172a",
  "#18181b",
  "#312e81",
  "#134e4a",
  "#450a0a",
  "#3b0764",
];

function RestDurationControl({
  minutes,
  seconds,
  onMinutesChange,
  onSecondsChange,
}) {
  const setDuration = (totalSeconds) => {
    onMinutesChange(Math.floor(totalSeconds / 60));
    onSecondsChange(totalSeconds % 60);
  };

  const adjustDuration = (amount) => {
    setDuration(Math.max(0, minutes * 60 + seconds + amount));
  };

  return (
    <div className="rest-control">
      <div className="duration-picker" aria-label="Duracion del descanso">
        <button
          className="duration-stepper"
          type="button"
          aria-label="Restar 1 minuto"
          onClick={() => adjustDuration(-60)}
        >
          −
        </button>

        <label className="duration-field">
          <span>Minutos</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={minutes}
            onChange={(event) =>
              onMinutesChange(
                Math.max(0, Number(event.target.value) || 0)
              )
            }
          />
        </label>

        <span className="duration-separator">:</span>

        <label className="duration-field">
          <span>Segundos</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="59"
            value={seconds}
            onChange={(event) =>
              onSecondsChange(
                Math.min(59, Math.max(0, Number(event.target.value) || 0))
              )
            }
          />
        </label>

        <button
          className="duration-stepper"
          type="button"
          aria-label="Sumar 1 minuto"
          onClick={() => adjustDuration(60)}
        >
          +
        </button>
      </div>

      <div className="rest-quick-actions">
        <button type="button" onClick={() => adjustDuration(-15)}>−15 s</button>
        <button type="button" onClick={() => adjustDuration(15)}>+15 s</button>
        {restPresets.map((preset) => (
          <button
            className={minutes * 60 + seconds === preset ? "is-active" : ""}
            type="button"
            key={preset}
            onClick={() => setDuration(preset)}
          >
            {preset < 60 ? `${preset} s` : `${preset / 60} min`}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  // =========================
  // CONFIGURACIÓN
  // =========================

  const [exercise] = useState("Sentadillas");
  const [sets, setSets] = useState(4);
  const [reps] = useState(12);
  const [restMinutes, setRestMinutes] = useState(2);
  const [restSeconds, setRestSeconds] = useState(0);

  const totalRestSeconds =
    restMinutes * 60 + restSeconds;

  // =========================
  // ALERTA DE FIN DE DESCANSO
  // =========================

  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    const stored = localStorage.getItem("gymmemoir:vibration");
    return stored === null ? true : stored === "true";
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem("gymmemoir:sound");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("gymmemoir:vibration", String(vibrationEnabled));
    localStorage.setItem("gymmemoir:sound", String(soundEnabled));

    setAlarmPreferences({
      vibration: vibrationEnabled,
      sound: soundEnabled,
    }).catch(console.error);
  }, [vibrationEnabled, soundEnabled]);

  // =========================
  // COLOR DE LA APP
  // =========================

  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem("gymmemoir:colorMode") || "system";
  });

  const [customColor, setCustomColor] = useState(() => {
    return localStorage.getItem("gymmemoir:customColor") || colorPalette[0];
  });

  useEffect(() => {
    localStorage.setItem("gymmemoir:colorMode", colorMode);
    localStorage.setItem("gymmemoir:customColor", customColor);

    const root = document.documentElement;

    if (colorMode === "custom") {
      root.style.setProperty("--accent", customColor);
    } else {
      root.style.removeProperty("--accent");
    }
  }, [colorMode, customColor]);

  const [bgMode, setBgMode] = useState(() => {
    return localStorage.getItem("gymmemoir:bgMode") || "system";
  });

  const [customBgColor, setCustomBgColor] = useState(() => {
    return localStorage.getItem("gymmemoir:customBgColor") || backgroundPalette[0];
  });

  useEffect(() => {
    localStorage.setItem("gymmemoir:bgMode", bgMode);
    localStorage.setItem("gymmemoir:customBgColor", customBgColor);

    const root = document.documentElement;

    if (bgMode === "custom") {
      root.style.setProperty("--bg", customBgColor);
    } else {
      root.style.removeProperty("--bg");
    }
  }, [bgMode, customBgColor]);

  // =========================
  // ESTADO DEL ENTRENAMIENTO
  // =========================

  const [started, setStarted] = useState(false);

  const [currentSet, setCurrentSet] = useState(1);

  const [isResting, setIsResting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

  const [restEndsAt, setRestEndsAt] = useState(null);

  const [quote, setQuote] = useState("");

  const [motivationIndex, setMotivationIndex] = useState(0);

  const [isLastSet, setIsLastSet] = useState(false);

  // =========================
  // PERSONAJE MOTIVACIONAL
  // =========================

  const [showCharacter, setShowCharacter] = useState(false);

  const [characterExiting, setCharacterExiting] =
    useState(false);

  const [characterImage, setCharacterImage] = useState("");

  // =========================
  // INICIAR ENTRENAMIENTO
  // =========================

  const startWorkout = () => {
    setStarted(true);

    setCurrentSet(1);

    setIsResting(false);

    setShowCharacter(false);

    setCharacterExiting(false);

    setMotivationIndex(0);

    setIsLastSet(false);
  };

  // =========================
  // TERMINAR SERIE
  // =========================

  const finishSet = () => {
    const isFinalSet = currentSet >= sets;

    setIsLastSet(isFinalSet);

    const seconds = totalRestSeconds;
    const endAt = Date.now() + seconds * 1000;

    const selectedMotivation =
      motivationalEntries[
        motivationIndex %
          motivationalEntries.length
      ];

    setQuote(selectedMotivation.quote);

    setCharacterImage(
      selectedMotivation.image
    );

    setMotivationIndex(
      (previous) => previous + 1
    );

    setTimeLeft(seconds);

    setRestEndsAt(endAt);

    if (seconds > 0) {
      scheduleRestAlarm(endAt).catch(console.error);
    }

    setCharacterExiting(false);

    setShowCharacter(true);

    setIsResting(true);
  };

  // =========================
  // TEMPORIZADOR
  // =========================

  useEffect(() => {
    if (
      !isResting ||
      !restEndsAt
    ) {
      return;
    }

    const updateTimeLeft = () => {
      setTimeLeft(
        Math.max(
          0,
          Math.ceil((restEndsAt - Date.now()) / 1000)
        )
      );
    };

    updateTimeLeft();

    const timer = setInterval(() => {
      updateTimeLeft();
    }, 250);

    return () => {
      clearInterval(timer);
    };
  }, [
    isResting,
    restEndsAt,
  ]);

  // =========================
  // FIN DEL DESCANSO
  // =========================

  useEffect(() => {
    if (
      isResting &&
      timeLeft === 0
    ) {
      // Comienza animación de salida
      setCharacterExiting(true);

      // Esperamos que termine
      // la animación
      const timeout = setTimeout(() => {
        cancelRestAlarm().catch(console.error);

        setShowCharacter(false);

        setCharacterExiting(false);

        setIsResting(false);

        setRestEndsAt(null);

        if (isLastSet) {
          alert(
            "🎉 ¡Entrenamiento terminado!"
          );

          setStarted(false);

          setCurrentSet(1);

          setIsLastSet(false);

          return;
        }

        setCurrentSet(
          (previous) =>
            previous + 1
        );

        alert(
          "🔔 ¡Descanso terminado!\n\n¡Prepárate para la siguiente serie! 💪"
        );
      }, 700);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [
    isResting,
    timeLeft,
    isLastSet,
  ]);

  // =========================
  // FORMATEAR TIEMPO
  // =========================

  const formatTime = (
    seconds
  ) => {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      seconds % 60;

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(
      2,
      "0"
    )}`;
  };

  // =========================
  // INTERFAZ
  // =========================

  return (
    <div className="app">

      {/* =========================
          CONFIGURACIÓN
      ========================== */}

      {!started ? (
        <div className="setup">

          <h1>
            🏋️ GYM MEMOIR
          </h1>

          <div className="form">

            {/* SERIES */}

            <label>
              Series
            </label>

            <input
              type="number"
              min="1"
              value={sets}
              onChange={(e) =>
                setSets(
                  Number(
                    e.target.value
                  )
                )
              }
            />

            {/* DESCANSO */}

            <div className="rest-config">
              <label>
                Descanso
              </label>

              <RestDurationControl
                minutes={restMinutes}
                seconds={restSeconds}
                onMinutesChange={setRestMinutes}
                onSecondsChange={setRestSeconds}
              />
            </div>

            {/* ALERTA DE FIN DE DESCANSO */}

            <div className="alert-config">
              <label>
                <input
                  type="checkbox"
                  checked={vibrationEnabled}
                  onChange={(e) =>
                    setVibrationEnabled(e.target.checked)
                  }
                />
                Vibrar al terminar el descanso
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) =>
                    setSoundEnabled(e.target.checked)
                  }
                />
                Sonido al terminar el descanso
              </label>
            </div>

            {/* COLOR DE LA APP */}

            <div className="theme-config">
              <label>
                Color de la app
              </label>

              <div className="theme-mode-options">
                <button
                  type="button"
                  className={colorMode === "system" ? "is-active" : ""}
                  onClick={() => setColorMode("system")}
                >
                  Color del sistema
                </button>

                <button
                  type="button"
                  className={colorMode === "custom" ? "is-active" : ""}
                  onClick={() => setColorMode("custom")}
                >
                  Personalizado
                </button>
              </div>

              {colorMode === "custom" && (
                <div className="color-palette">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={
                        customColor === color
                          ? "color-swatch is-selected"
                          : "color-swatch"
                      }
                      style={{ background: color }}
                      aria-label={`Elegir color ${color}`}
                      onClick={() => setCustomColor(color)}
                    />
                  ))}

                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    aria-label="Elegir color personalizado"
                  />
                </div>
              )}
            </div>

            {/* COLOR DE FONDO */}

            <div className="theme-config">
              <label>
                Color de fondo
              </label>

              <div className="theme-mode-options">
                <button
                  type="button"
                  className={bgMode === "system" ? "is-active" : ""}
                  onClick={() => setBgMode("system")}
                >
                  Color del sistema
                </button>

                <button
                  type="button"
                  className={bgMode === "custom" ? "is-active" : ""}
                  onClick={() => setBgMode("custom")}
                >
                  Personalizado
                </button>
              </div>

              {bgMode === "custom" && (
                <div className="color-palette">
                  {backgroundPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={
                        customBgColor === color
                          ? "color-swatch is-selected"
                          : "color-swatch"
                      }
                      style={{ background: color }}
                      aria-label={`Elegir color de fondo ${color}`}
                      onClick={() => setCustomBgColor(color)}
                    />
                  ))}

                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    aria-label="Elegir color de fondo personalizado"
                  />
                </div>
              )}
            </div>

            {/* INICIAR */}

            <button
              className="start-button"
              onClick={
                startWorkout
              }
            >
              ▶ INICIAR
            </button>

          </div>

        </div>

      ) : (

        /* =========================
           ENTRENAMIENTO
        ========================== */

        <div className="workout">

          {!isResting ? (

            /* =========================
               SERIE
            ========================== */

            <>
              <div className="set-counter">
                SERIE{" "}
                {currentSet} /{" "}
                {sets}
              </div>

              <div className="rest-config">
                <label>
                  Descanso
                </label>

                <RestDurationControl
                  minutes={restMinutes}
                  seconds={restSeconds}
                  onMinutesChange={setRestMinutes}
                  onSecondsChange={setRestSeconds}
                />
              </div>

              <button
                className="finish-button"
                onClick={
                  finishSet
                }
              >
                <span className="finish-icon">
                  ✓
                </span>

                <span>
                  TERMINÉ LA SERIE
                </span>
              </button>
            </>

          ) : (

            /* =========================
               DESCANSO
            ========================== */

            <div className="rest-screen">

              <h1>
                DESCANSO
              </h1>

              <div className="timer">
                {formatTime(
                  timeLeft
                )}
              </div>

              {/* FRASE */}

              <div className="motivational-quote">
                "{quote}"
              </div>

              <p>
                {isLastSet ? (
                  <>
                    Última serie. <strong>¡Dale todo!</strong>
                  </>
                ) : (
                  <>
                    Prepárate para la serie{" "}
                    <strong>
                      {currentSet + 1}
                    </strong>
                  </>
                )}
              </p>

              {/* PERSONAJE */}

              {showCharacter && (
                <div
                  className={`motivational-character ${
                    characterExiting
                      ? "character-exit"
                      : ""
                  }`}
                >
                  <img
                    src={characterImage}
                    alt="Motivación"
                  />
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default App;