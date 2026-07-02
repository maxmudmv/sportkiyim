"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTelegram } from "@/context/TelegramContext";
import { useStore } from "@/context/StoreContext";

/**
 * TMA dashboard banner — greets the athlete by their Telegram first name.
 * Falls back to the logged-in account name (or a generic greeting) when the
 * app is opened in a normal browser.
 */
export default function WelcomeBanner() {
  const { tgUser, isTelegram } = useTelegram();
  const { user } = useStore();

  const displayName = tgUser?.first_name ?? user?.name?.split(" ")[0] ?? "Athlete";

  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-4 md:mx-12 mt-4 max-w-container xl:mx-auto"
    >
      <div className="flex items-center gap-4 bg-surface-container-low border border-outline-variant/50 rounded p-4 shadow-neon">
        <div className="w-11 h-11 rounded bg-primary-fixed/15 border border-primary-fixed/40 flex items-center justify-center shrink-0">
          {tgUser?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tgUser.photo_url}
              alt={displayName}
              className="w-full h-full rounded object-cover"
            />
          ) : (
            <Zap size={20} className="text-primary-fixed" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display text-body-lg text-primary uppercase tracking-tight truncate">
            Welcome back, <span className="text-primary-fixed">{displayName}</span>
          </p>
          <p className="text-sm text-on-surface-variant truncate">
            {isTelegram
              ? tgUser?.username
                ? `@${tgUser.username} · synced via Telegram`
                : "Synced via Telegram"
              : "Your gear locker is ready."}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
