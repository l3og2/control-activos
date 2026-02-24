const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    codigo_area: { type: String, required: true, unique: true },
    nivel_prioridad: { type: Number, required: true }
});

module.exports = mongoose.model('Categoria', CategoriaSchema);