import { ThemeProvider } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import "../css/songlist.css"
import { IoMdPlay } from "react-icons/io";
import { motion } from "motion/react"


const Songlist = () => {
  return (

    <motion.div
      initial={{opacity: 0 , translateY: 50}}
      animate={{opacity: 1 , translateY: 0}}
      transition={{duration:.3}}
      exit={{opacity: 0, translateY:100}}
    >
    <div className="songlist-container overflow-y-auto">
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <div className="flex flex-1 flex-col gap-4 p-2 pt-5">



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
    </div>
    </motion.div>
  )
}

export default Songlist