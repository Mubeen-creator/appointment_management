"use client";

import React, { useEffect, useState, useRef } from "react";
import { LoaderProps } from "@/constants/interfaces";

const FuturisticLoader: React.FC<LoaderProps> = ({
  size = "md",
  theme = "neon",
  loadingText = "INITIALIZING",
  showText = true,
  showProgress = true,
  progressValue,
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const themeConfig = {
    neon: {
      primary: "from-blue-600 to-cyan-400",
      secondary: "from-indigo-600 to-purple-500",
      accent: "bg-cyan-400",
      text: "text-cyan-400",
      shadow: "shadow-cyan-500/50",
      particles: "bg-blue-500",
      ring: "border-cyan-500",
    },
    hologram: {
      primary: "from-teal-400 to-cyan-300",
      secondary: "from-teal-600 to-cyan-500",
      accent: "bg-teal-300",
      text: "text-teal-300",
      shadow: "shadow-teal-400/50",
      particles: "bg-teal-400",
      ring: "border-teal-400",
    },
    cyber: {
      primary: "from-rose-600 to-amber-500",
      secondary: "from-red-600 to-yellow-400",
      accent: "bg-yellow-400",
      text: "text-yellow-400",
      shadow: "shadow-yellow-500/50",
      particles: "bg-rose-500",
      ring: "border-yellow-400",
    },
    quantum: {
      primary: "from-purple-600 to-fuchsia-400",
      secondary: "from-violet-600 to-fuchsia-500",
      accent: "bg-fuchsia-400",
      text: "text-fuchsia-300",
      shadow: "shadow-fuchsia-500/50",
      particles: "bg-purple-500",
      ring: "border-fuchsia-400",
    },
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const selectedTheme = themeConfig[theme];

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (!progressValue) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 2;
        });
      }, 100);
    } else {
      setProgress(progressValue);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [progressValue]);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(phaseInterval);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    if (!particlesRef.current) return;

    const container = particlesRef.current;
    container.innerHTML = "";

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 4 + 1;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 40 + 10;
      const duration = Math.random() * 3 + 2;
      const opacity = Math.random() * 0.5 + 0.3;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
      particle.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;
      particle.style.opacity = opacity.toString();
      particle.style.animation = `particleFloat ${duration}s infinite linear`;

      particle.className = `absolute ${selectedTheme.particles} rounded-full`;
      container.appendChild(particle);
    }
  }, [theme]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
      <div
        className={`relative flex flex-col items-center justify-center ${
          glitch ? "animate-pulse" : ""
        }`}
      >
        <div
          ref={particlesRef}
          className="absolute inset-0 overflow-hidden"
        ></div>

        <div className="relative">
          <div
            className={`${sizeClasses[size]} rounded-full border-2 ${selectedTheme.ring} opacity-30 animate-[spin_4s_linear_infinite]`}
          ></div>

          <div
            className={`absolute inset-0 ${sizeClasses[size]} rounded-full border border-dashed ${selectedTheme.ring} opacity-50 animate-[spin_7s_linear_infinite_reverse]`}
          ></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${
                size === "sm"
                  ? "h-10 w-10"
                  : size === "md"
                  ? "h-16 w-16"
                  : "h-20 w-20"
              } bg-gradient-to-br ${
                selectedTheme.primary
              } rounded-full animate-pulse shadow-lg ${selectedTheme.shadow}`}
            ></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${
                size === "sm"
                  ? "h-4 w-4"
                  : size === "md"
                  ? "h-6 w-6"
                  : "h-8 w-8"
              } bg-white opacity-80 rounded-full animate-ping`}
            ></div>
          </div>

          <div
            className={`absolute left-0 w-full h-1 ${selectedTheme.accent} opacity-70 blur-sm animate-[scanLine_2s_ease-in-out_infinite]`}
            style={{
              top: `${50 + Math.cos(Date.now() / 300) * 25}%`,
              transform: "translateY(-50%)",
            }}
          ></div>
        </div>

        {showText && (
          <div className="mt-8 flex flex-col items-center space-y-2">
            <div
              className={`font-mono uppercase tracking-wider ${
                selectedTheme.text
              } ${textSizeClasses[size]} ${glitch ? "animate-pulse" : ""}`}
            >
              {loadingText}{" "}
              <span className="animate-pulse">
                {phase === 0
                  ? "."
                  : phase === 1
                  ? ".."
                  : phase === 2
                  ? "..."
                  : ""}
              </span>
            </div>

            <div className="flex space-x-2 mt-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 w-1 rounded-full ${
                    i === phase ? selectedTheme.accent : "bg-gray-600"
                  }`}
                ></div>
              ))}
            </div>

            {showProgress && (
              <div className="w-40 h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${selectedTheme.secondary} transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            {showProgress && (
              <div className={`font-mono text-xs ${selectedTheme.text} mt-1`}>
                {Math.min(100, Math.floor(progress))}%
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scanLine {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(5px, -5px) rotate(90deg);
          }
          50% {
            transform: translate(0, -10px) rotate(180deg);
          }
          75% {
            transform: translate(-5px, -5px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FuturisticLoader;
