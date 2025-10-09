// models/Transaction.js
const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
  productType: { type: String },
  account: { type: String },
  cardOrTag: { type: String },
  licensePlate: { type: String },
  date: { type: String },//Se cambio de date a string
  transactionId: { type: Number },//Se cambio de string a number
  debit: { type: Number },
  credit: { type: Number },
  balance: { type: Number },
  transactionType: { type: String },
  user: { type: String },
  caseFile: { type: String },
  concept: { type: String },
  product: { type: String },
  price: { type: Number },
  kmStart: { type: Number },
  kmEnd: { type: Number },
  liters: { type: Number },
  efficiency: { type: Number },
  iva: { type: String },// Se cambio de number a string
  station: { type: String },
  stationRFC: { type: String },
  state: { type: String },
  city: { type: String },
  neighborhood: { type: String },
  address: { type: String },
  year: { type: Number },
  month: { type: Number },
  day: { type: Number },
  hour: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('load', loadSchema);