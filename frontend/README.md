

1.Crear el proyecto base con React + Vite

-npm create vite@latest frontend --template react

![alt text](<Captura de pantalla 2026-01-16 223805.png>)

-cd frontend
-npm install # solo la primera vez, para instalar dependencias

-npm install react-router-dom axios
-npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

![alt text](<Captura de pantalla 2026-01-16 224421.png>)


necesitamos cargar el servidor de Vite utilizamos el comando:

npm run dev

Para el testeo:
- Si USE_MOCK = true → se usan los datos quemados.
- Si USE_MOCK = false → se llaman las APIs reales con Axios.
