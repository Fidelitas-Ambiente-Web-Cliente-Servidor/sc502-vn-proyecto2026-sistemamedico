document.addEventListener("DOMContentLoaded", function () {
    cargarCitasDashboard();
    cargarDoctores();
    cargarCitasDisponibles();
});

//CARGAR CITAS DEL USUARIO EN EL DASHBOARD

function cargarCitasDashboard() {
    fetch("../Agenda/citas_api.php?action=getCitas")
        .then(res => res.text()) 
        .then(text => {
            console.log("CITAS DASHBOARD RAW:", text);
            return JSON.parse(text);
        })
        .then(data => renderizarCitas(data.citas))
        .catch(err => {
            console.log("ERROR DASHBOARD:", err);
            mostrarVacio();
        });
}

//RENDERIZAR CITAS EN EL DASHBOARD

function renderizarCitas(citas) {
  const lista = document.getElementById("listaCitasDashboard");
  lista.innerHTML = "";

  if (!citas || citas.length === 0) {
    lista.innerHTML = `
      <li class="list-group-item text-center text-muted py-4">
        No tienes citas agendadas
      </li>`;
    return;
  }

  let html = `
  <table class="table table-sm table-striped">
    <thead>
      <tr>
        <th>Doctor</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Motivo</th>
      </tr>
    </thead>
    <tbody>
  `;

  citas.forEach(cita => {
    html += `
      <tr>
        <td>${cita.doctor}</td>
        <td>${cita.fecha}</td>
        <td>${cita.hora ? cita.hora.substring(0,5) : ""}</td>
        <td>${cita.motivo || ""}</td>
        <td>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  lista.innerHTML = html;
}



function mostrarVacio() {
    document.getElementById("listaCitasDashboard").innerHTML =
        `<li class="list-group-item text-center text-muted py-4">
            <i class="bi bi-calendar-x fs-4 d-block mb-1"></i>
            No tienes citas agendadas
        </li>`;
}


//GUARDAR NUEVA CITA DESDE EL ADMIN

function cargarDoctores() {
    fetch("../Agenda/citas_api.php?action=getDoctoresHorario")
        .then(res => res.text()) 
        .then(text => {
            console.log("DOCTORES RAW:", text);
            return JSON.parse(text);
        })
        .then(data => renderizarDoctores(data.doctores))
        .catch(err => {
            console.log("ERROR DOCTORES:", err);
            document.getElementById("listaDoctores").innerHTML =
                `<li class="list-group-item text-center text-danger">
                    Error cargando doctores
                </li>`;
        });
}

//DOCTORES EN EL DASHBOARD


function renderizarDoctores(doctores) {
    const lista = document.getElementById("listaDoctores");
    lista.innerHTML = "";

    if (!doctores || doctores.length === 0) {
        lista.innerHTML =
            `<li class="list-group-item text-center text-muted py-4">
                No hay doctores disponibles
            </li>`;
        return;
    }

    doctores.forEach(doc => {
        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${doc.nombre}</strong>
                    <span class="badge bg-primary ms-2">${doc.especialidad || ''}</span><br>
                    <small class="text-muted">${doc.horario || ''}</small>
                </div>
                <a class="btn btn-sm btn-outline-primary"
                   href="../Agenda/agenda.html?id_doctor=${doc.id_doctor}">
                   Agendar
                </a>
            </li>`;
    });
}


//CARGAR CITAS DISPONIBLES EN EL DASHBOARD

function cargarCitasDisponibles() {
    fetch("../Agenda/citas_api.php?action=getDisponibles")
        .then(res => res.text()) 
        .then(text => {
            console.log("DISPONIBLES RAW:", text);
            return JSON.parse(text);
        })
        .then(data => renderizarCitasDisponibles(data.citas))
        .catch(err => {
            console.log("ERROR DISPONIBLES:", err);
            mostrarErrorDisponibles();
        });
}

function renderizarCitasDisponibles(citas) {
    const lista = document.getElementById("listaCitasDisponibles");
    lista.innerHTML = "";

    if (!citas || citas.length === 0) {
        lista.innerHTML = `
            <li class="list-group-item text-center text-muted py-4">
                <i class="bi bi-calendar-x fs-4 d-block mb-1"></i>
                No hay citas disponibles
            </li>`;
        return;
    }

    citas.forEach(cita => {
        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${cita.nombre_doctor}</strong><br>
                    <small class="text-muted">
                        ${cita.especialidad} - ${cita.fecha} ${cita.hora}
                    </small>
                </div>

                <button class="btn btn-sm btn-primary"
                    onclick="reservarCita(${cita.id_cita})">
                    Agendar
                </button>
            </li>`;
    });
}


//ERRORES

function mostrarErrorDisponibles() {
    document.getElementById("listaCitasDisponibles").innerHTML =
        `<li class="list-group-item text-center text-danger">
            Error cargando citas disponibles
        </li>`;
}

let citaSeleccionada = null;

function reservarCita(id) {
    citaSeleccionada = id;

    let modal = new bootstrap.Modal(document.getElementById('modalMotivo'));
    modal.show();
}

function confirmarCita() {

    let motivo = document.getElementById("motivoSelect").value;

    if (!motivo) {
        alert("Seleccione un motivo");
        return;
    }

    const datos = new FormData();
    datos.append("action", "reservar");
    datos.append("id_cita", citaSeleccionada);
    datos.append("motivo", motivo);

    fetch("../Agenda/citas_api.php", {
        method: "POST",
        body: datos
    })
    .then(res => res.text()) 
    .then(text => {
        console.log("RESERVA RAW:", text);
        return JSON.parse(text);
    })
    .then(data => {

        if (data.response === "00") {
            alert("Cita agendada correctamente");

            bootstrap.Modal.getInstance(
                document.getElementById('modalMotivo')
            ).hide();

            cargarCitasDashboard();
            cargarCitasDisponibles();
        } else {
            alert("No se pudo agendar la cita");
        }
    });
}