import axios from 'axios'

const baseUrl = 'https://api.kierratys.info'
let apiKey: string

const setKey = (key: string) => {
  apiKey = key
}

const getCollectionSpotsByMunicipality = (municipality: string, materials: any[]) => {
  const request = axios.get(baseUrl + '/collectionspots/?api_key=' + apiKey + '&municipality=' + municipality + getMaterialsQueryString(materials))
  return request
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getCollectionSpotsByPostalCode = (postalcode: string, materials: any[]) => {
  const request = axios.get(baseUrl + '/collectionspots/?api_key=' + apiKey + '&postal_code=' + postalcode + getMaterialsQueryString(materials))
  return request
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getAllRecyclingMaterials = () => {
  const request = axios.get(baseUrl + '/materialtypes/?api_key=' + apiKey)
  return request
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getMaterialsQueryString = (materials: any[]) => {
  if (materials.length === 0) { return '' }
  var materialsToShow: string = '&material='
  for (var i=0; i < materials.length; i++) {
    materialsToShow = materialsToShow + materials[i].code.toString()
    if (i !== materials.length-1) {
      materialsToShow = materialsToShow + ','
    }
  }

  return materialsToShow
}

export default { setKey, getCollectionSpotsByMunicipality, getCollectionSpotsByPostalCode, getAllRecyclingMaterials }