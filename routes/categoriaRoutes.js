const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// API
router.post('/', categoriaController.crearCategoria);
router.get('/', categoriaController.obtenerCategorias);

// Views (antes de parametrizadas)
router.get('/vista', categoriaController.listarVista);
router.get('/nuevo', categoriaController.formularioNuevo);
router.get('/editar/:id', categoriaController.formularioEditar);

// Parametrizadas
router.get('/:id', categoriaController.obtenerCategoriaPorId);
router.put('/:id', categoriaController.actualizarCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;