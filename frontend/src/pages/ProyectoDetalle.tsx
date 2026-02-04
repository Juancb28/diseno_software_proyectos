import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { proyectosService, Proyecto as ProyectoAPI, AsignacionProyecto } from '@/services/proyectos.service';
import { avancesService, Avance as AvanceAPI } from '@/services/avances.service';
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
  AlertDialogTrigger,
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
  semestre?: string;
  fechaCreacion: string;
  nombreArchivo?: string;
  estadoAvance: 'APROBADO' | 'PENDIENTE' | 'RECHAZADO';
  observaciones?: string;
  fechaRevision?: string;
  director?: {
    id: number;
    nombre: string;
  };
  jefatura?: {
    id: number;
    nombre: string;
  };
}

interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  codigoProyecto?: string;
  director: {
    cedula: string;
    nombres: string;
    apellidos: string;
  } | null;
  estadoProyecto: 'PLANIFICACION' | 'EN_EJECUCION' | 'SUSPENDIDO' | 'FINALIZADO' | 'CANCELADO';
  fechaInicio?: string;
  fechaFin?: string;
  objetivos?: string;
  presupuesto?: number;
  cliente?: string;
  ayudantes: Array<{ 
    cedula: string;
    nombres: string;
    apellidos: string;
    rolEnProyecto: string;
  }>;
  avances: Avance[];
}

