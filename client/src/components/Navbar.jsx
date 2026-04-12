import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Film, Tv } from 'lucide-react';
import { api } from '../api';

const Navbar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTvGenres] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'movies' | 'series' | null
    const dropdownTimeout = useRef(null);

    const isAuthenticated = !!localStorage.getItem('token');
    const storedUser = isAuthenticated ? JSON.parse(localStorage.getItem('user') || '{}') : null;

    useEffect(() => {
        Promise.all([api.getGenres(), api.getTVGenres()])
            .then(([movieData, tvData]) => {
                setMovieGenres(movieData.genres || []);
                setTvGenres(tvData.genres || []);
            })
            .catch(() => {});
    }, []);

    const handleMouseEnter = (menu) => {
        clearTimeout(dropdownTimeout.current);
        setActiveDropdown(menu);
    };

    const handleMouseLeave = () => {
        dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 180);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <nav className="glass-nav" style={{
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'var(--primary-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    fontFamily: 'var(--heading-font)',
                    textShadow: '0 0 10px rgba(233, 69, 96, 0.4)'
                }}>
                    Antigravity
                </Link>

                <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                    <Link to="/" style={{ color: '#fff', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.9rem' }}>Home</Link>

                    {/* Movies Dropdown */}
                    <div
                        className="nav-dropdown-wrapper"
                        onMouseEnter={() => handleMouseEnter('movies')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link to="/" className="nav-dropdown-trigger">
                            <Film size={15} style={{ marginRight: '5px', opacity: 0.8 }} />
                            Movies
                            <ChevronDown size={14} className={`nav-chevron${activeDropdown === 'movies' ? ' open' : ''}`} />
                        </Link>
                        {activeDropdown === 'movies' && (
                            <div className="nav-dropdown-menu">
                                <div className="nav-dropdown-header">
                                    <Film size={16} />
                                    Movie Genres
                                </div>
                                <div className="nav-dropdown-grid">
                                    {movieGenres.map(genre => (
                                        <Link
                                            key={genre.id}
                                            to={`/genre/${genre.id}`}
                                            className="nav-dropdown-item"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Series Dropdown */}
                    <div
                        className="nav-dropdown-wrapper"
                        onMouseEnter={() => handleMouseEnter('series')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link to="/series" className="nav-dropdown-trigger">
                            <Tv size={15} style={{ marginRight: '5px', opacity: 0.8 }} />
                            Series
                            <ChevronDown size={14} className={`nav-chevron${activeDropdown === 'series' ? ' open' : ''}`} />
                        </Link>
                        {activeDropdown === 'series' && (
                            <div className="nav-dropdown-menu">
                                <div className="nav-dropdown-header">
                                    <Tv size={16} />
                                    TV Genres
                                </div>
                                <div className="nav-dropdown-grid">
                                    {tvGenres.map(genre => (
                                        <Link
                                            key={genre.id}
                                            to={`/tv/genre/${genre.id}`}
                                            className="nav-dropdown-item"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/news" style={{ color: '#fff', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.9rem' }}>News</Link>

                    {!isAuthenticated && (
                        <>
                            <Link to="/login" style={{ color: '#fff', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.9rem' }}>Login</Link>
                            <Link to="/register" style={{ color: 'var(--primary-accent)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.9rem' }}>Register</Link>
                        </>
                    )}

                    <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="🎬  Search movies..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{
                                paddingLeft: '16px',
                                paddingRight: '44px',
                                paddingTop: '9px',
                                paddingBottom: '9px',
                                width: '240px',
                                fontSize: '0.88rem',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '25px',
                                color: '#fff',
                                outline: 'none',
                                backdropFilter: 'blur(8px)',
                                transition: 'border-color 0.2s, background 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onFocus={e => { e.target.style.borderColor = 'var(--primary-accent)'; e.target.style.background = 'rgba(233,69,96,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                        />
                        <button type="submit" style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Search size={17} />
                        </button>
                    </form>

                    {isAuthenticated && (
                        <Link to="/profile" title="My Profile" style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={storedUser?.profilePicture || `https://ui-avatars.com/api/?name=${storedUser?.username || 'U'}&background=e94560&color=fff&size=40`}
                                alt="Profile"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid var(--primary-accent)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 0 0 0 rgba(233,69,96,0)'
                                }}
                                onMouseEnter={e => { e.target.style.transform = 'scale(1.1)'; e.target.style.boxShadow = '0 0 10px rgba(233,69,96,0.6)'; }}
                                onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 0 0 0 rgba(233,69,96,0)'; }}
                            />
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
