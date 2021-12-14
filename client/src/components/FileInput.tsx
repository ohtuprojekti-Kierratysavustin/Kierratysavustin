import React, { ChangeEventHandler } from 'react'

type Props = {
  selectedFile: File | undefined,
  handleInputChange: ChangeEventHandler<HTMLInputElement>
}

const FileInput: React.FC<Props> = ({ selectedFile, handleInputChange }) => {
  return (
    <div>
      <label htmlFor='fileSelect' className='btn btn-outline-dark btn-sm'>{(selectedFile ? 'Vaihda tiedostoa' : 'Valitse tiedosto')}</label>
      <p className=''>{(selectedFile ? selectedFile.name : 'Kuvaa ei valittu')}</p>
      <input id='fileSelect' type="file" name="file" style={{ display: 'none' }} accept='image/*' onChange={handleInputChange} />
    </div>
  )
}

export default FileInput