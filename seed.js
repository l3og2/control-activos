const conectarDB = require('./db');
const Empleado = require('./models/Empleado');
const Categoria = require('./models/Categoria');
const Activo = require('./models/Activo');
const Asignacion = require('./models/Asignacion');
const Mantenimiento = require('./models/Mantenimiento');

const seedData = async () => {
  await conectarDB();

  // 1. Limpiar base de datos
  await Empleado.deleteMany({});
  await Categoria.deleteMany({});
  await Activo.deleteMany({});
  // ... limpiar las otras 2

  // 2. Insertar Categorías (4 docs)
  const cats = await Categoria.insertMany([
    { nombre: 'Laptops', descripcion: 'Equipos portátiles', codigo_area: 'IT-01', nivel_prioridad: 1 },
    { nombre: 'Monitores', descripcion: 'Pantallas LED', codigo_area: 'IT-02', nivel_prioridad: 2 },
    { nombre: 'Periféricos', descripcion: 'Teclados y mouse', codigo_area: 'IT-03', nivel_prioridad: 3 },
    { nombre: 'Redes', descripcion: 'Routers y Switches', codigo_area: 'IT-04', nivel_prioridad: 1 }
  ]);

  // 3. Insertar Empleados (4 docs)
  const emps = await Empleado.insertMany([
    { nombre: 'Juan', apellido: 'Pérez', cedula: 'V-12345', cargo: 'Analista' },
    { nombre: 'María', apellido: 'García', cedula: 'V-67890', cargo: 'Gerente' },
    { nombre: 'Luis', apellido: 'Rodríguez', cedula: 'V-11223', cargo: 'Desarrollador' },
    { nombre: 'Ana', apellido: 'Martínez', cedula: 'V-44556', cargo: 'Soporte' }
  ]);

  // 4. Insertar Activos usando el ID de la categoría (4 docs)
  const activos = await Activo.insertMany([
    { serial_unico: 'LAP-001', marca_modelo: 'Dell Latitude', categoria_id: cats[0]._id, estado: 'Asignado' },
    { serial_unico: 'MON-001', marca_modelo: 'HP 24"', categoria_id: cats[1]._id, estado: 'Disponible' },
    { serial_unico: 'LAP-002', marca_modelo: 'MacBook Air', categoria_id: cats[0]._id, estado: 'Disponible' },
    { serial_unico: 'ROU-001', marca_modelo: 'Cisco ISR', categoria_id: cats[3]._id, estado: 'Reparacion' }
  ]);

  console.log('🚀 ¡Data insertada con éxito, mi pana!');
  process.exit();
};

seedData();