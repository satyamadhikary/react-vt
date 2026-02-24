import '../app/css/albumcarousel.css';
import AlbumCard from './album-card';

const Albumcarousel = () => {
    return (
        <div className="album-container">
            <h2>Popular Albums</h2>
            <div className="slider-container">
                <AlbumCard />
            </div>
        </div>
    );
};

export default Albumcarousel;
