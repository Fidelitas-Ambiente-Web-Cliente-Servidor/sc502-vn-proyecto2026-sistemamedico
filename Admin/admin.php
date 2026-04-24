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
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Gestión de Citas</title>

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
                    <a class="nav-link active fw-bold text-primary" href="#">
                        Gestión de Citas
                    </a>
                </li>

            </ul>
        </div>

        <div class="d-flex gap-2">
            <a href="../LoginRegistro/logout.php" class="btn btn-outline-primary btn-sm">
                Salir
            </a>
        </div>

    </div>
</nav>

<div class="container-fluid mt-5 px-5">
    <div class="row">

        <!-- FORM -->
        <div class="col-md-4">
            <div class="card shadow p-4 border-0">

                <h4 class="text-primary mb-4 text-center">
                    <i class="bi bi-calendar-plus me-2"></i>
                    Nueva Cita Disponible
                </h4>

                <form id="form_admin_citas" onsubmit="event.preventDefault(); guardarCitaAdmin();">

                    <!-- NOMBRE DOCTOR -->
                    <div class="mb-3">
                        <label class="form-label">Nombre del Doctor</label>
                        <input
                            type="text"
                            class="form-control"
                            id="nombreDoctor"
                            required
                        >
                    </div>

                    <!-- ESPECIALIDAD -->
                    <div class="mb-3">
                    <select class="form-select" id="especialidad" required>
                        <option value="" selected disabled>Seleccione...</option>
                        <option>Medicina General</option>
                        <option>Odontología</option>
                        <option>Pediatría</option>
                        <option>Cardiología</option>
                        <option>Dermatología</option>
                        <option>Ginecología</option>
                        <option>Neurología</option>
                        <option>Oftalmología</option>
                    </select>                   
                    </div>


                    <!-- LICENCIA MÉDICA -->
                    <div class="mb-3">
                        <label class="form-label">Licencia Médica</label>
                        <input
                            type="text"
                            class="form-control"
                            id="licenciaMedica"
                            required
                        >
                    </div>

                    <!-- FECHA -->
                    <div class="mb-3">
                        <label class="form-label">Fecha</label>
                        <input
                            type="date"
                            class="form-control"
                            id="fecha"
                            required
                        >
                    </div>

                    <!-- HORA -->
                    <div class="mb-3">
                        <label class="form-label">Hora</label>
                        <input
                            type="time"
                            class="form-control"
                            id="hora"
                            required
                        >
                    </div>

                    <!-- BOTON -->
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle me-2"></i>
                            Guardar Cita
                        </button>
                    </div>

                </form>
            </div>
        </div>

        <!-- TABLA -->
        <div class="col-md-8">
            <div class="card shadow border-0">
                <div class="card-body p-0">

                    <div class="table-responsive">
                        <table class="table table-hover mb-0">

                            <thead class="table-primary">
                            <tr>
                                <th>Paciente</th>
                                <th>Doctor</th>
                                <th>Especialidad</th>
                                <th>Licencia Médica</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody id="lista_medicos_admin">
                        </tbody>

                        </table>
                    </div>

                </div>
            </div>
        </div>

    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="admin.js"></script>


<!-- MODAL EDITAR CITA -->
<div class="modal fade" id="modalEditarCita" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content p-3">

      <h5 class="text-primary mb-3">Editar Cita</h5>

      <input type="hidden" id="edit_id_cita">

      <div class="mb-3">
        <label>Nombre del Doctor</label>
        <input type="text" id="edit_nombreDoctor" class="form-control">
      </div>

      <div class="mb-3">
        <label>Especialidad</label>
        <select id="edit_especialidad" class="form-select">
          <option>Medicina General</option>
          <option>Odontología</option>
          <option>Pediatría</option>
          <option>Cardiología</option>
          <option>Dermatología</option>
          <option>Ginecología</option>
          <option>Neurología</option>
          <option>Oftalmología</option>
        </select>
      </div>

      <div class="mb-3">
        <label>Licencia Médica</label>
        <input type="text" id="edit_licencia" class="form-control">
      </div>

      <div class="mb-3">
        <label>Fecha</label>
        <input type="date" id="edit_fecha" class="form-control">
      </div>

      <div class="mb-3">
        <label>Hora</label>
        <input type="time" id="edit_hora" class="form-control">
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-primary w-100" onclick="actualizarCita()">
          Guardar cambios
        </button>
      </div>

    </div>
  </div>
</div>

</body>
</html>