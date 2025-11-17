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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable} suppressHydrationWarning={true}>
        <StoreProvider>
          <AudioPlayer />
          <AppLayout>{children}</AppLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
