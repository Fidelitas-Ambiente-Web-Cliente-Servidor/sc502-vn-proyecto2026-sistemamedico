-- ============================================================
-- SISTEMA MÉDICO - SC502
-- ============================================================

-- Tabla base de estados (activo, inactivo, cancelado, etc.)
CREATE TABLE ESTADO_TB (
    id_estado       INT          NOT NULL AUTO_INCREMENT,
    nombre_estado   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tipos de usuario (paciente, administrador, etc.)
CREATE TABLE TIPO_USUARIO_TB (
    id_tipo_usuario INT          NOT NULL AUTO_INCREMENT,
    nombre_tipo     VARCHAR(100) NOT NULL,
    id_estado       INT          NOT NULL,
    PRIMARY KEY (id_tipo_usuario),
    FOREIGN KEY (id_estado) REFERENCES ESTADO_TB(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Especialidades médicas
CREATE TABLE ESPECIALIDAD_TB (
    id_especialidad     INT          NOT NULL AUTO_INCREMENT,
    nombre_especialidad VARCHAR(100) NOT NULL,
    id_estado           INT          NOT NULL,
    PRIMARY KEY (id_especialidad),
    FOREIGN KEY (id_estado) REFERENCES ESTADO_TB(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuarios del sistema
CREATE TABLE USUARIO_TB (
    identificacion  VARCHAR(20)  NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE         NOT NULL,
    id_tipo_usuario INT          NOT NULL,
    id_estado       INT          NOT NULL,
    PRIMARY KEY (identificacion),
    FOREIGN KEY (id_tipo_usuario) REFERENCES TIPO_USUARIO_TB(id_tipo_usuario),
    FOREIGN KEY (id_estado)       REFERENCES ESTADO_TB(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Correos electrónicos (también usados para login)
-- Se agrega campo password para autenticación
CREATE TABLE CORREO_TB (
    identificacion  VARCHAR(20)  NOT NULL,
    correo          VARCHAR(200) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    id_estado       INT          NOT NULL,
    PRIMARY KEY (identificacion, correo),
    FOREIGN KEY (identificacion) REFERENCES USUARIO_TB(identificacion),
    FOREIGN KEY (id_estado)      REFERENCES ESTADO_TB(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Teléfonos de usuarios
CREATE TABLE TELEFONO_TB (
    identificacion  VARCHAR(20) NOT NULL,
    telefono        VARCHAR(20) NOT NULL,
    id_estado       INT         NOT NULL,
    PRIMARY KEY (identificacion, telefono),
    FOREIGN KEY (identificacion) REFERENCES USUARIO_TB(identificacion),
    FOREIGN KEY (id_estado)      REFERENCES ESTADO_TB(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Doctores
CREATE TABLE DOCTOR_TB (
    id_doctor       INT         NOT NULL AUTO_INCREMENT,
    identificacion  VARCHAR(20) NOT NULL,
    id_especialidad INT         NOT NULL,
    id_estado       INT         NOT NULL,
    PRIMARY KEY (id_doctor),
    FOREIGN KEY (identificacion)  REFERENCES USUARIO_TB(identificacion),
    FOREIGN KEY (id_especialidad) REFERENCES ESPECIALIDAD_TB(id_especialidad),
    FOREIGN KEY (id_estado)       REFERENCES ESTADO_TB(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Horarios de doctores
CREATE TABLE HORARIO_DOCTOR_TB (
    id_horario  INT         NOT NULL AUTO_INCREMENT,
    id_doctor   INT         NOT NULL,
    dia_semana  VARCHAR(20) NOT NULL,
    hora_inicio TIME        NOT NULL,
    hora_fin    TIME        NOT NULL,
    id_estado   INT         NOT NULL,
    PRIMARY KEY (id_horario),
    FOREIGN KEY (id_doctor) REFERENCES DOCTOR_TB(id_doctor),
    FOREIGN KEY (id_estado) REFERENCES ESTADO_TB(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Citas médicas
CREATE TABLE CITA_MEDICA_TB (
    id_cita        INT          NOT NULL AUTO_INCREMENT,
    identificacion VARCHAR(20)  NOT NULL,
    id_doctor      INT          NOT NULL,
    id_estado      INT          NOT NULL,
    fecha          DATE         NOT NULL,
    hora           TIME         NOT NULL,
    motivo         VARCHAR(500) NOT NULL,
    notas          TEXT,
    archivo_receta VARCHAR(300),
    PRIMARY KEY (id_cita),
    FOREIGN KEY (identificacion) REFERENCES USUARIO_TB(identificacion),
    FOREIGN KEY (id_doctor)      REFERENCES DOCTOR_TB(id_doctor),
    FOREIGN KEY (id_estado)      REFERENCES ESTADO_TB(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT INTO ESTADO_TB (nombre_estado) VALUES
    ('Activo'),
    ('Inactivo'),
    ('Pendiente'),
    ('Confirmada'),
    ('Cancelada'),
    ('Completada');

INSERT INTO TIPO_USUARIO_TB (nombre_tipo, id_estado) VALUES
    ('Administrador', 1),
    ('Paciente',      1),
    ('Doctor',        1);

INSERT INTO ESPECIALIDAD_TB (nombre_especialidad, id_estado) VALUES
    ('Medicina General', 1),
    ('Odontología',      1),
    ('Pediatría',        1),
    ('Cardiología',      1),
    ('Dermatología',     1);
