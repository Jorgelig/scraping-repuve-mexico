# scraping-repuve-mexico
Script en Node que extrae la información y el status legal de un vehículo - ingresando la placa - desde REPUVE (México).

<h1 align="center">
  Scraping de REPUVE
</h1>

## 🚀 Ponerlo en marcha

**Instalar Librerías.**

```shell
npm install
   ```

**Correr el script.**

```shell
node index.js
   ```
   
Te pedirá ingresar la placa del vehículo y el captcha generado en la carpeta del script (captcha-{context}.jpg), hará la consulta a REPUVE y devolverá la data.

<h2 align="center">Notas:</h2>

- El script es solo una base para adentrarse un poco al scraping con Puppeteer y a sitios como REPUVE. 
- Puede ser mejorado agregando respuestas en caso de que la placa no exista o el captcha ingresado sea incorrecto, etc.
- Se puede hacer uso de resolutores de captcha para evitar llenar el captcha - o usar machine learning, siempre respetando el límite de peticiones del sitio.
