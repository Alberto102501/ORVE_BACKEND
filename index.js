const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

app.use(express.json());

const userRoutes = require('./src/routes/user.route');
const vehicleRoutes = require('./src/routes/vehicle.route');

app.use('/users', userRoutes);
app.use('/vehicles', vehicleRoutes);


const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});