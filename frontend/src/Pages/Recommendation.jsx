import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useMovieContext } from '../context/MovieContext';
import api from '../services/localApi';
import MovieCard from '../components/MovieCard.jsx';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const { user } = useContext(AuthContext);
  const { favorites } = useMovieContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customMovie, setCustomMovie] = useState(''); // for user input
  const [defaultMovie, setDefaultMovie] = useState('Titanic'); // fallback

  useEffect(() => {
    fetchRecommendations();
  }, [user, favorites, navigate]);

  const fetchRecommendations = async (movieName = null) => {
    setLoading(true);
    try {
      let res;

      if (user?._id) {
        // User-based collaborative filtering
        res = await api.get(`api/recommendations/user_cf?user_id=${user._id}`);
      } else if (favorites && favorites.length > 0) {
        // Item-based collaborative filtering
        const likedMovies = favorites.map(movie => movie.title).join('&liked_movies=');
        res = await api.get(`api/recommendations/item_cf?liked_movies=${likedMovies}`);
      } else {
        // Context-based (default movie OR user-provided movie)
        const movieQuery = movieName || defaultMovie;
        res = await api.get(`api/recommendations/context_based?movie=${encodeURIComponent(movieQuery)}`);
      }

      setRecommendedMovies(res.data.recommendations);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      if (err.response && err.response.status === 401) {
        alert("Please login to view personalized recommendations.");
        navigate('/login');
      } else {
        alert('Failed to fetch recommendations. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCustomMovieSubmit = (e) => {
    e.preventDefault();
    if (!customMovie.trim()) {
      alert("Please enter a movie title.");
      return;
    }
    fetchRecommendations(customMovie);
    setCustomMovie(''); // clear input
  };

  return (
    <div className="relative max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recommended For You 🎬</h1>

      {loading ? (
        <div>Loading recommendations...</div>
      ) : !Array.isArray(recommendedMovies) || recommendedMovies.length === 0 ? (
        <p className="text-gray-500">No recommendations available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedMovies.map((movie, index) => (
            <MovieCard key={movie._id || index} movie={movie} />
          ))}
        </div>
      )}

      {/* Form on bottom right */}
      <form 
        onSubmit={handleCustomMovieSubmit}
        className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-lg w-64"
      >
        <h2 className="text-lg font-semibold mb-2">Get A Starter 🎥</h2>
        <input 
          type="text" 
          placeholder="Enter movie name..." 
          value={customMovie} 
          onChange={(e) => setCustomMovie(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          For You!!!
        </button>
      </form>
    </div>
  );
};

export default Recommendations;
