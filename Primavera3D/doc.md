# 🌸 Documentación: Proyecto Valle Primaveral 3D (Modular)

## 🎯 Objetivo de la Actividad
Desarrollar una simulación interactiva en 3D que represente una escena primaveral utilizando **JavaScript (Three.js)**. El proyecto integra elementos visuales, animaciones procedimentales, un ciclo de iluminación dinámico y controles de usuario para una experiencia inmersiva.

---

## 🔧 Ficha Técnica
* **Plataforma:** Web (Opción B)
* **Lenguaje:** JavaScript (ES6+)
* **Librería Principal:** [Three.js](https://threejs.org/)
* **Módulos Adicionales:** PointerLockControls (para navegación FPS)
* **Arquitectura:** Diseño modular (5 archivos: `index.html`, `main.js`, `core.js`, `flora.js`, `fauna.js`)

---

## 📦 Elementos Implementados en la Escena

### 🌳 Paisaje y Vegetación (Flora)
* **Árboles Ghibli-Style:** Troncos modelados con cilindros y copas frondosas creadas mediante agrupaciones de dodecaedros para un look "esponjoso".
* **Flores Detalladas:** Sistema procedimental que genera flores con tallo, pistilo y pétalos individuales con colores aleatorios.
* **Pasto Silvestre:** Racimos de geometría cónica distribuidos por todo el terreno para dar textura orgánica al suelo.
* **Terreno:** Plano de 300x300 unidades con deformaciones matemáticas (Seno/Coseno) para evitar la monotonía de una superficie plana.

### 🐦 Fauna Animada (Fauna)
* **Abejas Realistas:** Modelos compuestos por cápsulas, franjas negras y alas traslúcidas.
* **Vuelo Aleatorio:** Las abejas utilizan curvas de Lissajous y ruido aleatorio para desplazarse por el mapa, evitando rutas lineales aburridas.

### 🌞 Clima y Atmosfera
* **Ciclo de 24 Horas:** Un reloj interno que gestiona el paso del tiempo.
* **Iluminación Dinámica:** Transición suave de colores (Interpolación LERP) entre Amanecer (rosado), Día (azul), Atardecer (naranja) y Noche (azul profundo).
* **Sol y Luna:** Dos astros que orbitan el valle en posiciones opuestas.
* **Sistema de Estrellas:** Partículas que aparecen progresivamente cuando la luminosidad del cielo baja.
* **Nubes:** Grupos de esferas achatadas que flotan a distintas alturas para dar profundidad.

### ✨ Partículas Ambientales
* **Polen/Pétalos:** 500 partículas traslúcidas de color crema que caen suavemente y se balancean con el viento, reciclándose al tocar el suelo.

---

## 🌷 Animaciones Principales
1.  **Vuelo de Abejas:** Animación de posición y rotación (`lookAt`) combinada con un aleteo de alas de alta frecuencia mediante funciones de seno.
2.  **Crecimiento Orgánico:** Al plantar una flor, esta escala de 0 a 1.2 utilizando una animación elástica en el bucle de renderizado.
3.  **Ciclo Solar:** Movimiento orbital de las fuentes de luz y cambio de intensidad en tiempo real según la hora del día.
4.  **Caminar (Head Bob):** Movimiento sutil de la cámara al desplazarse para simular el paso humano.

---

## 🛠️ Instrucciones de Ejecución
Debido al uso de módulos de JavaScript (`import/export`), el proyecto requiere un servidor local para funcionar (por razones de seguridad del navegador/CORS).

1.  Guardar los 5 archivos en una misma carpeta.
2.  Abrir la carpeta con un editor (como VS Code).
3.  Ejecutar con la extensión **Live Server** o cualquier servidor HTTP local.
4.  **Controles:**
    * **Clic en pantalla:** Bloquea el puntero y entra al mundo.
    * **WASD:** Movimiento del personaje.
    * **Mouse:** Cámara 360°.
    * **Clic Izquierdo:** Planta una flor detallada 3 pasos delante de la posición actual.

---

## 📄 Explicación Técnica y Dificultades
### ¿Qué se animó?
Se animó el sistema solar (órbita), la fauna (vuelo y aleteo), el crecimiento de la flora y el sistema de partículas ambiental. Todo se gestiona dentro de un único bucle `requestAnimationFrame` para garantizar 60 FPS.

### Herramientas usadas
Se utilizó exclusivamente **Three.js** con geometrías básicas manipuladas mediante código (escalado, traslación de pivotes y normales). La interfaz de usuario utiliza **CSS Glassmorphism** para un look moderno.

### Dificultades y Soluciones
* **Suelo Irregular:** Al hacer el suelo ondulado, los árboles parecían flotar. Se solucionó alargando la geometría de los troncos y hundiéndolos por debajo del nivel cero.
* **Visibilidad en Niebla:** La niebla ocultaba el sol y las estrellas por la distancia. Se solucionó aplicando la propiedad `fog: false` específicamente a los materiales de los astros.
* **Escalabilidad:** Mantener todo el código en un archivo se volvió inmanejable. Se migró a una arquitectura de módulos (`core`, `flora`, `fauna`) para facilitar el mantenimiento.

---

## ✅ Autoevaluación (Basada en Criterios)
* **Ambientación:** 20/20 (Nubes, pasto, flores y árboles frondosos).
* **Animación:** 20/20 (Abejas con aleteo y crecimiento de flores).
* **Iluminación:** 15/15 (Ciclo completo día/noche con interpolación de colores).
* **Creatividad:** 20/20 (Interacción de plantar flores y diseño Ghibli).
* **Documentación:** 15/15 (Este archivo Markdown).

**Total Estimado: 90/100** *(Falta sonido para el 100)*.