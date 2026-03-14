const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost', // Cambia si tu servidor MySQL no está en localhost
  user: 'root',      // Tu usuario de MySQL
  password: '',      // Tu contraseña de MySQL
  database: 'cuentasxcobrar' // Nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;