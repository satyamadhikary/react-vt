import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { StoreProvider } from "./StoreProvider";
import AppLayout from "../components/AppLayout";
import AudioPlayer from "../components/Audioplayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Flute Music",
  description: "Free music for everyone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* THEME FLASH FIX */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system';
                const root = document.documentElement;

                root.classList.remove('light', 'dark');
                if (theme === 'system') {
                  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  root.classList.add(sysDark ? 'dark' : 'light');
                } else {
                  root.classList.add(theme);
                }
              })();
            `,
          }}
        />
      </head>

      <body className={inter.variable} suppressHydrationWarning>
        <StoreProvider>
          <AudioPlayer />
          <AppLayout>{children}</AppLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
