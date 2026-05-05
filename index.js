const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Connect Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});