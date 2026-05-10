import { UserPlusIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";

function AjouterStagiaires() {
  const [champs, setChamps] = useState({});
  const [ajouterStagiaires, setAjouterStagiaires] = useState([]);
  const [formations, setFormations] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const timeoutAlerteRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(api + "/api/admin/formationsSelect", config)
      .then((res) => setFormations(res.data))
      .catch((err) => console.error("Erreur chargement formations:", err));

    setCitiesLoading(true);
    axios
      .get(api + "/api/admin/villes", config)
      .then((res) => setCities(res.data))
      .catch((err) => console.error("Erreur chargement villes:", err))
      .finally(() => setCitiesLoading(false));

    return () => {
      if (timeoutAlerteRef.current) {
        clearTimeout(timeoutAlerteRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlert(null);
    setChamps({ ...champs, [name]: value });
  };

  const showAlert = (alertData) => {
    if (timeoutAlerteRef.current) {
      clearTimeout(timeoutAlerteRef.current);
    }
    setAlert(alertData);
    timeoutAlerteRef.current = setTimeout(() => {
      setAlert(null);
      timeoutAlerteRef.current = null;
    }, 8000);
  };

function handleSubmit(e) {
    e.preventDefault();

    const champsObligatoires = [
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "numTel", label: "Numéro de téléphone" },
      { key: "dateDeNaissance", label: "Date de naissance" },
      { key: "lieuDeNaissance", label: "Lieu de naissance" },
      { key: "formation_id", label: "Branche" },
    ];

    const champManquant = champsObligatoires.find(
      (field) =>
        !champs[field.key] || champs[field.key].toString().trim() === "",
    );

    if (champManquant) {
      showAlert({
        type: "error",
        message: `Le champ ${champManquant.label} est obligatoire.`,
      });
      return;
    }

    if (!/^(06|07)\d{8}$/.test(champs.numTel)) {
      showAlert({
        type: "error",
        message: "Numéro invalide (doit commencer par 06 ou 07 et contenir 10 chiffres)",
      });
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .post(api + "/api/admin/formations/stagiaires", champs, {
        headers: {
          Authorization: `Bearer ${token}`, 
          Accept: "application/json",
        }
      })
      .then((res) => {
        setAjouterStagiaires([...ajouterStagiaires, res.data]);
        setChamps({});

        showAlert({
          type: "success",
          message: "Le stagiaire a été ajouté avec succès.",
        });
      })
      .catch((err) => {
        const message =
          err.response?.data?.message || "Erreur lors de l'enregistrement.";

        showAlert({
          type: "error",
          message: message,
        });
      });
}

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto mt-10">
        {alert && (
          <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 transition-all duration-500 ease-in-out w-[90%] md:w-auto">
            <div
              className={`flex items-center gap-3 rounded-xl border px-5 py-3 shadow-md backdrop-blur-md ${
                alert.type === "success"
                  ? "bg-slate-900/95 border-emerald-500/20 text-emerald-400"
                  : "bg-red-100 border-rose-500/20 text-red-700"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${alert.type === "success" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}
              >
                {alert.type === "success" ? (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm font-semibold tracking-tight">
                {alert.message}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-6 mt-6 md:ml-4">
          <UserPlusIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Nouveau Stagiaire</h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={champs?.nom || ""}
              onChange={handleChange}
              placeholder="Entrer le nom "
              className="mt-1 block w-full rounded-xl border border-gray-400 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={champs?.prenom || ""}
              onChange={handleChange}
              placeholder="Entrer le prenom "
              className="mt-1 block w-full rounded-xl border border-gray-400 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <input
              type="text"
              name="numTel"
              value={champs?.numTel || ""}
              onChange={handleChange}
              placeholder="Entrer le numéro de téléphone"
              className="mt-1 block w-full rounded-xl border border-gray-400 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <input
              type="date"
              name="dateDeNaissance"
              value={champs?.dateDeNaissance || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-400 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700">
              Lieu de naissance
            </label>
            <input
              type="text"
              name="lieuDeNaissance"
              list="villes-list"
              value={champs?.lieuDeNaissance || ""}
              onChange={handleChange}
              placeholder={
                citiesLoading
                  ? "Chargement des villes..."
                  : "Rechercher une ville"
              }
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            />
            <datalist id="villes-list">
              {cities.map((ville) => (
                <option key={ville} value={ville} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date d'interruption
            </label>
            <input
              type="date"
              name="dateInterruption"
              value={champs?.dateInterruption || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-400 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Branche
            </label>
            <select
              name="formation_id"
              value={champs?.formation_id || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm"
            >
              <option value="">Sélectionner une branche</option>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.intitule}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="cursor-pointer w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-blue-700"
            >
              Inscrire le stagiaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AjouterStagiaires;
