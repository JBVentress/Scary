import { Button } from "../ui/button";
import { useState, useEffect } from "react";

interface InstructionsProps {
  onStart: () => void;
}

const LONG_PASSWORD = "Pass From The Owner Of The App ".repeat(6).trim();
const FINAL_PASSWORD = "Pass From The Owner Of The App";

export default function Instructions({ onStart }: InstructionsProps) {
  const [passwordStep, setPasswordStep] = useState(0);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [jumpScare, setJumpScare] = useState(false);

  useEffect(() => {
    if (blocked) {
      const flashInterval = setInterval(() => {
        setFlashing((prev) => !prev);
      }, 70);

      const scareTimeout = setTimeout(() => {
        setJumpScare(true);
        const audio = new Audio("https://media.vocaroo.com/mp3/105NhS8xMNPa");
        audio.volume = 1.0;
        audio.play().catch(() => console.warn("Audio playback failed"));
      }, 10000);

      return () => {
        clearInterval(flashInterval);
        clearTimeout(scareTimeout);
      };
    }
  }, [blocked]);

  const handleContinue = () => {
    setPasswordStep(1);
  };

  const handlePasswordSubmit = () => {
    if (blocked) return;

    if (passwordStep === 1 && password === LONG_PASSWORD) {
      setError(false);
      setPasswordStep(2);
      setPassword("");
    } else if (passwordStep === 2 && password === FINAL_PASSWORD) {
      setError(false);
      onStart();
    } else {
      setError(true);
      setBlocked(true);
    }
  };

  if (jumpScare) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black overflow-hidden relative">
        <audio autoPlay>
          <source src="https://media.vocaroo.com/mp3/105NhS8xMNPa" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className="glitch-container">
          <img
            src="https://media1.tenor.com/m/YlKhK9ftJwkAAAAd/horror.gif"
            alt="Jump Scare"
            className="glitch-img"
          />
          <img
            src="https://media1.tenor.com/m/YlKhK9ftJwkAAAAd/horror.gif"
            alt="Jump Scare"
            className="glitch-img glitch-layer"
          />
          <img
            src="https://media1.tenor.com/m/YlKhK9ftJwkAAAAd/horror.gif"
            alt="Jump Scare"
            className="glitch-img glitch-layer2"
          />
        </div>

        <style jsx>{`
          .glitch-container {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .glitch-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .glitch-layer {
            animation: glitch1 0.3s infinite;
            mix-blend-mode: screen;
            opacity: 0.7;
          }

          .glitch-layer2 {
            animation: glitch2 0.3s infinite;
            mix-blend-mode: lighten;
            opacity: 0.5;
          }

          @keyframes glitch1 {
            0% {
              clip-path: inset(0 0 90% 0);
              transform: translate(0);
            }
            20% {
              clip-path: inset(10% 0 80% 0);
              transform: translate(-5px, -2px);
            }
            40% {
              clip-path: inset(20% 0 60% 0);
              transform: translate(5px, 2px);
            }
            60% {
              clip-path: inset(30% 0 40% 0);
              transform: translate(-3px, 1px);
            }
            80% {
              clip-path: inset(40% 0 20% 0);
              transform: translate(3px, -1px);
            }
            100% {
              clip-path: inset(0 0 90% 0);
              transform: translate(0);
            }
          }

          @keyframes glitch2 {
            0% {
              clip-path: inset(0 0 85% 0);
              transform: translate(0);
            }
            25% {
              clip-path: inset(15% 0 70% 0);
              transform: translate(3px, 2px);
            }
            50% {
              clip-path: inset(25% 0 50% 0);
              transform: translate(-3px, -2px);
            }
            75% {
              clip-path: inset(35% 0 30% 0);
              transform: translate(2px, 1px);
            }
            100% {
              clip-path: inset(0 0 85% 0);
              transform: translate(0);
            }
          }
        `}</style>
      </div>
    );
  }

  if (blocked) {
    return (
      <div
        className={`h-screen w-screen flex items-center justify-start pl-20 transition-all duration-70 ${
          flashing ? "bg-white" : "bg-red-600"
        }`}
      >
        <h1 className="text-6xl font-extrabold text-black animate-pulse">
          THIS APP HAS BEEN BLOCKED BY MSD WARREN TOWNSHIP
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-red-100 p-6 rounded-xl shadow-lg border-2 border-red-300">
      {passwordStep > 0 ? (
        <>
          <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
            {passwordStep === 1 ? "Enter Long Password" : "Enter Final Password"}
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-red-300 rounded focus:border-red-500 focus:ring-2 focus:ring-red-200 mb-4"
            placeholder="Enter password here"
          />
          {error && (
            <p className="text-red-500 mb-4">
              Incorrect password. Please try again.
            </p>
          )}
          <Button
            onClick={handlePasswordSubmit}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          >
            Submit
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center text-red-600 mb-4">
            DO NOT CLICK THIS IS YOUR WARNING!
          </h1>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 blur opacity-30 rounded-full"></div>
            <div className="flex justify-center relative">
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-3 rounded-full text-xl font-bold shadow-lg transform transition-transform hover:scale-105"
              >
                DO NOT PRESS!
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
