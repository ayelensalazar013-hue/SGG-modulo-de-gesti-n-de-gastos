document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tema") === "oscuro") {
        document.body.classList.add("modo-oscuro");
    }
});

function mostrarOcultarPassword(idCampo, boton) {
    const input = document.getElementById(idCampo);
    if (input.type === "password") {
        input.type = "text";
        boton.textContent = "Ocultar";
    } else {
        input.type = "password";
        boton.textContent = "Mostrar";
    }
}

function cambiarTema() {
    document.body.classList.toggle("modo-oscuro");
    const esOscuro = document.body.classList.contains("modo-oscuro");
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
}

function cambiarContrasena(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const nuevaPassword = document.getElementById("nuevaPassword").value;
    const repetirNuevaPassword = document.getElementById("repetirNuevaPassword").value;
    const mensaje = document.getElementById("mensaje");

    if (nuevaPassword !== repetirNuevaPassword) {
        mensaje.style.color = "red";
        mensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios_sgg")) || [];
    const indexUsuario = usuarios.findIndex(u => u.email === email);

    if (indexUsuario === -1) {
        mensaje.style.color = "red";
        mensaje.textContent = "No existe ninguna cuenta asociada a este correo.";
        return;
    }

    if (usuarios[indexUsuario].password === nuevaPassword) {
        mensaje.style.color = "red";
        mensaje.textContent = "La nueva contraseña no puede ser igual a la actual.";
        return;
    }

    // Actualizar contraseña en el arreglo
    usuarios[indexUsuario].password = nuevaPassword;
    localStorage.setItem("usuarios_sgg", JSON.stringify(usuarios));

    mensaje.style.color = "green";
    mensaje.textContent = "¡Contraseña actualizada con éxito! Redirigiendo al login...";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
}
