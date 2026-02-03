import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Slider } from "./ui/Slider";
import { Switch } from "./ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

const TestFuncional = () => {
  const [switchState, setSwitchState] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
        🧪 Test de Componentes Funcionales
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Formulario y Controles</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: '1rem' }}>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" placeholder="Escribe tu nombre..." fullWidth />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label htmlFor="mensaje">Mensaje</Label>
            <Textarea 
              id="mensaje" 
              placeholder="Escribe un mensaje..." 
              style={{ width: '100%', minHeight: '100px' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label>Slider: {sliderValue}</Label>
            <Slider 
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              min="0"
              max="100"
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Switch 
              checked={switchState}
              onCheckedChange={setSwitchState}
            />
            <Label>Notificaciones {switchState ? 'activadas' : 'desactivadas'}</Label>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <p>Contenido del Tab 1</p>
              </TabsContent>
              <TabsContent value="tab2">
                <p>Contenido del Tab 2</p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="default">Guardar</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="outline">Editar</Button>
          </div>
        </CardContent>
      </Card>

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem', 
        backgroundColor: '#f0fdf4', 
        borderRadius: '0.5rem',
        border: '1px solid #bbf7d0',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
          🎉 ¡Componentes Funcionales!
        </h2>
        <p style={{ color: '#15803d', margin: 0 }}>
          Material-UI + Componentes básicos personalizados funcionando correctamente.
        </p>
      </div>
    </div>
  );
};

export default TestFuncional;
