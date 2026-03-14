const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimientoController');

router.post('/', mantenimientoController.crearMantenimiento);
router.get('/', mantenimientoController.obtenerMantenimientos);

// vistas (antes de parametrizadas)
router.get('/vista', mantenimientoController.listarVista);
router.get('/nuevo', mantenimientoController.formularioNuevo);
router.get('/editar/:id', mantenimientoController.formularioEditar);

// parametrizadas
router.get('/:id', mantenimientoController.obtenerMantenimientoPorId);
router.put('/:id', mantenimientoController.actualizarMantenimiento);
router.delete('/:id', mantenimientoController.eliminarMantenimiento);

module.exports = router;
