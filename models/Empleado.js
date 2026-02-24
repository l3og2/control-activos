const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'] 
  },
  apellido: { 
    type: String, 
    required: [true, 'El apellido es obligatorio'] 
  },
  cedula: { 
    type: String, 
    required: [true, 'La cédula es obligatoria'], 
    unique: true, // ¡Clave! No pueden haber dos empleados con la misma cédula
    trim: true    // Limpia espacios en blanco accidentales
  },
  cargo: { 
    type: String, 
    required: [true, 'Debes especificar el cargo del empleado'] 
  }
}, {
  timestamps: true // Tip de Senior: Esto agrega automáticamente 'createdAt' y 'updatedAt'
});

module.exports = mongoose.model('Empleado', empleadoSchema);