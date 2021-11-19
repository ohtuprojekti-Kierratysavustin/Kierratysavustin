import axios from 'axios'

const baseUrl = 'https://api.kierratys.info'
let apiKey: string

const setKey = (key: string) => {
  apiKey = key
}

const getCollectionSpotsByMunicipality = (municipality: string) => {
  const request = axios.get(baseUrl + '/collectionspots/?api_key=' + apiKey + '&municipality=' + municipality)
  return request
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getCollectionSpotsByPostalCode = (postalcode: string) => {
  const request = axios.get(baseUrl + '/collectionspots/?api_key=' + apiKey + '&postal_code=' + postalcode)
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

export type KierratysInfoService = {
  getCollectionSpotsByMunicipality: (municipality: string) => Promise<any>,
  getCollectionSpotsByPostalCode: (postalcode: string) => Promise<any>,
  getAllRecyclingMaterials: () => Promise<any>,
  setKey: (key:string) => void
}

export const kierratysInfoService: KierratysInfoService = { getCollectionSpotsByMunicipality, getCollectionSpotsByPostalCode, getAllRecyclingMaterials, setKey }