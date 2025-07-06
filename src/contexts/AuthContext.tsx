import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const viewProfile = async (): Promise<User | null> => {
    if (!token) return null;
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  };

  const deleteProfile = async (): Promise<boolean> => {
    if (!token) return false;
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return false;
    logout();
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, viewProfile, deleteProfile }}>
      {children}
    </AuthContext.Provider>
  );
};