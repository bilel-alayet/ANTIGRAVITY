import { Link } from 'react-router-dom';

const CastList = ({ cast }) => {
    if (!cast || cast.length === 0) return null;

    return (
        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem', borderLeft: '4px solid var(--secondary-accent)', paddingLeft: '1rem' }}>Top Cast</h3>
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '1.5rem',
                paddingBottom: '1rem',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--secondary-accent) var(--bg-color)'
            }}>
                {cast.slice(0, 15).map(person => (
                    <Link to={`/person/${person.id}`} key={person.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            flex: '0 0 140px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto 0.5rem',
                                border: '2px solid var(--card-bg)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                background: '#000'
                            }}>
                                <img
                                    src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x200?text=No+Image'}
                                    alt={person.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem', color: '#fff' }}>{person.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary-accent)', fontStyle: 'italic' }}>{person.character}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                div::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                div {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

export default CastList;
