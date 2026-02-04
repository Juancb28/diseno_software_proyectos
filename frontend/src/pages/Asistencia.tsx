import { useEffect, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Plus, Search, QrCode, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { personalService, Personal as PersonalType } from '@/services/personal.service';
import { asistenciaService, AsistenciaApi } from '@/services/asistencia.service';

interface Asistencia {
  id: number;
  empleado: string;
  fecha: string;
  horaEntrada: string;
  horaSalida?: string;
  tipo: 'LABORATORIO' | 'QR';
  estado: 'PRESENTE' | 'TARDE' | 'AUSENTE';
  proyecto?: string;
}

export function Asistencia() {
  const { usuario } = useAuth();
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [personalList, setPersonalList] = useState<PersonalType[]>([]);
  const [selectedPersonal, setSelectedPersonal] = useState<string>('');
  const [selectedTipoRegistro, setSelectedTipoRegistro] = useState<'LABORATORIO' | 'QR'>('LABORATORIO');

  const isAyudante = usuario?.tipoRol === 'EMPLEADO';
  const isDirector = usuario?.tipoRol === 'DIRECTOR_PROYECTO';
  const isJefatura = usuario?.tipoRol === 'JEFATURA';
  const isAdmin = usuario?.tipoRol === 'ADMINISTRADOR';

  useEffect(() => {
    cargarDatos();
  }, []);

  const mapAsistencia = (data: AsistenciaApi, personalMap: Record<string, string>): Asistencia => {
    const cedula = data.personal?.cedula || '';
    const empleado = personalMap[cedula] || cedula || 'N/A';
    const tipoMap: Record<AsistenciaApi['tipoRegistro'], Asistencia['tipo']> = {
      PRESENCIAL_OFICINA: 'LABORATORIO',
      PRESENCIAL_LABORATORIO: 'LABORATORIO',
      REMOTO: 'QR',
      TRABAJO_CAMPO: 'QR',
      VIAJE_NEGOCIOS: 'QR',
      ENTRADA: 'QR',
      SALIDA: 'QR',
    };
    const estadoMap: Record<AsistenciaApi['estadoAsistencia'], Asistencia['estado']> = {
      PUNTUAL: 'PRESENTE',
      PRESENTE: 'PRESENTE',
      RETRASO: 'TARDE',
      SALIDA_ANTICIPADA: 'TARDE',
      AUSENTE: 'AUSENTE',
      JUSTIFICADO: 'PRESENTE',
    };
    return {
      id: data.id,
      empleado,
      fecha: data.fecha,
      horaEntrada: data.horaEntrada || '-',
      horaSalida: data.horaSalida || undefined,
      tipo: tipoMap[data.tipoRegistro] || 'LABORATORIO',
      estado: estadoMap[data.estadoAsistencia] || 'PRESENTE',
    };
  };

  const cargarDatos = async () => {
    try {
      const personalData = await personalService.listarTodos();
      setPersonalList(personalData);

      const personalMap: Record<string, string> = {};
      personalData.forEach((p) => {
        personalMap[p.cedula] = `${p.nombres} ${p.apellidos}`;
      });

      if (isAyudante && usuario?.username) {
        const registros = await asistenciaService.listarPorPersonal(usuario.username);
        setAsistencias(registros.map((r) => mapAsistencia(r, personalMap)));
        return;
      }

      // Para admin/jefatura/director: traer asistencia por cada personal
      const results = await Promise.allSettled(
        personalData.map((p) => asistenciaService.listarPorPersonal(p.cedula))
      );
      const merged: Asistencia[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          res.value.forEach((r) => merged.push(mapAsistencia(r, personalMap)));
        }
      });
      setAsistencias(merged);
    } catch (error) {
      toast.error('Error al cargar asistencias');
      console.error(error);
    }
  };
  
  const filteredAsistencias = asistencias.filter(asistencia => {
    const matchesSearch = asistencia.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asistencia.fecha.includes(searchTerm);
    
    if (isAyudante) {
      return matchesSearch && asistencia.empleado === usuario?.username;
    }
    
    if (isDirector) {
      return matchesSearch && asistencia.proyecto === 'Sistema de Gestión Académica';
    }
    
    return matchesSearch;
  });

  const handleRegistrarLaboratorio = async () => {
    if (!usuario?.username) return;
    try {
      await asistenciaService.registrar(usuario.username, 'LABORATORIO');
      toast.success('Asistencia de laboratorio registrada');
      setDialogOpen(false);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al registrar asistencia');
      console.error(error);
    }
  };

  const handleRegistrarQR = async () => {
    if (!usuario?.username) return;
    try {
      await asistenciaService.registrar(usuario.username, 'QR');
      toast.success('Asistencia QR registrada');
      setQrDialogOpen(false);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al registrar asistencia');
      console.error(error);
    }
  };

  const handleRegistrarManual = async () => {
    if (!selectedPersonal) {
      toast.error('Seleccione un empleado');
      return;
    }
    try {
      await asistenciaService.registrar(selectedPersonal, selectedTipoRegistro);
      toast.success('Asistencia registrada');
      setDialogOpen(false);
      await cargarDatos();
    } catch (error) {
      toast.error('Error al registrar asistencia');
      console.error(error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      PRESENTE: 'bg-green-100 text-green-800',
      TARDE: 'bg-yellow-100 text-yellow-800',
      AUSENTE: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      LABORATORIO: 'bg-blue-100 text-blue-800',
      QR: 'bg-purple-100 text-purple-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const calcularEstadisticas = () => {
    const total = filteredAsistencias.length;
    const presentes = filteredAsistencias.filter(a => a.estado === 'PRESENTE').length;
    const tardes = filteredAsistencias.filter(a => a.estado === 'TARDE').length;
    const ausentes = filteredAsistencias.filter(a => a.estado === 'AUSENTE').length;
    const porcentaje = total > 0 ? ((presentes + tardes) / total * 100).toFixed(1) : 0;
    
    return { total, presentes, tardes, ausentes, porcentaje };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAyudante ? 'Mi Asistencia' : 'Gestión de Asistencia'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAyudante ? 'Registra tu asistencia diaria' : 
             isDirector ? 'Registra y visualiza la asistencia de tu equipo' :
             'Administra la asistencia del personal'}
          </p>
        </div>
        {isAyudante && (
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Laboratorio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Asistencia - Laboratorio</DialogTitle>
                  <DialogDescription>
                    Confirma tu asistencia al laboratorio
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora Actual</Label>
                    <Input value={new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} disabled />
                  </div>
                  <Button onClick={handleRegistrarLaboratorio} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registrar Entrada
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <QrCode className="h-4 w-4 mr-2" />
                  Escanear QR
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Asistencia - QR</DialogTitle>
                  <DialogDescription>
                    Escanea el código QR para registrar tu asistencia
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <QrCode className="h-32 w-32 text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center">
                      Coloca el código QR frente a la cámara
                    </p>
                  </div>
                  <Button onClick={handleRegistrarQR} className="w-full">
                    Simular Escaneo QR
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {(isDirector || isAdmin) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Asistencia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Asistencia Manual</DialogTitle>
                <DialogDescription>
                  Registra la asistencia de un empleado
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="empleado">Empleado</Label>
                  <Select value={selectedPersonal} onValueChange={setSelectedPersonal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalList.map((p) => (
                        <SelectItem key={p.cedula} value={p.cedula}>
                          {p.nombres} {p.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input id="fecha" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={selectedTipoRegistro} onValueChange={(value) => setSelectedTipoRegistro(value as 'LABORATORIO' | 'QR')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LABORATORIO">Laboratorio</SelectItem>
                        <SelectItem value="QR">QR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaEntrada">Hora Entrada</Label>
                    <Input id="horaEntrada" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaSalida">Hora Salida</Label>
                    <Input id="horaSalida" type="time" />
                  </div>
                </div>
                <Button className="w-full" onClick={handleRegistrarManual}>
                  Registrar Asistencia
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Presentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.presentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tardanzas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.tardes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">% Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.porcentaje}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Asistencia</CardTitle>
          <CardDescription>
            {filteredAsistencias.length} registro(s) encontrado(s)
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por empleado o fecha..."
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
                <TableHead>Fecha</TableHead>
                <TableHead>Hora Entrada</TableHead>
                <TableHead>Hora Salida</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAsistencias.map((asistencia) => (
                <TableRow key={asistencia.id}>
                  <TableCell className="font-medium">{asistencia.empleado}</TableCell>
                  <TableCell>{new Date(asistencia.fecha).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>{asistencia.horaEntrada}</TableCell>
                  <TableCell>{asistencia.horaSalida || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getTipoBadge(asistencia.tipo)}>
                      {asistencia.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(asistencia.estado)}>
                      {asistencia.estado}
                    </Badge>
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
