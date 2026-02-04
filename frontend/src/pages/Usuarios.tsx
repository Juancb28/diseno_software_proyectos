import { useState } from 'react';
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

interface Usuario {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

const MOCK_USUARIOS: Usuario[] = [
  { id: 1, username: 'admin', nombre: 'Juan Pérez', email: 'juan@epn.edu.ec', rol: 'ADMIN', estado: 'ACTIVO' },
  { id: 2, username: 'jefatura', nombre: 'María González', email: 'maria@epn.edu.ec', rol: 'JEFATURA', estado: 'ACTIVO' },
  { id: 3, username: 'director', nombre: 'Carlos Ramírez', email: 'carlos@epn.edu.ec', rol: 'DIRECTOR', estado: 'ACTIVO' },
  { id: 4, username: 'ayudante', nombre: 'Ana López', email: 'ana@epn.edu.ec', rol: 'AYUDANTE', estado: 'ACTIVO' },
];

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(MOCK_USUARIOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
    toast.success('Usuario eliminado correctamente');
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setDialogOpen(true);
  };

  const handleSave = () => {
    toast.success(editingUser ? 'Usuario actualizado' : 'Usuario creado');
    setDialogOpen(false);
    setEditingUser(null);
  };

  const getRolBadge = (rol: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-red-100 text-red-800',
      JEFATURA: 'bg-blue-100 text-blue-800',
      DIRECTOR: 'bg-green-100 text-green-800',
      AYUDANTE: 'bg-purple-100 text-purple-800'
    };
    return colors[rol] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
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
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input id="nombre" placeholder="Juan Pérez" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input id="username" placeholder="jperez" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="juan@epn.edu.ec" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select defaultValue="AYUDANTE">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="JEFATURA">Jefatura</SelectItem>
                    <SelectItem value="DIRECTOR">Director</SelectItem>
                    <SelectItem value="AYUDANTE">Ayudante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" />
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
              placeholder="Buscar por nombre, usuario o email..."
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
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.username}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge className={getRolBadge(usuario.rol)}>
                      {usuario.rol}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={usuario.estado === 'ACTIVO' ? 'default' : 'secondary'}>
                      {usuario.estado}
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
