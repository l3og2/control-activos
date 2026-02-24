const mongoose = require('mongoose');

const AsignacionSchema = new mongoose.Schema({
    fecha_entrega: { type: String, required: true, unique: true },
    activo_id: { type: String, required: true },
    empleado_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
    observaciones: { type: String, required: true }
});

module.exports = mongoose.model('Asignacion', AsignacionSchema);