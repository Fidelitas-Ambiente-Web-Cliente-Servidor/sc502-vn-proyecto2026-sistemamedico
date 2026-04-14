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
  <link rel="stylesheet" href="./dashboard_styles.css">
  <script src="dashboard_scripts.js" defer></script>
</head>

<body>

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

  <div class="container-fluid mt-4 px-5">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-primary">Dashboard</h3>
      <span class="fw-semibold">Bienvenido, <?php echo htmlspecialchars($_SESSION['usuario']); ?></span>
    </div>

    <!-- Secciones -->
    <div class="row g-5">

      <!-- Agenda -->
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="text-primary mb-0">Agenda</h4>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary btn-sm" onclick="cargarCitasDashboard()" title="Refrescar">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
            <a href="../Agenda/agenda.html" class="btn btn-primary btn-sm">
              <i class="bi bi-plus-circle me-1"></i> Nueva Cita
            </a>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <ul class="list-group list-group-flush" id="listaCitasDashboard">
              <!-- citas renderizadas por JS -->
            </ul>
          </div>
          <div class="card-footer text-end bg-white border-0 pt-0">
            <a href="../Agenda/agenda.html" class="btn btn-outline-primary btn-sm">
              Ver toda la agenda <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>

    </div>

  </div>
</body>

</html>
