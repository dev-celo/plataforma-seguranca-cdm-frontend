// components/Planejamento/CardPlanejamento.jsx
import React, { useState } from 'react';
import { User, Mail, Briefcase, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import TarefaItem from './TarefaItem';
import ModalTarefa from './ModalTarefa';
import ConfirmDelete from './ConfirmDelete';

const CardPlanejamento = ({ card, onUpdate, onDelete, onToggleTarefa, onAddTarefa, onEditTarefa, onDeleteTarefa }) => {
  const [modalTarefaOpen, setModalTarefaOpen] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, tipo: null, id: null });
  
  const tarefas = card.tarefas || [];
  const totalTarefas = tarefas.length;
  const concluidas = tarefas.filter(t => t.status === 'concluida').length;
  const progresso = totalTarefas > 0 ? (concluidas / totalTarefas) * 100 : 0;
  
  const handleAddTarefa = (dados) => {
    onAddTarefa(card.id, dados);
  };
  
  const handleEditTarefa = (tarefa) => {
    setTarefaEditando(tarefa);
    setModalTarefaOpen(true);
  };
  
  const handleSaveTarefa = (dados) => {
    if (tarefaEditando) {
      onEditTarefa(card.id, tarefaEditando.id, dados);
    } else {
      handleAddTarefa(dados);
    }
    setTarefaEditando(null);
  };
  
  const handleDeleteCard = () => {
    onDelete(card.id);
    setDeleteConfirm({ isOpen: false, tipo: null, id: null });
  };
  
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl"
      style={{ backgroundColor: '#D4C4A8', border: '1px solid #b7b5b6' }}
    >
      {/* Header do Card */}
      <div className="p-4" style={{ backgroundColor: '#6a0200' }}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{card.responsavel}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-white/80">
              {card.cargo && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {card.cargo}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {card.email}
              </span>
            </div>
          </div>
          <button
            onClick={() => setDeleteConfirm({ isOpen: true, tipo: 'card', id: card.id })}
            className="p-1 rounded transition-all hover:bg-white/20"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      {/* Corpo do Card */}
      <div className="p-4">
        {/* Barra de Progresso */}
        {totalTarefas > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1" style={{ color: '#2C2C2C' }}>
              <span>Progresso</span>
              <span>{concluidas}/{totalTarefas} tarefas</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#b7b5b6' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progresso}%`, backgroundColor: '#4A5D23' }}
              />
            </div>
          </div>
        )}
        
        {/* Lista de Tarefas */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {tarefas.length === 0 ? (
            <div className="text-center py-4 text-sm" style={{ color: '#6b7280' }}>
              Nenhuma tarefa cadastrada
            </div>
          ) : (
            tarefas.map(tarefa => (
              <TarefaItem
                key={tarefa.id}
                tarefa={tarefa}
                onToggle={() => onToggleTarefa(card.id, tarefa.id)}
                onEdit={() => handleEditTarefa(tarefa)}
                onDelete={() => setDeleteConfirm({ isOpen: true, tipo: 'tarefa', id: tarefa.id, cardId: card.id })}
              />
            ))
          )}
        </div>
        
        {/* Botão Adicionar Tarefa */}
        <button
          onClick={() => {
            setTarefaEditando(null);
            setModalTarefaOpen(true);
          }}
          className="w-full mt-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#F5A623', color: '#2C2C2C' }}
        >
          <Plus className="w-4 h-4" />
          Adicionar Tarefa
        </button>
      </div>
      
      {/* Modais */}
      <ModalTarefa
        isOpen={modalTarefaOpen}
        onClose={() => {
          setModalTarefaOpen(false);
          setTarefaEditando(null);
        }}
        onSave={handleSaveTarefa}
        tarefa={tarefaEditando}
        cardId={card.id}
        title={tarefaEditando ? 'Editar Tarefa' : 'Nova Tarefa'}
      />
      
      <ConfirmDelete
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, tipo: null, id: null })}
        onConfirm={() => {
          if (deleteConfirm.tipo === 'card') {
            handleDeleteCard();
          } else if (deleteConfirm.tipo === 'tarefa') {
            onDeleteTarefa(deleteConfirm.cardId, deleteConfirm.id);
            setDeleteConfirm({ isOpen: false, tipo: null, id: null });
          }
        }}
        title={deleteConfirm.tipo === 'card' ? 'Excluir Card' : 'Excluir Tarefa'}
        message={
          deleteConfirm.tipo === 'card'
            ? `Tem certeza que deseja excluir o card de "${card.responsavel}"? Todas as tarefas também serão excluídas.`
            : 'Tem certeza que deseja excluir esta tarefa?'
        }
      />
    </div>
  );
};

export default CardPlanejamento;