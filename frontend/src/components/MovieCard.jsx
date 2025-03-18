import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";

function MovieCard({ movie }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);

    function onFavoriteClick(e) {
        e.preventDefault();
        favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
    }

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img 
                    src={movie.poster_path ? `http://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.jpg"} 
                    alt={movie.title} 
                />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                        {favorite ? "❤️" : "🤍"}
                    </button>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0] || "N/A"}</p>
            </div>
        </div>
    );
}

export default MovieCard;
