import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import MovieCard from '../components/MovieCard';

const PersonDetail = () => {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const personData = await api.getPerson(id);
                setPerson(personData);

                const creditsData = await api.getPersonMovieCredits(id);
                // Sort by popularity 
                const sorted = creditsData.cast.sort((a, b) => b.popularity - a.popularity);
                setCredits(sorted);
            } catch (error) {
                console.error("Error loading person data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '20px' }}>Loading...</div>;
    if (!person) return <div className="container">Person not found</div>;

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
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 300px' }}>
                        <img
                            src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                            alt={person.name}
                            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>{person.name}</h1>
                        <p style={{ color: 'var(--secondary-accent)', marginBottom: '1rem' }}>
                            {person.birthday} {person.place_of_birth && `• ${person.place_of_birth}`}
                        </p>

                        <h3 style={{ borderBottom: '1px solid var(--secondary-accent)', paddingBottom: '0.5rem', marginBottom: '0.5rem', color: '#ccc' }}>Biography</h3>
                        <p style={{ lineHeight: '1.6', fontSize: '1rem', color: '#e0e0e0', maxHeight: '300px', overflowY: 'auto' }}>
                            {person.biography || "No biography available."}
                        </p>
                    </div>
                </div>

                {/* Known For Grid */}
                <div>
                    <h3 style={{ color: 'var(--accent)', marginBottom: '1rem', borderLeft: '4px solid var(--secondary-accent)', paddingLeft: '1rem' }}>Known For</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', // Use standard grid sizing
                        gap: '24px'
                    }}>
                        {credits.slice(0, 20).map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonDetail;
