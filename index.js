// Importamos las librerías necesarias
const express = require('express');
const session = require('express-session');
const conectarDB = require('./db'); // Nuestro archivo de conexión
const { requireLogin } = require('./middlewares/auth');
require('dotenv').config();

// Inicializamos la aplicación de Express
const app = express();

// 1. Conectamos a la Base de Datos en MongoDB
conectarDB();

// 2. Middlewares
// Esto es VITAL: permite que nuestro servidor entienda los datos JSON que le enviaremos en los POST/PUT
app.use(express.json());
// formularios HTML normales también necesitan este middleware
app.use(express.urlencoded({ extended: true }));

// Permitir métodos PUT/DELETE desde formularios HTML usando ?_method=...
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Sesiones para mantener al usuario autenticado (sin registro público)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'cambiame',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 horas
  })
);

// Hacer disponible el usuario en las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// 3. Rutas (Routes)
// Servimos vistas estáticas y configuramos el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// página de inicio tanto API como UI
app.get('/', (req, res) => {
  res.render('index');
});

// Login y logout (no hay registro público)
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { error: req.query.error });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const validUser = process.env.AUTH_USER || 'admin';
  const validPass = process.env.AUTH_PASS || 'admin123';

  if (username === validUser && password === validPass) {
    req.session.user = { username };
    return res.redirect('/');
  }

  return res.redirect('/login?error=1');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Requerir inicio de sesión para el resto de rutas
app.use(requireLogin);

// API endpoints
app.use('/api/activos', require('./routes/activoRoutes'));
app.use('/api/asignaciones', require('./routes/asignacionRoutes'));
app.use('/api/mantenimientos', require('./routes/mantenimientoRoutes'));
app.use('/api/empleados', require('./routes/empleadoRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));

// Rutas de interfaz (UI) también pueden montarse con prefijos sencillos
app.use('/activos', require('./routes/activoRoutes'));
app.use('/asignaciones', require('./routes/asignacionRoutes'));
app.use('/mantenimientos', require('./routes/mantenimientoRoutes'));
app.use('/empleados', require('./routes/empleadoRoutes'));
app.use('/categorias', require('./routes/categoriaRoutes'));

// 4. Configuración del Puerto y Encendido del Servidor
const PORT = process.env.PORT || 3000; // Toma el puerto del .env o usa el 3000 por defecto

app.listen(PORT, () => {
  console.log(`🔥 Servidor encendido y escuchando en http://localhost:${PORT}`);
});