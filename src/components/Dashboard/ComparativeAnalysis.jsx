import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';

// Paleta de cores CDM
const COLORS = {
  cdm: '#6e0000',
  greenSafe: '#10B981',
  yellowAttention: '#F59E0B',
  redCritical: '#EF4444',
  blueInfo: '#3B82F6',
  desvios: '#EF4444',
  inspecoes: '#3B82F6',
  orientacoes: '#10B981',
  orange: '#F97316',
};

const Charts = ({ reports }) => {
  // ==================== 1. EVOLUÇÃO DOS INDICADORES ====================
  // Agrupar por data (campo 'data' do relatório)
  const evolutionData = reports
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .map(report => ({
      data: report.data,
      desvios: report.indicadores?.quantidadeDesvios || 0,
      inspecoes: report.indicadores?.quantidadeInspecoes || 0,
      orientacoes: report.indicadores?.quantidadeOrientacoes || 0,
    }));

  // ==================== 2. DESVIOS POR TST ====================
  const desviosPorTST = {};
  reports.forEach(report => {
    const tst = report.tstResponsavel || 'Não informado';
    if (!desviosPorTST[tst]) {
      desviosPorTST[tst] = { desvios: 0, inspecoes: 0 };
    }
    desviosPorTST[tst].desvios += report.indicadores?.quantidadeDesvios || 0;
    desviosPorTST[tst].inspecoes += report.indicadores?.quantidadeInspecoes || 0;
  });

  const tstChartData = Object.entries(desviosPorTST).map(([name, data]) => ({
    name,
    desvios: data.desvios,
    inspecoes: data.inspecoes,
    taxa: data.inspecoes > 0 ? ((data.desvios / data.inspecoes) * 100).toFixed(1) : 0,
  }));

  // ==================== 3. CLASSIFICAÇÃO DOS DESVIOS ====================
  const classificacaoData = [
    { name: 'Leves', value: 0, color: COLORS.yellowAttention },
    { name: 'Moderados', value: 0, color: COLORS.orange },
    { name: 'Graves', value: 0, color: COLORS.redCritical },
  ];

  reports.forEach(report => {
    if (report.classificacaoDesvios) {
      classificacaoData[0].value += report.classificacaoDesvios.desvioLeve || 0;
      classificacaoData[1].value += report.classificacaoDesvios.desvioModerado || 0;
      classificacaoData[2].value += report.classificacaoDesvios.desvioGrave || 0;
    }
  });

  const totalDesvios = classificacaoData.reduce((acc, curr) => acc + curr.value, 0);

  // ==================== 4. CONDIÇÃO DA ÁREA ====================
  const seguraCount = reports.filter(r => r.condicaoGeralArea === 'Segura').length;
  const atencaoCount = reports.filter(r => r.condicaoGeralArea === 'Atenção').length;
  const criticaCount = reports.filter(r => r.condicaoGeralArea === 'Crítica').length;

  const condicaoData = [
    { name: 'Segura', value: seguraCount, color: COLORS.greenSafe },
    { name: 'Atenção', value: atencaoCount, color: COLORS.yellowAttention },
    { name: 'Crítica', value: criticaCount, color: COLORS.redCritical },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* ==================== 1. EVOLUÇÃO DOS INDICADORES ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
          <span className="w-1 h-5 bg-cdm-500 rounded-full"></span>
          Evolução dos Indicadores
        </h3>
        {evolutionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="data" 
                stroke="#6B7280" 
                tick={{ fontSize: 12 }}
                label={{ value: 'Data', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="#6B7280" 
                tick={{ fontSize: 12 }}
                label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.85)',
                  borderRadius: '8px',
                  border: 'none',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="desvios"
                stroke={COLORS.desvios}
                strokeWidth={3}
                name="Desvios"
                dot={{ fill: COLORS.desvios, r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="inspecoes"
                stroke={COLORS.inspecoes}
                strokeWidth={3}
                name="Inspeções"
                dot={{ fill: COLORS.inspecoes, r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="orientacoes"
                stroke={COLORS.orientacoes}
                strokeWidth={3}
                name="Orientações"
                dot={{ fill: COLORS.orientacoes, r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            Nenhum dado disponível para o período selecionado
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==================== 2. DESVIOS POR TST ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-cdm-600 dark:text-cdm-400 flex items-center gap-2">
            <span className="w-1 h-4 bg-cdm-500 rounded-full"></span>
            Desvios por TST
          </h3>
          {tstChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tstChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    borderRadius: '8px',
                    border: 'none',
                  }}
                />
                <Legend />
                <Bar dataKey="desvios" fill={COLORS.desvios} name="Desvios" radius={[8, 8, 0, 0]} />
                <Bar dataKey="inspecoes" fill={COLORS.inspecoes} name="Inspeções" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </motion.div>

        {/* ==================== 3. CLASSIFICAÇÃO DOS DESVIOS ==================== */}
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
          {totalDesvios > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={classificacaoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {classificacaoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} desvio(s)`} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Total de {totalDesvios} desvios identificados
              </p>
            </>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              Nenhum desvio registrado
            </div>
          )}
        </motion.div>
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
          {condicaoData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={condicaoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {condicaoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-around mt-4 text-sm">
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1"></div>
                  <span className="text-xs">Segura: {seguraCount}</span>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-1"></div>
                  <span className="text-xs">Atenção: {atencaoCount}</span>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1"></div>
                  <span className="text-xs">Crítica: {criticaCount}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
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
            Taxa de Desvios por TST (%)
          </h3>
          {tstChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tstChartData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" stroke="#6B7280" tick={{ fontSize: 12 }} width={80} />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    borderRadius: '8px',
                    border: 'none',
                  }}
                />
                <Bar
                  dataKey="taxa"
                  fill={COLORS.desvios}
                  name="Taxa de Desvios"
                  radius={[0, 8, 8, 0]}
                  label={{
                    position: 'right',
                    formatter: (value) => `${value}%`,
                    fill: '#fff',
                    fontSize: 12,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Percentual de desvios em relação às inspeções realizadas
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Charts;