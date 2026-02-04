import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { Plus, CheckCircle, XCircle, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { ausenciasService, Ausencia } from '@/services/ausencias.service';
import { personalService } from '@/services/personal.service';

export function Ausencias() {
  const { usuario } = useAuth();
  const [ausencias, setAusencias] = useState<Ausencia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAusencia, setSelectedAusencia] = useState<Ausencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [personal, setPersonal] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    personalCedula: '',
    tipoAusencia: 'PERMISO' as Ausencia['tipoAusencia'],
    fechaInicio: '',
    fechaFin: '',
    motivo: '',
  });

  const isJefatura = usuario?.tipoRol === 'JEFATURA';
  const isDirector = usuario?.tipoRol === 'DIRECTOR_PROYECTO';
  const isAdmin = usuario?.tipoRol === 'ADMINISTRADOR';

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [ausenciasData, personalData] = await Promise.all([
        ausenciasService.listarTodas(),
        personalService.listarTodos()
      ]);
      setAusencias(ausenciasData);
      setPersonal(personalData);
    } catch (error) {
      toast.error('Error al cargar datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredAusencias = ausencias.filter(ausencia => {
    const empleadoNombre = `${ausencia.personal.nombres} ${ausencia.personal.apellidos}`.toLowerCase();
    const matchesSearch = empleadoNombre.includes(searchTerm.toLowerCase()) ||
      ausencia.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleAprobar = async (id: number) => {
    try {
      // Asumimos que el usuario actual es el aprobador
      await ausenciasService.aprobar(id, usuario?.codigo || '');
      toast.success('Ausencia aprobada correctamente');
      cargarDatos();
    } catch (error) {
      toast.error('Error al aprobar ausencia');
      console.error(error);
    }
  };

  const handleRechazar = async (id: number, motivo: string = 'No aprobado') => {
    try {
      await ausenciasService.rechazar(id, usuario?.codigo || '', motivo);
      toast.error('Ausencia rechazada');
      cargarDatos();
    } catch (error) {
      toast.error('Error al rechazar ausencia');
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await ausenciasService.notificar(formData.personalCedula, {
        tipoAusencia: formData.tipoAusencia,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        motivo: formData.motivo,
      });
      toast.success('Ausencia registrada correctamente');
      setDialogOpen(false);
      setFormData({
        personalCedula: '',
        tipoAusencia: 'PERMISO',
        fechaInicio: '',
        fechaFin: '',
        motivo: '',
      });
      cargarDatos();
    } catch (error) {
      toast.error('Error al registrar ausencia');
      console.error(error);
    }
  };

  const viewDetails = (ausencia: Ausencia) => {
    setSelectedAusencia(ausencia);
    setDetailDialogOpen(true);
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      APROBADA: 'bg-green-100 text-green-800',
      RECHAZADA: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      PERMISO: 'bg-blue-100 text-blue-800',
      ENFERMEDAD: 'bg-orange-100 text-orange-800',
      VACACIONES: 'bg-purple-100 text-purple-800',
      OTRO: 'bg-gray-100 text-gray-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const canApprove = isJefatura || isAdmin;
  const canRegister = isDirector || isAdmin;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Ausencias</h1>
          <p className="text-gray-600 mt-1">
            {isJefatura ? 'Revisa y aprueba las solicitudes de ausencia' : 
             isDirector ? 'Registra y visualiza ausencias de tu equipo' :
             'Administra las ausencias del sistema'}
          </p>
        </div>
        {canRegister && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Ausencia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Ausencia</DialogTitle>
                <DialogDescription>
                  Complete los datos de la ausencia
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="empleado">Empleado</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ana López</SelectItem>
                      <SelectItem value="2">Pedro Martínez</SelectItem>
                      <SelectItem value="3">Laura Sánchez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Ausencia</Label>
                  <Select defaultValue="PERMISO">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERMISO">Permiso</SelectItem>
                      <SelectItem value="ENFERMEDAD">Enfermedad</SelectItem>
                      <SelectItem value="VACACIONES">Vacaciones</SelectItem>
                      <SelectItem value="OTRO">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                    <Input id="fechaInicio" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaFin">Fecha Fin</Label>
                    <Input id="fechaFin" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Describa el motivo de la ausencia"
                    rows={3}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  Registrar Ausencia
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ausencias</CardTitle>
          <CardDescription>
            {filteredAusencias.length} ausencia(s) encontrada(s)
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por empleado o motivo..."
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
                <TableHead>Empleado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAusencias.map((ausencia) => (
                <TableRow key={ausencia.id}>
                  <TableCell className="font-medium">{ausencia.empleado}</TableCell>
                  <TableCell>
                    <Badge className={getTipoBadge(ausencia.tipo)}>
                      {ausencia.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(ausencia.fechaInicio).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>{new Date(ausencia.fechaFin).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(ausencia.estado)}>
                      {ausencia.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewDetails(ausencia)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canApprove && ausencia.estado === 'PENDIENTE' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAprobar(ausencia.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRechazar(ausencia.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de detalles */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la Ausencia</DialogTitle>
          </DialogHeader>
          {selectedAusencia && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Empleado</Label>
                <p className="font-medium">{selectedAusencia.empleado}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Tipo</Label>
                <div className="mt-1">
                  <Badge className={getTipoBadge(selectedAusencia.tipo)}>
                    {selectedAusencia.tipo}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Fecha Inicio</Label>
                  <p className="font-medium">
                    {new Date(selectedAusencia.fechaInicio).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Fecha Fin</Label>
                  <p className="font-medium">
                    {new Date(selectedAusencia.fechaFin).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Motivo</Label>
                <p className="mt-1 text-gray-700">{selectedAusencia.motivo}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Estado</Label>
                <div className="mt-1">
                  <Badge className={getEstadoBadge(selectedAusencia.estado)}>
                    {selectedAusencia.estado}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
