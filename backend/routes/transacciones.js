const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las transacciones
router.get('/transacciones', (req, res) => {
  const query = `
    SELECT t.*, c.nombre as cliente_nombre
    FROM transacciones t
    LEFT JOIN clientes c ON t.cliente_id = c.id
    ORDER BY t.fecha DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener una transacción por ID
router.get('/transacciones/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM transacciones WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json(results[0]);
  });
});

// Crear una nueva transacción
router.post('/transacciones', (req, res) => {
  const { identificador, tipo_movimiento, tipo_documento, numero_documento, fecha, cliente_id, monto, descripcion } = req.body;
  const query = 'INSERT INTO transacciones (identificador, tipo_movimiento, tipo_documento, numero_documento, fecha, cliente_id, monto, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [identificador, tipo_movimiento, tipo_documento, numero_documento, fecha, cliente_id, monto, descripcion], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, message: 'Transacción creada' });
  });
});

// Actualizar una transacción
router.put('/transacciones/:id', (req, res) => {
  const { id } = req.params;
  const { identificador, tipo_movimiento, tipo_documento, numero_documento, fecha, cliente_id, monto, descripcion } = req.body;
  const query = 'UPDATE transacciones SET identificador = ?, tipo_movimiento = ?, tipo_documento = ?, numero_documento = ?, fecha = ?, cliente_id = ?, monto = ?, descripcion = ? WHERE id = ?';
  db.query(query, [identificador, tipo_movimiento, tipo_documento, numero_documento, fecha, cliente_id, monto, descripcion, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json({ message: 'Transacción actualizada' });
  });
});

// Eliminar una transacción
router.delete('/transacciones/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM transacciones WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json({ message: 'Transacción eliminada' });
  });
});

// Consulta por criterios
router.get('/transacciones/consulta', (req, res) => {
  const { cliente_id, tipo_movimiento, fecha_desde, fecha_hasta } = req.query;
  let query = 'SELECT t.*, c.nombre as cliente_nombre FROM transacciones t LEFT JOIN clientes c ON t.cliente_id = c.id WHERE 1=1';
  const params = [];

  if (cliente_id) {
    query += ' AND t.cliente_id = ?';
    params.push(cliente_id);
  }

  if (tipo_movimiento) {
    query += ' AND t.tipo_movimiento = ?';
    params.push(tipo_movimiento);
  }

  if (fecha_desde) {
    query += ' AND t.fecha >= ?';
    params.push(fecha_desde);
  }

  if (fecha_hasta) {
    query += ' AND t.fecha <= ?';
    params.push(fecha_hasta);
  }

  query += ' ORDER BY t.fecha DESC';

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;