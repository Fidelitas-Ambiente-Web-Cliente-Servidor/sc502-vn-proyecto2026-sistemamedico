<?php

session_start();

if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autorizado"]);
    exit;
}

header('Content-Type: application/json');

require_once __DIR__ . '/../Config/Database.php';
require_once __DIR__ . '/../app/models/Cita.php';

$database = new Database();
$db = $database->connect();
$model = new Cita($db);

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {

    case 'getCitas':
        if ($_SESSION['rol'] == 1) {
            $result = $model->getAll();
        } else {
            $result = $model->getByUser($_SESSION['usuario']);
        }
        echo json_encode(["citas" => $result->fetch_all(MYSQLI_ASSOC)]);
        break;

    case 'getDoctores':
        $result = $model->getDoctores();
        echo json_encode(["doctores" => $result->fetch_all(MYSQLI_ASSOC)]);
        break;

    case 'store':
        $id_doctor = $_POST['id_doctor'];
        $fecha = $_POST['fecha'];
        $hora = $_POST['hora'];
        $motivo = $_POST['motivo'] ?? '';

        if ($id_doctor === 'nuevo') {
            $id_doctor = $model->crearDoctor($_POST['nombre_doctor']);
        }

        $ok = $model->create($_SESSION['usuario'], $id_doctor, $fecha, $hora, $motivo);
        echo json_encode(["response" => $ok ? "00" : "01"]);
        break;

    case 'update':
        $id_cita = $_POST['id_cita'];
        $id_doctor = $_POST['id_doctor'];
        $fecha = $_POST['fecha'];
        $hora = $_POST['hora'];
        $motivo = $_POST['motivo'] ?? '';
        $ok = $model->update($id_cita, $id_doctor, $fecha, $hora, $motivo);
        echo json_encode(["response" => $ok ? "00" : "01"]);
        break;

case 'delete':
        $id_cita = $_POST['id_cita'];
        $ok = $model->delete($id_cita);
        echo json_encode(["response" => $ok ? "00" : "01"]);
        break;

    case 'getDoctoresHorario':
        $result = $model->getDoctoresConHorario();
        echo json_encode(["doctores" => $result->fetch_all(MYSQLI_ASSOC)]);
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
}
