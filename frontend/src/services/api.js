const API_KEY = "7370bc98f55160105fc78cd7f21926c2";
const BASE_URL = "https://api.themoviedb.org/3"; // ✅ Corrected BASE_URL

export const getPopularMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`); // ✅ Removed extra '/'
    if (!response.ok) throw new Error("Failed to fetch movies");
    
    const data = await response.json();
    console.log("Fetched Popular Movies:", data); // 🔍 Debugging Step
    return data.results || []; // ✅ Ensure it returns an array
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return []; // ✅ Return empty array to avoid crashes
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to fetch search results");
    
    const data = await response.json();
    console.log("Fetched Search Results:", data); // 🔍 Debugging Step
    return data.results || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};
