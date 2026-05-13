// components/Planejamento/TarefaItem.jsx
import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, Circle, Edit2, Trash2, AlertCircle, Clock, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const TarefaItem = ({ tarefa, isAdmin, onToggle, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isConcluida = tarefa.status === 'concluida';
  const isAtrasada = tarefa.status === 'atrasada';
  
  const diasRestantes = differenceInDays(new Date(tarefa.dataFim), new Date(), { locale: ptBR });
  const dataFim = format(new Date(tarefa.dataFim), 'dd/MM/yyyy');
  const dataInicio = format(new Date(tarefa.dataInicio), 'dd/MM/yyyy');
  
  let statusConfig = {
    icon: null,
    text: '',
    color: '',
    bgColor: '',
  };
  
  if (isConcluida) {
    statusConfig = {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      text: 'Concluída',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    };
  } else if (isAtrasada) {
    statusConfig = {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      text: 'Atrasada',
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    };
  } else {
    statusConfig = {
      icon: <Clock className="w-3.5 h-3.5" />,
      text: 'Em andamento',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    };
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className={`p-3 rounded-xl transition-all duration-200 cursor-pointer ${
        isConcluida 
          ? 'bg-gray-100 dark:bg-gray-800/50' 
          : isHovered 
            ? 'bg-gray-100 dark:bg-gray-700/50' 
            : 'bg-gray-50 dark:bg-gray-800/30'
      } border border-gray-100 dark:border-gray-700/50`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="mt-0.5 transition-transform hover:scale-110 focus:outline-none"
        >
          {isConcluida ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400 transition-colors" />
          )}
        </button>
        
        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm ${isConcluida ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
            {tarefa.titulo}
          </h4>
          
          {tarefa.descricao && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{tarefa.descricao}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <CalendarDays className="w-3 h-3" />
              <span>{dataInicio} → {dataFim}</span>
            </div>
            
            {!isConcluida && diasRestantes >= 0 && (
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{diasRestantes} dias restantes</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Badge Status */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bgColor}`}>
          {statusConfig.icon}
          <span className={`text-[10px] font-medium ${statusConfig.color}`}>{statusConfig.text}</span>
        </div>
        
        {/* Actions - Apenas admin */}
        {isAdmin && (
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-1 rounded text-gray-400 hover:text-amber-500 transition-colors"
              title="Editar tarefa"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded text-gray-400 hover:text-rose-500 transition-colors"
              title="Excluir tarefa"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TarefaItem;