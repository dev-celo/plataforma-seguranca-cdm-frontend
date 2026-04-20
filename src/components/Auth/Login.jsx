import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Sparkles, Building2 } from 'lucide-react';
import Navbar from '../Layout/Header';
import Footer from '../Layout/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-cdm-50 via-white to-cdm-100 dark:from-gray-900 dark:via-cdm-900/20 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Glow effect com a cor CDM #6e0000 */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-2xl blur-xl opacity-75 animate-glow"></div>
          
          <div className="relative glass-card rounded-2xl w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-gradient-to-r from-cdm-500 to-cdm-700 rounded-2xl mb-4 shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-cdm-500 to-cdm-700 bg-clip-text text-transparent">
                  Portal de Segurança - CDM
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Plataforma de Gestão de Segurança do Trabalho</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-mail Corporativo
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cdm-500 transition-colors w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-modern pl-10 focus:ring-cdm-500"
                    placeholder="seu@cdmconstrutora.com.br"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cdm-500 transition-colors w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-modern pl-10 pr-10 focus:ring-cdm-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cdm-500 to-cdm-700 hover:from-cdm-600 hover:to-cdm-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Acessar Plataforma
                  </>
                )}
              </motion.button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-cdm-600 hover:text-cdm-700 font-semibold transition-colors">
                  Solicitar acesso
                </Link>
              </p>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Plataforma exclusiva para colaboradores da CDM Construtora
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;