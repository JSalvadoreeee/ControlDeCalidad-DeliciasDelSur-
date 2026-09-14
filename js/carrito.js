document.addEventListener("DOMContentLoaded", () => {

    const btnAgregar = document.getElementById("btn-agregar");
    if (btnAgregar) {
        btnAgregar.addEventListener("click", agregarAlCarrito);
    }

    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
        btnPagar.addEventListener("click", procesarPago);
    }

    if (document.getElementById("lista-carrito")) {
        renderizarCarrito();
    }

    actualizarContadorCarrito();
});

function obtenerCarrito() {
    const datos = localStorage.getItem("carrito");
    return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito() {
    const boton = document.getElementById("btn-agregar");
    const codigo = boton.dataset.codigo;
    const nombre = boton.dataset.nombre;
    const precio = parseInt(boton.dataset.precio, 10);
    const inputCantidad = document.querySelector('input[type="number"]');
    const cantidad = inputCantidad ? Math.max(1, parseInt(inputCantidad.value, 10) || 1) : 1;

    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.codigo === codigo);

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ codigo, nombre, precio, cantidad });
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
    alert(`${nombre} agregado al carrito.`);
}

function eliminarDelCarrito(codigo) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.codigo !== codigo);
    guardarCarrito(carrito);
    renderizarCarrito();
    actualizarContadorCarrito();
}

function renderizarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const totalSpan = document.getElementById("total-carrito");
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío por el momento.</p>";
        if (totalSpan) totalSpan.textContent = "0";
        return;
    }

    let html = "";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <div class="item-carrito">
                <span>${item.nombre} (${item.codigo})</span>
                <span>Cantidad: ${item.cantidad}</span>
                <span>$${subtotal.toLocaleString("es-CL")} CLP</span>
                <button class="btn-sm alert" onclick="eliminarDelCarrito('${item.codigo}')">Quitar</button>
            </div>
        `;
    });

    contenedor.innerHTML = html;
    if (totalSpan) totalSpan.textContent = total.toLocaleString("es-CL");
}

function procesarPago() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    alert(`¡Gracias por tu compra! Tu pedido por un total de $${total.toLocaleString("es-CL")} CLP ha sido procesado exitosamente.`);

    localStorage.removeItem("carrito");
    renderizarCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    document.querySelectorAll(".user-actions a[href='carrito.html']").forEach(enlace => {
        enlace.textContent = `Carro (${totalItems})`;
    });
}