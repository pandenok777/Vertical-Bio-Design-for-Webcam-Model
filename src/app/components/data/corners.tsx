import type { ReactElement } from "react";

export type CornerRenderer = (c1: string, c2: string, flip: boolean, flipY: boolean) => ReactElement;

const tf = (flip: boolean, flipY: boolean): string | undefined => {
  const x = flip ? "scaleX(-1)" : "";
  const y = flipY ? "scaleY(-1)" : "";
  const val = [x, y].filter(Boolean).join(" ");
  return val || undefined;
};

// unique gradient id per position
const gid = (name: string, flip: boolean, flipY: boolean) =>
  `cg-${name}-${flip ? 1 : 0}${flipY ? 1 : 0}`;

const GradDef = ({ id, c1, c2 }: { id: string; c1: string; c2: string }) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={c1} stopOpacity="0.95" />
      <stop offset="100%" stopColor={c2} stopOpacity="0.35" />
    </linearGradient>
  </defs>
);

// 1 — Ornate curves
export const C_Ornate: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("orn", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 L5 30 Q5 35 10 35 L25 35" stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
      <path d="M5 5 L30 5 Q35 5 35 10 L35 25" stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
      <path d="M10 10 L10 28 Q10 32 14 32 L28 32" stroke={c1} strokeWidth="0.7" fill="none" opacity="0.45" />
      <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
      <circle cx="35" cy="35" r="1.5" fill={c2} opacity="0.7" />
      <circle cx="5" cy="35" r="1" fill={c1} opacity="0.45" />
      <circle cx="35" cy="5" r="1" fill={c1} opacity="0.45" />
    </svg>
  );
};

// 2 — Art Deco parallel lines
export const C_ArtDeco: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("ad", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <line x1="5" y1="5" x2="5" y2="42" stroke={`url(#${id})`} strokeWidth="2" />
      <line x1="5" y1="5" x2="42" y2="5" stroke={`url(#${id})`} strokeWidth="2" />
      <line x1="10" y1="10" x2="10" y2="36" stroke={c1} strokeWidth="0.9" opacity="0.5" />
      <line x1="10" y1="10" x2="36" y2="10" stroke={c1} strokeWidth="0.9" opacity="0.5" />
      <line x1="15" y1="15" x2="15" y2="30" stroke={c2} strokeWidth="0.6" opacity="0.35" />
      <line x1="15" y1="15" x2="30" y2="15" stroke={c2} strokeWidth="0.6" opacity="0.35" />
      <polygon points="5,5 13,5 5,13" fill={c1} opacity="0.85" />
      <circle cx="5" cy="42" r="2" fill={c1} opacity="0.7" />
      <circle cx="42" cy="5" r="2" fill={c1} opacity="0.7" />
    </svg>
  );
};

// 3 — Minimal dots chain
export const C_MinimalDots: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    <line x1="5" y1="5" x2="40" y2="5" stroke={c1} strokeWidth="0.8" opacity="0.5" />
    <line x1="5" y1="5" x2="5" y2="40" stroke={c1} strokeWidth="0.8" opacity="0.5" />
    {[0, 1, 2, 3, 4].map(i => (
      <circle key={i} cx={5} cy={5 + i * 8} r={i === 0 ? 2.8 : 1.3} fill={i === 0 ? c1 : c2} opacity={1 - i * 0.18} />
    ))}
    {[1, 2, 3, 4].map(i => (
      <circle key={i} cx={5 + i * 8} cy={5} r={1.3} fill={c2} opacity={1 - i * 0.18} />
    ))}
  </svg>
);

// 4 — Floral / botanical
export const C_Floral: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("fl", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 Q5 28 25 28 Q5 28 5 48" stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
      <path d="M5 5 Q28 5 28 25 Q28 5 48 5" stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
      <ellipse cx="19" cy="11" rx="7" ry="3" fill={c1} opacity="0.22" transform="rotate(-45 19 11)" />
      <ellipse cx="11" cy="19" rx="7" ry="3" fill={c2} opacity="0.18" transform="rotate(-45 11 19)" />
      <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
      <circle cx="28" cy="28" r="1.5" fill={c1} opacity="0.6" />
    </svg>
  );
};

// 5 — Square bracket
export const C_Brackets: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    <path d="M22 5 L5 5 L5 22" stroke={c1} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <path d="M27 10 L10 10 L10 27" stroke={c1} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.5" />
    <path d="M31 15 L15 15 L15 31" stroke={c2} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.3" />
    <circle cx="5" cy="5" r="2.2" fill={c1} opacity="0.9" />
    <circle cx="22" cy="5" r="1.2" fill={c1} opacity="0.6" />
    <circle cx="5" cy="22" r="1.2" fill={c1} opacity="0.6" />
  </svg>
);

