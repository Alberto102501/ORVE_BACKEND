const express = require('express');
const userRoutes = require('./src/routes/user.route');
const connectDB = require('./db');

const app = express();

app.use(express.json());

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});