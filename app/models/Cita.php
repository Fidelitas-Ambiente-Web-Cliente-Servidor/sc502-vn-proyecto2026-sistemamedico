<?php

class Cita
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll()
    {
        $sql = "
            SELECT
                c.id_cita,
                up.nombre_completo AS paciente,
                ud.nombre_completo AS doctor,
                c.fecha,
                c.hora,
                c.motivo
            FROM CITA_MEDICA_TB c
            JOIN USUARIO_TB up ON c.identificacion = up.identificacion
            JOIN DOCTOR_TB d   ON c.id_doctor = d.id_doctor
            JOIN USUARIO_TB ud ON d.identificacion = ud.identificacion
            ORDER BY c.fecha, c.hora
        ";
        return $this->conn->query($sql);
    }

    public function getByUser($identificacion)
    {
        $stmt = $this->conn->prepare("
            SELECT
                c.id_cita,
                up.nombre_completo AS paciente,
                ud.nombre_completo AS doctor,
                c.fecha,
                c.hora,
                c.motivo
            FROM CITA_MEDICA_TB c
            JOIN USUARIO_TB up ON c.identificacion = up.identificacion
            JOIN DOCTOR_TB d   ON c.id_doctor = d.id_doctor
            JOIN USUARIO_TB ud ON d.identificacion = ud.identificacion
            WHERE c.identificacion = ?
            ORDER BY c.fecha, c.hora
        ");
        $stmt->bind_param("s", $identificacion);
        $stmt->execute();
        return $stmt->get_result();
    }

    public function getDoctores()
    {
        $sql = "
            SELECT d.id_doctor, u.nombre_completo
            FROM DOCTOR_TB d
            JOIN USUARIO_TB u ON d.identificacion = u.identificacion
            WHERE d.id_estado = 1
        ";
        return $this->conn->query($sql);
    }

    public function create($identificacion, $id_doctor, $fecha, $hora, $motivo)
    {
        $id_estado = 1;
        $stmt = $this->conn->prepare("
            INSERT INTO CITA_MEDICA_TB (identificacion, id_doctor, fecha, hora, motivo, id_estado)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("sisssi", $identificacion, $id_doctor, $fecha, $hora, $motivo, $id_estado);
        return $stmt->execute();
    }

    public function update($id_cita, $id_doctor, $fecha, $hora, $motivo)
    {
        $stmt = $this->conn->prepare("
            UPDATE CITA_MEDICA_TB
            SET id_doctor = ?, fecha = ?, hora = ?, motivo = ?
            WHERE id_cita = ?
        ");
        $stmt->bind_param("isssi", $id_doctor, $fecha, $hora, $motivo, $id_cita);
        return $stmt->execute();
    }

    public function delete($id_cita)
    {
        $stmt = $this->conn->prepare("DELETE FROM CITA_MEDICA_TB WHERE id_cita = ?");
        $stmt->bind_param("i", $id_cita);
        return $stmt->execute();
    }
}
