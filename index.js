// Importamos las librerías necesarias
const express = require('express');
const conectarDB = require('./db'); // Nuestro archivo de conexión
require('dotenv').config();

// Inicializamos la aplicación de Express
const app = express();

// 1. Conectamos a la Base de Datos en MongoDB
conectarDB();

// 2. Middlewares
// Esto es VITAL: permite que nuestro servidor entienda los datos JSON que le enviaremos en los POST/PUT
app.use(express.json());

// 3. Rutas (Routes)
// Esta es una ruta de prueba para saber que el servidor está respondiendo
app.get('/', (req, res) => {
  res.send('🚀 ¡La API de Control de Activos está viva y corriendo!');
});

// Aquí abajo luego conectaremos las rutas de nuestros Activos, Empleados, etc.
// Ejemplo futuro: app.use('/api/activos', require('./routes/activos'));
app.use('/api/activos', require('./routes/activoRoutes'));

// rutas adicionales para asignaciones y mantenimientos
app.use('/api/asignaciones', require('./routes/asignacionRoutes'));
app.use('/api/mantenimientos', require('./routes/mantenimientoRoutes'));

// 4. Configuración del Puerto y Encendido del Servidor
const PORT = process.env.PORT || 3000; // Toma el puerto del .env o usa el 3000 por defecto

app.listen(PORT, () => {
  console.log(`🔥 Servidor encendido y escuchando en http://localhost:${PORT}`);
});