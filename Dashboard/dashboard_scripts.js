document.addEventListener("DOMContentLoaded", function () {
    cargarCitasDashboard();
    cargarDoctores();
});

// CITAS
function cargarCitasDashboard() {
    fetch("../Agenda/citas_api.php?action=getCitas")
        .then(function (res) { return res.json(); })
        .then(function (data) { renderizarCitas(data.citas); })
        .catch(function () { mostrarVacio(); });
}

function renderizarCitas(citas) {
    var lista = document.getElementById("listaCitasDashboard");
    lista.innerHTML = "";

    if (!citas || citas.length === 0) {
        mostrarVacio();
        return;
    }

    var limite = Math.min(citas.length, 5);
    for (var i = 0; i < limite; i++) {
        var cita   = citas[i];
        var partes = cita.fecha.split("-");
        var fechaFormateada = partes[2] + "/" + partes[1] + "/" + partes[0];
        var hora   = cita.hora ? cita.hora.substring(0, 5) : "";

        var item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML =
            "<div>" +
                "<i class='bi bi-calendar2-check text-primary me-2'></i>" +
                "<strong>" + cita.paciente + "</strong>" +
                "<span class='text-muted ms-2'>— " + cita.doctor + "</span>" +
                "<br><small class='text-muted ms-4'>" + fechaFormateada + " &nbsp; " + hora + "</small>" +
            "</div>" +
            "<div class='d-flex gap-1'>" +
                "<a href='../Agenda/agenda.html' class='btn btn-sm btn-outline-primary' title='Ver agenda'>" +
                    "<i class='bi bi-pencil'></i>" +
                "</a>" +
            "</div>";
        lista.appendChild(item);
    }
}

function mostrarVacio() {
    var lista = document.getElementById("listaCitasDashboard");
    lista.innerHTML =
        "<li class='list-group-item text-center text-secondary py-4'>" +
            "<i class='bi bi-calendar-x fs-4 d-block mb-1'></i>" +
            "No hay citas registradas." +
        "</li>";
}

//DOCTORES CON HORARIO 
function cargarDoctores() {
    fetch("../Agenda/citas_api.php?action=getDoctoresHorario")
        .then(function (res) { return res.json(); })
        .then(function (data) { renderizarDoctores(data.doctores); })
        .catch(function () {
            document.getElementById("listaDoctores").innerHTML =
                "<li class='list-group-item text-center text-secondary py-3'>Error al cargar doctores.</li>";
        });
}

function renderizarDoctores(doctores) {
    var lista = document.getElementById("listaDoctores");
    lista.innerHTML = "";

    if (!doctores || doctores.length === 0) {
        lista.innerHTML =
            "<li class='list-group-item text-center text-secondary py-4'>" +
                "<i class='bi bi-person-x fs-4 d-block mb-1'></i>" +
                "No hay doctores disponibles." +
            "</li>";
        return;
    }

    doctores.forEach(function (doc) {
        var item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML =
            "<div>" +
                "<i class='bi bi-person-badge text-primary me-2'></i>" +
                "<strong>" + doc.nombre + "</strong>" +
                "<span class='badge bg-primary ms-2'>" + doc.especialidad + "</span>" +
                "<br><small class='text-muted ms-4'><i class='bi bi-clock me-1'></i>" + (doc.horario || "Sin horario") + "</small>" +
            "</div>" +
            "<a href='../Agenda/agenda.html?id_doctor=" + doc.id_doctor + "' class='btn btn-sm btn-outline-primary'>" +
                "<i class='bi bi-plus-circle me-1'></i>Agendar" +
            "</a>";
        lista.appendChild(item);
    });
}
