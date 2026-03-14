const TransaccionesModulo = {
  indiceEdicion: -1,

  html: `
    <div class="section-page container-fluid fade-in">
      <div class="section-stats" id="transacciones-stats">
        <div class="section-stat">
          <div class="section-stat-icon muted"><i class="fas fa-list"></i></div>
          <div>
            <span class="section-stat-label">Total transacciones</span>
            <span class="section-stat-value" id="trans-stat-total">0</span>
          </div>
        </div>
        <div class="section-stat">
          <div class="section-stat-icon primary"><i class="fas fa-arrow-down"></i></div>
          <div>
            <span class="section-stat-label">Débitos (DB)</span>
            <span class="section-stat-value" id="trans-stat-debitos">RD$ 0</span>
          </div>
        </div>
        <div class="section-stat">
          <div class="section-stat-icon success"><i class="fas fa-arrow-up"></i></div>
          <div>
            <span class="section-stat-label">Créditos (CR)</span>
            <span class="section-stat-value" id="trans-stat-creditos">RD$ 0</span>
          </div>
        </div>
        <div class="section-stat">
          <div class="section-stat-icon warning"><i class="fas fa-balance-scale"></i></div>
          <div>
            <span class="section-stat-label">Balance</span>
            <span class="section-stat-value" id="trans-stat-balance">RD$ 0</span>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0" id="titulo-form-transaccion">Registro de nueva transacción</h5>
        </div>
        <div class="card-body">
          <form onsubmit="TransaccionesModulo.guardar(event)">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-bold">Identificador de transacción</label>
                <input type="text" id="transId" class="form-control" placeholder="TRX-001" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-bold">Tipo de movimiento</label>
                <select id="tipoMovimiento" class="form-select" required>
                  <option value="">Seleccione</option>
                  <option value="DB">DB - Débito</option>
                  <option value="CR">CR - Crédito</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-bold">Tipo de documento</label>
                <input type="text" id="tipoDocumento" class="form-control" placeholder="FAC, NCF, REC" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-bold">Número de documento</label>
                <select id="numeroDocumento" class="form-select" required>
                  <option value="">Seleccione tipo de documento</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-bold">Fecha</label>
                <input type="date" id="fecha" class="form-control" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-bold">Cliente</label>
                <select id="clienteId" class="form-select" required>
                  <option value="">Seleccione un cliente</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-bold">Monto</label>
                <div class="input-group">
                  <span class="input-group-text">RD$</span>
                  <input type="number" id="monto" class="form-control" step="0.01" min="0.01" required>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2 mt-3">
              <button type="submit" id="btn-guardar-transaccion" class="btn btn-success px-4"><i class="fas fa-save"></i> Guardar transacción</button>
              <button type="button" id="btn-cancelar-transaccion" onclick="TransaccionesModulo.cancelarEdicion()" class="btn btn-secondary" style="display:none;">Cancelar</button>
            </div>
            <div id="error-msg-transaccion" class="alert alert-danger mt-3" style="display:none;"></div>
          </form>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-header flex-header">
          <h5 class="mb-0 text-secondary">Listado de transacciones</h5>
          <div class="section-toolbar">
            <input type="date" id="trans-filtro-desde" class="form-control form-control-sm" title="Fecha desde">
            <input type="date" id="trans-filtro-hasta" class="form-control form-control-sm" title="Fecha hasta">
            <select id="trans-filtro-cliente" class="form-select form-control-sm">
              <option value="">Todos los clientes</option>
            </select>
            <select id="trans-filtro-tipo" class="form-select form-control-sm">
              <option value="">Todos los tipos</option>
              <option value="DB">Débito</option>
              <option value="CR">Crédito</option>
            </select>
            <button type="button" onclick="TransaccionesModulo.renderizarTabla()" class="btn btn-sm btn-outline-secondary"><i class="fas fa-filter"></i> Filtrar</button>
          </div>
        </div>
        <div class="card-body p-0">
          <p class="results-count" id="trans-results-count" style="margin: 12px 20px 0;"></p>
          <div class="table-responsive">
            <table class="table table-striped table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">ID</th>
                  <th>Mov.</th>
                  <th>Tipo doc.</th>
                  <th>No. doc.</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th class="text-end">Monto</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody id="tabla-transacciones-body"></tbody>
              <tfoot id="tabla-transacciones-foot"></tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,

  cargarVista: function () {
    document.getElementById("contenido").innerHTML = this.html;
    this.cargarClientesEnSelect();
    this.cargarTiposDocumentosEnSelect();
    this.cargarClientesEnFiltro();
    ["trans-filtro-desde", "trans-filtro-hasta", "trans-filtro-cliente", "trans-filtro-tipo"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => this.renderizarTabla());
    });
    this.actualizarEstadisticas();
    this.renderizarTabla();
  },

  cargarEstilosBootstrap: function () {},

  cargarClientesEnSelect: function () {
    const select = document.getElementById("clienteId");
    if (!select) return;
    // Usar API para cargar clientes
    fetch('/api/clientes')
      .then(response => response.json())
      .then(clientes => {
        select.innerHTML = "<option value=\"\">Seleccione un cliente</option>";
        clientes.forEach((c) => {
          select.innerHTML += `<option value="${c.id}">${c.identificador} - ${c.nombre}</option>`;
        });
      })
      .catch(error => console.error('Error cargando clientes:', error));
  },

  cargarTiposDocumentosEnSelect: function () {
    const select = document.getElementById("numeroDocumento");
    if (!select) return;
    // Usar API para cargar tipos de documentos
    fetch('/api/tipos-documentos')
      .then(response => response.json())
      .then(tipos => {
        select.innerHTML = "<option value=\"\">Seleccione tipo de documento</option>";
        tipos.forEach((t) => {
          select.innerHTML += `<option value="${t.identificador}">${t.identificador} - ${t.descripcion}</option>`;
        });
      })
      .catch(error => console.error('Error cargando tipos de documentos:', error));
  },

  cargarClientesEnFiltro: function () {
    const select = document.getElementById("trans-filtro-cliente");
    if (!select) return;
    // Usar API para cargar clientes
    fetch('/api/clientes')
      .then(response => response.json())
      .then(clientes => {
        select.innerHTML = "<option value=\"\">Todos los clientes</option>";
        clientes.forEach((c) => {
          select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
        });
      })
      .catch(error => console.error('Error cargando clientes:', error));
  },

  filtrarTransacciones: function (transacciones) {
    const desde = document.getElementById("trans-filtro-desde")?.value || "";
    const hasta = document.getElementById("trans-filtro-hasta")?.value || "";
    const clienteId = document.getElementById("trans-filtro-cliente")?.value || "";
    const tipo = document.getElementById("trans-filtro-tipo")?.value || "";

    let filtradas = transacciones;

    if (desde) filtradas = filtradas.filter((t) => t.fecha >= desde);
    if (hasta) filtradas = filtradas.filter((t) => t.fecha <= hasta);
    if (clienteId) filtradas = filtradas.filter((t) => t.cliente_id == clienteId);
    if (tipo) filtradas = filtradas.filter((t) => t.tipo_movimiento === tipo);

    return filtradas;
  },

  mostrarTransaccionesEnTabla: function (transacciones, tbody, tfoot, countEl) {
    if (countEl) countEl.innerHTML = "Mostrando <strong>" + transacciones.length + "</strong> transacción(es).";

    let sumDb = 0, sumCr = 0;
    transacciones.forEach((t) => {
      const monto = parseFloat(t.monto) || 0;
      if (t.tipo_movimiento === "DB") sumDb += monto;
      else sumCr += monto;
    });
    const balanceFiltrado = sumDb - sumCr;

    if (transacciones.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-exchange-alt"></i><p>No hay transacciones que coincidan con los filtros.</p></td></tr>';
      if (tfoot) tfoot.innerHTML = "";
      return;
    }

    tbody.innerHTML = "";
    transacciones.forEach((t) => {
      const nombreCliente = t.cliente_nombre || t.cliente_id;
      const badgeClass = t.tipo_movimiento === "DB" ? "bg-primary" : "bg-success";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="ps-4 fw-bold">${t.identificador}</td>
        <td><span class="badge ${badgeClass}">${t.tipo_movimiento}</span></td>
        <td>${t.tipo_documento}</td>
        <td>${t.numero_documento}</td>
        <td>${t.fecha}</td>
        <td>${nombreCliente}</td>
        <td class="text-end">RD$ ${parseFloat(t.monto).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
        <td class="text-center">
          <button onclick="TransaccionesModulo.editar(${t.id})" class="btn btn-sm btn-outline-primary me-2"><i class="fas fa-edit"></i> Editar</button>
          <button onclick="TransaccionesModulo.eliminar(${t.id})" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash-alt"></i> Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (tfoot) {
      tfoot.innerHTML = `
        <tr class="table-light fw-bold">
          <td colspan="5" class="ps-4">Totales filtrados</td>
          <td class="text-end">DB: RD$ ${sumDb.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
          <td class="text-end">CR: RD$ ${sumCr.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
          <td class="text-end">Balance: RD$ ${balanceFiltrado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
        </tr>
      `;
    }
  },

  actualizarEstadisticas: function () {
    fetch('/api/transacciones')
      .then(response => response.json())
      .then(transacciones => {
        let debitos = 0, creditos = 0, balance = 0;
        transacciones.forEach((t) => {
          const monto = parseFloat(t.monto) || 0;
          if (t.tipo_movimiento === "DB") {
            debitos += monto;
            balance += monto;
          } else {
            creditos += monto;
            balance -= monto;
          }
        });

        const fmt = (n) => "RD$ " + n.toLocaleString("es-DO", { minimumFractionDigits: 2 });
        const totalEl = document.getElementById("trans-stat-total");
        const debEl = document.getElementById("trans-stat-debitos");
        const crEl = document.getElementById("trans-stat-creditos");
        const balEl = document.getElementById("trans-stat-balance");
        if (totalEl) totalEl.textContent = transacciones.length;
        if (debEl) debEl.textContent = fmt(debitos);
        if (crEl) crEl.textContent = fmt(creditos);
        if (balEl) {
          balEl.textContent = fmt(balance);
          balEl.style.color = balance >= 0 ? "#059669" : "#dc2626";
        }
      })
      .catch(error => console.error('Error cargando estadísticas:', error));
  },

  mostrarError: function (mensaje) {
    const div = document.getElementById("error-msg-transaccion");
    if (div) {
      div.style.display = "block";
      div.innerText = mensaje;
    }
  },

  guardar: function (e) {
    e.preventDefault();
    const msgDiv = document.getElementById("error-msg-transaccion");
    if (msgDiv) {
      msgDiv.style.display = "none";
      msgDiv.innerText = "";
    }

    const transaccion = {
      identificador: document.getElementById("transId").value.trim(),
      tipo_movimiento: document.getElementById("tipoMovimiento").value,
      tipo_documento: document.getElementById("tipoDocumento").value.trim(),
      numero_documento: document.getElementById("numeroDocumento").value.trim(),
      fecha: document.getElementById("fecha").value,
      cliente_id: document.getElementById("clienteId").value,
      monto: parseFloat(document.getElementById("monto").value),
      descripcion: "" // Opcional
    };

    // Validaciones
    if (!transaccion.identificador) {
      this.mostrarError("El identificador es requerido.");
      return;
    }
    if (!transaccion.tipo_movimiento || !["DB", "CR"].includes(transaccion.tipo_movimiento)) {
      this.mostrarError("El tipo de movimiento debe ser DB o CR.");
      return;
    }
    if (!transaccion.numero_documento) {
      this.mostrarError("Debe seleccionar un tipo de documento.");
      return;
    }
    if (!transaccion.cliente_id) {
      this.mostrarError("Debe seleccionar un cliente.");
      return;
    }
    if (transaccion.monto <= 0) {
      this.mostrarError("El monto debe ser mayor que cero.");
      return;
    }

    const method = this.indiceEdicion === -1 ? 'POST' : 'PUT';
    const url = this.indiceEdicion === -1 ? '/api/transacciones' : `/api/transacciones/${this.transaccionEditandoId}`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaccion)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
        if (this.indiceEdicion === -1) {
          e.target.reset();
        } else {
          this.cancelarEdicion();
        }
        this.cargarClientesEnSelect();
        this.cargarTiposDocumentosEnSelect();
        this.cargarClientesEnFiltro();
        this.actualizarEstadisticas();
        this.renderizarTabla();
      } else if (data.error) {
        this.mostrarError(data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.mostrarError('Error al guardar la transacción.');
    });
    if (typeof actualizarDashboard === "function") actualizarDashboard();
  },

  editar: function (id) {
    fetch(`/api/transacciones/${id}`)
      .then(response => response.json())
      .then(t => {
        document.getElementById("transId").value = t.identificador;
        document.getElementById("tipoMovimiento").value = t.tipo_movimiento;
        document.getElementById("tipoDocumento").value = t.tipo_documento;
        document.getElementById("numeroDocumento").value = t.numero_documento;
        document.getElementById("fecha").value = t.fecha;
        document.getElementById("clienteId").value = t.cliente_id;
        document.getElementById("monto").value = t.monto;

        this.indiceEdicion = -1; // No usar índice
        this.transaccionEditandoId = id;
        document.getElementById("titulo-form-transaccion").innerText = "Editando transacción: " + t.identificador;
        const btn = document.getElementById("btn-guardar-transaccion");
        btn.innerText = "Actualizar transacción";
        btn.className = "btn btn-warning px-4 text-white";
        document.getElementById("btn-cancelar-transaccion").style.display = "block";
      })
      .catch(error => console.error('Error cargando transacción:', error));
  },

  cancelarEdicion: function () {
    this.indiceEdicion = -1;
    this.transaccionEditandoId = null;
    document.getElementById("titulo-form-transaccion").innerText = "Registro de nueva transacción";
    const btn = document.getElementById("btn-guardar-transaccion");
    btn.innerHTML = "<i class=\"fas fa-save\"></i> Guardar transacción";
    btn.className = "btn btn-success px-4";
    document.getElementById("btn-cancelar-transaccion").style.display = "none";
    if (document.forms[0]) document.forms[0].reset();
    const err = document.getElementById("error-msg-transaccion");
    if (err) err.style.display = "none";
  },

  eliminar: function (id) {
    if (!confirm("¿Está seguro de eliminar esta transacción?")) return;
    fetch(`/api/transacciones/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
        this.cancelarEdicion();
        this.cargarClientesEnFiltro();
        this.actualizarEstadisticas();
        this.renderizarTabla();
        if (typeof actualizarDashboard === "function") actualizarDashboard();
      } else if (data.error) {
        alert('Error: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al eliminar la transacción.');
    });
  },

  renderizarTabla: function () {
    const tbody = document.getElementById("tabla-transacciones-body");
    const tfoot = document.getElementById("tabla-transacciones-foot");
    const countEl = document.getElementById("trans-results-count");
    if (!tbody) return;

    // Cargar transacciones desde API
    fetch('/api/transacciones')
      .then(response => response.json())
      .then(transacciones => {
        const filtradas = this.filtrarTransacciones(transacciones);
        this.mostrarTransaccionesEnTabla(filtradas, tbody, tfoot, countEl);
      })
      .catch(error => {
        console.error('Error cargando transacciones:', error);
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar transacciones.</p></td></tr>';
      });
  },

  mostrarTransaccionesEnTabla: function (transacciones, tbody, tfoot, countEl) {

    let sumDb = 0, sumCr = 0;
    transacciones.forEach((t) => {
      const monto = parseFloat(t.monto) || 0;
      if (t.tipo_movimiento === "DB") sumDb += monto;
      else sumCr += monto;
    });
    const balanceFiltrado = sumDb - sumCr;

    if (transacciones.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-exchange-alt"></i><p>No hay transacciones que coincidan con los filtros.</p></td></tr>';
      if (tfoot) tfoot.innerHTML = "";
      return;
    }

    tbody.innerHTML = "";
    transacciones.forEach((t) => {
      const nombreCliente = t.cliente_nombre || t.cliente_id;
      const badgeClass = t.tipo_movimiento === "DB" ? "bg-primary" : "bg-success";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="ps-4 fw-bold">${t.identificador}</td>
        <td><span class="badge ${badgeClass}">${t.tipo_movimiento}</span></td>
        <td>${t.tipo_documento}</td>
        <td>${t.numero_documento}</td>
        <td>${t.fecha}</td>
        <td>${nombreCliente}</td>
        <td class="text-end">RD$ ${parseFloat(t.monto).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
        <td class="text-center">
          <button onclick="TransaccionesModulo.editar(${t.id})" class="btn btn-sm btn-outline-primary me-2"><i class="fas fa-edit"></i> Editar</button>
          <button onclick="TransaccionesModulo.eliminar(${t.id})" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash-alt"></i> Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (tfoot) {
      tfoot.innerHTML = `
        <tr class="table-light fw-bold">
          <td colspan="5" class="ps-4">Totales filtrados</td>
          <td class="text-end">DB: RD$ ${sumDb.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
          <td class="text-end">CR: RD$ ${sumCr.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
          <td class="text-end">Balance: RD$ ${balanceFiltrado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
        </tr>
      `;
    }
  }
};
