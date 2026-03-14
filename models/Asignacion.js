const mongoose = require('mongoose');

const AsignacionSchema = new mongoose.Schema({
    // guardamos la fecha de entrega (con tipo Date para facilitar cálculos)
    fecha_entrega: { type: Date, required: true },
    // relaciones correctamente referenciadas como ObjectId
    activo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Activo', required: true },
    empleado_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', required: true },
    observaciones: { type: String, required: true }
});

module.exports = mongoose.model('Asignacion', AsignacionSchema);