document.addEventListener("DOMContentLoaded", function () {
  cargarCitasAdmin();
  cargarCitasDisponibles();
});

//GUARDAR NUEVA CITA DESDE EL ADMIN

function guardarCitaAdmin() {
  const datos = new FormData();

  datos.append("action", "crearCita");
  datos.append("nombre_doctor", document.getElementById("nombreDoctor").value);
  datos.append("especialidad", document.getElementById("especialidad").value);
  datos.append("licencia_medica", document.getElementById("licenciaMedica").value);
  datos.append("fecha", document.getElementById("fecha").value);
  datos.append("hora", document.getElementById("hora").value);

  fetch("admin_api.php", {
    method: "POST",
    body: datos
  })
  .then(res => res.json())
  .then(data => {
    if (data.response === "00") {
      alert("Cita creada correctamente");
      location.reload();
    } else {
      alert("Error al guardar");
    }
  });
}

//CARGAR CITAS EN EL ADMIN, EDITAR, ELIMINAR, LIBERAR Y RESERVAR

function cargarCitasAdmin() {
  fetch("admin_api.php?action=getCitas")
  .then(res => res.json())
  .then(data => {

    let tbody = document.getElementById("lista_medicos_admin");
    tbody.innerHTML = "";

    if (!data.citas || data.citas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">
            No hay citas registradas
          </td>
        </tr>
      `;
      return;
    }

    data.citas.forEach(cita => {

      tbody.innerHTML += `
        <tr>
          <td>${cita.nombre_doctor}</td>
          <td>${cita.especialidad}</td>
          <td>${cita.licencia_medica || '-'}</td>
          <td>${cita.fecha}</td>
          <td>${cita.hora}</td>
          <td class="text-center">

            <!-- BOTÓN EDITAR (CORREGIDO) -->
            <button class="btn btn-sm btn-primary me-2"
              onclick="editarCita(
                ${cita.id_cita},
                \`${cita.nombre_doctor}\`,
                \`${cita.especialidad}\`,
                \`${cita.licencia_medica || ''}\`,
                \`${cita.fecha}\`,
                \`${cita.hora}\`
              )">
              <i class="bi bi-pencil"></i>
            </button>

            <button class="btn btn-sm btn-danger"
              onclick="eliminarCita(${cita.id_cita})">
              <i class="bi bi-trash"></i>
            </button>

          </td>
        </tr>
      `;
    });

  });
}

function editarCita(id, doctor, especialidad, licencia, fecha, hora) {

  document.getElementById("edit_id_cita").value = id;
  document.getElementById("edit_nombreDoctor").value = doctor;
  document.getElementById("edit_especialidad").value = especialidad;
  document.getElementById("edit_licencia").value = licencia;
  document.getElementById("edit_fecha").value = fecha;
  document.getElementById("edit_hora").value = hora;

  let modal = new bootstrap.Modal(document.getElementById('modalEditarCita'));
  modal.show();
}

function actualizarCita() {

  const datos = new FormData();

  datos.append("action", "update");
  datos.append("id_cita", document.getElementById("edit_id_cita").value);
  datos.append("nombre_doctor", document.getElementById("edit_nombreDoctor").value);
  datos.append("especialidad", document.getElementById("edit_especialidad").value);
  datos.append("licencia_medica", document.getElementById("edit_licencia").value);
  datos.append("fecha", document.getElementById("edit_fecha").value);
  datos.append("hora", document.getElementById("edit_hora").value);

  fetch("admin_api.php", {
    method: "POST",
    body: datos
  })
  .then(res => res.json())
  .then(data => {

    if (data.response === "00") {
      alert("Cita actualizada correctamente");

      bootstrap.Modal.getInstance(
        document.getElementById('modalEditarCita')
      ).hide();

      cargarCitasAdmin();
    } else {
      alert("Error al actualizar");
    }
  });
}

function eliminarCita(id) {

  if (!confirm("¿Seguro que quieres eliminar esta cita?")) return;

  const datos = new FormData();
  datos.append("action", "delete");
  datos.append("id_cita", id);

  fetch("admin_api.php", {
    method: "POST",
    body: datos
  })
  .then(res => res.json())
  .then(data => {
    if (data.response === "00") {
      alert("Cita eliminada");
      cargarCitasAdmin();
    } else {
      alert("Error al eliminar");
    }
  });
}


function liberarCita(id) {

  const datos = new FormData();
  datos.append("action", "liberar");
  datos.append("id_cita", id);

  fetch("admin_api.php", {
    method: "POST",
    body: datos
  })
  .then(res => res.json())
  .then(data => {
    if (data.response === "00") {
      alert("Cita liberada correctamente");
      cargarCitasAdmin();
      cargarCitasDisponibles();
    } else {
      alert("Error al liberar");
    }
  });
}

function cargarCitasDisponibles() {
  fetch("admin_api.php?action=getDisponibles")
    .then(res => res.json())
    .then(data => {

      let lista = document.getElementById("listaCitasDisponibles");
      lista.innerHTML = "";

      if (!data.citas || data.citas.length === 0) {
        lista.innerHTML = `
          <li class="list-group-item text-center text-muted">
            No hay citas disponibles
          </li>
        `;
        return;
      }

      data.citas.forEach(cita => {
        lista.innerHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            
            <div>
              <strong>${cita.nombre_doctor}</strong><br>
              <small class="text-muted">
                ${cita.especialidad} - ${cita.fecha} ${cita.hora}
              </small>
            </div>

            <button class="btn btn-primary btn-sm"
              onclick="reservarCita(${cita.id_cita})">
              Agendar
            </button>

          </li>
        `;
      });

    });
}

function reservarCita(id) {

  const datos = new FormData();
  datos.append("action", "reservar");
  datos.append("id_cita", id);
  datos.append("motivo", "Consulta general");

  fetch("admin_api.php", {
    method: "POST",
    body: datos
  })
  .then(res => res.json())
  .then(data => {

    if (data.response === "00") {
      alert("Cita agendada correctamente");
      cargarCitasDisponibles();
    } else {
      alert("No se pudo agendar la cita");
    }

  });
}