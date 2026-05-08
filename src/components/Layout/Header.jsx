import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  User,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  ChevronDown,
  Sun,
  Moon,
  HardHat,
  Building2
} from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const disabledLinks = [
    { name: 'FAQ', icon: HelpCircle, href: '#', disabled: true },
    { name: 'Dúvidas Segurança', icon: AlertTriangle, href: '#', disabled: true },
    { name: 'Contato Suporte', icon: MessageCircle, href: '#', disabled: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-cdm-200 dark:border-cdm-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Menu Button (Mobile) */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo CDM em SUPER DESTAQUE */}
          <Link to="/dashboard" className="flex flex-col items-center group ml-2 md:ml-0 relative">
            {/* Glow effect atrás da logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-cdm-500/20 to-cdm-700/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 -z-10 scale-110"></div>
            
            {/* Container com gradiente e brilho */}
            <div className="relative">
              {/* Anel de brilho externo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cdm-500 via-cdm-600 to-cdm-700 rounded-full opacity-75 group-hover:opacity-100 blur-md group-hover:blur-xl transition-all duration-500"></div>
              
              {/* Logo com borda gradiente */}
              <div className="relative bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-2xl p-1 shadow-2xl group-hover:shadow-cdm-500/50 transition-all duration-500">
                <img 
                  src="/logo.png" 
                  alt="CDM Construtora" 
                  className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-xl bg-white dark:bg-gray-900 transition-all duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* Indicador de destaque (pulse) */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
            
            {/* Texto com gradiente */}
            <div className="mt-2 text-center">
              <span className="text-[10px] md:text-xs font-bold bg-gradient-to-r from-cdm-500 to-cdm-700 bg-clip-text text-transparent">
                CDM Construtora
              </span>
              <span className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 block -mt-0.5">
                Gestão de Segurança
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Links Desabilitados */}
            {disabledLinks.map((link) => (
              <div key={link.name} className="relative group">
                <button
                  disabled
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 dark:text-gray-600 cursor-not-allowed"
                >
                  <link.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.name}</span>
                </button>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-cdm-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Em breve
                </span>
              </div>
            ))}

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cdm-50 dark:hover:bg-cdm-900/30 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.email?.split('@')[0] || 'Usuário'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-cdm-600 hover:bg-cdm-50 dark:hover:bg-cdm-900/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-cdm-600 hover:bg-cdm-50 dark:hover:bg-cdm-900/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;