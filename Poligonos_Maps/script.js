/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let map, drawingManager;
let polygons = [];
let polyCount = 0;
let currentColor = '#00e5ff';
let currentOpacity = 0.35;
let currentStroke = 2;
let isDrawing = false;
let mapsLoaded = false;

/* ─────────────────────────────────────────
   LOAD GOOGLE MAPS DYNAMICALLY
───────────────────────────────────────── */
function loadGoogleMaps() {
    const key = document.getElementById('api-key-input').value.trim();
    if (!key) { alert('Por favor ingresa una API Key válida.'); return; }
    if (mapsLoaded) { alert('El mapa ya está cargado. Recarga la página para usar otra key.'); return; }

    const btn = document.getElementById('load-map-btn');
    btn.textContent = 'CARGANDO…';
    btn.disabled = true;

    window.initMap = initMap; // expose callback

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=drawing&callback=initMap`;
    script.onerror = () => {
        btn.textContent = 'ERROR — REINTENTAR';
        btn.disabled = false;
        alert('No se pudo cargar Google Maps. Verifica tu API Key y que las APIs "Maps JavaScript API" y "Drawing Library" estén habilitadas.');
    };
    document.head.appendChild(script);
}

/* ─────────────────────────────────────────
   INIT MAP
───────────────────────────────────────── */
function initMap() {
    mapsLoaded = true;
    document.getElementById('map-placeholder').style.display = 'none';
    const mapEl = document.getElementById('map');
    mapEl.style.display = 'block';

    document.getElementById('api-banner').style.background = 'rgba(34,197,94,.85)';
    document.getElementById('load-map-btn').textContent = '✓ CARGADO';

    map = new google.maps.Map(mapEl, {
        center: { lat: 19.4326, lng: -99.1332 },
        zoom: 12,
        mapTypeId: 'roadmap',
        styles: darkMapStyle(),
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
    });

    // Drawing Manager
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: getPolyOptions(),
    });
    drawingManager.setMap(map);

    // Listen for completed polygons
    google.maps.event.addListener(drawingManager, 'polygoncomplete', onPolygonComplete);

    // ESC to cancel
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isDrawing) cancelDrawing();
    });

    document.getElementById('instructions').classList.remove('visible');
}

/* ─────────────────────────────────────────
   DRAWING CONTROLS
───────────────────────────────────────── */
function getPolyOptions() {
    return {
        fillColor: currentColor,
        fillOpacity: currentOpacity,
        strokeColor: currentColor,
        strokeWeight: currentStroke,
        strokeOpacity: 0.9,
        clickable: true,
        editable: false,
        zIndex: 1,
    };
}

function startDrawing() {
    if (!mapsLoaded) { alert('Primero carga el mapa con tu API Key.'); return; }
    isDrawing = true;
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    drawingManager.set('polygonOptions', getPolyOptions());
    setStatus('DIBUJANDO', 'drawing');
    document.getElementById('instructions').classList.add('visible');
}

function cancelDrawing() {
    drawingManager.setDrawingMode(null);
    isDrawing = false;
    setStatus('LISTO', '');
    document.getElementById('instructions').classList.remove('visible');
}

function finishPolygon() {
    // Triggers 'polygoncomplete' if user double-clicked; otherwise just cancel drawing mode.
    cancelDrawing();
}

function onPolygonComplete(polygon) {
    isDrawing = false;
    drawingManager.setDrawingMode(null);
    setStatus('GUARDADO', 'done');
    document.getElementById('instructions').classList.remove('visible');

    setTimeout(() => setStatus('LISTO', ''), 2000);

    // Store polygon
    polyCount++;
    const name = `Zona-${polyCount}`;
    const color = currentColor;
    polygons.push({ polygon, name, color });

    // Make editable on click
    polygon.addListener('click', () => {
        polygon.setEditable(!polygon.getEditable());
    });

    renderPolyList();
}

function clearAll() {
    if (!mapsLoaded) return;
    polygons.forEach(p => p.polygon.setMap(null));
    polygons = [];
    polyCount = 0;
    renderPolyList();
    cancelDrawing();
}

/* ─────────────────────────────────────────
   SIDEBAR LIST
───────────────────────────────────────── */
function renderPolyList() {
    const el = document.getElementById('polygon-list');
    if (polygons.length === 0) {
        el.innerHTML = '<p style="font-size:0.78rem; color:var(--muted);">Ningún polígono aún.</p>';
        return;
    }
    el.innerHTML = polygons.map((p, i) => `
    <div class="poly-item" id="poly-item-${i}">
      <div class="poly-dot" style="background:${p.color}; box-shadow:0 0 6px ${p.color}55"></div>
      <span class="poly-name">${p.name}</span>
      <button class="poly-delete" onclick="deletePolygon(${i})" title="Eliminar">×</button>
    </div>
  `).join('');
}

function deletePolygon(index) {
    polygons[index].polygon.setMap(null);
    polygons.splice(index, 1);
    renderPolyList();
}

/* ─────────────────────────────────────────
   PREDEFINED ZONES
───────────────────────────────────────── */
const ZONES = {
    cdmx: {
        center: { lat: 19.4326, lng: -99.1332 }, zoom: 12,
        color: '#00e5ff',
        coords: [
            { lat: 19.5280, lng: -99.2408 }, { lat: 19.5280, lng: -99.0175 },
            { lat: 19.3200, lng: -99.0175 }, { lat: 19.3200, lng: -99.2408 }
        ]
    },
    newyork: {
        center: { lat: 40.7828, lng: -73.9654 }, zoom: 14,
        color: '#ff6b35',
        coords: [
            { lat: 40.7969, lng: -73.9580 }, { lat: 40.7969, lng: -73.9495 },
            { lat: 40.7642, lng: -73.9735 }, { lat: 40.7644, lng: -73.9815 }
        ]
    },
    barcelona: {
        center: { lat: 41.3837, lng: 2.1762 }, zoom: 16,
        color: '#7c3aed',
        coords: [
            { lat: 41.3885, lng: 2.1701 }, { lat: 41.3885, lng: 2.1804 },
            { lat: 41.3793, lng: 2.1815 }, { lat: 41.3787, lng: 2.1713 }
        ]
    },
    bogota: {
        center: { lat: 4.5981, lng: -74.0760 }, zoom: 15,
        color: '#22c55e',
        coords: [
            { lat: 4.6062, lng: -74.0840 }, { lat: 4.6062, lng: -74.0711 },
            { lat: 4.5902, lng: -74.0705 }, { lat: 4.5900, lng: -74.0836 }
        ]
    },
    paris: {
        center: { lat: 48.8539, lng: 2.3470 }, zoom: 15,
        color: '#f59e0b',
        coords: [
            { lat: 48.8565, lng: 2.3408 }, { lat: 48.8578, lng: 2.3552 },
            { lat: 48.8505, lng: 2.3549 }, { lat: 48.8499, lng: 2.3408 }
        ]
    }
};

function loadZone(key) {
    if (!mapsLoaded) { alert('Primero carga el mapa con tu API Key.'); return; }
    const z = ZONES[key];
    map.setCenter(z.center);
    map.setZoom(z.zoom);

    // Temporarily set color
    const prevColor = currentColor;
    currentColor = z.color;

    const polygon = new google.maps.Polygon({
        paths: z.coords,
        ...getPolyOptions(),
        map,
    });

    currentColor = prevColor;

    polygon.addListener('click', () => {
        polygon.setEditable(!polygon.getEditable());
    });

    polyCount++;
    const name = key.charAt(0).toUpperCase() + key.slice(1);
    polygons.push({ polygon, name: `${name}-${polyCount}`, color: z.color });
    renderPolyList();
    setStatus('ZONA CARGADA', 'done');
    setTimeout(() => setStatus('LISTO', ''), 2000);
}

/* ─────────────────────────────────────────
   COLOR & STYLE
───────────────────────────────────────── */
function selectColor(el) {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    currentColor = el.dataset.color;
    document.getElementById('custom-color').value = currentColor;
}

function customColor(el) {
    currentColor = el.value;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
}

function updateOpacity(el) {
    currentOpacity = el.value / 100;
    document.getElementById('opacity-val').textContent = el.value + '%';
}

function updateStroke(el) {
    currentStroke = parseInt(el.value);
    document.getElementById('stroke-val').textContent = el.value + 'px';
}

/* ─────────────────────────────────────────
   STATUS
───────────────────────────────────────── */
function setStatus(text, cls) {
    const pill = document.getElementById('status-pill');
    pill.textContent = text;
    pill.className = '';
    if (cls) pill.classList.add(cls);
}

/* ─────────────────────────────────────────
   DARK MAP STYLE
───────────────────────────────────────── */
function darkMapStyle() {
    return [
        { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1a2332' }] },
        { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#2d3748' }] },
        { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#111827' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#111827' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
        { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#0f2018' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0d1117' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e2d45' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#111827' }] },
        { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#718096' }] },
        { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#111827' }] },
        { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#718096' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0f1a' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1a2d4f' }] },
        { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#0a0f1a' }] },
    ];
}