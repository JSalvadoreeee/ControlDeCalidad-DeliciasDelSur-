// js/validaciones.js
// Validaciones de formularios: login, registro y contacto

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    const formRegistro = document.getElementById("form-registro");
    const formContacto = document.getElementById("form-contacto");

    if (formLogin) formLogin.addEventListener("submit", validarLogin);
    if (formRegistro) formRegistro.addEventListener("submit", validarRegistro);
    if (formContacto) formContacto.addEventListener("submit", validarContacto);
});

// ---------- Utilidades ----------

function mostrarError(idCampo, mensaje) {
    const span = document.getElementById("error-" + idCampo);
    if (span) span.textContent = mensaje;
    const input = document.getElementById(idCampo);
    if (input) input.classList.add("input-error");
}

function limpiarError(idCampo) {
    const span = document.getElementById("error-" + idCampo);
    if (span) span.textContent = "";
    const input = document.getElementById(idCampo);
    if (input) input.classList.remove("input-error");
}

function esCorreoValido(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

function validarRun(run) {
    // Limpia puntos y guión, deja el cuerpo y el dígito verificador
    const limpio = run.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    if (!/^[0-9]+[0-9K]$/.test(limpio)) return false;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const resto = 11 - (suma % 11);
    let dvEsperado;
    if (resto === 11) dvEsperado = "0";
    else if (resto === 10) dvEsperado = "K";
    else dvEsperado = String(resto);

    return dv === dvEsperado;
}

// ---------- Login ----------

function validarLogin(e) {
    e.preventDefault();
    let valido = true;

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;

    limpiarError("correo");
    limpiarError("password");

    if (correo === "") {
        mostrarError("correo", "El correo es obligatorio.");
        valido = false;
    } else if (!esCorreoValido(correo)) {
        mostrarError("correo", "Ingresa un correo con formato válido, ej: nombre@correo.com");
        valido = false;
    }

    if (password === "") {
        mostrarError("password", "La contraseña es obligatoria.");
        valido = false;
    } else if (password.length < 6) {
        mostrarError("password", "La contraseña debe tener al menos 6 caracteres.");
        valido = false;
    }

    if (valido) {
        alert("Inicio de sesión válido. (Aquí iría la lógica de autenticación)");
        e.target.reset();
    }
}

// ---------- Registro ----------

function validarRegistro(e) {
    e.preventDefault();
    let valido = true;

    const run = document.getElementById("run").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;
    const direccion = document.getElementById("direccion").value.trim();

    ["run", "nombre", "apellidos", "correo", "region", "comuna", "direccion"].forEach(limpiarError);

    if (run === "") {
        mostrarError("run", "El RUN es obligatorio.");
        valido = false;
    } else if (!validarRun(run)) {
        mostrarError("run", "El RUN no es válido. Revisa el número y el dígito verificador.");
        valido = false;
    }

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (nombre === "") {
        mostrarError("nombre", "El nombre es obligatorio.");
        valido = false;
    } else if (!soloLetras.test(nombre)) {
        mostrarError("nombre", "El nombre solo puede contener letras.");
        valido = false;
    }

    if (apellidos === "") {
        mostrarError("apellidos", "Los apellidos son obligatorios.");
        valido = false;
    } else if (!soloLetras.test(apellidos)) {
        mostrarError("apellidos", "Los apellidos solo pueden contener letras.");
        valido = false;
    }

    if (correo === "") {
        mostrarError("correo", "El correo es obligatorio.");
        valido = false;
    } else if (!esCorreoValido(correo)) {
        mostrarError("correo", "Ingresa un correo con formato válido, ej: nombre@correo.com");
        valido = false;
    }

    if (region === "") {
        mostrarError("region", "Selecciona una región.");
        valido = false;
    }

    if (comuna === "") {
        mostrarError("comuna", "Selecciona una comuna.");
        valido = false;
    }

    if (direccion === "") {
        mostrarError("direccion", "La dirección es obligatoria.");
        valido = false;
    } else if (direccion.length < 5) {
        mostrarError("direccion", "Ingresa una dirección más completa.");
        valido = false;
    }

    if (valido) {
        alert("Registro válido. (Aquí iría el envío de datos al servidor)");
        e.target.reset();
    }
}


function validarContacto(e) {
    e.preventDefault();
    let valido = true;

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const comentario = document.getElementById("comentario").value.trim();

    ["nombre", "correo", "comentario"].forEach(limpiarError);

    if (nombre === "") {
        mostrarError("nombre", "El nombre es obligatorio.");
        valido = false;
    }

    if (correo === "") {
        mostrarError("correo", "El correo es obligatorio.");
        valido = false;
    } else if (!esCorreoValido(correo)) {
        mostrarError("correo", "Ingresa un correo con formato válido, ej: nombre@correo.com");
        valido = false;
    }

    if (comentario === "") {
        mostrarError("comentario", "El comentario no puede estar vacío.");
        valido = false;
    } else if (comentario.length < 10) {
        mostrarError("comentario", "Cuéntanos un poco más (mínimo 10 caracteres).");
        valido = false;
    }

    if (valido) {
        alert("Mensaje enviado. (Aquí iría el envío real del formulario)");
        e.target.reset();
    }
}