import { UsersIcon } from "@heroicons/react/16/solid";
import { AcademicCapIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import ListesBranches from "./ListesBranches";
import { api } from "../api";

function Dashboard() {
  const [statistiques, setStatistiques] = useState({ stagiaires: 0, formateurs: 0, formations: 0 });

  useEffect(() => {
  // 1. On récupère le token dans le localStorage
  const token = localStorage.getItem("token");

  // 2. On l'ajoute dans les headers de la requête axios
  axios.get(api + '/api/admin/statistiques', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setStatistiques(response.data);
    })
    .catch(err => {
      console.error("Erreur lors de la récupération des statistiques:", err);
    });
}, []);
  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-8 ml-0 md:ml-64 transition-all duration-300">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 font-normal mt-2">
        Vue d'ensemble du centre Al Fadl
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
        
        <div className="bg-white rounded-xl shadow-md w-full border border-gray-100 overflow-hidden relative">
          <div className="h-2 w-full bg-blue-400"></div>
          <div className="p-5 flex items-center">
            <div className="bg-blue-400 p-3 rounded-xl text-white mr-4">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-gray-500 text-sm md:text-base">
                Total Stagiaires
              </p>
              <p className="text-2xl font-bold text-gray-800">{statistiques.stagiaires}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md w-full border border-gray-100 overflow-hidden relative">
          <div className="h-2 w-full bg-orange-400"></div>
          <div className="p-5 flex items-center">
            <div className="bg-orange-400 p-3 rounded-xl text-white mr-4">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-gray-500 text-sm md:text-base">
                Total Formateurs
              </p>
              <p className="text-2xl font-bold text-gray-800">{statistiques.formateurs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md w-full border border-gray-100 overflow-hidden relative sm:col-span-2 lg:col-span-1">
          <div className="h-2 w-full bg-green-400"></div>
          <div className="p-5 flex items-center">
            <div className="bg-green-400 p-3 rounded-xl text-white mr-4">
              <BookOpenIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-gray-500 text-sm md:text-base">
                Total Branches
              </p>
              <p className="text-2xl font-bold text-gray-800">{statistiques.formations}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ListesBranches />
      </div>
    </div>
  );
}

export default Dashboard;