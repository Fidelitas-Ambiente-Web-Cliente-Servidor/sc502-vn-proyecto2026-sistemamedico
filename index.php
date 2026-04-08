<?php

require './app/controllers/UserController.php';
require './app/controllers/CitaController.php';

$page = $_GET['page'] ?? 'login';


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if ($_GET['option'] ?? '' == 'citas') {
        $cita = new CitaController();
        $cita->index();
        exit;
    }

}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if ($_POST['option'] == 'login') {
        $auth = new UserController();
        $auth->login();
        exit;
    }

    if ($_POST['option'] == 'registro') {
        $auth = new UserController();
        $auth->registro();
        exit;
    }

    if ($_POST['option'] == 'store_cita') {
        $cita = new CitaController();
        $cita->store();
        exit;
    }

}


switch ($page) {

    case 'dashboard':
        $auth = new UserController();
        $auth->showDashboard();
        break;

    case 'admin':
        $auth = new UserController();
        $auth->showAdmin();
        break;

    case 'agenda':
        $cita = new CitaController();
        $cita->agenda();
        break;

    case 'userprofile':
        $auth = new UserController();
        $auth->showProfile();
        break;

    default:
        $auth = new UserController();
        $auth->showLogin();
        break;

}
