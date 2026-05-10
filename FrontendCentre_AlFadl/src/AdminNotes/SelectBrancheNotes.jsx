import React from 'react'
 
function SelectBrancheNotes({branche,selectBranche,setSelectBranche}) {
      function handleChange(e) {
        setSelectBranche(e.target.value)
    }
       return (
        <div>
            <div className='my-10'>
                <h1 className='text-3xl font-bold'>Notes</h1>
                <p className='text-lg text-gray-500 my-3'>Consulter et gérer les notes des stagiaires</p>
            </div>
            <select
                onChange={handleChange}
                value={selectBranche}
                className='relative max-w-2xl  cursor-default rounded-xl border border-gray-300 bg-gray-100 py-2 pl-4 pr-40 text-left focus:outline-none '
            >
                <option value="" className='text-gray '>Sélectionner une branche</option>
 
                {branche.map(b => (
                    <option
                    key={b.id}
                    value={b.id}
                    className='text-gray '
                    >
                        {b.intitule}
                    </option>
                ))}
            </select>
        </div>
    )
}
export default SelectBrancheNotes
