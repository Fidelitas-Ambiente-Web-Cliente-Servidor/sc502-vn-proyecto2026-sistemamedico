var modalCita = null;
var modalEliminar = null;

document.addEventListener("DOMContentLoaded", function () {
  modalCita = new bootstrap.Modal(document.getElementById("modalCita"));
  modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

  cargarCitasDisponibles();
  cargarCitas();
});


// CARGAR MIS CITAS

function cargarCitas() {
  fetch("citas_api.php?action=getCitas")
    .then(res => res.json())
    .then(data => {
      renderizarTabla(data.citas);
    })
    .catch(() => {
      mostrarError("Error al cargar citas");
    });
}

// CARGAR CITAS DISPONIBLES

function cargarCitasDisponibles() {
  fetch("citas_api.php?action=getDisponibles")
    .then(res => res.json())
    .then(data => {

      let select = document.getElementById("campoDoctor");

      select.innerHTML =
        '<option value="">Seleccione una cita disponible</option>';

      data.citas.forEach(function (cita) {

        let option = document.createElement("option");

        option.value = cita.id_cita;

        option.textContent =
          cita.nombre_doctor +
          " — " +
          cita.especialidad +
          " — Licencia: " +
          cita.licencia_medica +
          " — " +
          formatearFecha(cita.fecha) +
          " — " +
          cita.hora.substring(0, 5);

        select.appendChild(option);
      });
    })
    .catch(() => {
      mostrarError("Error al cargar citas disponibles");
    });
}

// TABLA

function renderizarTabla(citas) {
  let tbody = document.getElementById("cuerpoTabla");
  let mensajeVacio = document.getElementById("mensajeVacio");

  tbody.innerHTML = "";

  if (!citas || citas.length === 0) {
    mensajeVacio.style.display = "block";
    return;
  }

  mensajeVacio.style.display = "none";

  citas.forEach(function (cita) {

    let fila = `
      <tr>
        <td>${cita.paciente}</td>
        <td>${cita.doctor}</td>
        <td>${formatearFecha(cita.fecha)}</td>
        <td>${cita.hora ? cita.hora.substring(0,5) : ""}</td>
        <td>${cita.motivo || "-"}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger"
            onclick="abrirModalEliminar(${cita.id_cita})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;

    tbody.innerHTML += fila;
  });
}

function formatearFecha(fecha) {
  let partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// MODAL NUEVA CITA


function abrirModalNueva() {
  document.getElementById("citaId").value = "";
  document.getElementById("campoDoctor").value = "";
  document.getElementById("campoMotivo").value = "";

  ocultarErrores();
  modalCita.show();
}

// RESERVAR CITA


function guardarCita() {
  let id_cita = document.getElementById("campoDoctor").value;
  let motivo = document.getElementById("campoMotivo").value.trim();

  ocultarErrores();

  if (id_cita === "") {
    document.getElementById("errDoctor").style.display = "block";
    return;
  }

  let datos = new FormData();
  datos.append("action", "reservar");
  datos.append("id_cita", id_cita);
  datos.append("motivo", motivo);

  fetch("citas_api.php", {
    method: "POST",
    body: datos
  })
    .then(res => res.json())
    .then(data => {
      if (data.response === "00") {
        modalCita.hide();
        cargarCitas();
        cargarCitasDisponibles();
      } else {
        mostrarError("Error al reservar cita");
      }
    })
    .catch(() => {
      mostrarError("Error de conexión");
    });
}

// ELIMINAR CITA


function abrirModalEliminar(id_cita) {
  document.getElementById("idEliminar").value = id_cita;
  modalEliminar.show();
}

function confirmarEliminar() {
  let id_cita = document.getElementById("idEliminar").value;

  let datos = new FormData();
  datos.append("action", "liberar"); 
  datos.append("id_cita", id_cita);

  fetch("citas_api.php", {
    method: "POST",
    body: datos
  })
  .then(res => res.json())
  .then(data => {
    if (data.response === "00") {
      modalEliminar.hide();
      cargarCitas();
      cargarCitasDisponibles();
    } else {
      mostrarError("Error al liberar");
    }
  });
}



function ocultarErrores() {
  document.getElementById("errDoctor").style.display = "none";
}

function mostrarError(msg) {
  alert(msg);
}