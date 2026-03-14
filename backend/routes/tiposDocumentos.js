const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los tipos de documentos
router.get('/tipos-documentos', (req, res) => {
  const query = 'SELECT * FROM tipos_documentos';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener un tipo de documento por ID
router.get('/tipos-documentos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM tipos_documentos WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Tipo de documento no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un nuevo tipo de documento
router.post('/tipos-documentos', (req, res) => {
  const { identificador, descripcion, cuenta_contable, estado } = req.body;
  const query = 'INSERT INTO tipos_documentos (identificador, descripcion, cuenta_contable, estado) VALUES (?, ?, ?, ?)';
  db.query(query, [identificador, descripcion, cuenta_contable, estado], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, message: 'Tipo de documento creado' });
  });
});

// Actualizar un tipo de documento
router.put('/tipos-documentos/:id', (req, res) => {
  const { id } = req.params;
  const { identificador, descripcion, cuenta_contable, estado } = req.body;
  const query = 'UPDATE tipos_documentos SET identificador = ?, descripcion = ?, cuenta_contable = ?, estado = ? WHERE id = ?';
  db.query(query, [identificador, descripcion, cuenta_contable, estado, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de documento no encontrado' });
    }
    res.json({ message: 'Tipo de documento actualizado' });
  });
});

// Eliminar un tipo de documento
router.delete('/tipos-documentos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tipos_documentos WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de documento no encontrado' });
    }
    res.json({ message: 'Tipo de documento eliminado' });
  });
});

module.exports = router;