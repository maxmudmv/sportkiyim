"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "@/context/StoreContext";
import { formatMoney } from "@/lib/money";

type TgUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type TelegramContextValue = {
  /** True when running inside the Telegram webview with valid initData. */
  isTelegram: boolean;
  /** The Telegram user extracted from initDataUnsafe (display only). */
  tgUser: TgUser | null;
};

const TelegramContext = createContext<TelegramContextValue>({
  isTelegram: false,
  tgUser: null,
});

const THEME_BG = "#131313";
const BUTTON_COLOR = "#c3f400";
const BUTTON_TEXT_COLOR = "#161e00";

export function TelegramProvider({ children }: { children: ReactNode }) {
  const { cartCount, totalCents, refreshUser } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isTelegram, setIsTelegram] = useState(false);
  const [tgUser, setTgUser] = useState<TgUser | null>(null);
  const authSent = useRef(false);

  // --- Core initialization: expand, theme, server-side auth ---------------
  useEffect(() => {
    let attempts = 0;
    const init = () => {
      const wa = window.Telegram?.WebApp;
      if (!wa) {
        // SDK script may still be loading — retry briefly, then give up
        // (browser mode: the store keeps working without Telegram).
        if (attempts++ < 10) setTimeout(init, 200);
        return;
      }
      wa.ready();
      wa.expand();
      try {
        wa.setHeaderColor(THEME_BG);
        wa.setBackgroundColor(THEME_BG);
        wa.disableVerticalSwipes?.();
      } catch {
        /* older Telegram clients — cosmetic only */
      }

      if (!wa.initData) return; // opened in a plain browser tab

      setIsTelegram(true);
      setTgUser(wa.initDataUnsafe?.user ?? null);

      // Authenticate against the backend exactly once per app load.
      if (!authSent.current) {
        authSent.current = true;
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: wa.initData }),
        })
          .then((res) => {
            if (res.ok) refreshUser();
          })
          .catch(() => {});
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- MainButton + BackButton wired to the active route ------------------
  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa || !isTelegram) return;

    const mb = wa.MainButton;
    const bb = wa.BackButton;

    // Back button on every page except the dashboard.
    const onBack = () => router.back();
    if (pathname !== "/") bb.show();
    else bb.hide();
    bb.onClick(onBack);

    // Main button: contextual label + action.
    let onMain: (() => void) | null = null;

    if (pathname === "/checkout") {
      if (cartCount > 0) {
        mb.setParams({
          text: `PAY ${formatMoney(totalCents)}`,
          color: BUTTON_COLOR,
          text_color: BUTTON_TEXT_COLOR,
          is_active: true,
          is_visible: true,
        });
        onMain = () => window.dispatchEvent(new Event("tma:pay"));
      } else {
        mb.hide();
      }
    } else if (cartCount > 0) {
      mb.setParams({
        text: `VIEW CART (${cartCount}) · ${formatMoney(totalCents)}`,
        color: BUTTON_COLOR,
        text_color: BUTTON_TEXT_COLOR,
        is_active: true,
        is_visible: true,
      });
      onMain = () => router.push("/checkout");
    } else if (pathname === "/") {
      mb.setParams({
        text: "SHOP NOW",
        color: BUTTON_COLOR,
        text_color: BUTTON_TEXT_COLOR,
        is_active: true,
        is_visible: true,
      });
      onMain = () => router.push("/shop");
    } else {
      mb.hide();
    }

    if (onMain) mb.onClick(onMain);

    return () => {
      if (onMain) mb.offClick(onMain);
      bb.offClick(onBack);
    };
  }, [pathname, cartCount, totalCents, isTelegram, router]);

  return (
    <TelegramContext.Provider value={{ isTelegram, tgUser }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}
