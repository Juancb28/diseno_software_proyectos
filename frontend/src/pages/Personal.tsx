import { useState, useEffect } from 'react';
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
import { Plus, Pencil, Search, FileText, Eye, Upload, CheckCircle, Power } from 'lucide-react';
import { toast } from 'sonner';
import { personalService, Personal as PersonalType } from '@/services/personal.service';
import { contratosService } from '@/services/contratos.service';
import { proyectosService, Proyecto } from '@/services/proyectos.service';
import { usuariosService, Usuario } from '@/services/usuarios.service';

export function Personal() {
  const { usuario } = useAuth();
  const [personal, setPersonal] = useState<PersonalType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contratoDialogOpen, setContratoDialogOpen] = useState(false);
  const [uploadContratoDialogOpen, setUploadContratoDialogOpen] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState<PersonalType | null>(null);
  const [editingPersonal, setEditingPersonal] = useState<PersonalType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [currentContratoId, setCurrentContratoId] = useState<number | null>(null);
  const [rolesByCedula, setRolesByCedula] = useState<Record<string, Usuario['tipoRol']>>({});
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaIngreso: '',
    tipoContrato: 'TIEMPO_COMPLETO' as PersonalType['tipoContrato'],
    departamento: '',
    estadoLaboral: 'ACTIVO' as PersonalType['estadoLaboral'],
    proyectoId: '',
    password: '',
    tipoRol: 'EMPLEADO' as 'ADMINISTRADOR' | 'JEFATURA' | 'DIRECTOR_PROYECTO' | 'EMPLEADO',
  });

  const isDirector = usuario?.tipoRol === 'DIRECTOR_PROYECTO';
  const tieneContratoActual = currentContratoId !== null || !!editingPersonal?.tieneContrato;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([
        personalService.listarTodos(),
        proyectosService.listarTodos(),
        usuariosService.listarTodos(),
      ]);

      const personalResult = results[0];
      const proyectosResult = results[1];
      const usuariosResult = results[2];

      if (personalResult.status === 'fulfilled') {
        setPersonal(personalResult.value);
      } else {
        toast.error('Error al cargar personal');
        console.error(personalResult.reason);
      }

      if (proyectosResult.status === 'fulfilled') {
        setProyectos(proyectosResult.value);
      } else {
        toast.error('Error al cargar proyectos');
        console.error(proyectosResult.reason);
      }

      if (usuariosResult.status === 'fulfilled') {
        const map: Record<string, Usuario['tipoRol']> = {};
        usuariosResult.value.forEach((u) => {
          if (u.username) {
            map[u.username] = u.tipoRol;
          }
        });
        setRolesByCedula(map);
      } else {
        toast.error('Error al cargar usuarios');
        console.error(usuariosResult.reason);
      }
    } catch (error) {
      toast.error('Error al cargar datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPersonal = personal.filter(p => {
    const nombreCompleto = `${p.nombres} ${p.apellidos}`.toLowerCase();
    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase()) ||
      p.cedula.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleDeleteContrato = async () => {
    if (!currentContratoId) return;
    try {
        await contratosService.eliminar(currentContratoId);
        toast.success("Contrato eliminado");
        setCurrentContratoId(null);
        // Actualizar estado local
        if (editingPersonal) {
            setEditingPersonal({...editingPersonal, tieneContrato: false});
        }
        // Actualizar lista visible
        setPersonal((prev) =>
          prev.map((p) =>
            p.cedula === (editingPersonal?.cedula || selectedPersonal?.cedula)
              ? { ...p, tieneContrato: false }
              : p
          )
        );
        await cargarDatos();
        // Limpiar archivo seleccionado
        setSelectedFile(null);
    } catch (error) {
        console.error(error);
        toast.error("Error al eliminar contrato");
    }
  };

  const handleTogglePersonal = async (p: PersonalType) => {
    const nextEstado = p.estadoLaboral === 'INACTIVO' ? 'ACTIVO' : 'INACTIVO';
    const confirmed = window.confirm(`¿Cambiar el estado de ${p.nombres} ${p.apellidos} a ${nextEstado}?`);
    if (!confirmed) return;
    try {
      await personalService.cambiarEstado(p.cedula, nextEstado);
      toast.success(`Estado actualizado a ${nextEstado}`);
      await cargarDatos();
    } catch (error) {
      console.error(error);
      toast.error('Error al cambiar el estado');
    }
  };

  const getEstadoBadge = (estado: PersonalType['estadoLaboral']) => {
    if (estado === 'ACTIVO') return 'bg-green-100 text-green-800';
    if (estado === 'INACTIVO') return 'bg-orange-100 text-orange-800';
    if (estado === 'SUSPENDIDO') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRolBadge = (rol?: Usuario['tipoRol']) => {
    const colors: Record<string, string> = {
      ADMINISTRADOR: 'bg-red-100 text-red-800',
      JEFATURA: 'bg-blue-100 text-blue-800',
      DIRECTOR_PROYECTO: 'bg-green-100 text-green-800',
      EMPLEADO: 'bg-purple-100 text-purple-800',
    };
    return colors[rol || ''] || 'bg-gray-100 text-gray-800';
  };

  const handleSave = async () => {
    try {
      if (editingPersonal) {
        // Actualizar personal existente
        const personalData = {
          cedula: formData.cedula,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          fechaIngreso: formData.fechaIngreso,
          tipoContrato: formData.tipoContrato,
          departamento: formData.departamento,
          estadoLaboral: formData.estadoLaboral,
        };
        await personalService.modificar(editingPersonal.cedula, personalData);

        if (formData.password) {
          const usuario = await usuariosService.buscarPorUsername(editingPersonal.cedula);
          await usuariosService.modificar(usuario.id, {
            username: usuario.username,
            password: formData.password,
          });
        }
        
        // Manejo de Contrato en Edición
        if (selectedFile) {
             const contratoData = {
                fechaInicio: new Date().toISOString().split('T')[0],
                salario: 0,
                estaActivo: true
              };
             await contratosService.crear(editingPersonal.cedula, contratoData, selectedFile);
        }

        toast.success('Personal actualizado correctamente');
      } else {
        // Crear nuevo personal
        if (!formData.password) {
          toast.error('Debe ingresar una contraseña');
          return;
        }
        const personalData = {
          cedula: formData.cedula,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          fechaIngreso: formData.fechaIngreso,
          tipoContrato: formData.tipoContrato,
          departamento: formData.departamento,
          estadoLaboral: formData.estadoLaboral,
        };
        
        let nuevoPersonal;
        if (formData.proyectoId && formData.proyectoId !== 'ninguno') {
          // Registrar con proyecto
          nuevoPersonal = await personalService.registrarConProyecto({
            personal: personalData,
            proyectoId: parseInt(formData.proyectoId),
            rolEnProyecto: 'EMPLEADO'
          });
        } else {
          // Registrar sin proyecto
          nuevoPersonal = await personalService.registrar(personalData);
        }
        
        // Subir contrato si se seleccionó
        if (selectedFile) {
             // Usa la cédula del form or del returned obj
             const cedula = nuevoPersonal ? nuevoPersonal.cedula : formData.cedula; 
             const contratoData = {
                fechaInicio: new Date().toISOString().split('T')[0],
                salario: 0,
                estaActivo: true
              };
             await contratosService.crear(cedula, contratoData, selectedFile);
        }

        // Crear usuario para login
        await usuariosService.registrar({
          username: formData.cedula,
          password: formData.password,
          tipoRol: formData.tipoRol,
          estado: true,
        }, formData.cedula);

        toast.success('Personal creado correctamente');
      }
      
      setDialogOpen(false);
      setEditingPersonal(null);
      setSelectedFile(null);
      setCurrentContratoId(null);
      setFormData({
        cedula: '',
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        direccion: '',
        fechaIngreso: '',
        tipoContrato: 'TIEMPO_COMPLETO',
        departamento: '',
        estadoLaboral: 'ACTIVO',
        proyectoId: '',
        password: '',
        tipoRol: 'EMPLEADO',
      });
      cargarDatos();
    } catch (error) {
      toast.error(editingPersonal ? 'Error al actualizar personal' : 'Error al crear personal');
      console.error(error);
    }
  };

  const viewContrato = async (p: PersonalType) => {
    setSelectedPersonal(p);
    setContratoDialogOpen(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Solo se permiten archivos PDF');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('El archivo no debe superar los 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadContrato = async () => {
    if (!selectedFile || !selectedPersonal) {
      toast.error('Seleccione un archivo PDF');
      return;
    }
    
    try {
      // Primero crear el contrato para este personal
      const contratoData = {
        fechaInicio: new Date().toISOString().split('T')[0],
        salario: 0,
        estaActivo: true
      };
      
      const contratoCreado = await contratosService.crear(selectedPersonal.cedula, contratoData, selectedFile);
      
      // La subida del documento ya se maneja en el crear si se pasa el archivo
      // await contratosService.subirDocumento(contratoCreado.id, selectedFile);
      
      toast.success('Contrato registrado exitosamente');
      await cargarDatos();
      setUploadContratoDialogOpen(false);
      setSelectedFile(null);
      setSelectedPersonal(null);
    } catch (error) {
      toast.error('Error al subir el contrato');
      console.error('Error:', error);
    }
  };

  const openUploadContratoDialog = (personal: PersonalType) => {
    setSelectedPersonal(personal);
    setSelectedFile(null);
    setUploadContratoDialogOpen(true);
  };

  const handleEdit = async (personal: PersonalType) => {
    setEditingPersonal(personal);
    setFormData({
      cedula: personal.cedula,
      nombres: personal.nombres,
      apellidos: personal.apellidos,
      email: personal.email,
      telefono: personal.telefono || '',
      direccion: personal.direccion || '',
      fechaIngreso: personal.fechaIngreso || '',
      tipoContrato: personal.tipoContrato || 'TIEMPO_COMPLETO',
      departamento: personal.departamento || '',
      estadoLaboral: personal.estadoLaboral || 'ACTIVO',
      proyectoId: '',
      password: '',
      tipoRol: 'EMPLEADO',
    });
    
    if (personal.tieneContrato) {
        try {
      const ultimoId = await contratosService.obtenerUltimoIdPorPersonal(personal.cedula);
      setCurrentContratoId(ultimoId);
      if (ultimoId) {
        setEditingPersonal((prev) => (prev ? { ...prev, tieneContrato: true } : prev));
      }
        } catch (e) {
            console.error("Error fetching contracts", e);
        }
    } else {
        setCurrentContratoId(null);
    }
    
    setSelectedFile(null);
    setDialogOpen(true);
  };

  const handleDescargarContrato = async () => {
    if (!selectedPersonal) return;
    try {
      const ultimoId = await contratosService.obtenerUltimoIdPorPersonal(selectedPersonal.cedula);
      if (!ultimoId) {
        toast.error('No se encontró contrato para descargar');
        return;
      }
      const blob = await contratosService.descargarArchivo(ultimoId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrato_${selectedPersonal.cedula}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Descarga iniciada');
    } catch (error) {
      console.error('Error downloading PDF', error);
      toast.error('No se pudo descargar el contrato');
    }
  };

  const getTipoContratoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      TIEMPO_COMPLETO: 'bg-green-100 text-green-800',
      MEDIO_TIEMPO: 'bg-blue-100 text-blue-800',
      POR_HORAS: 'bg-purple-100 text-purple-800',
      OCASIONAL: 'bg-yellow-100 text-yellow-800',
      SERVICIOS_PROFESIONALES: 'bg-indigo-100 text-indigo-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getTipoContratoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      TIEMPO_COMPLETO: 'Tiempo Completo',
      MEDIO_TIEMPO: 'Medio Tiempo',
      POR_HORAS: 'Por Horas',
      OCASIONAL: 'Ocasional',
      SERVICIOS_PROFESIONALES: 'Servicios Profesionales'
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Cargando...</div>;
  }

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
        {(usuario?.tipoRol === 'ADMINISTRADOR' || usuario?.tipoRol === 'JEFATURA' || usuario?.tipoRol === 'DIRECTOR_PROYECTO') && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingPersonal(null);
                setFormData({
                  cedula: '',
                  nombres: '',
                  apellidos: '',
                  email: '',
                  telefono: '',
                  direccion: '',
                  fechaIngreso: '',
                  tipoContrato: 'TIEMPO_COMPLETO',
                  departamento: '',
                  estadoLaboral: 'ACTIVO',
                  proyectoId: '',
                  password: '',
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                {isDirector ? 'Asignar Ayudante' : 'Nuevo Personal'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPersonal ? 'Editar Personal' : (isDirector ? 'Asignar Ayudante al Proyecto' : 'Nuevo Personal')}
                </DialogTitle>
                <DialogDescription>
                  {editingPersonal ? 'Modifica los datos del personal' : 'Complete los datos del personal'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input 
                      id="nombres" 
                      placeholder="Juan"
                      value={formData.nombres}
                      onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input 
                      id="apellidos" 
                      placeholder="Pérez"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input 
                      id="cedula" 
                      placeholder="1234567890"
                      value={formData.cedula}
                      onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                      disabled={!!editingPersonal}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input 
                      id="telefono" 
                      placeholder="0987654321"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="juan@epn.edu.ec"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={editingPersonal ? "Nueva contraseña (opcional)" : "Ingrese una contraseña"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                {!editingPersonal && (
                  <div className="space-y-2">
                    <Label htmlFor="tipoRol">Rol de Usuario</Label>
                    <Select
                      value={formData.tipoRol}
                      onValueChange={(value) => setFormData({ ...formData, tipoRol: value as typeof formData.tipoRol })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                        <SelectItem value="JEFATURA">Jefatura</SelectItem>
                        <SelectItem value="DIRECTOR_PROYECTO">Director de Proyecto</SelectItem>
                        <SelectItem value="EMPLEADO">Empleado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                    <Select 
                      value={formData.tipoContrato}
                      onValueChange={(value) => setFormData({ ...formData, tipoContrato: value as PersonalType['tipoContrato'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TIEMPO_COMPLETO">Tiempo Completo</SelectItem>
                        <SelectItem value="MEDIO_TIEMPO">Medio Tiempo</SelectItem>
                        <SelectItem value="POR_HORAS">Por Horas</SelectItem>
                        <SelectItem value="OCASIONAL">Ocasional</SelectItem>
                        <SelectItem value="SERVICIOS_PROFESIONALES">Servicios Profesionales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                    <Input 
                      id="fechaIngreso" 
                      type="date"
                      value={formData.fechaIngreso}
                      onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                    <Input 
                      id="fechaIngreso" 
                      type="date"
                      value={formData.fechaIngreso}
                      onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proyecto">Proyecto</Label>
                    <Select 
                      value={formData.proyectoId}
                      onValueChange={(value) => setFormData({ ...formData, proyectoId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ninguno">Ninguno</SelectItem>
                        {proyectos.map((proyecto) => (
                          <SelectItem key={proyecto.id} value={proyecto.id!.toString()}>
                            {proyecto.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Sección de Contrato */}
                <div className="space-y-2 border-t pt-4">
                    <Label htmlFor="contrato-upload">
                      {tieneContratoActual ? "Reemplazar Contrato (PDF)" : "Subir Contrato (PDF)"}
                    </Label>
                    <div className="flex gap-2 items-center">
                        <Input 
                            id="contrato-upload" 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileSelect}
                            className="flex-1"
                        />
                      {tieneContratoActual && !selectedFile && currentContratoId && (
                         <span className="text-xs text-gray-600">
                          contrato_{editingPersonal?.cedula || formData.cedula}_{currentContratoId}.pdf
                         </span>
                      )}
                        {tieneContratoActual && (
                             <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon"
                                onClick={handleDeleteContrato}
                                title="Eliminar contrato actual"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                             </Button>
                        )}
                    </div>
                    {tieneContratoActual && (
                        <p className="text-xs text-green-600 font-medium">✓ Este usuario ya tiene un contrato registrado.</p>
                    )}
                </div>

                <Button onClick={handleSave} className="w-full">
                  {editingPersonal ? 'Actualizar Personal' : 'Guardar Personal'}
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
                <TableHead>Estado</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonal.map((p) => (
                <TableRow key={p.cedula}>
                  <TableCell className="font-medium">{`${p.nombres} ${p.apellidos}`}</TableCell>
                  <TableCell>{p.cedula}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.departamento || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={getTipoContratoBadge(p.tipoContrato || 'TIEMPO_COMPLETO')}>
                      {getTipoContratoLabel(p.tipoContrato || 'TIEMPO_COMPLETO')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.tieneContrato ? (
                      <Badge className="bg-green-100 text-green-800">
                        Subido
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(p.estadoLaboral)}>
                      {p.estadoLaboral}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRolBadge(rolesByCedula[p.cedula])}>
                      {rolesByCedula[p.cedula] || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {p.tieneContrato ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewContrato(p)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUploadContratoDialog(p)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Registrar
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleTogglePersonal(p)}>
                        <Power className={`h-4 w-4 ${p.estadoLaboral === 'INACTIVO' ? 'text-green-600' : 'text-amber-600'}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para subir contrato */}
      <Dialog open={uploadContratoDialogOpen} onOpenChange={setUploadContratoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Contrato</DialogTitle>
            <DialogDescription>
              Sube el contrato para {selectedPersonal ? `${selectedPersonal.nombres} ${selectedPersonal.apellidos}` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contrato-file">Archivo PDF</Label>
              <Input
                id="contrato-file"
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
              <p className="text-sm text-blue-900 font-medium mb-2">Requisitos del archivo:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Formato: PDF únicamente</li>
                <li>• Tamaño máximo: 5 MB</li>
                <li>• El documento debe estar firmado</li>
                <li>• Debe ser legible y completo</li>
              </ul>
            </div>
            <Button onClick={handleUploadContrato} className="w-full" disabled={!selectedFile}>
              <Upload className="h-4 w-4 mr-2" />
              Subir Contrato
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para descargar contrato */}
      <Dialog open={contratoDialogOpen} onOpenChange={setContratoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contrato - {selectedPersonal ? `${selectedPersonal.nombres} ${selectedPersonal.apellidos}` : ''}</DialogTitle>
            <DialogDescription>
              Descarga el contrato en PDF
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            <FileText className="h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-600">El contrato se descargará directamente.</p>
            <Button onClick={handleDescargarContrato}>
              <Upload className="h-4 w-4 mr-2 rotate-180" />
              Descargar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
