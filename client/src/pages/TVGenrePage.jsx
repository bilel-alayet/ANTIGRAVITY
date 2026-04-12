import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api } from '../api';

const TVGenrePage = () => {
    const { id } = useParams();
    const location = useLocation();
    const genreName = location.state?.genreName || 'Genre';

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setPage(1);
            setItems([]);
            try {
                const data = await api.getTVByGenre(id);
                setItems(data.results || []);
            } catch (error) {
                console.error("Error loading genre data", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const data = await api.getTVByGenre(id, nextPage);
            if (data.results && data.results.length > 0) {
                setItems(prev => [...prev, ...data.results]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Error loading more", error);
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '20px', textAlign: 'center' }}>Loading Frequency...</div>;

    return (
        <div className="container fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    color: 'var(--accent)',
                    borderLeft: '4px solid var(--secondary-accent)',
                    paddingLeft: '1rem'
                }}>
                    {genreName} Series
                </h1>
                <Link to="/series" style={{ color: 'var(--secondary-accent)', textDecoration: 'none' }}>&larr; Back to Series</Link>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1.5rem'
            }}>
                {items.map((item, index) => (
                    <Link to={`/tv/${item.id}`} key={`${item.id}-${index}`} style={{ display: 'block' }}>
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            height: '100%',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 252, 241, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
                            }}
                        >
                            <img
                                src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                                alt={item.name}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--secondary-accent)' }}>
                                    <span>{item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A'}</span>
                                    <span>★ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="btn"
                    style={{ padding: '10px 30px', minWidth: '200px' }}
                >
                    {loadingMore ? 'Scanning...' : 'Load More'}
                </button>
            </div>
        </div>
    );
};

export default TVGenrePage;
