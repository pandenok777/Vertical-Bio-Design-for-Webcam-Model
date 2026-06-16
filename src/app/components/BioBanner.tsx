import { useRef, useState, useCallback, useEffect } from "react";
import {
  Heart, Star, Gift, Camera, MessageCircle, Zap, Download,
  Pencil, Check, X, Plus, Trash2, Image as ImageIcon, Upload, Shuffle,
} from "lucide-react";
import { toPng } from "html-to-image";
import { FONTS } from "./data/fonts";
import { THEMES, type ColorTheme } from "./data/themes";
import { CORNERS } from "./data/corners";
import { DIVIDERS } from "./data/dividers";

// ─── helpers ───────────────────────────────────────────────────────────────

function pickOther(cur: number, max: number) {
  if (max <= 1) return 0;
  let n: number;
  do { n = Math.floor(Math.random() * max); } while (n === cur);
  return n;
}

// ─── Editable inline field ─────────────────────────────────────────────────

function E({
  value, onChange, editing, style = {}, className = "", multiline = false,
}: {
  value: string; onChange: (v: string) => void; editing: boolean;
  style?: React.CSSProperties; className?: string; multiline?: boolean;
}) {
  const base = "outline-none border-b border-dashed w-full bg-transparent";
  if (!editing) return <span className={className} style={style}>{value}</span>;
  if (multiline)
    return <textarea value={value} onChange={e => onChange(e.target.value)}
      rows={3} className={`${base} resize-none ${className}`} style={style} />;
  return <input value={value} onChange={e => onChange(e.target.value)}
    className={`${base} ${className}`} style={style} />;
}

// ─── Photo slot ────────────────────────────────────────────────────────────

