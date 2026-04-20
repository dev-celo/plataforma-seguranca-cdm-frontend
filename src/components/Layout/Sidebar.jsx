import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Download, Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { path: '/reports/list', icon: FileText, label: 'Relatórios', color: 'from-green-500 to-emerald-500' },
    { path: '/reports/new', icon: PlusCircle, label: 'Novo Relatório', color: 'from-purple-500 to-pink-500' },
    { path: '/export', icon: Download, label: 'Exportar Dados', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <aside className="w-72 glass-card m-3 mr-0 rounded-2xl shadow-2xl">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">SafeTrack</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Segurança do Trabalho</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105` 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-105'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-xs font-semibold">Segurança em Dia</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-green-600">98% Conformidade</span>
          <span className="text-blue-600">+12% esta semana</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;