import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, TipoRol } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/NotificationBell';
import { Button } from '@/app/components/ui/button';
import {
  Users,
  FolderGit2,
  UserCog,
  Calendar,
  ClipboardCheck,
  FileText,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface MenuItem {
  title: string;
  icon: ReactNode;
  path: string;
  roles: TipoRol[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Inicio',
    icon: <Home className="h-5 w-5" />,
    path: '/dashboard',
    roles: ['ADMIN', 'JEFATURA', 'DIRECTOR', 'AYUDANTE']
  },
  {
    title: 'Usuarios',
    icon: <Users className="h-5 w-5" />,
    path: '/usuarios',
    roles: ['ADMIN', 'JEFATURA']
  },
  {
    title: 'Proyectos',
    icon: <FolderGit2 className="h-5 w-5" />,
    path: '/proyectos',
    roles: ['ADMIN', 'JEFATURA', 'DIRECTOR']
  },
  {
    title: 'Personal',
    icon: <UserCog className="h-5 w-5" />,
    path: '/personal',
    roles: ['ADMIN', 'JEFATURA', 'DIRECTOR']
  },
  {
    title: 'Ausencias',
    icon: <Calendar className="h-5 w-5" />,
    path: '/ausencias',
    roles: ['ADMIN', 'JEFATURA', 'DIRECTOR']
  },
  {
    title: 'Asistencia',
    icon: <ClipboardCheck className="h-5 w-5" />,
    path: '/asistencia',
    roles: ['ADMIN', 'JEFATURA', 'DIRECTOR', 'AYUDANTE']
  },
  {
    title: 'Contratos',
    icon: <FileText className="h-5 w-5" />,
    path: '/contratos',
    roles: ['ADMIN', 'AYUDANTE']
  }
];

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(usuario?.rol as TipoRol)
  );

  const getRolLabel = (rol: TipoRol) => {
    const labels: Record<TipoRol, string> = {
      ADMIN: 'Administrador',
      JEFATURA: 'Jefatura',
      DIRECTOR: 'Director de Proyecto',
      AYUDANTE: 'Ayudante'
    };
    return labels[rol];
  };

  const showNotifications = ['JEFATURA', 'DIRECTOR', 'AYUDANTE'].includes(usuario?.rol || '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200',
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-indigo-600">Sistema EPN</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{usuario?.nombre}</p>
              <p className="text-xs text-gray-600">{getRolLabel(usuario?.rol as TipoRol)}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      location.pathname === item.path
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all',
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        )}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              {showNotifications && <NotificationBell />}
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}