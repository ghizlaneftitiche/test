import React, { useEffect, useState } from 'react'
import SortieCard from './SortieCard'
import axios from 'axios'
import SelectBranche from './SelectBranche'
import { MapPin, Inbox } from 'lucide-react'
import { api } from '../api'
import Loading from '../Layout/Loading'

function ListeSorties() {
  const [listeSorties, setListeSorties] = useState([])
  const [selectBranche, setSelectBranche] = useState('')
  const [branche, setBranche] = useState([])
  const [loading, setLoading] = useState(false)

  // Charger les formations au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token"); 
    setLoading(true)

    axios.get(api + '/api/formation', {
        headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json"
        }
    })
      .then(res => setBranche(res.data))
      .catch(err => console.log("Erreur formations:", err))
      .finally(() => setLoading(false));
  }, []);

  // Charger les sorties dès qu'une branche est sélectionnée
  useEffect(() => {
    if (selectBranche) {
      const token = localStorage.getItem("token");
      setLoading(true);

      axios.get(`${api}/api/formation/sorties/${selectBranche}`, {
          headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
          }
      })
        .then(res => setListeSorties(res.data))
        .catch(err => console.log("Erreur sorties:", err))
        .finally(() => setLoading(false));
    } else {
      setListeSorties([]);
    }
  }, [selectBranche]);

  // Affichage du spinner pendant le chargement
  if (loading) return <Loading />;

  return (
    
    <div className='min-h-screen  sm:p-6 md:p-8 ml-0 lg:ml-64 pt-10 lg:pt-8 transition-all duration-300'>
      
      <div className="max-w-6xl mx-auto">
        <SelectBranche 
          selectBranche={selectBranche}
          setSelectBranche={setSelectBranche}
          branche={branche}
        />

        {selectBranche === '' ? (
          <div className='flex flex-col items-center justify-center mt-20 text-center'>
            <MapPin className="w-12 h-12 text-blue-500 opacity-20 mb-4" />
            <p className='text-gray-400 text-lg'>Veuillez sélectionner une branche</p>
          </div>
        ) : listeSorties.length === 0 ? (
          <p className='text-gray-500 text-center text-lg mt-20'>Aucune sortie pédagogique pour cette branche</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
            {listeSorties.map(s => <SortieCard key={s.id} sortie={s} />)}
          </div>
        )}
      </div>
    </div>
  )

}

export default ListeSorties