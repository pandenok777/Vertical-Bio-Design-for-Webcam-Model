import type { ReactElement } from "react";

export type DividerRenderer = (color: string, color2: string) => ReactElement;

// 1 — Gradient line + centre dot
export const D_DotLine: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-dl" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="25%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="50%" stopColor={c1} stopOpacity="1" />
        <stop offset="75%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-dl)" strokeWidth="1" />
    <circle cx="200" cy="10" r="3" fill={c1} opacity="0.9" />
    <circle cx="160" cy="10" r="1.5" fill={c2} opacity="0.6" />
    <circle cx="240" cy="10" r="1.5" fill={c2} opacity="0.6" />
  </svg>
);

// 2 — Diamond centre
export const D_Diamond: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-dm" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="40%" stopColor={c1} stopOpacity="0.7" />
        <stop offset="60%" stopColor={c1} stopOpacity="0.7" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="185" y2="10" stroke="url(#d-dm)" strokeWidth="0.9" />
    <line x1="215" y1="10" x2="400" y2="10" stroke="url(#d-dm)" strokeWidth="0.9" />
    <polygon points="200,4 208,10 200,16 192,10" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.9" />
    <polygon points="200,7 205,10 200,13 195,10" fill={c1} opacity="0.35" />
    <circle cx="178" cy="10" r="1.5" fill={c2} opacity="0.6" />
    <circle cx="222" cy="10" r="1.5" fill={c2} opacity="0.6" />
  </svg>
);

// 3 — Double line
export const D_DoubleLine: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-dbl" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="20%" stopColor={c1} stopOpacity="0.8" />
        <stop offset="80%" stopColor={c1} stopOpacity="0.8" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="8" x2="400" y2="8" stroke="url(#d-dbl)" strokeWidth="0.8" />
    <line x1="0" y1="12" x2="400" y2="12" stroke="url(#d-dbl)" strokeWidth="0.8" />
    <circle cx="200" cy="10" r="2.5" fill={c1} opacity="0.85" />
    <circle cx="200" cy="10" r="5" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.5" />
  </svg>
);

// 4 — Dashed line
export const D_Dashed: DividerRenderer = (c1, _c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-dsh" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="15%" stopColor={c1} stopOpacity="0.8" />
        <stop offset="85%" stopColor={c1} stopOpacity="0.8" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-dsh)" strokeWidth="1.2"
      strokeDasharray="8 6" />
  </svg>
);

// 5 — Wave line
export const D_Wave: DividerRenderer = (c1, _c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-wv" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="15%" stopColor={c1} stopOpacity="0.9" />
        <stop offset="85%" stopColor={c1} stopOpacity="0.9" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path d="M0,10 C20,5 40,15 60,10 C80,5 100,15 120,10 C140,5 160,15 180,10 C200,5 220,15 240,10 C260,5 280,15 300,10 C320,5 340,15 360,10 C380,5 400,15 400,10"
      stroke="url(#d-wv)" strokeWidth="1.2" fill="none" />
  </svg>
);

// 6 — Star chain
export const D_Stars: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-st" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="20%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="80%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-st)" strokeWidth="0.7" />
    {[100, 150, 200, 250, 300].map(x => (
      <polygon key={x}
        points={`${x},7 ${x+1.5},9.5 ${x+4},9.5 ${x+2},11.5 ${x+2.5},14 ${x},12.5 ${x-2.5},14 ${x-2},11.5 ${x-4},9.5 ${x-1.5},9.5`}
        fill={x === 200 ? c1 : c2} opacity={x === 200 ? 0.9 : 0.55} />
    ))}
  </svg>
);

// 7 — Dots chain
export const D_DotChain: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-dc" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="15%" stopColor={c1} stopOpacity="0.5" />
        <stop offset="85%" stopColor={c1} stopOpacity="0.5" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-dc)" strokeWidth="0.6" />
    {[80, 110, 140, 170, 200, 230, 260, 290, 320].map(x => (
      <circle key={x} cx={x} cy={10} r={x === 200 ? 3 : x === 170 || x === 230 ? 2 : 1.2}
        fill={x === 200 ? c1 : c2} opacity={x === 200 ? 0.9 : 0.55} />
    ))}
  </svg>
);

// 8 — Triple diamond
export const D_TripleDiamond: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-td" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="30%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="70%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="175" y2="10" stroke="url(#d-td)" strokeWidth="0.8" />
    <line x1="225" y1="10" x2="400" y2="10" stroke="url(#d-td)" strokeWidth="0.8" />
    <polygon points="188,6 196,10 188,14 180,10" fill="none" stroke={c2} strokeWidth="1" opacity="0.7" />
    <polygon points="200,4 208,10 200,16 192,10" fill="none" stroke={c1} strokeWidth="1.4" opacity="0.95" />
    <polygon points="212,6 220,10 212,14 204,10" fill="none" stroke={c2} strokeWidth="1" opacity="0.7" />
    <polygon points="200,7 205,10 200,13 195,10" fill={c1} opacity="0.4" />
  </svg>
);

