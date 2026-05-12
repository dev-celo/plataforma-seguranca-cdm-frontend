// components/Planejamento/TarefaItem.jsx
import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, Circle, Edit2, Trash2, ExternalLink, Calendar, Clock } from 'lucide-react';

const TarefaItem = ({ tarefa, onToggle, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hoje = new Date().toISOString().split('T')[0];
  const isAtrasada = tarefa.status === 'atrasada';
  const isConcluida = tarefa.status === 'concluida';
  
  const diasRestantes = differenceInDays(new Date(tarefa.dataFim), new Date(), { locale: ptBR });
  const dataFim = format(new Date(tarefa.dataFim), 'dd/MM/yyyy', { locale: ptBR });
  const dataInicio = format(new Date(tarefa.dataInicio), 'dd/MM/yyyy', { locale: ptBR });
  
  let statusColor = '';
  let statusText = '';
  
  if (isConcluida) {
    statusColor = '#4A5D23';
    statusText = 'Concluída';
  } else if (isAtrasada) {
    statusColor = '#ff5f1f';
    statusText = 'Atrasada';
  } else {
    statusColor = '#434a2b';
    statusText = 'Em andamento';
  }
  
  return (
    <div
      className={`p-3 rounded-lg transition-all ${isConcluida ? 'opacity-70' : ''}`}
      style={{
        backgroundColor: '#F5ECD7',
        border: `1px solid ${isHovered ? '#6a0200' : '#b7b5b6'}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox de conclusão */}
        <button
          onClick={onToggle}
          className="mt-0.5 transition-all hover:scale-110"
        >
          {isConcluida ? (
            <CheckCircle className="w-5 h-5" style={{ color: '#4A5D23' }} />
          ) : (
            <Circle className="w-5 h-5" style={{ color: '#b7b5b6' }} />
          )}
        </button>
        
        {/* Conteúdo da tarefa */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm" style={{ color: '#2C2C2C' }}>
              {tarefa.titulo}
            </h4>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: statusColor,
                color: statusColor === '#F5ECD7' ? '#2C2C2C' : 'white',
              }}
            >
              {statusText}
            </span>
          </div>
          
          {tarefa.descricao && (
            <p className="text-xs mb-2" style={{ color: '#6b7280' }}>
              {tarefa.descricao}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" style={{ color: '#b7b5b6' }} />
              <span>{dataInicio} → {dataFim}</span>
            </div>
            
            {!isConcluida && !isAtrasada && diasRestantes >= 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" style={{ color: '#b7b5b6' }} />
                <span>{diasRestantes} dias restantes</span>
              </div>
            )}
            
            {tarefa.anexo && (
              <a
                href={tarefa.anexo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:opacity-70 transition-opacity"
                style={{ color: '#6a0200' }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
                <span>Anexo</span>
              </a>
            )}
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1 rounded transition-all hover:opacity-70"
            style={{ color: '#F5A623' }}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded transition-all hover:opacity-70"
            style={{ color: '#ff5f1f' }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarefaItem;