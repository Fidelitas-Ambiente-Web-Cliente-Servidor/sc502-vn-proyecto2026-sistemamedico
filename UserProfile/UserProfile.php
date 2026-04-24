<?php
session_start();

$conexion = mysqli_connect("db", "appuser", "apppass", "appdb");

if (!$conexion) {
    die("Error de conexión");
}

if (!isset($_SESSION['usuario'])) {
    header("Location: ../LoginRegistro/login.php");
    exit();
}

$identificacion = $_SESSION['usuario'];

$sql = "SELECT u.nombre_completo, u.fecha_nacimiento,
               c.correo,
               t.telefono
        FROM USUARIO_TB u
        LEFT JOIN CORREO_TB c ON u.identificacion = c.identificacion
        LEFT JOIN TELEFONO_TB t ON u.identificacion = t.identificacion
        WHERE u.identificacion = '$identificacion'";

$result = mysqli_query($conexion, $sql);
$usuario = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Perfil</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

<style>

:root {
  --azul-principal: rgb(0, 1, 189);
}


body {
  background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
  min-height: 100vh;
}


.navbar {
  background: #ffffff !important;
  border-bottom: 2px solid #bae6fd;
}

.card {
  border: none;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}

.titulo-perfil {
  color: var(--azul-principal);
  font-weight: 800;
}


.form-control {
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  transition: 0.2s;
}

.form-control:focus {
  border-color: var(--azul-principal);
  box-shadow: 0 0 0 0.25rem rgba(0,1,189,0.20);
}


.btn-primary {
  background: var(--azul-principal);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  padding: 10px;
}

.btn-primary:hover {
  background: rgb(0, 0, 150);
}


.bi {
  color: var(--azul-principal);
}


.form-label {
  font-weight: 600;
  color: #334155;
}

hr {
  border-color: #e0f2fe;
}

#mensaje_perfil {
  font-weight: 600;
}

</style>

</head>

<body>

<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg shadow-sm px-4">
  <div class="container-fluid">

    <div class="d-flex align-items-center">
      <i class="bi bi-person-circle fs-4 me-2"></i>
      <span class="fw-bold fs-5 titulo-perfil">Mi Perfil</span>
    </div>

    <div class="mx-auto">
      <span class="text-muted fw-semibold">
        Gestión de información personal
      </span>
    </div>

    <div class="d-flex gap-2">
      <a href="../Dashboard/dashboard.php" class="btn btn-outline-primary btn-sm">
        Dashboard
      </a>
      <a href="../LoginRegistro/logout.php" class="btn btn-outline-secondary btn-sm">
        Salir
      </a>
    </div>

  </div>
</nav>

<!-- FORM -->
<div class="container mt-5">

  <div class="row justify-content-center">

    <div class="col-md-6">

      <div class="card p-4">

        <h4 class="text-center mb-4 titulo-perfil">
          <i class="bi bi-person-gear me-2"></i>
          Editar Perfil
        </h4>

        <form id="formulario_perfil" action="actualizar_perfil.php" method="post">

          <div class="mb-3">
            <label class="form-label">Nombre completo</label>
            <input type="text" name="nombre" id="nombre" class="form-control"
            value="<?php echo $usuario['nombre_completo'] ?? ''; ?>">
          </div>

          <div class="mb-3">
            <label class="form-label">Correo</label>
            <input type="email" name="email" id="email" class="form-control"
            value="<?php echo $usuario['correo'] ?? ''; ?>">
          </div>

          <div class="mb-3">
            <label class="form-label">Teléfono</label>
            <input type="tel" name="telefono" id="telefono" class="form-control"
            value="<?php echo $usuario['telefono'] ?? ''; ?>">
          </div>

          <div class="mb-3">
            <label class="form-label">Fecha de nacimiento</label>
            <input type="date" name="fechaNacimiento" id="fechaNacimiento" class="form-control"
            value="<?php echo $usuario['fecha_nacimiento'] ?? ''; ?>">
          </div>

          <hr>

          <h6 class="text-muted mb-3">Cambiar contraseña (opcional)</h6>

          <div class="mb-3">
            <label class="form-label">Nueva contraseña</label>
            <input type="password" name="passwordNueva" id="passwordNueva" class="form-control">
          </div>

          <div class="mb-3">
            <label class="form-label">Confirmar contraseña</label>
            <input type="password" id="confirmarPassword" class="form-control">
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Guardar cambios
          </button>

          <p id="mensaje_perfil" class="text-center mt-3"></p>

          <?php if (isset($_GET['ok']) && $_GET['ok'] == 1): ?>
            <div class="alert alert-success text-center mt-3">
              Perfil actualizado correctamente
            </div>
          <?php endif; ?>

        </form>

      </div>

    </div>

  </div>

</div>

</body>
</html>