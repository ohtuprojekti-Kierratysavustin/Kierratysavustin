import axios from 'axios'

const getCredentialsFor = (service: string) => {
  let config = {
    params: { service }
  }
  const request = axios.get(`${process.env.PUBLIC_URL}/api/credentials`, config)
  return request
    .then(response => response.data.KIApikey)
    .catch(error => Promise.reject(error.response.data))
}

export default { getCredentialsFor }