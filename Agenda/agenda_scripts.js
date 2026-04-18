var modalCita = null;
var modalEliminar = null;

// Horarios por jornada
var HORARIOS = {
  "Mañana (07:00 - 13:00)": { inicio: "07:00", fin: "13:00" },
  "Tarde (13:00 - 19:00)": { inicio: "13:00", fin: "19:00" },
  "Noche (19:00 - 01:00)": { inicio: "19:00", fin: "23:59" },
};

// Doctores cargados
var doctoresCargados = [];

document.addEventListener("DOMContentLoaded", function () {
  modalCita = new bootstrap.Modal(document.getElementById("modalCita"));
  modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

  cargarDoctores();
  cargarCitas();
});

//API 

function cargarCitas() {
  fetch("citas_api.php?action=getCitas")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderizarTabla(data.citas);
    })
    .catch(function () {
      mostrarError("Error al cargar las citas.");
    });
}

function cargarDoctores() {
  fetch("citas_api.php?action=getDoctoresHorario")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      doctoresCargados = data.doctores || [];

      var select = document.getElementById("campoDoctor");
      select.innerHTML = '<option value="">Seleccione un doctor</option>';

      doctoresCargados.forEach(function (d) {
        var opt = document.createElement("option");
        opt.value = d.id_doctor;
        opt.textContent =
          d.nombre + (d.especialidad ? " — " + d.especialidad : "");
        opt.dataset.horario = d.horario || "";
        select.appendChild(opt);
      });

      // Verificar si viene id_doctor por URL
      var params = new URLSearchParams(window.location.search);
      var idDoctor = params.get("id_doctor");
      if (idDoctor) {
        setTimeout(function () {
          abrirModalNueva(idDoctor);
        }, 300);
      }
    });
}

function getHorarioDoctor(id_doctor) {
  var doc = doctoresCargados.find(function (d) {
    return d.id_doctor == id_doctor;
  });
  return doc ? doc.horario : null;
}

function aplicarRestriccionHora(id_doctor) {
  var campoHora = document.getElementById("campoHora");
  var horario = getHorarioDoctor(id_doctor);

  if (!horario || !HORARIOS[horario]) {
    campoHora.removeAttribute("min");
    campoHora.removeAttribute("max");
    return;
  }

  campoHora.min = HORARIOS[horario].inicio;
  campoHora.max = HORARIOS[horario].fin;
  campoHora.value = "";
}

//TABLA

