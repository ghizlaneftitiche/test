import React, { useEffect, useState } from "react";
import axios from "axios";

// Import des images...
import ConfectionCouture from "/Couture.png";
import ConstructionBalles from "/Eau.png";
import CuisinePâtisserie from "/Cuisine.png";
import RasageMasculin from "/RasageM.png";
import RasageFeminin from "/RasageF.png";
import Informatique from "/Informatique.png";
import ÉlectricitéBâtiment from "/Electricite.png";
import { api } from "../api";
import Loading from "../Layout/Loading";

function ListesBranches() {
  const [listesBranches, setListesBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(api + "/api/admin/formations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setListesBranches(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const icons = {
    "Confection et couture": ConfectionCouture,
    "Rasage masculin": RasageMasculin,
    "Rasage féminin": RasageFeminin,
    "Électricité du bâtiment": ÉlectricitéBâtiment,
    "Construction de balles": ConstructionBalles,
    Informatique: Informatique,
    "Cuisine et pâtisserie": CuisinePâtisserie,
  };

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

  const couleursBorders = {
    "Confection et couture": "bg-purple-800",
    "Rasage masculin": "bg-blue-900",
    "Rasage féminin": "bg-pink-500",
    "Électricité du bâtiment": "bg-yellow-400",
    "Construction de balles": "bg-blue-700",
    Informatique: "bg-green-700",
    "Cuisine et pâtisserie": "bg-orange-600",
  };

  const getCouleur = (formationName) => {
    if (!formationName) return "bg-gray-400";
    if (couleursBorders[formationName]) return couleursBorders[formationName];
    const normalized = formationName.toLowerCase().trim();
    for (const [key, value] of Object.entries(couleursBorders)) {
      if (key.toLowerCase().trim() === normalized) {
        return value;
      }
    }
    return "bg-gray-400";
  };

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Branches</h1>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {listesBranches.map((branche, index) => {
            const icon = getIcon(branche.formation);
            const couleurBg = getCouleur(branche.formation);

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-100 w-full overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`h-2 w-full ${couleurBg}`}></div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    {icon && (
                      <img
                        src={icon}
                        alt={branche.formation}
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">
                      {branche.formation}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold uppercase">
                        Formateur
                      </span>
                      <span className="text-gray-700 font-bold">
                        {branche.formateur}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold uppercase">
                        Stagiaires
                      </span>
                      <span className="font-bold text-sm text-blue-500">
                        {branche.nombreStagaires}{" "}
                        <span className="text-gray-300">/ 20</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ListesBranches;
