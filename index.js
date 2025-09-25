const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./src/routes/user.route');
const vehicleRoutes = require('./src/routes/vehicle.route');
const managersRoutes = require('./src/routes/managers/users.route')
const receiptRoutes = require('./src/routes/receipt.route');
const particularVehicleRoutes = require('./src/routes/parking/particularVehicle.route');

app.use('/api/managers', managersRoutes);

app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/receipts', receiptRoutes);

app.use('/api/parking/', particularVehicleRoutes);



const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
