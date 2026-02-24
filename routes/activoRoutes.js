const express = require('express');
const router = express.Router();
const activoController = require('../controllers/activoController');

// Definimos las rutas y las conectamos con su función del controlador
router.post('/', activoController.crearActivo);
router.get('/', activoController.obtenerActivos);

// Ruta para la consulta sencilla (Ejemplo de uso: /api/activos/estado/Disponible)
router.get('/estado/:estado', activoController.obtenerActivosPorEstado);

router.put('/:id', activoController.actualizarActivo);
router.delete('/:id', activoController.eliminarActivo);

module.exports = router;