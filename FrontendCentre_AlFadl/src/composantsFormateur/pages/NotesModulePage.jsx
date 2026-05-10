import React, { useState, useEffect } from "react";
import { Check, Loader2, FolderOpen } from "lucide-react";
import axios from "axios";
import { api } from "../../api";
import Loading from "../../Layout/Loading";

const NotesModulePage = () => {
  const [stagiaires, setStagiaires] = useState([]);
  const [branches, setBranches] = useState([]);
  const [saisies, setSaisies] = useState({});
  const [nomModule, setNomModule] = useState("Chargement...");
  const [selectedBranche, setSelectedBranche] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    setIsInitialLoading(true);
    Promise.all([
      axios
        .get(api + "/api/tableau-notes", config)
        .then((res) => setNomModule(res.data.nomModule))
        .catch((err) => console.error("Erreur module:", err)),
      axios
        .get(api + "/api/formations", config)
        .then((res) => setBranches(res.data))
        .catch((err) => console.error("Erreur branches:", err)),
    ]).finally(() => setIsInitialLoading(false));
  }, []);

  useEffect(() => {
    if (selectedBranche) {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      // Dans votre useEffect [selectedBranche]
      axios
        .get(`${api}/api/stagiaires-par-branche/${selectedBranche}`, config)
        .then((res) => {
          const fetchedStagiaires = res.data.stagiaires;
          setStagiaires(fetchedStagiaires);

          const initial = {};
          fetchedStagiaires.forEach((stg) => {
            ["CC1", "CC2", "CC3", "CC4"].forEach((code) => {
              initial[`${stg.id}-${code}`] = stg.notesExistantes[code] ?? "";
            });
          });
          setSaisies(initial);
        })
        .catch((err) => console.error("Erreur stagiaires:", err))
        .finally(() => setLoading(false));
    } else {
      setStagiaires([]);
    }
  }, [selectedBranche]);

  const handleInputChange = (stgId, code, val) => {
    const key = `${stgId}-${code}`;

    if (val === "") {
      setSaisies((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    const numVal = parseFloat(val);
    if (!isNaN(numVal) && numVal >= 0 && numVal <= 40) {
      setSaisies((prev) => ({ ...prev, [key]: val }));
    }
  };
  const handleValider = async () => {
    const data = Object.keys(saisies)
      .filter((key) => saisies[key] !== "")
      .map((key) => {
        const [id, code] = key.split("-");
        return {
          stagiaire_id: parseInt(id),
          type_code: code,
          note: saisies[key],
        };
      });

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        api + "/api/notes/bulk-store",
        { notes: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      alert("Notes enregistrées !");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  if (isInitialLoading) return <Loading />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Saisie des notes :{" "}
          <span className="text-blue-600 italic">{nomModule}</span>
        </h1>
        <div className="h-1.5 w-32 bg-blue-500 mt-3 rounded-full"></div>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <select
          value={selectedBranche}
          onChange={(e) => setSelectedBranche(e.target.value)}
          className="p-4 border-2 border-gray-200 rounded-2xl bg-white shadow-sm w-80 font-bold outline-none focus:border-blue-500 transition-all"
        >
          <option value=""> Choisir une branche...</option>
          {branches.map((br) => (
            <option key={br.id} value={br.id}>
              {br.intitule}
            </option>
          ))}
        </select>
        {loading && <Loader2 className="animate-spin text-blue-500" />}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th
                  className="p-6 text-xs font-black uppercase tracking-widest text-gray-400"
                  rowSpan="2"
                >
                  Stagiaire
                </th>
                <th
                  className="p-4 text-center bg-blue-50/30 text-blue-700 font-black text-sm uppercase"
                  colSpan="2"
                >
                  Semestre 1
                </th>
                <th
                  className="p-4 text-center bg-purple-50/30 text-purple-700 font-black text-sm uppercase"
                  colSpan="2"
                >
                  Semestre 2
                </th>
              </tr>
              <tr className="text-[11px] font-black uppercase text-center bg-white border-b border-gray-100">
                <th className="p-3 text-blue-500">CC1</th>
                <th className="p-3 text-pink-500">CC2</th>
                <th className="p-3 text-blue-500">CC3</th>
                <th className="p-3 text-pink-500">CC4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stagiaires.length > 0 ? (
                stagiaires.map((stg) => (
                  <tr
                    key={stg.id}
                    className="hover:bg-blue-50/20 transition-colors"
                  >
                    <td className="p-6 font-bold text-gray-700">
                      {stg.nomComplet}
                    </td>
                    {["CC1", "CC2", "CC3", "CC4"].map((code) => (
                      <td key={code} className="p-3 text-center">
                        <input
                          type="number"
                          step="0.25"
                          value={saisies[`${stg.id}-${code}`] || ""}
                          onChange={(e) =>
                            handleInputChange(stg.id, code, e.target.value)
                          }
                          className="w-20 h-12 border-2 border-gray-100 rounded-xl text-center font-black bg-gray-50/50 focus:bg-white focus:border-blue-400 outline-none transition-all"
                          placeholder="--"
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-24 text-center text-gray-300 font-bold italic"
                  >
                    <FolderOpen className="mx-auto mb-4 opacity-20" size={64} />
                    Sélectionnez une branche pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <button
          onClick={handleValider}
          disabled={!selectedBranche || stagiaires.length === 0}
          className="cursor-pointer flex items-center gap-3 px-16 py-5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg hover:shadow-emerald-200/50 disabled:opacity-30 transition-all active:scale-95"
        >
          <Check size={28} strokeWidth={3} /> VALIDER LES NOTES
        </button>
      </div>
    </div>
  );
};

export default NotesModulePage;
