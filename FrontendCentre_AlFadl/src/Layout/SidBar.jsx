import React, { useState } from "react";
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
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";

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

  const [isOpen, setIsOpen] = useState(false); // État pour ouvrir/fermer sur mobile

  const toggleSidebar = () => setIsOpen(!isOpen);

  

  return (
    <>
      {/* BOUTON HAMBURGER (Visible uniquement sur mobile) */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[rgb(23,28,38)] text-white p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <img src="fadl-02-150x150.png" alt="Logo" className="w-8" />
          <span className="font-bold text-sm">Centre AL Fadl</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 bg-slate-800 rounded-md">
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* OVERLAY (Fond sombre quand le menu est ouvert sur mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed top-0 left-0 h-screen bg-[rgb(23,28,38)] text-white flex flex-col font-bold z-50
        transition-transform duration-300 ease-in-out w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 
      `}
      >
        {/* Logo & Titre */}
        <div className="flex items-center gap-2 px-4 py-6 border-b border-slate-700">
          <img src="fadl-02-150x150.png" alt="Logo" className="w-12" />
          <p className="font-bold">
            Centre <span className="text-orange-500">AL Fadl</span>
          </p>
        </div>

        {/* Liens de navigation */}
        <ul className="mt-6 space-y-2 px-3 flex-grow overflow-y-auto">
          <li>
            <NavLink
              to="admin-dashboard"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <Squares2X2Icon className="w-5 h-5" />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="inscription"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <UserPlusIcon className="w-5 h-5" />
              Inscription
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/gestionStagiaires"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <AcademicCapIcon className="w-5 h-5" />
              Gestion Stagiaires
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/liste-formateurs"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <UserGroupIcon className="w-5 h-5" />
              Formateurs
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/notesAdmin"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
              Notes
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/sortiesAdmin"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <MapPinIcon className="w-5 h-5" />
              Sorties
            </NavLink>
          </li>
        </ul>

        {/* Bas de la Sidebar (Déconnexion) */}
        <div className="p-3 border-t border-slate-700">
          <button
            onClick={Logout}
            className="hover:text-red-400 cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-gray-400 "
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}

export default SidBar;
