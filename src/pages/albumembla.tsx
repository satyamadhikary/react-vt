import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import '../css/albumembla.css'
import { songsData } from '@/arrays/songsData'
import { IoPlayCircleSharp } from "react-icons/io5"; // Import play icon

type PropType = {
    options?: EmblaOptionsType
}

const AlbumEmbla: React.FC<PropType> = (props) => {
    const { options } = props
    const [emblaRef] = useEmblaCarousel(options, [Autoplay()])

    return (
        <section className="emblaa">
            <div className="emblaa__viewport" ref={emblaRef}>
                <div className="emblaa__container">
                    {songsData.map((song, index) => (
                        <div
                            className="emblaa__slide px-2" 
                            key={index}
                        >
                            <div className="relative flex flex-col items-center bg-gray-800 rounded-lg p-2 group">
                                <div className="w-full h-40 bg-gray-700 rounded-lg overflow-hidden relative">
                                    <img
                                        src={song.imageSrc}
                                        alt={song.name}
                                        className="album-img"
                                    />
                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                        <button className="text-black flex items-center justify-center rounded-full shadow-lg">
                                            <IoPlayCircleSharp style={{ color: "white"}} className="w-14 h-14" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-white text-sm mt-2 text-center line-clamp-2">
                                    {song.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AlbumEmbla
