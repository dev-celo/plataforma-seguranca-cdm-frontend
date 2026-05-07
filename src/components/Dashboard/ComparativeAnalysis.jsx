import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';
import { motion } from 'framer-motion';

// Paleta de cores corporativa CDM
const COLORS = {
  cdm: '#6e0000',
  cdmLight: '#8a1a1a',
  greenSafe: '#10B981',
  yellowAttention: '#F59E0B',
  redCritical: '#EF4444',
  blueInfo: '#3B82F6',
  purple: '#8B5CF6',
  gray: '#6B7280',
  desvios: '#EF4444',
  inspecoes: '#3B82F6',
  orientacoes: '#10B981',
  orange: '#F97316',
};

// Componente de Gauge Chart manual
const GaugeChart = ({ value, label, max = 100 }) => {
  const percent = Math.min(100, (value / max) * 100);
  let color = COLORS.greenSafe;
  if (percent >= 90) color = COLORS.redCritical;
  else if (percent >= 70) color = COLORS.yellowAttention;

  const angle = (percent / 100) * 180;
  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (angle / 180) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="110" viewBox="0 0 180 110" className="mx-auto">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
          strokeLinecap="round"
          transform="rotate(180 90 90)"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={0}
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          transform="rotate(180 90 90)"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <text x="90" y="85" textAnchor="middle" className="text-3xl font-bold dark:fill-white fill-gray-800">
          {Math.round(value)}
        </text>
        <text x="90" y="105" textAnchor="middle" className="text-xs fill-gray-500">
          {label}
        </text>
      </svg>
    </div>
  );
};

