import React from "react";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

const TestBasico = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
        🧪 Test Básico - Solo Material-UI
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Componentes Material-UI Funcionando</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: '1rem' }}>
            <Label htmlFor="input-test">Campo de entrada</Label>
            <Input 
              id="input-test" 
              placeholder="Escribe algo aquí..." 
              fullWidth
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="default">Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="outline">Borde</Button>
            <Button variant="ghost">Fantasma</Button>
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
          🎉 ¡Éxito!
        </h2>
        <p style={{ color: '#15803d', margin: 0 }}>
          Los componentes Material-UI están funcionando correctamente.
        </p>
        <p style={{ color: '#15803d', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Los componentes con Tailwind + Radix UI estarán disponibles después de instalar las dependencias faltantes.
        </p>
      </div>
    </div>
  );
};

export default TestBasico;
