import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import SectionPage from './pages/SectionPage';
import GenrePage from './pages/GenrePage';
import Series from './pages/Series';
import TVSectionPage from './pages/TVSectionPage';
import TVGenrePage from './pages/TVGenrePage';
import TVDetail from './pages/TVDetail';
import News from './pages/News';
import PersonDetail from './pages/PersonDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatWidget from './components/ChatWidget';

function App() {
    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/movie/:id" element={<MovieDetail />} />
                        <Route path="/person/:id" element={<PersonDetail />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/section/:category" element={<SectionPage />} />
                        <Route path="/genre/:id" element={<GenrePage />} />
                        <Route path="/series" element={<Series />} />
                        <Route path="/tv/:id" element={<TVDetail />} />
                        <Route path="/tv/section/:category" element={<TVSectionPage />} />
                        <Route path="/tv/genre/:id" element={<TVGenrePage />} />
                        <Route path="/news" element={<News />} />
                    </Routes>
                </main>
                <footer style={{
                    textAlign: 'center',
                    padding: '1rem',
                    backgroundColor: 'var(--card-bg)',
                    marginTop: 'auto',
                    fontSize: '0.8rem',
                    color: 'var(--secondary-accent)'
                }}>
                    &copy; {new Date().getFullYear()} made by bilel . Data provided by TMDB.
                </footer>
                <ChatWidget />
            </div>
        </Router>
    );
}

export default App;
