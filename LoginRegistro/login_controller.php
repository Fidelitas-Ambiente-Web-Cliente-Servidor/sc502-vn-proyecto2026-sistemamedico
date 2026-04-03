<?php

session_start();

$host = "db";
$dbname = "appdb";
$username = "appuser";
$password = "apppass";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

$correo = $_POST["correo"];
$contrasena = $_POST["contrasena"];

if ($correo === '' || $contrasena === '') {
    header("Location: login.php?error=campos");
    exit();
}

$stmt = $conn->prepare("
    SELECT U.identificacion, U.contrasena, U.id_tipo_usuario
    FROM USUARIO_TB U
    JOIN CORREO_TB C ON U.identificacion = C.identificacion
    WHERE C.correo = :correo
");

$stmt->execute(['correo' => $correo]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// validar
if ($user && password_verify($contrasena, $user["contrasena"])) {

    // sesión
    $_SESSION["usuario"] = $user["identificacion"];
    $_SESSION["rol"] = $user["id_tipo_usuario"];

// redirección por rol
if ($user["id_tipo_usuario"] == 1) {
    header("Location: http://localhost:8080/sc502-vn-proyecto2026-sistemamedico/Admin/admin.html"); // admin
} else {
    header("Location: http://localhost:8080/sc502-vn-proyecto2026-sistemamedico/Dashboard/dashboard.html"); // usuario normal
}


    exit();

} else {
    header("Location: login.php?error=login");
    exit();
}

?>