function PhotoSlot({ src, onUpload, editing, className = "", label = "Photo", round = false }:
  { src: string | null; onUpload: (d: string) => void; editing: boolean; className?: string; label?: string; round?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const shape = round ? "rounded-full" : "rounded-xl";
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => onUpload(ev.target?.result as string); r.readAsDataURL(f);
  };
  return (
    <div className={`relative overflow-hidden ${shape} ${className}`}>
      {src
        ? <img src={src} alt={label} className={`w-full h-full object-cover ${shape}`} />
        : <div className={`w-full h-full flex flex-col items-center justify-center gap-1 ${shape}`}
            style={{ background: "linear-gradient(145deg,#2e0050,#1a0035)" }}>
            <ImageIcon size={20} className="opacity-25 text-purple-300" />
            <span className="text-xs opacity-25 text-purple-300" style={{ fontFamily: "sans-serif" }}>{label}</span>
          </div>
      }
      {editing && (
        <button onClick={() => ref.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
          <Upload size={18} className="text-white" />
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, onChange, editing, color, font, onAdd }: {
  icon: any; label: string; onChange: (v: string) => void; editing: boolean;
  color: string; font: string; onAdd?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={12} style={{ color }} />
      <E value={label} onChange={onChange} editing={editing}
        className="tracking-[0.2em] text-xs uppercase"
        style={{ color, fontFamily: font, fontWeight: 400, borderColor: `${color}55` }} />
      <div className="flex-1 h-px" style={{ background: `${color}30` }} />
      {editing && onAdd && (
        <button onClick={onAdd} style={{ color }} className="hover:opacity-60 transition-opacity shrink-0">
          <Plus size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface TipItem { emoji: string; amount: string; label: string }
interface ScheduleItem { day: string; time: string }

// ─── Main ──────────────────────────────────────────────────────────────────

export function BioBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [fontIdx, setFontIdx] = useState(0);
  const [themeIdx, setThemeIdx] = useState(0);
  const [cornerIdx, setCornerIdx] = useState(0);
  const [dividerIdx, setDividerIdx] = useState(0);

  const font = FONTS[fontIdx];
  const theme: ColorTheme = THEMES[themeIdx];
  const renderCorner = CORNERS[cornerIdx];
  const renderDivider = DIVIDERS[dividerIdx];

  const df = `'${font.display}', serif`;
  const bf = `'${font.body}', sans-serif`;

  // Load Google Fonts
  useEffect(() => {
    const id = "bio-gfonts";
    let el = document.getElementById(id) as HTMLLinkElement | null;
    if (!el) { el = document.createElement("link"); el.id = id; el.rel = "stylesheet"; document.head.appendChild(el); }
    el.href = `https://fonts.googleapis.com/css2?${font.googleUrl}&display=swap`;
  }, [font.googleUrl]);

  // ── Text state ──────────────────────────────────────────────────────────
  const [platformLabel, setPlatformLabel] = useState("Chaturbate");
  const [name, setName] = useState("Valeria Rose");
  const [tagline, setTagline] = useState("✦ Your Fantasy ✦");
  const [about, setAbout] = useState("Welcome to my room, darling 💜 I'm a passionate, playful, and creative soul who loves connecting with amazing people from around the world.");

  const [fansVal, setFansVal] = useState("12.4K");
  const [fansLbl, setFansLbl] = useState("Fans");
  const [ratingVal, setRatingVal] = useState("5.0 ★");
  const [ratingLbl, setRatingLbl] = useState("Rating");
  const [showsVal, setShowsVal] = useState("Daily");
  const [showsLbl, setShowsLbl] = useState("Shows");

  const [scheduleHdr, setScheduleHdr] = useState("Schedule");
  const [tipHdr, setTipHdr] = useState("Tip Menu");
  const [rulesHdr, setRulesHdr] = useState("Room Rules");

  const [handle, setHandle] = useState("@ValeriaRose");
  const [followLbl, setFollowLbl] = useState("Follow me everywhere");
  const [footerTxt, setFooterTxt] = useState("Made with 💜 on Chaturbate");

  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { day: "Mon — Wed", time: "20:00 — 00:00" },
    { day: "Thu — Fri", time: "21:00 — 01:00" },
    { day: "Saturday", time: "18:00 — 02:00" },
    { day: "Sunday", time: "Private only" },
  ]);
  const [tipMenu, setTipMenu] = useState<TipItem[]>([
    { emoji: "💋", amount: "50", label: "Blow kiss" },
    { emoji: "💃", amount: "100", label: "Special dance" },
    { emoji: "📸", amount: "200", label: "Polaroid snap" },
    { emoji: "🔮", amount: "500", label: "Fantasy show" },
    { emoji: "👑", amount: "999", label: "Queen treatment" },
  ]);
  const [rules, setRules] = useState([
    "Be respectful & kind 🌸",
    "No free requests — tip to play 💜",
    "English only in public chat",
    "No drama, only good vibes ✨",
    "Follow Chaturbate rules always",
  ]);

  // ── Photos ──────────────────────────────────────────────────────────────
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);

  // ── Randomize ───────────────────────────────────────────────────────────
  const randomize = () => {
    setFontIdx(i => pickOther(i, FONTS.length));
    setThemeIdx(i => pickOther(i, THEMES.length));
    setCornerIdx(i => pickOther(i, CORNERS.length));
    setDividerIdx(i => pickOther(i, DIVIDERS.length));
  };

  // ── Download ────────────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!bannerRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(bannerRef.current, {
        pixelRatio: 2, cacheBust: true, backgroundColor: theme.pageBackground,
      });
      const a = document.createElement("a");
      a.download = `${name.replace(/\s+/g, "_")}_bio.png`;
      a.href = dataUrl; a.click();
    } finally { setDownloading(false); }
  }, [name, theme.pageBackground]);

  // ── Schedule helpers ────────────────────────────────────────────────────
  const updSch = (i: number, k: keyof ScheduleItem, v: string) =>
    setSchedule(s => s.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const updTip = (i: number, k: keyof TipItem, v: string) =>
    setTipMenu(t => t.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const updRule = (i: number, v: string) =>
    setRules(r => r.map((x, idx) => idx === i ? v : x));

  // ── Shared style shortcuts ───────────────────────────────────────────────
  const border = `${theme.accent}44`;
  const sectionStyle = { background: theme.sectionBg, borderColor: `${theme.accent}22` };

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => setEditing(e => !e)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all"
          style={{ background: editing ? `${theme.accent}22` : `${theme.accent}0e`,
            borderColor: editing ? `${theme.accent}80` : `${theme.accent}44`,
            color: theme.accentText, fontFamily: bf }}>
          {editing ? <><Check size={14} />Готово</> : <><Pencil size={14} />Редактировать</>}
        </button>

        <button onClick={randomize}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all"
          style={{ background: `${theme.accent2}1a`, borderColor: `${theme.accent2}55`,
            color: theme.accentText, fontFamily: bf, boxShadow: `0 0 16px ${theme.accent}22` }}>
          <Shuffle size={14} />Рандом
        </button>

        <button onClick={handleDownload} disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all disabled:opacity-40"
          style={{ background: `linear-gradient(135deg,${theme.accent}1a,${theme.accent2}1a)`,
            borderColor: `${theme.accent}55`, color: theme.accentText, fontFamily: bf,
            boxShadow: `0 0 20px ${theme.accent}1a` }}>
          <Download size={14} />{downloading ? "Сохранение..." : "Скачать PNG"}
        </button>
      </div>

      {/* ── Theme / font info ── */}
      <p className="text-xs opacity-35 text-white" style={{ fontFamily: bf }}>
        {theme.name} · {font.name} · Corner {cornerIdx + 1}/{CORNERS.length} · Line {dividerIdx + 1}/{DIVIDERS.length}
      </p>

      {/* ════════════════════════════════════════════════════════
          BANNER CARD
      ════════════════════════════════════════════════════════ */}
      <div ref={bannerRef} className="relative overflow-hidden rounded-2xl"
        style={{ width: "460px", background: theme.cardGradient,
          boxShadow: `0 0 80px ${theme.glows[0]},0 0 40px ${theme.glows[1]},inset 0 0 80px ${theme.glows[2]}` }}>

        {/* ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,${theme.glows[0]} 0%,transparent 70%)` }} />
        <div className="absolute bottom-40 left-0 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,${theme.glows[1]} 0%,transparent 70%)` }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,${theme.glows[2]} 0%,transparent 70%)` }} />
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${theme.cardBorder}` }} />

        <div className="relative z-10 p-6 flex flex-col items-center gap-4">

          {/* top corners */}
          <div className="flex justify-between w-full -mb-2">
            {renderCorner(theme.accent, theme.accent2, false, false)}
            {renderCorner(theme.accent, theme.accent2, true, false)}
          </div>

          {/* platform label */}
          <div className="flex items-center gap-2">
            <div className="h-px w-12 opacity-55" style={{ background: `linear-gradient(to right,transparent,${theme.accent})` }} />
            <E value={platformLabel} onChange={setPlatformLabel} editing={editing}
              className="tracking-[0.3em] text-xs uppercase"
              style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300, borderColor: border }} />
            <div className="h-px w-12 opacity-55" style={{ background: `linear-gradient(to left,transparent,${theme.accent})` }} />
          </div>

          {/* ── Photo gallery ── */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <PhotoSlot src={photo1} onUpload={setPhoto1} editing={editing} label="Photo 1" className="h-36" />
            <PhotoSlot src={photo2} onUpload={setPhoto2} editing={editing} label="Photo 2" className="h-36" />
          </div>

          {/* ── Avatar ── */}
          <div className="relative -mt-2">
            <div className="w-32 h-32 rounded-full"
              style={{ background: theme.avatarRing, padding: "2.5px",
                boxShadow: `0 0 30px ${theme.accent}80,0 0 60px ${theme.accent}33` }}>
              <PhotoSlot src={avatarSrc} onUpload={setAvatarSrc} editing={editing} label="Avatar" round className="w-full h-full" />
            </div>
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{ background: theme.orbitColors[i % 2],
                  top: `${50 + 52 * Math.sin((deg * Math.PI) / 180)}%`,
                  left: `${50 + 52 * Math.cos((deg * Math.PI) / 180)}%`,
                  transform: "translate(-50%,-50%)", opacity: 0.72,
                  boxShadow: `0 0 6px ${theme.orbitColors[0]}cc` }} />
            ))}
          </div>

          {/* ── Name ── */}
          <div className="text-center w-full">
            {editing
              ? <input value={name} onChange={e => setName(e.target.value)}
                  className="border-b border-dashed outline-none w-full text-center bg-transparent"
                  style={{ fontFamily: df, fontSize: "2rem", fontWeight: 900,
                    color: theme.accentText, borderColor: border }} />
              : <h1 style={{ fontFamily: df, fontSize: "2rem", fontWeight: 900,
                    background: theme.nameGradient, WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.2 }}>
                  {name}
                </h1>
            }
            <E value={tagline} onChange={setTagline} editing={editing}
              className="tracking-[0.25em] text-xs mt-1 uppercase block"
              style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300, borderColor: border }} />
          </div>

          {/* divider */}
          {renderDivider(theme.lineColor, theme.accent2)}

          {/* ── Stats ── */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {[
              { icon: Heart, lbl: fansLbl, setLbl: setFansLbl, val: fansVal, setVal: setFansVal },
              { icon: Star,  lbl: ratingLbl, setLbl: setRatingLbl, val: ratingVal, setVal: setRatingVal },
              { icon: Camera,lbl: showsLbl, setLbl: setShowsLbl, val: showsVal, setVal: setShowsVal },
            ].map(({ icon: Icon, lbl, setLbl, val, setVal }) => (
              <div key={lbl} className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border" style={sectionStyle}>
                <Icon size={16} style={{ color: theme.accent }} />
                <E value={lbl} onChange={setLbl} editing={editing}
                  className="text-xs tracking-widest uppercase text-center"
                  style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300, borderColor: border }} />
                <E value={val} onChange={setVal} editing={editing}
                  className="text-sm text-center"
                  style={{ color: "#fff", fontFamily: df, fontWeight: 700, borderColor: border }} />
              </div>
            ))}
          </div>

          {/* divider */}
          {renderDivider(theme.lineColor, theme.accent2)}

          {/* ── About ── */}
          <div className="w-full text-center px-2">
            <E value={about} onChange={setAbout} editing={editing} multiline
              className="leading-relaxed block"
              style={{ color: theme.accentText, fontFamily: bf, fontStyle: "italic",
                fontWeight: 300, fontSize: "0.95rem", borderColor: border }} />
          </div>

          {/* divider */}
          {renderDivider(theme.lineColor, theme.accent2)}

          {/* ── Schedule ── */}
          <div className="w-full">
            <SectionHeader icon={Zap} label={scheduleHdr} onChange={setScheduleHdr}
              editing={editing} color={theme.accentText} font={bf}
              onAdd={() => setSchedule(s => [...s, { day: "Day", time: "Time" }])} />
            <div className="grid grid-cols-2 gap-2 text-xs">
              {schedule.map((s, i) => (
                <div key={i} className="flex flex-col px-3 py-2 rounded-lg border relative" style={sectionStyle}>
                  {editing ? (
                    <>
                      <input value={s.day} onChange={e => updSch(i, "day", e.target.value)}
                        className="bg-transparent border-b outline-none mb-1 w-full"
                        style={{ color: theme.accentText, borderColor: border, fontFamily: bf, fontWeight: 300 }} />
                      <input value={s.time} onChange={e => updSch(i, "time", e.target.value)}
                        className="bg-transparent border-b outline-none w-full"
                        style={{ color: "#fff", borderColor: border, fontFamily: bf, fontWeight: 500 }} />
                      <button onClick={() => setSchedule(s => s.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 hover:opacity-60" style={{ color: theme.accent }}>
                        <X size={10} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300 }}>{s.day}</span>
                      <span style={{ color: "#fff", fontFamily: bf, fontWeight: 500 }}>{s.time}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* divider */}
          {renderDivider(theme.lineColor, theme.accent2)}

          {/* ── Tip menu ── */}
          <div className="w-full">
            <SectionHeader icon={Gift} label={tipHdr} onChange={setTipHdr}
              editing={editing} color={theme.accentText} font={bf}
              onAdd={() => setTipMenu(t => [...t, { emoji: "🎁", amount: "100", label: "New item" }])} />
            <div className="flex flex-col gap-1.5">
              {tipMenu.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border" style={sectionStyle}>
                  {editing ? (
                    <>
                      <input value={item.emoji} onChange={e => updTip(i, "emoji", e.target.value)}
                        className="bg-transparent text-lg w-8 outline-none" />
                      <input value={item.label} onChange={e => updTip(i, "label", e.target.value)}
                        className="bg-transparent border-b outline-none flex-1 text-xs"
                        style={{ color: theme.accentText, borderColor: border, fontFamily: bf, fontWeight: 300 }} />
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: theme.tipAmountColor }} />
                        <input value={item.amount} onChange={e => updTip(i, "amount", e.target.value)}
                          className="bg-transparent border-b outline-none w-12 text-xs"
                          style={{ color: theme.tipAmountColor, borderColor: `${theme.tipAmountColor}55`, fontFamily: bf, fontWeight: 500 }} />
                      </div>
                      <button onClick={() => setTipMenu(t => t.filter((_, j) => j !== i))}
                        className="hover:opacity-60 shrink-0" style={{ color: theme.accent }}>
                        <Trash2 size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">{item.emoji}</span>
                      <div className="flex-1">
                        <span className="text-xs" style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300 }}>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full opacity-85" style={{ background: theme.tipAmountColor }} />
                        <span className="text-xs" style={{ color: theme.tipAmountColor, fontFamily: bf, fontWeight: 500 }}>{item.amount}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* divider */}
          {renderDivider(theme.lineColor, theme.accent2)}

          {/* ── Rules ── */}
          <div className="w-full">
            <SectionHeader icon={MessageCircle} label={rulesHdr} onChange={setRulesHdr}
              editing={editing} color={theme.accentText} font={bf}
              onAdd={() => setRules(r => [...r, "New rule"])} />
            <ul className="flex flex-col gap-1.5">
              {rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-xs"
                  style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300 }}>
                  <span className="mt-0.5 shrink-0" style={{ color: theme.accent }}>◆</span>
                  {editing ? (
                    <div className="flex flex-1 items-center gap-1">
                      <input value={rule} onChange={e => updRule(i, e.target.value)}
                        className="bg-transparent border-b outline-none flex-1 text-xs"
                        style={{ color: theme.accentText, borderColor: border, fontFamily: bf, fontWeight: 300 }} />
                      <button onClick={() => setRules(r => r.filter((_, j) => j !== i))}
                        className="hover:opacity-60 shrink-0" style={{ color: theme.accent }}>
                        <X size={10} />
                      </button>
                    </div>
                  ) : rule}
                </li>
              ))}
            </ul>
          </div>

          {/* divider */}
          {renderDivider(theme.lineColor, theme.accent2)}

          {/* ── Handle ── */}
          <div className="text-center w-full">
            <E value={followLbl} onChange={setFollowLbl} editing={editing}
              className="text-xs tracking-[0.15em] uppercase block"
              style={{ color: theme.accent, fontFamily: bf, fontWeight: 300, borderColor: border }} />
            <E value={handle} onChange={setHandle} editing={editing}
              className="text-sm mt-1 tracking-widest block"
              style={{ color: "#fff", fontFamily: df, fontWeight: 700, borderColor: border }} />
          </div>

          {/* bottom corners */}
          <div className="flex justify-between w-full -mt-2">
            {renderCorner(theme.accent, theme.accent2, false, true)}
            {renderCorner(theme.accent, theme.accent2, true, true)}
          </div>

          {/* footer */}
          <div className="text-center -mt-2">
            <E value={footerTxt} onChange={setFooterTxt} editing={editing}
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: theme.footerColor, fontFamily: bf, fontWeight: 300, borderColor: border }} />
          </div>

        </div>
      </div>
    </div>
  );
}
