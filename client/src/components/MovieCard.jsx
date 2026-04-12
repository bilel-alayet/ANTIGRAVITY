import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const MovieCard = ({ movie, className = '', height = '100%' }) => {
    if (!movie) return null;

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <Link
            to={`/movie/${movie.id}`}
            className={`movie-card-wrapper ${className}`}
            style={{
                display: 'block',
                height: height,
                position: 'relative',
                borderRadius: 'var(--card-radius)',
                overflow: 'hidden',
                textDecoration: 'none'
            }}
        >
            <div className="movie-card-inner" style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)'
            }}>
                <img
                    src={imageUrl}
                    alt={movie.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                />

                {/* Overlay Gradient (Hidden by default, shows on hover) */}
                <div className="card-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px'
                }}>
                    <div className="card-content" style={{
                        transform: 'translateY(20px)',
                        transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)'
                    }}>
                        <h3 style={{
                            color: '#fff',
                            fontSize: '1.2rem',
                            marginBottom: '5px',
                            lineHeight: 1.2
                        }}>{movie.title}</h3>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.9rem',
                            color: 'rgba(255,255,255,0.7)'
                        }}>
                            <span>{movie.release_date?.split('-')[0]}</span>
                            <span>★ {movie.vote_average?.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Play Button Centered */}
                    <div className="play-icon" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(0.8)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        <Play fill="#fff" stroke="none" size={24} />
                    </div>
                </div>
            </div>

            <style>{`
                .movie-card-wrapper:hover .card-overlay {
                    opacity: 1;
                }
                .movie-card-wrapper:hover .card-content {
                    transform: translateY(0);
                }
                .movie-card-wrapper:hover img {
                    transform: scale(1.05);
                }
                .movie-card-wrapper:hover .play-icon {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            `}</style>
        </Link>
    );
};

export default MovieCard;
