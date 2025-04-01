import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import '../css/albumembla.css';
import { useNavigate } from 'react-router-dom';
import { Audio } from '@/features/audio/types';
import { setPlaylist } from '@/features/audio/audioSlice';

type PropType = {
    options?: EmblaOptionsType;
};

const Serveralbum: React.FC<PropType> = (props) => {
    const { options } = props;
    const [emblaRef] = useEmblaCarousel(options, [Autoplay()]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [songs, setSongs] = useState<Audio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch("https://test-flute.onrender.com/get-urls/albums");
                if (!response.ok) throw new Error("Failed to fetch songs");
                const data = await response.json();
                setSongs(data.data);
                dispatch(setPlaylist(data.data));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [dispatch]);

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <p className="text-white text-lg">Loading Albums...</p>
                </div>
            ) : (
                <section className="emblaa">
                    <div className="emblaa__viewport" ref={emblaRef}>
                        <div className="emblaa__container">
                            {songs.map((song, index) => (
                                <div
                                    className="emblaa__slide px-2"
                                    key={index}
                                    onClick={() => navigate(`/serveralbum/${song.id || song._id}`)}
                                >
                                    <div className="relative flex flex-col items-center bg-gray-800 rounded-lg p-2 group cursor-pointer">
                                        <div className="w-full h-40 bg-gray-700 rounded-lg overflow-hidden relative">
                                            <img
                                                src={song.imageSrc}
                                                alt={song.title}
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
                                            {song.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};


export default Serveralbum;
