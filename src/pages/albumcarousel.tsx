import '../css/albumcarousel.css';
import AlbumEmbla from './albumembla';
import { EmblaOptionsType } from 'embla-carousel';

const OPTIONS: EmblaOptionsType = { align: 'start', dragFree: true, loop: true }

const Albumcarousel = () => {
    return (
        <div className="album-container">
            <h2>Popular Albums</h2>
            <div className="slider-container">
                <AlbumEmbla options={OPTIONS} />
            </div>
        </div>
    );
}

export default Albumcarousel;
