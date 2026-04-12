import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { username, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError(null);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container fade-in" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div style={{
                background: 'rgba(22, 33, 62, 0.6)',
                backdropFilter: 'blur(10px)',
                padding: '3rem',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '450px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    color: '#fff',
                    fontSize: '2rem'
                }}>
                    Join Antigravity
                </h1>

                {error && (
                    <div style={{
                        background: 'rgba(233, 69, 96, 0.2)',
                        color: '#ff6b6b',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                            style={{
                                width: '100%',
                                background: '#ffffff',
                                color: '#1a1a2e',
                                border: '2px solid #ddd',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            style={{
                                width: '100%',
                                background: '#ffffff',
                                color: '#1a1a2e',
                                border: '2px solid #ddd',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            style={{
                                width: '100%',
                                background: '#ffffff',
                                color: '#1a1a2e',
                                border: '2px solid #ddd',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%', padding: '12px' }}>
                        Create Account
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-accent)', fontWeight: '600' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
