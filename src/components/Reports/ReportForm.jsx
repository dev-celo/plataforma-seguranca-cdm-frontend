import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { createReport, getReportById } from "../../services/api";
import toast from "react-hot-toast";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Shield,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  ClipboardList,
  Activity,
  TrendingUp,
  MessageCircle,
  Wrench,
  Loader2,
  HardHat,
} from "lucide-react";

const ReportForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split("T")[0],
    turno: "Manhã",
    local: "",
    tstResponsavel: "",
    ddsRealizado: { realizado: false, tema: "" },
    atividadesAcompanhadas: [""],
    inspecoes: {
      epi: false,
      cincoS: false,
      equipamentos: false,
      acessoCirculacao: false,
      aptChecklist: false,
    },
    desviosIdentificados: [{ descricao: "", relacionadoEPI: false }],
    classificacaoDesvios: {
      desvioLeve: 0,
      desvioModerado: 0,
      desvioGrave: 0,
    },
    acoesCorretivas: [""],
    acoesPreventivas: [""],
    orientacoesCampo: [""],
    ferramentasSeguranca: {
      pare: false,
      rqa: false,
      vfl: false,
    },
    indicadores: {
      quantidadeInspecoes: 0,
      quantidadeDesvios: 0,
      quantidadeOrientacoes: 0,
      desviosEPI: 0,
    },
    condicaoGeralArea: "Segura",
    observacoesGerais: "",
  });

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const response = await getReportById(id);
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      toast.error("Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleArrayChange = (section, index, value) => {
    const newArray = [...formData[section]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [section]: newArray }));
  };

  const addArrayItem = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], ""],
    }));
  };

  const removeArrayItem = (section, index) => {
    if (formData[section].length > 1) {
      const newArray = formData[section].filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, [section]: newArray }));
    }
  };

  // Funções específicas para desvios (objeto)
  const handleDesvioChange = (index, field, value) => {
    const newDesvios = [...formData.desviosIdentificados];
    newDesvios[index] = { ...newDesvios[index], [field]: value };
    setFormData((prev) => ({ ...prev, desviosIdentificados: newDesvios }));
  };

  const addDesvioItem = () => {
    setFormData((prev) => ({
      ...prev,
      desviosIdentificados: [
        ...prev.desviosIdentificados,
        { descricao: "", relacionadoEPI: false },
      ],
    }));
  };

  const removeDesvioItem = (index) => {
    if (formData.desviosIdentificados.length > 1) {
      const newDesvios = formData.desviosIdentificados.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({ ...prev, desviosIdentificados: newDesvios }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!formData.local) {
      toast.error("Por favor, informe o local/frente de trabalho");
      return;
    }
    if (!formData.tstResponsavel) {
      toast.error("Por favor, selecione o TST responsável");
      return;
    }

    // Calcular indicadores automaticamente
    const totalInspecoes = Object.values(formData.inspecoes).filter(
      (v) => v === true,
    ).length;
    const totalDesvios = formData.desviosIdentificados.filter((d) =>
      d.descricao?.trim(),
    ).length;
    const desviosEPI = formData.desviosIdentificados.filter(
      (d) => d.relacionadoEPI && d.descricao?.trim(),
    ).length;
    const totalOrientacoes = formData.orientacoesCampo.filter((o) =>
      o.trim(),
    ).length;

    const submitData = {
      data: formData.data,
      turno: formData.turno,
      local: formData.local,
      tstResponsavel: formData.tstResponsavel,
      ddsRealizado: formData.ddsRealizado,
      atividadesAcompanhadas: formData.atividadesAcompanhadas.filter((a) =>
        a.trim(),
      ),
      inspecoes: formData.inspecoes,
      desviosIdentificados: formData.desviosIdentificados.filter((d) =>
        d.descricao?.trim(),
      ),
      classificacaoDesvios: formData.classificacaoDesvios,
      acoesCorretivas: formData.acoesCorretivas.filter((a) => a.trim()),
      acoesPreventivas: formData.acoesPreventivas.filter((a) => a.trim()),
      orientacoesCampo: formData.orientacoesCampo.filter((o) => o.trim()),
      ferramentasSeguranca: formData.ferramentasSeguranca,
      indicadores: {
        quantidadeInspecoes: totalInspecoes,
        quantidadeDesvios: totalDesvios,
        quantidadeOrientacoes: totalOrientacoes,
        desviosEPI: desviosEPI,
      },
      condicaoGeralArea: formData.condicaoGeralArea,
      observacoesGerais: formData.observacoesGerais,
      createdAt: new Date().toISOString(),
      createdBy: user?.email,
    };

    setSaving(true);
    try {
      await createReport(submitData);
      toast.success("Relatório salvo com sucesso!");
      navigate("/reports/list");
    } catch (error) {
      toast.error("Erro ao salvar relatório");
      console.error(error);
    } finally {
      setSaving(false);
    }
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
      className="max-w-5xl mx-auto pb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/reports/list")}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              {id ? "Editar Relatório" : "Novo Relatório Diário"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Preencha todas as informações do relatório de segurança
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-gradient flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Salvando..." : "Salvar Relatório"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção 1: Informações Básicas */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cdm-500" />
            Informações Básicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => handleChange("data", e.target.value)}
                className="input-modern"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Turno
              </label>
              <select
                value={formData.turno}
                onChange={(e) => handleChange("turno", e.target.value)}
                className="input-modern"
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
                <option value="Integral">Integral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Local / Frente de Trabalho
              </label>
              <input
                type="text"
                value={formData.local}
                onChange={(e) => handleChange("local", e.target.value)}
                className="input-modern"
                placeholder="Ex: Área de Produção - Setor A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                TST Responsável
              </label>
              <select
                value={formData.tstResponsavel}
                onChange={(e) => handleChange("tstResponsavel", e.target.value)}
                className="input-modern"
                required
              >
                <option value="">Selecione...</option>
                <option value="Mônica">Mônica</option>
                <option value="Vannic">Vannic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção 2: DDS Realizado */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            DDS Realizado
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tema do DDS
            </label>
            <input
              type="text"
              value={formData.ddsRealizado.tema}
              onChange={(e) =>
                handleNestedChange("ddsRealizado", "tema", e.target.value)
              }
              className="input-modern"
              placeholder="Ex: Segurança no Trabalho em Altura"
            />
          </div>
        </div>

        {/* Seção 3: Atividades Acompanhadas */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Atividades Acompanhadas
          </h2>
          <AnimatePresence>
            {formData.atividadesAcompanhadas.map((atividade, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-2 mb-3"
              >
                <input
                  type="text"
                  value={atividade}
                  onChange={(e) =>
                    handleArrayChange(
                      "atividadesAcompanhadas",
                      index,
                      e.target.value,
                    )
                  }
                  className="input-modern flex-1"
                  placeholder={`Atividade ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    removeArrayItem("atividadesAcompanhadas", index)
                  }
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => addArrayItem("atividadesAcompanhadas")}
            className="mt-2 text-cdm-500 hover:text-cdm-600 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Adicionar atividade
          </button>
        </div>

        {/* Seção 4: Inspeções Realizadas */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cdm-500" />
            Inspeções Realizadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
              <input
                type="checkbox"
                checked={formData.inspecoes.epi}
                onChange={(e) =>
                  handleNestedChange("inspecoes", "epi", e.target.checked)
                }
                className="w-5 h-5 text-cdm-500 rounded"
              />
              <span>Verificação do uso de EPIs</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
              <input
                type="checkbox"
                checked={formData.inspecoes.cincoS}
                onChange={(e) =>
                  handleNestedChange("inspecoes", "cincoS", e.target.checked)
                }
                className="w-5 h-5 text-cdm-500 rounded"
              />
              <span>Condições de organização e limpeza (5S)</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
              <input
                type="checkbox"
                checked={formData.inspecoes.equipamentos}
                onChange={(e) =>
                  handleNestedChange(
                    "inspecoes",
                    "equipamentos",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-cdm-500 rounded"
              />
              <span>Condições de equipamentos e ferramentas</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
              <input
                type="checkbox"
                checked={formData.inspecoes.acessoCirculacao}
                onChange={(e) =>
                  handleNestedChange(
                    "inspecoes",
                    "acessoCirculacao",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-cdm-500 rounded"
              />
              <span>Condições de acesso e circulação na área</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
              <input
                type="checkbox"
                checked={formData.inspecoes.aptChecklist}
                onChange={(e) =>
                  handleNestedChange(
                    "inspecoes",
                    "aptChecklist",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-cdm-500 rounded"
              />
              <span>Verificação do APT / Checklist de segurança</span>{" "}
              {/* ← TEXTO CORRETO */}
            </label>
          </div>
        </div>

        {/* Seção 5: Desvios Identificados COM CHECKBOX EPI */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Desvios Identificados
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Liste os desvios encontrados e indique se estão relacionados ao uso
            de EPI
          </p>
          <AnimatePresence>
            {formData.desviosIdentificados.map((desvio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-2 mb-3 items-center flex-wrap sm:flex-nowrap"
              >
                <input
                  type="text"
                  value={desvio.descricao || ""}
                  onChange={(e) =>
                    handleDesvioChange(index, "descricao", e.target.value)
                  }
                  className="input-modern flex-1"
                  placeholder={`Desvio ${index + 1}`}
                />
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 cursor-pointer whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                  <input
                    type="checkbox"
                    checked={desvio.relacionadoEPI || false}
                    onChange={(e) =>
                      handleDesvioChange(
                        index,
                        "relacionadoEPI",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 text-cdm-500 rounded"
                  />
                  <HardHat className="w-4 h-4 text-cdm-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    EPI
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => removeDesvioItem(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={addDesvioItem}
            className="mt-2 text-cdm-500 hover:text-cdm-600 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Adicionar desvio
          </button>
        </div>

        {/* Seção 6: Classificação dos Desvios */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Classificação dos Desvios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desvio Leve
              </label>
              <input
                type="number"
                value={formData.classificacaoDesvios.desvioLeve}
                onChange={(e) =>
                  handleNestedChange(
                    "classificacaoDesvios",
                    "desvioLeve",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="input-modern"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desvio Moderado
              </label>
              <input
                type="number"
                value={formData.classificacaoDesvios.desvioModerado}
                onChange={(e) =>
                  handleNestedChange(
                    "classificacaoDesvios",
                    "desvioModerado",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="input-modern"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desvio Grave
              </label>
              <input
                type="number"
                value={formData.classificacaoDesvios.desvioGrave}
                onChange={(e) =>
                  handleNestedChange(
                    "classificacaoDesvios",
                    "desvioGrave",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="input-modern"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Seção 7: Ações Corretivas */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-red-600" />
            Ações Corretivas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Ações para corrigir desvios já identificados
          </p>
          <AnimatePresence>
            {formData.acoesCorretivas.map((acao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-2 mb-3"
              >
                <input
                  type="text"
                  value={acao}
                  onChange={(e) =>
                    handleArrayChange("acoesCorretivas", index, e.target.value)
                  }
                  className="input-modern flex-1"
                  placeholder={`Ação Corretiva ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("acoesCorretivas", index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => addArrayItem("acoesCorretivas")}
            className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Adicionar ação corretiva
          </button>
        </div>

        {/* Seção 8: Ações Preventivas */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Ações Preventivas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Ações para prevenir futuros desvios
          </p>
          <AnimatePresence>
            {formData.acoesPreventivas.map((acao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-2 mb-3"
              >
                <input
                  type="text"
                  value={acao}
                  onChange={(e) =>
                    handleArrayChange("acoesPreventivas", index, e.target.value)
                  }
                  className="input-modern flex-1"
                  placeholder={`Ação Preventiva ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("acoesPreventivas", index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => addArrayItem("acoesPreventivas")}
            className="mt-2 text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Adicionar ação preventiva
          </button>
        </div>

        {/* Seção 9: Orientações em Campo */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Orientações Realizadas em Campo
          </h2>
          <AnimatePresence>
            {formData.orientacoesCampo.map((orientacao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-2 mb-3"
              >
                <input
                  type="text"
                  value={orientacao}
                  onChange={(e) =>
                    handleArrayChange("orientacoesCampo", index, e.target.value)
                  }
                  className="input-modern flex-1"
                  placeholder={`Orientação ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("orientacoesCampo", index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => addArrayItem("orientacoesCampo")}
            className="mt-2 text-cdm-500 hover:text-cdm-600 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Adicionar orientação
          </button>
        </div>

        {/* Seção 10: Ferramentas de Segurança */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Ferramentas de Segurança Utilizadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
              <input
                type="checkbox"
                checked={formData.ferramentasSeguranca.pare}
                onChange={(e) =>
                  handleNestedChange(
                    "ferramentasSeguranca",
                    "pare",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-cdm-500 rounded"
              />
              <span className="font-medium">PARE</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
              <input
                type="checkbox"
                checked={formData.ferramentasSeguranca.rqa}
                onChange={(e) =>
                  handleNestedChange(
                    "ferramentasSeguranca",
                    "rqa",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-cdm-500 rounded"
              />
              <span className="font-medium">RQA</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
              <input
                type="checkbox"
                checked={formData.ferramentasSeguranca.vfl}
                onChange={(e) =>
                  handleNestedChange(
                    "ferramentasSeguranca",
                    "vfl",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-cdm-500 rounded"
              />
              <span className="font-medium">VFL</span>
            </label>
          </div>
        </div>

        {/* Seção 11: Condição Geral da Área */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cdm-500" />
            Condição Geral da Área
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label
              className={`flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${formData.condicaoGeralArea === "Segura" ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500 shadow-md" : "bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
            >
              <input
                type="radio"
                name="condicaoArea"
                value="Segura"
                checked={formData.condicaoGeralArea === "Segura"}
                onChange={(e) =>
                  handleChange("condicaoGeralArea", e.target.value)
                }
                className="hidden"
              />
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Segura</span>
            </label>
            <label
              className={`flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${formData.condicaoGeralArea === "Atenção" ? "bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 shadow-md" : "bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
            >
              <input
                type="radio"
                name="condicaoArea"
                value="Atenção"
                checked={formData.condicaoGeralArea === "Atenção"}
                onChange={(e) =>
                  handleChange("condicaoGeralArea", e.target.value)
                }
                className="hidden"
              />
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">Atenção</span>
            </label>
            <label
              className={`flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${formData.condicaoGeralArea === "Crítica" ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500 shadow-md" : "bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
            >
              <input
                type="radio"
                name="condicaoArea"
                value="Crítica"
                checked={formData.condicaoGeralArea === "Crítica"}
                onChange={(e) =>
                  handleChange("condicaoGeralArea", e.target.value)
                }
                className="hidden"
              />
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium">Crítica</span>
            </label>
          </div>
        </div>

        {/* Seção 12: Observações Gerais */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Observações Gerais
          </h2>
          <textarea
            value={formData.observacoesGerais}
            onChange={(e) => handleChange("observacoesGerais", e.target.value)}
            className="input-modern min-h-[120px]"
            placeholder="Observações adicionais sobre o dia, ocorrências, situações relevantes, etc..."
          />
        </div>

        {/* Resumo dos Indicadores */}
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-cdm-50 via-purple-50 to-cdm-100 dark:from-cdm-900/20 dark:via-purple-900/20 dark:to-cdm-900/20">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Resumo dos Indicadores do Dia
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-cdm-500">
                {
                  Object.values(formData.inspecoes).filter((v) => v === true)
                    .length
                }
              </p>
              <p className="text-sm text-gray-500">Inspeções Realizadas</p>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-orange-600">
                {
                  formData.desviosIdentificados.filter((d) =>
                    d.descricao?.trim(),
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">Desvios Identificados</p>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-red-600">
                {
                  formData.desviosIdentificados.filter(
                    (d) => d.relacionadoEPI && d.descricao?.trim(),
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">
                Desvios Relacionados a EPI
              </p>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-green-600">
                {formData.orientacoesCampo.filter((o) => o.trim()).length}
              </p>
              <p className="text-sm text-gray-500">Orientações Realizadas</p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ReportForm;
