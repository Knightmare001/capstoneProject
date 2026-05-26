import { useEffect, useState } from "react";

export default function ScoreGauge({ score }) {
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        current = score;
        clearInterval(timer);
      }
      setAnimScore(Math.round(current * 10) / 10);
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const scoreColor = score >= 70 ? "#EF4444" : score >= 40 ? "#F59E0B" : "#22C55E";
  const radius = 90;
  const circumference = Math.PI * radius;

  return (
    <div className="flex justify-center mb-2">
      <svg width="220" height="120" viewBox="0 0 220 120">
        <path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none" stroke="#F1F5F9" strokeWidth="18" strokeLinecap="round"
        />
        <path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke={scoreColor}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (animScore / 100) * circumference}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
        <text x="110" y="95" textAnchor="middle" fontSize="36" fontWeight="800"
          fill={scoreColor} fontFamily="system-ui">
          {animScore}
        </text>
        <text x="110" y="115" textAnchor="middle" fontSize="12" fill="#94A3B8"
          fontFamily="system-ui">
          dari 100
        </text>
      </svg>
    </div>
  );
}
