import axios from "axios";
import React, { useEffect, useState } from "react";

import ConfectionCouture from "/Couture.png";
import ConstructionBalles from "/Eau.png";
import CuisinePâtisserie from "/Cuisine.png";
import RasageMasculin from "/RasageM.png";
import RasageFeminin from "/RasageF.png";
import Informatique from "/Informatique.png";
import ÉlectricitéBâtiment from "/Electricite.png";
import { api } from "../api";
import Loading from "../Layout/Loading";
import GestionTableauStagiaires from "./GestionTableauStagiaires";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function GestionListesBranches() {
  const [listesBranches, setListesBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  const [selectedFormation, setSelectedFormation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(api + "/api/admin/formations", {
        headers: {
          Authorization: `Bearer ${token}`, // On envoie le jeton
          Accept: "application/json",
        },
      })
      .then((res) => {
        setListesBranches(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des branches :", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleScroll = (direction) => {
    if (direction === "right") {
      if (startIndex + itemsPerPage < listesBranches.length) {
        setStartIndex(startIndex + itemsPerPage);
      }
    } else {
      if (startIndex - itemsPerPage >= 0) {
        setStartIndex(startIndex - itemsPerPage);
      }
    }
  };

  const couleursActiveRing = {
    "Confection et couture": "ring-purple-800 border-purple-800",
    "Rasage masculin": "ring-blue-900 border-blue-900",
    "Rasage féminin": "ring-pink-500 border-pink-500",
    "Électricité du bâtiment": "ring-yellow-400 border-yellow-400",
    "Construction de balles": "ring-blue-700 border-blue-700",
    Informatique: "ring-green-700 border-green-700",
    "Cuisine et pâtisserie": "ring-orange-600 border-orange-600",
  };

  const couleursTextes = {
    "Confection et couture": "text-purple-800",
    "Rasage masculin": "text-blue-900",
    "Rasage féminin": "text-pink-500",
    "Électricité du bâtiment": "text-yellow-600",
    "Construction de balles": "text-blue-700",
    Informatique: "text-green-700",
    "Cuisine et pâtisserie": "text-orange-600",
  };

  const icons = {
    "Confection et couture": ConfectionCouture,
    "Rasage masculin": RasageMasculin,
    "Rasage féminin": RasageFeminin,
    "Électricité du bâtiment": ÉlectricitéBâtiment,
    "Construction de balles": ConstructionBalles,
    Informatique: Informatique,
    "Cuisine et pâtisserie": CuisinePâtisserie,
  };

  const couleursBorders = {
    "Confection et couture": "h-2 w-full bg-purple-800",
    "Rasage masculin": "h-2 w-full bg-blue-900",
    "Rasage féminin": "h-2 w-full bg-pink-500",
    "Électricité du bâtiment": "h-2 w-full bg-yellow-400",
    "Construction de balles": "h-2 w-full bg-blue-700",
    Informatique: "h-2 w-full bg-green-700",
    "Cuisine et pâtisserie": "h-2 w-full bg-orange-600",
  };

  // Fonction pour normaliser et trouver l'icone
  const getIcon = (formationName) => {
    if (!formationName) return null;
    if (icons[formationName]) return icons[formationName];
    const normalized = formationName.toLowerCase().trim();
    for (const [key, value] of Object.entries(icons)) {
      if (key.toLowerCase().trim() === normalized) {
        return value;
      }
    }
    return null;
  };

  // Fonction pour normaliser et trouver la couleur de border
  const getCouleurBorder = (formationName) => {
    if (!formationName) return "h-2 w-full bg-gray-400";
    if (couleursBorders[formationName]) return couleursBorders[formationName];
    const normalized = formationName.toLowerCase().trim();
    for (const [key, value] of Object.entries(couleursBorders)) {
      if (key.toLowerCase().trim() === normalized) {
        return value;
      }
    }
    return "h-2 w-full bg-gray-400";
  };

  // Fonction pour normaliser et trouver la couleur ring
  const getCouleurRing = (formationName) => {
    if (!formationName) return "ring-gray-400 border-gray-400";
    if (couleursActiveRing[formationName])
      return couleursActiveRing[formationName];
    const normalized = formationName.toLowerCase().trim();
    for (const [key, value] of Object.entries(couleursActiveRing)) {
      if (key.toLowerCase().trim() === normalized) {
        return value;
      }
    }
    return "ring-gray-400 border-gray-400";
  };

  // Fonction pour normaliser et trouver la couleur texte
  const getCouleurTexte = (formationName) => {
    if (!formationName) return "text-gray-800";
    if (couleursTextes[formationName]) return couleursTextes[formationName];
    const normalized = formationName.toLowerCase().trim();
    for (const [key, value] of Object.entries(couleursTextes)) {
      if (key.toLowerCase().trim() === normalized) {
        return value;
      }
    }
    return "text-gray-800";
  };

  return (
    <div className="min-h-screen ml-0 lg:ml-64 pt-24 lg:pt-10 transition-all duration-300 overflow-x-hidden">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 ml-8">
        Gestion des stagiaires
      </h1>

      {loading ? (
        <Loading />
      ) : (
        <div className="py-6">
          <div className="relative w-full flex items-center group">
            <button
              onClick={() => handleScroll("left")}
              className="absolute -left-2 md:left-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md hover:bg-gray-50 transition-all"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-nowrap gap-4 md:gap-8 mx-auto w-full px-10">
              {listesBranches
                .slice(startIndex, startIndex + itemsPerPage)
                .map((branche, index) => {
                  const icon = getIcon(branche.formation);
                  const couleurBorderTop = getCouleurBorder(branche.formation);
                  const activeClasses = getCouleurRing(branche.formation);
                  const texteColor = getCouleurTexte(branche.formation);
                  const isActive = selectedFormation === branche.formation_id;

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedFormation(branche.formation_id)}
                      className={`relative w-full lg:w-56 bg-white rounded-xl shadow-lg border transition-all 
                                                duration-300 cursor-pointer overflow-hidden
                                                ${
                                                  isActive
                                                    ? `ring-4 ring-opacity-40 scale-105 ${activeClasses}`
                                                    : "border-gray-100 hover:border-gray-300"
                                                }`}
                    >
                      <div className={couleurBorderTop}></div>

                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {icon && (
                            <img
                              src={icon}
                              alt={branche.formation}
                              className="w-10 h-10 object-contain"
                            />
                          )}
                          <h3
                            className={`text-sm font-bold ${isActive ? texteColor : "text-gray-800"}`}
                          >
                            {branche.formation}
                          </h3>
                        </div>

                        <p className="text-xs text-gray-400 flex justify-between font-bold">
                          <span
                            className={`text-sm ${isActive ? texteColor : "text-blue-500"}`}
                          >
                            {branche.nombreStagaires} inscrits
                          </span>
                        </p>
                      </div>

                      {isActive && (
                        <div className="absolute top-4 right-2">
                          <span className="flex h-3 w-3">
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${couleurBorderTop.split(" ").pop()}`}
                            ></span>
                            <span
                              className={`relative inline-flex rounded-full h-3 w-3 ${couleurBorderTop.split(" ").pop()}`}
                            ></span>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-2 md:right-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md hover:bg-gray-50 transition-all"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <GestionTableauStagiaires selectedFormation={selectedFormation} />
    </div>
  );
}

export default GestionListesBranches;
