let indexAEliminar = null;

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form_admin_medicos");
    const confirmBtn = document.getElementById("confirmDeleteBtn");

    renderizarMedicos();

    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("input", function () {
            const errorDiv = document.getElementById("error" + input.id.replace("med", ""));
            if (input.value.trim() !== "") {
                if (errorDiv) errorDiv.style.display = "none";
            }
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const campos = [
            { input: document.getElementById("medNombre"), error: document.getElementById("errorNombre") },
            { input: document.getElementById("medEspecialidad"), error: document.getElementById("errorEspecialidad") },
            { input: document.getElementById("medCedula"), error: document.getElementById("errorCedula") },
            { input: document.getElementById("medHorario"), error: document.getElementById("errorHorario") }
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

        const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
        medicos.push({
            nombre: document.getElementById("medNombre").value.trim(),
            especialidad: document.getElementById("medEspecialidad").value,
            cedula: document.getElementById("medCedula").value.trim(),
            horario: document.getElementById("medHorario").value
        });

        localStorage.setItem("medicos", JSON.stringify(medicos));
        
        form.reset();
        renderizarMedicos();
    });

    confirmBtn.addEventListener("click", function () {
        if (indexAEliminar !== null) {
            let medicos = JSON.parse(localStorage.getItem("medicos")) || [];
            medicos.splice(indexAEliminar, 1);
            localStorage.setItem("medicos", JSON.stringify(medicos));

            const modalElement = document.getElementById('deleteModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            renderizarMedicos();
            indexAEliminar = null;
        }
    });
});

window.eliminarMed = function (index) {
    indexAEliminar = index;
    const modalElement = document.getElementById('deleteModal');
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
    }
    modalInstance.show();
};

function renderizarMedicos() {
    const lista = document.getElementById("lista_medicos_admin");
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    
    lista.innerHTML = "";

    if (medicos.length === 0) {
        lista.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-muted">No hay médicos registrados actualmente.</td></tr>`;
        return;
    }

    medicos.forEach((med, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="fw-medium">${med.nombre}</td>
            <td>${med.especialidad}</td>
            <td><code>${med.cedula}</code></td>
            <td><span class="badge bg-info text-dark">${med.horario}</span></td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarMed(${index})" title="Eliminar médico">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        lista.appendChild(fila);
    });
}