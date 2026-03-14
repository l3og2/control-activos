const Empleado = require('../models/Empleado');
const Categoria = require('../models/Categoria');
const Activo = require('../models/Activo');
const Asignacion = require('../models/Asignacion');
const Mantenimiento = require('../models/Mantenimiento');

describe('Schemas básicos', () => {
  test('Empleado debe tener nombre, apellido, cedula y cargo', () => {
    const paths = Object.keys(Empleado.schema.paths);
    expect(paths).toEqual(expect.arrayContaining(['nombre', 'apellido', 'cedula', 'cargo']));
  });

  test('Categoria debe tener nombre, descripcion, codigo_area, nivel_prioridad', () => {
    const paths = Object.keys(Categoria.schema.paths);
    expect(paths).toEqual(expect.arrayContaining(['nombre', 'descripcion', 'codigo_area', 'nivel_prioridad']));
  });

  test('Activo debe referenciar categoria_id y tener estado con enum', () => {
    expect(Activo.schema.paths.categoria_id).toBeDefined();
    const enumVals = Activo.schema.paths.estado.enumValues;
    expect(enumVals).toEqual(expect.arrayContaining(['Disponible','Asignado','Reparacion']));
  });

  test('Asignacion debe usar ObjectId para activo_id y empleado_id', () => {
    // mongoose puede reportar ObjectId u ObjectID, por eso usamos regex
    expect(Asignacion.schema.paths.activo_id.instance).toMatch(/ObjectId/i);
    expect(Asignacion.schema.paths.empleado_id.instance).toMatch(/ObjectId/i);
    expect(Asignacion.schema.paths.empleado_id.options.ref).toBe('Empleado');
  });

  test('Mantenimiento debe requerir activo_id y costo no negativo', () => {
    expect(Mantenimiento.schema.paths.activo_id.options.required).toBeTruthy();
    expect(Mantenimiento.schema.paths.costo.options.min[0]).toBe(0);
  });
});