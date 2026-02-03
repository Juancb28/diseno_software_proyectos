import React from "react";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";

const SimpleTest = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '768px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        ✅ Componentes UI Funcionando
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Prueba Básica</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: '1rem' }}>
            <Label htmlFor="test-input">Campo de prueba</Label>
            <Input id="test-input" placeholder="Escribe algo aquí..." />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label>Selecciona una opción</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Elige una opción..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Opción 1</SelectItem>
                <SelectItem value="option2">Opción 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem' }}>
            <Button variant="default">Botón Principal</Button>
            <Button variant="outline">Botón Secundario</Button>
          </div>
        </CardContent>
      </Card>
      
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: '#f0fdf4',
        borderRadius: '0.5rem',
        border: '1px solid #bbf7d0',
        marginTop: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
          🎉 ¡Éxito!
        </h2>
        <p style={{ color: '#15803d' }}>
          Si puedes ver este mensaje y los componentes funcionan correctamente, 
          significa que la configuración fue exitosa.
        </p>
      </div>
    </div>
  );
};

export default SimpleTest;
