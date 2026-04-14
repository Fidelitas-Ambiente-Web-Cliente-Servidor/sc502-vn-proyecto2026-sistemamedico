<?php
session_start();

// conexión
$conexion = mysqli_connect("db", "appuser", "apppass", "appdb");

if (!$conexion) {
    die("Error de conexión");
}

// validar sesión
if (!isset($_SESSION['usuario'])) {
    header("Location: ../LoginRegistro/login.php");
    exit();
}

$identificacion = $_SESSION['usuario'];

// consulta
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
</head>

<body>

<div class="container mt-5">
  <div class="col-md-6 mx-auto">
    <div class="card p-4 shadow">

      <h3 class="text-center mb-4">Perfil de Usuario</h3>

      <form id="formulario_perfil" action="actualizar_perfil.php" method="post">

        <div class="mb-3">
          <label>Nombre</label>
          <input type="text" name="nombre" id="nombre" class="form-control"
          value="<?php echo isset($usuario['nombre_completo']) ? $usuario['nombre_completo'] : ''; ?>">
        </div>

        <div class="mb-3">
          <label>Correo</label>
          <input type="email" name="email" id="email" class="form-control"
          value="<?php echo isset($usuario['correo']) ? $usuario['correo'] : ''; ?>">
        </div>

        <div class="mb-3">
          <label>Teléfono</label>
          <input type="tel" name="telefono" id="telefono" class="form-control"
          value="<?php echo isset($usuario['telefono']) ? $usuario['telefono'] : ''; ?>">
        </div>

        <div class="mb-3">
          <label>Nueva contraseña</label>
          <input type="password" name="passwordNueva" id="passwordNueva" class="form-control">
        </div>

        <div class="mb-3">
          <label>Confirmar contraseña</label>
          <input type="password" id="confirmarPassword" class="form-control">
        </div>

        <div class="mb-3">
          <label>Fecha nacimiento</label>
          <input type="date" name="fechaNacimiento" id="fechaNacimiento" class="form-control"
          value="<?php echo isset($usuario['fecha_nacimiento']) ? $usuario['fecha_nacimiento'] : ''; ?>">
        </div>

        <button class="btn btn-primary w-100">Guardar cambios</button>

                    <div class="text-center mt-3">
                <a href="../Dashboard/dashboard.php" class="btn btn-secondary">Ir al Dashboard</a>
        

        <p id="mensaje_perfil" class="mt-3 text-center"></p>

        <?php if (isset($_GET['ok']) && $_GET['ok'] == 1): ?>
            <p class="text-success text-center mt-3">Cambio realizado</p>
            </div>
        <?php endif; ?>

      </form>

    </div>
  </div>
</div>

<script src="UserProfilescript.js"></script>

</body>
</html>