export function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { addNotification } = useNotifications();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [avances, setAvances] = useState<Avance[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedAvance, setSelectedAvance] = useState<Avance | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [semestre, setSemestre] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  const isJefatura = usuario?.tipoRol === 'JEFATURA';
  const isDirector = usuario?.tipoRol === 'DIRECTOR_PROYECTO';

  // Cargar datos del proyecto y avances
  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [proyectoData, personalData, avancesData] = await Promise.all([
          proyectosService.buscarPorId(Number(id)),
          proyectosService.obtenerPersonal(Number(id)),
          avancesService.listarPorProyecto(Number(id))
        ]);
        
        // Mapear datos del backend al formato del frontend
        const proyectoMapeado: Proyecto = {
          id: proyectoData.id!,
          nombre: proyectoData.nombre,
          descripcion: proyectoData.descripcion || '',
          codigoProyecto: proyectoData.codigoProyecto,
          director: proyectoData.director || null,
          estadoProyecto: proyectoData.estadoProyecto,
          fechaInicio: proyectoData.fechaInicio,
          fechaFin: proyectoData.fechaFin,
          objetivos: proyectoData.objetivos || '',
          presupuesto: proyectoData.presupuesto,
          cliente: proyectoData.cliente,
          ayudantes: personalData.map((asignacion: AsignacionProyecto) => ({
            cedula: asignacion.personal.cedula,
            nombres: asignacion.personal.nombres,
            apellidos: asignacion.personal.apellidos,
            rolEnProyecto: asignacion.rolEnProyecto
          })),
          avances: []
        };
        
        setProyecto(proyectoMapeado);
        setAvances(avancesData);
      } catch (error) {
        console.error('Error al cargar proyecto:', error);
        toast.error('Error al cargar la información del proyecto');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

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

  const handleUploadAvance = async () => {
    if (!selectedFile || !semestre) {
      toast.error('Seleccione un archivo y especifique el semestre');
      return;
    }

    if (!usuario?.id || !proyecto?.id) {
      toast.error('Error: información del usuario o proyecto no disponible');
      return;
    }

    try {
      setUploadingFile(true);
      const nuevoAvance = await avancesService.subirAvance(
        proyecto.id,
        usuario.id,
        semestre,
        selectedFile
      );

      setAvances([nuevoAvance, ...avances]);
      toast.success('Avance subido exitosamente');
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setSemestre('');
    } catch (error) {
      console.error('Error al subir avance:', error);
      toast.error('Error al subir el avance');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDescargarPdf = async (avanceId: number, nombreArchivo?: string) => {
    try {
      const blob = await avancesService.descargarPdf(avanceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo || 'avance.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast.error('Error al descargar el PDF');
    }
  };

  const handleEliminarPdf = async (avanceId: number) => {
    try {
      await avancesService.eliminarPdf(avanceId);
      const avancesActualizados = avances.map(a =>
        a.id === avanceId
          ? { ...a, nombreArchivo: undefined }
          : a
      );
      setAvances(avancesActualizados);
      toast.success('PDF eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar PDF:', error);
      toast.error('Error al eliminar el PDF');
    }
  };

  const handleAprobar = async () => {
    if (!selectedAvance || !usuario?.id) return;

    try {
      const avanceActualizado = await avancesService.aprobarAvance(
        selectedAvance.id,
        usuario.id,
        observaciones
      );

      const avancesActualizados = avances.map(a =>
        a.id === selectedAvance.id ? avanceActualizado : a
      );
      setAvances(avancesActualizados);

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
    } catch (error) {
      console.error('Error al aprobar avance:', error);
      toast.error('Error al aprobar el avance');
    }
  };

  const handleRechazar = async () => {
    if (!selectedAvance || !usuario?.id) return;

    if (!observaciones.trim()) {
      toast.error('Debe proporcionar observaciones para rechazar el avance');
      return;
    }

    try {
      const avanceActualizado = await avancesService.rechazarAvance(
        selectedAvance.id,
        usuario.id,
        observaciones
      );

      const avancesActualizados = avances.map(a =>
        a.id === selectedAvance.id ? avanceActualizado : a
      );
      setAvances(avancesActualizados);

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
    } catch (error) {
      console.error('Error al rechazar avance:', error);
      toast.error('Error al rechazar el avance');
    }
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
    const total = avances.length;
    const aprobados = avances.filter(a => a.estadoAvance === 'APROBADO').length;
    const rechazados = avances.filter(a => a.estadoAvance === 'RECHAZADO').length;
    const pendientes = avances.filter(a => a.estadoAvance === 'PENDIENTE').length;
    const tasaAprobacion = total > 0 ? ((aprobados / total) * 100).toFixed(0) : '0';

    return { total, aprobados, rechazados, pendientes, tasaAprobacion };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando proyecto...</div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Proyecto no encontrado</div>
      </div>
    );
  }

  const stats = calcularEstadisticas();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/proyectos')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{proyecto.nombre}</h1>
          <p className="text-gray-600 mt-1">
            Director: {proyecto.director ? `${proyecto.director.nombres} ${proyecto.director.apellidos}` : 'No asignado'}
          </p>
        </div>
        <Badge className={
          proyecto.estadoProyecto === 'EN_EJECUCION' ? 'bg-green-100 text-green-800' :
          proyecto.estadoProyecto === 'PLANIFICACION' ? 'bg-yellow-100 text-yellow-800' :
          proyecto.estadoProyecto === 'SUSPENDIDO' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }>
          {proyecto.estadoProyecto.replace('_', ' ')}
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
                    {proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString('es-ES') : 'No definida'}
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
                  {proyecto.presupuesto ? `$${proyecto.presupuesto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}` : 'No especificado'}
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
                  {proyecto.director && (
                    <TableRow>
                      <TableCell className="font-medium">
                        {proyecto.director.nombres} {proyecto.director.apellidos}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">Director</Badge>
                      </TableCell>
                    </TableRow>
                  )}
                  {proyecto.ayudantes.map((ayudante) => (
                    <TableRow key={ayudante.cedula}>
                      <TableCell className="font-medium">
                        {ayudante.nombres} {ayudante.apellidos}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-800">{ayudante.rolEnProyecto}</Badge>
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
                    <Button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUploadAvance();
                      }} 
                      className="w-full" 
                      disabled={!selectedFile || !semestre || uploadingFile}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingFile ? 'Subiendo...' : 'Subir Avance'}
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
                {avances.length} avance(s) registrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Estado PDF</TableHead>
                    <TableHead>Estado Avance</TableHead>
                    <TableHead>Director</TableHead>
                    <TableHead>Jefatura</TableHead>
                    <TableHead>Fecha Revisión</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avances.map((avance) => (
                    <TableRow key={avance.id}>
                      <TableCell className="font-medium">{avance.semestre || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(avance.fechaCreacion).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          avance.nombreArchivo ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }>
                          {avance.nombreArchivo ? 'SUBIDO' : 'PENDIENTE'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoBadge(avance.estadoAvance)}>
                          {avance.estadoAvance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {avance.directorNombre || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {avance.jefaturaNombre || (
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Sin revisar
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {avance.fechaRevision 
                          ? new Date(avance.fechaRevision).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {avance.nombreArchivo && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDescargarPdf(avance.id, avance.nombreArchivo)}
                                title="Descargar PDF"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              {isDirector && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      title="Eliminar PDF"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Eliminar PDF?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción eliminará el PDF del avance. Podrás subir uno nuevo posteriormente.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleEliminarPdf(avance.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </>
                          )}
                          {isJefatura && avance.estadoAvance === 'PENDIENTE' && avance.nombreArchivo && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openReviewDialog(avance)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Revisar
                            </Button>
                          )}
                          {avance.observaciones && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast.info(avance.observaciones || 'Sin observaciones');
                              }}
                              title="Ver observaciones"
                            >
                              <Eye className="h-4 w-4" />
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
