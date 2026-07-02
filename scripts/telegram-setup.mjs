/*
 * Telegram bot helper for the ApexVelocity TMA.
 *
 * Usage (TELEGRAM_BOT_TOKEN is read from .env):
 *   node --env-file=.env scripts/telegram-setup.mjs getme
 *   node --env-file=.env scripts/telegram-setup.mjs set-menu https://your-https-url
 *   node --env-file=.env scripts/telegram-setup.mjs send-link <chat_id> https://your-https-url
 */

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is missing. Run with: node --env-file=.env ...");
  process.exit(1);
}

const api = (method, payload) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  }).then((r) => r.json());

const [cmd, ...args] = process.argv.slice(2);

const requireHttps = (url) => {
  if (!url?.startsWith("https://")) {
    console.error("Telegram Mini Apps require an https:// URL (use a tunnel for localhost).");
    process.exit(1);
  }
  return url;
};

switch (cmd) {
  case "getme": {
    const res = await api("getMe");
    console.log(JSON.stringify(res, null, 2));
    break;
  }
  case "set-menu": {
    const url = requireHttps(args[0]);
    const res = await api("setChatMenuButton", {
      menu_button: { type: "web_app", text: "🛒 Open Store", web_app: { url } },
    });
    console.log(res.ok ? `✓ Menu button now opens ${url}` : JSON.stringify(res, null, 2));
    break;
  }
  case "send-link": {
    const chatId = args[0];
    const url = requireHttps(args[1]);
    if (!chatId) {
      console.error("Usage: send-link <chat_id> <https-url>");
      process.exit(1);
    }
    const res = await api("sendMessage", {
      chat_id: chatId,
      text: "⚡ ApexVelocity — Engineered for Performance.\nTap below to open the store:",
      reply_markup: {
        inline_keyboard: [[{ text: "🛒 Open ApexVelocity", web_app: { url } }]],
      },
    });
    console.log(res.ok ? `✓ Link sent to chat ${chatId}` : JSON.stringify(res, null, 2));
    break;
  }
  default:
    console.log("Commands: getme | set-menu <https-url> | send-link <chat_id> <https-url>");
}
