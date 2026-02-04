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

export function Dashboard() {
  const { usuario } = useAuth();

  const getStatsForRole = () => {
    switch (usuario?.rol) {
      case 'ADMIN':
        return [
          { title: 'Total Usuarios', value: '24', icon: Users, color: 'text-blue-600' },
          { title: 'Proyectos Activos', value: '12', icon: FolderGit2, color: 'text-green-600' },
          { title: 'Personal', value: '45', icon: UserCog, color: 'text-purple-600' },
          { title: 'Ausencias Pendientes', value: '8', icon: Calendar, color: 'text-orange-600' }
        ];
      case 'JEFATURA':
        return [
          { title: 'Proyectos', value: '12', icon: FolderGit2, color: 'text-green-600' },
          { title: 'Personal', value: '45', icon: UserCog, color: 'text-purple-600' },
          { title: 'Ausencias por Revisar', value: '5', icon: AlertCircle, color: 'text-orange-600' },
          { title: 'Asistencias del Mes', value: '89%', icon: TrendingUp, color: 'text-blue-600' }
        ];
      case 'DIRECTOR':
        return [
          { title: 'Mi Proyecto', value: '1', icon: FolderGit2, color: 'text-green-600' },
          { title: 'Ayudantes', value: '6', icon: UserCog, color: 'text-purple-600' },
          { title: 'Ausencias Registradas', value: '3', icon: Calendar, color: 'text-orange-600' },
          { title: 'Asistencia Promedio', value: '92%', icon: ClipboardCheck, color: 'text-blue-600' }
        ];
      case 'AYUDANTE':
        return [
          { title: 'Mi Asistencia', value: '95%', icon: ClipboardCheck, color: 'text-green-600' },
          { title: 'Días Trabajados', value: '18', icon: TrendingUp, color: 'text-blue-600' },
          { title: 'Ausencias', value: '1', icon: Calendar, color: 'text-orange-600' },
          { title: 'Contrato', value: 'Activo', icon: FileText, color: 'text-purple-600' }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {usuario?.nombre}
        </h1>
        <p className="text-gray-600 mt-1">
          Panel de control - {usuario?.rol === 'ADMIN' ? 'Administrador' : usuario?.rol === 'JEFATURA' ? 'Jefatura' : usuario?.rol === 'DIRECTOR' ? 'Director de Proyecto' : 'Ayudante'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              {usuario?.rol === 'JEFATURA' && (
                <>
                  <div className="flex gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">5 ausencias pendientes de revisión</p>
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
              {usuario?.rol === 'DIRECTOR' && (
                <>
                  <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <FolderGit2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Proyecto actualizado correctamente</p>
                      <p className="text-xs text-gray-600">Última actualización hace 1 hora</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <UserCog className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">6 ayudantes asignados</p>
                      <p className="text-xs text-gray-600">Todos con contratos activos</p>
                    </div>
                  </div>
                </>
              )}
              {usuario?.rol === 'AYUDANTE' && (
                <>
                  <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <ClipboardCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Asistencia registrada hoy</p>
                      <p className="text-xs text-gray-600">Entrada: 09:00 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-purple-50 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contrato vigente</p>
                      <p className="text-xs text-gray-600">Válido hasta Diciembre 2026</p>
                    </div>
                  </div>
                </>
              )}
              {usuario?.rol === 'ADMIN' && (
                <>
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sistema funcionando correctamente</p>
                      <p className="text-xs text-gray-600">24 usuarios activos</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <FolderGit2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">12 proyectos en ejecución</p>
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
