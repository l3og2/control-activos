const Asignacion = require('../models/Asignacion');
const Activo = require('../models/Activo');
const Empleado = require('../models/Empleado');
const Mantenimiento = require('../models/Mantenimiento');

const wantsHtml = (req) => req.headers.accept && req.headers.accept.includes('text/html');

// CREATE: nueva asignación
exports.crearAsignacion = async (req, res) => {
  try {
    // Verificar si el activo está en mantenimiento
    const mantenimientoExistente = await Mantenimiento.findOne({ activo_id: req.body.activo_id });
    if (mantenimientoExistente) {
      const errorMsg = 'El activo está en mantenimiento y no puede ser asignado';
      if (wantsHtml(req)) return res.redirect('/asignaciones/vista?error=1&message=' + encodeURIComponent(errorMsg));
      return res.status(400).json({ mensaje: '❌ ' + errorMsg });
    }

    const nueva = new Asignacion(req.body);
    await nueva.save();
    if (wantsHtml(req)) return res.redirect('/asignaciones/vista?success=1&message=' + encodeURIComponent('Asignación creada'));
    res.status(201).json({ mensaje: '✅ Asignación creada', data: nueva });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/asignaciones/vista?error=1&message=' + encodeURIComponent(error.message));
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
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
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
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      if (wantsHtml(req)) return res.redirect('/asignaciones/vista?error=1&message=' + encodeURIComponent('ID inválido'));
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const actualizado = await Asignacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      if (wantsHtml(req)) return res.redirect('/asignaciones/vista?error=1&message=' + encodeURIComponent('Asignación no encontrada'));
      return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    }
    if (wantsHtml(req)) return res.redirect('/asignaciones/vista?success=1&message=' + encodeURIComponent('Asignación actualizada'));
    res.status(200).json({ mensaje: '🔄 Asignación actualizada', data: actualizado });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/asignaciones/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al actualizar asignación' });
  }
};

// DELETE
exports.eliminarAsignacion = async (req, res) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      if (wantsHtml(req)) return res.redirect('/asignaciones/vista?error=1&message=' + encodeURIComponent('ID inválido'));
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const eliminado = await Asignacion.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      if (wantsHtml(req)) return res.redirect('/asignaciones/vista?error=1&message=' + encodeURIComponent('Asignación no encontrada'));
      return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    }
    if (wantsHtml(req)) return res.redirect('/asignaciones/vista?success=1&message=' + encodeURIComponent('Asignación eliminada'));
    res.status(200).json({ mensaje: '🗑️ Asignación eliminada' });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/asignaciones/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al eliminar asignación' });
  }
};

// VISTAS
exports.listarVista = async (req, res) => {
  const lista = await Asignacion.find()
    .populate('activo_id', 'serial_unico marca_modelo')
    .populate('empleado_id', 'nombre apellido');
  res.render('asignaciones/list', {
    asignaciones: lista,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioNuevo = async (req, res) => {
  const activos = await Activo.find();
  const empleados = await Empleado.find();
  res.render('asignaciones/form', {
    asignacion: {},
    activos,
    empleados,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioEditar = async (req, res) => {
  const asign = await Asignacion.findById(req.params.id);
  if (!asign) return res.redirect('/asignaciones/vista');
  const activos = await Activo.find();
  const empleados = await Empleado.find();
  res.render('asignaciones/form', {
    asignacion: asign,
    activos,
    empleados,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};
