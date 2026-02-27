const Asignacion = require('../models/Asignacion');

// CREATE: nueva asignación
exports.crearAsignacion = async (req, res) => {
  try {
    const nueva = new Asignacion(req.body);
    await nueva.save();
    res.status(201).json({ mensaje: '✅ Asignación creada', data: nueva });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al crear asignación', error: error.message });
  }
};

// READ: todas las asignaciones
exports.obtenerAsignaciones = async (req, res) => {
  try {
    const asigns = await Asignacion.find();
    res.status(200).json(asigns);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al obtener asignaciones' });
  }
};

// obtener una por id
exports.obtenerAsignacionPorId = async (req, res) => {
  try {
    const asign = await Asignacion.findById(req.params.id);
    if (!asign) return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    res.status(200).json(asign);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al buscar asignación', detalle: error.message });
  }
};

// UPDATE
exports.actualizarAsignacion = async (req, res) => {
  try {
    const actualizado = await Asignacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    res.status(200).json({ mensaje: '🔄 Asignación actualizada', data: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al actualizar asignación' });
  }
};

// DELETE
exports.eliminarAsignacion = async (req, res) => {
  try {
    const eliminado = await Asignacion.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    res.status(200).json({ mensaje: '🗑️ Asignación eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al eliminar asignación' });
  }
};
