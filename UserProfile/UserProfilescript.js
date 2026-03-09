document.addEventListener("DOMContentLoaded", function () {

    let formularioPerfil = document.getElementById("formulario_perfil");

    if (formularioPerfil) {

        let mensajePerfil = document.getElementById("mensaje_perfil");

        formularioPerfil.addEventListener("submit", function (event) {

            event.preventDefault();

            let nombre = document.getElementById("nombre");
            let email = document.getElementById("email");
            let telefono = document.getElementById("telefono");
            let passwordNueva = document.getElementById("passwordNueva");
            let confirmarPassword = document.getElementById("confirmarPassword");
            let fechaNacimiento = document.getElementById("fechaNacimiento");

            let valido = true;

            document.querySelectorAll("#formulario_perfil span")
                .forEach(span => span.style.display = "none");

            mensajePerfil.style.display = "block";
            mensajePerfil.style.color = "red";
            mensajePerfil.innerText = "";

            // Valida los campos
            if (nombre.value === "") {
                nombre.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            if (email.value === "") {
                email.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            if (telefono.value === "") {
                telefono.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            if (passwordNueva.value === "") {
                passwordNueva.parentElement.querySelector(".MensajeCampoRequerido").style.display = "block";
                valido = false;
            }

            if (confirmarPassword.value === "") {
                confirmarPassword.parentElement.querySelector(".MensajeCampoRequerido").style.display = "block";
                valido = false;
            }

            if (fechaNacimiento.value === "") {
                fechaNacimiento.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
                valido = false;
            }

            // Validaciones especificas
            if (nombre.value !== "" && nombre.value.length < 3) {
                nombre.parentElement.querySelector(".MensajeNombreNoValido").style.display = "block";
                valido = false;
            }

            let formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value !== "" && !formatoCorreo.test(email.value)) {
                email.parentElement.querySelector(".MensajeEmailNoValido").style.display = "block";
                valido = false;
            }

            let formatoTelefono = /^\d{8}$/;
            if (telefono.value !== "" && !formatoTelefono.test(telefono.value)) {
                telefono.parentElement.querySelector(".MensajeNumeroNoValido").style.display = "block";
                valido = false;
            }

            if (passwordNueva.value !== "" && passwordNueva.value.length < 6) {
                passwordNueva.parentElement.querySelector(".MensajePasswordNoValido").style.display = "block";
                valido = false;
            }

            if (passwordNueva.value !== "" && confirmarPassword.value !== "" && passwordNueva.value !== confirmarPassword.value) {
                confirmarPassword.parentElement.querySelector(".MensajePasswordNoCoincide").style.display = "block";
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

            // mensaje Final
            if (!valido) {
                mensajePerfil.innerText = "Por favor corrige los campos marcados";
                return;
            }

            mensajePerfil.style.color = "green";
            mensajePerfil.innerText = "Perfil actualizado correctamente";

        });
    }

});