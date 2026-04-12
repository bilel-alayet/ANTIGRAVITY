import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

import CastList from '../components/CastList';

const TVDetail = () => {
    const { id } = useParams();
    const [tv, setTv] = useState(null);
    const [cast, setCast] = useState([]);
    const [trailer, setTrailer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const data = await api.getTVDetails(id);
                setTv(data);

                const credits = await api.getTVCredits(id);
                setCast(credits.cast || []);

                const videos = await api.getTVVideos(id);
                const officialTrailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                if (officialTrailer) {
                    setTrailer(officialTrailer.key);
                }
            } catch (error) {
                console.error("Failed to fetch TV details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) return <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>Loading Signal...</div>;
    if (!tv) return <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>Signal Lost.</div>;

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
        }}>
            {/* Backdrop */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.2) blur(5px)',
                zIndex: -1
            }}></div>

            <div className="container fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem', zIndex: 1, position: 'relative' }}>
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
                    {/* Top Section */}
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: '0 0 300px' }}>
                            <img
                                src={tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                                alt={tv.name}
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                                    border: '1px solid var(--secondary-accent)'
                                }}
                            />
                        </div>

                        <div style={{ flex: 1, minWidth: '300px', color: '#fff' }}>
                            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>{tv.name}</h1>
                            <p style={{ fontSize: '1.1rem', color: 'var(--secondary-accent)', marginBottom: '1rem' }}>
                                {tv.first_air_date ? tv.first_air_date.split('-')[0] : 'N/A'} • {tv.number_of_seasons} Seasons
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                {tv.genres.map(g => (
                                    <span key={g.id} style={{
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        background: 'rgba(102, 252, 241, 0.1)',
                                        color: 'var(--accent)',
                                        border: '1px solid var(--accent)',
                                        fontSize: '0.8rem'
                                    }}>
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <h3 style={{ borderBottom: '1px solid var(--secondary-accent)', paddingBottom: '0.5rem', marginBottom: '0.5rem', color: '#ccc' }}>Synopsis</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '800px' }}>
                                {tv.overview}
                            </p>
                        </div>
                    </div>

                    {/* Cast Section */}
                    <div style={{ marginTop: '2rem' }}>
                        <CastList cast={cast} />
                    </div>

                    {/* Trailer Section */}
                    {trailer && (
                        <div style={{ marginTop: '1rem' }}>
                            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem', borderLeft: '4px solid var(--secondary-accent)', paddingLeft: '1rem' }}>Official Trailer</h3>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}>
                                <iframe
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    src={`https://www.youtube.com/embed/${trailer}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TVDetail;
