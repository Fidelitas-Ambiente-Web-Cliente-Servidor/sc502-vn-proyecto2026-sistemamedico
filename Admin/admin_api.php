<?php
session_start();

if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != 1) {
    http_response_code(401);
    echo json_encode(["error" => "No autorizado"]);
    exit;
}

header('Content-Type: application/json');

require_once __DIR__ . '/../Config/Database.php';
require_once __DIR__ . '/../app/models/Cita.php';

$database = new Database();
$db       = $database->connect();
$model    = new Cita($db);

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {

    case 'getMedicos':
        $result = $model->getMedicos();
        echo json_encode(["medicos" => $result->fetch_all(MYSQLI_ASSOC)]);
        break;

    case 'crearMedico':
        $nombre       = $_POST['nombre']       ?? '';
        $especialidad = $_POST['especialidad'] ?? '';
        $cedula       = $_POST['cedula']       ?? '';
        $horario      = $_POST['horario']      ?? '';

        $ok = $model->crearMedicoCompleto($nombre, $especialidad, $cedula, $horario);
        echo json_encode(["response" => $ok ? "00" : "01"]);
        break;

    case 'eliminarMedico':
        $id_doctor = (int)($_POST['id_doctor'] ?? 0);
        $ok = $model->eliminarMedico($id_doctor);
        echo json_encode(["response" => $ok ? "00" : "01"]);
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
}
