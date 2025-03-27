import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import "../css/drawer.css";
import DrawerPage from "../pages/drawer";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";


export default function Page() {
  const isDrawerOpen = useSelector((state : RootState) => state.audio.isDrawerOpen);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const homeButton = document.getElementById("home");
    if (homeButton) {
      if (location.pathname === "/") {
        homeButton.style.color = "#8a8a8a";
      } else {
        homeButton.style.color = "";
      }
    }
  }, [location.pathname]);

  const handleBack = () => {
    if (location.pathname === "/") {
      console.log("You are at the homepage")
      return;
    } else {
      navigate(-1);
    }
  };


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <DrawerPage />

        <SidebarInset>
          <header
            style={{
              borderBottom: "1px solid rgb(33 33 33)",
              position: "fixed",
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
              <Breadcrumb className="d-flex align-items-center">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage style={{ cursor: "pointer" }} onClick={() => navigate("/About")}>
                      Data Fetching
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div style={{display: "flex",
        overflowY: "hidden",
        maxHeight: isDrawerOpen ? "85dvh" : "100dvh",   
        transition: "height 0.5s ease-in-out"}}>
          <div style={{ overflowY: "scroll", paddingTop: "50px"}} className="flex flex-1 flex-col p-4 pt-0 w-full" >
            <Outlet />
          </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