// 9 — Ornate flourish
export const D_Flourish: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 24" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-fl" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="20%" stopColor={c1} stopOpacity="0.7" />
        <stop offset="80%" stopColor={c1} stopOpacity="0.7" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="12" x2="155" y2="12" stroke="url(#d-fl)" strokeWidth="0.8" />
    <line x1="245" y1="12" x2="400" y2="12" stroke="url(#d-fl)" strokeWidth="0.8" />
    <path d="M165 12 Q175 6 185 12 Q175 18 165 12" stroke={c2} strokeWidth="1" fill="none" opacity="0.65" />
    <path d="M215 12 Q225 6 235 12 Q225 18 215 12" stroke={c2} strokeWidth="1" fill="none" opacity="0.65" />
    <circle cx="200" cy="12" r="4" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.85" />
    <circle cx="200" cy="12" r="2" fill={c1} opacity="0.8" />
  </svg>
);

// 10 — Arrow chain
export const D_Arrows: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-ar" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="15%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="85%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-ar)" strokeWidth="0.7" />
    {[140, 165, 200, 235, 260].map(x => (
      <path key={x} d={`M${x - 4},7 L${x},10 L${x - 4},13`}
        stroke={x === 200 ? c1 : c2} strokeWidth={x === 200 ? "1.3" : "0.8"}
        fill="none" opacity={x === 200 ? 0.9 : 0.55} />
    ))}
  </svg>
);

// 11 — Cross-stitch
export const D_CrossStitch: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-cs" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="15%" stopColor={c1} stopOpacity="0.5" />
        <stop offset="85%" stopColor={c1} stopOpacity="0.5" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-cs)" strokeWidth="0.6" />
    {[100, 130, 160, 190, 200, 210, 240, 270, 300].map(x => (
      <g key={x}>
        <line x1={x - 3} y1="7" x2={x + 3} y2="13" stroke={x === 200 ? c1 : c2}
          strokeWidth={x === 200 ? "1.2" : "0.7"} opacity={x === 200 ? 0.9 : 0.5} />
        <line x1={x + 3} y1="7" x2={x - 3} y2="13" stroke={x === 200 ? c1 : c2}
          strokeWidth={x === 200 ? "1.2" : "0.7"} opacity={x === 200 ? 0.9 : 0.5} />
      </g>
    ))}
  </svg>
);

// 12 — Zigzag
export const D_Zigzag: DividerRenderer = (c1, _c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-zz" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="12%" stopColor={c1} stopOpacity="0.85" />
        <stop offset="88%" stopColor={c1} stopOpacity="0.85" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <polyline
      points="0,10 20,6 40,14 60,6 80,14 100,6 120,14 140,6 160,14 180,6 200,14 220,6 240,14 260,6 280,14 300,6 320,14 340,6 360,14 380,6 400,10"
      stroke="url(#d-zz)" strokeWidth="1" fill="none" />
  </svg>
);

// 13 — Rose / Petal
export const D_Rose: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 24" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-rs" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="20%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="80%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="12" x2="168" y2="12" stroke="url(#d-rs)" strokeWidth="0.8" />
    <line x1="232" y1="12" x2="400" y2="12" stroke="url(#d-rs)" strokeWidth="0.8" />
    <path d="M200,8 C205,8 208,12 200,16 C192,12 195,8 200,8" fill={c1} opacity="0.6" />
    <path d="M200,8 C200,3 196,6 200,12 C204,6 200,3 200,8" fill={c2} opacity="0.45" />
    <circle cx="200" cy="12" r="2" fill={c1} opacity="0.85" />
    <circle cx="175" cy="12" r="1.4" fill={c2} opacity="0.55" />
    <circle cx="225" cy="12" r="1.4" fill={c2} opacity="0.55" />
  </svg>
);

// 14 — Infinity-like
export const D_Infinity: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-inf" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="20%" stopColor={c1} stopOpacity="0.65" />
        <stop offset="80%" stopColor={c1} stopOpacity="0.65" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="170" y2="10" stroke="url(#d-inf)" strokeWidth="0.8" />
    <line x1="230" y1="10" x2="400" y2="10" stroke="url(#d-inf)" strokeWidth="0.8" />
    <path d="M185,10 C185,5 192,5 200,10 C208,15 215,15 215,10 C215,5 208,5 200,10 C192,15 185,15 185,10"
      stroke={c1} strokeWidth="1.3" fill="none" opacity="0.9" />
    <circle cx="200" cy="10" r="1.5" fill={c2} opacity="0.7" />
  </svg>
);

// 15 — Crown centre
export const D_Crown: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 22" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-cr" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="25%" stopColor={c1} stopOpacity="0.65" />
        <stop offset="75%" stopColor={c1} stopOpacity="0.65" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="16" x2="178" y2="16" stroke="url(#d-cr)" strokeWidth="0.8" />
    <line x1="222" y1="16" x2="400" y2="16" stroke="url(#d-cr)" strokeWidth="0.8" />
    <path d="M183,16 L187,8 L192,13 L200,5 L208,13 L213,8 L217,16 Z"
      stroke={c1} strokeWidth="1.2" fill="none" opacity="0.9" />
    <circle cx="187" cy="8" r="1.5" fill={c2} opacity="0.7" />
    <circle cx="200" cy="5" r="2" fill={c1} opacity="0.9" />
    <circle cx="213" cy="8" r="1.5" fill={c2} opacity="0.7" />
  </svg>
);

