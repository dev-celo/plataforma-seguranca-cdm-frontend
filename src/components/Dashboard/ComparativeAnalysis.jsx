import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { subDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getMissingDaysInfo } from '../../utils/dateUtils';

// ============================
// PALETA PREMIUM (mesma do Charts)
// ============================

const COLORS = {
  inspecoes: '#2563EB',
  desvios: '#DC2626',
  orientacoes: '#059669',
  segura: '#10B981',
  atencao: '#F59E0B',
  critica: '#EF4444',
};

// ============================
// GLASS CARD
// ============================

const GlassCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -3, scale: 1.005 }}
    className={`
      rounded-[30px]
      border border-white/50
      bg-white/70 dark:bg-gray-800/70
      backdrop-blur-xl
      shadow-[0_10px_30px_rgba(15,23,42,0.08)]
      p-6 md:p-7
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// ============================
// TITULO
// ============================

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <h3 className="text-lg md:text-[22px] font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">
      {title}
    </h3>
    {subtitle && (
      <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 mt-1">
        {subtitle}
      </p>
    )}
    <div className="w-12 md:w-16 h-0.5 md:h-1 rounded-full bg-slate-900/10 dark:bg-white/10 mt-3 md:mt-4" />
  </div>
);

const ComparativeAnalysis = ({ reports }) => {
  const now = new Date();
  const lastWeekStart = startOfWeek(now, { locale: ptBR });
  const lastWeekEnd = endOfWeek(now, { locale: ptBR });
  const last15DaysStart = subDays(now, 15);
  
  const lastWeekReports = reports.filter(r => {
    const date = parseISO(r.data);
    return isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd });
  });
  
  const last15DaysReports = reports.filter(r => {
    const date = parseISO(r.data);
    return date >= last15DaysStart;
  });
  
  const lastWeekMissing = getMissingDaysInfo(lastWeekReports, lastWeekStart, lastWeekEnd);
  const last15DaysMissing = getMissingDaysInfo(last15DaysReports, last15DaysStart, now);
  
  // Métricas da última semana
  const lastWeekMetrics = {
    totalInspecoes: lastWeekReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeInspecoes || 0), 0),
    totalDesvios: lastWeekReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeDesvios || 0), 0),
    totalDDS: lastWeekReports.filter(r => r.ddsRealizado?.tema?.trim()).length,
    totalOrientacoes: lastWeekReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeOrientacoes || 0), 0),
    diasTrabalhados: lastWeekMissing.reportedDays,
    diasEsperados: lastWeekMissing.totalWorkingDays
  };
  lastWeekMetrics.taxaDesvios = lastWeekMetrics.totalInspecoes > 0 
    ? (lastWeekMetrics.totalDesvios / lastWeekMetrics.totalInspecoes) * 100 : 0;
  
  // Métricas dos últimos 15 dias
  const last15DaysMetrics = {
    totalInspecoes: last15DaysReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeInspecoes || 0), 0),
    totalDesvios: last15DaysReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeDesvios || 0), 0),
    totalDDS: last15DaysReports.filter(r => r.ddsRealizado?.tema?.trim()).length,
    totalOrientacoes: last15DaysReports.reduce((sum, r) => sum + (r.indicadores?.quantidadeOrientacoes || 0), 0),
    diasTrabalhados: last15DaysMissing.reportedDays,
    diasEsperados: last15DaysMissing.totalWorkingDays
  };
  last15DaysMetrics.taxaDesvios = last15DaysMetrics.totalInspecoes > 0 
    ? (last15DaysMetrics.totalDesvios / last15DaysMetrics.totalInspecoes) * 100 : 0;
  
  // Variações
  const calculateVariation = (current, previous) => {
    if (previous === 0) return { value: current > 0 ? 100 : 0, type: current > 0 ? 'up' : 'neutral' };
    const variation = ((current - previous) / previous) * 100;
    return { value: Math.abs(variation).toFixed(1), type: variation > 0 ? 'up' : variation < 0 ? 'down' : 'neutral' };
  };
  
  const variations = {
    inspecoes: calculateVariation(last15DaysMetrics.totalInspecoes, lastWeekMetrics.totalInspecoes),
    desvios: calculateVariation(last15DaysMetrics.totalDesvios, lastWeekMetrics.totalDesvios),
    taxaDesvios: calculateVariation(last15DaysMetrics.taxaDesvios, lastWeekMetrics.taxaDesvios),
    dds: calculateVariation(last15DaysMetrics.totalDDS, lastWeekMetrics.totalDDS),
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

  // 🔥 LISTA DINÂMICA DE TSTS (busca automaticamente do banco)
  const uniqueTSTs = [...new Set(reports.map(r => r.tstResponsavel).filter(Boolean))];

  return (
    <div className="space-y-6 md:space-y-7">
      {/* Análise Comparativa */}
      <GlassCard>
        <SectionTitle 
          title="Análise Comparativa" 
          subtitle="Comparação entre Última Semana e Últimos 15 Dias"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6 md:mb-8">
          {/* Última Semana */}
          <div className="bg-slate-50/80 dark:bg-gray-800/50 rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-sm md:text-base">Última Semana</span>
            </div>
            <div className="space-y-2 text-xs md:text-sm">
              <p>📊 Dias trabalhados: {lastWeekMetrics.diasTrabalhados} / {lastWeekMetrics.diasEsperados}</p>
              <p>🔍 Inspeções: {lastWeekMetrics.totalInspecoes}</p>
              <p>⚠️ Desvios: {lastWeekMetrics.totalDesvios}</p>
              <p>📈 Taxa de desvios: {lastWeekMetrics.taxaDesvios.toFixed(1)}%</p>
              <p>💬 DDS realizados: {lastWeekMetrics.totalDDS}</p>
              <p>📝 Orientações: {lastWeekMetrics.totalOrientacoes}</p>
            </div>
          </div>
          
          {/* Últimos 15 Dias */}
          <div className="bg-slate-50/80 dark:bg-gray-800/50 rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-sm md:text-base">Últimos 15 Dias</span>
            </div>
            <div className="space-y-2 text-xs md:text-sm">
              <p>📊 Dias trabalhados: {last15DaysMetrics.diasTrabalhados} / {last15DaysMetrics.diasEsperados}</p>
              <p>🔍 Inspeções: {last15DaysMetrics.totalInspecoes}</p>
              <p>⚠️ Desvios: {last15DaysMetrics.totalDesvios}</p>
              <p>📈 Taxa de desvios: {last15DaysMetrics.taxaDesvios.toFixed(1)}%</p>
              <p>💬 DDS realizados: {last15DaysMetrics.totalDDS}</p>
              <p>📝 Orientações: {last15DaysMetrics.totalOrientacoes}</p>
            </div>
          </div>
        </div>
        
        {/* Variações */}
        <div className="border-t border-slate-200 dark:border-gray-700 pt-5 md:pt-6">
          <h4 className="text-sm font-semibold mb-3">Variação (15 dias vs Semana)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            <div className="flex items-center justify-between p-2 md:p-3 bg-slate-50/80 dark:bg-gray-800/50 rounded-xl">
              <span className="text-xs">Inspeções</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.inspecoes.type)}
                <span className={`text-xs md:text-sm font-semibold ${getTrendColor(variations.inspecoes.type)}`}>
                  {variations.inspecoes.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-slate-50/80 dark:bg-gray-800/50 rounded-xl">
              <span className="text-xs">Desvios</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.desvios.type)}
                <span className={`text-xs md:text-sm font-semibold ${getTrendColor(variations.desvios.type)}`}>
                  {variations.desvios.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-slate-50/80 dark:bg-gray-800/50 rounded-xl">
              <span className="text-xs">Taxa Desvios</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.taxaDesvios.type)}
                <span className={`text-xs md:text-sm font-semibold ${getTrendColor(variations.taxaDesvios.type)}`}>
                  {variations.taxaDesvios.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-slate-50/80 dark:bg-gray-800/50 rounded-xl">
              <span className="text-xs">DDS</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.dds.type)}
                <span className={`text-xs md:text-sm font-semibold ${getTrendColor(variations.dds.type)}`}>
                  {variations.dds.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-slate-50/80 dark:bg-gray-800/50 rounded-xl">
              <span className="text-xs">Orientações</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(variations.orientacoes.type)}
                <span className={`text-xs md:text-sm font-semibold ${getTrendColor(variations.orientacoes.type)}`}>
                  {variations.orientacoes.value}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alertas */}
        {(lastWeekMissing.hasMissing || last15DaysMissing.hasMissing) && (
          <div className="mt-5 md:mt-6 p-3 md:p-4 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-2xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-700 dark:text-yellow-500">
                {lastWeekMissing.hasMissing && <p>⚠️ Última semana: {lastWeekMissing.missingDays} dia(s) não trabalhado(s)</p>}
                {last15DaysMissing.hasMissing && <p>⚠️ Últimos 15 dias: {last15DaysMissing.missingDays} dia(s) não trabalhado(s)</p>}
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Performance por TST - Comparativa DINÂMICA */}
      <GlassCard>
        <SectionTitle 
          title="Performance por TST" 
          subtitle="Comparativo de eficiência entre os TSTs"
        />
        
        {uniqueTSTs.length > 0 ? (
          uniqueTSTs.map(tst => {
            const tstReports = reports.filter(r => r.tstResponsavel === tst);
            const tstLastWeek = tstReports.filter(r => {
              const date = parseISO(r.data);
              return isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd });
            });
            const tstLast15Days = tstReports.filter(r => {
              const date = parseISO(r.data);
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
              <div key={tst} className="mb-4 last:mb-0 p-4 md:p-5 bg-slate-50/80 dark:bg-gray-800/50 rounded-2xl">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <span className="font-semibold text-base md:text-lg">{tst}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500">Taxa de Desvios</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-sm font-medium">{weekTaxa.toFixed(1)}%</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-sm font-medium">{fifteenTaxa.toFixed(1)}%</span>
                    {taxaVariation !== 0 && (
                      <div className={`flex items-center gap-0.5 ${taxaVariation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {taxaVariation > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="text-xs">{Math.abs(taxaVariation).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Última Semana</p>
                    <p>Inspeções: {weekInspecoes}</p>
                    <p>Desvios: {weekDesvios}</p>
                    <p>Relatórios: {tstLastWeek.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Últimos 15 Dias</p>
                    <p>Inspeções: {fifteenInspecoes}</p>
                    <p>Desvios: {fifteenDesvios}</p>
                    <p>Relatórios: {tstLast15Days.length}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-gray-400">
            Nenhum TST encontrado nos relatórios
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default ComparativeAnalysis;