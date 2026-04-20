import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getReports } from '../../services/api';
import KPICards from './KPICards';
import Charts from './Charts';
import ComparativeAnalysis from './ComparativeAnalysis';
import { 
  startOfWeek, 
  endOfWeek, 
  subDays, 
  isWithinInterval, 
  parseISO,
  format 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getMissingDaysInfo } from '../../utils/dateUtils';
import { Calendar, TrendingUp, AlertCircle, HardHat, Loader2, Building2 } from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [selectedTST, setSelectedTST] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await getReports();
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodData = () => {
    const now = new Date();
    let startDate, endDate, label;
    
    if (period === 'week') {
      startDate = startOfWeek(now, { locale: ptBR });
      endDate = endOfWeek(now, { locale: ptBR });
      label = 'Esta Semana';
    } else if (period === '15days') {
      startDate = subDays(now, 15);
      endDate = now;
      label = 'Últimos 15 Dias';
    } else {
      startDate = subDays(now, 30);
      endDate = now;
      label = 'Último Mês';
    }
    
    let filtered = reports.filter(r => {
      const date = parseISO(r.createdAt);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
    
    if (selectedTST !== 'all') {
      filtered = filtered.filter(r => r.tstResponsavel === selectedTST);
    }
    
    const missingInfo = getMissingDaysInfo(filtered, startDate, endDate);
    
    return {
      reports: filtered,
      missingInfo,
      startDate,
      endDate,
      label,
      totalReports: filtered.length
    };
  };

  const getKPIData = () => {
    const data = getPeriodData();
    const reports_array = data.reports;
    
    const totalInspecoes = reports_array.reduce((sum, r) => 
      sum + (r.indicadores?.quantidadeInspecoes || 0), 0);
    
    const totalDesvios = reports_array.reduce((sum, r) => 
      sum + (r.indicadores?.quantidadeDesvios || 0), 0);
    
    const totalDDS = reports_array.filter(r => r.ddsRealizado?.tema?.trim()).length;
    
    const totalTreinamentos = reports_array.reduce((sum, r) => 
      sum + (r.treinamentosCampanhas?.length || 0), 0);
    
    const totalOrientacoes = reports_array.reduce((sum, r) => 
      sum + (r.indicadores?.quantidadeOrientacoes || 0), 0);
    
    const desvioPercent = totalInspecoes > 0 ? (totalDesvios / totalInspecoes) * 100 : 0;
    
    // Calcular conformidade de EPI
    let epiChecks = 0;
    let epiConform = 0;
    reports_array.forEach(r => {
      const epiInspecao = r.inspecoes?.find(i => i.includes('EPIs'));
      if (epiInspecao) {
        epiChecks++;
        if (epiInspecao.includes('OK') || epiInspecao.includes('Conforme')) {
          epiConform++;
        }
      }
    });
    const epiPercent = epiChecks > 0 ? (epiConform / epiChecks) * 100 : 100;
    
    // Classificação dos desvios
    let desviosLeves = 0, desviosModerados = 0, desviosGraves = 0;
    reports_array.forEach(r => {
      desviosLeves += r.classificacaoDesvios?.desvioLeve || 0;
      desviosModerados += r.classificacaoDesvios?.desvioModerado || 0;
      desviosGraves += r.classificacaoDesvios?.desvioGrave || 0;
    });
    
    // Condição geral da área
    const condicoes = {
      segura: reports_array.filter(r => r.condicaoGeralArea === 'Segura').length,
      atencao: reports_array.filter(r => r.condicaoGeralArea === 'Atenção').length,
      critica: reports_array.filter(r => r.condicaoGeralArea === 'Crítica').length
    };
    
    return {
      totalInspecoes,
      totalDesvios,
      desvioPercent,
      totalDDS,
      totalTreinamentos,
      totalOrientacoes,
      epiPercent,
      desviosLeves,
      desviosModerados,
      desviosGraves,
      condicoes,
      totalReports: reports_array.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cdm-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const periodData = getPeriodData();
  const kpiData = getKPIData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-xl flex items-center justify-center shadow-lg">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-cdm-600 dark:text-cdm-400">
                Dashboard de Segurança
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                CDM Construtora - Gestão de Segurança do Trabalho
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedTST}
            onChange={(e) => setSelectedTST(e.target.value)}
            className="input-modern w-40"
          >
            <option value="all">Todos TSTs</option>
            <option value="Mônica">Mônica</option>
            <option value="Vannic">Vannic</option>
          </select>
          
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-modern w-44"
          >
            <option value="week">📅 Esta Semana</option>
            <option value="15days">📊 Últimos 15 Dias</option>
            <option value="month">📈 Último Mês</option>
          </select>
        </div>
      </div>

      {/* Alertas de Dias não trabalhados */}
      {periodData.missingInfo.hasMissing && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">
                Atenção: Dias não trabalhados identificados
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-500">
                No período de {format(periodData.startDate, 'dd/MM/yyyy')} a {format(periodData.endDate, 'dd/MM/yyyy')}, 
                tivemos {periodData.missingInfo.missingDays} dia(s) não trabalhado(s) 
                (feriados ou finais de semana). Total de {periodData.missingInfo.totalWorkingDays} dias úteis no período.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPIs Cards */}
      <KPICards kpiData={kpiData} periodLabel={periodData.label} />

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Charts reports={periodData.reports} />
        </div>
        <div>
          <ComparativeAnalysis reports={periodData.reports} />
        </div>
      </div>

      {/* Resumo de Desvios por Gravidade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cdm-500" />
          Classificação dos Desvios por Gravidade
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{kpiData.desviosLeves}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Desvios Leves</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{kpiData.desviosModerados}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Desvios Moderados</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{kpiData.desviosGraves}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Desvios Graves</p>
          </div>
        </div>
      </motion.div>

      {/* Condição Geral da Área */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <HardHat className="w-5 h-5 text-cdm-500" />
          Condição Geral da Área
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{kpiData.condicoes.segura}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Segura</p>
          </div>
          <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
            <p className="text-2xl font-bold text-yellow-600">{kpiData.condicoes.atencao}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Atenção</p>
          </div>
          <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <p className="text-2xl font-bold text-red-600">{kpiData.condicoes.critica}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Crítica</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;