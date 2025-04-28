import React, { useEffect, useState } from "react"; 
import "../css/Favorites.css";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import api from "../services/localApi";  

function Favorite() {
  const { favorites, removeFromFavorites } = useMovieContext();  
  const [localFavorites, setLocalFavorites] = useState(favorites); // Initialize with context favorites

  // Fetch favorites when the component mounts or favorites context updates
  useEffect(() => {
    setLocalFavorites(favorites); // Update localFavorites from context
  }, [favorites]); // Dependency array to re-render when context favorites change

  const handleUnlike = async (movie) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/favorites/unlike`, {
        data: { movie_id: movie.id }, // Send as body
        headers: { Authorization: `Bearer ${token}` }, // Add token
      }); 

      // Remove movie from the local state and context
      setLocalFavorites(localFavorites.filter((fav) => fav.id !== movie.id));
      removeFromFavorites(movie.id);

      alert(`Removed ${movie.title} from favorites`);
    } catch (err) {
      console.error("Error unliking movie", err);
      alert("Failed to unlike movie.");
    }
  };

  if (localFavorites && localFavorites.length > 0) {
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>
        <div className="movies-grid">
          {localFavorites.map((movie) => (
            <div key={movie.id} className="favorite-movie-card">
              <MovieCard movie={movie} />
              <button 
                className="unlike-button" 
                onClick={() => handleUnlike(movie)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorite-empty">
      <h2>No Favorite movies yet</h2>
      <p>Start adding movies to your favorites and they will appear here</p>
    </div>
  );
}

export default Favorite;
