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
        <div className="flex justify-between items-center h-16">
          {/* Menu Button (Mobile) */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo CDM com imagem */}
          <Link to="/dashboard" className="flex items-center space-x-3 group ml-2 md:ml-0">
            <img 
              src="/logo.png" 
              alt="CDM Construtora" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-lg group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-cdm-600 dark:text-cdm-400">
                CDM Construtora
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden md:block">
                Gestão de Segurança do Trabalho
              </p>
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