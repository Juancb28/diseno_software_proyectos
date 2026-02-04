import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Users,
  FolderGit2,
  UserCog,
  Calendar,
  ClipboardCheck,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { usuariosService } from '@/services/usuarios.service';
import { personalService } from '@/services/personal.service';
import { proyectosService } from '@/services/proyectos.service';
import { ausenciasService } from '@/services/ausencias.service';

interface Stats {
  totalUsuarios: number;
  totalPersonal: number;
  proyectosActivos: number;
  ausenciasPendientes: number;
}

export function Dashboard() {
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsuarios: 0,
    totalPersonal: 0,
    proyectosActivos: 0,
    ausenciasPendientes: 0
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const [usuarios, personal, proyectos, ausencias] = await Promise.all([
        usuariosService.listarTodos(),
        personalService.listarTodos(),
        proyectosService.listarTodos(),
        ausenciasService.listarTodas()
      ]);

      const proyectosActivos = proyectos.filter(p => p.estadoProyecto === 'EN_EJECUCION').length;
      const ausenciasPendientes = ausencias.filter(a => a.estado === 'PENDIENTE').length;

      setStats({
        totalUsuarios: usuarios.length,
        totalPersonal: personal.length,
        proyectosActivos,
        ausenciasPendientes
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatsForRole = () => {
    switch (usuario?.tipoRol) {
      case 'ADMINISTRADOR':
        return [
          { title: 'Total Usuarios', value: stats.totalUsuarios.toString(), icon: Users, color: 'text-blue-600' },
          { title: 'Proyectos Activos', value: stats.proyectosActivos.toString(), icon: FolderGit2, color: 'text-green-600' },
          { title: 'Personal', value: stats.totalPersonal.toString(), icon: UserCog, color: 'text-purple-600' },
          { title: 'Ausencias Pendientes', value: stats.ausenciasPendientes.toString(), icon: Calendar, color: 'text-orange-600' }
        ];
      case 'JEFATURA':
        return [
          { title: 'Proyectos', value: stats.proyectosActivos.toString(), icon: FolderGit2, color: 'text-green-600' },
          { title: 'Personal', value: stats.totalPersonal.toString(), icon: UserCog, color: 'text-purple-600' },
          { title: 'Ausencias por Revisar', value: stats.ausenciasPendientes.toString(), icon: AlertCircle, color: 'text-orange-600' },
          { title: 'Asistencias del Mes', value: '89%', icon: TrendingUp, color: 'text-blue-600' }
        ];
      case 'DIRECTOR_PROYECTO':
        return [
          { title: 'Proyectos', value: stats.proyectosActivos.toString(), icon: FolderGit2, color: 'text-green-600' },
          { title: 'Personal', value: stats.totalPersonal.toString(), icon: UserCog, color: 'text-purple-600' },
          { title: 'Ausencias Registradas', value: stats.ausenciasPendientes.toString(), icon: Calendar, color: 'text-orange-600' },
          { title: 'Total Usuarios', value: stats.totalUsuarios.toString(), icon: Users, color: 'text-blue-600' }
        ];
      case 'EMPLEADO':
        return [
          { title: 'Proyectos', value: stats.proyectosActivos.toString(), icon: FolderGit2, color: 'text-green-600' },
          { title: 'Personal', value: stats.totalPersonal.toString(), icon: UserCog, color: 'text-blue-600' },
          { title: 'Ausencias', value: stats.ausenciasPendientes.toString(), icon: Calendar, color: 'text-orange-600' },
          { title: 'Total Usuarios', value: stats.totalUsuarios.toString(), icon: Users, color: 'text-purple-600' }
        ];
      default:
        return [];
    }
  };

  const statsCards = getStatsForRole();

  if (loading) {
    return <div className="flex items-center justify-center h-64">Cargando estadísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {usuario?.username}
        </h1>
        <p className="text-gray-600 mt-1">
          Panel de control - {usuario?.tipoRol === 'ADMINISTRADOR' ? 'Administrador' : usuario?.tipoRol === 'JEFATURA' ? 'Jefatura' : usuario?.tipoRol === 'DIRECTOR_PROYECTO' ? 'Director de Proyecto' : 'Empleado'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nuevo proyecto creado', time: 'Hace 2 horas' },
                { action: 'Ausencia aprobada', time: 'Hace 5 horas' },
                { action: 'Contrato actualizado', time: 'Hace 1 día' },
                { action: 'Personal agregado', time: 'Hace 2 días' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-gray-700">{activity.action}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Avisos importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuario?.tipoRol === 'JEFATURA' && (
                <>
                  <div className="flex gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stats.ausenciasPendientes} ausencias pendientes de revisión</p>
                      <p className="text-xs text-gray-600">Requieren tu aprobación</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <ClipboardCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Reporte de asistencia disponible</p>
                      <p className="text-xs text-gray-600">Enero 2026</p>
                    </div>
                  </div>
                </>
              )}
              {usuario?.tipoRol === 'DIRECTOR_PROYECTO' && (
                <>
                  <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <FolderGit2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stats.proyectosActivos} proyectos activos</p>
                      <p className="text-xs text-gray-600">En ejecución</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <UserCog className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stats.totalPersonal} personal registrado</p>
                      <p className="text-xs text-gray-600">Total en el sistema</p>
                    </div>
                  </div>
                </>
              )}
              {usuario?.tipoRol === 'EMPLEADO' && (
                <>
                  <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <FolderGit2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stats.proyectosActivos} proyectos en ejecución</p>
                      <p className="text-xs text-gray-600">Activos en el sistema</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-orange-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stats.ausenciasPendientes} ausencias pendientes</p>
                      <p className="text-xs text-gray-600">En revisión</p>
                    </div>
                  </div>
                </>
              )}
              {usuario?.tipoRol === 'ADMINISTRADOR' && (
                <>
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sistema funcionando correctamente</p>
                      <p className="text-xs text-gray-600">{stats.totalUsuarios} usuarios activos</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <FolderGit2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stats.proyectosActivos} proyectos en ejecución</p>
                      <p className="text-xs text-gray-600">Todos con directores asignados</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
