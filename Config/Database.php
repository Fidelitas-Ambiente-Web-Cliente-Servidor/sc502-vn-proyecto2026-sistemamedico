<?php

class Database {
    private $host = "db";
    private $db   = "appdb";
    private $user = "appuser";
    private $pass = "apppass";

    public function connect(): mysqli {
        $conn = new mysqli($this->host, $this->user, $this->pass, $this->db);

        if ($conn->connect_error) {
            die("Error de conexión: " . $conn->connect_error);
        }

        return $conn;
    }
}
