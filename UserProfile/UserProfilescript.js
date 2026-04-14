document.addEventListener("DOMContentLoaded", function () {

    let formularioPerfil = document.getElementById("formulario_perfil");
    let mensajePerfil = document.getElementById("mensaje_perfil");

    formularioPerfil.addEventListener("submit", function (event) {

        event.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let email = document.getElementById("email").value;
        let telefono = document.getElementById("telefono").value;
        let passwordNueva = document.getElementById("passwordNueva").value;
        let confirmarPassword = document.getElementById("confirmarPassword").value;
        let fechaNacimiento = document.getElementById("fechaNacimiento").value;

        let valido = true;

        // validaciones básicas
        if (nombre.length < 3) valido = false;

        let formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatoCorreo.test(email)) valido = false;

        let formatoTelefono = /^\d{8}$/;
        if (!formatoTelefono.test(telefono)) valido = false;

        if (passwordNueva !== "" && passwordNueva.length < 6) valido = false;

        if (passwordNueva !== confirmarPassword) valido = false;

        if (!fechaNacimiento) valido = false;

        if (!valido) {
            mensajePerfil.style.color = "red";
            mensajePerfil.innerText = "Datos inválidos";
            return;
        }

        // enviar
        formularioPerfil.submit();
    });
});
