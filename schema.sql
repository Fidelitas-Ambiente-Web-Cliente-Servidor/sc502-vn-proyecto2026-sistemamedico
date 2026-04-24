-- ============================================================
-- SISTEMA MÉDICO - SC502
-- ============================================================

USE appdb;

CREATE TABLE ESTADO_TB (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre_estado VARCHAR(50) NOT NULL
);

INSERT INTO ESTADO_TB (id_estado, nombre_estado)
VALUES (1, 'ACTIVO');

INSERT INTO ESTADO_TB (id_estado, nombre_estado)
VALUES (2, 'INACTIVO');


CREATE TABLE TIPO_USUARIO_TB (
    id_tipo_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(50) NOT NULL,
    id_estado INT,
    FOREIGN KEY (id_estado) REFERENCES ESTADO_TB(id_estado)
);

INSERT INTO TIPO_USUARIO_TB (id_tipo_usuario, nombre_tipo, id_estado)
VALUES
(1, 'ADMIN', 1),
(2, 'CLIENTE', 1);


CREATE TABLE USUARIO_TB (
    identificacion VARCHAR(100) PRIMARY KEY,
    nombre_completo VARCHAR(100),
    contrasena VARCHAR(255),
    fecha_nacimiento DATE,
    id_tipo_usuario INT,
    id_estado INT,
    FOREIGN KEY (id_tipo_usuario) REFERENCES TIPO_USUARIO_TB(id_tipo_usuario),
    FOREIGN KEY (id_estado) REFERENCES ESTADO_TB(id_estado)
);


CREATE TABLE CORREO_TB (
    identificacion VARCHAR(100),
    correo VARCHAR(100),
    id_estado INT,
    PRIMARY KEY (identificacion, correo),
    FOREIGN KEY (identificacion) REFERENCES USUARIO_TB(identificacion),
    FOREIGN KEY (id_estado) REFERENCES ESTADO_TB(id_estado)
);


CREATE TABLE TELEFONO_TB (
    identificacion VARCHAR(100),
    telefono VARCHAR(20),
    id_estado INT,
    PRIMARY KEY (identificacion, telefono),
    FOREIGN KEY (identificacion) REFERENCES USUARIO_TB(identificacion),
    FOREIGN KEY (id_estado) REFERENCES ESTADO_TB(id_estado)
);


CREATE TABLE CITA_MEDICA_TB (
    id_cita INT PRIMARY KEY AUTO_INCREMENT,
    identificacion VARCHAR(100),
    nombre_doctor VARCHAR(100),
    licencia_medica VARCHAR(100),
    especialidad VARCHAR(100),
    fecha DATE,
    hora TIME,
    motivo VARCHAR(255),
    notas TEXT,
    archivo_receta VARCHAR(255),
    id_estado INT,

    FOREIGN KEY (identificacion)
        REFERENCES USUARIO_TB(identificacion),
    FOREIGN KEY (id_estado)
        REFERENCES ESTADO_TB(id_estado)
);
