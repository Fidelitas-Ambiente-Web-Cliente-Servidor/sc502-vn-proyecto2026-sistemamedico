<?php

require './app/controllers/CitaController.php';

$page = $_GET['page'] ?? 'dashboard';


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if ($_GET['option'] ?? '' == 'citas') {
        $cita = new CitaController();
        $cita->index();
        exit;
    }

}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if ($_POST['option'] == 'store_cita') {
        $cita = new CitaController();
        $cita->store();
        exit;
    }

}


switch ($page) {

    case 'agenda':
        $cita = new CitaController();
        $cita->agenda();
        break;

    default:
        header('Location: LoginRegistro/login.php');
        exit;

}
