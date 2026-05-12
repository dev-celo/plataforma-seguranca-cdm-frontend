import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Download, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Calendar,        // ← NOVO ícone para Planejamento
  X,
  HelpCircle,
  MessageCircle
} from 'lucide-react';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { path: '/planejamento', icon: Calendar, label: 'Planejamento', color: 'from-indigo-500 to-purple-500' }, // ← NOVO ITEM
    { path: '/reports/list', icon: FileText, label: 'Relatórios', color: 'from-green-500 to-emerald-500' },
    { path: '/reports/new', icon: PlusCircle, label: 'Novo Relatório', color: 'from-purple-500 to-pink-500' },
    { path: '/export', icon: Download, label: 'Exportar Dados', color: 'from-orange-500 to-red-500' },
  ];

  const disabledItems = [
    { icon: HelpCircle, label: 'FAQ' },
    { icon: MessageCircle, label: 'Suporte' },
    { icon: AlertTriangle, label: 'Dúvidas' },
  ];

  // Versão Desktop - sempre visível em telas grandes
  const DesktopSidebar = () => (
    <aside className="hidden md:block w-72 glass-card m-3 mr-0 rounded-2xl shadow-2xl shrink-0 h-[calc(100vh-1.5rem)] sticky top-3">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">CDM Safe</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Segurança do Trabalho</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
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
      
      <div className="absolute bottom-6 left-6 right-6 p-4 bg-gradient-to-r from-cdm-50 to-purple-50 dark:from-cdm-900/20 dark:to-purple-900/20 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-xs font-semibold">Segurança em Dia</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-green-600">98% Conformidade</span>
          <span className="text-cdm-600">+12% esta semana</span>
        </div>
      </div>
    </aside>
  );

  // Versão Mobile - sidebar flutuante
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
          
          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 w-80 h-full bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">CDM Safe</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Segurança do Trabalho</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Menu Mobile */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}

              {/* Separador */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              
              <p className="text-xs text-gray-400 dark:text-gray-500 px-4 mb-2">Em breve</p>
              {disabledItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </nav>

            {/* Footer Mobile */}
            <div className="p-5 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold">Segurança em Dia</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">98% Conformidade</span>
                <span className="text-cdm-600">+12% esta semana</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;