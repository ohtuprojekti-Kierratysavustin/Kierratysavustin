import React from 'react'
import CheckboxGroup from 'react-checkbox-group'
import { RecyclingMaterial } from '../types/objects'

type Props = {
  materials: any[],
  selectedMaterials: RecyclingMaterial[],
  setSelectedMaterials: React.Dispatch<React.SetStateAction<RecyclingMaterial[]>>
}
const MaterialsCheckboxGroup: React.FC<Props> = ({ materials, selectedMaterials, setSelectedMaterials }) => {

  return (
    <div>
      <CheckboxGroup name='materiaalit' value={selectedMaterials} onChange={setSelectedMaterials}>
        {(Checkbox: any) => (
          <>
            {materials.map(material => {
              return (
                <label className='checkboxcontainer' key={material.code}>
                  <Checkbox value={material} className='checkbox' /> {material.name}
                </label>
              )
            })}
          </>
        )}
      </CheckboxGroup>
    </div>
  )
}

export default MaterialsCheckboxGroup