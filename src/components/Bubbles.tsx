import { useMemo } from "react";

export function Bubbles({ count = 14 }: { count?: number }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 6 + Math.random() * 22;
        return {
          key: i,
          left: `${Math.random() * 100}%`,
          size,
          duration: 12 + Math.random() * 18,
          delay: Math.random() * -20,
        };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.key}
          className="bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
