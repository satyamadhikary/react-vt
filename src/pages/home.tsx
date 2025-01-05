import { ThemeProvider } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import "../index.css";
import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";




const Home = () => {
  const navigate = useNavigate();
  const options: EmblaOptionsType = { loop: true }
  const CarouselData = [
    {
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/flute-8592b.appspot.com/o/Album%20Images%2FEeeHawa.jpeg?alt=media&token=41ab1d84-fbec-4e0e-8652-a3304c3114f0',
    audioSrc: 'https://firebasestorage.googleapis.com/v0/b/storage-bucket-575e1.appspot.com/o/music%2Fin-y2mate.com%20-%20E%20Hawa%20%20Meghdol%20X%20Hawa%20Film%20%20Aluminium%20Er%20Dana.mp3?alt=media&token=3724b578-ea7e-45c9-8ada-9dd5db28fca9'
    },
    {
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/flute-8592b.appspot.com/o/Album%20Images%2FGhorgari.png?alt=media&token=3dd7c472-8c35-4d0b-a02d-b2a77d366b70',
    audioSrc: 'https://firebasestorage.googleapis.com/v0/b/storage-bucket-575e1.appspot.com/o/music%2Fin-y2mate.com%20-%20GhorGari%20%E0%A6%98%E0%A6%B0%E0%A6%97%E0%A6%A1%20%20Album%20Train%20Poka%20%20HIGHWAY.mp3?alt=media&token=5c83592f-9ec2-48ed-b44a-3865a15ae03a'
    },
    {
      imageSrc: 'https://firebasestorage.googleapis.com/v0/b/flute-8592b.appspot.com/o/Album%20Images%2FObosthan.jpeg?alt=media&token=92c08d0d-51cb-448d-82a1-228eedff9f5f',
      audioSrc: 'https://firebasestorage.googleapis.com/v0/b/storage-bucket-575e1.appspot.com/o/music%2FObosthan.mp3?alt=media&token=9f0c0914-2ff4-40f5-8545-f23df037532b'
    }
    
  ];
    return ( 
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <div onClick={() => navigate("/songlist")}  className="header-content">
      <h2 style={{fontSize: '2rem'}}>Popular Songs</h2>
      <h6>Show all</h6>
      </div>

      <EmblaCarousel options={options} images={CarouselData} audio={CarouselData.map((item) => item.audioSrc)}/>
      </ThemeProvider>
    )
  }
  
  export default Home