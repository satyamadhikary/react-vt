import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { RiPlayList2Line } from "react-icons/ri";


export default function Page() {
  const navigate = useNavigate();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <SidebarProvider>
        <AppSidebar/>

        <Drawer>
              
              <DrawerTrigger>
                <button style={{position: 'fixed', bottom: '20px', right: '20px', minWidth:'fit-content',background: 'Black', color: 'white', padding: '10px', borderRadius: '50%', zIndex: '50'}}><RiPlayList2Line /></button>
              </DrawerTrigger>
              
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Song Viewer</DrawerTitle>
                  <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
             
            </Drawer>

        <SidebarInset>
          <header style={{ borderBottom: '1px solid rgb(33 33 33)', position: 'sticky', top: '0', zIndex: '11', background: ' rgba( 255, 255, 255, 0.25 )', boxShadow: '0px 16px 40px 0px rgba( 31, 38, 135, 0.37 )', backdropFilter: ' blur( 10px )' , WebkitBackdropFilter: ' blur( 10px )'}} className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb className="d-flex align-items-center">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>Building Your Application</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage style={{ cursor: 'pointer' }} onClick={() => navigate("/About")}>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col p-4 pt-0 overflow-y-hidden w-full">
            
            
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>

    </ThemeProvider>

  )
};
