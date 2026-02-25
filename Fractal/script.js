
// ════════════════════════════════════════════════════════════════
// CLASE KOCH FRACTAL
// ════════════════════════════════════════════════════════════════

class KochFractal {
    constructor(lado = 1.0) {
        this.lado = lado;
        this.DIM_HAUSDORFF = Math.log(4) / Math.log(3); // ≈ 1.2619
    }

    // Método recursivo que aplica la regla de Koch a un segmento
    _segmentoKoch(x1, y1, x2, y2, n, xs, ys) {
        if (n === 0) {
            // Caso base: guardar el punto inicial
            xs.push(x1);
            ys.push(y1);
            return;
        }

        // Dividir el segmento en 3 partes
        const dx = (x2 - x1) / 3;
        const dy = (y2 - y1) / 3;

        const ax = x1 + dx;
        const ay = y1 + dy;
        const bx = x1 + 2 * dx;
        const by = y1 + 2 * dy;

        // Calcular pico del triángulo equilátero (rotar 60° antihorario)
        const angulo = Math.PI / 3;
        const cos_a = Math.cos(angulo);
        const sin_a = Math.sin(angulo);
        const px = ax + dx * cos_a - dy * sin_a;
        const py = ay + dx * sin_a + dy * cos_a;

        // Recursión en los 4 sub-segmentos
        this._segmentoKoch(x1, y1, ax, ay, n - 1, xs, ys);
        this._segmentoKoch(ax, ay, px, py, n - 1, xs, ys);
        this._segmentoKoch(px, py, bx, by, n - 1, xs, ys);
        this._segmentoKoch(bx, by, x2, y2, n - 1, xs, ys);
    }

    // Generar los puntos del copo completo
    generarPuntos(n = 3) {
        const L = this.lado;

        // Vértices del triángulo equilátero inicial (centrado)
        const angulos = [
            Math.PI / 2,
            Math.PI / 2 + (2 * Math.PI) / 3,
            Math.PI / 2 + (4 * Math.PI) / 3
        ];
        const r = L / Math.sqrt(3); // radio circunscrito
        const verts = angulos.map(a => [r * Math.cos(a), r * Math.sin(a)]);

        const xs = [];
        const ys = [];

        // Aplicar Koch a cada lado del triángulo
        for (let i = 0; i < 3; i++) {
            const [x1, y1] = verts[i];
            const [x2, y2] = verts[(i + 1) % 3];
            const xs_temp = [];
            const ys_temp = [];
            this._segmentoKoch(x1, y1, x2, y2, n, xs_temp, ys_temp);
            xs.push(...xs_temp);
            ys.push(...ys_temp);
        }

        // Cerrar el polígono
        xs.push(xs[0]);
        ys.push(ys[0]);

        return { xs, ys };
    }

    // Calcular estadísticas matemáticas
    estadisticas(n) {
        const numSegmentos = 3 * Math.pow(4, n);
        const longSegmento = this.lado * Math.pow(1 / 3, n);
        const perimetro = numSegmentos * longSegmento;
        const areaBase = (Math.sqrt(3) / 4) * this.lado * this.lado;
        const areaTotal =
            areaBase * (8 / 5) * (1 - Math.pow(4 / 9, n)) + areaBase * Math.pow(4 / 9, n);

        return {
            iteracion: n,
            segmentos: numSegmentos,
            longSegmento: longSegmento,
            perimetro: perimetro,
            area: areaTotal,
            dimFractal: this.DIM_HAUSDORFF
        };
    }

    // Dibujar el copo en un canvas
    dibujar(ctx, n = 3, colorLinea = "#4fc3f7", colorRelleno = "#0d2040", grosor = 1.0, relleno = true) {
        const { xs, ys } = this.generarPuntos(n);

        // Encontrar escalas para centrar y ajustar al canvas
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const ancho = maxX - minX || 1;
        const alto = maxY - minY || 1;
        const padding = 30;

        const escalaX = (ctx.canvas.width - 2 * padding) / ancho;
        const escalaY = (ctx.canvas.height - 2 * padding) / alto;
        const escala = Math.min(escalaX, escalaY);

        // Trazar el polígono
        ctx.fillStyle = colorRelleno;
        ctx.strokeStyle = colorLinea;
        ctx.lineWidth = grosor;
        ctx.beginPath();

        for (let i = 0; i < xs.length; i++) {
            const x = (xs[i] - minX) * escala + padding;
            const y = (ys[i] - minY) * escala + padding;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();

        if (relleno) {
            ctx.fill();
        }
        ctx.stroke();
    }
}

// ════════════════════════════════════════════════════════════════
// INTERFAZ Y CONTROLES
// ════════════════════════════════════════════════════════════════

const fractal = new KochFractal(1.0);
const canvas = document.getElementById("canvas-principal");
const ctx = canvas.getContext("2d");

const sliderIteracion = document.getElementById("slider-iteracion");
const valorIteracion = document.getElementById("valor-iteracion");
const btnRelleno = document.getElementById("btn-relleno");
const btnAnimar = document.getElementById("btn-animar");

window.addEventListener("load", () => {
    valorIteracion.textContent = sliderIteracion.value;
    redibujar(parseInt(sliderIteracion.value));
});

const estado = {
    relleno: true,
    animando: false,
    animacionId: null
};

// Actualizar canvas y estadísticas
function redibujar(n = null) {
    if (n === null) {
        n = parseInt(sliderIteracion.value);
    }

    // Limpiar canvas
    ctx.fillStyle = "#05080f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar fractal
    fractal.dibujar(ctx, n, "#4fc3f7", "#0d2040", 1.5, estado.relleno);

    // Actualizar estadísticas
    actualizarStats(n);
}

function actualizarStats(n) {
    const stats = fractal.estadisticas(n);
    document.getElementById("stat-iteracion").textContent = stats.iteracion;
    document.getElementById("stat-segmentos").textContent = stats.segmentos.toLocaleString();
    document.getElementById("stat-long-seg").textContent = stats.longSegmento.toFixed(6);
    document.getElementById("stat-perimetro").textContent = stats.perimetro.toFixed(4);
    document.getElementById("stat-area").textContent = stats.area.toFixed(4);
    document.getElementById("stat-dim").textContent = stats.dimFractal.toFixed(4);
}

// EVENTOS
sliderIteracion.addEventListener("input", (e) => {
    valorIteracion.textContent = e.target.value;
    if (estado.animando) {
        detenerAnimacion();
    }
    redibujar();
});

btnRelleno.addEventListener("click", () => {
    estado.relleno = !estado.relleno;
    btnRelleno.textContent = estado.relleno ? "✓ Relleno ON" : "✗ Relleno OFF";
    redibujar();
});

btnAnimar.addEventListener("click", () => {
    if (estado.animando) {
        detenerAnimacion();
    } else {
        iniciarAnimacion();
    }
});

function iniciarAnimacion() {
    estado.animando = true;
    btnAnimar.textContent = "■ Detener";
    let n = 0;
    const intervalo = 900;

    const animar = () => {
        sliderIteracion.value = n;
        valorIteracion.textContent = n;
        redibujar(n);
        n = (n + 1) % 8;
        estado.animacionId = setTimeout(animar, intervalo);
    };

    estado.animacionId = setTimeout(animar, intervalo);
}

function detenerAnimacion() {
    estado.animando = false;
    btnAnimar.textContent = "▶ Animar";
    if (estado.animacionId) {
        clearTimeout(estado.animacionId);
        estado.animacionId = null;
    }
}