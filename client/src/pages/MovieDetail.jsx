import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

import Modal from '../components/Modal';
import CastList from '../components/CastList';
import MovieCard from '../components/MovieCard';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [trailer, setTrailer] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // Safety Features
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFavorite, setIsFavorite] = useState(false);
    const [userReview, setUserReview] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            console.log("MovieDetail: Starting fetch for ID:", id); // Debug Log
            setLoading(true);
            setError(null);

            try {
                // 1. Fetch Main Movie Details
                const movieData = await api.getMovie(id);
                console.log("MovieDetail: Fetched movie data:", movieData); // Debug Log
                setMovie(movieData);

                // 2. Fetch Credits (Safely)
                try {
                    const creditsData = await api.getMovieCredits(id);
                    setCast(creditsData?.cast || []);
                } catch (e) {
                    console.warn("Failed to lead credits", e);
                }

                // 3. Fetch Recommendations (Safely)
                try {
                    const recData = await api.getMovieRecommendations(id);
                    setRecommendations(recData?.results || []);
                } catch (e) {
                    console.warn("Failed to load recommendations", e);
                }

                // 4. Fetch Videos & Find Trailer (Safely)
                try {
                    const videoData = await api.getMovieVideos(id);
                    const officialTrailer = videoData?.results?.find(
                        vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
                    );
                    setTrailer(officialTrailer);
                } catch (e) {
                    console.warn("Failed to load videos", e);
                }

                // 5. Check Favorites (Safely)
                try {
                    const favorites = await api.getFavorites();
                    const found = favorites?.find(f => f.tmdbId === parseInt(id));
                    if (found) {
                        setIsFavorite(true);
                        setUserReview(found.userReview || '');
                    }
                } catch (e) {
                    console.warn("Failed to check favorites", e);
                }

            } catch (err) {
                console.error("MovieDetail: Critical Error loading movie", err); // Debug Log
                setError("Could not load movie details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    const handleToggleFavorite = async () => {
        if (!movie) return;
        setSaving(true);
        try {
            if (isFavorite) {
                await api.removeFavorite(movie.id);
                setIsFavorite(false);
                setUserReview('');
            } else {
                await api.addFavorite({
                    tmdbId: movie.id,
                    title: movie.title,
                    posterPath: movie.poster_path,
                    releaseDate: movie.release_date,
                    voteAverage: movie.vote_average,
                    userReview: userReview
                });
                setIsFavorite(true);
            }
        } catch (error) {
            alert("Failed to update favorite status: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleSaveReview = async () => {
        if (!isFavorite || !movie) {
            alert("Please add to favorites first before saving a review.");
            return;
        }
        setSaving(true);
        try {
            await api.updateReview(movie.id, userReview);
            alert("Review saved!");
        } catch (error) {
            console.error(error);
            alert("Failed to save review");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <h2 style={{ color: 'var(--text-secondary)' }}>Loading Movie Details...</h2>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                <h2 style={{ color: '#ff4444' }}>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn-secondary" style={{ marginTop: '1rem' }}>Try Again</button>
            </div>
        );
    }

    if (!movie) return null; // Should be handled by loading/error, but explicit safety check

    return (
        <div className="container fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                background: 'rgba(31, 40, 51, 0.85)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}>
                {/* Top Section: Poster & Info */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 300px' }}>
                        <img
                            src={movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                            alt={movie?.title}
                            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>{movie?.title}</h1>
                        <p style={{ color: 'var(--secondary-accent)', marginBottom: '1rem', fontStyle: 'italic' }}>{movie?.tagline}</p>

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                            <span style={{ background: 'var(--card-bg)', padding: '5px 10px', borderRadius: '4px' }}>{movie?.release_date}</span>
                            <span style={{ background: 'var(--card-bg)', padding: '5px 10px', borderRadius: '4px' }}>★ {movie?.vote_average?.toFixed(1)}</span>
                            <span style={{ background: 'var(--card-bg)', padding: '5px 10px', borderRadius: '4px' }}>{movie?.runtime} min</span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            {trailer && (
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="btn-primary"
                                    style={{
                                        background: 'var(--accent)',
                                        color: 'var(--bg-color)',
                                        border: 'none',
                                        padding: '12px 24px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
                                    }}
                                >
                                    <span>▶</span> Watch Trailer
                                </button>
                            )}

                            <button
                                onClick={handleToggleFavorite}
                                disabled={saving}
                                style={{
                                    backgroundColor: isFavorite ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    color: isFavorite ? '#fff' : 'var(--accent)',
                                    border: '1px solid var(--accent)',
                                    padding: '12px 24px',
                                    fontSize: '1rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    fontWeight: 'bold'
                                }}
                            >
                                {saving ? 'Processing...' : (isFavorite ? '★ In Favorites' : '+ Add to Favorites')}
                            </button>
                        </div>

                        {/* Review Section (only if favorite) */}
                        {isFavorite && (
                            <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <textarea
                                    value={userReview}
                                    onChange={(e) => setUserReview(e.target.value)}
                                    rows="2"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid var(--secondary-accent)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.9rem',
                                        fontFamily: 'inherit'
                                    }}
                                    placeholder="Write your personal log entry..."
                                />
                                <button onClick={handleSaveReview} disabled={saving} style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    fontSize: '0.85rem',
                                    background: 'var(--secondary-accent)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                                    Save Entry
                                </button>
                            </div>
                        )}

                        <h3 style={{ borderBottom: '1px solid var(--secondary-accent)', paddingBottom: '0.5rem', marginBottom: '0.5rem', color: '#ccc' }}>Synopsis</h3>
                        <p style={{ lineHeight: '1.6', fontSize: '1rem', color: '#e0e0e0' }}>{movie?.overview || "No specific overview available."}</p>
                    </div>
                </div>

                {/* Cast Section */}
                <div style={{ marginTop: '2rem' }}>
                    <CastList cast={cast} />
                </div>

                {/* Recommendations Section */}
                {recommendations && recommendations.length > 0 && (
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ color: 'var(--accent)', marginBottom: '1.5rem', borderLeft: '4px solid var(--secondary-accent)', paddingLeft: '1rem' }}>You Might Also Like</h3>
                        <div style={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: '20px',
                            paddingBottom: '1rem',
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none' // IE/Edge
                        }}>
                            <style>{`
                                div::-webkit-scrollbar { display: none; } /* Chrome/Safari */
                            `}</style>
                            {recommendations.slice(0, 10).map(movie => (
                                <div key={movie.id} style={{ flex: '0 0 180px' }}>
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Trailer Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                {trailer && (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            src={`https://www.youtube.com/embed/${trailer?.key}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </Modal>
        </div >
    );
};

export default MovieDetail;
