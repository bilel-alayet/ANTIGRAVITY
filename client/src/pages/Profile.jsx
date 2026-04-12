import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import MovieCard from '../components/MovieCard';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', profilePicture: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userData = await api.getMe();
                setUser(userData);
                setFormData({ username: userData.username, profilePicture: userData.profilePicture || '' });
                const favs = await api.getFavorites();
                setFavorites(favs);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchProfileData();
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await api.updateProfile(formData);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Failed to update profile.');
        }
    };

    const removeFavorite = async (id) => {
        try {
            await api.removeFavorite(id);
            setFavorites(favorites.filter(fav => fav.tmdbId !== id));
        } catch (err) {
            console.error("Failed to remove favorite", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    if (!user) return <div style={{ color: 'white', padding: '2rem' }}>Loading profile...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff', width: '100%' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', background: '#1a1a2e', padding: '2rem', borderRadius: '15px', marginBottom: '2rem', border: '1px solid #333' }}>
                <img 
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                    alt="Profile" 
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-accent)' }}
                />
                <div style={{ flex: 1 }}>
                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                            <input 
                                type="text" name="username" value={formData.username} onChange={handleChange}
                                placeholder="Username" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }}
                            />
                            <input 
                                type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange}
                                placeholder="Profile Picture URL" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" style={{ padding: '0.8rem 1.5rem', background: 'var(--primary-accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.8rem 1.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: 'var(--primary-accent)' }}>{user.username}</h1>
                            <p style={{ color: '#aaa', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>{user.email}</p>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button onClick={() => setIsEditing(true)} style={{ padding: '0.6rem 1.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Edit Profile</button>
                                <button onClick={handleLogout} style={{ padding: '0.6rem 1.5rem', background: 'rgba(255,71,87,0.15)', color: '#ff4757', border: '1px solid #ff4757', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-accent)', display: 'inline-block', paddingBottom: '0.5rem' }}>My Favorites</h2>
            {favorites.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '1.1rem', background: '#1a1a2e', padding: '2rem', borderRadius: '15px' }}>You haven't favored any movies yet! Go back to the homepage to add some.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {favorites.map(movie => (
                        <div key={movie.tmdbId} style={{ position: 'relative' }}>
                            <MovieCard movie={{ id: movie.tmdbId, title: movie.title, poster_path: movie.posterPath, release_date: movie.releaseDate, vote_average: movie.voteAverage }} />
                            <button 
                                onClick={() => removeFavorite(movie.tmdbId)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
                                title="Remove from Favorites"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
