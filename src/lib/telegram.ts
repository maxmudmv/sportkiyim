import { createHmac, timingSafeEqual } from "node:crypto";

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

const MAX_AGE_SECONDS = 60 * 60 * 24; // initData older than 24h is rejected

type ValidationResult =
  | { ok: true; user: TelegramUser; authDate: number }
  | { ok: false; error: string };

/**
 * Validates Telegram WebApp initData exactly per the official algorithm:
 *   secret_key = HMAC_SHA256(key="WebAppData", bot_token)
 *   hash       = hex(HMAC_SHA256(key=secret_key, data_check_string))
 * where data_check_string is all key=value pairs (except `hash`),
 * sorted alphabetically and joined with "\n".
 */
export function validateInitData(initData: string): ValidationResult {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return { ok: false, error: "TELEGRAM_BOT_TOKEN is not configured" };
  if (!initData) return { ok: false, error: "initData is required" };

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return { ok: false, error: "hash is missing from initData" };
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "initData signature is invalid" };
  }

  const authDate = Number(params.get("auth_date") ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > MAX_AGE_SECONDS) {
    return { ok: false, error: "initData is expired" };
  }

  const userJson = params.get("user");
  if (!userJson) return { ok: false, error: "user payload is missing" };

  let user: TelegramUser;
  try {
    user = JSON.parse(userJson);
  } catch {
    return { ok: false, error: "user payload is not valid JSON" };
  }
  if (!user?.id || !user.first_name) {
    return { ok: false, error: "user payload is incomplete" };
  }

  return { ok: true, user, authDate };
}
