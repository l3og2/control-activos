const Mantenimiento = require('../models/Mantenimiento');
const Activo = require('../models/Activo');

const wantsHtml = (req) => req.headers.accept && req.headers.accept.includes('text/html');

// CREATE
exports.crearMantenimiento = async (req, res) => {
  try {
    const nuevo = new Mantenimiento(req.body);
    await nuevo.save();

    // Cambiar el estado del activo a "Reparacion"
    await Activo.findByIdAndUpdate(req.body.activo_id, { estado: 'Reparacion' });

    if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?success=1&message=' + encodeURIComponent('Mantenimiento registrado'));
    res.status(201).json({ mensaje: '✅ Mantenimiento registrado', data: nuevo });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?error=1&message=' + encodeURIComponent(error.message));
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
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
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
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?error=1&message=' + encodeURIComponent('ID inválido'));
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const actualizado = await Mantenimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?error=1&message=' + encodeURIComponent('Mantenimiento no encontrado'));
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }
    if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?success=1&message=' + encodeURIComponent('Mantenimiento actualizado'));
    res.status(200).json({ mensaje: '🔄 Mantenimiento actualizado', data: actualizado });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al actualizar mantenimiento' });
  }
};

// DELETE
exports.eliminarMantenimiento = async (req, res) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?error=1&message=' + encodeURIComponent('ID inválido'));
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const eliminado = await Mantenimiento.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?error=1&message=' + encodeURIComponent('Mantenimiento no encontrado'));
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }
    if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?success=1&message=' + encodeURIComponent('Mantenimiento eliminado'));
    res.status(200).json({ mensaje: '🗑️ Mantenimiento eliminado' });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/mantenimientos/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al eliminar mantenimiento' });
  }
};

// VISTAS
exports.listarVista = async (req, res) => {
  const docs = await Mantenimiento.find().populate('activo_id', 'serial_unico marca_modelo');
  res.render('mantenimientos/list', {
    mantenimientos: docs,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioNuevo = async (req, res) => {
  const activos = await Activo.find();
  res.render('mantenimientos/form', {
    mantenimiento: {},
    activos,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioEditar = async (req, res) => {
  const doc = await Mantenimiento.findById(req.params.id);
  if (!doc) return res.redirect('/mantenimientos/vista');
  const activos = await Activo.find();
  res.render('mantenimientos/form', {
    mantenimiento: doc,
    activos,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};
