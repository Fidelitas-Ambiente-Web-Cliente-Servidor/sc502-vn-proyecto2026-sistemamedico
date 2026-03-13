document.addEventListener("DOMContentLoaded", function () {
  cargarCitasDashboard();
});

function cargarCitasDashboard() {
  var citas = JSON.parse(localStorage.getItem("citas")) || [];
  var lista = document.getElementById("listaCitasDashboard");

  lista.innerHTML = "";

  if (citas.length === 0) {
    lista.innerHTML =
      "<li class='list-group-item text-center text-secondary py-4'>" +
        "<i class='bi bi-calendar-x fs-4 d-block mb-1'></i>" +
        "No hay citas registradas." +
      "</li>";
    return;
  }

  // Mostrar máximo 5 citas
  var limite = Math.min(citas.length, 5);

  for (var i = 0; i < limite; i++) {
    var cita = citas[i];
    var partes = cita.fecha.split("-");
    var fechaFormateada = partes[2] + "/" + partes[1] + "/" + partes[0];

    var item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML =
      "<div>" +
        "<i class='bi bi-calendar2-check text-primary me-2'></i>" +
        "<strong>" + cita.paciente + "</strong>" +
        "<span class='text-muted ms-2'>— " + cita.doctor + "</span>" +
        "<br><small class='text-muted ms-4'>" + fechaFormateada + " &nbsp; " + cita.hora + "</small>" +
      "</div>" +
      "<div class='d-flex gap-1'>" +
        "<a href='../Agenda/agenda.html' class='btn btn-sm btn-outline-primary' title='Editar'>" +
          "<i class='bi bi-pencil'></i>" +
        "</a>" +
        "<a href='../Agenda/agenda.html' class='btn btn-sm btn-outline-danger' title='Eliminar'>" +
          "<i class='bi bi-trash'></i>" +
        "</a>" +
      "</div>";

    lista.appendChild(item);
  }
}
