import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FormateurCard from "./FormateurCard";
import { api } from "../api";
import axios from "axios";
import Loading from "../Layout/Loading";

function ListeFormateurs() {
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = api + "/api/admin/get-formateurs";

  useEffect(() => {
    fetchFormateurs();
  }, []);

  const fetchFormateurs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setFormateurs(response.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération:", err);
      setError(
        "Impossible de charger les formateurs. Vérifiez votre connexion.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Voulez-vous vraiment supprimer ${formateurs.find((f) => f.id === id)?.nomComplet} ?`,
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${api}/api/admin/supprimer-formateur/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormateurs(formateurs.filter((f) => f.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-8 ml-0 md:ml-64 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Gestion des Formateurs
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Consultez et gérez les accès de l'équipe pédagogique du Centre Al
              Fadl
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Link
              to="/ajouter-formateur"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-blue-200 w-full sm:w-auto text-center"
            >
              <span className="mr-2">+</span> Ajouter un formateur
            </Link>
          </div>
        </div>

        {loading && <Loading />}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="text-red-700 font-medium text-center sm:text-left">
                {error}
              </p>
              <button
                onClick={fetchFormateurs}
                className="sm:ml-auto text-red-700 underline text-sm font-bold"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {formateurs.map((f) => (
              <FormateurCard key={f.id} formateur={f} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {!loading && !error && formateurs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 mx-4">
            <p className="text-gray-400 text-lg italic">
              Aucun formateur enregistré pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListeFormateurs;
