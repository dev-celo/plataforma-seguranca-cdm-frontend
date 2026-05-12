// pages/Planejamento.jsx
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import AcessoPlanejamento from '../components/Planejamento/AcessoPlanejamento';
import CardPlanejamento from '../components/Planejamento/CardPlanejamento';
import ModalCard from '../components/Planejamento/ModalCard';
import {
  listarCards,
  criarCard,
  atualizarCard,
  excluirCard,
  adicionarTarefa,
  atualizarTarefa,
  excluirTarefa,
  toggleConcluirTarefa,
} from '../services/planejamentoApi';

const Planejamento = () => {
  const [acessoLiberado, setAcessoLiberado] = useState(() => {
    return sessionStorage.getItem('acesso_planejamento') === 'liberado';
  });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCardOpen, setModalCardOpen] = useState(false);
  const [cardEditando, setCardEditando] = useState(null);

  useEffect(() => {
    if (acessoLiberado) {
      carregarCards();
    }
  }, [acessoLiberado]);

  const carregarCards = async () => {
    setLoading(true);
    try {
      const response = await listarCards();
      if (response.success) {
        setCards(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarCard = async (dados) => {
    try {
      const response = await criarCard(dados);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error('Erro ao criar card:', error);
      alert('Erro ao criar card');
    }
  };

  const handleAtualizarCard = async (id, dados) => {
    try {
      const response = await atualizarCard(id, dados);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      alert('Erro ao atualizar card');
    }
  };

  const handleExcluirCard = async (id) => {
    try {
      const response = await excluirCard(id);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error('Erro ao excluir card:', error);
      alert('Erro ao excluir card');
    }
  };

  const handleAdicionarTarefa = async (cardId, dados) => {
    try {
      const response = await adicionarTarefa(cardId, dados);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      alert('Erro ao adicionar tarefa');
    }
  };

  const handleAtualizarTarefa = async (cardId, tarefaId, dados) => {
    try {
      const response = await atualizarTarefa(cardId, tarefaId, dados);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      alert('Erro ao atualizar tarefa');
    }
  };

  const handleExcluirTarefa = async (cardId, tarefaId) => {
    try {
      const response = await excluirTarefa(cardId, tarefaId);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      alert('Erro ao excluir tarefa');
    }
  };

  const handleToggleTarefa = async (cardId, tarefaId) => {
    try {
      const response = await toggleConcluirTarefa(cardId, tarefaId);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error('Erro ao alternar status da tarefa:', error);
      alert('Erro ao atualizar tarefa');
    }
  };

  const handleEditarCard = (card) => {
    setCardEditando(card);
    setModalCardOpen(true);
  };

  const handleSaveCard = (dados) => {
    if (cardEditando) {
      handleAtualizarCard(cardEditando.id, dados);
    } else {
      handleCriarCard(dados);
    }
    setCardEditando(null);
  };

  if (!acessoLiberado) {
    return <AcessoPlanejamento onAcessoLiberado={setAcessoLiberado} />;
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5ECD7' }}>
      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#6a0200' }}>
              Planejamento Semanal
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              Gestão de tarefas por responsável
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={carregarCards}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: '#b7b5b6', color: '#2C2C2C' }}
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
            <button
              onClick={() => {
                setCardEditando(null);
                setModalCardOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: '#6a0200', color: 'white' }}
            >
              <Plus className="w-4 h-4" />
              Novo Card
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#6a0200' }} />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: '#6b7280' }}>
            Nenhum card de planejamento encontrado.
          </p>
          <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
            Clique em "Novo Card" para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <CardPlanejamento
              key={card.id}
              card={card}
              onUpdate={() => handleEditarCard(card)}
              onDelete={handleExcluirCard}
              onToggleTarefa={handleToggleTarefa}
              onAddTarefa={handleAdicionarTarefa}
              onEditTarefa={handleAtualizarTarefa}
              onDeleteTarefa={handleExcluirTarefa}
            />
          ))}
        </div>
      )}

      {/* Modal de Card */}
      <ModalCard
        isOpen={modalCardOpen}
        onClose={() => {
          setModalCardOpen(false);
          setCardEditando(null);
        }}
        onSave={handleSaveCard}
        card={cardEditando}
        title={cardEditando ? 'Editar Card' : 'Novo Card'}
      />
    </div>
  );
};

export default Planejamento;