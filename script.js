const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Variables para dimensiones responsivas
let obj = {};

function updateCanvasSize() {
    // Obtener dimensiones del canvas desde CSS
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Actualizar objeto basado en tamaño del canvas
    const squareSize = Math.min(canvas.width, canvas.height) * 0.15; // 15% del canvas más pequeño
    obj = {
        x: (canvas.width / window.devicePixelRatio) / 2 - squareSize / 2,
        y: (canvas.height / window.devicePixelRatio) / 2 - squareSize / 2,
        w: squareSize,
        h: squareSize
    };
}

function draw() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    
    // Obtener valores de los controles
    const pivot = document.getElementById('pivot').value;
    const tx = parseFloat(document.getElementById('transX').value);
    const ty = parseFloat(document.getElementById('transY').value);
    const s = parseFloat(document.getElementById('scale').value);
    const r = parseFloat(document.getElementById('rotate').value) * Math.PI / 180;
    const sk = parseFloat(document.getElementById('skew').value);

    ctx.save(); // Guardar estado base

    // 1. TRASLACIoN: Mover al punto de origen del objeto + valores del usuario
    ctx.translate(obj.x + tx, obj.y + ty);

    // 2. REFERENCIA (Pivot): Si es al centro, movemos el origen al centro del dibujo
    if (pivot === "center") {
        ctx.translate(obj.w / 2, obj.h / 2);
    }

    // 3. APLICAR TRANSFORMACIONES RESTANTES
    ctx.rotate(r);
    ctx.scale(s, s);
    ctx.transform(1, 0, sk, 1, 0, 0); // Matriz para Sesgado (Skew)

    // 4. VOLVER DEL PIVOT: Si movimos al centro, regresamos para dibujar
    if (pivot === "center") {
        ctx.translate(-obj.w / 2, -obj.h / 2);
    }

    // Dibujar el objeto
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(0, 0, obj.w, obj.h);
    
    // Dibujar borde y punto de pivote
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, obj.w, obj.h);
    
    ctx.restore(); // Restaurar estado

    requestAnimationFrame(draw);
}

function resetear() {
    document.querySelectorAll('input').forEach(i => i.value = i.type === "number" ? 0 : (i.id === "scale" ? 1 : 0));
    actualizarEscalamiento();
    actualizarRotacion();
    actualizarSesgado();
}

// Funciones para actualizar valores en tiempo real mientras se arrastra
function actualizarEscalamiento() {
    const valor = document.getElementById('scale').value;
    document.getElementById('valor-escalamiento').innerText = valor;
}

function actualizarRotacion() {
    const valor = document.getElementById('rotate').value;
    document.getElementById('valor-rotacion').innerText = valor;
}

function actualizarSesgado() {
    const valor = document.getElementById('skew').value;
    document.getElementById('valor-sesgado').innerText = valor;
}

// Inicializar tamaño y redimensionar cuando cambie la ventana
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);

draw(); // Iniciar loop de dibujo