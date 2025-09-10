const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./src/routes/user.route');
const vehicleRoutes = require('./src/routes/vehicle.route');
const managersRoutes = require('./src/routes/managers/users.route')

app.use('/managers', managersRoutes);

app.use('/users', userRoutes);
app.use('/vehicles', vehicleRoutes);



const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
