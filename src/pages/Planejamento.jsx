// pages/Planejamento.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Plus,
  RefreshCw,
  Shield,
  Calendar,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import CardPlanejamento from "../components/Planejamento/CardPlanejamento";
import ModalCard from "../components/Planejamento/ModalCard";
import {
  listarCards,
  criarCard,
  atualizarCard,
  excluirCard,
  adicionarTarefa,
  atualizarTarefa,
  excluirTarefa,
  toggleConcluirTarefa,
} from "../services/planejamentoApi";

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
      navigate("/login");
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
      console.error("Erro ao carregar cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.email === "marcelohenrique.backend@gmail.com";

  const handleCriarCard = async (dados) => {
    try {
      const response = await criarCard(dados);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error("Erro ao criar card:", error);
      alert("Erro ao criar card");
    }
  };

  const handleAtualizarCard = async (id, dados) => {
    try {
      const response = await atualizarCard(id, dados);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error("Erro ao atualizar card:", error);
      alert("Erro ao atualizar card");
    }
  };

  const handleExcluirCard = async (id) => {
    if (!isAdmin) {
      alert("Apenas administradores podem excluir cards");
      return;
    }
    try {
      const response = await excluirCard(id);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error("Erro ao excluir card:", error);
      alert("Erro ao excluir card");
    }
  };

  const handleAdicionarTarefa = async (cardId, dados) => {
    // 🔥 Removendo o bloqueio de admin - qualquer usuário pode adicionar tarefas no seu card
    // O backend já valida se o usuário é dono do card ou admin

    console.log(
      "📝 [handleAdicionarTarefa] Adicionando tarefa ao card:",
      cardId,
    );
    console.log("📝 [handleAdicionarTarefa] Dados:", dados);

    try {
      const response = await adicionarTarefa(cardId, dados);
      if (response.success) {
        console.log("✅ Tarefa adicionada com sucesso!");
        await carregarCards();
      } else {
        console.error("❌ Erro na resposta:", response);
        alert(response.error || "Erro ao adicionar tarefa");
      }
    } catch (error) {
      console.error("❌ Erro ao adicionar tarefa:", error);
      alert("Erro ao adicionar tarefa. Verifique se você tem permissão.");
    }
  };

  const handleAtualizarTarefa = async (cardId, tarefaId, dados) => {
    if (!isAdmin) {
      alert("Apenas administradores podem editar tarefas");
      return;
    }
    try {
      const response = await atualizarTarefa(cardId, tarefaId, dados);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Erro ao atualizar tarefa");
    }
  };

  const handleExcluirTarefa = async (cardId, tarefaId) => {
    if (!isAdmin) {
      alert("Apenas administradores podem excluir tarefas");
      return;
    }
    try {
      const response = await excluirTarefa(cardId, tarefaId);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro ao excluir tarefa");
    }
  };

  const handleToggleTarefa = async (cardId, tarefaId) => {
    try {
      const response = await toggleConcluirTarefa(cardId, tarefaId);
      if (response.success) {
        await carregarCards();
      }
    } catch (error) {
      console.error("Erro ao alternar status da tarefa:", error);
      alert("Erro ao atualizar tarefa");
    }
  };

  const handleEditarCard = (card) => {
    if (!isAdmin) {
      alert("Apenas administradores podem editar cards");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-full blur-xl animate-pulse" />
          <div className="relative w-16 h-16 border-4 border-cdm-500 border-t-cdm-700 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Conteúdo principal (Header e Footer já vêm do Layout) */}
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-xl blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-cdm-500 to-cdm-700 p-2 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cdm-600 dark:text-cdm-400">
                Planejamento Semanal
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isAdmin
                  ? "Gestão completa de tarefas"
                  : "Suas tarefas e acompanhamento"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={carregarCards}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
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
                className="btn-gradient flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Card
              </button>
            )}
          </div>
        </div>

        {/* Badge Admin */}
        {isAdmin && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cdm-100 dark:bg-cdm-900/30 text-cdm-600 dark:text-cdm-400 text-xs">
              <Shield className="w-3 h-3" />
              Modo Administrador
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Grid de Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cdm-500" />
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum card de planejamento encontrado.
            </p>
            {isAdmin && (
              <p className="text-sm text-gray-400 mt-2">
                Clique em "Novo Card" para começar.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
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
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Card */}
      <ModalCard
        isOpen={modalCardOpen}
        onClose={() => {
          setModalCardOpen(false);
          setCardEditando(null);
        }}
        onSave={handleSaveCard}
        card={cardEditando}
        title={cardEditando ? "Editar Card" : "Novo Card"}
      />
    </div>
  );
};

export default Planejamento;
