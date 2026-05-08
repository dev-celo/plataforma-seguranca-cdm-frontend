import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Heart,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/cdm.construtora/',
      color: 'hover:text-pink-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://br.linkedin.com/company/construtora-cdm',
      color: 'hover:text-blue-500'
    }
  ];

  const disabledLinks = [
    { name: 'FAQ', href: '#', disabled: true },
    { name: 'Dúvidas de Segurança', href: '#', disabled: true },
    { name: 'Política de Privacidade', href: '#', disabled: true },
    { name: 'Termos de Uso', href: '#', disabled: true },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Coluna 1 - Logo e Descrição */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Logo da CDM */}
              <img 
                src="/logo.png" 
                alt="CDM Construtora" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div>
                <h2 className="text-lg md:text-xl font-bold text-cdm-600 dark:text-cdm-400">
                  CDM Construtora
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Segurança do Trabalho</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Plataforma integrada de gestão de segurança do trabalho, desenvolvida para garantir a integridade e bem-estar de todos os colaboradores da CDM Construtora.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all ${social.color}`}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-cdm-600 dark:hover:text-cdm-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/reports/list" className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-cdm-600 dark:hover:text-cdm-400 transition-colors">
                  Relatórios
                </Link>
              </li>
              <li>
                <Link to="/reports/new" className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-cdm-600 dark:hover:text-cdm-400 transition-colors">
                  Novo Relatório
                </Link>
              </li>
              <li>
                <Link to="/export" className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-cdm-600 dark:hover:text-cdm-400 transition-colors">
                  Exportar Dados
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Suporte (Desabilitado) */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">Suporte</h3>
            <ul className="space-y-2">
              {disabledLinks.map((link) => (
                <li key={link.name}>
                  <span className="text-xs md:text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed flex items-center gap-2">
                    {link.name}
                    <span className="text-[10px] md:text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">Em breve</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-cdm-500 shrink-0" />
                <span>CDM Construtora<br />Sede Administrativa</span>
              </li>
              <li className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-cdm-500 shrink-0" />
                <span className="break-all">seguranca@cdmconstrutora.com.br</span>
              </li>
              <li className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-cdm-500 shrink-0" />
                <span>(11) 4000-0000</span>
              </li>
              <li className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 text-cdm-500 shrink-0" />
                <span>Segunda a Sexta: 8h às 18h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar Responsivo */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-center md:text-left">
            <p className="text-[11px] md:text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} CDM Construtora. Todos os direitos reservados.
            </p>
            <p className="text-[11px] md:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              Desenvolvido com <Heart className="w-3 h-3 text-red-500" /> para segurança dos colaboradores
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;