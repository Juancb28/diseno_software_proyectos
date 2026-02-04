import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle,
  Eye,
  Clock,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface Avance {
  id: number;
  semestre: string;
  fechaSubida: string;
  archivo: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  observaciones?: string;
  revisadoPor?: string;
  fechaRevision?: string;
}

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  director: string;
  estado: 'ACTIVO' | 'PAUSADO' | 'FINALIZADO';
  fechaInicio: string;
  fechaFin?: string;
  objetivos: string;
  presupuesto?: string;
  ayudantes: Array<{ id: number; nombre: string; rol: string }>;
  avances: Avance[];
}

const MOCK_PROYECTO: Proyecto = {
  id: 1,
  nombre: 'Sistema de Gestión Académica',
  descripcion: 'Desarrollo de plataforma web para gestión académica integral de la institución',
  director: 'Carlos Ramírez',
  estado: 'ACTIVO',
  fechaInicio: '2025-01-15',
  objetivos: 'Desarrollar un sistema completo de gestión académica que permita la administración eficiente de estudiantes, profesores, y proyectos de investigación.',
  presupuesto: '$15,000',
  ayudantes: [
    { id: 1, nombre: 'Ana López', rol: 'Desarrolladora Frontend' },
    { id: 2, nombre: 'Pedro Martínez', rol: 'Desarrollador Backend' },
    { id: 3, nombre: 'Laura Sánchez', rol: 'Analista de Datos' },
  ],
  avances: [
    {
      id: 1,
      semestre: '2025-2',
      fechaSubida: '2026-02-01T10:30:00',
      archivo: 'avance_2025-2.pdf',
      estado: 'PENDIENTE',
    },
    {
      id: 2,
      semestre: '2025-1',
      fechaSubida: '2025-08-15T14:20:00',
      archivo: 'avance_2025-1.pdf',
      estado: 'APROBADO',
      observaciones: 'Excelente progreso. Cumple con todos los objetivos planteados.',
      revisadoPor: 'María González',
      fechaRevision: '2025-08-20T09:00:00'
    },
    {
      id: 3,
      semestre: '2024-2',
      fechaSubida: '2025-02-10T16:45:00',
      archivo: 'avance_2024-2.pdf',
      estado: 'RECHAZADO',
      observaciones: 'El informe necesita más detalles sobre la metodología empleada y los resultados obtenidos.',
      revisadoPor: 'María González',
      fechaRevision: '2025-02-15T11:30:00'
    },
  ]
};