const Charts = ({ reports }) => {
  // ==================== 1. EVOLUÇÃO DOS INDICADORES (Barras + Linhas) ====================
  const evolutionData = reports
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .map(report => ({
      date: new Date(report.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      desvios: report.indicadores?.quantidadeDesvios || 0,
      inspecoes: report.indicadores?.quantidadeInspecoes || 0,
      orientacoes: report.indicadores?.quantidadeOrientacoes || 0,
      desviosAcumulado: 0,
    }));

  // Calcular acumulado de desvios (opcional)
  let acumulado = 0;
  evolutionData.forEach(item => {
    acumulado += item.desvios;
    item.desviosAcumulado = acumulado;
  });

  // ==================== 2. PERFORMANCE POR TST (RADIAL BAR CHART) ====================
  const tstRadialData = [];
  const tstMap = new Map();

  reports.forEach(report => {
    const tst = report.tstResponsavel || 'Não informado';
    const total = (report.indicadores?.quantidadeInspecoes || 0) + (report.indicadores?.quantidadeDesvios || 0);
    const desvios = report.indicadores?.quantidadeDesvios || 0;
    const efficiency = total > 0 ? ((total - desvios) / total) * 100 : 100;

    if (!tstMap.has(tst)) {
      tstMap.set(tst, { sumEfficiency: 0, count: 0 });
    }
    const current = tstMap.get(tst);
    current.sumEfficiency += efficiency;
    current.count += 1;
  });

  tstMap.forEach((value, key) => {
    tstRadialData.push({
      name: key,
      efficiency: parseFloat((value.sumEfficiency / value.count).toFixed(1)),
      fill: COLORS.blueInfo,
    });
  });

  // ==================== 3. CLASSIFICAÇÃO DOS DESVIOS (DONUT CHART) ====================
  const desviosPieData = [
    { name: 'Leves', value: 0, color: COLORS.yellowAttention },
    { name: 'Moderados', value: 0, color: COLORS.orange },
    { name: 'Graves', value: 0, color: COLORS.redCritical },
  ];

  reports.forEach(report => {
    if (report.classificacaoDesvios) {
      desviosPieData[0].value += report.classificacaoDesvios.desvioLeve || 0;
      desviosPieData[1].value += report.classificacaoDesvios.desvioModerado || 0;
      desviosPieData[2].value += report.classificacaoDesvios.desvioGrave || 0;
    }
  });

  const totalDesvios = desviosPieData.reduce((acc, curr) => acc + curr.value, 0);

  // ==================== 4. CONDIÇÃO DA ÁREA (GAUGE CHART) ====================
  const seguraCount = reports.filter(r => r.condicaoGeralArea === 'Segura').length;
  const atencaoCount = reports.filter(r => r.condicaoGeralArea === 'Atenção').length;
  const criticaCount = reports.filter(r => r.condicaoGeralArea === 'Crítica').length;
  const totalAreas = seguraCount + atencaoCount + criticaCount;
  const conditionScore = totalAreas > 0 ? (seguraCount / totalAreas) * 100 : 100;

  // ==================== 5. TAXA DE DESVIOS POR TST (STACKED BAR) ====================
  const tstStackedData = [];
  const stackedMap = new Map();

  reports.forEach(report => {
    const tst = report.tstResponsavel || 'Não informado';
    const inspecoes = report.indicadores?.quantidadeInspecoes || 0;
    const desvios = report.indicadores?.quantidadeDesvios || 0;
    const conformidade = inspecoes - desvios;

    if (!stackedMap.has(tst)) {
      stackedMap.set(tst, { conformidade: 0, desvios: 0, total: 0 });
    }
    const current = stackedMap.get(tst);
    current.conformidade += conformidade;
    current.desvios += desvios;
    current.total += inspecoes;
  });

  stackedMap.forEach((value, key) => {
    let conformidadePercent = 0;
    let desviosPercent = 0;
    if (value.total > 0) {
      conformidadePercent = (value.conformidade / value.total) * 100;
      desviosPercent = (value.desvios / value.total) * 100;
    } else {
      conformidadePercent = 100;
      desviosPercent = 0;
    }
    tstStackedData.push({
      name: key,
      conformidadePercent: parseFloat(conformidadePercent.toFixed(1)),
      desviosPercent: parseFloat(desviosPercent.toFixed(1)),
    });
  });

  return (
    <div className="space-y-6">
      {/* ==================== 1. EVOLUÇÃO DOS INDICADORES ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold mb-6 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
          <span className="w-1 h-6 bg-cdm-500 rounded-full"></span>
          Evolução dos Indicadores
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={evolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.desvios} stopOpacity={0.8} />
                <stop offset="100%" stopColor={COLORS.desvios} stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" stroke="#6B7280" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#EF4444" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.85)',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
              }}
              formatter={(value, name) => {
                if (name === 'Desvios') return [`${value} desvios`, name];
                if (name === 'Inspeções') return [`${value} inspeções`, name];
                return [`${value}`, name];
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '16px' }} />
            <Bar
              yAxisId="left"
              dataKey="inspecoes"
              fill={COLORS.blueInfo}
              name="Inspeções"
              radius={[8, 8, 0, 0]}
              barSize={40}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="desvios"
              stroke={COLORS.desvios}
              strokeWidth={3}
              name="Desvios"
              dot={{ fill: COLORS.desvios, r: 6, strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="orientacoes"
              stroke={COLORS.orientacoes}
              strokeWidth={3}
              name="Orientações"
              dot={{ fill: COLORS.orientacoes, r: 6, strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Barras representam Inspeções | Linhas representam Desvios e Orientações
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==================== 2. PERFORMANCE POR TST (RADIAL) ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
            <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
            Performance por TST
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              barSize={16}
              data={tstRadialData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                minAngle={15}
                label={{
                  position: 'insideStart',
                  fill: '#fff',
                  fontSize: 12,
                  fontWeight: 'bold',
                  formatter: (value, name) => `${value}%`,
                }}
                background
                clockWise
                dataKey="efficiency"
                cornerRadius={8}
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value, entry) => `${value}: ${entry.payload.efficiency}%`}
              />
              <Tooltip formatter={(value) => `${value}% de eficiência`} />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Eficiência = (Inspeções - Desvios) / Total de Inspeções
          </p>
        </motion.div>

        {/* ==================== 3. CLASSIFICAÇÃO DOS DESVIOS ==================== */}
        {totalDesvios > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
              <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
              Classificação dos Desvios
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={desviosPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#888', strokeWidth: 1 }}
                >
                  {desviosPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} desvio(s)`} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Total de {totalDesvios} desvios identificados
            </p>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==================== 4. CONDIÇÃO GERAL DA ÁREA ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
            <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
            Condição Geral da Área
          </h3>
          <GaugeChart value={conditionScore} label="Índice de Segurança" max={100} />
          <div className="flex justify-around mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Segura ({seguraCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Atenção ({atencaoCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Crítica ({criticaCount})</span>
            </div>
          </div>
        </motion.div>

        {/* ==================== 5. TAXA DE DESVIOS POR TST ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
            <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
            Taxa de Desvios por TST
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart layout="vertical" data={tstStackedData} margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
              <CartesianGrid stroke="#374151" opacity={0.1} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" scale="band" width={80} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'Conformidade') return [`${value}%`, 'Conformidade'];
                  return [`${value}%`, 'Desvios'];
                }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: '12px', border: 'none' }}
              />
              <Legend wrapperStyle={{ paddingTop: '16px' }} />
              <Bar dataKey="conformidadePercent" stackId="a" fill={COLORS.greenSafe} name="Conformidade" radius={[0, 8, 8, 0]} />
              <Bar dataKey="desviosPercent" stackId="a" fill={COLORS.redCritical} name="Desvios" radius={[8, 0, 0, 8]} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Proporção de Conformidade vs Desvios por TST
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Charts;