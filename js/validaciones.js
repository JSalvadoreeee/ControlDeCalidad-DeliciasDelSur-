// Validaciones de formularios: login, registro, contacto y panel de administración

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    const formRegistro = document.getElementById("form-registro");
    const formContacto = document.getElementById("form-contacto");

    // Formularios de Administración
    const formLote = document.getElementById("form-lote");
    const formDevolucion = document.getElementById("form-devolucion");

    // Se conecta cada formulario con su función de validación al enviarlo (submit)
    if (formLogin) formLogin.addEventListener("submit", validarLogin);
    if (formRegistro) formRegistro.addEventListener("submit", validarRegistro);
    if (formContacto) formContacto.addEventListener("submit", validarContacto);
    if (formLote) formLote.addEventListener("submit", validarFormLote);
    if (formDevolucion) formDevolucion.addEventListener("submit", validarFormDevolucion);
});

// ===================== Utilidades =====================

// Muestra un mensaje de error bajo el campo (usa el <span id="error-idCampo">)
// y le agrega la clase CSS "input-error" al input para marcarlo en rojo
function mostrarError(idCampo, mensaje) {
    const span = document.getElementById("error-" + idCampo);
    if (span) span.textContent = mensaje;
    const input = document.getElementById(idCampo);
    if (input) input.classList.add("input-error");
}

// Limpia el mensaje de error y le saca la marca roja al campo
// (se llama al inicio de cada validación, antes de revisar de nuevo)
function limpiarError(idCampo) {
    const span = document.getElementById("error-" + idCampo);
    if (span) span.textContent = "";
    const input = document.getElementById(idCampo);
    if (input) input.classList.remove("input-error");
}

// Valida formato de correo de forma estricta:
// - usuario: letras/números y . _ % + - (sin empezar o terminar con esos símbolos)
// - dominio: letras/números, puede tener puntos o guiones intermedios
// - termina en un punto + mínimo 2 letras (ej: .cl, .com)
// Esto rechaza casos como "k.@ja" o "ss@jd.f" que con un regex más simple pasarían
function esCorreoValido(correo) {
    const regex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
}

// Valida un RUT/RUN chileno completo (no solo el formato, también el dígito verificador real)
function validarRun(run) {
    // 1) Limpia puntos y guión, y pasa la K a mayúscula, para trabajar siempre igual
    const limpio = run.replace(/\./g, "").replace(/-/g, "").toUpperCase();

    // 2) Revisa que sean solo números y que termine en número o "K"
    if (!/^[0-9]+[0-9K]$/.test(limpio)) return false;

    // 3) Separa el cuerpo (números) del dígito verificador (último carácter)
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    // 4) Algoritmo módulo 11: multiplica cada dígito (de derecha a izquierda)
    //    por una secuencia que va de 2 a 7 y se repite
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    // 5) Calcula el dígito verificador esperado según el resultado de la suma
    const resto = 11 - (suma % 11);
    let dvEsperado;
    if (resto === 11) dvEsperado = "0";
    else if (resto === 10) dvEsperado = "K";
    else dvEsperado = String(resto);

    // 6) Compara el dígito verificador ingresado contra el calculado
    return dv === dvEsperado;
}

// ===================== Login =====================

function validarLogin(e) {
    e.preventDefault(); // evita que el formulario se envíe/recargue la página
    let valido = true;

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;

    limpiarError("correo");
    limpiarError("password");

    // Correo: obligatorio y con formato válido
    if (correo === "") {
        mostrarError("correo", "El correo es obligatorio.");
        valido = false;
    } else if (!esCorreoValido(correo)) {
        mostrarError("correo", "Ingresa un correo con formato válido, ej: nombre@correo.com");
        valido = false;
    }

    // Contraseña: obligatoria y mínimo 6 caracteres
    if (password === "") {
        mostrarError("password", "La contraseña es obligatoria.");
        valido = false;
    } else if (password.length < 6) {
        mostrarError("password", "La contraseña debe tener al menos 6 caracteres.");
        valido = false;
    }

    // Si todo pasó, se simula el envío (no hay backend real conectado)
    if (valido) {
        alert("Inicio correcto");
        e.target.reset();
    }
}

// ===================== Registro =====================

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

    // RUN: obligatorio y debe pasar la validación completa (formato + dígito verificador)
    if (run === "") {
        mostrarError("run", "El RUN es obligatorio.");
        valido = false;
    } else if (!validarRun(run)) {
        mostrarError("run", "El RUN no es válido. Revisa el número y el dígito verificador.");
        valido = false;
    }

    // Nombre completo: solo letras (con tildes y ñ) y espacios
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (nombre === "") {
        mostrarError("nombre", "El nombre es obligatorio.");
        valido = false;
    } else if (!soloLetras.test(nombre)) {
        mostrarError("nombre", "El nombre solo puede contener letras.");
        valido = false;
    }

    // Correo: mismo formato estricto que el login
    if (correo === "") {
        mostrarError("correo", "El correo es obligatorio.");
        valido = false;
    } else if (!esCorreoValido(correo)) {
        mostrarError("correo", "Ingresa un correo con formato válido, ej: nombre@correo.com");
        valido = false;
    }

    // Contraseña: obligatoria y mínimo 8 caracteres (según el placeholder del HTML)
    if (password === "") {
        mostrarError("password", "La contraseña es obligatoria.");
        valido = false;
    } else if (password.length < 8) {
        mostrarError("password", "La contraseña debe tener al menos 8 caracteres.");
        valido = false;
    }

    // Región y comuna: deben estar seleccionadas
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

