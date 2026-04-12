import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';

// Section with new MovieCard
const ContentSection = ({ title, items, linkTo, type = 'movie' }) => {
    if (!items || items.length === 0) return null;

    return (
        <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '3px solid var(--primary-accent)' }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em'
                }}>
                    {title}
                </h2>
                {linkTo && (
                    <Link to={linkTo} style={{ textDecoration: 'none' }}>
                        <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 24px' }}>
                            View All
                        </button>
                    </Link>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '24px'
            }}>
                {items.slice(0, 10).map(item => (
                    <MovieCard key={item.id} movie={item} />
                ))}
            </div>
        </section>
    );
};

// Bento Grid for Trending
const TrendingBentoGrid = ({ items }) => {
    if (!items || items.length < 5) return null;

    return (
        <section style={{ marginBottom: '5rem' }}>
            <h2 style={{
                marginBottom: '1.5rem',
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #fff, #666)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
            }}>
                Trending Now
            </h2>

            <div className="bento-grid">
                {/* Large Featured Item */}
                <div style={{
                    gridColumn: 'span 2',
                    gridRow: 'span 2',
                    height: '100%'
                }}>
                    <MovieCard movie={items[0]} height="100%" />
                </div>

                {/* Secondary Items */}
                <div style={{ gridColumn: 'span 1', height: '100%' }}>
                    <MovieCard movie={items[1]} height="100%" />
                </div>
                <div style={{ gridColumn: 'span 1', height: '100%' }}>
                    <MovieCard movie={items[2]} height="100%" />
                </div>
                <div style={{ gridColumn: 'span 1', height: '100%' }}>
                    <MovieCard movie={items[3]} height="100%" />
                </div>
                <div style={{ gridColumn: 'span 1', height: '100%' }}>
                    <MovieCard movie={items[4]} height="100%" />
                </div>
            </div>
        </section>
    );
};

// Simplified Celebrity Section
const CelebritySection = ({ people, linkTo }) => (
    <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '3px solid var(--highlight-gold)' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Star Power</h2>
            {linkTo && (
                <Link to={linkTo} style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 24px' }}>View All</button>
                </Link>
            )}
        </div>
        <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '24px',
            paddingBottom: '1rem',
            scrollbarWidth: 'thin'
        }}>
            {people.map((person, index) => (
                <div key={person.id + '-' + index} style={{ flex: '0 0 140px', textAlign: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 1rem',
                        border: '2px solid rgba(255,255,255,0.1)',
                        transition: 'transform 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img
                            src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x200?text=No+Image'}
                            alt={person.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '0.2rem', color: '#fff', fontWeight: '600' }}>{person.name}</h3>
                </div>
            ))}
        </div>
    </section>
);

const Home = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [popularPeople, setPopularPeople] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [genres, setGenres] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                if (searchQuery) {
                    const data = await api.searchMovies(searchQuery);
                    setSearchResults(data.results || []);
                } else {
                    const [pop, top, up, now, people, genreList] = await Promise.all([
                        api.getPopularMovies(),
                        api.getTopRatedMovies(),
                        api.getUpcomingMovies(),
                        api.getNowPlayingMovies(),
                        api.getPopularPeople(),
                        api.getGenres()
                    ]);
                    setPopular(pop.results || []);
                    setTopRated(top.results || []);
                    setUpcoming(up.results || []);
                    setNowPlaying(now.results || []);
                    setPopularPeople(people.results || []);
                    setGenres(genreList.genres || []);
                }
            } catch (error) {
                console.error("Failed to fetch movies", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchQuery]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    // If searching, show simple grid
    if (searchQuery) {
        return (
            <div className="container" style={{ paddingTop: '120px' }}>
                <ContentSection title={`Search Results for "${searchQuery}"`} items={searchResults} />
            </div>
        );
    }

    // Main Design
    const featuredMovie = nowPlaying[0] || popular[0]; // Hero movie
    const trendingList = popular.slice(1, 6); // Items for Bento Grid (skip hero)

    return (
        <div className="fade-in" style={{ paddingBottom: '5rem' }}>

            {/* 1. Immersive Hero Section */}
            <HeroSection movie={featuredMovie} />

            <div className="container">

                {/* 2. Bento Grid for Trending */}
                <TrendingBentoGrid items={trendingList} />

                {/* 3. Categories Pills */}
                <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Discover by Genre</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                        {genres.slice(0, 15).map(genre => (
                            <Link
                                key={genre.id}
                                to={`/genre/${genre.id}`}
                                className="glass-panel"
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '50px',
                                    fontSize: '0.9rem',
                                    color: '#fff',
                                    transition: 'all 0.3s',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-glass)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {genre.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 4. Content Sections */}
                <ContentSection
                    title="In Theaters Now"
                    items={nowPlaying.slice(1)} // Skip hero
                    linkTo="/section/now_playing"
                />

                <ContentSection
                    title="Top Rated Classics"
                    items={topRated}
                    linkTo="/section/top_rated"
                />

                <CelebritySection
                    people={popularPeople}
                    linkTo="/section/people"
                />

                <ContentSection
                    title="Coming Soon"
                    items={upcoming}
                    linkTo="/section/upcoming"
                />
            </div>
        </div>
    );
};

export default Home;
