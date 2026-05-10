import {
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import ModifierStagiaire from "./ModifierStagiaire";
import { api } from "../api";
import Loading from "../Layout/Loading";

function GestionTableauStagiaires({ selectedFormation }) {
  const [stagiaires, setStagiaires] = useState([]);
  const [filtre, setFiltre] = useState("valide");
  const [loading, setLoading] = useState(false); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stagiaireEdit, setStagiaireEdit] = useState(null);
  const [alert, setAlert] = useState(null);
  const timeoutAlerteRef = useRef(null);

  const showAlert = (data) => {
    if (timeoutAlerteRef.current) {
      clearTimeout(timeoutAlerteRef.current);
    }
    setAlert(data);
    timeoutAlerteRef.current = setTimeout(() => {
      setAlert(null);
      timeoutAlerteRef.current = null;
    }, 4000);
  };

  const chargerStagiaires = useCallback(() => {
    if (selectedFormation) {
      const token = localStorage.getItem("token");
      setLoading(true); 

      axios
        .get(`${api}/api/admin/stagiaires/${selectedFormation}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => setStagiaires(res.data))
        .catch((err) => console.error("Erreur chargement stagiaires:", err))
        .finally(() => setLoading(false)); 
    }
  }, [selectedFormation]);

  useEffect(() => {
    chargerStagiaires();
  }, [chargerStagiaires]);

  const stagiairesFiltres = stagiaires.filter((stagiaire) => {
    if (filtre === "valide") return stagiaire.statut === "validé";
    if (filtre === "attente") return stagiaire.statut === "en attente";
    return true;
  });

  function supprimerStagiaire(id) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      const token = localStorage.getItem("token");
      setLoading(true);

      axios
        .delete(`${api}/api/admin/stagiaires/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          chargerStagiaires(); 
          showAlert({
            type: "success",
            message: res.data.message || "Stagiaire supprimé avec succès",
          });
        })
        .catch((err) => {
          console.error("Erreur suppression:", err);
          showAlert({ type: "error", message: "Erreur lors de la suppression" });
          setLoading(false);
        });
    }
  }

  function ouvrirModal(stagiaire) {
    setStagiaireEdit(stagiaire);
    setIsModalOpen(true);
  }

  if (loading && stagiaires.length === 0) return <Loading />;

  return (
    <div className="w-[90%] mx-auto mt-6">
      
      {alert && (
        <div className="fixed left-1/2 top-6 z-[100] -translate-x-1/2 w-[90%] max-w-sm">
          <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 shadow-md backdrop-blur-md ${alert.type === "success" ? "bg-slate-900/95 text-emerald-400" : "bg-red-100 text-red-700"}`}>
            <p className="text-sm font-semibold">{alert.message}</p>
          </div>
        </div>
      )}

      {!selectedFormation ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-4">
          <UsersIcon className="w-12 h-12 text-blue-200 mb-4" />
          <p className="text-gray-600 font-semibold">Sélectionnez une branche pour gérer les stagiaires.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setFiltre("valide")}
              className={`flex-1 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition ${filtre === "valide" ? "border-green-500 text-green-600 bg-white" : "text-gray-500"}`}
            >
              Acceptés ({stagiaires.filter((s) => s.statut === "validé").length})
            </button>
            <button
              onClick={() => setFiltre("attente")}
              className={`flex-1 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition ${filtre === "attente" ? "border-orange-500 text-orange-600 bg-white" : "text-gray-500"}`}
            >
              En attente ({stagiaires.filter((s) => s.statut === "en attente").length})
            </button>
          </div>

          {stagiairesFiltres.length > 0 ? (
            <div className="w-full overflow-hidden">
              <table className="w-full table-fixed md:table-auto divide-y divide-gray-200">
                <thead className="bg-gray-50 text-[9px] md:text-[11px] font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-2 md:px-4 py-3 text-left w-1/3 md:w-auto">Stagiaire</th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left">Naissance</th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left">Lieu</th>
                    <th className="px-2 md:px-4 py-3 text-left">Téléphone</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left">Inscription</th>
                    <th className="px-2 md:px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {stagiairesFiltres.map((stagiaire) => (
                    <tr key={stagiaire.id} className="hover:bg-gray-50 transition">
                      <td className="px-2 md:px-4 py-4 text-xs md:text-sm font-bold text-gray-800 truncate">
                        {stagiaire.nom} {stagiaire.prenom}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4 text-sm text-gray-600">
                        {stagiaire.dateDeNaissance}
                      </td>
                      <td className="hidden xl:table-cell px-4 py-4 text-sm text-gray-500">
                        {stagiaire.lieuDeNaissance}
                      </td>
                      <td className="px-2 md:px-4 py-4 text-xs md:text-sm text-gray-700">
                        {stagiaire.numTel}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4 text-xs font-semibold text-emerald-600">
                        {stagiaire.dateInscription}
                      </td>
                      <td className="px-2 md:px-4 py-4">
                        <div className="flex justify-center space-x-1 md:space-x-2">
                          <button
                            className="p-1.5 text-blue-600 bg-blue-50 rounded-lg cursor-pointer"
                            onClick={() => ouvrirModal(stagiaire)}
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-red-600 bg-red-50 rounded-lg cursor-pointer"
                            onClick={() => supprimerStagiaire(stagiaire.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <InboxIcon className="w-12 h-12 mb-2 opacity-10" />
              <p className="text-sm font-semibold">Liste vide</p>
            </div>
          )}
        </div>
      )}

      <ModifierStagiaire
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stagiaire={stagiaireEdit}
        stagiaires={stagiaires}
        setStagiaires={setStagiaires}
      />
    </div>
  );
}

export default GestionTableauStagiaires;