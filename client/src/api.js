import axios from 'axios';
// NOTE: in production, API keys should be handled more securely (e.g. proxying via backend).
// For MVP/Demo, using import.meta.env or process.env is acceptable but exposed to client.
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const BACKEND_URL = 'http://localhost:5000/api';

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        Accept: 'application/json'
    },
    params: {
        language: 'en-US'
    }
});

const backendClient = axios.create({
    baseURL: BACKEND_URL
});

// Attach JWT token to all backend requests automatically
backendClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    // TMDB
    getPopularMovies: async (page = 1) => {
        const response = await tmdbClient.get('/movie/popular', { params: { page } });
        return response.data;
    },
    getTopRatedMovies: async (page = 1) => {
        const response = await tmdbClient.get('/movie/top_rated', { params: { page } });
        return response.data;
    },
    getUpcomingMovies: async (page = 1) => {
        const response = await tmdbClient.get('/movie/upcoming', { params: { page } });
        return response.data;
    },
    getNowPlayingMovies: async (page = 1) => {
        const response = await tmdbClient.get('/movie/now_playing', { params: { page } });
        return response.data;
    },
    getPopularPeople: async (page = 1) => {
        const response = await tmdbClient.get('/person/popular', { params: { page } });
        return response.data;
    },
    getMovie: async (id) => {
        const response = await tmdbClient.get(`/movie/${id}`);
        return response.data;
    },
    getMovieVideos: async (id) => {
        const response = await tmdbClient.get(`/movie/${id}/videos`);
        return response.data;
    },
    getMovieCredits: async (id) => {
        const response = await tmdbClient.get(`/movie/${id}/credits`);
        return response.data;
    },
    getMovieRecommendations: async (id) => {
        const response = await tmdbClient.get(`/movie/${id}/recommendations`);
        return response.data;
    },
    getGenres: async () => {
        const response = await tmdbClient.get('/genre/movie/list');
        return response.data;
    },
    getMoviesByGenre: async (genreId, page = 1) => {
        const response = await tmdbClient.get('/discover/movie', {
            params: {
                with_genres: genreId,
                page: page
            }
        });
        return response.data;
    },
    searchMovies: async (query) => {
        const response = await tmdbClient.get('/search/movie', { params: { query } });
        return response.data;
    },

    // TV Endpoints
    getPopularTV: async (page = 1) => {
        const response = await tmdbClient.get('/tv/popular', { params: { page } });
        return response.data;
    },
    getTopRatedTV: async (page = 1) => {
        const response = await tmdbClient.get('/tv/top_rated', { params: { page } });
        return response.data;
    },
    getOnTheAirTV: async (page = 1) => {
        const response = await tmdbClient.get('/tv/on_the_air', { params: { page } });
        return response.data;
    },
    getAiringTodayTV: async (page = 1) => {
        const response = await tmdbClient.get('/tv/airing_today', { params: { page } });
        return response.data;
    },
    getTVDetails: async (id) => {
        const response = await tmdbClient.get(`/tv/${id}`);
        return response.data;
    },
    getTVVideos: async (id) => {
        const response = await tmdbClient.get(`/tv/${id}/videos`);
        return response.data;
    },
    getTVCredits: async (id) => {
        const response = await tmdbClient.get(`/tv/${id}/credits`);
        return response.data;
    },
    getTVGenres: async () => {
        const response = await tmdbClient.get('/genre/tv/list');
        return response.data;
    },
    getTVByGenre: async (genreId, page = 1) => {
        const response = await tmdbClient.get('/discover/tv', {
            params: {
                with_genres: genreId,
                page: page
            }
        });
        return response.data;
    },
    searchTV: async (query) => {
        const response = await tmdbClient.get('/search/tv', { params: { query } });
        return response.data;
    },

    getPerson: async (id) => {
        const response = await tmdbClient.get(`/person/${id}`);
        return response.data;
    },
    getPersonMovieCredits: async (id) => {
        const response = await tmdbClient.get(`/person/${id}/movie_credits`);
        return response.data;
    },

    // User Profile
    getMe: async () => {
        const response = await backendClient.get('/auth/me');
        return response.data;
    },
    updateProfile: async (profileData) => {
        const response = await backendClient.put('/auth/profile', profileData);
        return response.data;
    },

    // Backend (Favorites)
    getFavorites: async () => {
        const response = await backendClient.get('/favorites');
        return response.data;
    },
    addFavorite: async (movieData) => {
        const response = await backendClient.post('/favorites', movieData);
        return response.data;
    },
    removeFavorite: async (tmdbId) => {
        const response = await backendClient.delete(`/favorites/${tmdbId}`);
        return response.data;
    },
    updateReview: async (tmdbId, review) => {
        const response = await backendClient.put(`/favorites/${tmdbId}`, { userReview: review });
        return response.data;
    }
};
