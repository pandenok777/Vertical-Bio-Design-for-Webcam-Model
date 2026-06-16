import { useRef, useState, useCallback, useEffect } from "react";
import { Heart, Star, Gift, Camera, MessageCircle, Zap, Download, Pencil, Check, X, Plus, Trash2, Image as ImageIcon, Upload, Code, Copy, Shuffle } from "lucide-react";
import { toPng } from "html-to-image";
import html2canvas from "html2canvas";

function inlineStyles(src: Element, dst: Element) {
  const computed = window.getComputedStyle(src);
  const target = dst as HTMLElement;
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    target.style.setProperty(prop, computed.getPropertyValue(prop), computed.getPropertyPriority(prop));
  }
  for (let i = 0; i < src.children.length; i++) {
    inlineStyles(src.children[i], dst.children[i]);
  }
}
import { FONTS } from "./data/fonts";
import { THEMES, type ColorTheme } from "./data/themes";
import { CORNERS } from "./data/corners";
import { DIVIDERS } from "./data/dividers";

// ─── helpers ───────────────────────────────────────────────────────────────
function pickOther(cur: number, max: number) {
  if (max <= 1) return cur;
  let n = Math.floor(Math.random() * max);
  return n === cur ? (n + 1) % max : n;
}

async function waitForResources(container: HTMLElement) {
  if (document.fonts) {
    await document.fonts.ready;
  }

  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    images.map((img) =>
      img.complete && img.naturalWidth !== 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            if (img.complete) resolve();
          })
    )
  );

  // give the browser a moment to finish paint/layout
  await new Promise((r) => setTimeout(r, 300));
}

async function getAllStyles(): Promise<string> {
  const parts: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        parts.push(rule.cssText);
      }
    } catch (e) {
      // CORS-protected stylesheet — try to fetch it directly
      if (sheet.href) {
        try {
          const res = await fetch(sheet.href);
          parts.push(await res.text());
        } catch (err) {
          console.warn("Failed to fetch stylesheet", sheet.href, err);
        }
      }
    }
  }
  return parts.join("\n");
}

async function captureElement(element: HTMLElement, backgroundColor: string): Promise<string> {
  await waitForResources(element);

  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const clone = element.cloneNode(true) as HTMLElement;

  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.margin = "0";
  clone.style.position = "relative";
  clone.style.maxWidth = "none";
  clone.style.minWidth = "auto";
  clone.style.transform = "none";
  clone.style.overflow = "hidden";
  clone.style.boxSizing = "border-box";

  const html = clone.outerHTML;
  const css = await getAllStyles();

  const fontLink = document.getElementById("bio-gfonts") as HTMLLinkElement | null;
  let fontCss = "";
  if (fontLink?.href) {
    try {
      const res = await fetch(fontLink.href);
      fontCss = await res.text();
    } catch (e) {
      console.warn("Failed to fetch font CSS", e);
    }
  }

  try {
    const response = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, css, fontCss, width, height, backgroundColor }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server render failed: ${text}`);
    }

    const data = await response.json();
    if (data.image) return data.image;
    throw new Error("Server render returned no image");
  } catch (err) {
    console.warn("Server render failed, falling back to client-side capture:", err);
  }

  // Fallback: client-side rendering
  inlineStyles(element, clone);
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.style.overflow = "hidden";
  wrapper.style.pointerEvents = "none";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  await new Promise((r) => setTimeout(r, 250));

  let dataUrl = "";

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      backgroundColor,
      logging: false,
      width,
      height,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: width,
      windowHeight: height,
    });
    dataUrl = canvas.toDataURL("image/png");
  } catch (err) {
    console.warn("html2canvas (foreignObjectRendering) failed:", err);
  }

  if (!dataUrl) {
    try {
      dataUrl = await toPng(clone, {
        pixelRatio: 2,
        cacheBust: false,
        skipFonts: true,
        backgroundColor,
      });
    } catch (err) {
      console.warn("html-to-image toPng failed:", err);
    }
  }

  if (!dataUrl) {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor,
      logging: false,
    });
    dataUrl = canvas.toDataURL("image/png");
  }

  document.body.removeChild(wrapper);
  return dataUrl;
}

function EditableText({ value, onChange, editing, style, className, multiline }: { value: string; onChange: (v: string) => void; editing: boolean; style?: React.CSSProperties; className?: string; multiline?: boolean; }) {
  const base = "outline-none border-b border-dashed w-full bg-transparent";
  if (!editing) return <span className={className} style={style}>{value}</span>;
  if (multiline) return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${base} resize-none ${className}`} style={style} />;
  return <input value={value} onChange={(e) => onChange(e.target.value)} className={`${base} ${className}`} style={style} />;
}

