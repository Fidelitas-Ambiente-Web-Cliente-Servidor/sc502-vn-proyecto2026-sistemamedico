
document.addEventListener("DOMContentLoaded", function () {

    let formularioLogin = document.getElementById("formulario_login");
    if (formularioLogin) {
        let mensaje = document.getElementById("mensaje");

        formularioLogin.addEventListener("submit", function (event) {
            event.preventDefault();

            let correo = document.getElementById("correo");
            let contraseña = document.getElementById("contraseña");

            mensaje.style.display = "block";
            mensaje.style.color = "red";

            if (correo.value == "" || contraseña.value == "") {
                mensaje.innerText = "Todos los campos obligatorios deben completarse";
                return;
            }

            let formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formatoCorreo.test(correo.value)) {
                mensaje.innerText = "El correo no tiene un formato válido";
                return;
            }

            if (contraseña.value.length < 6) {
                mensaje.innerText = "La contraseña debe tener al menos 6 caracteres";
                return;
            }

            mensaje.style.color = "green";
            mensaje.innerText = "Inicio de sesión exitoso";
        });
    }


    let formularioRegistro = document.getElementById("formulario_registro");
    if (formularioRegistro) {
        let mensajeRegistro = document.getElementById("mensaje_registro");

        formularioRegistro.addEventListener("submit", function (event) {
            event.preventDefault();

            let nombre = document.getElementById("nombre");
            let email = document.getElementById("email");
            let contraseña = document.getElementById("contraseña");
            let numero = document.getElementById("numero");
            let fechaNacimiento = document.getElementById("fechaNacimiento");

            mensajeRegistro.style.display = "block";
            mensajeRegistro.style.color = "red";

            if (nombre.value == "" || email.value == "" || contraseña.value == "" || numero.value == "" || fechaNacimiento.value == "") {
                mensajeRegistro.innerText = "Todos los campos son obligatorios";
                return;
            }

            if (nombre.value.length < 3) {
                mensajeRegistro.innerText = "El nombre debe tener al menos 3 caracteres";
                return;
            }

            let formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formatoCorreo.test(email.value)) {
                mensajeRegistro.innerText = "El correo no tiene un formato válido";
                return;
            }

            if (contraseña.value.length < 6) {
                mensajeRegistro.innerText = "La contraseña debe tener al menos 6 caracteres";
                return;
            }
            let formatoTelefono = /^\d{8}$/;
            if (!formatoTelefono.test(numero.value)) {
                mensajeRegistro.innerText = "El número de teléfono debe tener 8 dígitos";
                return;
            }

            let fechaNac = new Date(fechaNacimiento.value);
            let hoy = new Date();

            let fechaMinima = new Date();
            fechaMinima.setFullYear(hoy.getFullYear() - 18);

            if (fechaNac > fechaMinima) {
                mensajeRegistro.innerText = "Debes ser mayor de 18 años para registrarte";
                return;
            }

            mensajeRegistro.style.color = "green";
            mensajeRegistro.innerText = "Registro exitoso";
        });
    }
});
