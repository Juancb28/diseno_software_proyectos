import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TipoRol = 'ADMIN' | 'JEFATURA' | 'DIRECTOR' | 'AYUDANTE';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  rol: TipoRol;
  proyectoId?: number;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de usuarios para desarrollo
const MOCK_USUARIOS: Array<Usuario & { password: string }> = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    nombre: 'Juan Pérez',
    rol: 'ADMIN'
  },
  {
    id: 2,
    username: 'jefatura',
    password: 'jefe123',
    nombre: 'María González',
    rol: 'JEFATURA'
  },
  {
    id: 3,
    username: 'director',
    password: 'dir123',
    nombre: 'Carlos Ramírez',
    rol: 'DIRECTOR',
    proyectoId: 1
  },
  {
    id: 4,
    username: 'ayudante',
    password: 'ayu123',
    nombre: 'Ana López',
    rol: 'AYUDANTE'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simular llamada al backend
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USUARIOS.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      const { password: _, ...usuarioSinPassword } = user;
      setUsuario(usuarioSinPassword);
      localStorage.setItem('usuario', JSON.stringify(usuarioSinPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  // Restaurar sesión al cargar
  React.useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        isAuthenticated: !!usuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
