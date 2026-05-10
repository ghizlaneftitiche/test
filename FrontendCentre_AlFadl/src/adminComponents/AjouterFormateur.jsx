import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function AjouterFormateur() {
  const [formData, setFormData] = useState({
    nomComplet: "",
    emailPro: "",
    telephone: "",
    typeAffectation: "Branche",
    affectationId: "",
  });

  const [branches, setBranches] = useState([]);
  const [modules, setModules] = useState([]);
  const [alert, setAlert] = useState(null); // État unique pour les alertes { type, message }
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const resBranches = await axios.get(`${api}/api/admin/get-branches`, config);
        const resModules = await axios.get(`${api}/api/admin/get-modules`, config);
        setBranches(resBranches.data);
        setModules(resModules.data);
      } catch (err) {
        console.error("Erreur chargement listes", err);
        showAlert("error", "Session expirée. Veuillez vous reconnecter.");
      }
    };
    fetchData();
  }, [token]);

  // Fonction pour afficher l'alerte et la masquer après 5s
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "typeAffectation" ? { affectationId: "" } : {}),
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${api}/api/admin/create-formateur`, formData, config);
      
      showAlert("success", "Formateur créé avec succès !");
      
      setFormData({
        nomComplet: "",
        emailPro: "",
        telephone: "",
        typeAffectation: "Branche",
        affectationId: "",
      });
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen font-sans p-4 sm:p-6 md:p-10 ml-0 md:ml-64 transition-all duration-300 relative">
      
      {/* SYSTÈME D'ALERTE FLOTTANTE */}
      {alert && (
        <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-xl shadow-2xl border-l-4 transition-all animate-bounce-short ${
          alert.type === "success" ? "bg-green-50 border-green-500 text-green-800" : "bg-red-50 border-red-500 text-red-800"
        } max-w-sm w-full`}>
          <div className="flex-shrink-0">
            {alert.type === "success" ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            )}
          </div>
          <div className="ml-3 mr-8 text-sm font-bold">
            {alert.message}
          </div>
          <button onClick={() => setAlert(null)} className="ml-auto">
            <XMarkIcon className="h-5 w-5 opacity-50 hover:opacity-100" />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            to="/liste-formateurs"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Retour
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Ajouter un formateur
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Créer un nouveau compte formateur
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
              <div className="p-2 bg-blue-50 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Informations du formateur
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nom complet</label>
                  <input
                    type="text"
                    name="nomComplet"
                    value={formData.nomComplet}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email professionnel</label>
                  <input
                    type="email"
                    name="emailPro"
                    value={formData.emailPro}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email de connexion</label>
                  <input
                    type="text"
                    disabled
                    placeholder="prenom.nom@centre-alfadl.ma"
                    className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed italic"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Téléphone</label>
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Type d'affectation</label>
                  <select
                    name="typeAffectation"
                    value={formData.typeAffectation}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                    required
                  >
                    <option value="Branche">Branche</option>
                    <option value="Module">Module</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {formData.typeAffectation === "Branche" ? "Branche" : "Module"}
                  </label>
                  <select
                    name="affectationId"
                    value={formData.affectationId}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {formData.typeAffectation === "Branche"
                      ? branches.map((b) => <option key={b.id} value={b.id}>{b.intitule}</option>)
                      : modules.map((m) => <option key={m.id} value={m.id}>{m.intitule}</option>)
                    }
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
                >
                  Ajouter le formateur
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AjouterFormateur;