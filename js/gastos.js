// Seguridad de rutas: Verificar sesión activa
const usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (!usuarioSesion) {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // Aplicar tema guardado
    if (localStorage.getItem("tema") === "oscuro") {
        document.body.classList.add("modo-oscuro");
    }

    document.getElementById("nombre-usuario").textContent = `Hola, ${usuarioSesion.nombre || usuarioSesion.usuario}`;
    renderizarGastos();
});

function cambiarTema() {
    document.body.classList.toggle("modo-oscuro");
    const esOscuro = document.body.classList.contains("modo-oscuro");
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
}

function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "index.html";
}

// Lógica de Gastos (CRUD)
function obtenerGastos() {
    return JSON.parse(localStorage.getItem("gastos_sgg")) || [];
}

function guardarGastosEnStorage(gastos) {
    localStorage.setItem("gastos_sgg", JSON.stringify(gastos));
}

function guardarGasto(event) {
    event.preventDefault();

    const idInput = document.getElementById("gasto-id").value;
    const monto = parseFloat(document.getElementById("monto").value);
    const fecha = document.getElementById("fecha").value;
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const error = document.getElementById("mensaje-error");

    if (monto <= 0 || isNaN(monto)) {
        error.textContent = "El monto debe ser un número positivo mayor a 0.";
        return;
    }
    error.textContent = "";

    let gastos = obtenerGastos();

    if (idInput) {
        // Modo Edición (RF-07)
        const index = gastos.findIndex(g => g.id === idInput);
        if (index !== -1) {
            gastos[index].monto = monto;
            gastos[index].fecha = fecha;
            gastos[index].categoria = categoria;
            gastos[index].descripcion = descripcion;
        }
    } else {
        // Modo Creación (RF-05)
        const nuevoGasto = {
            id: Date.now().toString(),
            email_usuario: usuarioSesion.email || usuarioSesion.usuario, // Foreign Key simulada
            monto: monto,
            fecha: fecha,
            categoria: categoria,
            descripcion: descripcion,
            estado_activo: true // Baja lógica por defecto
        };
        gastos.push(nuevoGasto);
    }

    guardarGastosEnStorage(gastos);
    limpiarFormulario();
    renderizarGastos();
}

function renderizarGastos() {
    const gastos = obtenerGastos();
    const usuarioEmail = usuarioSesion.email || usuarioSesion.usuario;
    const cuerpoTabla = document.getElementById("cuerpo-tabla");
    const totalGastadoElem = document.getElementById("total-gastado");

    cuerpoTabla.innerHTML = "";
    let acumulado = 0;

    // Filtrar solo los del usuario logueado y que estén activos (RF-06, RF-08)
    const gastosUsuario = gastos.filter(g => g.email_usuario === usuarioEmail && g.estado_activo === true);

    gastosUsuario.forEach(gasto => {
        acumulado += gasto.monto;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${gasto.fecha}</td>
            <td>${gasto.categoria}</td>
            <td>${gasto.descripcion}</td>
            <td>$${gasto.monto.toFixed(2)}</td>
            <td>
                <button onclick="prepararEdicion('${gasto.id}')">Editar</button>
                <button onclick="eliminarGasto('${gasto.id}')" style="background-color: #d9534f; color:white;">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    // Actualizar Panel de Resumen (RF-09)
    totalGastadoElem.textContent = `$${acumulado.toFixed(2)}`;
}

function prepararEdicion(id) {
    const gastos = obtenerGastos();
    const gasto = gastos.find(g => g.id === id);

    if (gasto) {
        document.getElementById("gasto-id").value = gasto.id;
        document.getElementById("monto").value = gasto.monto;
        document.getElementById("fecha").value = gasto.fecha;
        document.getElementById("categoria").value = gasto.categoria;
        document.getElementById("descripcion").value = gasto.descripcion;

        document.getElementById("titulo-form").textContent = "Editar Gasto";
        document.getElementById("btn-guardar").textContent = "Actualizar Gasto";
        document.getElementById("btn-cancelar").style.display = "inline-block";
    }
}

function eliminarGasto(id) {
    // Confirmación y Baja Lógica (RF-08)
    if (confirm("¿Está seguro de que desea eliminar este registro de gasto?")) {
        let gastos = obtenerGastos();
        const index = gastos.findIndex(g => g.id === id);

        if (index !== -1) {
            gastos[index].estado_activo = false; // Soft Delete
            guardarGastosEnStorage(gastos);
            renderizarGastos();
        }
    }
}

function limpiarFormulario() {
    document.getElementById("gasto-id").value = "";
    document.getElementById("form-gasto").reset();
    document.getElementById("titulo-form").textContent = "Registrar Nuevo Gasto";
    document.getElementById("btn-guardar").textContent = "Guardar Gasto";
    document.getElementById("btn-cancelar").style.display = "none";
    document.getElementById("mensaje-error").textContent = "";
}
