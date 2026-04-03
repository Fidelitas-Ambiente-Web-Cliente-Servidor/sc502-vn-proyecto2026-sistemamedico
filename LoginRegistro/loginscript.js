
document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
const error = params.get("error");
const registro = params.get("registro");

if (registro === "ok") {
  let mensaje = document.getElementById("mensaje");
  if (mensaje) {
    mensaje.style.display = "block";
    mensaje.style.color = "green";
    mensaje.innerText = "Registro exitoso. Inicia sesión.";
  }
}

if (error === "login") {
  let mensaje = document.getElementById("mensaje");
  if (mensaje) {
    mensaje.style.display = "block";
    mensaje.style.color = "red";
    mensaje.innerText = "Correo o contraseña incorrectos";
  }
}

if (error === "exists") {
  let email = document.getElementById("email");

  if (email) {
    let span = email.parentElement.querySelector(".MensajeEmailRepetido");

    if (span) {
      span.style.display = "block";
    }
  }

  let mensaje = document.getElementById("mensaje_registro");
  if (mensaje) {
    mensaje.style.display = "block";
    mensaje.style.color = "red";
    mensaje.innerText = "El correo ya está registrado";
  }
}


  let formularioLogin = document.getElementById("formulario_login");

  if (formularioLogin) {
    let mensaje = document.getElementById("mensaje");

    formularioLogin.addEventListener("submit", function (event) {

      let correo = document.getElementById("correo");
      let contrasena = document.getElementById("contrasena");

      let valido = true;

      // Ocultar mensajes
      document.querySelectorAll("#formulario_login span")
        .forEach(span => span.style.display = "none");

      mensaje.style.display = "block";
      mensaje.style.color = "red";
      mensaje.innerText = "";

      // Validaciones
      if (correo.value.trim() === "") {
        correo.parentElement.querySelector(".MensajeCampoRequerido").style.display = "block";
        valido = false;
      }

      if (contrasena.value.trim() === "") {
        contrasena.parentElement.querySelector(".MensajeCampoRequerido").style.display = "block";
        valido = false;
      }

      let formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (correo.value !== "" && !formatoEmail.test(correo.value)) {
        correo.parentElement.querySelector(".MensajeEmailNoValido").style.display = "block";
        valido = false;
      }

      if (contrasena.value !== "" && contrasena.value.length < 6) {
        contrasena.parentElement.querySelector(".MensajePasswordNoValido").style.display = "block";
        valido = false;
      }

      // Si hay errores no envía
      if (!valido) {
        event.preventDefault();
        mensaje.innerText = "Por favor corrige los campos";
        return;
      }

      // Si todo está bien deja enviar normal
      mensaje.style.color = "green";
      mensaje.innerText = "Validación correcta...";
    });
  }


  let formularioRegistro = document.getElementById("formulario_registro");

  if (formularioRegistro) {
    let mensajeRegistro = document.getElementById("mensaje_registro");

    formularioRegistro.addEventListener("submit", function (event) {

      let nombre = document.getElementById("nombre");
      let email = document.getElementById("email");
      let contrasena = document.getElementById("contrasena");
      let numero = document.getElementById("numero");
      let fechaNacimiento = document.getElementById("fechaNacimiento");

      let valido = true;

      // Ocultar mensajes
      document.querySelectorAll("#formulario_registro span")
        .forEach(span => span.style.display = "none");

      mensajeRegistro.style.display = "block";
      mensajeRegistro.style.color = "red";
      mensajeRegistro.innerText = "";

      // Validaciones
      if (nombre.value.trim() === "") {
        nombre.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
        valido = false;
      }

      if (email.value.trim() === "") {
        email.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
        valido = false;
      }

      if (contrasena.value.trim() === "") {
        contrasena.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
        valido = false;
      }

      if (numero.value.trim() === "") {
        numero.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
        valido = false;
      }

      if (fechaNacimiento.value === "") {
        fechaNacimiento.parentElement.querySelectorAll(".MensajeCampoRequerido")[0].style.display = "block";
        valido = false;
      }

      if (nombre.value.length < 3) {
        nombre.parentElement.querySelectorAll(".MensajeCampoRequerido")[1].style.display = "block";
        valido = false;
      }

      let formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formatoCorreo.test(email.value)) {
        email.parentElement.querySelector(".MensajeEmailNoValido").style.display = "block";
        valido = false;
      }

      if (contrasena.value.length < 6) {
        contrasena.parentElement.querySelector(".MensajePasswordNoValido").style.display = "block";
        valido = false;
      }

      let formatoTelefono = /^\d{8}$/;
      if (!formatoTelefono.test(numero.value)) {
        numero.parentElement.querySelector(".MensajeNumeroNoValido").style.display = "block";
        valido = false;
      }

      let fechaNac = new Date(fechaNacimiento.value);
      let hoy = new Date();
      let edad = hoy.getFullYear() - fechaNac.getFullYear();

      if (edad < 18) {
        fechaNacimiento.parentElement.querySelector(".MensajeEdadNoValida").style.display = "block";
        valido = false;
      }

      // Si hay errores no envía
      if (!valido) {
        event.preventDefault();
        mensajeRegistro.innerText = "Por favor corrige los campos";
        return;
      }

      // Si todo está bien deja enviar
      mensajeRegistro.style.color = "green";
      mensajeRegistro.innerText = "Validación correcta";
    });
  }
  

});