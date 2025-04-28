import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import "../css/NavBar.css";

function NavBar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie App</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <Link to="/recommendations" className="nav-link">Recommendations</Link>

        {user ? (
          // Show logout button if logged in
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              window.location.href = '/login'; // simple reload and redirect
            }}
            className="nav-button logout-button"
          >
            Logout
          </button>
        ) : (
          // Show login and register buttons if not logged in
          <>
            <button 
              onClick={() => navigate('/login')}
              className="nav-button"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="nav-button"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
