import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, CalendarDays, Trash2, MapPin } from "lucide-react";
import Loading from "../../Layout/Loading";

const SortiesPage = () => {
  const [sorties, setSorties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ lieuSortie: "", dateSortie: "" });
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "http://localhost:8000/api/sorties";

  const fetchSorties = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setSorties(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSorties();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/store`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setIsModalOpen(false);
      setFormData({ lieuSortie: "", dateSortie: "" });
      fetchSorties();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'ajout de la sortie.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette sortie ?")) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(`${API_URL}/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        setSorties(sorties.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans">
      <div className="flex justify-between items-center mb-10 sm:text-left">
        <h1 className="text-4xl font-black text-gray-800 sm:text-4xl">
          Gestion des Sorties
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto cursor-pointer bg-[#47c18e] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg"
        >
          <Plus size={22} /> Nouvelle Sortie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {sorties.map((s) => (
          <div
            key={s.id}
            className="bg-white p-6 sm:p-7 rounded-[2.5rem] shadow-sm border-t-[6px] border-[#47c18e] flex flex-col gap-6 relative group"
          >
            <button
              onClick={() => handleDelete(s.id)}
              className="cursor-pointer absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={20} />
            </button>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-400 uppercase text-xs font-bold tracking-widest">
                <MapPin size={14} /> Lieu de visite
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {s.lieuSortie}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-4 rounded-2xl">
              <CalendarDays size={22} className="text-[#47c18e]" />
              <span className="font-bold text-gray-700">{s.dateSortie}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] ">
            <h2 className=" text-2xl font-bold mb-6 text-gray-800">
              Ajouter une sortie
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              <input
                type="text"
                placeholder="Lieu"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none "
                onChange={(e) =>
                  setFormData({ ...formData, lieuSortie: e.target.value })
                }
                required
              />
              <input
                type="date"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, dateSortie: e.target.value })
                }
                required
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex-1 py-4 bg-[#47c18e] text-white rounded-2xl font-bold shadow-md"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortiesPage;
