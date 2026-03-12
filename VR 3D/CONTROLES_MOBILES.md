# Controles Móviles - AR World VR 3D

## 🎮 Descripción
El proyecto ha sido adaptado para funcionar completamente en dispositivos móviles (teléfonos y tablets) con controles táctiles nativos.

## 📱 Detección Automática
El sistema detecta automáticamente si estás usando:
- Un teléfono o tablet (por user-agent)
- Pantalla táctil
- Pantalla menor a 768px de ancho

Si se detecta un dispositivo móvil, los controles de escritorio se reemplazan automáticamente con los controles táctiles.

## 🕹️ Controles Móviles

### 1. **Joystick de Movimiento** (Esquina Inferior Izquierda)
- **Ubicación**: Parte inferior izquierda de la pantalla
- **Apariencia**: Círculo cian con stick interior
- **Uso**: 
  - Toca y arrastra el joystick para moverte
  - Arriba/Abajo = Avanzar/Retroceder
  - Izquierda/Derecha = Girar hacia los lados
  - El movimiento es relativo a la dirección de la cámara

### 2. **Zona de Control de Cámara** (Esquina Inferior Derecha)
- **Ubicación**: Parte inferior derecha de la pantalla
- **Apariencia**: Cuadrado púrpura punteado
- **Uso**:
  - Toca y arrastra para rotar la cámara
  - Movimiento horizontal = Giro izquierda/derecha
  - Movimiento vertical = Mirada arriba/abajo
  - La rotación está limitada para evitar inversiones

## ⚙️ Personalización

### Ajustar la Velocidad de Movimiento
Abre `script.js` y encuentra esta línea:
```javascript
const movementSpeed = 0.18; // Ajusta este valor
```
- **Mayor número** = Movimiento más rápido
- **Menor número** = Movimiento más lento

### Ajustar la Sensibilidad de la Cámara
Abre `script.js` y encuentra esta línea:
```javascript
const sensitivity = 0.6; // Ajusta este valor
```
- **Mayor número** = Cámara más sensible
- **Menor número** = Cámara menos sensible

### Cambiar el Tamaño del Joystick
Abre `style.css` y busca `#joystick-container`:
```css
#joystick-container {
    width: 120px;   /* Ancho */
    height: 120px;  /* Alto */
}
```

## 🖥️ Escritorio - Controles que Siguen Funcionando
En computadora de escritorio, los controles originales siguen disponibles:
- **W A S D** para movimiento
- **Mouse** para mirar alrededor
- **Click** para capturar el cursor

## 📋 Archivos Modificados
1. **index.html** - Agregados elementos del joystick
2. **script.js** - Sistema de controles táctiles completo
3. **style.css** - Estilos para joystick y controles móviles

## 🐛 Solución de Problemas

### El joystick no aparece
- Verifica que estés en un dispositivo móvil o con pantalla táctil
- Abre la consola (F12) y busca "Mobile controls initialized"

### Los controles no responden
- Intenta recargar la página
- Verifica que los elementos estén visibles en DevTools
- Asegúrate de que no hay conflictos con extensions del navegador

### La cámara rota lentamente
- Aumenta el valor de `sensitivity` en script.js
- Intenta tocar y arrastrar más rápido

## 🎨 Características Visuales
- **Joystick**: Brilla con efecto cian con sombras dinámicas
- **Zona de cámara**: Marco punteado púrpura con indicador visual
- **Feedback háptico**: El joystick se mueve suavemente
- **Opacidad**: Los controles son semi-transparentes para no cubrir mucho

## 📱 Probado en
- iPhone (iOS)
- Android (Chrome Mobile, Firefox Mobile)
- iPad
- Tablets Android
- Navegadores con soporte táctil

---

**¿Preguntas?** Revisa la consola del navegador (F12) para mensajes de debug.
