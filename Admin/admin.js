let idAEliminar = null;

document.addEventListener("DOMContentLoaded", function () {
    const form       = document.getElementById("form_admin_medicos");
    const confirmBtn = document.getElementById("confirmDeleteBtn");

    cargarMedicos();

    // Limpiar errores al escribir
    form.querySelectorAll("input, select").forEach(input => {
        input.addEventListener("input", function () {
            const errorDiv = document.getElementById("error" + input.id.replace("med", ""));
            if (errorDiv && input.value.trim() !== "") {
                errorDiv.style.display = "none";
            }
        });
    });

    // Enviar formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const campos = [
            { input: document.getElementById("medNombre"),       error: document.getElementById("errorNombre") },
            { input: document.getElementById("medEspecialidad"), error: document.getElementById("errorEspecialidad") },
            { input: document.getElementById("medCedula"),       error: document.getElementById("errorCedula") },
            { input: document.getElementById("medHorario"),      error: document.getElementById("errorHorario") }
        ];

        let esValido = true;
        campos.forEach(campo => {
            if (campo.input.value.trim() === "") {
                campo.error.style.display = "block";
                esValido = false;
            } else {
                campo.error.style.display = "none";
            }
        });

        if (!esValido) return;

        const body = new URLSearchParams({
            action:       "crearMedico",
            nombre:       document.getElementById("medNombre").value.trim(),
            especialidad: document.getElementById("medEspecialidad").value,
            cedula:       document.getElementById("medCedula").value.trim(),
            horario:      document.getElementById("medHorario").value
        });

        fetch("admin_api.php", { method: "POST", body })
            .then(r => r.json())
            .then(data => {
                if (data.response === "00") {
                    form.reset();
                    cargarMedicos();
                } else {
                    alert("Error al registrar el médico.");
                }
            });
    });

    // Confirmar eliminación
    confirmBtn.addEventListener("click", function () {
        if (idAEliminar === null) return;

        fetch("admin_api.php", {
            method: "POST",
            body: new URLSearchParams({ action: "eliminarMedico", id_doctor: idAEliminar })
        })
        .then(r => r.json())
        .then(data => {
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
            modalInstance.hide();

            if (data.response === "00") {
                cargarMedicos();
            } else {
                alert("Error al eliminar el médico.");
            }
            idAEliminar = null;
        });
    });
});

function cargarMedicos() {
    fetch("admin_api.php?action=getMedicos")
        .then(r => r.json())
        .then(data => {
            const lista   = document.getElementById("lista_medicos_admin");
            const medicos = data.medicos || [];

            if (medicos.length === 0) {
                lista.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-muted">No hay médicos registrados actualmente.</td></tr>`;
                return;
            }

            lista.innerHTML = medicos.map(med => `
                <tr>
                    <td class="fw-medium">${med.nombre}</td>
                    <td>${med.especialidad ?? '-'}</td>
                    <td><code>${med.cedula ?? '-'}</code></td>
                    <td><span class="badge bg-info text-dark">${med.horario ?? '-'}</span></td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarMed(${med.id_doctor})" title="Eliminar médico">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        });
}

window.eliminarMed = function (id) {
    idAEliminar = id;
    const modalElement = document.getElementById("deleteModal");
    let modalInstance  = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
};
