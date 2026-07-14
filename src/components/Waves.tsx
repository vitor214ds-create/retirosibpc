export function Waves({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <div
      className={`waves ${className}`}
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 2880 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path
            id="wavepath"
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          />
        </defs>
        <g className="wave-move-slow" fill="currentColor" opacity="0.5">
          <use href="#wavepath" x="0" />
          <use href="#wavepath" x="1440" />
        </g>
        <g className="wave-move" fill="currentColor">
          <use href="#wavepath" x="0" y="10" />
          <use href="#wavepath" x="1440" y="10" />
        </g>
      </svg>
    </div>
  );
}
