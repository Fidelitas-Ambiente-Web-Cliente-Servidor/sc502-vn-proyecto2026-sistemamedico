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
            c.id_doctor,
            COALESCE(up.nombre_completo, c.identificacion) AS paciente,
            COALESCE(ud.nombre_completo, 'Sin asignar')    AS doctor,
            c.fecha,
            c.hora,
            c.motivo
        FROM CITA_MEDICA_TB c
        LEFT JOIN USUARIO_TB up ON c.identificacion = up.identificacion
        LEFT JOIN DOCTOR_TB d   ON c.id_doctor = d.id_doctor
        LEFT JOIN USUARIO_TB ud ON d.identificacion = ud.identificacion
        WHERE c.id_estado = 1
        ORDER BY c.fecha, c.hora
    ";
        return $this->conn->query($sql);
    }

    public function getByUser($identificacion)
    {
        $stmt = $this->conn->prepare("
        SELECT
            c.id_cita,
            c.id_doctor,
            COALESCE(up.nombre_completo, c.identificacion) AS paciente,
            COALESCE(ud.nombre_completo, 'Sin asignar')    AS doctor,
            c.fecha,
            c.hora,
            c.motivo
        FROM CITA_MEDICA_TB c
        LEFT JOIN USUARIO_TB up ON c.identificacion = up.identificacion
        LEFT JOIN DOCTOR_TB d   ON c.id_doctor = d.id_doctor
        LEFT JOIN USUARIO_TB ud ON d.identificacion = ud.identificacion
        WHERE c.identificacion = ? AND c.id_estado = 1
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

    //lista médicos con especialidad, cédula y horario
    public function getMedicos()
    {
        $sql = "
            SELECT
                d.id_doctor,
                u.nombre_completo AS nombre,
                COALESCE(e.nombre_especialidad, d.cedula_profesional) AS especialidad,
                d.cedula_profesional AS cedula,
                d.horario
            FROM DOCTOR_TB d
            JOIN USUARIO_TB u ON d.identificacion = u.identificacion
            LEFT JOIN ESPECIALIDAD_TB e ON d.id_especialidad = e.id_especialidad
            WHERE d.id_estado = 1
            ORDER BY u.nombre_completo
        ";
        return $this->conn->query($sql);
    }

    //crea médico completo con especialidad, cédula y horario ──
    public function crearMedicoCompleto($nombre, $especialidad, $cedula, $horario)
    {
        $identificacion = 'DOC_' . uniqid();
        $id_estado = 1;

        $id_tipo_doctor = 3;
        $stmt = $this->conn->prepare("
        INSERT INTO USUARIO_TB (identificacion, nombre_completo, id_tipo_usuario, id_estado)
        VALUES (?, ?, ?, ?)
");
        $stmt->bind_param("ssii", $identificacion, $nombre, $id_tipo_doctor, $id_estado);
        $stmt->execute();

        $stmt = $this->conn->prepare("SELECT id_especialidad FROM ESPECIALIDAD_TB WHERE nombre_especialidad = ?");
        $stmt->bind_param("s", $especialidad);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        if ($result) {
            $id_especialidad = $result['id_especialidad'];
        } else {
            $stmt = $this->conn->prepare("INSERT INTO ESPECIALIDAD_TB (nombre_especialidad, id_estado) VALUES (?, 1)");
            $stmt->bind_param("s", $especialidad);
            $stmt->execute();
            $id_especialidad = $this->conn->insert_id;
        }

        $stmt = $this->conn->prepare("
            INSERT INTO DOCTOR_TB (identificacion, id_especialidad, id_estado, cedula_profesional, horario)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("siiss", $identificacion, $id_especialidad, $id_estado, $cedula, $horario);
        $stmt->execute();

        return $this->conn->insert_id > 0;
    }

    public function eliminarMedico($id_doctor)
    {
        $stmt = $this->conn->prepare("UPDATE DOCTOR_TB SET id_estado = 2 WHERE id_doctor = ?");
        $stmt->bind_param("i", $id_doctor);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }

    public function crearDoctor($nombre)
    {
        $identificacion = 'DOC_' . uniqid();
        $id_estado = 1;

        $stmt = $this->conn->prepare("
            INSERT INTO USUARIO_TB (identificacion, nombre_completo, id_estado)
            VALUES (?, ?, ?)
        ");
        $stmt->bind_param("ssi", $identificacion, $nombre, $id_estado);
        $stmt->execute();

        $stmt = $this->conn->prepare("
            INSERT INTO DOCTOR_TB (identificacion, id_estado)
            VALUES (?, ?)
        ");
        $stmt->bind_param("si", $identificacion, $id_estado);
        $stmt->execute();

        return $this->conn->insert_id;
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
        $stmt = $this->conn->prepare(
            "UPDATE CITA_MEDICA_TB SET id_estado = 2 WHERE id_cita = ?"
        );
        $stmt->bind_param("i", $id_cita);
        return $stmt->execute();
    }
    public function getDoctoresConHorario()
    {
        $sql = "
            SELECT
                d.id_doctor,
                u.nombre_completo AS nombre,
                COALESCE(e.nombre_especialidad, '-') AS especialidad,
                d.horario
            FROM DOCTOR_TB d
            JOIN USUARIO_TB u ON d.identificacion = u.identificacion
            LEFT JOIN ESPECIALIDAD_TB e ON d.id_especialidad = e.id_especialidad
            WHERE d.id_estado = 1
            ORDER BY u.nombre_completo
        ";
        return $this->conn->query($sql);
    }

}
