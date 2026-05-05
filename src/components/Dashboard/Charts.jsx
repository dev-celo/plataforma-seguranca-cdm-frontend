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
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Charts = ({ reports }) => {
  // Preparar dados para gráfico de evolução
  const evolutionData = reports
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(report => ({
      date: format(parseISO(report.data), 'dd/MM', { locale: ptBR }),
      desvios: report.indicadores?.quantidadeDesvios || 0,
      inspecoes: report.indicadores?.quantidadeInspecoes || 0,
      orientacoes: report.indicadores?.quantidadeOrientacoes || 0
    }));

  // Dados para gráfico de desvios por TST
  const tstData = {};
  reports.forEach(report => {
    const tst = report.tstResponsavel || 'Não informado';
    if (!tstData[tst]) {
      tstData[tst] = { desvios: 0, inspecoes: 0, nome: tst };
    }
    tstData[tst].desvios += report.indicadores?.quantidadeDesvios || 0;
    tstData[tst].inspecoes += report.indicadores?.quantidadeInspecoes || 0;
  });
  
  const tstChartData = Object.values(tstData).map(tst => ({
    name: tst.nome,
    desvios: tst.desvios,
    inspecoes: tst.inspecoes,
    taxa: tst.inspecoes > 0 ? ((tst.desvios / tst.inspecoes) * 100).toFixed(1) : 0
  }));

  // Dados para gráfico de classificação de desvios
  const classificacaoData = [];
  reports.forEach(report => {
    if (report.classificacaoDesvios) {
      classificacaoData.push({
        leve: report.classificacaoDesvios.desvioLeve || 0,
        moderado: report.classificacaoDesvios.desvioModerado || 0,
        grave: report.classificacaoDesvios.desvioGrave || 0
      });
    }
  });
  
  const totalClassificacao = classificacaoData.reduce(
    (acc, curr) => ({
      leve: acc.leve + curr.leve,
      moderado: acc.moderado + curr.moderado,
      grave: acc.grave + curr.grave
    }),
    { leve: 0, moderado: 0, grave: 0 }
  );
  
  const pieData = [
    { name: 'Desvios Leves', value: totalClassificacao.leve, color: '#10B981' },
    { name: 'Desvios Moderados', value: totalClassificacao.moderado, color: '#F59E0B' },
    { name: 'Desvios Graves', value: totalClassificacao.grave, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Dados para gráfico de condição da área
  const condicaoData = {};
  reports.forEach(report => {
    const condicao = report.condicaoGeralArea || 'Não informado';
    condicaoData[condicao] = (condicaoData[condicao] || 0) + 1;
  });
  
  const condicaoChartData = Object.entries(condicaoData).map(([name, value]) => ({
    name,
    value,
    color: name === 'Segura' ? '#10B981' : name === 'Atenção' ? '#F59E0B' : '#EF4444'
  }));

  return (
    <div className="space-y-6">
      {/* Gráfico de Evolução */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Evolução dos Indicadores</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                borderRadius: '8px',
                border: 'none',
                color: '#fff'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="desvios"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', r: 4 }}
              name="Desvios"
            />
            <Line
              type="monotone"
              dataKey="inspecoes"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              name="Inspeções"
            />
            <Line
              type="monotone"
              dataKey="orientacoes"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              name="Orientações"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance por TST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Performance por TST</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tstChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.9)',
                  borderRadius: '8px',
                  border: 'none'
                }}
              />
              <Legend />
              <Bar dataKey="desvios" fill="#EF4444" name="Desvios" radius={[8, 8, 0, 0]} />
              <Bar dataKey="inspecoes" fill="#3B82F6" name="Inspeções" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Classificação de Desvios */}
        {pieData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Classificação dos Desvios</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Condição da Área */}
        {condicaoChartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Condição Geral da Área</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={condicaoChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="name" type="category" stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    borderRadius: '8px',
                    border: 'none'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {condicaoChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Taxa de Desvios por TST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Taxa de Desvios por TST (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={tstChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.9)',
                  borderRadius: '8px',
                  border: 'none'
                }}
                formatter={(value) => [`${value}%`, 'Taxa de Desvios']}
              />
              <Area
                type="monotone"
                dataKey="taxa"
                stroke="#8B5CF6"
                fill="url(#colorGradient)"
                name="Taxa de Desvios (%)"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Charts;