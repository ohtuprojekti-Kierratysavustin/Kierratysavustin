import React from 'react'
import { useStore } from '../store'
import CheckboxGroup from 'react-checkbox-group'

type Props = {
  materials: any[]
}
const MaterialsCheckboxGroup: React.FC<Props> = ({ materials }) => {
  const { selectedMaterials, setSelectedMaterials } = useStore()

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