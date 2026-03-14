const Categoria = require('../models/Categoria');

const wantsHtml = (req) => req.headers.accept && req.headers.accept.includes('text/html');

// API
exports.crearCategoria = async (req, res) => {
  try {
    const nueva = new Categoria(req.body);
    await nueva.save();
    if (wantsHtml(req)) {
      return res.redirect('/categorias/vista?success=1&message=' + encodeURIComponent('Categoría creada'));
    }
    res.status(201).json({ mensaje: '✅ Categoría creada', data: nueva });
  } catch (error) {
    if (wantsHtml(req)) {
      return res.redirect('/categorias/vista?error=1&message=' + encodeURIComponent(error.message));
    }
    res.status(500).json({ mensaje: '❌ Error al crear categoría', error: error.message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  try {
    const lista = await Categoria.find();
    res.status(200).json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al obtener categorías' });
  }
};

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const cat = await Categoria.findById(req.params.id);
    if (!cat) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.status(200).json(cat);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al buscar categoría', detalle: error.message });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const actualizado = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      if (wantsHtml(req)) return res.redirect('/categorias/vista?error=1&message=' + encodeURIComponent('Categoría no encontrada'));
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    if (wantsHtml(req)) return res.redirect('/categorias/vista?success=1&message=' + encodeURIComponent('Categoría actualizada'));
    res.status(200).json({ mensaje: '🔄 Categoría actualizada', data: actualizado });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/categorias/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al actualizar categoría' });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const eliminado = await Categoria.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      if (wantsHtml(req)) return res.redirect('/categorias/vista?error=1&message=' + encodeURIComponent('Categoría no encontrada'));
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    if (wantsHtml(req)) return res.redirect('/categorias/vista?success=1&message=' + encodeURIComponent('Categoría eliminada'));
    res.status(200).json({ mensaje: '🗑️ Categoría eliminada' });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/categorias/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al eliminar categoría' });
  }
};

// Views
exports.listarVista = async (req, res) => {
  const lista = await Categoria.find();
  res.render('categorias/list', {
    categorias: lista,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioNuevo = (req, res) => {
  res.render('categorias/form', {
    categoria: {},
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioEditar = async (req, res) => {
  const cat = await Categoria.findById(req.params.id);
  if (!cat) return res.redirect('/categorias');
  res.render('categorias/form', {
    categoria: cat,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};