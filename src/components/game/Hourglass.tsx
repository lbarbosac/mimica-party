interface HourglassProps {
  timeLeft: number;
  totalTime?: number;
}

export function Hourglass({ timeLeft, totalTime = 60 }: HourglassProps) {
  const progress = Math.max(0, Math.min(1, timeLeft / totalTime));
  const isLow = timeLeft <= 10;
  const sandColor = isLow ? '#EF4444' : '#D97706';
  const frameColor = '#92400E';

  return (
    <div className={`flex flex-col items-center gap-1 ${isLow ? 'animate-pulse' : ''}`}>
      <svg viewBox="0 0 80 120" className="w-14 h-20">
        {/* Frame top & bottom bars */}
        <rect x="8" y="2" width="64" height="7" rx="3" fill={frameColor} />
        <rect x="8" y="111" width="64" height="7" rx="3" fill={frameColor} />

        {/* Glass outline - top */}
        <path d="M14,9 L14,9 Q14,50 40,58 Q66,50 66,9" fill="none" stroke={frameColor} strokeWidth="2.5" />
        {/* Glass outline - bottom */}
        <path d="M14,111 L14,111 Q14,70 40,62 Q66,70 66,111" fill="none" stroke={frameColor} strokeWidth="2.5" />

        {/* Top sand */}
        <clipPath id="topGlass">
          <path d="M15,10 Q15,50 40,57 Q65,50 65,10 Z" />
        </clipPath>
        <rect
          x="15"
          y={10 + 47 * (1 - progress)}
          width="50"
          height={47 * progress}
          fill={sandColor}
          clipPath="url(#topGlass)"
          opacity="0.85"
        />

        {/* Bottom sand */}
        <clipPath id="bottomGlass">
          <path d="M15,110 Q15,70 40,63 Q65,70 65,110 Z" />
        </clipPath>
        <rect
          x="15"
          y={110 - 47 * (1 - progress)}
          width="50"
          height={47 * (1 - progress)}
          fill={sandColor}
          clipPath="url(#bottomGlass)"
          opacity="0.85"
        />

        {/* Falling stream */}
        {progress > 0.02 && progress < 0.98 && (
          <line x1="40" y1="57" x2="40" y2="63" stroke={sandColor} strokeWidth="2" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="0.5s" repeatCount="indefinite" />
          </line>
        )}
      </svg>
      <span className={`text-lg font-black tabular-nums ${isLow ? 'text-destructive' : 'text-foreground'}`}>
        {timeLeft}s
      </span>
    </div>
  );
}
