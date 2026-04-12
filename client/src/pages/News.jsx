import { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('movies');

    const fetchNews = async (query) => {
        setLoading(true);
        setError(null);
        try {
            // Use the backend running on port 5000
            const response = await axios.get(`http://localhost:5000/api/news?query=${query}`);
            setArticles(response.data.articles || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch news. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(category);
    }, [category]);

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
    };

    const categories = [
        { id: 'movies', label: 'Movies' },
        { id: 'tv shows', label: 'TV Shows' },
        { id: 'hollywood', label: 'Celebs' }, // Maps to "Celebs" in UI but queries "hollywood"
        { id: 'entertainment', label: 'Latest' } // Mixed/Latest
    ];

    return (
        <div className="container fade-in" style={{ padding: '2rem 20px', paddingBottom: '3rem' }}>
            <h1 className="text-gradient" style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '2.5rem', fontWeight: '700' }}>
                ENTERTAINMENT NEWS & BUZZ
            </h1>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`btn ${category === cat.id ? '' : 'btn-secondary'}`}
                        style={{ minWidth: '120px' }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading && (
                <div style={{ textAlign: 'center', color: '#fff', marginTop: '3rem', fontSize: '1.2rem' }}>
                    Loading transmissions...
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '2rem' }}>
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {articles.map((article, index) => (
                        <div key={index} className="news-card">
                            {article.urlToImage ? (
                                <img
                                    src={article.urlToImage}
                                    alt={article.title}
                                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '220px',
                                    backgroundColor: '#26334d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)'
                                }}>
                                    No Image
                                </div>
                            )}
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 'calc(100% - 220px)' }}>
                                <div className="news-card-title">
                                    {article.title}
                                </div>
                                <div className="news-card-meta">
                                    {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
                                </div>
                                <p style={{
                                    color: '#dbe1f1',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    marginBottom: '1.5rem',
                                    flex: 1
                                }}>
                                    {article.description || 'No description available for this story.'}
                                </p>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ textAlign: 'center', display: 'block', textDecoration: 'none', borderRadius: '8px' }}
                                >
                                    Read Full Story
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && articles.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                    No news found for this category.
                </div>
            )}
        </div>
    );
};

export default News;
