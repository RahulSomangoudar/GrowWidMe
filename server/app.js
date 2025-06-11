const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Register the routes
app.use('/api/auth', require('./routes/authRoutes'));  // This line is crucial

// Other routes
app.use('/api/posts', require('./routes/postRoutes'));

app.get('/', (req, res) => {
  res.send('Blog API is running');
});

module.exports = app;
