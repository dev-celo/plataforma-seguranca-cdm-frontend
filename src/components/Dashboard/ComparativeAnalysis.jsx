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
// GLASS CARD
// ============================

const GlassCard = ({
  children,
  className = '',
}) => (
  <motion.div
    {...cardAnimation}
    whileHover={{
      y: -3,
      scale: 1.005,
    }}
    className={`
      rounded-[30px]
      border
      border-white/50
      bg-white/70
      backdrop-blur-xl
      shadow-[0_10px_30px_rgba(15,23,42,0.08)]
      p-7
      transition-all
      duration-300
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// ============================
// TITULO
// ============================

const SectionTitle = ({
  title,
  subtitle,
}) => (
  <div className="mb-8">

    <h3 className="text-[22px] font-semibold tracking-[-0.03em] text-slate-900">
      {title}
    </h3>

    {subtitle && (
      <p className="text-sm text-slate-500 mt-1">
        {subtitle}
      </p>
    )}

    <div className="w-16 h-1 rounded-full bg-slate-900/10 mt-4" />

  </div>
);

// ============================
// LEGENDA
// ============================

const LegendItem = ({
  color,
  label,
}) => (
  <div className="flex items-center gap-2">

    <div
      className="w-2.5 h-2.5 rounded-full"
      style={{ background: color }}
    />

    <span className="text-sm font-medium text-slate-500">
      {label}
    </span>

  </div>
);

// ============================
// TOOLTIP
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
// KPI CARD
// ============================

const KpiCard = ({
  title,
  value,
  icon,
  color,
}) => (
  <GlassCard>

    <div className="flex items-start justify-between">

      <div>

        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h2 className="text-4xl font-bold tracking-[-0.05em] text-slate-900 mt-3">
          {value}
        </h2>

      </div>

      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: `${color}15`,
        }}
      >
        {icon}
      </div>

    </div>

  </GlassCard>
);

// ============================
// COMPONENTE
// ============================

const Charts = ({ reports }) => {

  // ============================
  // EVOLUTION
  // ============================

  const evolutionData = reports
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .map(report => ({
      data: new Date(report.data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),

      desvios:
        Number(report.indicadores?.quantidadeDesvios || 0),

      inspecoes:
        Number(report.indicadores?.quantidadeInspecoes || 0),

      orientacoes:
        Number(report.indicadores?.quantidadeOrientacoes || 0),
    }));

  // ============================
  // KPI TOTALS
  // ============================

  const totalInspecoes = reports.reduce(
    (acc, report) =>
      acc + Number(report.indicadores?.quantidadeInspecoes || 0),
    0
  );

  const totalDesvios = reports.reduce(
    (acc, report) =>
      acc + Number(report.indicadores?.quantidadeDesvios || 0),
    0
  );

  const totalOrientacoes = reports.reduce(
    (acc, report) =>
      acc + Number(report.indicadores?.quantidadeOrientacoes || 0),
    0
  );

  const taxaGeral =
    totalInspecoes > 0
      ? (
          (totalDesvios / totalInspecoes) * 100
        ).toFixed(1)
      : 0;

  // ============================
  // TST
  // ============================

  const tstMap = {};

  reports.forEach(report => {

    const tst =
      report.tstResponsavel || 'Não informado';

    if (!tstMap[tst]) {
      tstMap[tst] = {
        desvios: 0,
        inspecoes: 0,
      };
    }

    tstMap[tst].desvios +=
      Number(report.indicadores?.quantidadeDesvios || 0);

    tstMap[tst].inspecoes +=
      Number(report.indicadores?.quantidadeInspecoes || 0);
  });

  const tstChartData =
    Object.entries(tstMap).map(([name, data]) => ({
      name,
      desvios: data.desvios,
      inspecoes: data.inspecoes,
    }));

  // ============================
  // CLASSIFICAÇÃO
  // ============================

  const classificacaoData = [
    {
      name: 'Leves',
      value: 0,
      color: COLORS.atencao,
    },

    {
      name: 'Moderados',
      value: 0,
      color: COLORS.moderate,
    },

    {
      name: 'Graves',
      value: 0,
      color: COLORS.critica,
    },
  ];

  reports.forEach(report => {

    if (report.classificacaoDesvios) {

      classificacaoData[0].value +=
        Number(report.classificacaoDesvios.desvioLeve || 0);

      classificacaoData[1].value +=
        Number(report.classificacaoDesvios.desvioModerado || 0);

      classificacaoData[2].value +=
        Number(report.classificacaoDesvios.desvioGrave || 0);
    }
  });

  // ============================
  // CONDIÇÃO GERAL
  // ============================

  const seguraCount =
    reports.filter(
      r => r.condicaoGeralArea === 'Segura'
    ).length;

  const atencaoCount =
    reports.filter(
      r => r.condicaoGeralArea === 'Atenção'
    ).length;

  const criticaCount =
    reports.filter(
      r => r.condicaoGeralArea === 'Crítica'
    ).length;

  const totalCondicoes =
    seguraCount + atencaoCount + criticaCount;

  const conditionBars = [
    {
      label: 'Segura',
      value: seguraCount,
      color: COLORS.segura,
    },

    {
      label: 'Atenção',
      value: atencaoCount,
      color: COLORS.atencao,
    },

    {
      label: 'Crítica',
      value: criticaCount,
      color: COLORS.critica,
    },
  ];

  // ============================
  // TOP DESVIOS
  // ============================

  const topDesviosMap = {};

  reports.forEach(report => {

    if (report.desvios && Array.isArray(report.desvios)) {

      report.desvios.forEach(item => {

        const tipo =
          item.tipo || item.nome || 'Não identificado';

        if (!topDesviosMap[tipo]) {
          topDesviosMap[tipo] = 0;
        }

        topDesviosMap[tipo] += 1;
      });
    }
  });

  const topDesvios =
    Object.entries(topDesviosMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

  return (

    <div className="space-y-7">

      {/* ===================================== */}
      {/* KPI SECTION */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">

        <KpiCard
          title="Inspeções"
          value={totalInspecoes}
          color={COLORS.inspecoes}
          icon={
            <ClipboardCheck
              size={28}
              color={COLORS.inspecoes}
            />
          }
        />

        <KpiCard
          title="Desvios"
          value={totalDesvios}
          color={COLORS.desvios}
          icon={
            <AlertTriangle
              size={28}
              color={COLORS.desvios}
            />
          }
        />

        <KpiCard
          title="Orientações"
          value={totalOrientacoes}
          color={COLORS.orientacoes}
          icon={
            <ShieldCheck
              size={28}
              color={COLORS.orientacoes}
            />
          }
        />

        <KpiCard
          title="Taxa Geral"
          value={`${taxaGeral}%`}
          color={COLORS.atencao}
          icon={
            <TrendingUp
              size={28}
              color={COLORS.atencao}
            />
          }
        />

      </div>

      {/* ===================================== */}
      {/* HERO CHART */}
      {/* ===================================== */}

      <GlassCard>

        <SectionTitle
          title="Evolução dos Indicadores"
          subtitle="Análise temporal das inspeções, desvios e orientações"
        />

        <ResponsiveContainer width="100%" height={430}>

          <AreaChart
            data={evolutionData}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id="inspecoesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor={COLORS.inspecoes}
                  stopOpacity={0.22}
                />

                <stop
                  offset="95%"
                  stopColor={COLORS.inspecoes}
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke={COLORS.grid}
              vertical={false}
            />

            <XAxis
              dataKey="data"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: COLORS.textSecondary,
                fontSize: 13,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: COLORS.textSecondary,
                fontSize: 13,
              }}
            />

            <Tooltip contentStyle={tooltipStyle} />

            <Area
              type="natural"
              dataKey="inspecoes"
              stroke="none"
              fill="url(#inspecoesGradient)"
            />

            <Line
              type="natural"
              dataKey="inspecoes"
              stroke={COLORS.inspecoes}
              strokeWidth={4}
              dot={false}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <Line
              type="natural"
              dataKey="desvios"
              stroke={COLORS.desvios}
              strokeWidth={3}
              dot={false}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <Line
              type="natural"
              dataKey="orientacoes"
              stroke={COLORS.orientacoes}
              strokeWidth={3}
              dot={false}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

          </AreaChart>

        </ResponsiveContainer>

        <div className="flex gap-6 mt-6 flex-wrap">

          <LegendItem
            color={COLORS.inspecoes}
            label="Inspeções"
          />

          <LegendItem
            color={COLORS.desvios}
            label="Desvios"
          />

          <LegendItem
            color={COLORS.orientacoes}
            label="Orientações"
          />

        </div>

      </GlassCard>

      {/* ===================================== */}
      {/* GRID */}
      {/* ===================================== */}

      <div className="grid grid-cols-12 gap-7">

        {/* ===================================== */}
        {/* PERFORMANCE */}
        {/* ===================================== */}

        <GlassCard className="col-span-12 xl:col-span-7">

          <SectionTitle
            title="Performance por TST"
            subtitle="Comparativo operacional entre inspeções e desvios"
          />

          <ResponsiveContainer width="100%" height={360}>

            <BarChart
              data={tstChartData}
              layout="vertical"
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
              barCategoryGap={24}
            >

              <CartesianGrid
                strokeDasharray="4 4"
                stroke={COLORS.grid}
                horizontal={false}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: COLORS.textSecondary,
                }}
              />

              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={90}
                tick={{
                  fill: COLORS.textPrimary,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />

              <Tooltip contentStyle={tooltipStyle} />

              <Bar
                dataKey="inspecoes"
                fill={COLORS.inspecoes}
                radius={[0, 14, 14, 0]}
              />

              <Bar
                dataKey="desvios"
                fill={COLORS.desvios}
                radius={[0, 14, 14, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </GlassCard>

        {/* ===================================== */}
        {/* CLASSIFICAÇÃO */}
        {/* ===================================== */}

        <GlassCard className="col-span-12 xl:col-span-5">

          <SectionTitle
            title="Classificação dos Desvios"
            subtitle="Distribuição por severidade"
          />

          <div className="flex flex-col items-center justify-center">

            <ResponsiveContainer width="100%" height={320}>

              <PieChart>

                <Pie
                  data={classificacaoData}
                  startAngle={180}
                  endAngle={0}
                  cx="50%"
                  cy="82%"
                  innerRadius={95}
                  outerRadius={118}
                  paddingAngle={4}
                  cornerRadius={10}
                  dataKey="value"
                >

                  {classificacaoData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={entry.color}
                    />

                  ))}

                </Pie>

              </PieChart>

            </ResponsiveContainer>

            <div className="-mt-24 text-center">

              <h2 className="text-5xl font-bold tracking-[-0.05em] text-slate-900">
                {totalDesvios}
              </h2>

              <p className="text-slate-500 mt-2">
                desvios totais
              </p>

            </div>

            <div className="flex gap-5 mt-10 flex-wrap justify-center">

              {classificacaoData.map(item => (

                <LegendItem
                  key={item.name}
                  color={item.color}
                  label={`${item.name} (${item.value})`}
                />

              ))}

            </div>

          </div>

        </GlassCard>

        {/* ===================================== */}
        {/* CONDIÇÃO */}
        {/* ===================================== */}

        <GlassCard className="col-span-12 xl:col-span-6">

          <SectionTitle
            title="Condição Geral da Área"
            subtitle="Distribuição das condições operacionais"
          />

          <div className="space-y-8 mt-10">

            {conditionBars.map(item => {

              const percent =
                totalCondicoes > 0
                  ? (
                      (item.value / totalCondicoes) * 100
                    ).toFixed(0)
                  : 0;

              return (

                <div key={item.label}>

                  <div className="flex items-center justify-between mb-3">

                    <div className="flex items-center gap-3">

                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: item.color,
                        }}
                      />

                      <span className="font-medium text-slate-700">
                        {item.label}
                      </span>

                    </div>

                    <span className="text-sm font-semibold text-slate-500">
                      {percent}%
                    </span>

                  </div>

                  <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden">

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{
                        duration: 1.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="h-full rounded-full"
                      style={{
                        background: item.color,
                      }}
                    />

                  </div>

                </div>

              );
            })}

          </div>

        </GlassCard>

        {/* ===================================== */}
        {/* TOP DESVIOS */}
        {/* ===================================== */}

        <GlassCard className="col-span-12 xl:col-span-6">

          <SectionTitle
            title="Top Desvios Encontrados"
            subtitle="Principais ocorrências registradas nas inspeções"
          />

          <div className="space-y-5 mt-10">

            {topDesvios.length > 0 ? (

              topDesvios.map((item, index) => (

                <motion.div
                  key={item.name}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="
                    flex
                    items-center
                    justify-between
                    p-5
                    rounded-2xl
                    bg-slate-50/80
                    border
                    border-slate-100
                  "
                >

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-red-50
                        flex
                        items-center
                        justify-center
                        text-red-600
                        font-semibold
                      "
                    >
                      {index + 1}
                    </div>

                    <div>

                      <h4 className="font-semibold text-slate-800">
                        {item.name}
                      </h4>

                      <p className="text-sm text-slate-500">
                        ocorrência registrada
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <h3 className="text-2xl font-bold text-slate-900">
                      {item.value}
                    </h3>

                    <span className="text-sm text-slate-500">
                      registros
                    </span>

                  </div>

                </motion.div>

              ))

            ) : (

              <div className="h-[300px] flex items-center justify-center text-slate-400">
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