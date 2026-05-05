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
  HardHat
} from 'lucide-react';

const ReportList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTST, setFilterTST] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
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
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Relatórios de Segurança</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total de {filteredReports.length} relatório(s) encontrado(s)
          </p>
        </div>
        <button
          onClick={() => navigate('/reports/new')}
          className="btn-gradient flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Novo Relatório
        </button>
      </div>

      {/* Filtros */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por local, TST ou tema do DDS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterTST}
              onChange={(e) => setFilterTST(e.target.value)}
              className="input-modern w-40"
            >
              <option value="all">Todos TSTs</option>
              <option value="Mônica">Mônica</option>
              <option value="Vannic">Vannic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Relatórios */}
      <div className="space-y-4">
        {paginatedReports.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum relatório encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
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
              className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => handleViewDetails(report)}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getCondicaoColor(report.condicaoGeralArea)}`}>
                      {getCondicaoIcon(report.condicaoGeralArea)}
                      {report.condicaoGeralArea}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(parseISO(report.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {report.turno}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {report.local}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Desvios: {report.desviosIdentificados?.filter(d => d.descricao?.trim()).length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <HardHat className="w-3 h-3" />
                      Desvios EPI: {report.desviosIdentificados?.filter(d => d.relacionadoEPI && d.descricao?.trim()).length || 0}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(report);
                    }}
                    className="p-2 rounded-lg bg-cdm-100 dark:bg-cdm-900/20 text-cdm-600 hover:bg-cdm-200 dark:hover:bg-cdm-900/40 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 py-2 rounded-lg bg-cdm-500 text-white">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold gradient-text">Detalhes do Relatório</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-medium">{format(parseISO(selectedReport.data), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Turno</p>
                  <p className="font-medium">{selectedReport.turno}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Local</p>
                  <p className="font-medium">{selectedReport.local}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">TST Responsável</p>
                  <p className="font-medium">{selectedReport.tstResponsavel}</p>
                </div>
              </div>
              
              {selectedReport.ddsRealizado?.tema && (
                <div>
                  <p className="text-sm text-gray-500">DDS Realizado</p>
                  <p className="font-medium">{selectedReport.ddsRealizado.tema}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Atividades Acompanhadas</p>
                <ul className="list-disc list-inside">
                  {selectedReport.atividadesAcompanhadas?.filter(a => a.trim()).map((atividade, i) => (
                    <li key={i}>{atividade}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Desvios Identificados</p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedReport.desviosIdentificados?.filter(d => d.descricao?.trim()).map((desvio, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>{desvio.descricao}</span>
                      {desvio.relacionadoEPI && (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded">
                          <HardHat className="w-3 h-3" />
                          Relacionado a EPI
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Ações Corretivas</p>
                <ul className="list-disc list-inside">
                  {selectedReport.acoesCorretivas?.filter(a => a.trim()).map((acao, i) => (
                    <li key={i}>{acao}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm text-gray-500">Ações Preventivas</p>
                <ul className="list-disc list-inside">
                  {selectedReport.acoesPreventivas?.filter(a => a.trim()).map((acao, i) => (
                    <li key={i}>{acao}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Orientações em Campo</p>
                <ul className="list-disc list-inside">
                  {selectedReport.orientacoesCampo?.filter(o => o.trim()).map((orientacao, i) => (
                    <li key={i}>{orientacao}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm text-gray-500">Ferramentas de Segurança</p>
                <div className="flex gap-3 mt-1">
                  {selectedReport.ferramentasSeguranca?.pare && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm">PARE</span>}
                  {selectedReport.ferramentasSeguranca?.rqa && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm">RQA</span>}
                  {selectedReport.ferramentasSeguranca?.vfl && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm">VFL</span>}
                  {!selectedReport.ferramentasSeguranca?.pare && !selectedReport.ferramentasSeguranca?.rqa && !selectedReport.ferramentasSeguranca?.vfl && (
                    <span className="text-gray-500 text-sm">Nenhuma ferramenta registrada</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Classificação dos Desvios</p>
                <div className="flex gap-3 mt-1">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg text-sm">Leves: {selectedReport.classificacaoDesvios?.desvioLeve || 0}</span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-sm">Moderados: {selectedReport.classificacaoDesvios?.desvioModerado || 0}</span>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm">Graves: {selectedReport.classificacaoDesvios?.desvioGrave || 0}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Condição Geral da Área</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${getCondicaoColor(selectedReport.condicaoGeralArea)}`}>
                  {getCondicaoIcon(selectedReport.condicaoGeralArea)}
                  {selectedReport.condicaoGeralArea}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Indicadores</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">Inspeções: {selectedReport.indicadores?.quantidadeInspecoes || 0}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">Desvios: {selectedReport.indicadores?.quantidadeDesvios || 0}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">Orientações: {selectedReport.indicadores?.quantidadeOrientacoes || 0}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">Desvios EPI: {selectedReport.indicadores?.desviosEPI || 0}</span>
                </div>
              </div>
              
              {selectedReport.observacoesGerais && (
                <div>
                  <p className="text-sm text-gray-500">Observações</p>
                  <p className="font-medium text-sm">{selectedReport.observacoesGerais}</p>
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