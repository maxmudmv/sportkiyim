"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function AuthModal() {
  const { authOpen, setAuthOpen, login, register } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const close = () => {
    setAuthOpen(false);
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "register" && name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setBusy(true);
    const err =
      mode === "login"
        ? await login(email, password)
        : await register(name.trim(), email, password);
    setBusy(false);

    if (err) {
      setError(err);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      close();
    }
  };

  return (
    <AnimatePresence>
      {authOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-32px)] max-w-md
              bg-surface-container-low border border-outline-variant rounded shadow-neon"
            initial={{ opacity: 0, y: 24, x: "-50%", translateY: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%", translateY: "-50%" }}
            exit={{ opacity: 0, y: 24, x: "-50%", translateY: "-50%" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-outline-variant">
              <h2 className="font-display text-headline-md text-primary uppercase tracking-tight">
                {mode === "login" ? "Sign In" : "Create Account"}
              </h2>
              <button
                aria-label="Close"
                onClick={close}
                className="text-on-surface-variant hover:text-primary-fixed"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex border-b border-outline-variant">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
                  className={`flex-1 py-3 text-label-md uppercase tracking-wider transition-colors ${
                    mode === m
                      ? "text-primary-fixed border-b-2 border-primary-fixed"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {m === "login" ? "Log In" : "Register"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="p-6 flex flex-col gap-4">
              {mode === "register" && (
                <input
                  className="kinetic-input"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              )}
              <input
                className="kinetic-input"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                className="kinetic-input"
                placeholder="Password (min. 8 characters)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />

              {error && (
                <p className="text-error text-sm bg-error-container/30 border border-error-container rounded p-3">
                  {error}
                </p>
              )}

              <button type="submit" disabled={busy} className="btn-primary mt-2">
                {busy ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
              </button>

              <p className="text-xs text-on-surface-variant/70 text-center">
                Demo account: demo@apexvelocity.store / apex1234
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
