import { ThemeProvider } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import "../css/songlist.css"
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";


const Songlist = () => {
  const navigate = useNavigate();
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      

        <div className="flex flex-1 flex-col gap-4 p-4">

        <div style={{display: 'flex'}} className="previous-btn">
        <button onClick={() => navigate("/")}><MdKeyboardDoubleArrowLeft /></button>
      </div>


          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50"
            />
          ))}
        </div> 

      </ThemeProvider>
    )
  }
  
  export default Songlist