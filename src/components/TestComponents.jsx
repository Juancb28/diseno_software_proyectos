import React from "react";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import { Switch } from "./ui/Switch";
import { Slider } from "./ui/Slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { Badge } from "./ui/Badge";
import { Separator } from "./ui/Separator";

const TestComponents = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-8">Test de Componentes UI</h1>
      
      {/* Botones */}
      <Card>
        <CardHeader>
          <CardTitle>Botones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </CardContent>
      </Card>

      {/* Formularios */}
      <Card>
        <CardHeader>
          <CardTitle>Formularios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea id="message" placeholder="Escribe tu mensaje aquí..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="select">Selecciona una opción</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Opción 1</SelectItem>
                <SelectItem value="option2">Opción 2</SelectItem>
                <SelectItem value="option3">Opción 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Controles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications">Notificaciones</Label>
          </div>
          <div className="space-y-2">
            <Label>Slider: 50</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="flex gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Pestañas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Cuenta</TabsTrigger>
              <TabsTrigger value="password">Contraseña</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-2">
              <p>Configuración de la cuenta</p>
            </TabsContent>
            <TabsContent value="password" className="space-y-2">
              <p>Cambiar contraseña</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-center text-sm text-muted-foreground">
        <p>Si puedes ver todos estos componentes, ¡la configuración es exitosa!</p>
      </div>
    </div>
  );
};

export default TestComponents;
