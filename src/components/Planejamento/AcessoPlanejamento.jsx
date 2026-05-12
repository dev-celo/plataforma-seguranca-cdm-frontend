// components/Planejamento/AcessoPlanejamento.jsx
import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';

const AcessoPlanejamento = ({ onAcessoLiberado }) => {
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (codigo === 'construtoracdm') {
      setErro('');
      onAcessoLiberado(true);
      // Salvar na sessão para não pedir novamente
      sessionStorage.setItem('acesso_planejamento', 'liberado');
    } else {
      setErro('Código de acesso inválido');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5ECD7' }}>
      <div className="max-w-md w-full bg-[#D4C4A8] rounded-2xl shadow-xl p-8 border border-[#b7b5b6]">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#6a0200] rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#2C2C2C' }}>
          Planejamento Semanal
        </h2>
        <p className="text-center text-sm mb-6" style={{ color: '#6b7280' }}>
          Área restrita - insira o código de acesso
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Código de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#b7b5b6' }} />
              <input
                type="password"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: '#F5ECD7',
                  borderColor: '#b7b5b6',
                  color: '#2C2C2C',
                }}
                placeholder="Digite o código"
                autoFocus
              />
            </div>
            {erro && (
              <p className="text-sm mt-2" style={{ color: '#ff5f1f' }}>
                {erro}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: '#6a0200',
              color: 'white',
            }}
          >
            Acessar Planejamento
          </button>
        </form>
        
        <p className="text-center text-xs mt-6" style={{ color: '#6b7280' }}>
          CDM Construtora - Gestão de Segurança do Trabalho
        </p>
      </div>
    </div>
  );
};

export default AcessoPlanejamento;