export function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { addNotification } = useNotifications();
  const [proyecto, setProyecto] = useState<Proyecto>(MOCK_PROYECTO);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedAvance, setSelectedAvance] = useState<Avance | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [semestre, setSemestre] = useState('');

  const isJefatura = usuario?.rol === 'JEFATURA';
  const isDirector = usuario?.rol === 'DIRECTOR';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Solo se permiten archivos PDF');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('El archivo no debe superar los 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadAvance = () => {
    if (!selectedFile || !semestre) {
      toast.error('Seleccione un archivo y especifique el semestre');
      return;
    }

    const nuevoAvance: Avance = {
      id: Math.max(...proyecto.avances.map(a => a.id), 0) + 1,
      semestre,
      fechaSubida: new Date().toISOString(),
      archivo: selectedFile.name,
      estado: 'PENDIENTE'
    };

    setProyecto({
      ...proyecto,
      avances: [nuevoAvance, ...proyecto.avances]
    });

    toast.success('Avance subido exitosamente');
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setSemestre('');
  };

  const handleAprobar = () => {
    if (!selectedAvance) return;

    const avancesActualizados = proyecto.avances.map(a =>
      a.id === selectedAvance.id
        ? {
            ...a,
            estado: 'APROBADO' as const,
            observaciones,
            revisadoPor: usuario?.nombre,
            fechaRevision: new Date().toISOString()
          }
        : a
    );

    setProyecto({ ...proyecto, avances: avancesActualizados });

    // Agregar notificación para el director
    addNotification({
      titulo: 'Avance Aprobado',
      mensaje: `El avance del semestre ${selectedAvance.semestre} ha sido aprobado`,
      tipo: 'SUCCESS',
      link: `/proyectos/${id}`
    });

    toast.success('Avance aprobado correctamente');
    setReviewDialogOpen(false);
    setSelectedAvance(null);
    setObservaciones('');
  };

  const handleRechazar = () => {
    if (!selectedAvance) return;

    if (!observaciones.trim()) {
      toast.error('Debe proporcionar observaciones para rechazar el avance');
      return;
    }

    const avancesActualizados = proyecto.avances.map(a =>
      a.id === selectedAvance.id
        ? {
            ...a,
            estado: 'RECHAZADO' as const,
            observaciones,
            revisadoPor: usuario?.nombre,
            fechaRevision: new Date().toISOString()
          }
        : a
    );

    setProyecto({ ...proyecto, avances: avancesActualizados });

    // Agregar notificación para el director
    addNotification({
      titulo: 'Avance Rechazado',
      mensaje: `El avance del semestre ${selectedAvance.semestre} requiere correcciones`,
      tipo: 'ERROR',
      link: `/proyectos/${id}`
    });

    toast.error('Avance rechazado');
    setReviewDialogOpen(false);
    setSelectedAvance(null);
    setObservaciones('');
  };

  const openReviewDialog = (avance: Avance) => {
    setSelectedAvance(avance);
    setObservaciones(avance.observaciones || '');
    setReviewDialogOpen(true);
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      APROBADO: 'bg-green-100 text-green-800',
      RECHAZADO: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const calcularEstadisticas = () => {
    const total = proyecto.avances.length;
    const aprobados = proyecto.avances.filter(a => a.estado === 'APROBADO').length;
    const rechazados = proyecto.avances.filter(a => a.estado === 'RECHAZADO').length;
    const pendientes = proyecto.avances.filter(a => a.estado === 'PENDIENTE').length;
    const tasaAprobacion = total > 0 ? ((aprobados / total) * 100).toFixed(0) : 0;

    return { total, aprobados, rechazados, pendientes, tasaAprobacion };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/proyectos')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{proyecto.nombre}</h1>
          <p className="text-gray-600 mt-1">Director: {proyecto.director}</p>
        </div>
        <Badge className={
          proyecto.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
          proyecto.estado === 'PAUSADO' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }>
          {proyecto.estado}
        </Badge>
      </div>

      <Tabs defaultValue="informacion" className="space-y-6">
        <TabsList>
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
          <TabsTrigger value="avances">Avances</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Fecha Inicio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold">
                    {new Date(proyecto.fechaInicio).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Presupuesto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-green-600">
                  {proyecto.presupuesto || 'No especificado'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-lg font-semibold">{proyecto.ayudantes.length} miembros</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{proyecto.descripcion}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{proyecto.objetivos}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipo">
          <Card>
            <CardHeader>
              <CardTitle>Miembros del Equipo</CardTitle>
              <CardDescription>
                {proyecto.ayudantes.length} miembro(s) en el proyecto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Rol en el Proyecto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{proyecto.director}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Director</Badge>
                    </TableCell>
                  </TableRow>
                  {proyecto.ayudantes.map((ayudante) => (
                    <TableRow key={ayudante.id}>
                      <TableCell className="font-medium">{ayudante.nombre}</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-800">{ayudante.rol}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avances" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Avances Semestrales</h2>
              <p className="text-sm text-gray-600 mt-1">
                Seguimiento del progreso del proyecto por semestre
              </p>
            </div>
            {isDirector && (
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Avance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Subir Avance Semestral</DialogTitle>
                    <DialogDescription>
                      Sube el informe de avance del proyecto en formato PDF
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="semestre">Semestre</Label>
                      <Input
                        id="semestre"
                        placeholder="Ej: 2026-1"
                        value={semestre}
                        onChange={(e) => setSemestre(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="archivo">Archivo PDF</Label>
                      <Input
                        id="archivo"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                      />
                      {selectedFile && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-xs text-gray-600">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-900 font-medium mb-2">Requisitos:</p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Formato: PDF únicamente</li>
                        <li>• Tamaño máximo: 10 MB</li>
                        <li>• Incluir objetivos alcanzados</li>
                        <li>• Detallar metodología y resultados</li>
                      </ul>
                    </div>
                    <Button onClick={handleUploadAvance} className="w-full" disabled={!selectedFile || !semestre}>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Avance
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Estadísticas de Avances */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Avances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Aprobados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.aprobados}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tasa Aprobación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">{stats.tasaAprobacion}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Avances</CardTitle>
              <CardDescription>
                {proyecto.avances.length} avance(s) registrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Fecha Subida</TableHead>
                    <TableHead>Archivo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Revisado Por</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proyecto.avances.map((avance) => (
                    <TableRow key={avance.id}>
                      <TableCell className="font-medium">{avance.semestre}</TableCell>
                      <TableCell>
                        {new Date(avance.fechaSubida).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          {avance.archivo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoBadge(avance.estado)}>
                          {avance.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {avance.revisadoPor || (
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Pendiente
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info('Visualizando PDF...')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isJefatura && avance.estado === 'PENDIENTE' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openReviewDialog(avance)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Revisar
                              </Button>
                            </>
                          )}
                          {(avance.estado === 'APROBADO' || avance.estado === 'RECHAZADO') && avance.observaciones && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAvance(avance);
                                setObservaciones(avance.observaciones || '');
                                toast.info('Ver observaciones');
                              }}
                            >
                              <FileText className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* Dialog de Revisión */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisar Avance - {selectedAvance?.semestre}</DialogTitle>
            <DialogDescription>
              Revisa el avance y proporciona tu feedback
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Archivo</p>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <p className="font-medium">{selectedAvance?.archivo}</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">Subido el: {selectedAvance && new Date(selectedAvance.fechaSubida).toLocaleString('es-ES')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                placeholder="Escribe tus observaciones sobre el avance..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAprobar}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprobar
              </Button>
              <Button
                onClick={handleRechazar}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
