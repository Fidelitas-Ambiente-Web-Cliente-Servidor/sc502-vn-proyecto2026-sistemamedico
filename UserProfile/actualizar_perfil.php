<?php
session_start();

// conexión
$conexion = mysqli_connect("db", "appuser", "apppass", "appdb");

if (!$conexion) {
    die("Error de conexión");
}

// VALIDAR BIEN LA SESIÓN
if (!isset($_SESSION['usuario'])) {
    header("Location: ../LoginRegistro/login.php");
    exit();
}

$identificacion = $_SESSION['usuario'];

// datos
$nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
$email = mysqli_real_escape_string($conexion, $_POST['email']);
$telefono = mysqli_real_escape_string($conexion, $_POST['telefono']);
$fecha = $_POST['fechaNacimiento'];
$password = $_POST['passwordNueva'];

// usuario
mysqli_query($conexion, "UPDATE USUARIO_TB 
SET nombre_completo='$nombre',
    fecha_nacimiento='$fecha'
WHERE identificacion='$identificacion'");

// correo
mysqli_query($conexion, "DELETE FROM CORREO_TB WHERE identificacion='$identificacion'");

mysqli_query($conexion, "INSERT INTO CORREO_TB (identificacion, correo, id_estado)
VALUES ('$identificacion', '$email', 1)");

// telefono
mysqli_query($conexion, "DELETE FROM TELEFONO_TB WHERE identificacion='$identificacion'");

mysqli_query($conexion, "INSERT INTO TELEFONO_TB (identificacion, telefono, id_estado)
VALUES ('$identificacion', '$telefono', 1)");

// contraseña
if (!empty($password)) {
    $hash = password_hash($password, PASSWORD_DEFAULT);

    mysqli_query($conexion, "UPDATE USUARIO_TB 
    SET contrasena='$hash'
    WHERE identificacion='$identificacion'");
}

header("Location: UserProfile.php?ok=1");
exit();
?>
