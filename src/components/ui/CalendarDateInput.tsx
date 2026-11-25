"use client";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
function parseDate(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date();
}
function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
export function CalendarDateInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [position, setPosition] = useState<{ left: number; top: number; width: number }>({
    left: 12,
    top: 80,
    width: 300,
  });
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const d = parseDate(value);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = root.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(310, window.innerWidth - 24);
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
      const height = 360;
      const below = window.innerHeight - rect.bottom;
      const top =
        below >= height || below >= rect.top
          ? Math.min(rect.bottom + 8, window.innerHeight - 12)
          : Math.max(12, rect.top - height - 8);
      setPosition({ left, top, width });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);
  const y = month.getFullYear(),
    m = month.getMonth(),
    offset = (new Date(y, m, 1).getDay() + 6) % 7,
    count = new Date(y, m + 1, 0).getDate();
  const display = value ? parseDate(value).toLocaleDateString("pt-BR") : "Selecionar data";
  return (
    <div ref={root} className="relative min-w-0">
      <span className="mb-1 block text-xs font-semibold text-emerald-900">{label}</span>
      <button
        type="button"
        aria-label={`${label}: ${display}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="admin-control flex w-full items-center justify-between gap-1 px-3 py-2.5 text-xs"
      >
        <span>{display}</span>
        <CalendarDays size={16} />
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            left: position.left,
            top: position.top,
            width: position.width,
            maxHeight: "calc(100dvh - 24px)",
            overflowY: "auto",
          }}
          className="z-[110] rounded-2xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/70 to-lime-50 p-3 shadow-[0_18px_55px_rgba(16,75,48,0.22)]"
          role="group"
          aria-label={`Calendário ${label}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Mês anterior"
              className="rounded-lg p-2 hover:bg-emerald-50"
              onClick={() => setMonth(new Date(y, m - 1, 1))}
            >
              <ChevronLeft size={17} />
            </button>
            <strong className="text-sm text-emerald-950 capitalize">
              {month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </strong>
            <button
              type="button"
              aria-label="Próximo mês"
              className="rounded-lg p-2 hover:bg-emerald-50"
              onClick={() => setMonth(new Date(y, m + 1, 1))}
            >
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((w) => (
              <span key={w} className="py-1 text-[11px] text-emerald-700">
                {w}
              </span>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {Array.from({ length: count }, (_, i) => {
              const day = i + 1,
                chosen = iso(y, m, day) === value;
              return (
                <button
                  type="button"
                  key={day}
                  aria-pressed={chosen}
                  onClick={() => {
                    onChange(iso(y, m, day));
                    setOpen(false);
                  }}
                  className={`rounded-lg p-1.5 text-xs focus-visible:outline-2 focus-visible:outline-emerald-700 ${chosen ? "bg-emerald-800 text-white" : "text-emerald-950 hover:bg-emerald-100"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-emerald-100 py-2 text-xs text-emerald-800 hover:bg-emerald-50"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            <X size={13} /> Limpar filtro
          </button>
        </div>
      )}
    </div>
  );
}
