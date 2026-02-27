const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionController');

router.post('/', asignacionController.crearAsignacion);
router.get('/', asignacionController.obtenerAsignaciones);
router.get('/:id', asignacionController.obtenerAsignacionPorId);
router.put('/:id', asignacionController.actualizarAsignacion);
router.delete('/:id', asignacionController.eliminarAsignacion);

module.exports = router;
