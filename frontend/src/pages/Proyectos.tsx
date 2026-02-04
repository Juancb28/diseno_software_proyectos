import { useState, useEffect } from 'react';
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
import { proyectosService, Proyecto } from '@/services/proyectos.service';

export function Proyectos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    estadoProyecto: 'PLANIFICACION' as Proyecto['estadoProyecto'],
  });

  const isDirector = usuario?.tipoRol === 'DIRECTOR_PROYECTO';

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      const data = await proyectosService.listarTodos();
      setProyectos(data);
    } catch (error) {
      toast.error('Error al cargar proyectos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProyectos = proyectos.filter(proyecto => {
    const matchesSearch = proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proyecto.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (proyecto.director ? `${proyecto.director.nombres} ${proyecto.director.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    
    return matchesSearch;
  });

  const handleDelete = async (id: number) => {
    try {
      await proyectosService.eliminar(id);
      toast.success('Proyecto eliminado correctamente');
      cargarProyectos();
    } catch (error) {
      toast.error('Error al eliminar proyecto');
      console.error(error);
    }
  };

  const handleEdit = (proyecto: Proyecto) => {
    setEditingProject(proyecto);
    setFormData({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion || '',
      fechaInicio: proyecto.fechaInicio || '',
      fechaFin: proyecto.fechaFin || '',
      estadoProyecto: proyecto.estadoProyecto,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingProject) {
        await proyectosService.modificar(editingProject.id!, formData);
        toast.success('Proyecto actualizado');
      } else {
        await proyectosService.crear(formData);
        toast.success('Proyecto creado');
      }
      setDialogOpen(false);
      setEditingProject(null);
      setFormData({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        estadoProyecto: 'PLANIFICACION',
      });
      cargarProyectos();
    } catch (error) {
      toast.error('Error al guardar proyecto');
      console.error(error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      PLANIFICACION: 'bg-blue-100 text-blue-800',
      EN_EJECUCION: 'bg-green-100 text-green-800',
      SUSPENDIDO: 'bg-yellow-100 text-yellow-800',
      FINALIZADO: 'bg-gray-100 text-gray-800',
      CANCELADO: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (id: number) => {
    navigate(`/proyectos/${id}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Cargando...</div>;
  }

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
        {(usuario?.tipoRol === 'ADMINISTRADOR' || usuario?.tipoRol === 'JEFATURA' || usuario?.tipoRol === 'DIRECTOR_PROYECTO') && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProject(null);
                setFormData({
                  nombre: '',
                  descripcion: '',
                  fechaInicio: '',
                  fechaFin: '',
                  estadoProyecto: 'PLANIFICACION',
                });
              }}>
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
                  <Input 
                    id="nombre" 
                    placeholder="Sistema de Gestión..."
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Descripción detallada del proyecto"
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                    <Input 
                      id="fechaInicio" 
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select 
                      value={formData.estadoProyecto}
                      onValueChange={(value) => setFormData({ ...formData, estadoProyecto: value as Proyecto['estadoProyecto'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLANIFICACION">Planificación</SelectItem>
                        <SelectItem value="EN_EJECUCION">En Ejecución</SelectItem>
                        <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                        <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  <TableCell>
                    {proyecto.director ? `${proyecto.director.nombres} ${proyecto.director.apellidos}` : 'Sin asignar'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(proyecto.estadoProyecto)}>
                      {proyecto.estadoProyecto.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString('es-ES') : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4 text-gray-400" />
                      -
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(proyecto.id!)}
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
                          onClick={() => handleDelete(proyecto.id!)}
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