// contexts/EmpresaContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const EmpresaContext = createContext();

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error('useEmpresa deve ser usado dentro de um EmpresaProvider');
  }
  return context;
};

export const EmpresaProvider = ({ children }) => {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarEmpresas = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/empresas/usuario/${user.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Garantir que seja um array
      setEmpresas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Erro ao carregar empresas:', error);
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  const selecionarEmpresa = (empresaId) => {
    localStorage.setItem('empresaId', empresaId);
    window.location.href = '/dashboard';
  };

  const carregarEmpresaAtual = async () => {
    const empresaId = localStorage.getItem('empresaId');
    if (!empresaId || !user) {
      setLoading(false);
      return;
    }
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/empresas/${empresaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-empresa-id': empresaId
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setEmpresa(data);
      aplicarTema(data.cores || {});
    } catch (error) {
      console.error('❌ Erro ao carregar empresa atual:', error);
      // Se não encontrar a empresa, limpa a seleção
      localStorage.removeItem('empresaId');
    } finally {
      setLoading(false);
    }
  };

  const aplicarTema = (cores) => {
    const root = document.documentElement;
    Object.entries(cores).forEach(([key, value]) => {
      root.style.setProperty(`--empresa-${key}`, value);
    });
  };

  useEffect(() => {
    if (user) {
      carregarEmpresas();
      carregarEmpresaAtual();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <EmpresaContext.Provider value={{ 
      empresa, 
      empresas, 
      loading, 
      selecionarEmpresa, 
      carregarEmpresas,
      carregarEmpresaAtual
    }}>
      {children}
    </EmpresaContext.Provider>
  );
};