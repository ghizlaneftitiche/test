import React, { useEffect, useState } from "react";
import { Check, FileText, Printer } from "lucide-react";
import axios from "axios";
import SelectBrancheNotes from "./SelectBrancheNotes";
import { api } from "../api";
import Loading from "../Layout/Loading";

function TableauNotes() {
  const [selectBranche, setSelectBranche] = useState("");
  const [branche, setBranche] = useState([]);
  const [listeStagiaires, setListeStagiaires] = useState([]);
  const [disciplines, setDisciplines] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // État pour le spinner

  const handleValider = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true); // Activer le spinner pendant la sauvegarde

    const data = listeStagiaires.map((stg) => ({
      stagiaire_id: stg.stagiaire_id,
      noteDiscipline:
        disciplines[stg.stagiaire_id] !== undefined
          ? Number(disciplines[stg.stagiaire_id])
          : Number(stg.noteDiscipline || 0),
    }));

    try {
      await axios.post(
        `${api}/api/notes-discipline`,
        { notes: data },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const res = await axios.get(
        `${api}/api/formation/${selectBranche}/stagiaires`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setListeStagiaires(res.data);
      setDisciplines({});
      setIsSaved(true);
      alert("Notes de discipline enregistrées !");
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false); // Désactiver le spinner
    }
  };

  // 1. Charger les formations initiales
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (loaded) return;

    setLoading(true);
    axios
      .get(`${api}/api/formation`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBranche(res.data);
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Erreur chargement formations :", err);
      })
      .finally(() => setLoading(false));
  }, [loaded]);

  // 2. Charger les stagiaires au changement de branche
  useEffect(() => {
    if (selectBranche) {
      const token = localStorage.getItem("token");
      setDisciplines({});
      setLoading(true); // Activer le spinner pour le chargement des stagiaires

      axios
        .get(`${api}/api/formation/${selectBranche}/stagiaires`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setListeStagiaires(res.data);
        })
        .catch((err) => {
          console.error("Erreur API stagiaires :", err);
        })
        .finally(() => setLoading(false));
    }
  }, [selectBranche]);

  const imprimerBulletinStagiaire = async (stagiaire_Id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${api}/api/releve/pdf/stagiaire/${stagiaire_Id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Erreur impression :", error);
      alert("Impossible de générer le PDF");
    }
  };

  const getModuleNote = (modules, nomModule) => {
    return (
      modules.find((m) => m.module_nom === nomModule)?.moyenneModule || "-"
    );
  };

  const imprimerTousLesBulletins = async (formation_Id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${api}/api/releve/pdf/formation/${formation_Id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Erreur impression groupée :", error);
      alert("Erreur lors de la génération du PDF groupé.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen ml-0 lg:ml-64 pt-24 lg:pt-10 transition-all duration-300 overflow-x-hidden">
      <SelectBrancheNotes
        selectBranche={selectBranche}
        setSelectBranche={setSelectBranche}
        branche={branche}
      />

      {selectBranche === "" ? (
        <div className="w-full flex flex-col items-center mt-40">
          <FileText className="w-12 h-12 text-gray-300" />
          <p className="text-gray-400 mt-3 text-lg">
            Veuillez sélectionner une branche
          </p>
        </div>
      ) : (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="overflow-x-auto rounded-xl border overflow-hidden shadow-xl">
              <table className="text-left w-full border-collapse">
                <thead>
                  <tr
                    className="text-sm font-medium text-gray-500"
                    style={{ backgroundColor: "rgb(235, 235, 238)" }}
                  >
                    <th className="p-4 border-b text-center">Stagiaire</th>
                    <th className="p-4 border-b text-center">Moy. Branche</th>
                    <th className="p-4 border-b text-center">Français</th>
                    <th className="p-4 border-b text-center">Arabe</th>
                    <th className="p-4 border-b text-center">Activités</th>
                    <th className="p-4 border-b text-center">Islamique</th>
                    <th className="p-4 border-b text-center">Stage (25%)</th>
                    <th className="p-4 border-b text-center">Discipline</th>
                    <th className="p-4 border-b text-center">Moy. Générale</th>
                    <th className="p-4 border-b text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="text-slate-700">
                  {listeStagiaires.length > 0 ? (
                    listeStagiaires.map((stg) => (
                      <tr
                        key={stg.stagiaire_id}
                        className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <td className="p-4 font-medium">{stg.stagiaire}</td>
                        <td className="p-4 text-center">{stg.moyenneBranche ?? 0}</td>
                        <td className="p-4 text-center">{getModuleNote(stg.moyennesParModule, "Français")}</td>
                        <td className="p-4 text-center">{getModuleNote(stg.moyennesParModule, "Arabe")}</td>
                        <td className="p-4 text-center">{getModuleNote(stg.moyennesParModule, "Activités Parallèles")}</td>
                        <td className="p-4 text-center">{getModuleNote(stg.moyennesParModule, "Instruction Islamique")}</td>
                        <td className="p-4 text-center">{stg.noteStage ?? "-"}</td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={disciplines[stg.stagiaire_id] ?? stg.noteDiscipline ?? ""}
                            onChange={(e) => setDisciplines(prev => ({ ...prev, [stg.stagiaire_id]: e.target.value }))}
                            className="w-16 p-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-cyan-600 outline-none"
                          />
                        </td>
                        <td className="p-4 text-center font-bold text-blue-600">{stg.moyenneGenerale || "0.00"}</td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => imprimerBulletinStagiaire(stg.stagiaire_id)}
                            disabled={!isSaved}
                            className="cursor-pointer p-2 hover:bg-blue-50 rounded-full transition-colors disabled:cursor-not-allowed"
                          >
                            <Printer size={19} className={isSaved ? "text-blue-500" : "text-indigo-200"} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center p-8 text-gray-400">Aucun stagiaire trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 flex justify-end gap-3 mt-3">
              <button
                onClick={handleValider}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-all cursor-pointer"
              >
                <Check size={18} />
                Valider
              </button>

              <button
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all text-white cursor-pointer ${isSaved ? "bg-indigo-600" : "bg-indigo-200"}`}
                disabled={!isSaved}
                onClick={() => imprimerTousLesBulletins(selectBranche)}
              >
                <Printer size={18} />
                Imprimer tout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableauNotes;