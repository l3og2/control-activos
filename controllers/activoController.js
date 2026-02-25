const Activo = require('../models/Activo');
const Categoria = require('../models/Categoria');

// 1. CREATE: Crear un nuevo activo (POST)
exports.crearActivo = async (req, res) => {
  try {
    const nuevoActivo = new Activo(req.body);
    await nuevoActivo.save();
    res.status(201).json({ mensaje: '✅ Activo creado con éxito', data: nuevoActivo });
  } catch (error) {
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
    if (!activoActualizado) return res.status(404).json({ mensaje: 'Activo no encontrado' });
    res.status(200).json({ mensaje: '🔄 Activo actualizado', data: activoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al actualizar' });
  }
};

// 4. DELETE: Borrar un activo (DELETE)
exports.eliminarActivo = async (req, res) => {
  try {
    const activoEliminado = await Activo.findByIdAndDelete(req.params.id);
    if (!activoEliminado) return res.status(404).json({ mensaje: 'Activo no encontrado' });
    res.status(200).json({ mensaje: '🗑️ Activo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al eliminar' });
  }
};