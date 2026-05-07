import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis,
  PieChart, Pie, Cell, ComposedChart, Bar, LabelList,
  // Para o Gauge, faremos manual com Pie
} from 'recharts';
import { motion } from 'framer-motion';

// Paleta de cores corporativa CDM + Cores de Segurança
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
  gradient: {
    desvios: ['#EF4444', '#DC2626'],
    inspecoes: ['#3B82F6', '#2563EB'],
    orientacoes: ['#10B981', '#059669'],
  }
};

// Componente de Gauge Chart manual
const GaugeChart = ({ value, label, max = 100, thresholds = [70, 90] }) => {
  const percent = (value / max) * 100;
  let color = COLORS.greenSafe;
  if (percent >= thresholds[1]) color = COLORS.redCritical;
  else if (percent >= thresholds[0]) color = COLORS.yellowAttention;

  const angle = Math.min(180, (percent / 100) * 180);
  const dashArray = 200; // Tamanho total do traço (aproximado)
  const dashOffset = dashArray - (angle / 180) * dashArray;

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="110" viewBox="0 0 200 120" className="mx-auto">
        <path
          d="M30,100 A70,70 0 0,1 170,100"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M30,100 A70,70 0 0,1 170,100"
          fill="none"
          stroke={color}
          strokeWidth="15"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
        <text x="100" y="85" textAnchor="middle" className="text-4xl font-bold dark:fill-white fill-gray-800">
          {value}
        </text>
        <text x="100" y="105" textAnchor="middle" className="text-xs fill-gray-500">
          {label}
        </text>
      </svg>
    </div>
  );
};

