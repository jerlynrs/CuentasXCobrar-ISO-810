const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los clientes
router.get('/clientes', (req, res) => {
  const query = 'SELECT * FROM clientes';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener un cliente por ID
router.get('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM clientes WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un nuevo cliente
router.post('/clientes', (req, res) => {
  const { identificador, nombre, cedula, limite_credito, estado } = req.body;
  const query = 'INSERT INTO clientes (identificador, nombre, cedula, limite_credito, estado) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [identificador, nombre, cedula, limite_credito, estado], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, message: 'Cliente creado' });
  });
});

// Actualizar un cliente
router.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { identificador, nombre, cedula, limite_credito, estado } = req.body;
  const query = 'UPDATE clientes SET identificador = ?, nombre = ?, cedula = ?, limite_credito = ?, estado = ? WHERE id = ?';
  db.query(query, [identificador, nombre, cedula, limite_credito, estado, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado' });
  });
});

// Eliminar un cliente
router.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM clientes WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado' });
  });
});

// Consulta personalizada por criterios (ej: por estado o nombre)
router.get('/clientes/consulta', (req, res) => {
  const { estado, nombre } = req.query;
  let query = 'SELECT * FROM clientes WHERE 1=1';
  const params = [];

  if (estado) {
    query += ' AND estado = ?';
    params.push(estado);
  }

  if (nombre) {
    query += ' AND nombre LIKE ?';
    params.push(`%${nombre}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;