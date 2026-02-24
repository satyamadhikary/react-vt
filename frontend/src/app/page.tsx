"use client";
import Albumcarousel from "@/components/albumcarousel";
import EmblaCarousel from "@/components/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import { motion } from "motion/react";
import carouselData from "@/arrays/CarouselData.json";
import Link from "next/link";

const Home = () => {
  const options: EmblaOptionsType = { loop: true };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0, translateY: 100 }}
    >
      <Link href="/songlist" className="header-content">
        <h2 style={{ fontSize: "2rem" }}>Popular Songs</h2>
        <h6>Show all</h6>
      </Link>

      <EmblaCarousel
        options={options}
        images={carouselData.map((item) => ({ imageSrc: item.imageSrc }))}
        audio={carouselData.map((item) => item.audioSrc)}
        name={carouselData.map((item) => item.name)}
      />

      <Albumcarousel />
    </motion.div>
  );
};

export default Home;
