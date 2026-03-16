const Empleado = require('../models/Empleado');
const multer = require('multer');
const xlsx = require('xlsx');

const wantsHtml = (req) => req.headers.accept && req.headers.accept.includes('text/html');

const upload = multer({ storage: multer.memoryStorage() });

// Middleware para subida de archivo en carga masiva
exports.uploadFile = upload.single('file');

// API CRUD
exports.crearEmpleado = async (req, res) => {
  try {
    const nuevo = new Empleado(req.body);
    await nuevo.save();

    if (wantsHtml(req)) {
      return res.redirect('/empleados/vista?success=1&message=' + encodeURIComponent('Empleado creado')); 
    }

    res.status(201).json({ mensaje: '✅ Empleado creado', data: nuevo });
  } catch (error) {
    if (wantsHtml(req)) {
      return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent(error.message));
    }
    res.status(500).json({ mensaje: '❌ Error al crear empleado', error: error.message });
  }
};

exports.obtenerEmpleados = async (req, res) => {
  try {
    const lista = await Empleado.find();
    res.status(200).json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al obtener empleados' });
  }
};

exports.obtenerEmpleadoPorId = async (req, res) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const emp = await Empleado.findById(req.params.id);
    if (!emp) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.status(200).json(emp);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al buscar empleado', detalle: error.message });
  }
};

exports.actualizarEmpleado = async (req, res) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent('ID inválido'));
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const actualizado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent('Empleado no encontrado'));
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    if (wantsHtml(req)) return res.redirect('/empleados/vista?success=1&message=' + encodeURIComponent('Empleado actualizado'));
    res.status(200).json({ mensaje: '🔄 Empleado actualizado', data: actualizado });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al actualizar empleado' });
  }
};

exports.eliminarEmpleado = async (req, res) => {
  try {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
      if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent('ID inválido'));
      return res.status(404).json({ mensaje: 'ID inválido' });
    }
    const eliminado = await Empleado.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent('Empleado no encontrado'));
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    if (wantsHtml(req)) return res.redirect('/empleados/vista?success=1&message=' + encodeURIComponent('Empleado eliminado'));
    res.status(200).json({ mensaje: '🗑️ Empleado eliminado' });
  } catch (error) {
    if (wantsHtml(req)) return res.redirect('/empleados/vista?error=1&message=' + encodeURIComponent(error.message));
    res.status(500).json({ mensaje: '❌ Error al eliminar empleado' });
  }
};

// ----
// View rendering helpers (EJS)
exports.listarVista = async (req, res) => {
  const lista = await Empleado.find();
  res.render('empleados/list', {
    empleados: lista,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioNuevo = (req, res) => {
  res.render('empleados/form', {
    empleado: {},
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

exports.formularioEditar = async (req, res) => {
  const emp = await Empleado.findById(req.params.id);
  if (!emp) return res.redirect('/empleados');
  res.render('empleados/form', {
    empleado: emp,
    success: req.query.success,
    error: req.query.error,
    message: req.query.message
  });
};

// --- Carga masiva de empleados desde archivo (txt tabulado o Excel)
exports.mostrarCargaMasiva = (req, res) => {
  res.render('empleados/carga', {
    success: req.query.success,
    error: req.query.error,
    message: req.query.message,
    report: null
  });
};

exports.procesarCargaMasiva = async (req, res) => {
  try {
    if (!req.file) {
      return res.render('empleados/carga', {
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
        return res.render('empleados/carga', {
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

    const docs = rows
      .map((row, index) => {
        const nombre = mapField(row, ['nombre']);
        const apellido = mapField(row, ['apellido']);
        const ficha = mapField(row, ['ficha']);
        const cedula = mapField(row, ['cedula']);
        const cargo = mapField(row, ['cargo']);

        if (!nombre || !apellido || !ficha || !cedula || !cargo) return null;

        return {
          rowIndex: index + 2,
          data: { nombre, apellido, ficha, cedula, cargo }
        };
      })
      .filter(Boolean);

    if (docs.length === 0) {
      return res.render('empleados/carga', {
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
        const empleado = new Empleado(item.data);
        await empleado.save();
        report.successes.push({
          row: item.rowIndex,
          nombre: item.data.nombre,
          apellido: item.data.apellido,
          ficha: item.data.ficha
        });
      } catch (err) {
        report.failures.push({
          row: item.rowIndex,
          nombre: item.data.nombre,
          apellido: item.data.apellido,
          ficha: item.data.ficha,
          error: err.message
        });
      }
    }

    const totalProcessed = report.successes.length + report.failures.length;
    const message = `Procesados ${totalProcessed} registros. Éxitos: ${report.successes.length}, Errores: ${report.failures.length}`;

    res.render('empleados/carga', {
      success: report.failures.length === 0 ? 1 : 0,
      error: report.failures.length > 0 ? 1 : 0,
      message,
      report
    });
  } catch (error) {
    res.render('empleados/carga', {
      success: 0,
      error: 1,
      message: error.message,
      report: null
    });
  }
};