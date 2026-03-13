// Citas guardadas en localStorage
var citas = JSON.parse(localStorage.getItem("citas")) || [];
var modalCita = null;
var modalEliminar = null;

document.addEventListener("DOMContentLoaded", function () {
  modalCita = new bootstrap.Modal(document.getElementById("modalCita"));
  modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));
  renderizarTabla();
});

// Guardar citas en localStorage
function guardarEnStorage() {
  localStorage.setItem("citas", JSON.stringify(citas));
}

// Mostrar todas las citas en la tabla
function renderizarTabla() {
  var tbody = document.getElementById("cuerpoTabla");
  var mensajeVacio = document.getElementById("mensajeVacio");

  tbody.innerHTML = "";

  if (citas.length === 0) {
    mensajeVacio.style.display = "block";
    return;
  }

  mensajeVacio.style.display = "none";

  for (var i = 0; i < citas.length; i++) {
    var cita = citas[i];
    var fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + cita.paciente + "</td>" +
      "<td>" + cita.doctor + "</td>" +
      "<td>" + formatearFecha(cita.fecha) + "</td>" +
      "<td>" + cita.hora + "</td>" +
      "<td>" + (cita.motivo || "-") + "</td>" +
      "<td class='text-center'>" +
        "<button class='btn btn-sm btn-outline-primary me-1' onclick='abrirModalEditar(" + i + ")'>" +
          "<i class='bi bi-pencil'></i>" +
        "</button>" +
        "<button class='btn btn-sm btn-outline-danger' onclick='abrirModalEliminar(" + i + ")'>" +
          "<i class='bi bi-trash'></i>" +
        "</button>" +
      "</td>";
    tbody.appendChild(fila);
  }
}

// Formato de fecha dd/mm/yyyy
function formatearFecha(fecha) {
  var partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Abrir modal para nueva cita
function abrirModalNueva() {
  document.getElementById("tituloModal").innerHTML = "<i class='bi bi-calendar-plus me-2'></i>Nueva Cita";
  document.getElementById("citaId").value = "";
  document.getElementById("campoPaciente").value = "";
  document.getElementById("campoDoctor").value = "";
  document.getElementById("campoFecha").value = "";
  document.getElementById("campoHora").value = "";
  document.getElementById("campoMotivo").value = "";
  ocultarErrores();
  modalCita.show();
}

// Abrir modal para editar una cita existente
function abrirModalEditar(indice) {
  var cita = citas[indice];
  document.getElementById("tituloModal").innerHTML = "<i class='bi bi-pencil me-2'></i>Editar Cita";
  document.getElementById("citaId").value = indice;
  document.getElementById("campoPaciente").value = cita.paciente;
  document.getElementById("campoDoctor").value = cita.doctor;
  document.getElementById("campoFecha").value = cita.fecha;
  document.getElementById("campoHora").value = cita.hora;
  document.getElementById("campoMotivo").value = cita.motivo;
  ocultarErrores();
  modalCita.show();
}

// Guardar cita (nueva o editada)
function guardarCita() {
  var paciente = document.getElementById("campoPaciente").value.trim();
  var doctor = document.getElementById("campoDoctor").value.trim();
  var fecha = document.getElementById("campoFecha").value;
  var hora = document.getElementById("campoHora").value;
  var motivo = document.getElementById("campoMotivo").value.trim();
  var idEditar = document.getElementById("citaId").value;

  ocultarErrores();

  var valido = true;

  if (paciente === "") {
    document.getElementById("errPaciente").style.display = "block";
    valido = false;
  }
  if (doctor === "") {
    document.getElementById("errDoctor").style.display = "block";
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

  var nuevaCita = {
    paciente: paciente,
    doctor: doctor,
    fecha: fecha,
    hora: hora,
    motivo: motivo
  };

  if (idEditar === "") {
    citas.push(nuevaCita);
  } else {
    citas[parseInt(idEditar)] = nuevaCita;
  }

  guardarEnStorage();
  renderizarTabla();
  modalCita.hide();
}

// Abrir modal de confirmación de eliminación
function abrirModalEliminar(indice) {
  document.getElementById("idEliminar").value = indice;
  modalEliminar.show();
}

// Confirmar y ejecutar eliminación
function confirmarEliminar() {
  var indice = parseInt(document.getElementById("idEliminar").value);
  citas.splice(indice, 1);
  guardarEnStorage();
  renderizarTabla();
  modalEliminar.hide();
}

// Ocultar todos los mensajes de error
function ocultarErrores() {
  document.getElementById("errPaciente").style.display = "none";
  document.getElementById("errDoctor").style.display = "none";
  document.getElementById("errFecha").style.display = "none";
  document.getElementById("errHora").style.display = "none";
}
