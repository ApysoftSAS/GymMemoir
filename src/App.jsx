import { useEffect, useState } from "react";
import "./App.css";
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
  // ESTADO DEL ENTRENAMIENTO
  // =========================

  const [started, setStarted] = useState(false);

  const [currentSet, setCurrentSet] = useState(1);

  const [isResting, setIsResting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

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
      timeLeft <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(
        (previous) =>
          previous - 1
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    isResting,
    timeLeft,
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
        setShowCharacter(false);

        setCharacterExiting(false);

        setIsResting(false);

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