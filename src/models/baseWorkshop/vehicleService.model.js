const mongoose = require('mongoose');

const vehicleServiceSchema = new mongoose.Schema({
  folio: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  plate: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  series: {
    type: String,
    required: true,
    trim: true,
  },
  subBrand: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  km: {
    type: String,
    required: true,
    trim: true,
  },
  fuelLevel: {
    type: String,
    enum: ['1/4', '1/2', '3/4', '4/4'],
    required: true,
  },
  registeredBy: {
    type: String,
    required: true,
    trim: true,
  },
  accumulatorCode: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  observations: {
    type: String,
    default: '',
    trim: true,
  },
  entryReason: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
    default: 'Pendiente',
    enum: ['Pendiente', 'En revisión', 'Aceptado', 'Rechazado']
  },
  acceptanceDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('VehicleService', vehicleServiceSchema);