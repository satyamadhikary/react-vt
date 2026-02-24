import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { StoreProvider } from "./StoreProvider";
import AppLayout from "../components/AppLayout";
import AudioPlayer from "../components/Audioplayer";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Flute Music",
  description: "Free music for everyone",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <StoreProvider>
          <AudioPlayer />
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
