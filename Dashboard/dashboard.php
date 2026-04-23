<?php
session_start();
if (!isset($_SESSION['usuario'])) {
  header("Location: ../LoginRegistro/login.php");
  exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="./dashboard_styles.css">

  <script src="dashboard_scripts.js" defer></script>
</head>

<body>

<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
  <div class="container-fluid">

    <div class="d-flex align-items-center">
      <i class="bi bi-heart-pulse-fill text-primary fs-4 me-2"></i>
      <span class="fw-bold text-primary fs-5">MediControl</span>
    </div>

    <div class="mx-auto">
      <ul class="navbar-nav flex-row gap-4">
        <li class="nav-item">
          <a class="nav-link active text-primary" href="../Dashboard/dashboard.php">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-primary" href="../Agenda/agenda.html">Agenda</a>
        </li>
      </ul>
    </div>

    <div class="d-flex gap-2">
      <a href="../UserProfile/UserProfile.php" class="btn btn-primary btn-sm">Perfil</a>
      <a href="../LoginRegistro/logout.php" class="btn btn-outline-primary btn-sm">Salir</a>
    </div>

  </div>
</nav>

<!-- CONTENIDO -->
<div class="container-fluid mt-4 px-5">

  <!-- HEADER (SIN BOTÓN AGENDAR AQUÍ) -->
  <div class="mb-4">
    <h3 class="text-primary mb-1">Dashboard</h3>
    <span class="text-muted">
      Bienvenido, <?php echo htmlspecialchars($_SESSION['usuario']); ?>
    </span>
  </div>

  <!-- MIS CITAS -->
  <div class="card shadow-sm mb-4">

    <div class="card-header bg-white d-flex justify-content-between align-items-center">
      <h5 class="text-primary mb-0">Mis Citas</h5>

    </div>

    <div class="card-body p-0">
      <ul class="list-group list-group-flush" id="listaCitasDashboard"></ul>
    </div>

  </div>

  <!-- SECCIÓN INFERIOR -->
  <div class="row g-4">

    <!-- CITAS DISPONIBLES (ÚNICO LUGAR PARA AGENDAR) -->
    <div class="col-12 col-lg-6">

      <div class="card shadow-sm h-100">

        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 class="text-primary mb-0">Citas Disponibles</h5>

        </div>

        <div class="card-body p-0">
          <ul class="list-group list-group-flush" id="listaCitasDisponibles"></ul>
        </div>

      </div>

    </div>

    <!-- DOCTORES -->
    <div class="col-12 col-lg-6">

      <div class="card shadow-sm h-100">

        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 class="text-primary mb-0">Doctores</h5>

        </div>

        <div class="card-body p-0">
          <ul class="list-group list-group-flush" id="listaDoctores"></ul>
        </div>

      </div>

    </div>

  </div>

</div>


</body>

<!-- MODAL MOTIVO -->
<div class="modal fade" id="modalMotivo" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Motivo de la cita</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">

        <select id="motivoSelect" class="form-select">
          <option value="">Seleccione un motivo</option>
          <option value="Consulta general">Consulta general</option>
          <option value="Control">Control</option>
          <option value="Dolor">Dolor</option>
          <option value="Exámenes">Exámenes</option>
          <option value="Otro">Otro</option>
        </select>

      </div>

      <div class="modal-footer">
        <button class="btn btn-primary" onclick="confirmarCita()">Confirmar</button>
      </div>

    </div>
  </div>
</div>

</html>