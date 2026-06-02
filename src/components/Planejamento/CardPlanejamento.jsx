// components/Planejamento/CardPlanejamento.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Briefcase, Plus, Edit2, Trash2, TrendingUp, Calendar } from 'lucide-react';
import TarefaItem from './TarefaItem';
import ModalTarefa from './ModalTarefa';
import ConfirmDelete from './ConfirmDelete';
import { useAuth } from '../../contexts/AuthContext';

const CardPlanejamento = ({ card, isAdmin, filtroStatus, onUpdate, onDelete, onToggleTarefa, onAddTarefa, onEditTarefa, onDeleteTarefa, index }) => {
  const { user } = useAuth();
  const [modalTarefaOpen, setModalTarefaOpen] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, tipo: null, id: null });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const tarefas = card.tarefas || [];
  
  // 🔥 FILTRAR TAREFAS POR STATUS
  const tarefasFiltradas = filtroStatus === 'todos' 
    ? tarefas 
    : tarefas.filter(t => t.status === filtroStatus);
  
  // 🔥 ORDENAR tarefas filtradas (Atrasadas → Em andamento → Concluídas)
  const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) => {
    const ordem = { atrasada: 0, pendente: 1, concluida: 2 };
    return ordem[a.status] - ordem[b.status];
  });
  
  // Estatísticas baseadas nas tarefas ORIGINAIS (não filtradas)
  const totalTarefas = tarefas.length;
  const concluidas = tarefas.filter(t => t.status === 'concluida').length;
  const tarefasAtrasadas = tarefas.filter(t => t.status === 'atrasada').length;
  const progresso = totalTarefas > 0 ? (concluidas / totalTarefas) * 100 : 0;
  
  const isOwner = user?.email === card.email;
  const canAddTask = isAdmin || isOwner;
  
  const stats = [
    { label: 'TOTAL', value: totalTarefas, color: 'text-gray-600 dark:text-gray-400' },
    { label: 'CONCLUSÕES', value: concluidas, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'ATRASADAS', value: tarefasAtrasadas, color: 'text-rose-600 dark:text-rose-400' },
  ];
  
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
        isHovered 
          ? 'shadow-2xl -translate-y-1' 
          : 'shadow-lg'
      }`}
      style={{
        backgroundColor: isHovered ? '#ffffff' : '#f8fafc',
        border: '1px solid #e2e8f0',
      }}
    >
      {/* Efeito de gradiente sutil no hover */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.03), transparent 70%)',
        }}
      />
      
      {/* Header do Card */}
      <div className="relative px-5 pt-5 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              {card.responsavel}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {card.cargo && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  {card.cargo}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Mail className="w-3.5 h-3.5" />
                {card.email}
              </span>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setDeleteConfirm({ isOpen: true, tipo: 'card', id: card.id })}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="px-5 pt-2">
        <div className="grid grid-cols-3 gap-2">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/50">
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Barra de Progresso */}
      {totalTarefas > 0 && (
        <div className="px-5 pt-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progresso geral</span>
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {Math.round(progresso)}%
            </span>
          </div>
          <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              className="absolute h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
            />
          </div>
        </div>
      )}
      
      {/* Lista de Tarefas */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tarefas • {totalTarefas}
          </span>
          {tarefas.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {isExpanded ? 'Ver menos' : `Ver +${tarefas.length - 3}`}
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
          {tarefasOrdenadas.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">Nenhuma tarefa cadastrada</p>
              {canAddTask && (
                <p className="text-xs text-gray-400 mt-1">Clique em "Adicionar" para começar</p>
              )}
            </div>
          ) : (
            tarefasOrdenadas.slice(0, isExpanded ? undefined : 3).map(tarefa => (
              <TarefaItem
                key={tarefa.id}
                tarefa={tarefa}
                isAdmin={isAdmin}
                onToggle={() => onToggleTarefa(card.id, tarefa.id)}
                onEdit={() => handleEditTarefa(tarefa)}
                onDelete={() => setDeleteConfirm({ isOpen: true, tipo: 'tarefa', id: tarefa.id, cardId: card.id })}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Botão Adicionar Tarefa */}
      {canAddTask && (
        <div className="px-5 pb-5 pt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setTarefaEditando(null);
              setModalTarefaOpen(true);
            }}
            className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Adicionar Tarefa
          </motion.button>
        </div>
      )}
      
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
    </motion.div>
  );
};

export default CardPlanejamento;