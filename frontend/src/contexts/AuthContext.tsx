import React, { createContext, useContext, useState, ReactNode } from 'react';
import { usuariosService, Usuario as UsuarioAPI } from '@/services/usuarios.service';

export type TipoRol = 'ADMINISTRADOR' | 'JEFATURA' | 'DIRECTOR_PROYECTO' | 'EMPLEADO';

export interface Usuario {
  id: number;
  username: string;
  codigo?: string;
  tipoRol: TipoRol;
  estado: boolean;
  estaActivo: boolean;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await usuariosService.autenticar({ username, password });
      
      if (response.autenticado && response.usuario) {
        const usuarioData: Usuario = {
          id: response.usuario.id,
          username: response.usuario.username,
          codigo: response.usuario.codigo,
          tipoRol: response.usuario.tipoRol,
          estado: response.usuario.estado,
          estaActivo: response.usuario.estaActivo
        };
        setUsuario(usuarioData);
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
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
