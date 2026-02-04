import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
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
import { Plus, Pencil, Trash2, Search, Users as UsersIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  director: string;
  estado: 'ACTIVO' | 'PAUSADO' | 'FINALIZADO';
  fechaInicio: string;
  ayudantes: number;
}

const MOCK_PROYECTOS: Proyecto[] = [
  {
    id: 1,
    nombre: 'Sistema de Gestión Académica',
    descripcion: 'Desarrollo de plataforma web para gestión académica',
    director: 'Carlos Ramírez',
    estado: 'ACTIVO',
    fechaInicio: '2025-01-15',
    ayudantes: 6
  },
  {
    id: 2,
    nombre: 'Análisis de Datos IoT',
    descripcion: 'Investigación sobre procesamiento de datos de sensores',
    director: 'María González',
    estado: 'ACTIVO',
    fechaInicio: '2025-02-01',
    ayudantes: 4
  },
  {
    id: 3,
    nombre: 'IA para Clasificación de Imágenes',
    descripcion: 'Implementación de modelos de deep learning',
    director: 'Carlos Ramírez',
    estado: 'PAUSADO',
    fechaInicio: '2024-11-10',
    ayudantes: 3
  },
];

export function Proyectos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<Proyecto[]>(MOCK_PROYECTOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Proyecto | null>(null);

  const isDirector = usuario?.rol === 'DIRECTOR';
  
  const filteredProyectos = proyectos.filter(proyecto => {
    const matchesSearch = proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.director.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Si es director, solo mostrar sus proyectos
    if (isDirector) {
      return matchesSearch && proyecto.director === usuario?.nombre;
    }
    
    return matchesSearch;
  });

  const handleDelete = (id: number) => {
    setProyectos(proyectos.filter(p => p.id !== id));
    toast.success('Proyecto eliminado correctamente');
  };

  const handleEdit = (proyecto: Proyecto) => {
    setEditingProject(proyecto);
    setDialogOpen(true);
  };

  const handleSave = () => {
    toast.success(editingProject ? 'Proyecto actualizado' : 'Proyecto creado');
    setDialogOpen(false);
    setEditingProject(null);
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      ACTIVO: 'bg-green-100 text-green-800',
      PAUSADO: 'bg-yellow-100 text-yellow-800',
      FINALIZADO: 'bg-gray-100 text-gray-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (id: number) => {
    navigate(`/proyectos/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isDirector ? 'Mis Proyectos' : 'Gestión de Proyectos'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isDirector ? 'Administra tus proyectos de investigación' : 'Administra los proyectos del sistema'}
          </p>
        </div>
        {(usuario?.rol === 'ADMIN' || usuario?.rol === 'DIRECTOR') && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProject(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
                <DialogDescription>
                  Complete los datos del proyecto
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Proyecto</Label>
                  <Input id="nombre" placeholder="Sistema de Gestión..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Descripción detallada del proyecto"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="director">Director</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Carlos Ramírez</SelectItem>
                        <SelectItem value="2">María González</SelectItem>
                        <SelectItem value="3">Juan Pérez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select defaultValue="ACTIVO">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="PAUSADO">Pausado</SelectItem>
                        <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input id="fechaInicio" type="date" />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingProject ? 'Actualizar' : 'Crear'} Proyecto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proyectos</CardTitle>
          <CardDescription>
            {filteredProyectos.length} proyecto(s) encontrado(s)
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, descripción o director..."
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
                <TableHead>Descripción</TableHead>
                <TableHead>Director</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Ayudantes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProyectos.map((proyecto) => (
                <TableRow key={proyecto.id}>
                  <TableCell className="font-medium">{proyecto.nombre}</TableCell>
                  <TableCell className="max-w-xs truncate">{proyecto.descripcion}</TableCell>
                  <TableCell>{proyecto.director}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(proyecto.estado)}>
                      {proyecto.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(proyecto.fechaInicio).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4 text-gray-400" />
                      {proyecto.ayudantes}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(proyecto.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(proyecto)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {usuario?.rol === 'ADMIN' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(proyecto.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}