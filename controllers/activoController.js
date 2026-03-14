const Activo = require('../models/Activo');
const Categoria = require('../models/Categoria');

const wantsHtml = (req) => req.headers.accept && req.headers.accept.includes('text/html');

// 1. CREATE: Crear un nuevo activo (POST)
exports.crearActivo = async (req, res) => {
  try {
    const nuevoActivo = new Activo(req.body);
    await nuevoActivo.save();
    if (wantsHtml(req)) return res.redirect('/activos/vista?success=1&message=' + encodeURIComponent('Activo creado'));
    res.status(201).json({ mensaje: '✅ Activo creado con éxito', data: nuevoActivo });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al crear el activo', error: error.message });
  }
};

// 2. READ: Obtener todos los activos (GET)
exports.obtenerActivos = async (req, res) => {
  try {
    // Usamos .populate() para traernos los datos de la categoría, no solo su ID. ¡Truco de Senior!
    const activos = await Activo.find().populate('categoria_id', 'nombre descripcion');
    res.status(200).json(activos);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al obtener los activos' });
  }
};

// 🌟 CONSULTA SENCILLA: Filtrar activos por estado (GET)
exports.obtenerActivosPorEstado = async (req, res) => {
  try {
    const { estado } = req.params; // Capturamos el estado de la URL
    const activosFiltrados = await Activo.find({ estado: estado }).populate('categoria_id', 'nombre');
    res.status(200).json(activosFiltrados);
  } catch (error) {
    res.status(500).json({ mensaje: "Error real:", detalle: error.message });
  }
};

// Obtener un solo activo por su ID (GET)
exports.obtenerActivoPorId = async (req, res) => {
  try {
    // Usamos req.params.id para capturar el código que viene en la URL
    const activo = await Activo.findById(req.params.id).populate('categoria_id', 'nombre');
    
    // Si el ID no existe en la BD, avisamos
    if (!activo) {
      return res.status(404).json({ mensaje: '❌ Activo no encontrado' });
    }
    
    res.status(200).json(activo);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al buscar el activo', detalle: error.message });
  }
};

// 3. UPDATE: Actualizar un activo por ID (PUT)
exports.actualizarActivo = async (req, res) => {
  try {
    const activoActualizado = await Activo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activoActualizado) {
      if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent('Activo no encontrado'));
      return res.status(404).json({ mensaje: 'Activo no encontrado' });
    }
    if (wantsHtml(req)) return res.redirect('/activos/vista?success=1&message=' + encodeURIComponent('Activo actualizado'));
    res.status(200).json({ mensaje: '🔄 Activo actualizado', data: activoActualizado });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al actualizar' });
  }
};

// 4. DELETE: Borrar un activo (DELETE)
exports.eliminarActivo = async (req, res) => {
  try {
    const activoEliminado = await Activo.findByIdAndDelete(req.params.id);
    if (!activoEliminado) {
      if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent('Activo no encontrado'));
      return res.status(404).json({ mensaje: 'Activo no encontrado' });
    }
    if (wantsHtml(req)) return res.redirect('/activos/vista?success=1&message=' + encodeURIComponent('Activo eliminado'));
    res.status(200).json({ mensaje: '🗑️ Activo eliminado correctamente' });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al eliminar' });
  }
};

// --- vistas
exports.listarVista = async (req, res) => {
  const activos = await Activo.find().populate('categoria_id', 'nombre');
  res.render('activos/list', {
    activos,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioNuevo = async (req, res) => {
  const categorias = await Categoria.find();
  res.render('activos/form', {
    activo: {},
    categorias,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioEditar = async (req, res) => {
  const activo = await Activo.findById(req.params.id);
  const categorias = await Categoria.find();
  if (!activo) return res.redirect('/activos/vista');
  res.render('activos/form', {
    activo,
    categorias,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};