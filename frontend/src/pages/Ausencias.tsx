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
  const isEmpleado = usuario?.tipoRol === 'EMPLEADO';

  // Mapear tipos del backend al frontend para visualización
  const mapTipoAusencia = (tipo: string): Ausencia['tipoAusencia'] => {
    const map: Record<string, Ausencia['tipoAusencia']> = {
      'PERMISO_PERSONAL': 'PERMISO',
      'VACACIONES': 'VACACIONES',
      'ENFERMEDAD': 'ENFERMEDAD',
      'MATERNIDAD_PATERNIDAD': 'MATERNIDAD',
      'OTRO': 'OTRO'
    };
    return map[tipo] || 'OTRO';
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const personalData = await personalService.listarTodos();
      setPersonal(personalData);

      if (isEmpleado && usuario?.username) {
        const data = await ausenciasService.obtenerPorPersonal(usuario.username);
        const mappedData = data.map(a => ({
          ...a,
          tipoAusencia: mapTipoAusencia(a.tipoAusencia)
        }));
        setAusencias(mappedData);
        return;
      }

      const results = await Promise.allSettled(
        personalData.map((p) => ausenciasService.obtenerPorPersonal(p.cedula))
      );
      const merged: Ausencia[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          res.value.forEach((a) => merged.push({
            ...a,
            tipoAusencia: mapTipoAusencia(a.tipoAusencia)
          }));
        }
      });
      setAusencias(merged);
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
      const fechaInicioIso = formData.fechaInicio
        ? new Date(formData.fechaInicio).toISOString().split('T')[0]
        : '';
      const fechaFinIso = formData.fechaFin
        ? new Date(formData.fechaFin).toISOString().split('T')[0]
        : '';
      await ausenciasService.notificar(formData.personalCedula, {
        tipoAusencia: formData.tipoAusencia,
        fechaInicio: fechaInicioIso,
        fechaFin: fechaFinIso,
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
      PERMISO_PERSONAL: 'bg-blue-100 text-blue-800',
      ENFERMEDAD: 'bg-orange-100 text-orange-800',
      VACACIONES: 'bg-purple-100 text-purple-800',
      MATERNIDAD: 'bg-pink-100 text-pink-800',
      MATERNIDAD_PATERNIDAD: 'bg-pink-100 text-pink-800',
      OTRO: 'bg-gray-100 text-gray-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      PERMISO: 'Permiso Personal',
      PERMISO_PERSONAL: 'Permiso Personal',
      ENFERMEDAD: 'Enfermedad',
      VACACIONES: 'Vacaciones',
      MATERNIDAD: 'Maternidad/Paternidad',
      MATERNIDAD_PATERNIDAD: 'Maternidad/Paternidad',
      OTRO: 'Otro'
    };
    return labels[tipo] || tipo;
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
                  <Select
                    value={formData.personalCedula}
                    onValueChange={(value) => setFormData({ ...formData, personalCedula: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {personal.map((p) => (
                        <SelectItem key={p.cedula} value={p.cedula}>
                          {p.nombres} {p.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Ausencia</Label>
                  <Select
                    value={formData.tipoAusencia}
                    onValueChange={(value) => setFormData({ ...formData, tipoAusencia: value as Ausencia['tipoAusencia'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERMISO">Permiso Personal</SelectItem>
                      <SelectItem value="ENFERMEDAD">Enfermedad</SelectItem>
                      <SelectItem value="VACACIONES">Vacaciones</SelectItem>
                      <SelectItem value="MATERNIDAD">Maternidad/Paternidad</SelectItem>
                      <SelectItem value="OTRO">Otro</SelectItem>
                      <SelectItem value="OTRO">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                    <Input
                      id="fechaInicio"
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaFin">Fecha Fin</Label>
                    <Input
                      id="fechaFin"
                      type="date"
                      value={formData.fechaFin}
                      onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Describa el motivo de la ausencia"
                    rows={3}
                    value={formData.motivo}
                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
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
                  <TableCell className="font-medium">
                    {ausencia.personal.nombres} {ausencia.personal.apellidos}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTipoBadge(ausencia.tipoAusencia)}>
                      {getTipoLabel(ausencia.tipoAusencia)}
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
                            onClick={() => handleAprobar(ausencia.id!)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRechazar(ausencia.id!)}
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
                <p className="font-medium">
                  {selectedAusencia.personal.nombres} {selectedAusencia.personal.apellidos}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Tipo</Label>
                <div className="mt-1">
                  <Badge className={getTipoBadge(selectedAusencia.tipoAusencia)}>
                    {getTipoLabel(selectedAusencia.tipoAusencia)}
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
