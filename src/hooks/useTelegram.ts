/**
 * Convenience re-export so the hook can be imported from "@/hooks/useTelegram".
 * The implementation lives in the TelegramContext provider, which also drives
 * WebApp.expand(), the MainButton / BackButton, and server-side auth.
 */
export { useTelegram, TelegramProvider } from "@/context/TelegramContext";
