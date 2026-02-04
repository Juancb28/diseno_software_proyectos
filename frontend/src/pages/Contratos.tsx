import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { contratosService, Contrato } from '@/services/contratos.service';
import { personalService } from '@/services/personal.service';
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
import { Badge } from '@/app/components/ui/badge';
import { Upload, FileText, Eye, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Contratos() {
  const { usuario } = useAuth();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [personalList, setPersonalList] = useState<any[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [contratosData, personalData] = await Promise.all([
        contratosService.listarTodos(),
        personalService.listarTodos()
      ]);
      setContratos(contratosData);
      setPersonalList(personalData);
    } catch (error) {
      toast.error('Error al cargar contratos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAyudante = usuario?.tipoRol === 'EMPLEADO';
  const isAdmin = usuario?.tipoRol === 'ADMINISTRADOR';
  
  const filteredContratos = contratos.filter(contrato => {
    if (isAyudante) {
      return contrato.personal.cedula === usuario?.codigo || contrato.personal.codigo === usuario?.codigo;
    }
    return true;
  });

  const getEmpleadoNombre = (personal: any) => {
    return personal ? `${personal.nombres} ${personal.apellidos}` : 'Sin asignar';
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

  const handleUpload = async () => {
    if (!selectedFile || !selectedContrato) {
      toast.error('Seleccione un archivo PDF');
      return;
    }
    
    try {
      await contratosService.subirDocumento(selectedContrato.id, selectedFile);
      toast.success('Contrato subido exitosamente');
      await cargarDatos();
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setSelectedContrato(null);
    } catch (error) {
      toast.error('Error al subir el contrato');
      console.error('Error:', error);
    }
  };

  const viewContrato = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setViewDialogOpen(true);
  };

  const getEstadoBadge = (fechaFin?: string) => {
    if (!fechaFin) return 'bg-green-100 text-green-800';
    const hoy = new Date();
    const fin = new Date(fechaFin);
    if (fin < hoy) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getEstadoLabel = (fechaFin?: string) => {
    if (!fechaFin) return 'ACTIVO';
    const hoy = new Date();
    const fin = new Date(fechaFin);
    if (fin < hoy) return 'VENCIDO';
    return 'ACTIVO';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAyudante ? 'Mi Contrato' : 'Gestión de Contratos'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAyudante ? 'Sube y administra tu contrato' : 'Administra los contratos del personal'}
          </p>
        </div>
        {isAyudante && (
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Subir Contrato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subir Contrato</DialogTitle>
                <DialogDescription>
                  Sube tu contrato en formato PDF (máximo 5MB)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="contrato">Archivo PDF</Label>
                  <Input
                    id="contrato"
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
                      <CheckCircle className="h-5 w-5 text-green-600" />
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
                <Button onClick={handleUpload} className="w-full" disabled={!selectedFile}>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Contrato
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
          <CardDescription>
            {filteredContratos.length} contrato(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Cargando contratos...</TableCell>
                </TableRow>
              ) : filteredContratos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No hay contratos registrados</TableCell>
                </TableRow>
              ) : filteredContratos.map((contrato) => (
                <TableRow key={contrato.id}>
                  <TableCell className="font-medium">{getEmpleadoNombre(contrato.personal)}</TableCell>
                  <TableCell>{new Date(contrato.fechaInicio).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>{contrato.fechaFin ? new Date(contrato.fechaFin).toLocaleDateString('es-ES') : 'Indefinido'}</TableCell>
                  <TableCell>${contrato.salario?.toFixed(2) || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(contrato.fechaFin)}>
                      {getEstadoLabel(contrato.fechaFin)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contrato.archivoSubido ? (
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
                      {contrato.archivoSubido && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewContrato(contrato)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                const blob = await contratosService.descargarDocumento(contrato.id);
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = contrato.nombreDocumento || 'contrato.pdf';
                                a.click();
                                window.URL.revokeObjectURL(url);
                                toast.success('Contrato descargado');
                              } catch (error) {
                                toast.error('Error al descargar el contrato');
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {!contrato.archivoSubido && isAyudante && (contrato.personal.cedula === usuario?.codigo || contrato.personal.codigo === usuario?.codigo) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedContrato(contrato);
                            setUploadDialogOpen(true);
                          }}
                          className="text-blue-600"
                        >
                          <Upload className="h-4 w-4" />
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

      {/* Dialog para ver contrato */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Contrato - {selectedContrato && getEmpleadoNombre(selectedContrato.personal)}</DialogTitle>
            <DialogDescription>
              {selectedContrato?.nombreArchivo}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[500px] flex flex-col items-center justify-center overflow-auto">
            <FileText className="h-24 w-24 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Vista previa del contrato PDF</p>
            <p className="text-sm text-gray-500 mb-6">
              Archivo: {selectedContrato?.nombreArchivo}
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl text-left">
              <h3 className="font-bold text-lg mb-4">CONTRATO DE TRABAJO</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Empleado:</strong> {selectedContrato && getEmpleadoNombre(selectedContrato.personal)}</p>
                <p><strong>Salario:</strong> ${selectedContrato?.salario || 'No especificado'}</p>
                <p><strong>Fecha Inicio:</strong> {selectedContrato && new Date(selectedContrato.fechaInicio).toLocaleDateString('es-ES')}</p>
                <p><strong>Fecha Fin:</strong> {selectedContrato && new Date(selectedContrato.fechaFin).toLocaleDateString('es-ES')}</p>
                <p className="pt-4 text-xs text-gray-500">
                  Este es un documento de ejemplo. En producción se mostraría el PDF real usando un visor de PDF.
                </p>
              </div>
            </div>
            <Button className="mt-6" onClick={() => toast.success('Descargando contrato...')}>
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
