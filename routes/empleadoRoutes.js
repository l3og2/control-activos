const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

// API endpoints
router.post('/', empleadoController.crearEmpleado);
router.get('/', empleadoController.obtenerEmpleados);

// View routes (deben ir antes de las parametrizadas para evitar conflictos)
router.get('/vista', empleadoController.listarVista);
router.get('/nuevo', empleadoController.formularioNuevo);
router.get('/editar/:id', empleadoController.formularioEditar);

// Rutas parametrizadas
router.get('/:id', empleadoController.obtenerEmpleadoPorId);
router.put('/:id', empleadoController.actualizarEmpleado);
router.delete('/:id', empleadoController.eliminarEmpleado);

module.exports = router;