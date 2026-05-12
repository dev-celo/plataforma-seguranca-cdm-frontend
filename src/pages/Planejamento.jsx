// pages/Planejamento.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, RefreshCw, Shield } from 'lucide-react';
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
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCardOpen, setModalCardOpen] = useState(false);
  const [cardEditando, setCardEditando] = useState(null);

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      carregarCards();
    }
  }, [user]);

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

  const isAdmin = user?.email === 'marcelohenrique.backend@gmail.com';

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
    if (!isAdmin) {
      alert('Apenas administradores podem excluir cards');
      return;
    }
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
    if (!isAdmin) {
      alert('Apenas administradores podem adicionar tarefas');
      return;
    }
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
    if (!isAdmin) {
      alert('Apenas administradores podem editar tarefas');
      return;
    }
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
    if (!isAdmin) {
      alert('Apenas administradores podem excluir tarefas');
      return;
    }
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
    if (!isAdmin) {
      alert('Apenas administradores podem editar cards');
      return;
    }
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

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#F5ECD7' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#6a0200' }} />
      </div>
    );
  }

  if (!user) {
    return null;
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
              {isAdmin ? 'Gestão completa de tarefas' : 'Suas tarefas e acompanhamento'}
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
            {isAdmin && (
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
            )}
          </div>
        </div>
      </div>

      {/* Badge Admin */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#6a0200', color: 'white' }}>
            <Shield className="w-3 h-3" />
            Modo Administrador
          </div>
        </div>
      )}

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
          {isAdmin && (
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
              Clique em "Novo Card" para começar.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <CardPlanejamento
              key={card.id}
              card={card}
              isAdmin={isAdmin}
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