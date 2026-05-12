// components/Planejamento/ModalCard.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModalCard = ({ isOpen, onClose, onSave, card, title }) => {
  const [formData, setFormData] = useState({
    responsavel: '',
    cargo: '',
    email: '',
  });

  useEffect(() => {
    if (card) {
      setFormData({
        responsavel: card.responsavel || '',
        cargo: card.cargo || '',
        email: card.email || '',
      });
    } else {
      setFormData({ responsavel: '', cargo: '', email: '' });
    }
  }, [card, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.responsavel.trim() || !formData.email.trim()) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F5ECD7] rounded-2xl w-full max-w-md p-6 border border-[#b7b5b6]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>{title}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity">
            <X className="w-5 h-5" style={{ color: '#2C2C2C' }} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Nome do Responsável *
            </label>
            <input
              type="text"
              name="responsavel"
              value={formData.responsavel}
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
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Cargo
            </label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6a0200]"
              style={{
                backgroundColor: '#F5ECD7',
                borderColor: '#b7b5b6',
                color: '#2C2C2C',
              }}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
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

export default ModalCard;