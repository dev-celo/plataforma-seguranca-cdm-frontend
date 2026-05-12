// components/Planejamento/ConfirmDelete.jsx
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmDelete = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F5ECD7] rounded-2xl w-full max-w-md p-6 border border-[#b7b5b6]">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ff5f1f20' }}>
            <AlertTriangle className="w-6 h-6" style={{ color: '#ff5f1f' }} />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#2C2C2C' }}>
          {title}
        </h2>
        <p className="text-center text-sm mb-6" style={{ color: '#6b7280' }}>
          {message}
        </p>
        
        <div className="flex gap-3">
          <button
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
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: '#ff5f1f',
              color: 'white',
            }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;