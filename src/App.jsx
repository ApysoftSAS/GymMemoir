import { useEffect, useState } from "react";
import "./App.css";
import motivationalImage from "./assets/motivacional.png";

const motivationalQuotes = [
  "¡Vamos! Una serie más. 💪",
  "El esfuerzo de hoy construye tu fuerza de mañana.",
  "No pares ahora, ya empezaste. 🔥",
  "Cada repetición cuenta.",
  "Tu única competencia eres tú mismo.",
  "Respira, recupera y vuelve con todo.",
  "La constancia supera al talento.",
  "¡Tú puedes! La siguiente serie te espera.",
  "El progreso comienza cuando decides no rendirte.",
  "Un poco más. Estás construyendo una versión más fuerte de ti.",
  "La disciplina te llevará donde la motivación no puede.",
  "No busques excusas, busca resultados.",
  "Hoy entrenas. Mañana agradecerás haberlo hecho.",
  "🔥 Modo guerrero activado.",
  "Cada serie te acerca a tu objetivo.",
  "El límite está en tu mente. 💪",
  "Sigue adelante. Ya llegaste demasiado lejos para parar.",
  "Tu esfuerzo de hoy será tu orgullo de mañana.",
  "¡Respira profundo y prepárate para volver con todo!",
  "La siguiente serie puede ser tu mejor serie. 🔥",
];

function App() {
  // =========================
  // CONFIGURACIÓN
  // =========================

  const [exercise, setExercise] = useState("Sentadillas");
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(12);
  const [rest, setRest] = useState(2);

  // =========================
  // ESTADO DEL ENTRENAMIENTO
  // =========================

  const [started, setStarted] = useState(false);

  const [currentSet, setCurrentSet] = useState(1);

  const [isResting, setIsResting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

  const [quote, setQuote] = useState("");

  // =========================
  // PERSONAJE MOTIVACIONAL
  // =========================

  const [showCharacter, setShowCharacter] = useState(false);

  const [characterExiting, setCharacterExiting] =
    useState(false);

  // =========================
  // INICIAR ENTRENAMIENTO
  // =========================

  const startWorkout = () => {
    setStarted(true);

    setCurrentSet(1);

    setIsResting(false);

    setShowCharacter(false);

    setCharacterExiting(false);
  };

  // =========================
  // TERMINAR SERIE
  // =========================

  const finishSet = () => {
    // Si es la última serie
    if (currentSet >= sets) {
      alert(
        "🎉 ¡Entrenamiento terminado!"
      );

      setStarted(false);

      setCurrentSet(1);

      setIsResting(false);

      setShowCharacter(false);

      setCharacterExiting(false);

      return;
    }

    // Convertimos minutos a segundos
    const seconds = rest * 60;

    // Elegimos frase aleatoria
    const randomIndex =
      Math.floor(
        Math.random() *
          motivationalQuotes.length
      );

    setQuote(
      motivationalQuotes[randomIndex]
    );

    // Iniciamos temporizador
    setTimeLeft(seconds);

    // Preparar personaje
    setCharacterExiting(false);

    setShowCharacter(true);

    // Activar descanso
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
            🏋️ GYM APP
          </h1>

          <div className="form">

            {/* EJERCICIO */}

            <label>
              Ejercicio
            </label>

            <input
              type="text"
              value={exercise}
              onChange={(e) =>
                setExercise(
                  e.target.value
                )
              }
            />

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

            {/* REPETICIONES */}

            <label>
              Repeticiones por serie
            </label>

            <input
              type="number"
              min="1"
              value={reps}
              onChange={(e) =>
                setReps(
                  Number(
                    e.target.value
                  )
                )
              }
            />

            {/* DESCANSO */}

            <label>
              Descanso (minutos)
            </label>

            <input
              type="number"
              min="0"
              value={rest}
              onChange={(e) =>
                setRest(
                  Number(
                    e.target.value
                  )
                )
              }
            />

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
              <h1>
                {exercise}
              </h1>

              <div className="set-counter">
                SERIE{" "}
                {currentSet} /{" "}
                {sets}
              </div>

              <div className="reps">
                {reps}

                <span>
                  REPETICIONES
                </span>
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
                Prepárate para la serie{" "}
                <strong>
                  {currentSet + 1}
                </strong>
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
                    src={
                      motivationalImage
                    }
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