// ===================== Contacto =====================

function validarContacto(e) {
    e.preventDefault();
    let valido = true;

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const comentario = document.getElementById("comentario").value.trim();

    ["nombre", "correo", "comentario"].forEach(limpiarError);

    // Nombre: solo se pide que no esté vacío
    if (nombre === "") {
        mostrarError("nombre", "El nombre es obligatorio.");
        valido = false;
    }

    // Correo: mismo formato estricto
    if (correo === "") {
        mostrarError("correo", "El correo es obligatorio.");
        valido = false;
    } else if (!esCorreoValido(correo)) {
        mostrarError("correo", "Ingresa un correo con formato válido, ej: nombre@correo.com");
        valido = false;
    }

    // Comentario: obligatorio y con mínimo de caracteres para evitar mensajes vacíos tipo "ok"
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

// ===================== Administrador =====================

// Revisa si un valor de laboratorio está dentro del rango aceptable
// según el parámetro de calidad seleccionado (basado en la tabla del caso de estudio)
function estaEnRangoParametro(codigoParametro, valor) {
    const val = parseFloat(valor);
    if (isNaN(val)) return false;

    switch (codigoParametro) {
        case "CAL001": // pH (3.0 - 3.5)
            return val >= 3.0 && val <= 3.5;
        case "CAL002": // Brix (65 - 70)
            return val >= 65 && val <= 70;
        case "CAL003": // Acidez (0.5 - 1.0)
            return val >= 0.5 && val <= 1.0;
        case "CAL004": // Humedad (5 - 8)
            return val >= 5 && val <= 8;
        case "CAL005": // Recuento Microbiológico (< 100)
            return val >= 0 && val < 100;
        default:
            return true;
    }
}

// Registro y evaluación de lotes (panel de administración)
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

    // Código de lote: obligatorio y con un largo mínimo (ej: LOT-2026-001)
    if (codigoLote === "") {
        mostrarError("codigo-lote", "El código de lote es obligatorio.");
        valido = false;
    } else if (codigoLote.length < 5) {
        mostrarError("codigo-lote", "Ingresa un código válido, ej: LOT-2026-001.");
        valido = false;
    }

    // Producto y parámetro: deben estar seleccionados
    if (productoLote === "") {
        mostrarError("producto-lote", "Debe seleccionar un producto del catálogo.");
        valido = false;
    }

    if (parametroLote === "") {
        mostrarError("parametro-lote", "Debe seleccionar el parámetro de calidad a evaluar.");
        valido = false;
    }

    // Valor medido: obligatorio, numérico y no negativo
    if (valorParametro === "") {
        mostrarError("valor-parametro", "Ingrese el valor medido en laboratorio.");
        valido = false;
    } else if (isNaN(valorParametro) || parseFloat(valorParametro) < 0) {
        mostrarError("valor-parametro", "Ingrese un valor numérico válido mayor o igual a 0.");
        valido = false;
    }

    // Estado de calidad: debe estar seleccionado
    if (estadoLote === "") {
        mostrarError("estado-lote", "Seleccione el estado de calidad del lote.");
        valido = false;
    }

    // Validación cruzada: si el valor está fuera del rango aceptable,
    // no se puede marcar el lote como "Conforme"
    if (parametroLote !== "" && valorParametro !== "") {
        const dentroDeRango = estaEnRangoParametro(parametroLote, valorParametro);
        if (!dentroDeRango && estadoLote === "Conforme") {
            mostrarError("estado-lote", "Atención: El valor está fuera del rango de calidad aceptable, no puede registrarse como 'Conforme'.");
            valido = false;
        }
    }

    // Si el lote es "No conforme", es obligatorio explicar qué se hizo al respecto
    if (estadoLote === "No conforme" && observacionesLote === "") {
        mostrarError("observaciones-lote", "Debe ingresar observaciones y acciones correctivas para lotes no conformes.");
        valido = false;
    }

    if (valido) {
        alert("¡Registro de Control de Calidad guardado exitosamente!");
        e.target.reset();
    }
}

// Registro de devoluciones y desviaciones (panel de administración)
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

    // Código de lote afectado: obligatorio
    if (loteDevolucion === "") {
        mostrarError("lote-devolucion", "El código de lote afectado es obligatorio.");
        valido = false;
    }

    // Cliente/empresa: obligatorio y con mínimo de caracteres
    if (clienteDevolucion === "") {
        mostrarError("cliente-devolucion", "El nombre del cliente o empresa es obligatorio.");
        valido = false;
    } else if (clienteDevolucion.length < 3) {
        mostrarError("cliente-devolucion", "Ingrese un nombre de cliente más completo.");
        valido = false;
    }

    // Cantidad devuelta: obligatoria, numérica y mayor a 0
    if (cantidadDevolucion === "") {
        mostrarError("cantidad-devolucion", "Indique la cantidad devuelta.");
        valido = false;
    } else if (parseInt(cantidadDevolucion, 10) <= 0 || isNaN(cantidadDevolucion)) {
        mostrarError("cantidad-devolucion", "La cantidad debe ser un número entero mayor a 0.");
        valido = false;
    }

    // Motivo: obligatorio y con un mínimo de caracteres para que sea explicativo
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