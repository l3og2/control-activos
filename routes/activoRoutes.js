const express = require('express');
const router = express.Router();
const activoController = require('../controllers/activoController');

// Definimos las rutas y las conectamos con su función del controlador
router.post('/', activoController.crearActivo);
router.get('/', activoController.obtenerActivos);

// vistas UI (antes de parametrizadas)
router.get('/vista', activoController.listarVista);
router.get('/nuevo', activoController.formularioNuevo);
router.get('/carga', activoController.mostrarCargaMasiva);
router.post('/carga', activoController.uploadFile, activoController.procesarCargaMasiva);
router.get('/editar/:id', activoController.formularioEditar);

// Ruta para la consulta sencilla (Ejemplo de uso: /api/activos/estado/Disponible)
router.get('/estado/:estado', activoController.obtenerActivosPorEstado);

// El ":id" es un parámetro dinámico
router.get('/:id', activoController.obtenerActivoPorId);
router.put('/:id', activoController.actualizarActivo);
router.delete('/:id', activoController.eliminarActivo);

module.exports = router;