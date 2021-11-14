import axios from 'axios'

const baseUrl = 'https://api.kierratys.info'
let apiKey: string

const setKey = (key: string) => {
  apiKey = key
}

const getCollectionSpotsByMunicipality = (municipality: string) => {
  const request = axios.get(baseUrl + '/collectionspots?api_key=' + apiKey + '&municipality=' + municipality)
  return request
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export default { setKey, getCollectionSpotsByMunicipality }