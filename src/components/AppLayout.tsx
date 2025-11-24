"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { IoIosSearch } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import "../app/css/drawer.css";
import DrawerPage from "@/components/drawer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isDrawerOpen = useSelector(
    (state: RootState) => state.audio.isDrawerOpen
  );
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <SidebarProvider>
        <AppSidebar />
        <DrawerPage />

        <SidebarInset>
          <header
            style={{
              borderBottom: "1px solid rgb(33 33 33)",
              position: "sticky",
              width: "100%",
              top: "0",
              zIndex: "11",
              background: "rgba(255, 255, 255, 0.25)",
              boxShadow: "0px 16px 40px 0px rgba(68, 70, 94, 0.37)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "10px 0px",
              transition: "width 0.7s ease-in-out",
            }}
          >
            <div className="flex items-center gap-2 px-4">
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
              maxHeight: isDrawerOpen ? "85dvh" : "100dvh",
              transition: "height 0.5s ease-in-out",
            }}
          >
            <div
              style={{ overflowY: "scroll" }}
              className="flex flex-1 flex-col p-4 pt-0 w-full"
            >
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
