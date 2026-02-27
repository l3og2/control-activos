const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimientoController');

router.post('/', mantenimientoController.crearMantenimiento);
router.get('/', mantenimientoController.obtenerMantenimientos);
router.get('/:id', mantenimientoController.obtenerMantenimientoPorId);
router.put('/:id', mantenimientoController.actualizarMantenimiento);
router.delete('/:id', mantenimientoController.eliminarMantenimiento);

module.exports = router;
