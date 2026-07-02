import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { validateInitData } from "@/lib/telegram";

/**
 * POST /api/auth/telegram
 * Body: { initData: string } — the raw Telegram.WebApp.initData string.
 * Validates the signature server-side against TELEGRAM_BOT_TOKEN, then
 * upserts the user by telegramId (auto-registration on first open) and
 * issues the same httpOnly session cookie the rest of the API uses.
 */
export async function POST(req: NextRequest) {
  let body: { initData?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = validateInitData(body.initData ?? "");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const tg = result.user;
  const telegramId = String(tg.id);
  const name = [tg.first_name, tg.last_name].filter(Boolean).join(" ");

  const user = await prisma.user.upsert({
    where: { telegramId },
    update: {
      name,
      username: tg.username ?? null,
      photoUrl: tg.photo_url ?? null,
    },
    create: {
      telegramId,
      name,
      username: tg.username ?? null,
      photoUrl: tg.photo_url ?? null,
    },
  });

  await createSession(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      telegramId: user.telegramId,
      username: user.username,
    },
  });
}
