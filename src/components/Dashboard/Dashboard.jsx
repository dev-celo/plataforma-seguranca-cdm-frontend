import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getReports } from "../../services/api";
import KPICards from "./KPICards";
import Charts from "./Charts";
import ComparativeAnalysis from "./ComparativeAnalysis";
import {
  startOfWeek,
  endOfWeek,
  subDays,
  isWithinInterval,
  parseISO,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { getMissingDaysInfo } from "../../utils/dateUtils";
import {
  Calendar,
  TrendingUp,
  AlertCircle,
  HardHat,
  Loader2,
  Building2,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");
  const [selectedTST, setSelectedTST] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await getReports();
      if (response.success && Array.isArray(response.data)) {
        setReports(response.data);
      } else {
        console.error("Formato de resposta inesperado:", response);
        toast.error("Erro no formato dos dados recebidos do servidor.");
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  const getPeriodData = () => {
    const now = new Date();
    let startDate, endDate, label;

    if (period === "week") {
      startDate = startOfWeek(now, { locale: ptBR });
      endDate = endOfWeek(now, { locale: ptBR });
      label = "Esta Semana";
    } else if (period === "15days") {
      startDate = subDays(now, 15);
      endDate = now;
      label = "Últimos 15 Dias";
    } else {
      startDate = subDays(now, 30);
      endDate = now;
      label = "Último Mês";
    }

    let filtered = reports.filter((r) => {
      const date = parseISO(r.data);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });

    if (selectedTST !== "all") {
      filtered = filtered.filter((r) => r.tstResponsavel === selectedTST);
    }

    const missingInfo = getMissingDaysInfo(filtered, startDate, endDate);

    return {
      reports: filtered,
      missingInfo,
      startDate,
      endDate,
      label,
      totalReports: filtered.length,
    };
  };

  const getKPIData = () => {
    const data = getPeriodData();
    const reports_array = data.reports;

    const totalInspecoes = reports_array.reduce(
      (sum, r) => sum + (r.indicadores?.quantidadeInspecoes || 0),
      0
    );

    const totalDesvios = reports_array.reduce(
      (sum, r) => sum + (r.indicadores?.quantidadeDesvios || 0),
      0
    );

    const totalDDS = reports_array.filter((r) =>
      r.ddsRealizado?.tema?.trim()
    ).length;

    const totalTreinamentos = reports_array.reduce(
      (sum, r) => sum + (r.treinamentosCampanhas?.length || 0),
      0
    );

    const totalOrientacoes = reports_array.reduce(
      (sum, r) => sum + (r.indicadores?.quantidadeOrientacoes || 0),
      0
    );

    const desvioPercent =
      totalInspecoes > 0 ? (totalDesvios / totalInspecoes) * 100 : 0;

    let epiChecks = 0;
    let epiConform = 0;
    reports_array.forEach((r) => {
      if (r.inspecoes && typeof r.inspecoes.epi !== "undefined") {
        epiChecks++;
        if (r.inspecoes.epi === true) {
          epiConform++;
        }
      }
    });
    const epiPercent = epiChecks > 0 ? (epiConform / epiChecks) * 100 : 100;

    let desviosLeves = 0,
      desviosModerados = 0,
      desviosGraves = 0;
    reports_array.forEach((r) => {
      desviosLeves += r.classificacaoDesvios?.desvioLeve || 0;
      desviosModerados += r.classificacaoDesvios?.desvioModerado || 0;
      desviosGraves += r.classificacaoDesvios?.desvioGrave || 0;
    });

    const condicoes = {
      segura: reports_array.filter((r) => r.condicaoGeralArea === "Segura")
        .length,
      atencao: reports_array.filter((r) => r.condicaoGeralArea === "Atenção")
        .length,
      critica: reports_array.filter((r) => r.condicaoGeralArea === "Crítica")
        .length,
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
      totalReports: reports_array.length,
    };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-cdm-500 mx-auto mb-4" />
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  const periodData = getPeriodData();
  const kpiData = getKPIData();

  // Nomes para exibição dos filtros
  const getPeriodLabel = () => {
    switch(period) {
      case 'week': return 'Esta Semana';
      case '15days': return 'Últimos 15 Dias';
      default: return 'Último Mês';
    }
  };

  const getTSTLabel = () => {
    if (selectedTST === 'all') return 'Todos TSTs';
    return selectedTST;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-3 sm:px-4 md:px-6 pb-8 space-y-4 md:space-y-6"
    >
      {/* Header Responsivo */}
      <div className="flex flex-col gap-3 sticky top-0 z-20 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0 py-3 md:py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <HardHat className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-cdm-600 dark:text-cdm-400">
              Dashboard de Segurança
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
              CDM Construtora - Gestão de Segurança do Trabalho
            </p>
          </div>
        </div>

        {/* Desktop Filtros */}
        <div className="hidden md:flex flex-row justify-end gap-3">
          <select
            value={selectedTST}
            onChange={(e) => setSelectedTST(e.target.value)}
            className="input-modern py-2 w-40"
          >
            <option value="all">Todos TSTs</option>
            <option value="Sued Brandão">Sued Brandão</option>
            <option value="Flavia Cardoso">Flavia Cardoso</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-modern py-2 w-44"
          >
            <option value="week">📅 Esta Semana</option>
            <option value="15days">📊 Últimos 15 Dias</option>
            <option value="month">📈 Último Mês</option>
          </select>
        </div>

        {/* Mobile Filtros */}
        <div className="flex flex-col gap-2 md:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-between gap-2 py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <span className="text-sm font-medium">
              {getPeriodLabel()} • {getTSTLabel()}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>

          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3"
            >
              <div>
                <p className="text-xs text-gray-500 mb-2">Período</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'week', label: 'Esta Semana', icon: '📅' },
                    { value: '15days', label: '15 Dias', icon: '📊' },
                    { value: 'month', label: 'Último Mês', icon: '📈' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setPeriod(opt.value); setShowMobileFilters(false); }}
                      className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                        period === opt.value
                          ? 'bg-cdm-500 text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">TST Responsável</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'Sued Brandão', label: 'Sued Brandão' },
                    { value: 'Flavia Cardoso', label: 'Flavia Cardoso' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSelectedTST(opt.value); setShowMobileFilters(false); }}
                      className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                        selectedTST === opt.value
                          ? 'bg-cdm-500 text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Alertas de Dias não trabalhados */}
      {periodData.missingInfo.hasMissing && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-xl p-3 md:p-4"
        >
          <div className="flex items-start gap-2 md:gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
            <div className="text-xs md:text-sm">
              <p className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
                Atenção: Dias não trabalhados identificados
              </p>
              <p className="text-yellow-700 dark:text-yellow-500 text-xs md:text-sm">
                No período de {format(periodData.startDate, "dd/MM/yyyy")} a{" "}
                {format(periodData.endDate, "dd/MM/yyyy")}, tivemos{" "}
                {periodData.missingInfo.missingDays} dia(s) não trabalhado(s)
                (feriados ou finais de semana). Total de{" "}
                {periodData.missingInfo.totalWorkingDays} dias úteis.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPIs Cards - Já responsivo por padrão */}
      <KPICards kpiData={kpiData} periodLabel={periodData.label} />

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <Charts reports={periodData.reports} />
        </div>
        <div className="order-3 lg:order-2">
          <ComparativeAnalysis reports={periodData.reports} />
        </div>
      </div>

      {/* Resumo de Desvios por Gravidade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6"
      >
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cdm-500" />
          Classificação dos Desvios por Gravidade
        </h3>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2 md:p-4 text-center">
            <p className="text-xl md:text-2xl font-bold text-green-600">
              {kpiData.desviosLeves}
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Desvios Leves
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-2 md:p-4 text-center">
            <p className="text-xl md:text-2xl font-bold text-yellow-600">
              {kpiData.desviosModerados}
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Desvios Moderados
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-2 md:p-4 text-center">
            <p className="text-xl md:text-2xl font-bold text-red-600">
              {kpiData.desviosGraves}
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Desvios Graves
            </p>
          </div>
        </div>
      </motion.div>

      {/* Condição Geral da Área */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6"
      >
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
          <HardHat className="w-5 h-5 text-cdm-500" />
          Condição Geral da Área
        </h3>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="text-center p-2 md:p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <p className="text-xl md:text-2xl font-bold text-green-600">
              {kpiData.condicoes.segura}
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Segura</p>
          </div>
          <div className="text-center p-2 md:p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
            <p className="text-xl md:text-2xl font-bold text-yellow-600">
              {kpiData.condicoes.atencao}
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Atenção</p>
          </div>
          <div className="text-center p-2 md:p-4 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <p className="text-xl md:text-2xl font-bold text-red-600">
              {kpiData.condicoes.critica}
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Crítica</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;