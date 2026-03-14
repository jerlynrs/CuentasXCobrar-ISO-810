const express = require("express");
const cors = require("cors");
const clientesRoutes = require('./backend/routes/clientes');
const tiposDocumentosRoutes = require('./backend/routes/tiposDocumentos');
const transaccionesRoutes = require('./backend/routes/transacciones');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static('frontend'));

// Usar rutas
app.use('/api', clientesRoutes);
app.use('/api', tiposDocumentosRoutes);
app.use('/api', transaccionesRoutes);

app.get("/", (req, res) => {
  res.send("Sistema Cuentas por Cobrar funcionando");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});