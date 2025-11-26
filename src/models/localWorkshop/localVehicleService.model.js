const mongoose = require('mongoose');

const localVehicleServiceSchema = new mongoose.Schema({
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
    index: true, 
  },
  user: {
    type: String,
    required: true,
    trim: true,
  },
  assignment: {
    type: String,
    trim: true
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
  cylinders: {
    type: String,
    trim: true
  },
  transmission: {
    type: String,
    trim: true
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
    enum: ['Pendiente', 'En reparación', 'Aceptado', 'Rechazado'],
  },
  acceptanceDate: {
    type: Date,
    default: null
  },
  exit: [
    {
      stations: [
        {
          tuningStation: {
            type: Boolean
          },
          suspensionStation: {
            type: Boolean
          },
          sheetMetalStation: {
            type: Boolean
          },
          enginesStation: {
            type: Boolean
          },
          electricalStation: {
            type: Boolean
          }
        }
      ],
      servicesPerformed: [
        {
          registeredByUser: {
            type: String
          }
        }
      ],
      installedProducts: [
        {
          assignedQuantity: {
            type: Number,
            required: true
          },
          orderNumber: {
            type: String,
            trim: true,
          },
          process: {
            type: String,
            trim: true,
          },
          plate: {
            type: String,
            trim: true,
          },
          category: {
            type: String,
            trim: true,
          },
          description: {
            type: String,
            required: true,
            trim: true
          },
          um: {
            type: String,
            required: true,
            trim: true
          },
          partBrand: {
            type: String,
            trim: true,
          },
        }
      ],
      registeredExitBy: {
        type: String,
      },
      annotations: {
        type: String
      }

    }
  ]
}, {
  timestamps: true 
});

module.exports = mongoose.model('localVehicleService', localVehicleServiceSchema, 'localVehicleService');