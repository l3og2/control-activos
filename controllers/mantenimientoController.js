const Mantenimiento = require('../models/Mantenimiento');

// CREATE
exports.crearMantenimiento = async (req, res) => {
  try {
    const nuevo = new Mantenimiento(req.body);
    await nuevo.save();
    res.status(201).json({ mensaje: '✅ Mantenimiento registrado', data: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al crear mantenimiento', error: error.message });
  }
};

// READ all
exports.obtenerMantenimientos = async (req, res) => {
  try {
    const docs = await Mantenimiento.find();
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al obtener mantenimientos' });
  }
};

// READ by id
exports.obtenerMantenimientoPorId = async (req, res) => {
  try {
    const doc = await Mantenimiento.findById(req.params.id);
    if (!doc) return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al buscar mantenimiento', detalle: error.message });
  }
};

// UPDATE
exports.actualizarMantenimiento = async (req, res) => {
  try {
    const actualizado = await Mantenimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    res.status(200).json({ mensaje: '🔄 Mantenimiento actualizado', data: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al actualizar mantenimiento' });
  }
};

// DELETE
exports.eliminarMantenimiento = async (req, res) => {
  try {
    const eliminado = await Mantenimiento.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    res.status(200).json({ mensaje: '🗑️ Mantenimiento eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al eliminar mantenimiento' });
  }
};
