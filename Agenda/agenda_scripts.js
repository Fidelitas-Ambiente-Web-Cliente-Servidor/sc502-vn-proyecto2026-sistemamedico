var modalCita = null;
var modalEliminar = null;

document.addEventListener("DOMContentLoaded", function () {
  modalCita     = new bootstrap.Modal(document.getElementById("modalCita"));
  modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

  cargarDoctores();
  cargarCitas();
});

// ── API ──────────────────────────────────────────────────────────────────────

function cargarCitas() {
  fetch("citas_api.php?action=getCitas")
    .then(function (res) { return res.json(); })
    .then(function (data) { renderizarTabla(data.citas); })
    .catch(function () { mostrarError("Error al cargar las citas."); });
}

function cargarDoctores() {
  fetch("citas_api.php?action=getDoctores")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var select = document.getElementById("campoDoctor");
      select.innerHTML = '<option value="">Seleccione un doctor</option>';
      data.doctores.forEach(function (d) {
        var opt = document.createElement("option");
        opt.value       = d.id_doctor;
        opt.textContent = d.nombre_completo;
        select.appendChild(opt);
      });
      // Opción para crear nuevo doctor
      var optNuevo = document.createElement("option");
      optNuevo.value       = "nuevo";
      optNuevo.textContent = "➕ Crear nuevo doctor...";
      select.appendChild(optNuevo);
    });
}

function toggleNuevoDoctor(valor) {
  var div = document.getElementById("nuevoDoctorDiv");
  div.style.display = valor === "nuevo" ? "block" : "none";
  if (valor !== "nuevo") {
    document.getElementById("campoNuevoDoctor").value = "";
    document.getElementById("errNuevoDoctor").style.display = "none";
  }
}

// ── TABLA ────────────────────────────────────────────────────────────────────

function renderizarTabla(citas) {
  var tbody         = document.getElementById("cuerpoTabla");
  var mensajeVacio  = document.getElementById("mensajeVacio");

  tbody.innerHTML = "";

  if (!citas || citas.length === 0) {
    mensajeVacio.style.display = "block";
    return;
  }

  mensajeVacio.style.display = "none";

  citas.forEach(function (cita) {
    var fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + cita.paciente + "</td>" +
      "<td>" + cita.doctor + "</td>" +
      "<td>" + formatearFecha(cita.fecha) + "</td>" +
      "<td>" + (cita.hora ? cita.hora.substring(0, 5) : "") + "</td>" +
      "<td>" + (cita.motivo || "-") + "</td>" +
      "<td class='text-center'>" +
        "<button class='btn btn-sm btn-outline-primary me-1' onclick='abrirModalEditar(" + JSON.stringify(cita) + ")'>" +
          "<i class='bi bi-pencil'></i>" +
        "</button>" +
        "<button class='btn btn-sm btn-outline-danger' onclick='abrirModalEliminar(" + cita.id_cita + ")'>" +
          "<i class='bi bi-trash'></i>" +
        "</button>" +
      "</td>";
    tbody.appendChild(fila);
  });
}

function formatearFecha(fecha) {
  var partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// ── MODALES ──────────────────────────────────────────────────────────────────

function abrirModalNueva() {
  document.getElementById("tituloModal").innerHTML = "<i class='bi bi-calendar-plus me-2'></i>Nueva Cita";
  document.getElementById("citaId").value          = "";
  document.getElementById("campoDoctor").value     = "";
  document.getElementById("campoNuevoDoctor").value = "";
  document.getElementById("nuevoDoctorDiv").style.display = "none";
  document.getElementById("campoFecha").value      = "";
  document.getElementById("campoHora").value       = "";
  document.getElementById("campoMotivo").value     = "";
  ocultarErrores();
  modalCita.show();
}

function abrirModalEditar(cita) {
  document.getElementById("tituloModal").innerHTML = "<i class='bi bi-pencil me-2'></i>Editar Cita";
  document.getElementById("citaId").value          = cita.id_cita;
  document.getElementById("campoDoctor").value     = cita.id_doctor;
  document.getElementById("campoNuevoDoctor").value = "";
  document.getElementById("nuevoDoctorDiv").style.display = "none";
  document.getElementById("campoFecha").value      = cita.fecha;
  document.getElementById("campoHora").value       = cita.hora;
  document.getElementById("campoMotivo").value     = cita.motivo || "";
  ocultarErrores();
  modalCita.show();
}

function abrirModalEliminar(id_cita) {
  document.getElementById("idEliminar").value = id_cita;
  modalEliminar.show();
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

function guardarCita() {
  var id_doctor    = document.getElementById("campoDoctor").value;
  var nombreNuevo  = document.getElementById("campoNuevoDoctor").value.trim();
  var fecha        = document.getElementById("campoFecha").value;
  var hora         = document.getElementById("campoHora").value;
  var motivo       = document.getElementById("campoMotivo").value.trim();
  var idEditar     = document.getElementById("citaId").value;

  ocultarErrores();
  var valido = true;

  if (id_doctor === "") {
    document.getElementById("errDoctor").style.display = "block";
    valido = false;
  }
  if (id_doctor === "nuevo" && nombreNuevo === "") {
    document.getElementById("errNuevoDoctor").style.display = "block";
    valido = false;
  }
  if (fecha === "") {
    document.getElementById("errFecha").style.display = "block";
    valido = false;
  }
  if (hora === "") {
    document.getElementById("errHora").style.display = "block";
    valido = false;
  }

  if (!valido) return;

  var datos = new FormData();
  datos.append("id_doctor", id_doctor);
  if (id_doctor === "nuevo") {
    datos.append("nombre_doctor", nombreNuevo);
  }
  datos.append("fecha",  fecha);
  datos.append("hora",   hora);
  datos.append("motivo", motivo);

  if (idEditar === "") {
    datos.append("action", "store");
  } else {
    datos.append("action",  "update");
    datos.append("id_cita", idEditar);
  }

  fetch("citas_api.php", { method: "POST", body: datos })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.response === "00") {
        modalCita.hide();
        cargarDoctores();
        cargarCitas();
      } else {
        mostrarError("Error al guardar la cita.");
      }
    })
    .catch(function () { mostrarError("Error de conexión."); });
}

function confirmarEliminar() {
  var id_cita = document.getElementById("idEliminar").value;
  var datos   = new FormData();
  datos.append("action",  "delete");
  datos.append("id_cita", id_cita);

  fetch("citas_api.php", { method: "POST", body: datos })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.response === "00") {
        modalEliminar.hide();
        cargarCitas();
      } else {
        mostrarError("Error al eliminar la cita.");
      }
    })
    .catch(function () { mostrarError("Error de conexión."); });
}

// ── UTILS ─────────────────────────────────────────────────────────────────────

function ocultarErrores() {
  document.getElementById("errDoctor").style.display      = "none";
  document.getElementById("errNuevoDoctor").style.display = "none";
  document.getElementById("errFecha").style.display       = "none";
  document.getElementById("errHora").style.display        = "none";
}

function mostrarError(msg) {
  alert(msg);
}
