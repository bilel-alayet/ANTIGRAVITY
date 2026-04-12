import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await api.getFavorites();
                setFavorites(data);
            } catch (error) {
                console.error("Failed to fetch favorites", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemove = async (e, id) => {
        e.preventDefault(); // Prevent link navigation
        if (!window.confirm("Remove from favorites?")) return;
        try {
            await api.removeFavorite(id);
            setFavorites(favorites.filter(f => f.tmdbId !== id));
        } catch (error) {
            alert("Failed to remove");
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '20px' }}>Loading...</div>;

    return (
        <div className="container fade-in" style={{ paddingTop: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Your Stored Data</h2>

            {favorites.length === 0 && <p>No Cloud Data found.</p>}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {favorites.map(movie => (
                    <Link to={`/movie/${movie.tmdbId}`} key={movie._id} style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            padding: '1rem',
                            borderRadius: '8px',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            border: '1px solid transparent',
                            transition: 'border-color 0.3s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--secondary-accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                        >
                            <img
                                src={movie.posterPath ? `https://image.tmdb.org/t/p/w200${movie.posterPath}` : 'https://via.placeholder.com/200x300'}
                                alt={movie.title}
                                style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{movie.title}</h3>
                                {movie.userReview && (
                                    <p style={{ color: 'var(--text-primary)', opacity: 0.8, fontSize: '0.9rem' }}>
                                        "{movie.userReview}"
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={(e) => handleRemove(e, movie.tmdbId)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #ff4444',
                                    color: '#ff4444',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
