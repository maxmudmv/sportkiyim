import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import { TelegramProvider } from "@/context/TelegramContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ApexVelocity — Engineered for Performance",
  description:
    "High-performance sports apparel and gear. Unleash your ultimate potential with ApexVelocity's Technical Kinetic collection.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#131313",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Official Telegram Mini App SDK — must load before hydration so the
            webview bridge (window.Telegram.WebApp) is ready on first render. */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <StoreProvider>
          <TelegramProvider>
            <Navbar />
            <main className="min-h-screen pt-20">{children}</main>
            <Footer />
            <CartDrawer />
            <AuthModal />
          </TelegramProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
