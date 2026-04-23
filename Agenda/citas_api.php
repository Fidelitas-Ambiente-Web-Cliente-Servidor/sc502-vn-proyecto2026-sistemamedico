<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../Config/Database.php';
require_once __DIR__ . '/../app/models/Cita.php';

$db = (new Database())->connect();
$model = new Cita($db);

$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {


    // CITAS DISPONIBLES
   
    if ($action == 'getDisponibles') {

        $result = $model->getCitasDisponibles();

        echo json_encode([
            "citas" => $result->fetch_all(MYSQLI_ASSOC)
        ]);
        exit;
    }

    // RESERVAR CITA

    if ($action == 'reservar') {

        $ok = $model->reservarCita(
            $_SESSION['usuario'],
            $_POST['id_cita'],
            $_POST['motivo'] ?? ''
        );

        echo json_encode(["response" => $ok ? "00" : "01"]);
        exit;
    }


    // MIS CITAS

    if ($action == 'getCitas') {

        $result = $model->getCitasPorUsuario($_SESSION['usuario']);

        echo json_encode([
            "citas" => $result->fetch_all(MYSQLI_ASSOC)
        ]);
        exit;
    }

   
    // CREAR CITA (ADMIN)

    if ($action == 'crearCita') {

        $ok = $model->createCita(
            $_POST['nombre_doctor'],
            $_POST['especialidad'],
            $_POST['licencia_medica'],
            $_POST['fecha'],
            $_POST['hora']
        );

        echo json_encode(["response" => $ok ? "00" : "01"]);
        exit;
    }

   
    // LIBERAR CITA (USUARIO)

   if ($action == 'liberar') {

    $ok = $model->liberarCita(
        $_POST['id_cita'],
        $_SESSION['usuario']
    );

    echo json_encode(["response" => $ok ? "00" : "01"]);
    exit;
}

 
    // DELETE CITA (ADMIN)

    if ($action == 'delete') {

        $ok = $model->deleteCita($_POST['id_cita']);

        echo json_encode(["response" => $ok ? "00" : "01"]);
        exit;
    }

  
    // UPDATE
  
    if ($action == 'update') {

        $ok = $model->updateCita(
            $_POST['id_cita'],
            $_POST['nombre_doctor'],
            $_POST['especialidad'],
            $_POST['licencia_medica'],
            $_POST['fecha'],
            $_POST['hora']
        );

        echo json_encode(["response" => $ok ? "00" : "01"]);
        exit;
    }

    
    // ERROR
  
    echo json_encode([
        "response" => "404",
        "error" => "Acción no válida: " . $action
    ]);
    exit;

} catch (Throwable $e) {

    echo json_encode([
        "response" => "500",
        "error" => $e->getMessage()
    ]);
    exit;
}