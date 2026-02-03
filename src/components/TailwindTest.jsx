import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import { Switch } from "./ui/Switch";
import { Slider } from "./ui/Slider";
import { Badge } from "./ui/Badge";
import { Separator } from "./ui/Separator";
import { Button } from "./ui/Button";

const TailwindTest = () => {
  const [switchState, setSwitchState] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState([50]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">🎨 Componentes Tailwind + Radix UI</h1>
      
      {/* Tabs */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Pestañas (Tabs)</h2>
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Cuenta</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-4">
            <p className="text-gray-600">Contenido de la pestaña Cuenta</p>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <p className="text-gray-600">Contenido de la pestaña Configuración</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Controls */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Controles de Formulario</h2>
        
        <div className="space-y-6">
          {/* Select */}
          <div>
            <label className="block text-sm font-medium mb-2">Selecciona una opción</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elige una opción..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Opción 1</SelectItem>
                <SelectItem value="option2">Opción 2</SelectItem>
                <SelectItem value="option3">Opción 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Switch */}
          <div className="flex items-center space-x-2">
            <Switch 
              id="notifications" 
              checked={switchState}
              onCheckedChange={setSwitchState}
            />
            <label htmlFor="notifications" className="text-sm font-medium">
              Notificaciones {switchState ? 'activadas' : 'desactivadas'}
            </label>
          </div>

          {/* Slider */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Slider: {sliderValue[0]}
            </label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Insignias (Badges)</h2>
        <div className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <Separator />

      {/* Success Message */}
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-800 mb-2">🎉 ¡Componentes Tailwind Funcionando!</h2>
        <p className="text-green-700">
          Si puedes ver todos estos componentes con estilos Tailwind CSS, 
          significa que la configuración es exitosa.
        </p>
        <div className="mt-4">
          <Button variant="default">Botón de Prueba</Button>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
