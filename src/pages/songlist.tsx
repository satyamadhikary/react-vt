import { ThemeProvider } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import "../css/songlist.css"
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";




const Songlist = () => {
  const navigate = useNavigate();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <div style={{ display: 'flex', height: '3rem', alignItems: 'center'}} className="previous-btn">
        <button onClick={() => navigate("/")}><MdKeyboardDoubleArrowLeft /></button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-2 pt-0">



        <div className="song-container">
          <div className="play-pause-btn">
            <IoMdPlay />
          </div>
          <audio src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"></audio>
          <h1>Test</h1>
        </div>




        {Array.from({ length: 12 }).map(() => (
          <div className="song-container">
            <div className="play-pause-btn">
              <IoMdPlay />
            </div>
            <h1>Test</h1>
          </div>
        ))}
      </div>

    </ThemeProvider>
  )
}

export default Songlist