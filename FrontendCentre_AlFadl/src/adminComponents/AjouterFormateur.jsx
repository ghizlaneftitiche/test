import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const resBranches = await axios.get(
          `${api}/api/admin/get-branches`,
          config,
        );
        const resModules = await axios.get(
          `${api}/api/admin/get-modules`,
          config,
        );
        setBranches(resBranches.data);
        setModules(resModules.data);
      } catch (err) {
        console.error("Erreur chargement listes", err);
        setError("Session expirée. Veuillez vous reconnecter.");
      }
    };
    fetchData();
  }, [token]);

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
    setError("");
    setSuccess("");

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        `${api}/api/admin/create-formateur`,
        formData,
        config,
      );
      setSuccess(`Formateur créé avec succès !`);
      setFormData({
        nomComplet: "",
        emailPro: "",
        telephone: "",
        typeAffectation: "Branche",
        affectationId: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen font-sans p-10">
        <div className="mb-8">
          <Link
            to="/liste-formateurs"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Retour
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Ajouter un formateur
          </h1>
          <p className="text-gray-500 mt-1">
            Créer un nouveau compte formateur
          </p>
        </div>

        <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
              <div className="p-2 bg-blue-50 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Informations du formateur
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Nom complet
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nomComplet"
                      value={formData.nomComplet}
                      onChange={handleChange}
                      placeholder="Nom complet"
                      className="w-full pl-3 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    name="emailPro"
                    value={formData.emailPro}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email de connexion
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="prenom.nom@alfadl.ma"
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed italic"
                  />
                  <p className="text-[10px] text-gray-400">
                    Généré automatiquement par le système
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="06XXXXXXXX"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Type d'affectation
                  </label>
                  <select
                    name="typeAffectation"
                    value={formData.typeAffectation}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="Branche">Branche</option>
                    <option value="Module">Module</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {formData.typeAffectation === "Branche"
                      ? "Branche"
                      : "Module"}
                  </label>
                  <select
                    name="affectationId"
                    value={formData.affectationId}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">
                      Sélectionner{" "}
                      {formData.typeAffectation === "Branche"
                        ? "une branche"
                        : "un module"}
                    </option>
                    {formData.typeAffectation === "Branche"
                      ? branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.intitule}
                          </option>
                        ))
                      : modules.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.intitule}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-[#4f81f1] hover:bg-[#3d6edb] text-white py-3.5 rounded-xl font-bold shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  Ajouter le formateur
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }
  
  export default AjouterFormateur;
