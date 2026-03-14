-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS cuentasxcobrar;
USE cuentasxcobrar;

-- Tabla para Tipos de Documentos
CREATE TABLE IF NOT EXISTS tipos_documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identificador VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NOT NULL,
  cuenta_contable VARCHAR(100) NOT NULL,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);

-- Tabla para Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identificador VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  limite_credito DECIMAL(10,2) DEFAULT 0.00,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);

-- Tabla para Transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  tipo_movimiento ENUM('DB', 'CR') NOT NULL, -- Débito o Crédito
  monto DECIMAL(10,2) NOT NULL,
  fecha DATE NOT NULL,
  descripcion VARCHAR(255),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabla para Asientos Contables
CREATE TABLE IF NOT EXISTS asientos_contables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  descripcion VARCHAR(255),
  debito DECIMAL(10,2) DEFAULT 0.00,
  credito DECIMAL(10,2) DEFAULT 0.00,
  cuenta VARCHAR(100) NOT NULL
);

-- Insertar algunos datos de ejemplo
INSERT INTO tipos_documentos (identificador, descripcion, cuenta_contable) VALUES
('FAC', 'Factura', '1101'),
('REC', 'Recibo', '1102'),
('NCF', 'Nota de Crédito Fiscal', '1103');

INSERT INTO clientes (identificador, nombre, cedula, limite_credito) VALUES
('CLI-001', 'Juan Pérez', '001-1234567-8', 50000.00),
('CLI-002', 'María García', '002-9876543-2', 30000.00);