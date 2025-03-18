
import './css/App.css'
import MovieCard from './components/MovieCard'
import Home from './Pages/Home';
import Favorite from './Pages/Favorite';
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar';
import { MovieProvider } from './context/MovieContext';
function App() {
  
  return (
    <div>
      <MovieProvider>
      <NavBar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/favorites" element={<Favorite/>} />
      </Routes>

    </main>
    </MovieProvider>
    </div>

  );
  
}

export default App;
