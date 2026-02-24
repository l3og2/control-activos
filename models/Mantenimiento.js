const mongoose = require('mongoose');

const mantenimientoSchema = new mongoose.Schema({
    // Relación: Vinculamos este mantenimiento con un Activo específico
    activo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activo', // Debe coincidir exactamente con el nombre del modelo exportado
        required: [true, 'Debes indicar a qué activo se le hizo mantenimiento']
    },
    tecnico_encargado: {
        type: String,
        required: [true, 'El nombre del técnico es obligatorio']
    },
    fecha_servicio: {
        type: Date,
        default: Date.now // Si no le pasamos fecha, asume que fue hoy
    },
    costo: {
        type: Number, // Usamos Number para poder sumar o sacar reportes de gastos luego
        required: [true, 'Debes ingresar el costo del servicio'],
        min: [0, 'El costo no puede ser negativo'] // Validación extra de seguridad
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mantenimiento', mantenimientoSchema);