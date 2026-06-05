import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <p className="text-xs font-mono tracking-[0.4em] text-cyan-400/60 uppercase">
          ERROR 404
        </p>
        <h1 className="text-6xl font-black text-white/10">NOT FOUND</h1>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-cyan-400 hover:text-cyan-300 font-mono underline underline-offset-4 transition-colors"
        >
          ← Volver al inicio
        </button>
      </motion.div>
    </div>
  );
}
