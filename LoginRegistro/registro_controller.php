<?php
// Configuración de la conexión a la base de datos
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

// Datos del formulario 
$nombre = $_POST["nombre"];
$email = $_POST["email"];
$contrasena = $_POST["contraseña"];
$numero = $_POST["numero"];
$fecha = $_POST["fechaNacimiento"];

// Rol cliente
$id_tipo_usuario = 2;
$id_estado = 1;

// Verificar si el correo ya existe
$stmt = $conn->prepare("SELECT * FROM CORREO_TB WHERE correo = :correo");
$stmt->execute(['correo' => $email]);

if ($stmt->fetch()) {
    header("Location: registro.html?error=exists");
    exit();
}

// Encriptar contraseña
$hash = password_hash($contrasena, PASSWORD_BCRYPT);

$conn->beginTransaction();

try {

    // Insertar en usuario
    $stmt = $conn->prepare("
        INSERT INTO USUARIO_TB 
        (identificacion, nombre_completo, contrasena, fecha_nacimiento, id_tipo_usuario, id_estado)
        VALUES (:id, :nombre, :contrasena, :fecha, :tipo, :estado)
    ");

    $stmt->execute([
        'id' => $email,
        'nombre' => $nombre,
        'contrasena' => $hash,
        'fecha' => $fecha,
        'tipo' => $id_tipo_usuario,
        'estado' => $id_estado
    ]);

    // Insertar correo
    $stmt = $conn->prepare("
        INSERT INTO CORREO_TB (identificacion, correo, id_estado)
        VALUES (:id, :correo, :estado)
    ");

    $stmt->execute([
        'id' => $email,
        'correo' => $email,
        'estado' => $id_estado
    ]);

    // Insertar teléfono
    $stmt = $conn->prepare("
        INSERT INTO TELEFONO_TB (identificacion, telefono, id_estado)
        VALUES (:id, :telefono, :estado)
    ");

    $stmt->execute([
        'id' => $email,
        'telefono' => $numero,
        'estado' => $id_estado
    ]);

    // Confirmar todo
    $conn->commit();

    header("Location: login.php?registro=ok");
    exit();

} catch (Exception $e) {
    $conn->rollBack();
    echo "Error al registrar: " . $e->getMessage();
}
?>