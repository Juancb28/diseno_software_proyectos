import { useState, useEffect } from 'react';
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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { usuariosService, Usuario } from '@/services/usuarios.service';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    tipoRol: 'EMPLEADO' as Usuario['tipoRol'],
    estado: true,
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosService.listarTodos();
      setUsuarios(data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await usuariosService.eliminar(id);
      toast.success('Usuario eliminado correctamente');
      cargarUsuarios();
    } catch (error) {
      toast.error('Error al eliminar usuario');
      console.error(error);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      username: usuario.username,
      password: '',
      tipoRol: usuario.tipoRol,
      estado: usuario.estado,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await usuariosService.modificar(editingUser.id, formData);
        toast.success('Usuario actualizado');
      } else {
        await usuariosService.registrar(formData);
        toast.success('Usuario creado');
      }
      setDialogOpen(false);
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        tipoRol: 'EMPLEADO',
        estado: true,
      });
      cargarUsuarios();
    } catch (error) {
      toast.error('Error al guardar usuario');
      console.error(error);
    }
  };

  const getRolBadge = (rol: string) => {
    const colors: Record<string, string> = {
      ADMINISTRADOR: 'bg-red-100 text-red-800',
      JEFATURA: 'bg-blue-100 text-blue-800',
      DIRECTOR_PROYECTO: 'bg-green-100 text-green-800',
      EMPLEADO: 'bg-purple-100 text-purple-800'
    };
    return colors[rol] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingUser(null);
              setFormData({
                username: '',
                password: '',
                tipoRol: 'EMPLEADO',
                estado: true,
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
              <DialogDescription>
                Complete los datos del usuario
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input 
                  id="username" 
                  placeholder="admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoRol">Rol</Label>
                <Select 
                  value={formData.tipoRol}
                  onValueChange={(value) => setFormData({ ...formData, tipoRol: value as Usuario['tipoRol'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                    <SelectItem value="JEFATURA">Jefatura</SelectItem>
                    <SelectItem value="DIRECTOR_PROYECTO">Director de Proyecto</SelectItem>
                    <SelectItem value="EMPLEADO">Empleado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña{editingUser && ' (dejar en blanco para no cambiar)'}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingUser ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsuarios.length} usuario(s) encontrado(s)
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, código o email..."
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
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.username}</TableCell>
                  <TableCell>
                    <Badge className={getRolBadge(usuario.tipoRol)}>
                      {usuario.tipoRol === 'ADMINISTRADOR' ? 'Administrador' : 
                       usuario.tipoRol === 'JEFATURA' ? 'Jefatura' :
                       usuario.tipoRol === 'DIRECTOR_PROYECTO' ? 'Director' : 'Empleado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={usuario.estado ? 'default' : 'secondary'}>
                      {usuario.estado ? 'ACTIVO' : 'INACTIVO'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(usuario)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(usuario.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
