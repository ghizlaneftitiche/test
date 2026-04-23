import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../api";

import {
  UserPlusIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardDocumentIcon,
  MapPinIcon,
  Squares2X2Icon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

function SidBar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
     ${
       isActive
         ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
         : "text-gray-400 hover:bg-slate-800/50 hover:text-white"
     }`;

  // Fonction de Déconnexion
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
      localStorage.removeItem("userRole");
      localStorage.removeItem("user_name");
      navigate("/");
    }
  };

  return (
    <div className="w-72 sticky top-0 bg-[#111827] text-white flex flex-col border-r border-slate-800 shadow-2xl rounded-s-2xl rounded-br-2xl min-h-screen ms-1 mt-1">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-white p-1 rounded-lg">
          <img
            src="/centre Al Fadl.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-tight">
            Centre <span className="text-orange-500 ">AL Fadl</span>
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
            Administration
          </p>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        <NavLink to="/admin-dashboard" className={linkClass}>
          <Squares2X2Icon className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">Dashboard</span>
        </NavLink>

        <NavLink to="/inscription" className={linkClass}>
          <UserPlusIcon className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">
            Inscription
          </span>
        </NavLink>

        <NavLink to="/gestionStagiaires" className={linkClass}>
          <AcademicCapIcon className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">
            Gestion Stagiaires
          </span>
        </NavLink>

        <NavLink to="/liste-formateurs" className={linkClass}>
          <UserGroupIcon className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">
            Formateurs
          </span>
        </NavLink>

        <NavLink to="/notes" className={linkClass}>
          <ClipboardDocumentIcon className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">Notes</span>
        </NavLink>

        <NavLink to="/sorties" className={linkClass}>
          <MapPinIcon className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">Sorties</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={Logout}
          className="w-full flex items-center text-gray-500 gap-3 px-4 py-3  hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-300 font-bold text-sm cursor-pointer"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default SidBar;
