const mongoose = require('mongoose');

const ActivoSchema = new mongoose.Schema({
  serial_unico: { type: String, required: true, unique: true },
  marca_modelo: { type: String, required: true },
  categoria_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  estado: { type: String, enum: ['Disponible', 'Asignado', 'Reparacion'], default: 'Disponible' }
});

module.exports = mongoose.model('Activo', ActivoSchema);