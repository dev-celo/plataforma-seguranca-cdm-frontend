import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

import { motion, AnimatePresence } from "framer-motion";

import {
  Menu,
  LogOut,
  User,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const { darkMode, setDarkMode } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // ============================================
  // LINKS FUTUROS
  // ============================================

  const disabledLinks = [
    {
      name: "FAQ",
      icon: HelpCircle,
    },

    {
      name: "Segurança",
      icon: AlertTriangle,
    },

    {
      name: "Suporte",
      icon: MessageCircle,
    },
  ];

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        bg-white/82
        backdrop-blur-2xl
        border-b
        border-slate-200/70
        shadow-[0_4px_30px_rgba(15,23,42,0.04)]
      "
    >
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="relative flex items-center justify-between h-[82px] md:h-[96px]">
          {/* ============================================ */}
          {/* LEFT */}
          {/* ============================================ */}

          <div className="flex items-center gap-4">
            {/* MOBILE MENU */}
            <button
              onClick={onMenuClick}
              className="
                md:hidden
                p-2.5
                rounded-xl
                bg-slate-100
                hover:bg-slate-200
                transition-all
              "
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>

            {/* ============================================ */}
            {/* BRAND */}
            {/* ============================================ */}

            <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                md:static
                md:translate-x-0
                flex
                items-center
                justify-center
              "
            >
              <Link
                to="/dashboard"
                className="
                  flex
                  items-center
                  justify-center
                  shrink-0
                  group
                "
              >
                <img
                  src="/logo.png"
                  alt="CDM Construtora"
                  className="
                    w-[88px]
                    md:w-[120px]
                    h-auto
                    object-contain
                    transition-all
                    duration-300
                    group-hover:scale-[1.02]
                    select-none
                  "
                  draggable={false}
                />
              </Link>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT - DESKTOP */}
          {/* ============================================ */}

          <div className="hidden md:flex items-center gap-2">
            {/* LINKS DISABLED */}

            {disabledLinks.map((link) => (
              <div key={link.name} className="relative group">
                <button
                  disabled
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-xl
                    text-slate-400
                    cursor-not-allowed
                    transition-all
                  "
                >
                  <link.icon className="w-4 h-4" />

                  <span className="text-sm font-medium">{link.name}</span>
                </button>

                {/* TOOLTIP */}

                <div
                  className="
                    absolute
                    -top-10
                    left-1/2
                    -translate-x-1/2
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    pointer-events-none
                  "
                >
                  <div
                    className="
                      px-3
                      py-1.5
                      rounded-lg
                      bg-slate-900
                      text-white
                      text-xs
                      whitespace-nowrap
                      shadow-xl
                    "
                  >
                    Em breve
                  </div>
                </div>
              </div>
            ))}

            {/* DIVIDER */}

            <div className="w-px h-7 bg-slate-200 mx-3" />

            {/* THEME */}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="
                w-11
                h-11
                rounded-2xl
                bg-slate-100
                hover:bg-slate-200
                flex
                items-center
                justify-center
                transition-all
                duration-300
              "
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-slate-700" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* USER */}

            <div className="relative ml-1">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="
                  flex
                  items-center
                  gap-3
                  pl-3
                  pr-4
                  py-2.5
                  rounded-2xl
                  hover:bg-slate-100
                  transition-all
                "
              >
                {/* AVATAR */}

                <div
                  className="
                    w-10
                    h-10
                    rounded-2xl
                    bg-gradient-to-br
                    from-slate-900
                    to-slate-700
                    flex
                    items-center
                    justify-center
                    shadow-lg
                  "
                >
                  <User className="w-4 h-4 text-white" />
                </div>

                {/* USER INFO */}

                <div className="text-left">
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-800
                      leading-none
                    "
                  >
                    {user?.email?.split("@")[0] || "Usuário"}
                  </p>

                  <span
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Administrador
                  </span>
                </div>

                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* ============================================ */}
              {/* DROPDOWN */}
              {/* ============================================ */}

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className="
                      absolute
                      right-0
                      mt-3
                      w-56
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white/95
                      backdrop-blur-xl
                      shadow-[0_20px_60px_rgba(15,23,42,0.12)]
                      overflow-hidden
                    "
                  >
                    <div className="p-3">
                      <button
                        onClick={handleLogout}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-sm
                          font-medium
                          text-red-600
                          hover:bg-red-50
                          transition-all
                        "
                      >
                        <LogOut className="w-4 h-4" />
                        Sair da plataforma
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ============================================ */}
          {/* MOBILE ACTIONS */}
          {/* ============================================ */}

          <div className="flex items-center gap-2 md:hidden">
            {/* THEME */}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="
                w-10
                h-10
                rounded-xl
                bg-slate-100
                flex
                items-center
                justify-center
              "
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-slate-700" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* USER */}

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                "
              >
                <User className="w-4 h-4 text-slate-700" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    className="
                      absolute
                      right-0
                      mt-3
                      w-44
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-xl
                      overflow-hidden
                    "
                  >
                    <button
                      onClick={handleLogout}
                      className="
                        w-full
                        flex
                        items-center
                        gap-2
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-red-600
                        hover:bg-red-50
                        transition-all
                      "
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
