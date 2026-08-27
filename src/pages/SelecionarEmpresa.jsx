// pages/SelecionarEmpresa.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEmpresa } from '../contexts/EmpresaContext';
import { Building2, Shield, Loader2 } from 'lucide-react';

const SelecionarEmpresa = () => {
  const { user, loading: authLoading } = useAuth();
  const { empresas, loading, selecionarEmpresa, carregarEmpresas } = useEmpresa();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  // Verifica autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      carregarEmpresas();
    }
  }, [user, authLoading]);

  // Redireciona se já tiver empresa selecionada
  useEffect(() => {
    const empresaId = localStorage.getItem('empresaId');
    if (empresaId && empresas && empresas.length > 0 && !redirecting) {
      setRedirecting(true);
      navigate('/dashboard');
    }
  }, [empresas]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#FFC400]" />
      </div>
    );
  }

  // Garantir que empresas seja um array
  const empresasList = Array.isArray(empresas) ? empresas : [];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-[#FFC400] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#050D10]">Selecione sua empresa</h1>
          <p className="text-gray-600 mt-2">Escolha a empresa que deseja acessar</p>
        </div>
        
        {empresasList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500">Você não está vinculado a nenhuma empresa.</p>
            <p className="text-sm text-gray-400 mt-2">Entre em contato com o administrador.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {empresasList.map((empresa) => (
              <button
                key={empresa.id}
                onClick={() => selecionarEmpresa(empresa.id)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center" 
                    style={{ backgroundColor: empresa.cores?.primary || '#FFC400' }}
                  >
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: empresa.cores?.secondary || '#050D10' }}>
                      {empresa.nome}
                    </h3>
                    <p className="text-sm text-gray-500">{empresa.dominio}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelecionarEmpresa;