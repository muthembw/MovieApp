import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/localApi'; 
import '../css/RateMovie.css';

function RateMovie() {
    const { movieId } = useParams();  // Get the movie ID from the URL
    const navigate = useNavigate();
    const [rating, setRating] = useState('');  // Store rating as a string initially, but convert to a number later
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure rating is between 1 and 10
        const numericRating = parseFloat(rating);  // Convert rating to a number
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
            alert('Please enter a rating between 1 and 10.');
            return;
        }
    
        setIsSubmitting(true); 
    
        try {
            const user = JSON.parse(localStorage.getItem("user"));
    
            if (!user) {
                alert("You must be logged in to rate movies.");
                setIsSubmitting(false);
                return;
            }
    
            const response = await api.post("/api/movie/rate", {
                user_id: user.id,
                movie_id: movieId,
                rating: numericRating,  // Use numericRating
                comment,
            },
            {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                }
            });
    
            if (response.status === 200) {
                alert("Rating submitted successfully!");
                navigate(`/movie/${movieId}`); 
            }
        } catch (err) {
            console.error("Error submitting rating:", err);
            alert("Failed to submit rating.");
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="rate-movie-container">
            <div className="rate-movie-box">
                <h2>Rate the Movie</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="rating">Rating (1-10):</label>
                        <input
                            id="rating"
                            type="number"
                            min="1"
                            max="10"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            disabled={isSubmitting} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comment">Comment:</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting}  
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="submit-button">
                        {isSubmitting ? "Sending..." : "Send"} 
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RateMovie;
