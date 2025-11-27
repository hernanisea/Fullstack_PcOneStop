import { useMemo } from "react";

type Props = {
  value: number;               // 1..5
  onChange?: (n: number) => void; // si viene, es interactivo
  size?: number;               // px
};

export default function Rating({ value, onChange, size = 20 }: Props) {
  const stars = useMemo(() => [1,2,3,4,5], []);
  return (
    <div className="rating d-inline-flex align-items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          aria-label={`star-${s}`}
          onClick={() => onChange?.(s)}
          className="star-btn"
          style={{
            width: size,
            height: size,
            lineHeight: `${size}px`,
            fontSize: size,
            color: s <= value ? "#f5c249" : "#666",
            background: "transparent",
            border: "none",
            cursor: onChange ? "pointer" : "default",
            padding: 0,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
