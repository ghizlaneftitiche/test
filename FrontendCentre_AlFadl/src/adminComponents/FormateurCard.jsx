import { KeyIcon } from "@heroicons/react/20/solid";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import {
  ArrowLongDownIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

function FormateurCard({ formateur, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);

  let displayLabel = "Non assigné";

  if (formateur.role === "FormateurBranche" && formateur.formation) {
    displayLabel = formateur.formation.intitule;
  } else if (formateur.role === "FormateurModule" && formateur.module) {
    displayLabel = formateur.module.intitule;
  }

  // Fonction pour les icônes
  const getIconPath = (name) => {
    const label = name?.toLowerCase() || "";
    if (label.includes("informatique")) return "/Informatique.png";
    if (label.includes("balles")) return "/Eau.png";
    if (label.includes("électricit")) return "/Electricite.png";
    if (label.includes("cuisine")) return "/Cuisine.png";
    if (label.includes("couture")) return "/Couture.png";
    if (label.includes("féminin")) return "/RasageF.png";
    if (label.includes("islamique")) return "/InstructionsIslamique.jpg";
    if (label.includes("français"))  return "/french.avif";
    if (label.includes("arabe")) return "/arabe.jpg";
    if (label.includes("activités")) return "/activitesP.png";
    return "/generic.png";
  };

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div
        className={`h-2 ${formateur.role === "FormateurBranche" ? "bg-blue-500" : "bg-orange-500"}`}
      ></div>

      <div className="p-4 h-[17rem]">
        <div className="flex justify-start items-start mb-4">
          <div className="overflow-hidden flex items-center justify-center">
            <img
              src={getIconPath(displayLabel)}
              alt={displayLabel}
              className="w-12 h-12 object-contain rounded-3xl "
              onError={(e) => (e.target.src = "/RasageM.png")}
            />
          </div>
          <p className="text-xl font-bold text-gray-800 mt-2 ms-2">
            {formateur.nomComplet}
          </p>
          <button
            onClick={() => onDelete(formateur.id)}
            className="text-gray-300 hover:text-red-500 transition-colors p-1 justify-self-end ml-auto mt-1 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-3 mb-2">
          <div className="flex items-center text-gray-600 gap-3">
            <PhoneIcon className="h-4 w-4" />
            <span className="text-sm">{formateur.numTel}</span>
          </div>
          <div className="flex items-center text-gray-600 gap-3">
            <EnvelopeIcon className="h-4 w-4" />
            <span className="text-sm truncate">
              {formateur.email_personnel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
            <span className="text-sm truncate">{formateur.email_genere}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg py-2 flex items-center justify-between mb-2 border border-gray-100">
          <div className="flex items-center gap-3">
            <KeyIcon className="h-5 w-5 text-gray-500" />
            <span className="font-mono text-sm tracking-widest text-gray-700">
              {showPassword ? formateur.password_clair : "••••••••"}
            </span>
          </div>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-blue-600 cursor-pointer"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
          <BookOpenIcon className="h-5 w-5 text-gray-500" />
          <span
            className={`text-[10px] uppercase  px-2 py-1 rounded-4xl ${formateur.role === "FormateurBranche" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
          >
            {formateur.role === "FormateurBranche" ? "Branche" : "Module"}
          </span>
          <span className="text-xs text-gray-500 truncate">{displayLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default FormateurCard;
