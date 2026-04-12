import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';

const HeroSection = ({ movie }) => {
    if (!movie) return null;

    const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

    return (
        <section style={{
            position: 'relative',
            width: '100%',
            height: '85vh',
            overflow: 'hidden',
            marginBottom: '4rem'
        }}>
            {/* Background Image */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${backdropUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
            }}>
                {/* Gradient Overlay for text readability and cinematic look */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.6) 60%, rgba(5,5,5,1) 100%)'
                }} />

                {/* Right side fade for text area focus */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0) 60%)'
                }} />
            </div>

            <div className="container" style={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                zIndex: 10
            }}>
                <div className="hero-content fade-up" style={{ maxWidth: '700px' }}>

                    {/* Badge / Tag */}
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '30px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '20px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        #1 Trending Today
                    </div>

                    <h1 style={{
                        fontSize: '4.5rem',
                        lineHeight: 1.1,
                        marginBottom: '1rem',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                        {movie.title}
                    </h1>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '2rem',
                        color: '#ccc',
                        fontSize: '1.1rem'
                    }}>
                        <span style={{ color: '#46d369', fontWeight: 'bold' }}>{Math.round(movie.vote_average * 10)}% Match</span>
                        <span>{movie.release_date?.split('-')[0]}</span>
                        <span style={{ border: '1px solid #666', padding: '0 6px', borderRadius: '4px', fontSize: '0.8rem' }}>HD</span>
                    </div>

                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '2.5rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        maxWidth: '90%'
                    }}>
                        {movie.overview}
                    </p>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to={`/movie/${movie.id}`}>
                            <button className="btn" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: '#fff',
                                color: '#000',
                                border: 'none'
                            }}>
                                <Info size={20} />
                                More Info
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
