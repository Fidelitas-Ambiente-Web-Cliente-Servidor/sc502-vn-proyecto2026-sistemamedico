
document.addEventListener("DOMContentLoaded", function () {

    let formularioLogin = document.getElementById("formulario_login");
    if (formularioLogin) {
        let mensaje = document.getElementById("mensaje");

        formularioLogin.addEventListener("submit", function (event) {
            event.preventDefault();

            let correo = document.getElementById("correo");
            let contraseña = document.getElementById("contraseña");

            let valido = true;

            document.querySelectorAll("#formulario_login span")
                .forEach(span => span.style.display = "none");

            mensaje.style.display = "block";
            mensaje.style.color = "red";
            mensaje.innerText = "";

            // Valida los campos
            if (correo.value === "") {
                correo.parentElement
                    .querySelector(".MensajeCampoRequerido")
                    .style.display = "block";

                valido = false;
            }

            if (contraseña.value === "") {
                contraseña.parentElement
                    .querySelector(".MensajeCampoRequerido")
                    .style.display = "block";

                valido = false;
            }

            // Valida Formato del Email
            let formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (correo.value !== "" && !formatoEmail.test(correo.value)) {
                correo.parentElement
                    .querySelector(".MensajeEmailNoValido")
                    .style.display = "block";

                valido = false;
            }

            // Valida password valido
            if (contraseña.value !== "" && contraseña.value.length < 6) {
                contraseña.parentElement
                    .querySelector(".MensajePasswordNoValido")
                    .style.display = "block";

                valido = false;
            }

            // mensaje Final
            if (!valido) {
                mensaje.innerText = "Todos los campos obligatorios deben completarse";
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

            let valido = true;

            // Ocultar todos los mensajes primero
            document.querySelectorAll("#formulario_registro span")
                .forEach(span => span.style.display = "none");

            mensajeRegistro.style.display = "block";
            mensajeRegistro.style.color = "red";
            mensajeRegistro.innerText = "";

            // CAMPOS VACÍOS
            if (nombre.value === "") {
                nombre.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            if (email.value === "") {
                email.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            if (contraseña.value === "") {
                contraseña.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            if (numero.value === "") {
                numero.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            if (fechaNacimiento.value === "") {
                fechaNacimiento.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            // VALIDACIONES ESPECÍFICAS
            if (nombre.value !== "" && nombre.value.length < 3) {
                nombre.parentElement.querySelectorAll(".MensajeCampoRequerido")[1].style.display = "block";
                valido = false;
            }

            let formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value !== "" && !formatoCorreo.test(email.value)) {
                email.parentElement.querySelector(".MensajeEmailNoValido").style.display = "block";
                valido = false;
            }

            if (contraseña.value !== "" && contraseña.value.length < 6) {
                contraseña.parentElement.querySelector(".MensajePasswordNoValido").style.display = "block";
                valido = false;
            }

            let formatoTelefono = /^\d{8}$/;
            if (numero.value !== "" && !formatoTelefono.test(numero.value)) {
                numero.parentElement.querySelector(".MensajeNumeroNoValido").style.display = "block";
                valido = false;
            }

            let fechaNac = new Date(fechaNacimiento.value);
            let hoy = new Date();
            let fechaMinima = new Date();
            fechaMinima.setFullYear(hoy.getFullYear() - 18);

            if (fechaNacimiento.value !== "" && fechaNac > fechaMinima) {
                fechaNacimiento.parentElement.querySelector(".MensajeEdadNoValida").style.display = "block";
                valido = false;
            }

            // MENSAJE FINAL
            if (!valido) {
                mensajeRegistro.innerText = "Por favor corrige los campos marcados";
                return;
            }

            mensajeRegistro.style.color = "green";
            mensajeRegistro.innerText = "Registro exitoso";
        });
    };
});

