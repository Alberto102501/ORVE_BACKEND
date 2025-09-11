const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const userRoutes = require('./src/routes/user.route');
const vehicleRoutes = require('./src/routes/vehicle.route');
const managersRoutes = require('./src/routes/managers/users.route')

app.use('/managers', managersRoutes);

app.use('/users', userRoutes);
app.use('/vehicles', vehicleRoutes);



const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
