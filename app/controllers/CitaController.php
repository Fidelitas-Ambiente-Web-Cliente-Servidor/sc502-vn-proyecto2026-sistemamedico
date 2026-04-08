<?php

session_start();

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../models/Cita.php';

class CitaController
{
    private $model;

    public function __construct()
    {
        if (!isset($_SESSION['usuario'])) {
            header("Location: ../../LoginRegistro/login.php");
            exit;
        }

        $database = new Database();
        $db = $database->connect();
        $this->model = new Cita($db);
    }

    public function agenda()
    {
        require __DIR__ . '/../../Agenda/agenda.php';
    }

    public function index()
    {
        header('Content-Type: application/json');
        $rol = $_SESSION['rol'];

        if ($rol == 1) {
            $result = $this->model->getAll();
        } else {
            $result = $this->model->getByUser($_SESSION['usuario']);
        }

        echo json_encode(["citas" => $result->fetch_all(MYSQLI_ASSOC)]);
    }

    public function store()
    {
        header('Content-Type: application/json');
        try {
            $id_doctor = $_POST['id_doctor'];
            $fecha     = $_POST['fecha'];
            $hora      = $_POST['hora'];
            $motivo    = $_POST['motivo'] ?? '';

            $this->model->create($_SESSION['usuario'], $id_doctor, $fecha, $hora, $motivo);
            echo json_encode(["response" => "00"]);
        } catch (Exception $e) {
            echo json_encode(["response" => "01"]);
        }
    }

    public function update()
    {
        header('Content-Type: application/json');
        try {
            $id_cita   = $_POST['id_cita'];
            $id_doctor = $_POST['id_doctor'];
            $fecha     = $_POST['fecha'];
            $hora      = $_POST['hora'];
            $motivo    = $_POST['motivo'] ?? '';

            $this->model->update($id_cita, $id_doctor, $fecha, $hora, $motivo);
            echo json_encode(["response" => "00"]);
        } catch (Exception $e) {
            echo json_encode(["response" => "01"]);
        }
    }

    public function delete()
    {
        header('Content-Type: application/json');
        try {
            $id_cita = $_POST['id_cita'];
            $this->model->delete($id_cita);
            echo json_encode(["response" => "00"]);
        } catch (Exception $e) {
            echo json_encode(["response" => "01"]);
        }
    }
}
