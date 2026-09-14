document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    const formRegistro = document.getElementById("form-registro");
    const formContacto = document.getElementById("form-contacto");

    const formLote = document.getElementById("form-lote");
    const formDevolucion = document.getElementById("form-devolucion");

    if (formLogin) formLogin.addEventListener("submit", validarLogin);
    if (formRegistro) formRegistro.addEventListener("submit", validarRegistro);
    if (formContacto) formContacto.addEventListener("submit", validarContacto);
    if (formLote) formLote.addEventListener("submit", validarFormLote);
    if (formDevolucion) formDevolucion.addEventListener("submit", validarFormDevolucion);
});

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
    const regex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    if (!regex.test(correo)) return false;

    const usuario = correo.split("@")[0];
    return usuario.length >= 4;
}

function validarRun(run) {
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
    } else if (password.length < 8) {
        mostrarError("password", "La contraseña debe tener al menos 8 caracteres.");
        valido = false;
    }

    if (valido) {
        alert("Inicio correcto");
        e.target.reset();
    }
}

function validarRegistro(e) {
    e.preventDefault();
    let valido = true;

    const run = document.getElementById("run").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;

    ["run", "nombre", "correo", "password", "region", "comuna"].forEach(limpiarError);

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
    } else if (password.length < 8) {
        mostrarError("password", "La contraseña debe tener al menos 8 caracteres.");
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

function estaEnRangoParametro(codigoParametro, valor) {
    const val = parseFloat(valor);
    if (isNaN(val)) return false;

    switch (codigoParametro) {
        case "CAL001":
            return val >= 3.0 && val <= 3.5;
        case "CAL002":
            return val >= 65 && val <= 70;
        case "CAL003":
            return val >= 0.5 && val <= 1.0;
        case "CAL004":
            return val >= 5 && val <= 8;
        case "CAL005":
            return val >= 0 && val < 100;
        default:
            return true;
    }
}

function validarFormLote(e) {
    e.preventDefault();
    let valido = true;

    const codigoLote = document.getElementById("codigo-lote").value.trim();
    const productoLote = document.getElementById("producto-lote").value;
    const parametroLote = document.getElementById("parametro-lote").value;
    const valorParametro = document.getElementById("valor-parametro").value.trim();
    const estadoLote = document.getElementById("estado-lote").value;
    const observacionesLote = document.getElementById("observaciones-lote").value.trim();

    [
        "codigo-lote",
        "producto-lote",
        "parametro-lote",
        "valor-parametro",
        "estado-lote",
        "observaciones-lote"
    ].forEach(limpiarError);

    if (codigoLote === "") {
        mostrarError("codigo-lote", "El código de lote es obligatorio.");
        valido = false;
    } else if (codigoLote.length < 5) {
        mostrarError("codigo-lote", "Ingresa un código válido, ej: LOT-2026-001.");
        valido = false;
    }

    if (productoLote === "") {
        mostrarError("producto-lote", "Debe seleccionar un producto del catálogo.");
        valido = false;
    }

    if (parametroLote === "") {
        mostrarError("parametro-lote", "Debe seleccionar el parámetro de calidad a evaluar.");
        valido = false;
    }

    if (valorParametro === "") {
        mostrarError("valor-parametro", "Ingrese el valor medido en laboratorio.");
        valido = false;
    } else if (isNaN(valorParametro) || parseFloat(valorParametro) < 0) {
        mostrarError("valor-parametro", "Ingrese un valor numérico válido mayor o igual a 0.");
        valido = false;
    }

    if (estadoLote === "") {
        mostrarError("estado-lote", "Seleccione el estado de calidad del lote.");
        valido = false;
    }

    if (parametroLote !== "" && valorParametro !== "") {
        const dentroDeRango = estaEnRangoParametro(parametroLote, valorParametro);
        if (!dentroDeRango && estadoLote === "Conforme") {
            mostrarError("estado-lote", "Atención: El valor está fuera del rango de calidad aceptable, no puede registrarse como 'Conforme'.");
            valido = false;
        }
    }

    if (estadoLote === "No conforme" && observacionesLote === "") {
        mostrarError("observaciones-lote", "Debe ingresar observaciones y acciones correctivas para lotes no conformes.");
        valido = false;
    }

    if (valido) {
        alert("¡Registro de Control de Calidad guardado exitosamente!");
        e.target.reset();
    }
}

function validarFormDevolucion(e) {
    e.preventDefault();
    let valido = true;

    const loteDevolucion = document.getElementById("lote-devolucion").value.trim();
    const clienteDevolucion = document.getElementById("cliente-devolucion").value.trim();
    const cantidadDevolucion = document.getElementById("cantidad-devolucion").value.trim();
    const motivoDevolucion = document.getElementById("motivo-devolucion").value.trim();

    [
        "lote-devolucion",
        "cliente-devolucion",
        "cantidad-devolucion",
        "motivo-devolucion"
    ].forEach(limpiarError);

    if (loteDevolucion === "") {
        mostrarError("lote-devolucion", "El código de lote afectado es obligatorio.");
        valido = false;
    }

    if (clienteDevolucion === "") {
        mostrarError("cliente-devolucion", "El nombre del cliente o empresa es obligatorio.");
        valido = false;
    } else if (clienteDevolucion.length < 3) {
        mostrarError("cliente-devolucion", "Ingrese un nombre de cliente más completo.");
        valido = false;
    }

    if (cantidadDevolucion === "") {
        mostrarError("cantidad-devolucion", "Indique la cantidad devuelta.");
        valido = false;
    } else if (parseInt(cantidadDevolucion, 10) <= 0 || isNaN(cantidadDevolucion)) {
        mostrarError("cantidad-devolucion", "La cantidad debe ser un número entero mayor a 0.");
        valido = false;
    }

    if (motivoDevolucion === "") {
        mostrarError("motivo-devolucion", "Debe explicar el motivo o defecto detectado.");
        valido = false;
    } else if (motivoDevolucion.length < 10) {
        mostrarError("motivo-devolucion", "Describa la causa con mayor detalle (mínimo 10 caracteres).");
        valido = false;
    }

    if (valido) {
        alert("¡Devolución registrada correctamente!");
        e.target.reset();
    }
}