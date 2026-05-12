// services/planejamentoApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CODIGO_ACESSO = 'construtoracdm';

// Helper para adicionar o código de acesso em todas as requisições
const getUrl = (endpoint) => {
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${API_URL}${endpoint}${separator}codigo=${CODIGO_ACESSO}`;
};

// ============================
// CARDS (Responsáveis)
// ============================

export const listarCards = async () => {
  const response = await axios.get(getUrl('/planejamento/cards'));
  return response.data;
};

export const criarCard = async (data) => {
  const response = await axios.post(getUrl('/planejamento/cards'), data);
  return response.data;
};

export const atualizarCard = async (id, data) => {
  const response = await axios.put(getUrl(`/planejamento/cards/${id}`), data);
  return response.data;
};

export const excluirCard = async (id) => {
  const response = await axios.delete(getUrl(`/planejamento/cards/${id}`));
  return response.data;
};

// ============================
// TAREFAS
// ============================

export const adicionarTarefa = async (cardId, data) => {
  const response = await axios.post(getUrl(`/planejamento/cards/${cardId}/tarefas`), data);
  return response.data;
};

export const atualizarTarefa = async (cardId, tarefaId, data) => {
  const response = await axios.put(getUrl(`/planejamento/cards/${cardId}/tarefas/${tarefaId}`), data);
  return response.data;
};

export const excluirTarefa = async (cardId, tarefaId) => {
  const response = await axios.delete(getUrl(`/planejamento/cards/${cardId}/tarefas/${tarefaId}`));
  return response.data;
};

export const toggleConcluirTarefa = async (cardId, tarefaId) => {
  const response = await axios.patch(getUrl(`/planejamento/cards/${cardId}/tarefas/${tarefaId}/toggle`));
  return response.data;
};