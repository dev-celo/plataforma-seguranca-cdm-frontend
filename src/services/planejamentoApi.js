// services/planejamentoApi.js
import axios from 'axios';
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 🔥 Função para obter o token do usuário logado
const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('❌ Nenhum usuário logado!');
    throw new Error('Usuário não autenticado');
  }
  const token = await user.getIdToken();
  console.log('✅ Token gerado (primeiros 50 chars):', token.substring(0, 50) + '...');
  return { Authorization: `Bearer ${token}` };
};

// Helper para requisições GET
const get = async (endpoint) => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_URL}${endpoint}`, { headers });
  return response.data;
};

// Helper para requisições POST
const post = async (endpoint, data) => {
  const headers = await getAuthHeader();
  const response = await axios.post(`${API_URL}${endpoint}`, data, { headers });
  return response.data;
};

// Helper para requisições PUT
const put = async (endpoint, data) => {
  const headers = await getAuthHeader();
  const response = await axios.put(`${API_URL}${endpoint}`, data, { headers });
  return response.data;
};

// Helper para requisições DELETE
const del = async (endpoint) => {
  const headers = await getAuthHeader();
  const response = await axios.delete(`${API_URL}${endpoint}`, { headers });
  return response.data;
};

// Helper para requisições PATCH
const patch = async (endpoint) => {
  const headers = await getAuthHeader();
  const response = await axios.patch(`${API_URL}${endpoint}`, {}, { headers });
  return response.data;
};

// ============================
// CARDS (Responsáveis)
// ============================

export const listarCards = async () => {
  return get('/planejamento/cards');
};

export const criarCard = async (data) => {
  return post('/planejamento/cards', data);
};

export const atualizarCard = async (id, data) => {
  return put(`/planejamento/cards/${id}`, data);
};

export const excluirCard = async (id) => {
  return del(`/planejamento/cards/${id}`);
};

// ============================
// TAREFAS
// ============================

export const adicionarTarefa = async (cardId, data) => {
  return post(`/planejamento/cards/${cardId}/tarefas`, data);
};

export const atualizarTarefa = async (cardId, tarefaId, data) => {
  return put(`/planejamento/cards/${cardId}/tarefas/${tarefaId}`, data);
};

export const excluirTarefa = async (cardId, tarefaId) => {
  return del(`/planejamento/cards/${cardId}/tarefas/${tarefaId}`);
};

export const toggleConcluirTarefa = async (cardId, tarefaId) => {
  return patch(`/planejamento/cards/${cardId}/tarefas/${tarefaId}/toggle`);
};