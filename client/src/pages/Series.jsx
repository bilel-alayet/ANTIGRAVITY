import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import MovieCard from '../components/MovieCard';

// Reuse content section for consistency
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

const Series = () => {
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [onTheAir, setOnTheAir] = useState([]);
    const [airingToday, setAiringToday] = useState([]);
    const [popularPeople, setPopularPeople] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTV = async () => {
            setLoading(true);
            try {
                const results = await Promise.allSettled([
                    api.getPopularTV(),
                    api.getTopRatedTV(),
                    api.getOnTheAirTV(),
                    api.getAiringTodayTV(),
                    api.getPopularPeople(),
                    api.getTVGenres()
                ]);

                const [pop, top, air, today, people, genreList] = results;

                if (pop.status === 'fulfilled') setPopular(pop.value.results || []);
                if (top.status === 'fulfilled') setTopRated(top.value.results || []);
                if (air.status === 'fulfilled') setOnTheAir(air.value.results || []);
                if (today.status === 'fulfilled') setAiringToday(today.value.results || []);
                if (people.status === 'fulfilled') setPopularPeople(people.value.results || []);
                if (genreList.status === 'fulfilled') setGenres(genreList.value.genres || []);

            } catch (error) {
                console.error("Unexpected error in Series fetch", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTV();
    }, []);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="container fade-in" style={{ paddingTop: '100px', paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    TV SERIES
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', letterSpacing: '1px' }}>
                    Binge-worthy transmissions from across the galaxy.
                </p>
            </div>

            {/* Categories Section */}
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                    {genres.map(genre => (
                        <Link
                            key={genre.id}
                            to={`/tv/genre/${genre.id}`}
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

            <ContentSection
                title="Airing Today"
                items={airingToday}
                type="tv"
                linkTo="/tv/section/airing_today"
            />

            <CelebritySection
                people={popularPeople}
                linkTo="/section/people"
            />

            <ContentSection
                title="Popular Series"
                items={popular}
                type="tv"
                linkTo="/tv/section/popular"
            />

            <ContentSection
                title="Top Rated Series"
                items={topRated}
                type="tv"
                linkTo="/tv/section/top_rated"
            />

            <ContentSection
                title="On The Air"
                items={onTheAir}
                type="tv"
                linkTo="/tv/section/on_the_air"
            />

        </div>
    );
};
export default Series;