// 6 — Diamond chain
export const C_DiamondChain: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("dc", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <line x1="5" y1="5" x2="40" y2="5" stroke={`url(#${id})`} strokeWidth="0.8" opacity="0.45" />
      <line x1="5" y1="5" x2="5" y2="40" stroke={`url(#${id})`} strokeWidth="0.8" opacity="0.45" />
      {[0, 1, 2].map(i => (
        <polygon key={i}
          points={`5,${5 + i * 12} ${5 + 5},${5 + i * 12 + 5} 5,${5 + i * 12 + 10} ${5 - 5},${5 + i * 12 + 5}`}
          fill="none" stroke={i === 0 ? c1 : c2} strokeWidth={i === 0 ? "1.3" : "0.7"} opacity={1 - i * 0.28} />
      ))}
      {[1, 2].map(i => (
        <polygon key={i}
          points={`${5 + i * 12},5 ${5 + i * 12 + 5},${5 - 5} ${5 + i * 12 + 10},5 ${5 + i * 12 + 5},${5 + 5}`}
          fill="none" stroke={c2} strokeWidth="0.7" opacity={1 - i * 0.28} />
      ))}
      <polygon points="5,5 10,10 5,15 0,10" fill={c1} opacity="0.85" />
    </svg>
  );
};

// 7 — Spiral Celtic
export const C_Spiral: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("sp", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 C5 5 5 36 22 36 C36 36 36 22 36 22 C36 22 36 14 29 14 C23 14 23 22 23 22 C23 26 26 27 29 25"
        stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
      <line x1="5" y1="5" x2="40" y2="5" stroke={c1} strokeWidth="0.7" opacity="0.38" />
      <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
      <circle cx="40" cy="5" r="1.2" fill={c2} opacity="0.5" />
    </svg>
  );
};

// 8 — Astral / Stars
export const C_Astral: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    <line x1="5" y1="5" x2="40" y2="5" stroke={c1} strokeWidth="0.9" opacity="0.45" />
    <line x1="5" y1="5" x2="5" y2="40" stroke={c1} strokeWidth="0.9" opacity="0.45" />
    <polygon points="5,0 6.5,4.5 11.5,4.5 7.5,7.5 9,12 5,9 1,12 2.5,7.5 -1.5,4.5 3.5,4.5" fill={c1} opacity="0.85" />
    <polygon points="22,5 23,8 26,8 23.5,9.8 24.5,13 22,11.2 19.5,13 20.5,9.8 18,8 21,8" fill={c2} opacity="0.55" />
    <polygon points="5,22 6,25 9,25 6.5,26.8 7.5,30 5,28.2 2.5,30 3.5,26.8 1,25 4,25" fill={c2} opacity="0.55" />
    <circle cx="38" cy="5" r="1.4" fill={c2} opacity="0.6" />
    <circle cx="5" cy="38" r="1.4" fill={c2} opacity="0.6" />
  </svg>
);

// 9 — Crosshatch / Grid
export const C_Crosshatch: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    {[5, 12, 19, 26].map(y => (
      <line key={y} x1="5" y1={y} x2={y === 5 ? 40 : 5 + (26 - y) + 7} y2={y} stroke={c1} strokeWidth="0.7" opacity={1 - (y - 5) / 30} />
    ))}
    {[5, 12, 19, 26].map(x => (
      <line key={x} x1={x} y1="5" x2={x} y2={x === 5 ? 40 : 5 + (26 - x) + 7} stroke={c1} strokeWidth="0.7" opacity={1 - (x - 5) / 30} />
    ))}
    <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
    <circle cx="40" cy="5" r="1.2" fill={c2} opacity="0.5" />
    <circle cx="5" cy="40" r="1.2" fill={c2} opacity="0.5" />
  </svg>
);

// 10 — Wave
export const C_Wave: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("wv", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 C10 12 15 0 20 8 C25 16 30 4 35 12 C38 18 40 22 40 22"
        stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
      <path d="M5 5 C12 10 0 15 8 20 C16 25 4 30 12 35 C18 38 22 40 22 40"
        stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
      <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
    </svg>
  );
};

