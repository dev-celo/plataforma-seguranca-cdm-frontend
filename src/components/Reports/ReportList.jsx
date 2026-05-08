import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getReports } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import {
  FileText,
  Eye,
  Search,
  Calendar,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  HardHat,
  Filter,
  X
} from 'lucide-react';

const ReportList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTST, setFilterTST] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await getReports();
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.local?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.tstResponsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.ddsRealizado?.tema?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTST = filterTST === 'all' || report.tstResponsavel === filterTST;
    return matchesSearch && matchesTST;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCondicaoColor = (condicao) => {
    switch(condicao) {
      case 'Segura': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'Atenção': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Crítica': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getCondicaoIcon = (condicao) => {
    switch(condicao) {
      case 'Segura': return <CheckCircle className="w-4 h-4" />;
      case 'Atenção': return <AlertCircle className="w-4 h-4" />;
      case 'Crítica': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-cdm-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-3 sm:px-4 md:px-6 pb-8 space-y-4 md:space-y-6"
    >
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sticky top-0 z-20 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0 py-3 md:py-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">Relatórios de Segurança</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Total de {filteredReports.length} relatório(s) encontrado(s)
          </p>
        </div>
        <button
          onClick={() => navigate('/reports/new')}
          className="btn-gradient flex items-center justify-center gap-2 py-3 px-4 sm:py-2 sm:px-4 w-full sm:w-auto"
        >
          <FileText className="w-4 h-4" />
          Novo Relatório
        </button>
      </div>

      {/* Filtros Responsivos */}
      <div className="glass-card rounded-xl md:rounded-2xl p-3 md:p-4">
        {/* Desktop Filtros */}
        <div className="hidden md:flex flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por local, TST ou tema do DDS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern pl-10 py-2.5"
            />
          </div>
          <select
            value={filterTST}
            onChange={(e) => setFilterTST(e.target.value)}
            className="input-modern w-40 py-2.5"
          >
            <option value="all">Todos TSTs</option>
            <option value="Sued Brandão">Sued Brandão</option>
            <option value="Flavia Cardoso">Flavia Cardoso</option>
          </select>
        </div>

        {/* Mobile Filtros */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern pl-10 py-3 text-sm"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <Filter className="w-4 h-4" />
            {filterTST !== 'all' ? `Filtrando: ${filterTST}` : 'Todos os TSTs'}
            {showMobileFilters ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {showMobileFilters && (
            <div className="mt-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm font-medium mb-2">Filtrar por TST</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setFilterTST('all'); setShowMobileFilters(false); }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm ${filterTST === 'all' ? 'bg-cdm-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => { setFilterTST('Sued Brandão'); setShowMobileFilters(false); }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm ${filterTST === 'Sued Brandão' ? 'bg-cdm-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  Sued Brandão
                </button>
                <button
                  onClick={() => { setFilterTST('Flavia Cardoso'); setShowMobileFilters(false); }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm ${filterTST === 'Flavia Cardoso' ? 'bg-cdm-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  Flavia Cardoso
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Relatórios Responsiva */}
      <div className="space-y-3 md:space-y-4">
        {paginatedReports.length === 0 ? (
          <div className="glass-card rounded-xl md:rounded-2xl p-8 md:p-12 text-center">
            <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">Nenhum relatório encontrado</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Comece criando um novo relatório de segurança
            </p>
            <button
              onClick={() => navigate('/reports/new')}
              className="btn-gradient"
            >
              Criar primeiro relatório
            </button>
          </div>
        ) : (
          paginatedReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl md:rounded-2xl p-4 md:p-5 hover:shadow-xl transition-all cursor-pointer active:scale-98 md:active:scale-100"
              onClick={() => handleViewDetails(report)}
            >
              <div className="flex flex-col gap-3">
                {/* Cabeçalho do Card */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getCondicaoColor(report.condicaoGeralArea)}`}>
                    {getCondicaoIcon(report.condicaoGeralArea)}
                    {report.condicaoGeralArea}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(report.data), "dd/MM/yyyy")}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.turno}
                  </span>
                </div>

                {/* Local */}
                <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="line-clamp-2">{report.local}</span>
                </h3>

                {/* Informações */}
                <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    TST: {report.tstResponsavel}
                  </span>
                  {report.ddsRealizado?.tema && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      DDS: {report.ddsRealizado.tema}
                    </span>
                  )}
                </div>

                {/* Métricas */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="flex items-center gap-1 text-xs">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    Desvios: {report.desviosIdentificados?.filter(d => d.descricao?.trim()).length || 0}
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <HardHat className="w-3 h-3 text-cdm-500" />
                    EPI: {report.desviosIdentificados?.filter(d => d.relacionadoEPI && d.descricao?.trim()).length || 0}
                  </span>
                </div>

                {/* Botão Detalhes */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(report);
                  }}
                  className="flex items-center justify-center gap-2 mt-2 py-2 px-4 rounded-lg bg-cdm-50 dark:bg-cdm-900/20 text-cdm-600 hover:bg-cdm-100 dark:hover:bg-cdm-900/40 transition-colors w-full md:w-auto md:absolute md:top-4 md:right-4 md:w-auto"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalhes
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Paginação Responsiva */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 md:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-w-[40px]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? 'bg-cdm-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 md:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-w-[40px]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modal de Detalhes Responsivo */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4" onClick={closeModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 md:p-4 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold gradient-text">Detalhes do Relatório</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Data</p>
                  <p className="text-sm md:text-base font-medium">{format(parseISO(selectedReport.data), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Turno</p>
                  <p className="text-sm md:text-base font-medium">{selectedReport.turno}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs md:text-sm text-gray-500">Local</p>
                  <p className="text-sm md:text-base font-medium">{selectedReport.local}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">TST Responsável</p>
                  <p className="text-sm md:text-base font-medium">{selectedReport.tstResponsavel}</p>
                </div>
              </div>
              
              {/* Restante do modal com texto responsivo */}
              {selectedReport.ddsRealizado?.tema && (
                <div>
                  <p className="text-xs md:text-sm text-gray-500">DDS Realizado</p>
                  <p className="text-sm md:text-base font-medium">{selectedReport.ddsRealizado.tema}</p>
                </div>
              )}
              
              <div>
                <p className="text-xs md:text-sm text-gray-500">Atividades Acompanhadas</p>
                <ul className="list-disc list-inside text-sm md:text-base">
                  {selectedReport.atividadesAcompanhadas?.filter(a => a.trim()).map((atividade, i) => (
                    <li key={i} className="break-words">{atividade}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-xs md:text-sm text-gray-500">Desvios Identificados</p>
                <ul className="space-y-2 text-sm md:text-base">
                  {selectedReport.desviosIdentificados?.filter(d => d.descricao?.trim()).map((desvio, i) => (
                    <li key={i} className="flex flex-wrap items-start gap-2">
                      <span className="flex-1 break-words">{desvio.descricao}</span>
                      {desvio.relacionadoEPI && (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded shrink-0">
                          <HardHat className="w-3 h-3" />
                          EPI
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Restante do conteúdo do modal... */}
              <div>
                <p className="text-xs md:text-sm text-gray-500">Condição Geral da Área</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${getCondicaoColor(selectedReport.condicaoGeralArea)}`}>
                  {getCondicaoIcon(selectedReport.condicaoGeralArea)}
                  {selectedReport.condicaoGeralArea}
                </span>
              </div>

              {selectedReport.observacoesGerais && (
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Observações</p>
                  <p className="text-sm md:text-base">{selectedReport.observacoesGerais}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ReportList;