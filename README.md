# Bruma · Clima

Proyecto para practicar HTML semántico, CSS y eventos con JavaScript.

## Abrir el sitio

La página se publica con GitHub Pages. No necesita instalar dependencias ni configurar claves.

Para practicar localmente, abrir esta carpeta en VS Code y ejecutar **Live Server** sobre `index.html`, o usar `python3 -m http.server 8080` y visitar http://localhost:8080.

## Archivos

- `index.html`: estructura semántica y tarjetas.
- `styles.css`: estilos organizados por sección, con adaptación a celulares.
- `app.js`: elementos, funciones tradicionales, eventos y carga inicial.
- `api.js`: consultas a Open-Meteo y preparación de los datos. Usa `async/await` y `try/catch`.
- `.github/workflows/pages.yml`: verificación y publicación automática al actualizar `main`.

## Eventos para practicar

1. `submit`: buscar una ciudad sin recargar el sitio, con `preventDefault()`.
2. `click`: cambiar entre Celsius y Fahrenheit con un `if`.
3. `click`: seleccionar un día del pronóstico con un bucle `for`.
4. `click`: consultar otra ciudad.
5. `click`: abrir y cerrar el cuadro de información.

Las funciones están escritas con `function`, sin funciones flecha. La geolocalización requiere permiso del navegador. El índice UV corresponde al máximo del día.

## Publicación

En **Settings → Pages → Build and deployment**, seleccionar **GitHub Actions**. Cada cambio en `main` vuelve a publicar el sitio. El estado aparece en la pestaña **Actions**.

Esta versión usa [Open-Meteo](https://open-meteo.com/) porque GitHub Pages sirve archivos estáticos y no ejecuta servidores Node. No se incluyen credenciales ni informes. Las imágenes del paisaje y las fuentes requieren conexión a Internet.

Datos meteorológicos: [Open-Meteo](https://open-meteo.com/), bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Geocodificación basada en GeoNames a través de Open-Meteo. Paisaje de Unsplash; fuentes de Google Fonts.
