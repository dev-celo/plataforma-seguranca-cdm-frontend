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

import { motion } from 'framer-motion';

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

  shadow: '0 10px 30px rgba(15,23,42,0.08)',
};

const cardAnimation = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1],
  },
};

const GlassCard = ({ children, className = '' }) => (
  <motion.div
    {...cardAnimation}
    whileHover={{
      y: -3,
      scale: 1.005,
    }}
    className={`
      rounded-[28px]
      border
      border-white/40
      backdrop-blur-xl
      bg-white/70
      shadow-[0_10px_30px_rgba(15,23,42,0.08)]
      p-7
      ${className}
    `}
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center justify-between mb-7">
    <div>
      <h3 className="text-[22px] font-semibold text-slate-900 tracking-[-0.02em]">
        {title}
      </h3>

      <div className="w-14 h-1 rounded-full bg-slate-900/10 mt-3" />
    </div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-2.5 h-2.5 rounded-full"
      style={{ background: color }}
    />

    <span className="text-sm text-slate-500 font-medium">
      {label}
    </span>
  </div>
);

const TooltipStyle = {
  background: 'rgba(255,255,255,0.92)',
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: '18px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  backdropFilter: 'blur(12px)',
  color: '#111827',
};

const Charts = ({ reports }) => {

  // ==================== EVOLUTION ====================

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

  // ==================== TST ====================

  const tstMap = {};

  reports.forEach(report => {
    const tst = report.tstResponsavel || 'Não informado';

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

  const tstChartData = Object.entries(tstMap).map(([name, data]) => ({
    name,
    desvios: data.desvios,
    inspecoes: data.inspecoes,

    taxa:
      data.inspecoes > 0
        ? Number(
            ((data.desvios / data.inspecoes) * 100).toFixed(1)
          )
        : 0,
  }));

  // ==================== CLASSIFICAÇÃO ====================

  const classificacaoData = [
    {
      name: 'Leves',
      value: 0,
      color: COLORS.atencao,
    },

    {
      name: 'Moderados',
      value: 0,
      color: '#FB923C',
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

  const totalDesvios =
    classificacaoData.reduce((acc, item) => acc + item.value, 0);

  // ==================== CONDIÇÃO ====================

  const seguraCount =
    reports.filter(r => r.condicaoGeralArea === 'Segura').length;

  const atencaoCount =
    reports.filter(r => r.condicaoGeralArea === 'Atenção').length;

  const criticaCount =
    reports.filter(r => r.condicaoGeralArea === 'Crítica').length;

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

  return (
    <div className="space-y-7">

      {/* ================= HERO CHART ================= */}

      <GlassCard>

        <SectionTitle title="Evolução dos Indicadores" />

        <ResponsiveContainer width="100%" height={420}>

          <AreaChart
            data={evolutionData}
            margin={{
              top: 20,
              right: 10,
              left: -10,
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
              tick={{
                fill: COLORS.textSecondary,
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: COLORS.textSecondary,
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip contentStyle={TooltipStyle} />

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

        <div className="flex gap-6 mt-5">

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

      {/* ================= GRID ================= */}

      <div className="grid grid-cols-12 gap-7">

        {/* ================= PERFORMANCE ================= */}

        <GlassCard className="col-span-12 xl:col-span-7">

          <SectionTitle title="Performance por TST" />

          <ResponsiveContainer width="100%" height={340}>

            <BarChart
              data={tstChartData}
              layout="vertical"
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
              barCategoryGap={22}
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
                tick={{
                  fill: COLORS.textPrimary,
                  fontSize: 14,
                  fontWeight: 500,
                }}
                width={90}
              />

              <Tooltip contentStyle={TooltipStyle} />

              <Bar
                dataKey="inspecoes"
                fill={COLORS.inspecoes}
                radius={[0, 12, 12, 0]}
              />

              <Bar
                dataKey="desvios"
                fill={COLORS.desvios}
                radius={[0, 12, 12, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </GlassCard>

        {/* ================= CLASSIFICAÇÃO ================= */}

        <GlassCard className="col-span-12 xl:col-span-5">

          <SectionTitle title="Classificação dos Desvios" />

          <div className="flex flex-col items-center justify-center">

            <ResponsiveContainer width="100%" height={320}>

              <PieChart>

                <Pie
                  data={classificacaoData}
                  startAngle={180}
                  endAngle={0}
                  cx="50%"
                  cy="80%"
                  innerRadius={90}
                  outerRadius={115}
                  paddingAngle={4}
                  dataKey="value"
                  cornerRadius={8}
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

              <h2 className="text-5xl font-bold tracking-[-0.04em] text-slate-900">
                {totalDesvios}
              </h2>

              <p className="text-slate-500 mt-2">
                desvios registrados
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

        {/* ================= CONDIÇÃO ================= */}

        <GlassCard className="col-span-12 xl:col-span-7">

          <SectionTitle title="Condição Geral da Área" />

          <div className="space-y-7 mt-10">

            {conditionBars.map(item => {

              const percent =
                totalCondicoes > 0
                  ? ((item.value / totalCondicoes) * 100).toFixed(0)
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

        {/* ================= TAXA ================= */}

        <GlassCard className="col-span-12 xl:col-span-5">

          <SectionTitle title="Taxa de Desvios (%)" />

          <div className="space-y-6 mt-10">

            {tstChartData.map(item => (

              <div key={item.name}>

                <div className="flex justify-between mb-2">

                  <span className="text-slate-700 font-medium">
                    {item.name}
                  </span>

                  <span className="text-slate-500 font-semibold">
                    {item.taxa}%
                  </span>

                </div>

                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.taxa}%` }}
                    transition={{
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: COLORS.desvios,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </GlassCard>

      </div>

    </div>
  );
};

export default Charts;