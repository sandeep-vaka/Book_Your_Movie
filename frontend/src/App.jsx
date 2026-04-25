import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import TheatreSelection from './pages/TheatreSelection';
import SeatSelection from './pages/SeatSelection';
import PaymentSummary from './pages/PaymentSummary';

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/movie/:id/theatres" element={<TheatreSelection />} />
          <Route path="/show/:id/seats" element={<SeatSelection />} />
          <Route path="/payment" element={<PaymentSummary />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
