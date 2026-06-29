export function DharmaWheel({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="9" stroke="currentColor" strokeWidth="2" />
      {[0, 45, 90, 135].map((angle) => (
        <path
          key={angle}
          d="M50 16V84"
          stroke="currentColor"
          strokeWidth="1.5"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function LotusMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 120 72"
      fill="none"
    >
      <path
        d="M60 62C42 48 40 27 60 7C80 27 78 48 60 62Z"
        fill="currentColor"
        fillOpacity=".8"
      />
      <path
        d="M55 63C34 64 19 52 15 31C38 31 54 42 55 63Z"
        fill="currentColor"
        fillOpacity=".45"
      />
      <path
        d="M65 63C86 64 101 52 105 31C82 31 66 42 65 63Z"
        fill="currentColor"
        fillOpacity=".45"
      />
      <path
        d="M52 65C32 70 16 65 5 51C27 44 45 50 52 65Z"
        fill="currentColor"
        fillOpacity=".25"
      />
      <path
        d="M68 65C88 70 104 65 115 51C93 44 75 50 68 65Z"
        fill="currentColor"
        fillOpacity=".25"
      />
    </svg>
  );
}

export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 80 80"
      fill="none"
    >
      <path d="M6 74V28C6 16 16 6 28 6H74" stroke="currentColor" />
      <path
        d="M17 62V31C17 23 23 17 31 17H62"
        stroke="currentColor"
        strokeOpacity=".45"
      />
      <path
        d="M7 37C23 36 35 24 36 7M17 50C30 47 47 30 50 17"
        stroke="currentColor"
        strokeOpacity=".6"
      />
    </svg>
  );
}
