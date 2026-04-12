import { Link } from 'react-router-dom';

const MediaSection = ({ title, items, linkTo, type = 'movie' }) => (
    <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{
                margin: 0,
                color: 'var(--accent)',
                borderLeft: '4px solid var(--secondary-accent)',
                paddingLeft: '1rem'
            }}>
                {title}
            </h2>
            {linkTo && (
                <Link to={linkTo} style={{ textDecoration: 'none' }}>
                    <button style={{
                        background: 'transparent',
                        border: '1px solid var(--secondary-accent)',
                        color: 'var(--secondary-accent)',
                        borderRadius: '20px',
                        padding: '5px 15px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--secondary-accent)';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--secondary-accent)';
                        }}
                    >
                        More &gt;
                    </button>
                </Link>
            )}
        </div>
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1.5rem'
        }}>
            {items.map(item => (
                <Link to={`/${type}/${item.id}`} key={item.id} style={{ display: 'block' }}>
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        height: '100%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
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
                            alt={item.title || item.name}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                        <div style={{ padding: '1rem' }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.title || item.name}
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--secondary-accent)' }}>
                                <span>{(item.release_date || item.first_air_date || '').split('-')[0] || 'N/A'}</span>
                                <span>★ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </section>
);

export default MediaSection;
