# 🚀 Instrucciones para Configurar el Proyecto

## 📋 Pasos para completar la configuración

### 1. Instalar dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Instalar todas las dependencias
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 3. Probar los componentes
Una vez que el servidor esté corriendo, puedes:
- Visitar `http://localhost:5173` (o el puerto que te indique Vite)
- Importar y usar los componentes en tu aplicación

## 🧪 Componentes Disponibles

### Componentes con Material-UI (existentes)
- Button, Card, Input, Label, RadioGroup
- Accordion, Alert, AlertDialog, Avatar, Badge
- Breadcrumb, Dialog, Drawer, Progress

### Nuevos Componentes con Tailwind CSS + Radix UI
- **Formularios**: Select, Textarea, Switch, Slider
- **Layout**: Resizable, ScrollArea, Separator, Sheet, Sidebar
- **Feedback**: Skeleton, Toast, Toaster, Tooltip
- **Navegación**: Tabs, Toggle, ToggleGroup, NavLink
- **Datos**: Table

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── ui/           # Todos los componentes UI
│   │   ├── Button.jsx (Material-UI)
│   │   ├── Select.jsx (Tailwind + Radix)
│   │   └── ...
│   └── TestComponents.jsx  # Componente de prueba
├── hooks/
│   ├── use-mobile.js
│   └── use-toast.js
├── lib/
│   └── utils.js
└── index.css         # Estilos de Tailwind CSS
```

## 🔧 Uso de Componentes

### Importación individual
```jsx
import { Button, Card, Select } from "@/components/ui";
```

### Importación desde index
```jsx
import { Button, Card, Select } from "@/components/ui/index.js";
```

## 🎨 Personalización

Los componentes usan variables CSS personalizadas definidas en `src/index.css`. Puedes modificar los colores en las variables `--primary`, `--secondary`, etc.

## 🐛 Solución de Problemas

### Si los estilos no funcionan:
1. Asegúrate de que Tailwind CSS esté instalado
2. Verifica que `src/index.css` se esté importando en tu archivo principal
3. Revisa que las clases de Tailwind estén configuradas correctamente

### Si los componentes no se importan:
1. Verifica las rutas en los archivos de importación
2. Asegúrate de que las dependencias de Radix UI estén instaladas
3. Revisa el archivo `src/components/ui/index.js`

## 📝 Notas

- El proyecto combina Material-UI (componentes existentes) con Tailwind CSS + Radix UI (nuevos componentes)
- Los nuevos componentes son completamente accesibles y responsive
- Todos los componentes soportan temas claro/oscuro
- Las importaciones usan mayúsculas/minúsculas según el nombre exacto del archivo

## ✅ Verificación

Una vez que completes la instalación, deberías poder:
1. Ver los estilos de Tailwind CSS aplicados
2. Usar todos los componentes sin errores
3. Navegar entre las diferentes variantes de cada componente
4. Tener una experiencia de desarrollo fluida

¡Listo para usar! 🎉