// 11 — Triangle stack
export const C_TriangleStack: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    <polygon points="5,5 20,5 5,20" fill={c1} opacity="0.8" />
    <polygon points="5,22 16,22 5,33" fill={c1} opacity="0.5" />
    <polygon points="5,35 12,35 5,42" fill={c2} opacity="0.35" />
    <polygon points="22,5 33,5 22,16" fill={c1} opacity="0.5" />
    <polygon points="35,5 42,5 35,12" fill={c2} opacity="0.35" />
    <line x1="5" y1="5" x2="42" y2="5" stroke={c1} strokeWidth="0.7" opacity="0.4" />
    <line x1="5" y1="5" x2="5" y2="42" stroke={c1} strokeWidth="0.7" opacity="0.4" />
  </svg>
);

// 12 — Rune / Sigil
export const C_Rune: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("rn", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 L5 38" stroke={`url(#${id})`} strokeWidth="1.5" />
      <path d="M5 5 L38 5" stroke={`url(#${id})`} strokeWidth="1.5" />
      <path d="M5 5 L22 22" stroke={c1} strokeWidth="1" opacity="0.6" />
      <path d="M5 18 L18 18" stroke={c2} strokeWidth="0.8" opacity="0.5" />
      <path d="M18 5 L18 18" stroke={c2} strokeWidth="0.8" opacity="0.5" />
      <path d="M5 30 L14 30 L14 38" stroke={c2} strokeWidth="0.7" fill="none" opacity="0.4" />
      <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.95" />
      <circle cx="22" cy="22" r="1.5" fill={c2} opacity="0.7" />
    </svg>
  );
};

// 13 — Lotus / Petal ring
export const C_Lotus: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("lt", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 Q5 20 14 20 Q5 20 5 35" stroke={`url(#${id})`} strokeWidth="1.2" fill="none" />
      <path d="M5 5 Q20 5 20 14 Q20 5 35 5" stroke={`url(#${id})`} strokeWidth="1.2" fill="none" />
      <path d="M5 5 Q14 14 5 22" stroke={c1} strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M5 5 Q14 14 22 5" stroke={c1} strokeWidth="0.8" fill="none" opacity="0.4" />
      <circle cx="5" cy="5" r="3" fill={c1} opacity="0.9" />
      <circle cx="14" cy="14" r="1.8" fill={c2} opacity="0.6" />
    </svg>
  );
};

// 14 — Arrow / Chevron
export const C_Chevron: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    {[0, 6, 12].map(offset => (
      <path key={offset}
        d={`M${5 + offset} ${24 + offset} L${5 + offset} ${5 + offset} L${24 + offset} ${5 + offset}`}
        stroke={offset === 0 ? c1 : c2}
        strokeWidth={offset === 0 ? "1.8" : offset === 6 ? "1" : "0.6"}
        fill="none" strokeLinecap="round"
        opacity={1 - offset / 20} />
    ))}
    <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
  </svg>
);

// 15 — Filigree swirl
export const C_Filigree: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("fg", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 C5 20 15 25 25 15 C35 5 40 15 30 25 C20 35 5 30 5 40"
        stroke={`url(#${id})`} strokeWidth="1.4" fill="none" />
      <path d="M5 5 C20 5 25 15 15 25 C5 35 15 40 25 30"
        stroke={c2} strokeWidth="0.7" fill="none" opacity="0.45" />
      <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
      <circle cx="5" cy="40" r="1.5" fill={c2} opacity="0.6" />
    </svg>
  );
};

// 16 — Cross / Plus motif
export const C_Cross: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    <line x1="5" y1="5" x2="5" y2="40" stroke={c1} strokeWidth="1.5" opacity="0.8" />
    <line x1="5" y1="5" x2="40" y2="5" stroke={c1} strokeWidth="1.5" opacity="0.8" />
    {[5, 16, 27].map(pos => (
      <g key={pos}>
        <line x1={pos - 3} y1="5" x2={pos + 3} y2="5" stroke={c2} strokeWidth="0.8" opacity={0.7 - pos / 60} />
        <line x1="5" y1={pos - 3} x2="5" y2={pos + 3} stroke={c2} strokeWidth="0.8" opacity={0.7 - pos / 60} />
      </g>
    ))}
    <rect x="3" y="3" width="4" height="4" fill={c1} opacity="0.9" />
    <circle cx="40" cy="5" r="1.5" fill={c2} opacity="0.5" />
    <circle cx="5" cy="40" r="1.5" fill={c2} opacity="0.5" />
  </svg>
);