// 16 — Heartbeat
export const D_Heartbeat: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-hb" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="10%" stopColor={c1} stopOpacity="0.7" />
        <stop offset="90%" stopColor={c1} stopOpacity="0.7" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <polyline
      points="0,10 150,10 160,10 170,4 178,16 186,4 192,10 200,10 208,10 214,4 222,16 230,4 240,10 250,10 400,10"
      stroke="url(#d-hb)" strokeWidth="1.1" fill="none" />
  </svg>
);

// 17 — Dotted bracket
export const D_DottedBracket: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-db" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="15%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="85%" stopColor={c1} stopOpacity="0.6" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-db)" strokeWidth="0.7" />
    <path d="M175,6 L170,6 L170,14 L175,14" stroke={c1} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />
    <path d="M225,6 L230,6 L230,14 L225,14" stroke={c1} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />
    <circle cx="200" cy="10" r="3" fill={c1} opacity="0.85" />
    <circle cx="188" cy="10" r="1.5" fill={c2} opacity="0.6" />
    <circle cx="212" cy="10" r="1.5" fill={c2} opacity="0.6" />
  </svg>
);

// 18 — Sparkle chain
export const D_Sparkle: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-sp" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="15%" stopColor={c1} stopOpacity="0.55" />
        <stop offset="85%" stopColor={c1} stopOpacity="0.55" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-sp)" strokeWidth="0.7" />
    {[120, 160, 200, 240, 280].map(x => {
      const s = x === 200 ? 1.4 : 0.8;
      const op = x === 200 ? 0.9 : 0.55;
      const col = x === 200 ? c1 : c2;
      return (
        <g key={x}>
          <line x1={x} y1={10 - 5 * s} x2={x} y2={10 + 5 * s} stroke={col} strokeWidth={s} opacity={op} />
          <line x1={x - 5 * s} y1="10" x2={x + 5 * s} y2="10" stroke={col} strokeWidth={s} opacity={op} />
          <line x1={x - 3.5 * s} y1={10 - 3.5 * s} x2={x + 3.5 * s} y2={10 + 3.5 * s} stroke={col} strokeWidth={s * 0.7} opacity={op * 0.7} />
          <line x1={x + 3.5 * s} y1={10 - 3.5 * s} x2={x - 3.5 * s} y2={10 + 3.5 * s} stroke={col} strokeWidth={s * 0.7} opacity={op * 0.7} />
        </g>
      );
    })}
  </svg>
);

// 19 — Beaded necklace
export const D_Beaded: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-bd" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="12%" stopColor={c1} stopOpacity="0.4" />
        <stop offset="88%" stopColor={c1} stopOpacity="0.4" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="10" x2="400" y2="10" stroke="url(#d-bd)" strokeWidth="0.5" />
    {Array.from({ length: 19 }, (_, i) => {
      const x = 60 + i * 16;
      const isCentre = i === 9;
      const isNear = i === 8 || i === 10;
      return (
        <circle key={i} cx={x} cy={10} r={isCentre ? 3.5 : isNear ? 2.2 : 1.4}
          fill={isCentre ? c1 : c2}
          stroke={isCentre ? c1 : "none"}
          strokeWidth="0.5"
          opacity={isCentre ? 0.9 : isNear ? 0.7 : 0.5} />
      );
    })}
  </svg>
);

// 20 — Royal ornament
export const D_Royal: DividerRenderer = (c1, c2) => (
  <svg viewBox="0 0 400 24" className="w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="d-ry" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="18%" stopColor={c1} stopOpacity="0.65" />
        <stop offset="82%" stopColor={c1} stopOpacity="0.65" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <line x1="0" y1="12" x2="160" y2="12" stroke="url(#d-ry)" strokeWidth="0.8" />
    <line x1="240" y1="12" x2="400" y2="12" stroke="url(#d-ry)" strokeWidth="0.8" />
    <path d="M165,12 Q175,6 185,12 Q175,18 165,12" fill={c2} opacity="0.4" stroke={c2} strokeWidth="0.7" />
    <path d="M215,12 Q225,6 235,12 Q225,18 215,12" fill={c2} opacity="0.4" stroke={c2} strokeWidth="0.7" />
    <path d="M190,8 L200,5 L210,8 L210,16 L200,19 L190,16 Z" fill="none" stroke={c1} strokeWidth="1.1" opacity="0.9" />
    <circle cx="200" cy="12" r="2.5" fill={c1} opacity="0.8" />
  </svg>
);

export const DIVIDERS: DividerRenderer[] = [
  D_DotLine, D_Diamond, D_DoubleLine, D_Dashed, D_Wave,
  D_Stars, D_DotChain, D_TripleDiamond, D_Flourish, D_Arrows,
  D_CrossStitch, D_Zigzag, D_Rose, D_Infinity, D_Crown,
  D_Heartbeat, D_DottedBracket, D_Sparkle, D_Beaded, D_Royal,
];
