import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { subDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getMissingDaysInfo } from '../../utils/dateUtils';

const ComparativeAnalysis = ({ reports }) => {
  // Calcular dados da última semana
  const now = new Date();
  const lastWeekStart = startOfWeek(now, { locale: ptBR });
  const lastWeekEnd = endOfWeek(now, { locale: ptBR });
  const last15DaysStart = subDays(now, 15);
  
  const lastWeekReports = reports.filter(r => {
    const date = parseISO(r.createdAt);
    return isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd });
  });
  
  const last15DaysReports = reports.filter(r => {
    const date = parseISO(r.createdAt);
    return date >= last15DaysStart;
  });
  
  const lastWeekMissing = getMissingDaysInfo(lastWeekReports, lastWeekStart, lastWeekEnd);
  const last15DaysMissing = getMissingDaysInfo(last15DaysReports, last15DaysStart, now);
  
  // Calcular métricas da última semana
  const lastWeekMetrics = {
    totalInspecoes: lastWeekReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeInspecoes || 0), 0),
    totalDesvios: lastWeekReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeDesvios || 0), 0),
    totalDDS: lastWeekReports.filter(r => r.ddsRealizado?.tema?.trim()).length,
    totalTreinamentos: lastWeekReports.reduce((sum, r) => sum + (r.treinamentosCampanhas?.length || 0), 0),
    totalOrientacoes: lastWeekReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeOrientacoes || 0), 0),
    diasTrabalhados: lastWeekMissing.reportedDays,
    diasEsperados: lastWeekMissing.totalWorkingDays
  };
  
  lastWeekMetrics.taxaDesvios = lastWeekMetrics.totalInspecoes > 0 
    ? (lastWeekMetrics.totalDesvios / lastWeekMetrics.totalInspecoes) * 100 
    : 0;
  
  // Calcular métricas dos últimos 15 dias
  const last15DaysMetrics = {
    totalInspecoes: last15DaysReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeInspecoes || 0), 0),
    totalDesvios: last15DaysReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeDesvios || 0), 0),
    totalDDS: last15DaysReports.filter(r => r.ddsRealizado?.tema?.trim()).length,
    totalTreinamentos: last15DaysReports.reduce((sum, r) => sum + (r.treinamentosCampanhas?.length || 0), 0),
    totalOrientacoes: last15DaysReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeOrientacoes || 0), 0),
    diasTrabalhados: last15DaysMissing.reportedDays,
    diasEsperados: last15DaysMissing.totalWorkingDays
  };
  
  last15DaysMetrics.taxaDesvios = last15DaysMetrics.totalInspecoes > 0 
    ? (last15DaysMetrics.totalDesvios / last15DaysMetrics.totalInspecoes) * 100 
    : 0;
  
  // Calcular variações
  const calculateVariation = (current, previous) => {
    if (previous === 0) return { value: current > 0 ? 100 : 0, type: current > 0 ? 'up' : 'neutral' };
    const variation = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(variation).toFixed(1),
      type: variation > 0 ? 'up' : variation < 0 ? 'down' : 'neutral'
    };
  };
  
  const variations = {
    inspecoes: calculateVariation(last15DaysMetrics.totalInspecoes, lastWeekMetrics.totalInspecoes),
    desvios: calculateVariation(last15DaysMetrics.totalDesvios, lastWeekMetrics.totalDesvios),
    taxaDesvios: calculateVariation(last15DaysMetrics.taxaDesvios, lastWeekMetrics.taxaDesvios),
    dds: calculateVariation(last15DaysMetrics.totalDDS, lastWeekMetrics.totalDDS),
    treinamentos: calculateVariation(last15DaysMetrics.totalTreinamentos, lastWeekMetrics.totalTreinamentos),
    orientacoes: calculateVariation(last15DaysMetrics.totalOrientacoes, lastWeekMetrics.totalOrientacoes)
  };
  
  const getTrendIcon = (type) => {
    if (type === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (type === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };
  
  const getTrendColor = (type) => {
    if (type === 'up') return 'text-green-600';
    if (type === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Análise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Análise Comparativa</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Comparação entre Última Semana e Últimos 15 Dias
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Última Semana */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">Última Semana</span>
            </div>
            <div className="space-y-2 text-sm">
              <p>📊 Dias trabalhados: {lastWeekMetrics.diasTrabalhados} / {lastWeekMetrics.diasEsperados}</p>
              <p>🔍 Inspeções: {lastWeekMetrics.totalInspecoes}</p>
              <p>⚠️ Desvios: {lastWeekMetrics.totalDesvios}</p>
              <p>📈 Taxa de desvios: {lastWeekMetrics.taxaDesvios.toFixed(1)}%</p>
              <p>💬 DDS realizados: {lastWeekMetrics.totalDDS}</p>
              <p>🎓 Treinamentos: {lastWeekMetrics.totalTreinamentos}</p>
            </div>
          </div>
          
          {/* Últimos 15 Dias */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">Últimos 15 Dias</span>
            </div>
            <div className="space-y-2 text-sm">
              <p>📊 Dias trabalhados: {last15DaysMetrics.diasTrabalhados} / {last15DaysMetrics.diasEsperados}</p>
              <p>🔍 Inspeções: {last15DaysMetrics.totalInspecoes}</p>
              <p>⚠️ Desvios: {last15DaysMetrics.totalDesvios}</p>
              <p>📈 Taxa de desvios: {last15DaysMetrics.taxaDesvios.toFixed(1)}%</p>
              <p>💬 DDS realizados: {last15DaysMetrics.totalDDS}</p>
              <p>🎓 Treinamentos: {last15DaysMetrics.totalTreinamentos}</p>
            </div>
          </div>
        </div>
        
        {/* Variações */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-semibold mb-3">Variação (15 dias vs Semana)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-xs">Inspeções</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.inspecoes.type)}
                <span className={`text-sm font-semibold ${getTrendColor(variations.inspecoes.type)}`}>
                  {variations.inspecoes.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-xs">Desvios</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.desvios.type)}
                <span className={`text-sm font-semibold ${getTrendColor(variations.desvios.type)}`}>
                  {variations.desvios.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-xs">Taxa Desvios</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.taxaDesvios.type)}
                <span className={`text-sm font-semibold ${getTrendColor(variations.taxaDesvios.type)}`}>
                  {variations.taxaDesvios.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-xs">DDS</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.dds.type)}
                <span className={`text-sm font-semibold ${getTrendColor(variations.dds.type)}`}>
                  {variations.dds.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-xs">Treinamentos</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.treinamentos.type)}
                <span className={`text-sm font-semibold ${getTrendColor(variations.treinamentos.type)}`}>
                  {variations.treinamentos.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-xs">Orientações</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.orientacoes.type)}
                <span className={`text-sm font-semibold ${getTrendColor(variations.orientacoes.type)}`}>
                  {variations.orientacoes.value}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alertas de Dias não trabalhados */}
        {(lastWeekMissing.hasMissing || last15DaysMissing.hasMissing) && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-700 dark:text-yellow-500">
                {lastWeekMissing.hasMissing && (
                  <p>⚠️ Última semana: {lastWeekMissing.missingDays} dia(s) não trabalhado(s)</p>
                )}
                {last15DaysMissing.hasMissing && (
                  <p>⚠️ Últimos 15 dias: {last15DaysMissing.missingDays} dia(s) não trabalhado(s)</p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Performance por TST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Performance por TST</h3>
        
        {['Mônica', 'Vannic'].map(tst => {
          const tstReports = reports.filter(r => r.tstResponsavel === tst);
          const tstLastWeek = tstReports.filter(r => {
            const date = parseISO(r.createdAt);
            return isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd });
          });
          const tstLast15Days = tstReports.filter(r => {
            const date = parseISO(r.createdAt);
            return date >= last15DaysStart;
          });
          
          const weekInspecoes = tstLastWeek.reduce((sum, r) => sum + (r.indicadores?.quantidadeInspecoes || 0), 0);
          const weekDesvios = tstLastWeek.reduce((sum, r) => sum + (r.indicadores?.quantidadeDesvios || 0), 0);
          const fifteenInspecoes = tstLast15Days.reduce((sum, r) => sum + (r.indicadores?.quantidadeInspecoes || 0), 0);
          const fifteenDesvios = tstLast15Days.reduce((sum, r) => sum + (r.indicadores?.quantidadeDesvios || 0), 0);
          
          const weekTaxa = weekInspecoes > 0 ? (weekDesvios / weekInspecoes) * 100 : 0;
          const fifteenTaxa = fifteenInspecoes > 0 ? (fifteenDesvios / fifteenInspecoes) * 100 : 0;
          const taxaVariation = weekTaxa > 0 ? (((fifteenTaxa - weekTaxa) / weekTaxa) * 100) : 0;
          
          return (
            <div key={tst} className="mb-4 last:mb-0 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">{tst}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Taxa de Desvios</span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-medium">{weekTaxa.toFixed(1)}%</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm font-medium">{fifteenTaxa.toFixed(1)}%</span>
                  {taxaVariation !== 0 && (
                    <div className={`flex items-center gap-0.5 ${taxaVariation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {taxaVariation > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-xs">{Math.abs(taxaVariation).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-500">Última Semana</p>
                  <p>Inspeções: {weekInspecoes}</p>
                  <p>Desvios: {weekDesvios}</p>
                  <p>Relatórios: {tstLastWeek.length}</p>
                </div>
                <div>
                  <p className="text-gray-500">Últimos 15 Dias</p>
                  <p>Inspeções: {fifteenInspecoes}</p>
                  <p>Desvios: {fifteenDesvios}</p>
                  <p>Relatórios: {tstLast15Days.length}</p>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ComparativeAnalysis;