// 17 — Baroque scroll
export const C_Baroque: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("bq", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 Q5 15 12 15 Q20 15 20 8 Q20 2 14 4 Q10 6 12 10"
        stroke={`url(#${id})`} strokeWidth="1.4" fill="none" />
      <path d="M5 5 Q15 5 15 12 Q15 20 8 20 Q2 20 4 14 Q6 10 10 12"
        stroke={`url(#${id})`} strokeWidth="1.4" fill="none" />
      <line x1="5" y1="22" x2="5" y2="38" stroke={c1} strokeWidth="0.9" opacity="0.45" />
      <line x1="22" y1="5" x2="38" y2="5" stroke={c1} strokeWidth="0.9" opacity="0.45" />
      <circle cx="5" cy="5" r="2.2" fill={c1} opacity="0.9" />
    </svg>
  );
};

// 18 — Hex tile
export const C_Hex: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    <polygon points="11,5 17,5 20,10 17,15 11,15 8,10" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.85" />
    <polygon points="5,16 8,11 12,11 15,16 12,21 8,21" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.55" />
    <polygon points="19,16 22,11 26,11 29,16 26,21 22,21" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.4" />
    <polygon points="5,27 8,22 12,22 15,27 12,32 8,32" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.3" />
    <circle cx="14" cy="10" r="2" fill={c1} opacity="0.8" />
  </svg>
);

// 19 — Lace / Dot grid
export const C_Lace: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    {[[5,5,2.5,c1,0.9],[12,5,1.5,c1,0.7],[19,5,1,c2,0.5],[26,5,0.8,c2,0.35],
      [5,12,1.5,c1,0.7],[12,12,1,c2,0.5],[19,12,0.7,c2,0.3],
      [5,19,1,c2,0.5],[12,19,0.7,c2,0.3],
      [5,26,0.8,c2,0.35]].map(([cx,cy,r,fill,op],i) => (
      <circle key={i} cx={cx as number} cy={cy as number} r={r as number} fill={fill as string} opacity={op as number} />
    ))}
    <line x1="5" y1="5" x2="28" y2="5" stroke={c1} strokeWidth="0.6" opacity="0.3" />
    <line x1="5" y1="5" x2="5" y2="28" stroke={c1} strokeWidth="0.6" opacity="0.3" />
  </svg>
);

// 20 — Feather / Spine
export const C_Feather: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("fe", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 L26 26" stroke={`url(#${id})`} strokeWidth="1.5" />
      {[8, 12, 16, 20].map((s, i) => (
        <g key={s}>
          <line x1={s} y1={s} x2={s + 6} y2={s - 4} stroke={c1} strokeWidth="0.8" opacity={0.8 - i * 0.15} />
          <line x1={s} y1={s} x2={s - 4} y2={s + 6} stroke={c2} strokeWidth="0.8" opacity={0.8 - i * 0.15} />
        </g>
      ))}
      <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
      <circle cx="26" cy="26" r="1.5" fill={c2} opacity="0.6" />
    </svg>
  );
};

// 21 — Concentric arcs
export const C_Arcs: CornerRenderer = (c1, c2, flip, flipY) => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
    {[10, 20, 30, 40].map((r, i) => (
      <path key={r}
        d={`M5 ${5 + r} A${r} ${r} 0 0 1 ${5 + r} 5`}
        stroke={i < 2 ? c1 : c2} strokeWidth={i === 0 ? "1.5" : "0.7"}
        fill="none" opacity={1 - i * 0.2} />
    ))}
    <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
  </svg>
);

// 22 — Wing / Feathered bracket
export const C_Wing: CornerRenderer = (c1, c2, flip, flipY) => {
  const id = gid("wg", flip, flipY);
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ transform: tf(flip, flipY) }}>
      <GradDef id={id} c1={c1} c2={c2} />
      <path d="M5 5 L5 30 Q5 36 11 36" stroke={`url(#${id})`} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M5 5 L30 5 Q36 5 36 11" stroke={`url(#${id})`} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M5 12 Q10 12 12 8" stroke={c1} strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M5 19 Q14 19 16 13" stroke={c1} strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M12 5 Q12 10 8 12" stroke={c1} strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M19 5 Q19 14 13 16" stroke={c1} strokeWidth="0.8" fill="none" opacity="0.4" />
      <circle cx="5" cy="5" r="2.5" fill={c1} opacity="0.9" />
    </svg>
  );
};

export const CORNERS: CornerRenderer[] = [
  C_Ornate, C_ArtDeco, C_MinimalDots, C_Floral, C_Brackets,
  C_DiamondChain, C_Spiral, C_Astral, C_Crosshatch, C_Wave,
  C_TriangleStack, C_Rune, C_Lotus, C_Chevron, C_Filigree,
  C_Cross, C_Baroque, C_Hex, C_Lace, C_Feather, C_Arcs, C_Wing,
];
