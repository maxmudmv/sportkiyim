# ApexVelocity — Telegram Mini App (Full-Stack Sport Kiyimlar Do'koni)

**Telegram bot:** [@sportkiyimlar_bot](https://t.me/sportkiyimlar_bot)

To'liq ishlaydigan e-commerce ilova: **Next.js 15 (App Router) + React 19 + Tailwind CSS +
Prisma (SQLite) + bcryptjs + Framer Motion + Lucide**. Dizayn Google Stitch'dagi
"ApexVelocity" loyihasining **Technical Kinetic** uslubiga aynan mos (qora `#131313` fon,
neon-yashil `#c3f400`, Space Grotesk + Inter).

## Ishga tushirish

```bash
npm install        # barcha bog'liqliklar (postinstall: prisma generate)
npm run db:push    # SQLite bazani yaratadi (prisma/dev.db)
npm run db:seed    # 14 mahsulot + demo foydalanuvchi
npm run dev        # http://localhost:3000
```

> Baza allaqachon yaratilgan va seed qilingan — klondan keyin yoki bazani
> tozalash uchun `npm run db:reset` ishlating.

**Demo akkaunt:** `demo@apexvelocity.store` / `apex1234`

## Nimalar ishlaydi

### Frontend (barcha sahifalar to'liq ulangan)
- **`/` Bosh sahifa** — Framer Motion hero, kategoriya grid, DB'dan trending mahsulotlar, quick-add.
- **`/shop`** — server tomonda filtrlash (kategoriya, sport, jins, o'lcham, qidiruv, narx bo'yicha saralash), URL bilan sinxron filtrlar, mobil filtr paneli.
- **`/shop/[id]`** — o'lcham/rang tanlash, miqdor, texnik xususiyatlar accordion, stok ogohlantirishi, o'xshash mahsulotlar.
- **`/checkout`** — to'liq validatsiyali forma, buyurtma yuborish, muvaffaqiyat ekrani.
- **Global holat (React Context)** — savat hamma joyda bir zumda sinxron: navbar badge, yon panel (drawer), checkout jami. localStorage'da saqlanadi; login qilinganda serverdagi savat bilan birlashadi.
- **Auth modal** — ro'yxatdan o'tish / kirish, httpOnly cookie sessiya.

### Backend (Next.js Route Handlers)
| Endpoint | Vazifa |
|---|---|
| `GET /api/products` | Filtrlash (`category`, `sport`, `gender`, `size`, `q`, `maxPrice`, `sort`), stok bilan |
| `GET /api/products/[id]` | ID yoki slug bo'yicha bitta mahsulot |
| `POST /api/auth/register` | bcrypt hash bilan ro'yxatdan o'tish |
| `POST /api/auth/login` / `logout` | Sessiya yaratish/o'chirish |
| `GET /api/auth/me` | Joriy foydalanuvchi |
| `GET/PUT /api/cart` | Login qilingan foydalanuvchi savatini DB'da saqlash |
| `POST /api/orders` | **Narx faqat serverda hisoblanadi**, stok atomik kamayadi, to'lov mock (har doim PAID) |
| `GET /api/orders` | Foydalanuvchi buyurtmalari tarixi |

Narx qoidalari: $150 dan yuqori — bepul yetkazib berish (aks holda $10), 8% soliq.

### Baza (Prisma + SQLite)
`User`, `Session`, `Product`, `CartItem`, `Order`, `OrderItem` modellari —
`prisma/schema.prisma`. Seed: `prisma/seed.ts` (14 ta batafsil mahsulot).

## Papka tuzilishi

```
src/
├── app/                  # sahifalar + API route handler'lar
│   ├── page.tsx          # bosh sahifa
│   ├── shop/page.tsx     # katalog (+ [id]/page.tsx — mahsulot)
│   ├── checkout/page.tsx
│   └── api/              # products, auth, cart, orders
├── components/           # Navbar, CartDrawer, AuthModal, ProductCard, ...
├── context/StoreContext.tsx  # global savat + auth holati
└── lib/                  # prisma, auth (sessiya), money, types
prisma/                   # schema + seed + dev.db
stitch-export/            # asl Stitch statik eksporti (arxiv)
scripts/                  # Stitch SDK skriptlari (stitch:list, stitch:fetch)
```

## Telegram Mini App (TMA)

Ilova Telegram ichida Web App sifatida to'liq ishlaydi:

- **SDK** (`telegram-web-app.js`) `layout.tsx` da hydration'dan oldin yuklanadi.
- **`src/context/TelegramContext.tsx`** (`useTelegram` hook) — `expand()`, header/fon rangi,
  route'ga qarab **MainButton** ("SHOP NOW" / "VIEW CART (n)" / "PAY $…") va **BackButton**,
  haptic feedback, hamda `initData` ni serverga yuborib avtomatik login.
- **`POST /api/auth/telegram`** — initData imzosini serverda (HMAC-SHA256, rasmiy algoritm)
  tekshiradi, birinchi ochilishda profil yaratadi (`telegramId` bo'yicha), sessiya cookie beradi.
- Bosh sahifada Telegram ismi bilan **welcome banner**; checkout'da ism avtomatik to'ldiriladi;
  buyurtmalar Telegram foydalanuvchisiga bog'lanadi.

### Telegramda sinash

Telegram faqat **HTTPS** URL qabul qiladi. Lokal serverni tunnel bilan oching:

```bash
npm run dev                                   # 1-terminal
npx cloudflared tunnel --url http://localhost:3000   # 2-terminal (yoki ngrok http 3000)
```

Tunnel bergan `https://...` manzilni botga ulang:

```bash
node --env-file=.env scripts/telegram-setup.mjs set-menu https://SIZNING-TUNNEL-URL
node --env-file=.env scripts/telegram-setup.mjs send-link 7513688320 https://SIZNING-TUNNEL-URL
```

Keyin @sportkiyimlar_bot chatidagi menyu tugmasi (yoki yuborilgan havola) do'konni ochadi.

## Eslatmalar
- `.env` da `DATABASE_URL`, `SESSION_SECRET` va `STITCH_API_KEY` bor — git'ga kirmaydi.
- Mahsulot suratlari Stitch generatsiya qilgan rasmlar (googleusercontent CDN) — internet kerak.
- To'lov ataylab mock qilingan; haqiqiy to'lov uchun `src/app/api/orders/route.ts` dagi
  `paymentApproved` bo'limiga Stripe/Payme kabi provayder ulanadi.
