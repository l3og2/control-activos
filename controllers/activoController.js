const Activo = require('../models/Activo');
const Categoria = require('../models/Categoria');
const Mantenimiento = require('../models/Mantenimiento');
const multer = require('multer');
const xlsx = require('xlsx');

const wantsHtml = (req) => req.headers.accept && req.headers.accept.includes('text/html');

const upload = multer({ storage: multer.memoryStorage() });

// 0. SUBIR ARCHIVO (middleware para la ruta de carga masiva)
exports.uploadFile = upload.single('file');

// 1. CREATE: Crear un nuevo activo (POST)
exports.crearActivo = async (req, res) => {
  try {
    const nuevoActivo = new Activo(req.body);
    await nuevoActivo.save();
    if (wantsHtml(req)) return res.redirect('/activos/vista?success=1&message=' + encodeURIComponent('Activo creado'));
    res.status(201).json({ mensaje: '✅ Activo creado con éxito', data: nuevoActivo });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al crear el activo', error: error.message });
  }
};

// 2. READ: Obtener todos los activos (GET)
exports.obtenerActivos = async (req, res) => {
  try {
    // Usamos .populate() para traernos los datos de la categoría, no solo su ID. ¡Truco de Senior!
    const activos = await Activo.find().populate('categoria_id', 'nombre descripcion');
    res.status(200).json(activos);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al obtener los activos' });
  }
};

// 🌟 CONSULTA SENCILLA: Filtrar activos por estado (GET)
exports.obtenerActivosPorEstado = async (req, res) => {
  try {
    const { estado } = req.params; // Capturamos el estado de la URL
    const activosFiltrados = await Activo.find({ estado: estado }).populate('categoria_id', 'nombre');
    res.status(200).json(activosFiltrados);
  } catch (error) {
    res.status(500).json({ mensaje: "Error real:", detalle: error.message });
  }
};

// Obtener un solo activo por su ID (GET)
exports.obtenerActivoPorId = async (req, res) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    // Usamos req.params.id para capturar el código que viene en la URL
    const activo = await Activo.findById(req.params.id).populate('categoria_id', 'nombre');
    
    // Si el ID no existe en la BD, avisamos
    if (!activo) {
      return res.status(404).json({ mensaje: '❌ Activo no encontrado' });
    }
    
    res.status(200).json(activo);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al buscar el activo', detalle: error.message });
  }
};

// 3. UPDATE: Actualizar un activo por ID (PUT)
exports.actualizarActivo = async (req, res) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent('ID inválido'));
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const activoActualizado = await Activo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activoActualizado) {
      if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent('Activo no encontrado'));
      return res.status(404).json({ mensaje: 'Activo no encontrado' });
    }
    if (wantsHtml(req)) return res.redirect('/activos/vista?success=1&message=' + encodeURIComponent('Activo actualizado'));
    res.status(200).json({ mensaje: '🔄 Activo actualizado', data: activoActualizado });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al actualizar' });
  }
};

// 4. DELETE: Borrar un activo (DELETE)
exports.eliminarActivo = async (req, res) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent('ID inválido'));
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const activoEliminado = await Activo.findByIdAndDelete(req.params.id);
    if (!activoEliminado) {
      if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent('Activo no encontrado'));
      return res.status(404).json({ mensaje: 'Activo no encontrado' });
    }
    if (wantsHtml(req)) return res.redirect('/activos/vista?success=1&message=' + encodeURIComponent('Activo eliminado'));
    res.status(200).json({ mensaje: '🗑️ Activo eliminado correctamente' });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/activos/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al eliminar' });
  }
};

