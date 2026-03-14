const Empleado = require('../models/Empleado');

const wantsHtml = (req) => req.headers.accept && req.headers.accept.includes('text/html');

// API CRUD
exports.crearEmpleado = async (req, res) => {
  try {
    const nuevo = new Empleado(req.body);
    await nuevo.save();

    if (wantsHtml(req)) {
      return res.redirect('/empleados/vista?success=1&message=' + encodeURIComponent('Empleado creado')); 
    }

    res.status(201).json({ mensaje: '✅ Empleado creado', data: nuevo });
  } catch (error) {
    if (wantsHtml(req)) {
      return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent(error.message));
    }
    res.status(500).json({ mensaje: '❌ Error al crear empleado', error: error.message });
  }
};

exports.obtenerEmpleados = async (req, res) => {
  try {
    const lista = await Empleado.find();
    res.status(200).json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al obtener empleados' });
  }
};

exports.obtenerEmpleadoPorId = async (req, res) => {
  try {
    const emp = await Empleado.findById(req.params.id);
    if (!emp) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.status(200).json(emp);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al buscar empleado', detalle: error.message });
  }
};

exports.actualizarEmpleado = async (req, res) => {
  try {
    const actualizado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent('Empleado no encontrado'));
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    if (wantsHtml(req)) return res.redirect('/empleados/vista?success=1&message=' + encodeURIComponent('Empleado actualizado'));
    res.status(200).json({ mensaje: '🔄 Empleado actualizado', data: actualizado });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al actualizar empleado' });
  }
};

exports.eliminarEmpleado = async (req, res) => {
  try {
    const eliminado = await Empleado.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent('Empleado no encontrado'));
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    if (wantsHtml(req)) return res.redirect('/empleados/vista?success=1&message=' + encodeURIComponent('Empleado eliminado'));
    res.status(200).json({ mensaje: '🗑️ Empleado eliminado' });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al eliminar empleado' });
  }
};

// ----
// View rendering helpers (EJS)
exports.listarVista = async (req, res) => {
  const lista = await Empleado.find();
  res.render('empleados/list', {
    empleados: lista,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioNuevo = (req, res) => {
  res.render('empleados/form', {
    empleado: {},
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioEditar = async (req, res) => {
  const emp = await Empleado.findById(req.params.id);
  if (!emp) return res.redirect('/empleados');
  res.render('empleados/form', {
    empleado: emp,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};