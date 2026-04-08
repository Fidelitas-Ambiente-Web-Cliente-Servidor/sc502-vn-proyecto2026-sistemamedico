<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: ../LoginRegistro/login.php");
    exit;
}
if ($_SESSION['rol'] != 1) {
    header("Location: ../Dashboard/dashboard.php");
    exit;
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin - Gestión de Médicos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="admin.css" />
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <div class="container-fluid">
        <div class="d-flex align-items-center">
          <i class="bi bi-heart-pulse-fill text-primary fs-4 me-2"></i>
          <span class="fw-bold text-primary fs-5">MediControl Admin</span>
        </div>
        <div class="mx-auto">
          <ul class="navbar-nav flex-row gap-4">
            <li class="nav-item">
              <a class="nav-link active fw-bold text-primary" href="#">Gestión Médicos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-primary" href="../Dashboard/dashboard.php">Ir al Dashboard</a>
            </li>
          </ul>
        </div>
        <div class="d-flex gap-2">
          <a href="../LoginRegistro/logout.php" class="btn btn-outline-primary btn-sm">Salir</a>
        </div>
      </div>
    </nav>

    <div class="container-fluid mt-5 px-5">
      <div class="row">
        <div class="col-md-4">
          <div class="card shadow p-4 border-0">
            <h4 class="text-primary mb-4 text-center">
              <i class="bi bi-person-plus-fill me-2"></i>Nuevo Médico
            </h4>
            <form id="form_admin_medicos" novalidate>
              <div class="mb-3">
                <label for="medNombre" class="form-label">Nombre del Doctor</label>
                <input type="text" class="form-control" id="medNombre" placeholder="Nombre completo" />
                <div id="errorNombre" class="error-msg">Este campo es obligatorio.</div>
              </div>

              <div class="mb-3">
                <label for="medEspecialidad" class="form-label">Especialidad</label>
                <select class="form-select" id="medEspecialidad">
                  <option value="" selected disabled>Seleccione...</option>
                  <option value="Medicina General">Medicina General</option>
                  <option value="Odontología">Odontología</option>
                  <option value="Pediatría">Pediatría</option>
                </select>
                <div id="errorEspecialidad" class="error-msg">Seleccione una especialidad.</div>
              </div>

              <div class="mb-3">
                <label for="medCedula" class="form-label">Cédula Profesional</label>
                <input type="text" class="form-control" id="medCedula" placeholder="Número de cédula" />
                <div id="errorCedula" class="error-msg">La cédula es obligatoria.</div>
              </div>

              <div class="mb-3">
                <label for="medHorario" class="form-label">Jornada Laboral</label>
                <select class="form-select" id="medHorario">
                  <option value="" selected disabled>Seleccione jornada...</option>
                  <option value="Mañana (07:00 - 13:00)">Mañana (07:00 - 13:00)</option>
                  <option value="Tarde (13:00 - 19:00)">Tarde (13:00 - 19:00)</option>
                  <option value="Noche (19:00 - 01:00)">Noche (19:00 - 01:00)</option>
                </select>
                <div id="errorHorario" class="error-msg">Seleccione una jornada.</div>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-check-circle me-2"></i>Registrar Médico
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card shadow border-0">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-primary">
                    <tr>
                      <th>Nombre</th>
                      <th>Especialidad</th>
                      <th>Cédula</th>
                      <th>Horario</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="lista_medicos_admin"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deleteModalLabel">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center p-4">
            <p class="fs-5">¿Estás seguro de que deseas eliminar a este médico?</p>
            <p class="text-muted small">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer justify-content-center border-0">
            <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" id="confirmDeleteBtn" class="btn btn-danger px-4">Eliminar definitivamente</button>
          </div>
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="admin.js"></script>
  </body>
</html>
