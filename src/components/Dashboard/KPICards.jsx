import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  Calendar, 
  GraduationCap, 
  MessageCircle, 
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const KPICards = ({ kpiData, periodLabel }) => {
  const cards = [
    {
      title: 'Inspeções Realizadas',
      value: kpiData.totalInspecoes,
      icon: ClipboardCheck,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: '+12%'
    },
    {
      title: 'Desvios Identificados',
      value: kpiData.totalDesvios,
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      trend: `${kpiData.desvioPercent.toFixed(1)}% dos desvios`
    },
    {
      title: 'DDS Realizados',
      value: kpiData.totalDDS,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: 'Diálogos de Segurança'
    },
    {
      title: 'Treinamentos',
      value: kpiData.totalTreinamentos,
      icon: GraduationCap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: 'Campanhas realizadas'
    },
    {
      title: 'Orientações',
      value: kpiData.totalOrientacoes,
      icon: MessageCircle,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      trend: 'Em campo'
    },
    {
      title: 'Conformidade EPI',
      value: `${kpiData.epiPercent.toFixed(1)}%`,
      icon: ShieldCheck,
      color: 'from-teal-500 to-green-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      trend: kpiData.epiPercent >= 90 ? 'Excelente' : kpiData.epiPercent >= 70 ? 'Atenção' : 'Crítico',
      trendIcon: kpiData.epiPercent >= 90 ? TrendingUp : kpiData.epiPercent >= 70 ? Minus : TrendingDown,
      trendColor: kpiData.epiPercent >= 90 ? 'text-green-600' : kpiData.epiPercent >= 70 ? 'text-yellow-600' : 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer card-hover"
          >
            <div className="p-4 md:p-6">
              {/* Cabeçalho do Card */}
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-[10px] md:text-xs text-gray-400 truncate max-w-[80px] text-right">
                  {periodLabel}
                </span>
              </div>
              
              {/* Título */}
              <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">
                {card.title}
              </h3>
              
              {/* Valor Principal */}
              <p className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {card.value}
              </p>
              
              {/* Trend / Informação adicional */}
              {card.trend && (
                <div className="flex items-center gap-1 flex-wrap">
                  {TrendIcon && <TrendIcon className={`w-3 h-3 md:w-4 md:h-4 ${card.trendColor || 'text-gray-500'}`} />}
                  <span className={`text-[10px] md:text-xs font-medium ${card.trendColor || 'text-gray-500'} truncate max-w-[120px]`}>
                    {card.trend}
                  </span>
                </div>
              )}
            </div>
            
            {/* Barra de progresso animada */}
            <div className="h-1 bg-gray-100 dark:bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((card.value / (kpiData.totalInspecoes || 1)) * 100, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full bg-gradient-to-r ${card.color}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default KPICards;