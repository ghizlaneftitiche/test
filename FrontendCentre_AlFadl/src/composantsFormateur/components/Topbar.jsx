import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, FileText, MapPin } from 'lucide-react';
import { api } from '../../api';
import axios from 'axios';

const Topbar = ({ role, userName }) => {
  const navigate = useNavigate();

  const Logout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${api}/api/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Erreur lors de la déconnexion API:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_name");
      navigate("/");
    }
  };

  return (
    <div className="w-full bg-[#1e1e2d] text-white p-3 sm:p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-1 flex items-center justify-center flex-shrink-0">
          <img src="fadl-02-150x150.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="leading-tight">
          <h1 className="text-sm sm:text-lg font-bold uppercase whitespace-nowrap">
            Centre <span className="text-[#f97316]">Al Fadl</span>
          </h1>
          <p className="hidden lg:block text-[10px] sm:text-xs text-gray-300 font-medium truncate max-w-[100px] sm:max-w-none">
            {userName || "Chargement..."}
          </p>
        </div>
      </div>

      <nav className="flex gap-1 sm:gap-4">
        {(role === 'FormateurBranche' || role === 'FormateurModule') && (
          <NavLink to="/notes" className={({ isActive }) => `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-[#f97316] text-white' : 'text-gray-400 hover:text-white'}`}>
            <FileText size={18} /> 
            <span className="hidden sm:inline font-bold">Notes</span>
          </NavLink>
        )}
        
        {role === 'FormateurBranche' && (
          <NavLink to="/sorties" className={({ isActive }) => `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-[#f97316] text-white' : 'text-gray-400 hover:text-white'}`}>
            <MapPin size={18} /> 
            <span className="hidden sm:inline font-bold">Sorties</span>
          </NavLink>
        )}
      </nav>

      <button onClick={Logout} className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors ml-2">
        <LogOut size={20} />
        <span className="hidden md:inline text-sm font-bold">Déconnexion</span>
      </button>
    </div>
  );
};

export default Topbar;