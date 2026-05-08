import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldCheck,
  AlertTriangle,
  ClipboardCheck,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

// ============================
// PALETA PREMIUM APPLE/SAAS
// ============================

const COLORS = {
  background: '#F5F7FA',
  card: 'rgba(255,255,255,0.72)',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  grid: 'rgba(15,23,42,0.06)',
  inspecoes: '#2563EB',
  desvios: '#DC2626',
  orientacoes: '#059669',
  segura: '#10B981',
  atencao: '#F59E0B',
  critica: '#EF4444',
  moderate: '#FB923C',
};

// ============================
// ANIMAÇÕES
// ============================

const cardAnimation = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1],
  },
};

// ============================
// GLASS CARD RESPONSIVO
// ============================

const GlassCard = ({ children, className = '' }) => (
  <motion.div
    {...cardAnimation}
    whileHover={{
      y: -3,
      scale: 1.005,
      transition: { duration: 0.2 }
    }}
    className={`
      rounded-2xl md:rounded-[30px]
      border border-white/50
      bg-white/70 dark:bg-gray-800/70
      backdrop-blur-xl
      shadow-[0_10px_30px_rgba(15,23,42,0.08)]
      p-4 md:p-7
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// ============================
// TITULO RESPONSIVO
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

// ============================
// LEGENDA RESPONSIVA
// ============================

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-1.5 md:gap-2">
    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ background: color }} />
    <span className="text-xs md:text-sm font-medium text-slate-500 dark:text-gray-400">
      {label}
    </span>
  </div>
);

// ============================
// TOOLTIP (mesmo estilo)
// ============================

const tooltipStyle = {
  background: 'rgba(255,255,255,0.92)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: '18px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  backdropFilter: 'blur(12px)',
  color: '#111827',
};

// ============================
// KPI CARD RESPONSIVO
// ============================

const KpiCard = ({ title, value, icon, color }) => (
  <GlassCard>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-gray-400">
          {title}
        </p>
        <h2 className="text-2xl md:text-4xl font-bold tracking-[-0.05em] text-slate-900 dark:text-white mt-2 md:mt-3">
          {value}
        </h2>
      </div>
      <div
        className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        {React.cloneElement(icon, { size: 20, color })}
      </div>
    </div>
  </GlassCard>
);

// ============================
// COMPONENTE PRINCIPAL
// ============================

const Charts = ({ reports }) => {
  // ============================
  // EVOLUTION DATA
  // ============================
  const evolutionData = reports
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .map(report => ({
      data: new Date(report.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      desvios: Number(report.indicadores?.quantidadeDesvios || 0),
      inspecoes: Number(report.indicadores?.quantidadeInspecoes || 0),
      orientacoes: Number(report.indicadores?.quantidadeOrientacoes || 0),
    }));

  // ============================
  // KPI TOTALS
  // ============================
  const totalInspecoes = reports.reduce((acc, report) => acc + Number(report.indicadores?.quantidadeInspecoes || 0), 0);
  const totalDesvios = reports.reduce((acc, report) => acc + Number(report.indicadores?.quantidadeDesvios || 0), 0);
  const totalOrientacoes = reports.reduce((acc, report) => acc + Number(report.indicadores?.quantidadeOrientacoes || 0), 0);
  const taxaGeral = totalInspecoes > 0 ? ((totalDesvios / totalInspecoes) * 100).toFixed(1) : 0;

  // ============================
  // TST DATA
  // ============================
  const tstMap = {};
  reports.forEach(report => {
    const tst = report.tstResponsavel || 'Não informado';
    if (!tstMap[tst]) tstMap[tst] = { desvios: 0, inspecoes: 0 };
    tstMap[tst].desvios += Number(report.indicadores?.quantidadeDesvios || 0);
    tstMap[tst].inspecoes += Number(report.indicadores?.quantidadeInspecoes || 0);
  });
  const tstChartData = Object.entries(tstMap).map(([name, data]) => ({ name, desvios: data.desvios, inspecoes: data.inspecoes }));

  // ============================
  // CLASSIFICAÇÃO
  // ============================
  const classificacaoData = [
    { name: 'Leves', value: 0, color: COLORS.atencao },
    { name: 'Moderados', value: 0, color: COLORS.moderate },
    { name: 'Graves', value: 0, color: COLORS.critica },
  ];
  reports.forEach(report => {
    if (report.classificacaoDesvios) {
      classificacaoData[0].value += Number(report.classificacaoDesvios.desvioLeve || 0);
      classificacaoData[1].value += Number(report.classificacaoDesvios.desvioModerado || 0);
      classificacaoData[2].value += Number(report.classificacaoDesvios.desvioGrave || 0);
    }
  });

  // ============================
  // CONDIÇÃO GERAL
  // ============================
  const seguraCount = reports.filter(r => r.condicaoGeralArea === 'Segura').length;
  const atencaoCount = reports.filter(r => r.condicaoGeralArea === 'Atenção').length;
  const criticaCount = reports.filter(r => r.condicaoGeralArea === 'Crítica').length;
  const totalCondicoes = seguraCount + atencaoCount + criticaCount;
  const conditionBars = [
    { label: 'Segura', value: seguraCount, color: COLORS.segura },
    { label: 'Atenção', value: atencaoCount, color: COLORS.atencao },
    { label: 'Crítica', value: criticaCount, color: COLORS.critica },
  ];

  // ============================
  // TOP DESVIOS (compatível com sua estrutura)
  // ============================
  const topDesviosMap = {};
  reports.forEach(report => {
    if (report.desviosIdentificados && Array.isArray(report.desviosIdentificados)) {
      report.desviosIdentificados.forEach(item => {
        const descricao = item.descricao || item || 'Não identificado';
        const nomeCurto = descricao.length > 40 ? descricao.substring(0, 40) + '...' : descricao;
        if (!topDesviosMap[nomeCurto]) topDesviosMap[nomeCurto] = 0;
        topDesviosMap[nomeCurto] += 1;
      });
    }
  });
  const topDesvios = Object.entries(topDesviosMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-4 md:space-y-7">
      {/* ===================================== */}
      {/* KPI SECTION - RESPONSIVO 2x2 no mobile */}
      {/* ===================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-7">
        <KpiCard title="Inspeções" value={totalInspecoes} color={COLORS.inspecoes} icon={<ClipboardCheck size={20} color={COLORS.inspecoes} />} />
        <KpiCard title="Desvios" value={totalDesvios} color={COLORS.desvios} icon={<AlertTriangle size={20} color={COLORS.desvios} />} />
        <KpiCard title="Orientações" value={totalOrientacoes} color={COLORS.orientacoes} icon={<ShieldCheck size={20} color={COLORS.orientacoes} />} />
        <KpiCard title="Taxa Geral" value={`${taxaGeral}%`} color={COLORS.atencao} icon={<TrendingUp size={20} color={COLORS.atencao} />} />
      </div>

      {/* ===================================== */}
      {/* HERO CHART - RESPONSIVO */}
      {/* ===================================== */}
      <GlassCard>
        <SectionTitle title="Evolução dos Indicadores" subtitle="Análise temporal das inspeções, desvios e orientações" />
        <ResponsiveContainer width="100%" height={300} className="md:h-[430px]">
          <AreaChart data={evolutionData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="inspecoesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.inspecoes} stopOpacity={0.22} />
                <stop offset="95%" stopColor={COLORS.inspecoes} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke={COLORS.grid} vertical={false} />
            <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="natural" dataKey="inspecoes" stroke="none" fill="url(#inspecoesGradient)" />
            <Line type="natural" dataKey="inspecoes" stroke={COLORS.inspecoes} strokeWidth={3} dot={false} />
            <Line type="natural" dataKey="desvios" stroke={COLORS.desvios} strokeWidth={3} dot={false} />
            <Line type="natural" dataKey="orientacoes" stroke={COLORS.orientacoes} strokeWidth={3} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 md:gap-6 mt-4 md:mt-6">
          <LegendItem color={COLORS.inspecoes} label="Inspeções" />
          <LegendItem color={COLORS.desvios} label="Desvios" />
          <LegendItem color={COLORS.orientacoes} label="Orientações" />
        </div>
      </GlassCard>

      {/* ===================================== */}
      {/* GRID RESPONSIVA */}
      {/* ===================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-7">
        {/* ===================================== */}
        {/* PERFORMANCE POR TST */}
        {/* ===================================== */}
        <GlassCard className="xl:col-span-7">
          <SectionTitle title="Performance por TST" subtitle="Comparativo operacional entre inspeções e desvios" />
          <ResponsiveContainer width="100%" height={300} className="md:h-[360px]">
            <BarChart data={tstChartData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 10 }} barCategoryGap={16}>
              <CartesianGrid strokeDasharray="4 4" stroke={COLORS.grid} horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={70} tick={{ fill: COLORS.textPrimary, fontSize: 12, fontWeight: 500 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="inspecoes" fill={COLORS.inspecoes} radius={[0, 14, 14, 0]} />
              <Bar dataKey="desvios" fill={COLORS.desvios} radius={[0, 14, 14, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ===================================== */}
        {/* CLASSIFICAÇÃO DOS DESVIOS */}
        {/* ===================================== */}
        <GlassCard className="xl:col-span-5">
          <SectionTitle title="Classificação dos Desvios" subtitle="Distribuição por severidade" />
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={280} className="md:h-[320px]">
              <PieChart>
                <Pie
                  data={classificacaoData}
                  startAngle={180}
                  endAngle={0}
                  cx="50%"
                  cy="82%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={4}
                  cornerRadius={10}
                  dataKey="value"
                >
                  {classificacaoData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="-mt-20 md:-mt-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.05em] text-slate-900 dark:text-white">
                {totalDesvios}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 mt-1 md:mt-2">desvios totais</p>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-5 mt-6 md:mt-10 justify-center">
              {classificacaoData.map(item => (
                <LegendItem key={item.name} color={item.color} label={`${item.name} (${item.value})`} />
              ))}
            </div>
          </div>
        </GlassCard>

        {/* ===================================== */}
        {/* CONDIÇÃO GERAL DA ÁREA */}
        {/* ===================================== */}
        <GlassCard className="xl:col-span-6">
          <SectionTitle title="Condição Geral da Área" subtitle="Distribuição das condições operacionais" />
          <div className="space-y-4 md:space-y-8 mt-6 md:mt-10">
            {conditionBars.map(item => {
              const percent = totalCondicoes > 0 ? ((item.value / totalCondicoes) * 100).toFixed(0) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ background: item.color }} />
                      <span className="text-sm md:text-base font-medium text-slate-700 dark:text-gray-300">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-slate-500 dark:text-gray-400">
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full h-3 md:h-4 rounded-full bg-slate-100 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* ===================================== */}
        {/* TOP DESVIOS ENCONTRADOS */}
        {/* ===================================== */}
        <GlassCard className="xl:col-span-6">
          <SectionTitle title="Top Desvios Encontrados" subtitle="Principais ocorrências registradas nas inspeções" />
          <div className="space-y-3 md:space-y-5 mt-6 md:mt-10">
            {topDesvios.length > 0 ? (
              topDesvios.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center justify-between p-3 md:p-5 rounded-xl md:rounded-2xl bg-slate-50/80 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 font-semibold text-sm md:text-base">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-semibold text-slate-800 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400">ocorrência registrada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{item.value}</h3>
                    <span className="text-xs md:text-sm text-slate-500 dark:text-gray-400">registros</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-[200px] md:h-[300px] flex items-center justify-center text-slate-400 dark:text-gray-500">
                Nenhum desvio identificado
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Charts;