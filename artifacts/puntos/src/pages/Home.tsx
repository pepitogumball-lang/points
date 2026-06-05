import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Wifi, WifiOff } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function usePoints() {
  const [points, setPoints] = useState<number>(0);
  const [online, setOnline] = useState(true);

  const fetchPoints = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/points`);
      const data = await res.json();
      setPoints(data.points ?? 0);
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
    const id = setInterval(fetchPoints, 3000);
    return () => clearInterval(id);
  }, [fetchPoints]);

  return { points, setPoints, online };
}

function isAdmin() {
  return document.cookie
    .split(";")
    .some((c) => c.trim() === "admin_token=Holaquetalsoypepi5");
}

async function adjustPoints(next: number): Promise<number> {
  const res = await fetch(`${BASE}/api/points`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ points: next }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Error");
  return data.points;
}

export default function Home() {
  const { points, setPoints, online } = usePoints();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const adjust = async (delta: number) => {
    if (loading) return;
    const next = points + delta;
    setPoints(next);
    setFlash(delta > 0 ? "up" : "down");
    setTimeout(() => setFlash(null), 600);
    setLoading(true);
    try {
      const confirmed = await adjustPoints(next);
      setPoints(confirmed);
    } catch {
      setPoints(points);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Status indicator */}
      <motion.div
        className="absolute top-6 right-6 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ opacity: online ? [1, 0.3, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {online ? (
            <Wifi className="w-4 h-4 text-cyan-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
        </motion.div>
        <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
          {online ? "LIVE" : "OFFLINE"}
        </span>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="z-10 flex flex-col items-center gap-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Title */}
        <motion.div className="text-center space-y-1">
          <motion.p
            className="text-xs font-mono text-cyan-400/60 tracking-[0.4em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ZAPIA · SISTEMA DE PUNTOS
          </motion.p>
          <motion.h1
            className="text-7xl sm:text-9xl font-black tracking-tighter uppercase"
            style={{
              background: "linear-gradient(180deg, #fff 30%, #475569 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            PUNTOS
          </motion.h1>
        </motion.div>

        {/* Points counter */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-4 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Counter box */}
          <div
            className="relative px-16 py-10 rounded-3xl border border-white/10"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(15,23,42,0.8) 100%)",
              backdropFilter: "blur(24px)",
              boxShadow:
                "0 0 60px rgba(34,211,238,0.15), 0 0 120px rgba(34,211,238,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-cyan-400/40 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyan-400/40 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-cyan-400/40 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-cyan-400/40 rounded-br-3xl" />

            <AnimatePresence mode="wait">
              <motion.span
                key={points}
                className="block font-mono font-bold tabular-nums"
                style={{
                  fontSize: "clamp(5rem, 15vw, 9rem)",
                  color:
                    flash === "up"
                      ? "#67e8f9"
                      : flash === "down"
                        ? "#818cf8"
                        : "#22d3ee",
                  textShadow:
                    flash === "up"
                      ? "0 0 30px rgba(103,232,249,0.8), 0 0 60px rgba(34,211,238,0.4)"
                      : flash === "down"
                        ? "0 0 30px rgba(129,140,248,0.8), 0 0 60px rgba(99,102,241,0.4)"
                        : "0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.2)",
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
                initial={{ y: flash === "up" ? -20 : flash === "down" ? 20 : 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: flash === "up" ? 20 : -20, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {points.toLocaleString()}
              </motion.span>
            </AnimatePresence>

            {/* Scan line effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
              style={{ mixBlendMode: "overlay" }}
            >
              <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Admin controls */}
        <AnimatePresence>
          {admin && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm"
            >
              <div
                className="p-6 rounded-2xl border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <p className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase">
                    Control Center
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => adjust(1)}
                    disabled={loading}
                    className="group relative h-20 rounded-xl font-black text-3xl overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0.1) 100%)",
                      border: "1px solid rgba(34,211,238,0.3)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span className="relative z-10 text-cyan-300">
                      <Plus className="mx-auto" strokeWidth={3} />
                    </span>
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, transparent 100%)",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                  <motion.button
                    onClick={() => adjust(-1)}
                    disabled={loading}
                    className="group relative h-20 rounded-xl font-black text-3xl overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)",
                      border: "1px solid rgba(99,102,241,0.3)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span className="relative z-10 text-indigo-300">
                      <Minus className="mx-auto" strokeWidth={3} />
                    </span>
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, transparent 100%)",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer label */}
        <motion.p
          className="text-xs font-mono text-white/20 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          v2.0 · REPLIT EDITION
        </motion.p>
      </motion.div>
    </div>
  );
}
