import React from 'react'
import { Calendar, User, MapPin } from "lucide-react";

function SortieCard({ sortie }) {
    return (
        <div className="flex justify-center mt-5">
            <div className="bg-white rounded-xl shadow-md w-[360px] overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-600"></div>
                <div className="p-5">
                    <div className="flex items-center">
                        <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                        <h3 className="text-xl font-bold text-gray-800">
                            {sortie.lieuSortie}
                        </h3>
                    </div>
                    <div className="flex items-center mt-4">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <p className="text-gray-600">
                            {sortie.dateSortie}
                        </p>
                    </div>
                    <div className="flex items-center mt-4">
                        <User className="w-5 h-5 text-gray-500 mr-2" />
                        <p className="text-gray-600">
                            {sortie.formateur?.nomComplet || "Non défini"}
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default SortieCard