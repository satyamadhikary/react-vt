import React from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import '../css/albumembla.css';
import albumsData from '@/arrays/albumsData.json'; // Import albumsData
import { useNavigate } from 'react-router-dom'; // Import useNavigate

type PropType = {
    options?: EmblaOptionsType;
};

const AlbumEmbla: React.FC<PropType> = (props) => {
    const { options } = props;
    const [emblaRef] = useEmblaCarousel(options, [Autoplay()]);
    const navigate = useNavigate(); // Initialize navigate

    return (
        <section className="emblaa">
            <div className="emblaa__viewport" ref={emblaRef}>
                <div className="emblaa__container">
                    {albumsData.map((album, index) => (
                        <div
                            className="emblaa__slide px-2"
                            key={index}
                            onClick={() => navigate(`/album/${album.id}`)} // Navigate to album details
                        >
                            <div className="relative flex flex-col items-center bg-gray-800 rounded-lg p-2 group cursor-pointer">
                                <div className="w-full h-40 bg-gray-700 rounded-lg overflow-hidden relative">
                                    <img
                                        src={album.imageSrc}
                                        alt={album.name}
                                        className="album-img"
                                    />
                                    {/* Hover Play Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                        <button className="text-black flex items-center justify-center rounded-full shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="white"
                                                viewBox="0 0 24 24"
                                                width="48px"
                                                height="48px"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-white text-sm mt-2 text-center line-clamp-2">
                                    {album.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AlbumEmbla;
