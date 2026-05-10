import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "../api";

function ModifierStagiaire({
  open,
  onClose,
  stagiaire,
  stagiaires,
  setStagiaires,
}) {
  const [champs, setChamps] = useState({});
  const [formations, setFormations] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const timeoutAlerteRef = useRef(null);
  useEffect(() => {
    // 1. Récupérer le token
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    // Appel Formations
    axios
      .get(`${api}/api/admin/formationsSelect`, config)
      .then((res) => setFormations(res.data))
      .catch((err) => console.error("Erreur formations:", err));

    // Appel Villes
    setCitiesLoading(true);
    axios
      .get(`${api}/api/admin/villes`, config)
      .then((res) => setCities(res.data))
      .catch((err) => console.error("Erreur villes:", err))
      .finally(() => setCitiesLoading(false));

    return () => {
      if (timeoutAlerteRef.current) clearTimeout(timeoutAlerteRef.current);
    };
  }, []);

  useEffect(() => {
    if (stagiaire) {
      setChamps({
        ...stagiaire,
        formation_id: stagiaire.formation_id || stagiaire.formation?.id || "",
      });
    }
  }, [stagiaire]);

  const showAlert = (alertData) => {
    if (timeoutAlerteRef.current) clearTimeout(timeoutAlerteRef.current);
    setAlert(alertData);
    timeoutAlerteRef.current = setTimeout(() => {
      setAlert(null);
    }, 8000);
  };

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChamps({ ...champs, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    axios
      .put(`${api}/api/admin/stagiaires/${stagiaire.id}`, champs, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        setStagiaires(
          stagiaires.map((s) =>
            s.id === stagiaire.id ? { ...s, ...res.data } : s,
          ),
        );

        showAlert({
          type: "success",
          message: "Stagiaire modifié avec succès.",
        });

        setTimeout(() => {
          onClose();
        }, 1000);
      })
      .catch((err) => {
        console.error("Erreur Backend:", err.response?.data);
        showAlert({
          type: "error",
          message:
            err.response?.data?.message || "Erreur lors de la modification.",
        });
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto py-10">
      {alert && (
        <div className="fixed left-1/2 top-6 z-[110] -translate-x-1/2 transition-all duration-500 w-[90%] md:w-auto">
          <div
            className={`flex items-center justify-center gap-3 rounded-xl border px-5 py-3 shadow-xl backdrop-blur-md ${
              alert.type === "success"
                ? "bg-slate-900/95 border-emerald-500/20 text-emerald-400"
                : "bg-red-100 border-rose-500/20 text-red-700"
            }`}
          >
            <p className="text-sm font-semibold text-center">{alert.message}</p>
          </div>
        </div>
      )}

      <div className="bg-[#F8F9FA] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-6 md:p-10 relative animate-in fade-in zoom-in duration-200 my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 md:top-6 md:right-6 text-gray-400 hover:text-gray-600 transition"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 md:ml-1">
          Modifier le stagiaire
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 md:gap-y-5"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Nom</label>
            <input
              name="nom"
              value={champs.nom || ""}
              onChange={handleChange}
              placeholder="Nom"
              className="p-3 md:p-3.5 rounded-2xl border-2 border-blue-500 bg-white outline-none font-medium text-sm md:text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Prénom
            </label>
            <input
              name="prenom"
              value={champs.prenom || ""}
              onChange={handleChange}
              placeholder="Prénom"
              className="p-3 md:p-3.5 rounded-2xl border border-gray-200 bg-[#F1F3F5] outline-none font-medium text-sm md:text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Téléphone
            </label>
            <input
              type="text"
              name="numTel"
              value={champs.numTel || ""}
              onChange={handleChange}
              placeholder="06XXXXXXXX"
              className="p-3 md:p-3.5 rounded-2xl border border-gray-200 bg-[#F1F3F5] outline-none font-medium text-sm md:text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Date de naissance
            </label>
            <input
              type="date"
              name="dateDeNaissance"
              value={champs.dateDeNaissance || ""}
              onChange={handleChange}
              className="p-3 md:p-3.5 rounded-2xl border border-gray-200 bg-[#F1F3F5] outline-none font-medium text-sm md:text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Lieu de naissance
            </label>
            <input
              type="text"
              name="lieuDeNaissance"
              list="villes-list-mod"
              value={champs.lieuDeNaissance || ""}
              onChange={handleChange}
              placeholder={citiesLoading ? "Chargement..." : "Ville"}
              className="p-3 md:p-3.5 rounded-2xl border border-gray-200 bg-[#F1F3F5] outline-none font-medium text-sm md:text-base"
              required
            />
            <datalist id="villes-list-mod">
              {cities.map((ville) => (
                <option key={ville} value={ville} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Date d'interruption
            </label>
            <input
              type="date"
              name="dateInterruption"
              value={champs.dateInterruption || ""}
              onChange={handleChange}
              className="p-3 md:p-3.5 rounded-2xl border border-gray-200 bg-[#F1F3F5] outline-none font-medium text-sm md:text-base text-gray-500"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Branche
            </label>
            <div className="relative">
              <select
                name="formation_id"
                value={champs.formation_id || ""}
                onChange={handleChange}
                className="w-full p-3 md:p-3.5 rounded-2xl border border-gray-200 bg-[#F1F3F5] outline-none appearance-none font-medium text-sm md:text-base"
                required
              >
                <option value="" disabled>
                  Sélectionner une branche
                </option>
                {formations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.intitule}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col-reverse md:flex-row md:justify-end gap-3 md:gap-4 mt-6 md:mt-8">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-auto px-10 py-3 bg-white border border-gray-300 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition active:scale-95"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition disabled:opacity-50 active:scale-95"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifierStagiaire;
