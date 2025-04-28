import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";
import api from "../services/localApi";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
    const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();
    const favorite = isFavorite(movie.id); // Check if the movie is in favorites

    // Function to handle clicking on the "like" button
    async function onFavoriteClick(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user?._id) {
            alert("Please login first");
            return;
        }

        try {
            // Send API request to like the movie (add to favorites)
            const response = await api.post('/api/favorites/like', {
                movie: {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update global context to reflect the liked movie
            addToFavorites(movie);
            console.log("Success:", response.data);
        } catch (error) {
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            // Handle different types of errors
            if (!error.response) {
                alert('Network error - check your connection');
            } else if (error.response.status === 401) {
                alert('Session expired. Please login again.');
            } else {
                alert(error.response.data?.message || 'Failed to like movie');
            }
        }
    }

    // Render the movie card with the correct favorite state (❤️ or 🤍)
    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img
                    src={movie.poster_path ? `http://image.tmdb.org/t/p/w500/${movie.poster_path}` : "/placeholder.jpg"}
                    alt={movie.title}
                />
                <div className="movie-overlay">
                    {/* Favorite button */}
                    <button
                        className={`favorite-btn ${favorite ? "active" : ""}`}
                        onClick={onFavoriteClick} // Handle clicking to add/remove from favorites
                    >
                        {favorite ? "❤️" : "🤍"} {/* ❤️ if liked, 🤍 if not */}
                    </button>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0] || "N/A"}</p>
                <Link to={`/rate-movie/${movie.id}`}>
                    <button>Rate It</button>
                </Link>
            </div>
        </div>
    );
}

export default MovieCard;
