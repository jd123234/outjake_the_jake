"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  initialSeconds: number;
}

export default function Timer({ initialSeconds }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const isUrgent = seconds <= 30;

  return (
    <div className="flex items-center gap-2">
      <span className="caption" aria-hidden>
        ⏱
      </span>
      <div
        className="body font-semibold"
        style={{
          color: isUrgent ? "var(--danger)" : "var(--accent)",
          animation: isUrgent ? "pulse 1s infinite" : "none",
        }}
      >
        {minutes}:{remainingSeconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
}