// --- vistas
exports.listarVista = async (req, res) => {
  const activos = await Activo.find().populate('categoria_id', 'nombre');

  // Si hay registros de mantenimiento para un activo, mostrarlo como "Reparacion" en la lista.
  const mantenimientos = await Mantenimiento.find().distinct('activo_id');
  const mantenimientoIds = new Set(mantenimientos.map(String));

  const activosView = activos.map((a) => {
    if (mantenimientoIds.has(String(a._id))) {
      return { ...a.toObject(), estado: 'Reparacion' };
    }
    return a;
  });

  res.render('activos/list', {
    activos: activosView,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioNuevo = async (req, res) => {
  const categorias = await Categoria.find();
  res.render('activos/form', {
    activo: {},
    categorias,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};
// --- Carga masiva desde archivo (txt tabulado o Excel)
exports.mostrarCargaMasiva = (req, res) => {
  res.render('activos/carga', {
    success: req.query.success,
    error: req.query.error,
    message: req.query.message,
    report: null
  });
};

exports.procesarCargaMasiva = async (req, res) => {
  try {
    if (!req.file) {
      return res.render('activos/carga', {
        success: 0,
        error: 1,
        message: 'No se cargó ningún archivo',
        report: null
      });
    }

    const buffer = req.file.buffer;
    const filename = req.file.originalname.toLowerCase();

    let rows = [];

    if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    } else {
      const text = buffer.toString('utf8');
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length === 0) {
        return res.render('activos/carga', {
          success: 0,
          error: 1,
          message: 'Archivo vacío',
          report: null
        });
      }

      const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(',') ? ',' : '\t';
      const headers = lines[0]
        .split(delimiter)
        .map((h) => h.trim().toLowerCase());

      rows = lines.slice(1).map((line) => {
        const values = line.split(delimiter);
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h] = (values[idx] || '').trim();
        });
        return obj;
      });
    }

    const normalize = (s) => (typeof s === 'string' ? s.trim() : '');
    const mapField = (row, keys) => {
      for (const key of keys) {
        if (row[key] != null && row[key] !== '') return normalize(row[key]);
      }
      return '';
    };

    const categorias = await Categoria.find();
    const categoriaMap = new Map(categorias.map((c) => [c.nombre.toLowerCase(), c._id]));

    const allowedStates = ['Disponible', 'Asignado', 'Reparacion'];

    const docs = rows
      .map((row, index) => {
        const serial = mapField(row, ['serial_unico', 'serial', 'serie']);
        const marca = mapField(row, ['marca_modelo', 'marca']);
        const categoriaName = mapField(row, ['categoria']);
        const estadoRaw = mapField(row, ['estado']);

        if (!serial || !marca) return null;

        const catId = categoriaName ? categoriaMap.get(categoriaName.toLowerCase()) : null;
        const estadoMatch = allowedStates.find((s) => s.toLowerCase() === estadoRaw.toLowerCase());

        return {
          rowIndex: index + 2, // +2 because 1-based and header
          data: {
            serial_unico: serial,
            marca_modelo: marca,
            categoria_id: catId || undefined,
            estado: estadoMatch || 'Disponible'
          }
        };
      })
      .filter(Boolean);

    if (docs.length === 0) {
      return res.render('activos/carga', {
        success: 0,
        error: 1,
        message: 'No se encontraron registros válidos',
        report: null
      });
    }

    // Procesar cada documento individualmente para capturar errores detallados
    const report = { successes: [], failures: [] };
    for (const item of docs) {
      try {
        const activo = new Activo(item.data);
        await activo.save();
        report.successes.push({
          row: item.rowIndex,
          serial: item.data.serial_unico,
          marca: item.data.marca_modelo
        });
      } catch (err) {
        report.failures.push({
          row: item.rowIndex,
          serial: item.data.serial_unico,
          marca: item.data.marca_modelo,
          error: err.message
        });
      }
    }

    const totalProcessed = report.successes.length + report.failures.length;
    const message = `Procesados ${totalProcessed} registros. Éxitos: ${report.successes.length}, Errores: ${report.failures.length}`;

    res.render('activos/carga', {
      success: report.failures.length === 0 ? 1 : 0,
      error: report.failures.length > 0 ? 1 : 0,
      message,
      report
    });
  } catch (error) {
    res.render('activos/carga', {
      success: 0,
      error: 1,
      message: error.message,
      report: null
    });
  }
};
exports.formularioEditar = async (req, res) => {
  const activo = await Activo.findById(req.params.id);
  const categorias = await Categoria.find();
  if (!activo) return res.redirect('/activos/vista');
  res.render('activos/form', {
    activo,
    categorias,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};