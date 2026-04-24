<?php
header('Content-Type: application/json');

require_once("../config/database.php");
require_once("../app/models/Cita.php");

$db = (new Database())->connect();
$cita = new Cita($db);

$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {

    
    // CREAR CITA

    if ($action == "crearCita") {

        $ok = $cita->createCita(
            $_POST['nombre_doctor'],
            $_POST['especialidad'],
            $_POST['licencia_medica'],
            $_POST['fecha'],
            $_POST['hora']
        );

        echo json_encode(["response" => $ok ? "00" : "99"]);
        exit;
    }

    // LISTAR CITAS

    if ($action == "getCitas") {

        $result = $cita->getTodasLasCitas();

        $citas = [];

        while ($row = $result->fetch_assoc()) {
            $citas[] = $row;
        }

        echo json_encode(["citas" => $citas]);
        exit;
    }

    
  /*
    if ($action == "getCitas") {

        $result = $cita->getCitasDisponibles();

        $citas = [];

        while ($row = $result->fetch_assoc()) {
            $citas[] = $row;
        }

        echo json_encode(["citas" => $citas]);
        exit;
    }

*/
    // UPDATE

    if ($action == "update") {

        $ok = $cita->updateCita(
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

    // DELETE (ADMIN elimina cita)
  
    if ($action == "delete") {

        $ok = $cita->deleteCita($_POST['id_cita']);

        echo json_encode(["response" => $ok ? "00" : "01"]);
        exit;
    }

    if ($action == "uploadReceta") {

    $id_cita = $_POST['id_cita'];

    $fileName = null;

    if (isset($_FILES['receta']) && $_FILES['receta']['error'] == 0) {

        $fileName = time() . "_" . $_FILES['receta']['name'];
        $ruta = "../recetas/" . $fileName;

        move_uploaded_file($_FILES['receta']['tmp_name'], $ruta);
    }

    $ok = $cita->subirReceta($id_cita, $fileName);

    echo json_encode(["response" => $ok ? "00" : "01"]);
    exit;
}


    // LIBERAR (USUARIO cancela su cita y se libera para otros usuarios)

    if ($action == "liberar") {

        $ok = $cita->liberarCita($_POST['id_cita']);

        echo json_encode(["response" => $ok ? "00" : "01"]);
        exit;
    }

    echo json_encode(["response" => "404"]);

} catch (Throwable $e) {

    echo json_encode([
        "response" => "500",
        "error" => $e->getMessage()
    ]);
}