// components/Planejamento/ModalTarefa.jsx
import React, { useState, useEffect } from 'react';
import { X, Paperclip, Repeat } from 'lucide-react';

const ModalTarefa = ({ isOpen, onClose, onSave, tarefa, cardId, title }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: new Date().toISOString().split('T')[0],
    anexo: '',
    recorrencia: 'nenhuma',  // ← NOVO CAMPO
  });

  useEffect(() => {
    if (tarefa) {
      setFormData({
        titulo: tarefa.titulo || '',
        descricao: tarefa.descricao || '',
        dataInicio: tarefa.dataInicio || new Date().toISOString().split('T')[0],
        dataFim: tarefa.dataFim || new Date().toISOString().split('T')[0],
        anexo: tarefa.anexo || '',
        recorrencia: tarefa.recorrencia || 'nenhuma',
      });
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        dataInicio: new Date().toISOString().split('T')[0],
        dataFim: new Date().toISOString().split('T')[0],
        anexo: '',
        recorrencia: 'nenhuma',
      });
    }
  }, [tarefa, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) {
      alert('Título da tarefa é obrigatório');
      return;
    }
    if (!formData.dataInicio || !formData.dataFim) {
      alert('Datas são obrigatórias');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-2xl w-full max-w-lg p-6 border shadow-xl"
        style={{ 
          backgroundColor: '#F5ECD7', 
          borderColor: '#b7b5b6',
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>{title}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity">
            <X className="w-5 h-5" style={{ color: '#2C2C2C' }} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Título */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Título da Tarefa *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6a0200] transition-all"
              style={{
                backgroundColor: '#F5ECD7',
                borderColor: '#b7b5b6',
                color: '#2C2C2C',
              }}
              required
            />
          </div>
          
          {/* Descrição */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6a0200] resize-none"
              style={{
                backgroundColor: '#F5ECD7',
                borderColor: '#b7b5b6',
                color: '#2C2C2C',
              }}
            />
          </div>
          
          {/* Datas */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                Data Início *
              </label>
              <input
                type="date"
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6a0200]"
                style={{
                  backgroundColor: '#F5ECD7',
                  borderColor: '#b7b5b6',
                  color: '#2C2C2C',
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                Data Fim *
              </label>
              <input
                type="date"
                name="dataFim"
                value={formData.dataFim}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6a0200]"
                style={{
                  backgroundColor: '#F5ECD7',
                  borderColor: '#b7b5b6',
                  color: '#2C2C2C',
                }}
                required
              />
            </div>
          </div>
          
          {/* Anexo */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Anexo (URL)
            </label>
            <div className="relative">
              <Paperclip className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#b7b5b6' }} />
              <input
                type="url"
                name="anexo"
                value={formData.anexo}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6a0200]"
                style={{
                  backgroundColor: '#F5ECD7',
                  borderColor: '#b7b5b6',
                  color: '#2C2C2C',
                }}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* 🔥 NOVO CAMPO: RECORRÊNCIA */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              <Repeat className="w-4 h-4 inline mr-1" style={{ color: '#6a0200' }} />
              Recorrência
            </label>
            <select
              name="recorrencia"
              value={formData.recorrencia}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6a0200] cursor-pointer"
              style={{
                backgroundColor: '#F5ECD7',
                borderColor: '#b7b5b6',
                color: '#2C2C2C',
              }}
            >
              <option value="nenhuma">📌 Sem recorrência</option>
              <option value="diaria">🔄 Diária</option>
              <option value="semanal">📅 Semanal</option>
              <option value="quinzenal">📆 Quinzenal</option>
              <option value="mensal">🗓️ Mensal</option>
            </select>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
              Tarefas recorrentes serão recriadas automaticamente após a data de fim
            </p>
          </div>
          
          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg font-medium transition-all hover:opacity-70"
              style={{
                backgroundColor: '#b7b5b6',
                color: '#2C2C2C',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: '#6a0200',
                color: 'white',
              }}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTarefa;