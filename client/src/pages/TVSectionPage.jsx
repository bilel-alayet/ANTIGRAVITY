import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

const TVSectionPage = () => {
    const { category } = useParams();
    const [createTitle, setTitle] = useState('');
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
                let data;
                switch (category) {
                    case 'popular':
                        setTitle('Popular Series');
                        data = await api.getPopularTV();
                        break;
                    case 'top_rated':
                        setTitle('Top Rated Series');
                        data = await api.getTopRatedTV();
                        break;
                    case 'on_the_air':
                        setTitle('On The Air');
                        data = await api.getOnTheAirTV();
                        break;
                    case 'airing_today':
                        setTitle('Airing Today');
                        data = await api.getAiringTodayTV();
                        break;
                    default:
                        setTitle('Unknown Section');
                        data = { results: [] };
                }
                setItems(data.results || []);
            } catch (error) {
                console.error("Error loading section data", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [category]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            let data;
            switch (category) {
                case 'popular': data = await api.getPopularTV(nextPage); break;
                case 'top_rated': data = await api.getTopRatedTV(nextPage); break;
                case 'on_the_air': data = await api.getOnTheAirTV(nextPage); break;
                case 'airing_today': data = await api.getAiringTodayTV(nextPage); break;
                default: return;
            }
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

    if (loading) return <div className="container" style={{ paddingTop: '20px', textAlign: 'center' }}>Loading Section Data...</div>;

    return (
        <div className="container fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    color: 'var(--accent)',
                    borderLeft: '4px solid var(--secondary-accent)',
                    paddingLeft: '1rem'
                }}>
                    {createTitle}
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
                            position: 'relative'
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
                                src={item.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                    : 'https://via.placeholder.com/500x750?text=No+Image'}
                                alt={item.name}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.name}
                                </h3>
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
                    {loadingMore ? 'Scanning Deep Space...' : 'Load More Transmissions'}
                </button>
            </div>
        </div>
    );
};

export default TVSectionPage;
