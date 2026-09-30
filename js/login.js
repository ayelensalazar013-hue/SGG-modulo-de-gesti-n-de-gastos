document.addEventListener("DOMContentLoaded", () => {
    // Cargar el tema guardado al iniciar
    if (localStorage.getItem("tema") === "oscuro") {
        document.body.classList.add("modo-oscuro");
    }
});

let intentosFallidos = 0;

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

function iniciarSesion(event) {
    event.preventDefault();

    const usuarioInput = document.getElementById("usuario").value.trim();
    const passwordInput = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");
    const btnIngresar = document.getElementById("btn-ingresar");

    const usuarios = JSON.parse(localStorage.getItem("usuarios_sgg")) || [];

    // Buscar por nombre de usuario o email
    const usuarioValido = usuarios.find(
        u => (u.usuario === usuarioInput || u.email === usuarioInput) && u.password === passwordInput
    );

    if (usuarioValido) {
        intentosFallidos = 0;
        mensaje.style.color = "green";
        mensaje.textContent = `¡Bienvenido/a, ${usuarioValido.nombre}! Redirigiendo...`;
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));
        
        // Redirección simulada
        setTimeout(() => {
            alert(`Sesión iniciada con éxito. Hola ${usuarioValido.nombre}`);
        }, 1500);
    } else {
        intentosFallidos++;
        mensaje.style.color = "red";

        if (intentosFallidos >= 3) {
            mensaje.textContent = "Superaste el límite de 3 intentos. Botón bloqueado por 30 segundos.";
            btnIngresar.disabled = true;

            setTimeout(() => {
                intentosFallidos = 0;
                btnIngresar.disabled = false;
                mensaje.textContent = "Ya podés volver a intentarlo.";
                mensaje.style.color = "black";
            }, 30000);
        } else {
            mensaje.textContent = `Credenciales incorrectas. Intento ${intentosFallidos} de 3.`;
        }
    }
}
