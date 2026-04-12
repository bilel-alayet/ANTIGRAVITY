const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/antigravity')
  .then(() => console.log('MongoDB Connected to Antigravity Database'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api', apiRoutes);
app.use('/api/news', require('./routes/news'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.get('/', (req, res) => {
  res.send('Antigravity API Server Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
