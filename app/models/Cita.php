<?php

class Cita
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // ADMIN CREA CITA DISPONIBLE
    public function createCita($nombre_doctor, $especialidad, $licencia_medica, $fecha, $hora)
    {
        $sql = "
            INSERT INTO CITA_MEDICA_TB
            (
                identificacion,
                nombre_doctor,
                especialidad,
                licencia_medica,
                fecha,
                hora,
                motivo,
                id_estado
            )
            VALUES
            (
                NULL,
                ?,
                ?,
                ?,
                ?,
                ?,
                '',
                1
            )
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param(
            "sssss",
            $nombre_doctor,
            $especialidad,
            $licencia_medica,
            $fecha,
            $hora
        );

        return $stmt->execute();
    }

    // CITAS DISPONIBLES
    public function getCitasDisponibles()
    {
        $sql = "
            SELECT
                id_cita,
                nombre_doctor,
                especialidad,
                licencia_medica,
                fecha,
                hora
            FROM CITA_MEDICA_TB
            WHERE identificacion IS NULL
              AND id_estado = 1
            ORDER BY fecha, hora
        ";

        return $this->conn->query($sql);
    }

    // USUARIO RESERVA
    public function reservarCita($usuario, $id_cita, $motivo = '')
    {
        $sql = "
            UPDATE CITA_MEDICA_TB
            SET
                identificacion = ?,
                motivo = ?
            WHERE id_cita = ?
              AND identificacion IS NULL
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssi", $usuario, $motivo, $id_cita);

        return $stmt->execute();
    }

    // CITAS DEL USUARIO
public function getCitasPorUsuario($usuario)
{
    $sql = "
        SELECT 
            c.id_cita,
            c.identificacion AS paciente,
            c.nombre_doctor AS doctor,
            c.fecha,
            c.hora,
            c.motivo,
            c.archivo_receta
        FROM CITA_MEDICA_TB c
        WHERE c.identificacion = ?
        ORDER BY c.fecha, c.hora
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("s", $usuario);
    $stmt->execute();

    return $stmt->get_result();
}

    // EDITAR CITA (ADMIN)
public function updateCita($id_cita, $nombre_doctor, $especialidad, $licencia_medica, $fecha, $hora)
{
    $sql = "
        UPDATE CITA_MEDICA_TB
        SET 
            nombre_doctor = ?,
            especialidad = ?,
            licencia_medica = ?,
            fecha = ?,
            hora = ?
        WHERE id_cita = ?
    ";

    $stmt = $this->conn->prepare($sql);

    if (!$stmt) {
        die("Error prepare: " . $this->conn->error);
    }

    $stmt->bind_param(
        "sssssi",
        $nombre_doctor,
        $especialidad,
        $licencia_medica,
        $fecha,
        $hora,
        $id_cita
    );

    $ok = $stmt->execute();

    if (!$ok) {
        die("Error execute: " . $stmt->error);
    }

    return $ok;
}


// ELIMINAR CITA (ADMIN)
public function deleteCita($id_cita)
{
    $sql = "DELETE FROM CITA_MEDICA_TB WHERE id_cita = ?";

    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $id_cita);

    return $stmt->execute();
}


public function liberarCita($id_cita, $usuario)
{
    $sql = "
        UPDATE CITA_MEDICA_TB
        SET identificacion = NULL,
            motivo = '',
            notas = NULL
        WHERE id_cita = ?
          AND identificacion = ?
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("is", $id_cita, $usuario);

    return $stmt->execute();
}

public function subirReceta($id_cita, $archivo)
{
    $sql = "
        UPDATE CITA_MEDICA_TB
        SET archivo_receta = ?
        WHERE id_cita = ?
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("si", $archivo, $id_cita);

    return $stmt->execute();
}

public function getTodasLasCitas()
{
    $sql = "
        SELECT
            id_cita,
            identificacion,
            nombre_doctor,
            especialidad,
            licencia_medica,
            fecha,
            hora,
            motivo,
            archivo_receta
        FROM CITA_MEDICA_TB
        ORDER BY fecha, hora
    ";

    return $this->conn->query($sql);
}

}