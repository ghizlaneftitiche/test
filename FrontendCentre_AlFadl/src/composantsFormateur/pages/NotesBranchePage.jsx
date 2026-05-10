import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import { api } from "../../api";
import Loading from "../../Layout/Loading";

const NotesBranchePage = () => {
  const [stagiaires, setStagiaires] = useState([]);
  const [saisies, setSaisies] = useState({});
  const [nomBranche, setNomBranche] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    axios
      .get(api + "/api/tableau-notes", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        setStagiaires(res.data.stagiaires);
        setNomBranche(res.data.nomBranche);
        const initialSaisies = {};
        res.data.stagiaires.forEach((stg) => {
          if (stg.notesExistantes) {
            Object.keys(stg.notesExistantes).forEach((code) => {
              initialSaisies[`${stg.id}-${code.toUpperCase()}`] =
                stg.notesExistantes[code];
            });
          }
        });
        setSaisies(initialSaisies);
      })
      .catch((err) => {
        console.error("Erreur chargement:", err);
        if (err.response?.status === 401) {
          alert("Session expirée, veuillez vous reconnecter.");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleInputChange = (stgId, code, val) => {
    const key = `${stgId}-${code.toUpperCase()}`;
    if (val === "") {
      setSaisies((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    const numVal = parseFloat(val);
    if (numVal >= 0 && numVal <= 40) {
      setSaisies((prev) => ({ ...prev, [key]: val }));
    }
  };

  const handleValider = async () => {
    setIsSaving(true);

    const dataToSend = Object.keys(saisies)
      .filter((key) => saisies[key] !== "" && saisies[key] !== null)
      .map((key) => {
        const [stgId, typeCode] = key.split("-");
        return {
          stagiaire_id: stgId,
          type_code: typeCode.toUpperCase(),
          note: saisies[key],
        };
      });

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        api + "/api/notes/bulk-store",
        { notes: dataToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      alert("Toutes les notes sont enregistrées avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const colonnes = ["TH1", "PR1", "TH2", "PR2", "TH3", "PR3", "TH4", "PR4"];

  if (isLoading) return <Loading />;

  return (
    <div className="p-10 font-sans">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-gray-800">Notes</h1>
        <p className="text-gray-500 mt-2 font-medium">
          Branche :{" "}
          <span className="font-bold text-gray-900">{nomBranche}</span>
        </p>
        <div className="flex gap-8 mt-4 justify-end ">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            <span className="text-sm font-bold text-gray-600">
              TH : Théorique
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="text-sm font-bold text-gray-600">
              PR : Pratique
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-600 font-bold">
                <th className="p-6" rowSpan="2">
                  Stagiaire
                </th>
                <th
                  className="p-4 text-center border-x border-gray-100 bg-blue-50/20"
                  colSpan="4"
                >
                  Semestre 1
                </th>
                <th
                  className="p-4 text-center border-x border-gray-100 bg-orange-50/20"
                  colSpan="4"
                >
                  Semestre 2
                </th>
                <th className="p-6 text-center" rowSpan="2">
                  Stage
                </th>
              </tr>
              <tr className="text-[11px] font-black uppercase text-center bg-white border-b border-gray-100">
                {colonnes.map((code) => (
                  <th
                    key={code}
                    className={`p-2 ${code.includes("TH") ? "text-blue-600" : "text-orange-500"}`}
                  >
                    {code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stagiaires.map((stg) => (
                <tr key={stg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-bold text-gray-700 uppercase text-sm">
                    {stg.nomComplet}
                  </td>
                  {colonnes.map((code) => (
                    <td key={code} className="p-2 text-center">
                      <input
                        type="number"
                        step="0.25"
                        value={saisies[`${stg.id}-${code.toUpperCase()}`] || ""}
                        className="w-14 h-10 border border-gray-200 rounded-xl text-center font-bold focus:border-[#f97316] outline-none shadow-sm"
                        onChange={(e) =>
                          handleInputChange(stg.id, code, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  <td className="p-6 text-center">
                    <input
                      type="number"
                      step="0.25"
                      value={saisies[`${stg.id}-STAGE`] || ""}
                      className="w-16 h-10 border-2 border-orange-100 rounded-xl text-center font-bold focus:border-[#f97316] outline-none bg-orange-50/10"
                      onChange={(e) =>
                        handleInputChange(stg.id, "STAGE", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 flex justify-end ">
        <button
          onClick={handleValider}
          disabled={isSaving}
          className={`${isSaving ? " bg-gray-400 cursor-pointer" : "cursor-pointer bg-[#47c18e]"} text-white px-12 py-3.5 rounded-2xl font-black shadow-lg flex items-center gap-2 hover:scale-105 transition-all`}
        >
          {isSaving ? (
            "Enregistrement..."
          ) : (
            <>
              <Check size={24} /> Valider l'enregistrement
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotesBranchePage;
