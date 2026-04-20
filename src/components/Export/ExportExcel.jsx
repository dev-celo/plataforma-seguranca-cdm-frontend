import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportToExcel } from '../../services/api';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import {
  Download,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ExportExcel = () => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [exportType, setExportType] = useState('complete');

  const handleExport = async () => {
    setLoading(true);
    try {
      let params = {};
      
      if (period === 'week') {
        const start = startOfWeek(new Date(), { locale: ptBR });
        const end = endOfWeek(new Date(), { locale: ptBR });
        params.startDate = start.toISOString();
        params.endDate = end.toISOString();
      } else if (period === '15days') {
        const start = subDays(new Date(), 15);
        const end = new Date();
        params.startDate = start.toISOString();
        params.endDate = end.toISOString();
      } else if (period === 'month') {
        const start = subDays(new Date(), 30);
        const end = new Date();
        params.startDate = start.toISOString();
        params.endDate = end.toISOString();
      } else if (period === 'custom' && customStartDate && customEndDate) {
        params.startDate = new Date(customStartDate).toISOString();
        params.endDate = new Date(customEndDate).toISOString();
      }
      
      const blob = await exportToExcel(params);
      const fileName = `relatorio_seguranca_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
      saveAs(blob, fileName);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    } finally {
      setLoading(false);
    }
  };

  const exportOptions = [
    {
      id: 'all',
      title: 'Todos os Relatórios',
      description: 'Exporta todos os relatórios disponíveis no sistema',
      icon: FileSpreadsheet,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'week',
      title: 'Última Semana',
      description: 'Relatórios dos últimos 7 dias',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '15days',
      title: 'Últimos 15 Dias',
      description: 'Relatórios dos últimos 15 dias',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'month',
      title: 'Último Mês',
      description: 'Relatórios dos últimos 30 dias',
      icon: Calendar,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'custom',
      title: 'Período Personalizado',
      description: 'Selecione as datas desejadas',
      icon: Users,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
          <FileSpreadsheet className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text">Exportar Dados</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Exporte seus relatórios de segurança para análise em Excel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opções de Exportação */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">Selecione o período</h2>
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = period === option.id;
            
            return (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                className={`glass-card rounded-2xl p-4 cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setPeriod(option.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{option.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Configurações e Prévia */}
        <div className="space-y-6">
          {/* Período Personalizado */}
          {period === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="font-semibold mb-4">Selecione as datas</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data Inicial</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="input-modern"
                    max={customEndDate || undefined}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data Final</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="input-modern"
                    min={customStartDate || undefined}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tipo de Exportação */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Tipo de Relatório</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer">
                <input
                  type="radio"
                  name="exportType"
                  value="complete"
                  checked={exportType === 'complete'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <p className="font-medium">Relatório Completo</p>
                  <p className="text-xs text-gray-500">Todas as informações e indicadores</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer">
                <input
                  type="radio"
                  name="exportType"
                  value="summary"
                  checked={exportType === 'summary'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <p className="font-medium">Resumo Executivo</p>
                  <p className="text-xs text-gray-500">Apenas principais indicadores</p>
                </div>
              </label>
            </div>
          </div>

          {/* Resumo da Seleção */}
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="font-semibold mb-3">Resumo da Exportação</h3>
            <div className="space-y-2 text-sm">
              <p>📊 Período: {
                period === 'all' ? 'Todos os registros' :
                period === 'week' ? 'Última semana' :
                period === '15days' ? 'Últimos 15 dias' :
                period === 'month' ? 'Último mês' :
                `${format(new Date(customStartDate), 'dd/MM/yyyy')} - ${format(new Date(customEndDate), 'dd/MM/yyyy')}`
              }</p>
              <p>📄 Tipo: {exportType === 'complete' ? 'Relatório Completo' : 'Resumo Executivo'}</p>
              <p>📁 Formato: Microsoft Excel (.xlsx)</p>
            </div>
          </div>

          {/* Botão Exportar */}
          <button
            onClick={handleExport}
            disabled={loading || (period === 'custom' && (!customStartDate || !customEndDate))}
            className="btn-gradient w-full py-4 text-lg flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {loading ? 'Exportando...' : 'Exportar para Excel'}
          </button>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-8 glass-card rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-1">Informações importantes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>O arquivo será gerado no formato Excel (.xlsx)</li>
              <li>Os dados são exportados em tempo real do banco de dados</li>
              <li>Relatórios incluem gráficos e análises automáticas</li>
              <li>Períodos muito longos podem demorar alguns segundos para exportar</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExportExcel;