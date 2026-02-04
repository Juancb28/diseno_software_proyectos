import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Pencil, Search, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Personal {
  id: number;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  proyecto: string;
  tipoContrato: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'PASANTIA';
  contratoSubido: boolean;
  fechaIngreso: string;
}

const MOCK_PERSONAL: Personal[] = [
  {
    id: 1,
    nombre: 'Ana López',
    cedula: '1725896347',
    email: 'ana.lopez@epn.edu.ec',
    telefono: '0987654321',
    proyecto: 'Sistema de Gestión Académica',
    tipoContrato: 'PASANTIA',
    contratoSubido: true,
    fechaIngreso: '2025-01-15'
  },
  {
    id: 2,
    nombre: 'Pedro Martínez',
    cedula: '1723456789',
    email: 'pedro.martinez@epn.edu.ec',
    telefono: '0998765432',
    proyecto: 'Sistema de Gestión Académica',
    tipoContrato: 'MEDIO_TIEMPO',
    contratoSubido: true,
    fechaIngreso: '2025-01-20'
  },
  {
    id: 3,
    nombre: 'Laura Sánchez',
    cedula: '1721234567',
    email: 'laura.sanchez@epn.edu.ec',
    telefono: '0976543210',
    proyecto: 'Análisis de Datos IoT',
    tipoContrato: 'TIEMPO_COMPLETO',
    contratoSubido: false,
    fechaIngreso: '2025-02-01'
  },
];

export function Personal() {
  const { usuario } = useAuth();
  const [personal, setPersonal] = useState<Personal[]>(MOCK_PERSONAL);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contratoDialogOpen, setContratoDialogOpen] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null);

  const isDirector = usuario?.rol === 'DIRECTOR';
  
  const filteredPersonal = personal.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cedula.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Si es director, filtrar por su proyecto
    if (isDirector) {
      return matchesSearch && p.proyecto === 'Sistema de Gestión Académica';
    }
    
    return matchesSearch;
  });

  const handleSave = () => {
    toast.success('Personal guardado correctamente');
    setDialogOpen(false);
  };

  const viewContrato = (p: Personal) => {
    setSelectedPersonal(p);
    setContratoDialogOpen(true);
  };

  const getTipoContratoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      TIEMPO_COMPLETO: 'bg-green-100 text-green-800',
      MEDIO_TIEMPO: 'bg-blue-100 text-blue-800',
      PASANTIA: 'bg-purple-100 text-purple-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getTipoContratoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      TIEMPO_COMPLETO: 'Tiempo Completo',
      MEDIO_TIEMPO: 'Medio Tiempo',
      PASANTIA: 'Pasantía'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isDirector ? 'Mi Equipo' : 'Gestión de Personal'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isDirector ? 'Personal asignado a tu proyecto' : 'Administra el personal del sistema'}
          </p>
        </div>
        {(usuario?.rol === 'ADMIN' || usuario?.rol === 'DIRECTOR') && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {isDirector ? 'Asignar Ayudante' : 'Nuevo Personal'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isDirector ? 'Asignar Ayudante al Proyecto' : 'Nuevo Personal'}
                </DialogTitle>
                <DialogDescription>
                  Complete los datos del personal
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input id="nombre" placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input id="cedula" placeholder="1234567890" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="juan@epn.edu.ec" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" placeholder="0987654321" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proyecto">Proyecto</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sistema de Gestión Académica</SelectItem>
                        <SelectItem value="2">Análisis de Datos IoT</SelectItem>
                        <SelectItem value="3">IA para Clasificación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                    <Select defaultValue="PASANTIA">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TIEMPO_COMPLETO">Tiempo Completo</SelectItem>
                        <SelectItem value="MEDIO_TIEMPO">Medio Tiempo</SelectItem>
                        <SelectItem value="PASANTIA">Pasantía</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                  <Input id="fechaIngreso" type="date" />
                </div>
                <Button onClick={handleSave} className="w-full">
                  Guardar Personal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Personal</CardTitle>
          <CardDescription>
            {filteredPersonal.length} persona(s) encontrada(s)
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, cédula o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Tipo Contrato</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonal.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.cedula}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{p.proyecto}</TableCell>
                  <TableCell>
                    <Badge className={getTipoContratoBadge(p.tipoContrato)}>
                      {getTipoContratoLabel(p.tipoContrato)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.contratoSubido ? (
                      <Badge className="bg-green-100 text-green-800">
                        Subido
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {p.contratoSubido && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewContrato(p)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para ver contrato */}
      <Dialog open={contratoDialogOpen} onOpenChange={setContratoDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Contrato - {selectedPersonal?.nombre}</DialogTitle>
            <DialogDescription>
              Visualización del contrato en PDF
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600">Vista previa del contrato</p>
            <p className="text-sm text-gray-500 mt-2">
              Archivo: contrato_{selectedPersonal?.cedula}.pdf
            </p>
            <Button className="mt-4">
              Descargar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