// ─── Photo slot ────────────────────────────────────────────────────────────
function PhotoSlot({ src, onUpload, editing, className = "", label = "Photo", round = false }: { src: string | null; onUpload: (d: string) => void; editing: boolean; className?: string; label?: string; round?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const shape = round ? "rounded-full" : "rounded-xl";
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => onUpload(ev.target?.result as string);
    r.readAsDataURL(f);
  };
  return (
    <div className={`relative overflow-hidden ${shape} ${className}`} style={{ background: "rgba(255,255,255,0.06)" }}>
      <input type="file" accept="image/*" className="hidden" ref={ref} onChange={handle} />
      {src ? <img src={src} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs opacity-40">{label}</div>}
      {editing && (
        <button onClick={() => ref.current?.click()} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
          <Upload size={20} className="text-white" />
        </button>
      )}
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label, onChange, editing, color, font, onAdd }: { icon: any; label: string; onChange: (v: string) => void; editing: boolean; color: string; font: string; onAdd?: () => void; }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={18} style={{ color }} />
      <EditableText value={label} onChange={onChange} editing={editing} className="font-semibold tracking-wide uppercase text-xs" style={{ color, fontFamily: font }} />
      {editing && onAdd && (
        <button onClick={onAdd} className="ml-auto p-1 rounded hover:bg-white/10 transition-colors" style={{ color }}>
          <Plus size={16} />
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
  
  // Новые состояния для сервера и кода
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

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
    if (!el) {
      el = document.createElement("link");
      el.id = id;
      el.rel = "stylesheet";
      document.head.appendChild(el);
    }
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
  const [rules, setRules] = useState<string[]>([
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
    setFontIdx((i) => pickOther(i, FONTS.length));
    setThemeIdx((i) => pickOther(i, THEMES.length));
    setCornerIdx((i) => pickOther(i, CORNERS.length));
    setDividerIdx((i) => pickOther(i, DIVIDERS.length));
  };

  // ── Download ────────────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!bannerRef.current) return;
    setDownloading(true);
    setEditing(false);
    try {
      // wait for editing UI to revert to read-only spans
      await new Promise((r) => setTimeout(r, 150));
      const dataUrl = await captureElement(bannerRef.current, theme.pageBackground);
      const a = document.createElement("a");
      a.download = `${name.replace(/\s+/g, "_")}_bio.png`;
      a.href = dataUrl;
      a.click();
    } catch (error) {
      console.error("Download failed", error);
      alert("❌ Failed to download image. See the browser console for details.");
    } finally {
      setDownloading(false);
    }
  }, [name, theme.pageBackground]);

  // ── Save to Server ──────────────────────────────────────────────────────
  const saveToServer = async () => {
    if (!bannerRef.current) return;
    setDownloading(true);
    setEditing(false);
    try {
      // wait for editing UI to revert to read-only spans
      await new Promise((r) => setTimeout(r, 150));
      const dataUrl = await captureElement(bannerRef.current, theme.pageBackground);
      
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl })
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setSavedImageUrl(data.url);
      alert(`✅ Image saved to server!\nURL: ${data.url}`);
    } catch (error) {
      console.error('Error saving to server:', error);
      alert('❌ Failed to save image to server');
    } finally {
      setDownloading(false);
    }
  };

  // ── Generate Bio Code ───────────────────────────────────────────────────
  const generateBioCode = () => {
    if (!savedImageUrl) {
      alert('⚠️ Please save image to server first (click "Save to Server")');
      return;
    }
    
    // Создаем градиент из основного цвета темы и фона
    const gradient = `linear-gradient(180deg, ${theme.pageBackground}, ${theme.accent}15)`;
    
    const code = `<ul style="margin-left: -10.5%!important; border:0;cursor: url(), auto; margin:0; padding:0; background: ${gradient}" target="_blank" rel="nofollow">
  <p style="margin:0;padding:0;line-height:0;">
    <img style="display:block;width:95%;margin-left:auto;margin-right:auto;border:0;padding:0;" src="${savedImageUrl}" />
  </p>
</ul>`;
    
    setGeneratedCode(code);
    setShowCodeModal(true);
  };

  // ── Copy to Clipboard ───────────────────────────────────────────────────
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy');
    }
  };

  // ── Schedule helpers ────────────────────────────────────────────────────
  const updSch = (i: number, k: keyof ScheduleItem, v: string) => setSchedule((s) => s.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));
  const updTip = (i: number, k: keyof TipItem, v: string) => setTipMenu((t) => t.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));
  const updRule = (i: number, v: string) => setRules((r) => r.map((x, idx) => (idx === i ? v : x)));

  // ── Shared style shortcuts ───────────────────────────────────────────────
  const border = `${theme.accent}44`;
  const sectionStyle = { background: theme.sectionBg, borderColor: `${theme.accent}22` };

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center gap-2 p-3 rounded-2xl border backdrop-blur-md"
        style={{ background: `${theme.pageBackground}cc`, borderColor: `${theme.accent}33` }}>
        
        <button
          onClick={() => setEditing((e) => !e)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all"
          style={{ background: editing ? `${theme.accent}22` : `${theme.accent}0e`, borderColor: editing ? `${theme.accent}80` : `${theme.accent}44`, color: theme.accentText, fontFamily: bf }}>
          {editing ? <Check size={16}/> : <Pencil size={16}/>}
          {editing ? "Готово" : "Редактировать"}
        </button>

        <button
          onClick={randomize}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all"
          style={{ background: `${theme.accent}0e`, borderColor: `${theme.accent}44`, color: theme.accentText, fontFamily: bf }}>
          <Shuffle size={16}/>
          Рандом
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all disabled:opacity-50"
          style={{ background: `${theme.accent}0e`, borderColor: `${theme.accent}44`, color: theme.accentText, fontFamily: bf }}>
          <Download size={16}/>
          {downloading ? "Сохранение..." : "Скачать PNG"}
        </button>

        {/* Кнопка сохранения на сервер */}
        <button
          onClick={saveToServer}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all disabled:opacity-50"
          style={{
            background: savedImageUrl ? `${theme.accent}33` : `${theme.accent}0e`,
            borderColor: `${theme.accent}44`,
            color: theme.accentText,
            fontFamily: bf
          }}>
          <Upload size={16}/>
          {savedImageUrl ? 'Сохранено ✓' : 'На сервер'}
        </button>

        {/* Кнопка получения кода */}
        <button
          onClick={generateBioCode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all"
          style={{
            background: `${theme.accent}0e`,
            borderColor: `${theme.accent}44`,
            color: theme.accentText,
            fontFamily: bf
          }}>
          <Code size={16}/>
          Код био
        </button>

        <div className="text-xs opacity-60 px-2" style={{ color: theme.accentText, fontFamily: bf }}>
          {theme.name} · {font.name} · Corner {cornerIdx + 1}/{CORNERS.length} · Line {dividerIdx + 1}/{DIVIDERS.length}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ BANNER CARD ════════════════════════════════════════════════════════ */}
      <div ref={bannerRef} className="relative w-full max-w-md mx-auto my-24 p-6 sm:p-8 rounded-3xl border shadow-2xl overflow-hidden" style={{ background: theme.cardGradient, borderColor: `${theme.accent}33`, boxShadow: `0 25px 80px -20px ${theme.accent}40` }}>
        
        {/* ambient glows */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: theme.accent }} />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: theme.accent2 }} />
        <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ boxShadow: `inset 0 0 0 1px ${theme.accent}20, inset 0 1px 0 0 ${theme.accent}30` }} />

        {/* top corners */}
        <div className="absolute top-0 left-0 w-8 h-8">{renderCorner(theme.accent, theme.accent2, false, false)}</div>
        <div className="absolute top-0 right-0 w-8 h-8">{renderCorner(theme.accent, theme.accent2, true, false)}</div>

        {/* platform label */}
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] tracking-widest uppercase border" style={{ color: theme.accentText, borderColor: `${theme.accent}44`, fontFamily: bf }}>{platformLabel}</span>
        </div>

        {/* ── Photo gallery ── */}
        <div className="flex gap-3 mb-6 h-32">
          <PhotoSlot src={photo1} onUpload={setPhoto1} editing={editing} className="flex-1 h-full" label="Photo 1" />
          <PhotoSlot src={photo2} onUpload={setPhoto2} editing={editing} className="flex-1 h-full" label="Photo 2" />
        </div>

        {/* ── Avatar ── */}
        <div className="flex justify-center -mt-16 mb-4 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur opacity-40" style={{ background: `conic-gradient(from 0deg, ${theme.accent}, ${theme.accent2}, ${theme.accent})` }} />
            <PhotoSlot round src={avatarSrc} onUpload={setAvatarSrc} editing={editing} className="relative w-28 h-28 border-4 shadow-xl" style={{ borderColor: theme.pageBackground }} label={<Camera size={24} className="opacity-40" />} />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full" style={{ background: theme.accent2, top: "50%", left: "50%", transform: `rotate(${deg}deg) translateY(-56px)` }} />
            ))}
          </div>
        </div>

        {/* ── Name ── */}
        <div className="text-center mb-1">
          {editing ? (
            <input value={name} onChange={(e) => setName(e.target.value)} className="border-b border-dashed outline-none w-full text-center bg-transparent" style={{ fontFamily: df, fontSize: "2rem", fontWeight: 900, color: theme.accentText, borderColor: border }} />
          ) : (
            <h1 style={{ fontFamily: df, fontSize: "2rem", fontWeight: 900, color: theme.accentText, letterSpacing: "-0.02em" }}>{name}</h1>
          )}
        </div>

        {/* divider */}
        <div className="flex justify-center my-3">{renderDivider(theme.lineColor, theme.accent2)}</div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: Heart, lbl: fansLbl, setLbl: setFansLbl, val: fansVal, setVal: setFansVal },
            { icon: Star, lbl: ratingLbl, setLbl: setRatingLbl, val: ratingVal, setVal: setRatingVal },
            { icon: Camera, lbl: showsLbl, setLbl: setShowsLbl, val: showsVal, setVal: setShowsVal },
          ].map(({ icon: Icon, lbl, setLbl, val, setVal }, idx) => (
            <div key={idx} className="text-center p-3 rounded-2xl border" style={{ ...sectionStyle }}>
              <Icon size={18} className="mx-auto mb-1" style={{ color: theme.accent }} />
              <div className="text-lg font-bold" style={{ color: theme.accentText, fontFamily: df }}>
                <EditableText value={val} onChange={setVal} editing={editing} />
              </div>
              <div className="text-[10px] uppercase tracking-wider opacity-70" style={{ color: theme.accentText, fontFamily: bf }}>
                <EditableText value={lbl} onChange={setLbl} editing={editing} />
              </div>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="flex justify-center mb-5">{renderDivider(theme.lineColor, theme.accent2)}</div>

        {/* ── About ── */}
        <div className="mb-5">
          <p className="text-center text-sm leading-relaxed" style={{ color: theme.bodyColor, fontFamily: bf }}>
            <EditableText value={about} onChange={setAbout} editing={editing} multiline className="text-center" />
          </p>
        </div>

        {/* divider */}
        <div className="flex justify-center mb-5">{renderDivider(theme.lineColor, theme.accent2)}</div>

        {/* ── Schedule ── */}
        <div className="mb-5 p-4 rounded-2xl border" style={{ ...sectionStyle }}>
          <SectionHeader icon={Zap} label={scheduleHdr} onChange={setScheduleHdr} editing={editing} color={theme.accent} font={bf} onAdd={() => setSchedule((s) => [...s, { day: "Day", time: "Time" }])} />
          <div className="space-y-2">
            {schedule.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm relative group">
                {editing ? (
                  <>
                    <input value={s.day} onChange={(e) => updSch(i, "day", e.target.value)} className="bg-transparent border-b outline-none mb-1 w-full" style={{ color: theme.accentText, borderColor: border, fontFamily: bf, fontWeight: 300 }} />
                    <input value={s.time} onChange={(e) => updSch(i, "time", e.target.value)} className="bg-transparent border-b outline-none w-full" style={{ color: "#fff", borderColor: border, fontFamily: bf, fontWeight: 500 }} />
                    <button onClick={() => setSchedule((s) => s.filter((_, j) => j !== i))} className="absolute top-1 right-1 hover:opacity-60" style={{ color: theme.accent }}>
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300 }}>{s.day}</span>
                    <span className="font-medium" style={{ color: "#fff", fontFamily: bf, fontWeight: 500 }}>{s.time}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* divider */}
        <div className="flex justify-center mb-5">{renderDivider(theme.lineColor, theme.accent2)}</div>

        {/* ── Tip menu ── */}
        <div className="mb-5 p-4 rounded-2xl border" style={{ ...sectionStyle }}>
          <SectionHeader icon={Gift} label={tipHdr} onChange={setTipHdr} editing={editing} color={theme.accent} font={bf} onAdd={() => setTipMenu((t) => [...t, { emoji: "🎁", amount: "100", label: "New item" }])} />
          <div className="space-y-2">
            {tipMenu.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm relative group">
                {editing ? (
                  <>
                    <input value={item.emoji} onChange={(e) => updTip(i, "emoji", e.target.value)} className="bg-transparent text-lg w-8 outline-none" />
                    <input value={item.label} onChange={(e) => updTip(i, "label", e.target.value)} className="bg-transparent border-b outline-none flex-1 text-xs" style={{ color: theme.accentText, borderColor: border, fontFamily: bf, fontWeight: 300 }} />
                    <input value={item.amount} onChange={(e) => updTip(i, "amount", e.target.value)} className="bg-transparent border-b outline-none w-12 text-xs" style={{ color: theme.tipAmountColor, borderColor: `${theme.tipAmountColor}55`, fontFamily: bf, fontWeight: 500 }} />
                    <button onClick={() => setTipMenu((t) => t.filter((_, j) => j !== i))} className="hover:opacity-60 shrink-0" style={{ color: theme.accent }}>
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-lg">{item.emoji}</span>
                    <span className="flex-1" style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300 }}>{item.label}</span>
                    <span className="font-semibold" style={{ color: theme.tipAmountColor, fontFamily: bf, fontWeight: 500 }}>{item.amount}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* divider */}
        <div className="flex justify-center mb-5">{renderDivider(theme.lineColor, theme.accent2)}</div>

        {/* ── Rules ── */}
        <div className="mb-5 p-4 rounded-2xl border" style={{ ...sectionStyle }}>
          <SectionHeader icon={MessageCircle} label={rulesHdr} onChange={setRulesHdr} editing={editing} color={theme.accent} font={bf} onAdd={() => setRules((r) => [...r, "New rule"])} />
          <ul className="space-y-2 text-xs leading-relaxed">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 relative group">
                <span style={{ color: theme.accent2 }}>◆</span>
                {editing ? (
                  <>
                    <input value={rule} onChange={(e) => updRule(i, e.target.value)} className="bg-transparent border-b outline-none flex-1 text-xs" style={{ color: theme.accentText, borderColor: border, fontFamily: bf, fontWeight: 300 }} />
                    <button onClick={() => setRules((r) => r.filter((_, j) => j !== i))} className="hover:opacity-60 shrink-0" style={{ color: theme.accent }}>
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <span style={{ color: theme.accentText, fontFamily: bf, fontWeight: 300 }}>{rule}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* divider */}
        <div className="flex justify-center mb-5">{renderDivider(theme.lineColor, theme.accent2)}</div>

        {/* ── Handle ── */}
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-widest opacity-70 mb-1" style={{ color: theme.accentText, fontFamily: bf }}>
            <EditableText value={followLbl} onChange={setFollowLbl} editing={editing} />
          </div>
          <div className="text-lg font-semibold" style={{ color: theme.accent, fontFamily: df }}>
            <EditableText value={handle} onChange={setHandle} editing={editing} />
          </div>
        </div>

        {/* bottom corners */}
        <div className="absolute bottom-0 left-0 w-8 h-8">{renderCorner(theme.accent, theme.accent2, false, true)}</div>
        <div className="absolute bottom-0 right-0 w-8 h-8">{renderCorner(theme.accent, theme.accent2, true, true)}</div>

        {/* footer */}
        <div className="text-center text-[10px] opacity-50 mt-4" style={{ color: theme.accentText, fontFamily: bf }}>
          <EditableText value={footerTxt} onChange={setFooterTxt} editing={editing} />
        </div>
      </div>

      {/* Модалка с кодом */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCodeModal(false)}>
          <div 
            className="w-full max-w-2xl rounded-2xl border p-6 relative"
            style={{ 
              background: theme.pageBackground,
              borderColor: `${theme.accent}44`
            }}
            onClick={e => e.stopPropagation()}>
            
            <button
              onClick={() => setShowCodeModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: theme.accentText }}>
              <X size={20}/>
            </button>

            <h3 className="text-lg font-bold mb-4" style={{ color: theme.accentText, fontFamily: df }}>
              HTML код для вставки
            </h3>

            <div className="relative">
              <textarea
                readOnly
                value={generatedCode}
                className="w-full h-32 bg-black/50 rounded-xl p-4 font-mono text-sm resize-none focus:outline-none"
                style={{ 
                  color: '#a5f3fc',
                  border: `1px solid ${theme.accent}33`
                }}
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 rounded-lg transition-all flex items-center gap-2"
                style={{ 
                  background: copied ? '#22c55e' : `${theme.accent}22`,
                  color: copied ? '#fff' : theme.accentText
                }}>
                {copied ? <Check size={16}/> : <Copy size={16}/>}
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>

            <p className="mt-4 text-sm opacity-60" style={{ color: theme.accentText, fontFamily: bf }}>
              Вставьте этот код в описание вашего профиля на Chaturbate
            </p>
          </div>
        </div>
      )}
    </>
  );
}
