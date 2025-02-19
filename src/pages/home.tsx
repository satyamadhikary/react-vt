import { ThemeProvider } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import "../index.css";
import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import { motion } from "motion/react"
import { carouselData } from "../arrays/CarouselData";



const Home = () => {
  const navigate = useNavigate();
  const options: EmblaOptionsType = { loop: true }
  
    
  
    return ( 
      <motion.div
      initial={{opacity: 0 , translateY: 50}}
      animate={{opacity: 1 , translateY: 0}}
      transition={{duration:.3}}
      exit={{opacity: 0, translateY:100}}
    >
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <div onClick={() => navigate("/songlist")}  className="header-content">
      <h2 style={{fontSize: '2rem'}}>Popular Songs</h2>
      <h6>Show all</h6>
      </div>

      <EmblaCarousel options={options} images={carouselData.map((item) => ({ imageSrc: item.imageSrc, albumSrc: item.albumSrc ?? '' }))} audio={carouselData.map((item) => item.audioSrc )} name={carouselData.map((item) => item.name)}/>
      </ThemeProvider>
      </motion.div>
    )
  }
  
  export default Home