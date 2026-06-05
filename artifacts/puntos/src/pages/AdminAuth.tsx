import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function AdminAuth() {
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    document.cookie =
      "admin_token=Holaquetalsoypepi5; path=/; max-age=31536000; SameSite=Lax";

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          navigate("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-8 text-center"
      >
        {/* Icon */}
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="absolute -inset-6 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #22d3ee, transparent)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(99,102,241,0.2))",
              border: "1px solid rgba(34,211,238,0.3)",
              backdropFilter: "blur(12px)",
            }}
          >
            <ShieldCheck className="w-10 h-10 text-cyan-400" />
          </div>
        </motion.div>

        {/* Text */}
        <div className="space-y-3">
          <motion.p
            className="text-xs font-mono tracking-[0.4em] text-cyan-400/60 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ACCESO CONCEDIDO
          </motion.p>
          <motion.h1
            className="text-4xl font-black text-white tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Admin activado
          </motion.h1>
          <motion.p
            className="text-white/40 text-sm font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Redirigiendo en{" "}
            <span className="text-cyan-400 font-bold">{countdown}</span>{" "}
            segundos...
          </motion.p>
        </div>

        {/* Progress bar */}
        <motion.div
          className="w-48 h-px bg-white/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #22d3ee, #6366f1)",
            }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
