import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Providers from "@/providers/providers";
import { getLanguage } from "@/tolgee/language";
import { getStaticData } from "@/tolgee/shared";
import { TolgeeProviderClient } from "@/tolgee/client";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kanban Board",
  description:
    "Real-time kanban board app with websocket, nextauth, vercelai, and tolgee for localization.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLanguage();

  const staticData = await getStaticData([locale, "en"]);
  return (
    <html lang={locale}>
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <TolgeeProviderClient language={locale} staticData={staticData}>
            <Navbar />
            {children}
            <Toaster />
          </TolgeeProviderClient>
        </body>
      </Providers>
    </html>
  );
}
