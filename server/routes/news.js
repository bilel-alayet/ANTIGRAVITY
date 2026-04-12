const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock data for fallback
const mockNews = [
    {
        title: "Dune: Part Two Dominates Box Office",
        description: "The sci-fi epic continues to break records worldwide as fans flock to theaters.",
        urlToImage: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        url: "#",
        source: { name: "Mock News" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "New Star Wars Series Announced",
        description: "Disney+ reveals plans for another addition to the Star Wars universe.",
        urlToImage: "https://image.tmdb.org/t/p/w500/oBIQDKcqNxKckjugtmzpIIOgoc4.jpg",
        url: "#",
        source: { name: "Mock News" },
        publishedAt: new Date().toISOString()
    },
    {
        title: "Oscar Contenders 2024",
        description: "A look at the top films vying for the Academy Awards this year.",
        urlToImage: "https://image.tmdb.org/t/p/w500/9gbbzDe42Atbb1oO0XqYUbY0gW2.jpg",
        url: "#",
        source: { name: "Mock News" },
        publishedAt: new Date().toISOString()
    }
];

router.get('/', async (req, res) => {
    try {
        const query = req.query.query || 'movies';
        const apiKey = process.env.NEWS_API_KEY;

        if (!apiKey) {
            console.warn('NEWS_API_KEY not found in .env, using mock data');
            return res.json({ articles: mockNews });
        }

        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: query,
                apiKey: apiKey,
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 20
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        // Fallback to mock data on error
        res.json({ articles: mockNews });
    }
});

module.exports = router;
