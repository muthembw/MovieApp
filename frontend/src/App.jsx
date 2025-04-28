import './css/App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './Pages/Home';
import Favorite from './Pages/Favorite';
import Recommendations from './Pages/Recommendation';
import Login from './Pages/Login';
import Register from './Pages/Register';
import RateMovie from './Pages/RateMovie'
import { MovieProvider } from './context/MovieContext';
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <div>
      <AuthProvider>
      <MovieProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorite />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/rate-movie/:movieId" element={<RateMovie />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </MovieProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
