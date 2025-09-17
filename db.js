// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión establecida con MongoDB Atlas');
  } catch (err) {
    console.error('Error al conectar con MongoDB Atlas:', err);
    process.exit(1);
  }
};

module.exports = connectDB;