function renderizarTabla(citas) {
  var tbody = document.getElementById("cuerpoTabla");
  var mensajeVacio = document.getElementById("mensajeVacio");

  tbody.innerHTML = "";

  if (!citas || citas.length === 0) {
    mensajeVacio.style.display = "block";
    return;
  }

  mensajeVacio.style.display = "none";

  citas.forEach(function (cita) {
    var fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" +
      cita.paciente +
      "</td>" +
      "<td>" +
      cita.doctor +
      "</td>" +
      "<td>" +
      formatearFecha(cita.fecha) +
      "</td>" +
      "<td>" +
      (cita.hora ? cita.hora.substring(0, 5) : "") +
      "</td>" +
      "<td>" +
      (cita.motivo || "-") +
      "</td>" +
      "<td class='text-center'>" +
      "<button class='btn btn-sm btn-outline-primary me-1' onclick='abrirModalEditar(" +
      JSON.stringify(cita) +
      ")'>" +
      "<i class='bi bi-pencil'></i>" +
      "</button>" +
      "<button class='btn btn-sm btn-outline-danger' onclick='abrirModalEliminar(" +
      cita.id_cita +
      ")'>" +
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

//MODALES

function abrirModalNueva(idDoctorPreseleccionado) {
  document.getElementById("tituloModal").innerHTML =
    "<i class='bi bi-calendar-plus me-2'></i>Nueva Cita";
  document.getElementById("citaId").value = "";
  document.getElementById("campoFecha").value = "";
  document.getElementById("campoHora").value = "";
  document.getElementById("campoMotivo").value = "";
  ocultarErrores();

  document.getElementById("campoDoctorDiv").style.display = "none";

  if (idDoctorPreseleccionado) {
    document.getElementById("campoDoctor").value = idDoctorPreseleccionado;
    aplicarRestriccionHora(idDoctorPreseleccionado);

    // Mostrar nombre del doctor preseleccionado
    var doc = doctoresCargados.find(function (d) {
      return d.id_doctor == idDoctorPreseleccionado;
    });
    if (doc) {
      document.getElementById("doctorPreseleccionado").textContent =
        doc.nombre + (doc.especialidad ? " — " + doc.especialidad : "");
      document.getElementById("doctorPreseleccionadoDiv").style.display =
        "block";
    }
  } else {
    document.getElementById("campoDoctorDiv").style.display = "block";
    document.getElementById("doctorPreseleccionadoDiv").style.display = "none";
    document.getElementById("campoDoctor").value = "";
    document.getElementById("campoHora").removeAttribute("min");
    document.getElementById("campoHora").removeAttribute("max");
  }

  modalCita.show();
}

function abrirModalEditar(cita) {
  document.getElementById("tituloModal").innerHTML =
    "<i class='bi bi-pencil me-2'></i>Editar Cita";
  document.getElementById("citaId").value = cita.id_cita;
  document.getElementById("campoDoctor").value = cita.id_doctor;
  document.getElementById("campoDoctorDiv").style.display = "block";
  document.getElementById("doctorPreseleccionadoDiv").style.display = "none";
  document.getElementById("campoFecha").value = cita.fecha;
  document.getElementById("campoHora").value = cita.hora;
  document.getElementById("campoMotivo").value = cita.motivo || "";
  aplicarRestriccionHora(cita.id_doctor);
  ocultarErrores();
  modalCita.show();
}

function abrirModalEliminar(id_cita) {
  document.getElementById("idEliminar").value = id_cita;
  modalEliminar.show();
}

//CRUD 

function guardarCita() {
  var id_doctor = document.getElementById("campoDoctor").value;
  var fecha = document.getElementById("campoFecha").value;
  var hora = document.getElementById("campoHora").value;
  var motivo = document.getElementById("campoMotivo").value.trim();
  var idEditar = document.getElementById("citaId").value;

  ocultarErrores();
  var valido = true;

  if (id_doctor === "") {
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

  // Validar que la hora esté dentro del rango del doctor
  var horario = getHorarioDoctor(id_doctor);
  if (hora && horario && HORARIOS[horario]) {
    if (hora < HORARIOS[horario].inicio || hora > HORARIOS[horario].fin) {
      document.getElementById("errHora").textContent =
        "La hora debe estar dentro de la jornada del doctor (" + horario + ")*";
      document.getElementById("errHora").style.display = "block";
      valido = false;
    }
  }

  if (!valido) return;

  var datos = new FormData();
  datos.append("id_doctor", id_doctor);
  datos.append("fecha", fecha);
  datos.append("hora", hora);
  datos.append("motivo", motivo);

  if (idEditar === "") {
    datos.append("action", "store");
  } else {
    datos.append("action", "update");
    datos.append("id_cita", idEditar);
  }

  fetch("citas_api.php", { method: "POST", body: datos })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.response === "00") {
        modalCita.hide();
        cargarCitas();
      } else {
        mostrarError("Error al guardar la cita.");
      }
    })
    .catch(function () {
      mostrarError("Error de conexión.");
    });
}

function confirmarEliminar() {
  var id_cita = document.getElementById("idEliminar").value;
  var datos = new FormData();
  datos.append("action", "delete");
  datos.append("id_cita", id_cita);

  fetch("citas_api.php", { method: "POST", body: datos })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.response === "00") {
        modalEliminar.hide();
        cargarCitas();
      } else {
        mostrarError("Error al eliminar la cita.");
      }
    })
    .catch(function () {
      mostrarError("Error de conexión.");
    });
}

//UTILS 

function ocultarErrores() {
  document.getElementById("errDoctor").style.display = "none";
  document.getElementById("errFecha").style.display = "none";
  document.getElementById("errHora").style.display = "none";
  document.getElementById("errHora").textContent = "Campo obligatorio*";
}

function mostrarError(msg) {
  alert(msg);
}
