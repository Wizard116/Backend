require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');
const { authenticateUser, authenticateToken } = require('./middlewares/authMiddleware');

const app = express();

const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
// app.use(authenticateUser)
// app.use(authenticateToken)

// Routes
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)


// Error handler middleware
// app.use(errorHandler.handleError);

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})
//
// {
//     "username": "mor_2314",
//     "email": "exampleuser@gmail.com",
//     "password": "83r5^_"
// }