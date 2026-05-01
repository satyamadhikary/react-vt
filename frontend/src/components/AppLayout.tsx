"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";
import { IoIosSearch } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import "../app/css/drawer.css";
import DrawerPage from "@/components/drawer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isDrawerOpen = useSelector(
    (state: RootState) => state.audio.isDrawerOpen,
  );
  const shellPadding = "10px";
  const headerHeight = "56px";
  const headerOffset = `calc(${shellPadding} + ${headerHeight})`;
  const contentHeight = isDrawerOpen
    ? `calc(85dvh - ${headerOffset} - ${shellPadding})`
    : `calc(100dvh - ${headerOffset} - ${shellPadding})`;
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (status === "unauthenticated" && !isAuthPage) {
      router.replace("/login");
    }

    if (status === "authenticated" && isAuthPage) {
      router.replace("/");
    }
  }, [isAuthPage, router, status]);

  useEffect(() => {
    const homeButton = document.getElementById("home");
    if (homeButton) {
      if (pathname === "/") {
        homeButton.style.color = "#8a8a8a";
      } else {
        homeButton.style.color = "";
      }
    }
  }, [pathname]);

  const handleBack = () => {
    if (pathname === "/") {
      return;
    } else {
      router.back();
    }
  };

  if (isAuthPage && status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthPage || status !== "authenticated") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <DrawerPage />

      <SidebarInset>
        <header
          className="app-header-glass"
          style={{
            position: "fixed",
            left: shellPadding,
            right: shellPadding,
            top: shellPadding,
            zIndex: "30",
            width: `calc(100vw - (${shellPadding} * 2))`,
            height: headerHeight,
            transition: "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <div className="flex h-full items-center gap-2 px-4">
            <button
              id="home"
              style={{ cursor: "pointer", color: "#fff", fontSize: "20px" }}
              onClick={handleBack}
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center">
                <Link href="/" className="cursor-pointer">
                  Home
                </Link>
                <Separator
                  orientation="vertical"
                  className="mx-2 h-4 text-primary"
                />
                <Link href="/about" className="cursor-pointer">
                  Data Fetching
                </Link>
              </div>

              <Link href="/search">
                <IoIosSearch className="text-xl" />
              </Link>
            </div>
          </div>
        </header>

        <div
          style={{
            display: "flex",
            overflowY: "hidden",
            marginTop: headerOffset,
            maxHeight: contentHeight,
            transition: "height 0.5s ease-in-out",
          }}
          className="p-[10px] h-full"
        >
          <div
            style={{ overflowY: "scroll" }}
            className="flex flex-1 flex-col w-full h-full bg-gray-100 dark:bg-black/25 rounded-[10px] p-4 ring-1 ring-inset ring-gray-300 dark:ring-white/10"
          >
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