const Charts = ({ reports }) => {
  // ==================== 1. Evolução dos Indicadores (Area Chart Suave) ====================
  const evolutionData = reports
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .map(report => ({
      date: new Date(report.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      desvios: report.indicadores?.quantidadeDesvios || 0,
      inspecoes: report.indicadores?.quantidadeInspecoes || 0,
      orientacoes: report.indicadores?.quantidadeOrientacoes || 0,
    }));

  // ==================== 2. Performance por TST (Radial Bar Chart) ====================
  const tstRadialData = [];
  reports.forEach(report => {
    const tst = report.tstResponsavel || 'Não informado';
    const total = (report.indicadores?.quantidadeInspecoes || 0) + (report.indicadores?.quantidadeDesvios || 0);
    const desvios = report.indicadores?.quantidadeDesvios || 0;
    const efficiency = total > 0 ? ((total - desvios) / total) * 100 : 100;

    const existing = tstRadialData.find(d => d.name === tst);
    if (existing) {
      existing.efficiency = (existing.efficiency + efficiency) / 2;
      existing.count += 1;
    } else {
      tstRadialData.push({ name: tst, efficiency, uv: efficiency, fill: COLORS.blueInfo, count: 1 });
    }
  });
  // Ajustar média final
  tstRadialData.forEach(d => { d.efficiency = parseFloat(d.efficiency.toFixed(1)); });

  // ==================== 3. Classificação dos Desvios (Donut Chart) ====================
  const desviosPieData = [];
  reports.forEach(report => {
    if (report.classificacaoDesvios) {
      if (desviosPieData.length === 0) {
        desviosPieData.push({ name: 'Leves', value: report.classificacaoDesvios.desvioLeve || 0, color: COLORS.yellowAttention });
        desviosPieData.push({ name: 'Moderados', value: report.classificacaoDesvios.desvioModerado || 0, color: COLORS.orange });
        desviosPieData.push({ name: 'Graves', value: report.classificacaoDesvios.desvioGrave || 0, color: COLORS.redCritical });
      } else {
        desviosPieData[0].value += report.classificacaoDesvios.desvioLeve || 0;
        desviosPieData[1].value += report.classificacaoDesvios.desvioModerado || 0;
        desviosPieData[2].value += report.classificacaoDesvios.desvioGrave || 0;
      }
    }
  });
  const totalDesvios = desviosPieData.reduce((acc, curr) => acc + curr.value, 0);

  // ==================== 4. Condição da Área (Gauge Chart) ====================
  const seguraCount = reports.filter(r => r.condicaoGeralArea === 'Segura').length;
  const atencaoCount = reports.filter(r => r.condicaoGeralArea === 'Atenção').length;
  const criticaCount = reports.filter(r => r.condicaoGeralArea === 'Crítica').length;
  const totalAreas = seguraCount + atencaoCount + criticaCount;
  const getConditionScore = () => {
    if (totalAreas === 0) return 100;
    return (seguraCount / totalAreas) * 100;
  };
  const conditionScore = getConditionScore();

  // ==================== 5. Taxa de Desvios por TST (Stacked Bar) ====================
  const tstStackedData = [];
  reports.forEach(report => {
    const tst = report.tstResponsavel || 'Não informado';
    const inspecoes = report.indicadores?.quantidadeInspecoes || 0;
    const desvios = report.indicadores?.quantidadeDesvios || 0;
    const conformidade = inspecoes - desvios;
    const existing = tstStackedData.find(d => d.name === tst);
    if (existing) {
      existing.inspecoes += inspecoes;
      existing.conformidade += conformidade;
      existing.desvios += desvios;
    } else {
      tstStackedData.push({ name: tst, inspecoes, conformidade, desvios });
    }
  });
  // Calcular % para exibição
  tstStackedData.forEach(d => {
    const total = d.inspecoes + d.conformidade + d.desvios;
    if (total > 0) {
      d.inspecoesPercent = (d.inspecoes / total) * 100;
      d.conformidadePercent = (d.conformidade / total) * 100;
      d.desviosPercent = (d.desvios / total) * 100;
    } else {
      d.inspecoesPercent = 33.33;
      d.conformidadePercent = 33.33;
      d.desviosPercent = 33.33;
    }
  });

  return (
    <div className="space-y-6">
      {/* ==================== 1. EVOLUÇÃO DOS INDICADORES ==================== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
          <span className="w-1 h-6 bg-cdm-500 rounded-full"></span>
          Evolução dos Indicadores
        </h3>
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={evolutionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDesvios" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.desvios} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.desvios} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorInspecoes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.inspecoes} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.inspecoes} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorOrientacoes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.orientacoes} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.orientacoes} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} horizontal vertical={false} />
            <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }} />
            <Legend />
            <Area type="monotone" dataKey="desvios" stroke={COLORS.desvios} fill="url(#colorDesvios)" strokeWidth={3} name="Desvios" />
            <Area type="monotone" dataKey="inspecoes" stroke={COLORS.inspecoes} fill="url(#colorInspecoes)" strokeWidth={3} name="Inspeções" />
            <Area type="monotone" dataKey="orientacoes" stroke={COLORS.orientacoes} fill="url(#colorOrientacoes)" strokeWidth={3} name="Orientações" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==================== 2. PERFORMANCE POR TST (RADIAL) ==================== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
            <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
            Performance por TST (Eficiência)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={15} data={tstRadialData}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff', formatter: (value, name) => `${value}%` }}
                background
                clockWise
                dataKey="efficiency"
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip formatter={(value) => `${value}%`} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-gray-500 mt-2">Eficiência = (Inspeções - Desvios) / Total</p>
        </motion.div>

        {/* ==================== 3. CLASSIFICAÇÃO DOS DESVIOS (DONUT) ==================== */}
        {totalDesvios > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
              <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
              Classificação dos Desvios
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={desviosPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#888', strokeWidth: 1 }}
                >
                  {desviosPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} desvio(s)`} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==================== 4. CONDIÇÃO GERAL DA ÁREA (GAUGE) ==================== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
            <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
            Condição Geral da Área (Índice de Segurança)
          </h3>
          <GaugeChart value={Math.round(conditionScore)} label="Segurança" max={100} thresholds={[70, 90]} />
          <div className="flex justify-around mt-4 text-sm">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Segura ({seguraCount})</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Atenção ({atencaoCount})</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Crítica ({criticaCount})</div>
          </div>
        </motion.div>

        {/* ==================== 5. TAXA DE DESVIOS POR TST (STACKED BAR) ==================== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
            <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
            Taxa de Desvios por TST (%)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart layout="vertical" data={tstStackedData} margin={{ top: 20, right: 20, bottom: 20, left: 80 }}>
              <CartesianGrid stroke="#374151" opacity={0.1} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" scale="band" />
              <Tooltip formatter={(value, name) => {
                if (name === 'Inspeções') return `${value}% inspeções conformes`;
                if (name === 'Desvios') return `${value}% desvios`;
                return `${value}%`;
              }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none' }} />
              <Legend />
              <Bar dataKey="conformidadePercent" stackId="a" fill={COLORS.greenSafe} name="Conformidade (%)" />
              <Bar dataKey="desviosPercent" stackId="a" fill={COLORS.redCritical} name="Desvios (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Charts;