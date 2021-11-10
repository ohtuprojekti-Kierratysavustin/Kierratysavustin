import axios from 'axios'
import { PostRequestResponse } from '../types/requestResponses'
import { Product } from '../types/objects'
import tokenService from './token'
const registerUrl = `${process.env.PUBLIC_URL}/api/users`
const userUrl = `${process.env.PUBLIC_URL}/api/users`

const createUser = async (newUser: {
  username: string;
  password: string;
}
) => {
  const response = axios.post(`${registerUrl}`, newUser)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}
const loginUrl = `${process.env.PUBLIC_URL}/api/login`

const loginUser = async (credentials: {
  username: string;
  password: string;
}
) => {
  const response = axios.post(`${loginUrl}`, credentials)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}
const addFavorite = async (newObject: Product): Promise<PostRequestResponse> => {
  const response = axios.post(`${userUrl}/products/${newObject.id}`, newObject, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const removeFavorite = async (newObject: Product): Promise<PostRequestResponse> => {
  const response = axios.put(`${userUrl}/products/${newObject.id}`, newObject, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}
const like = async (id: number): Promise<PostRequestResponse> => {
  const response = axios.post(`${userUrl}/likes/${id}`, id, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const dislike = async (id: number): Promise<PostRequestResponse> => {
  const response = axios.post(`${userUrl}/dislikes/${id}`, id, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getLikes = async (): Promise<number[]> => {
  const response = axios.get(`${userUrl}/likes`, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}
const getDislikes = async (): Promise<number[]> => {
  const response = axios.get(`${userUrl}/dislikes`, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export type UserService = {
  createUser: (newUser: {
    username: string;
    password: string;
  }) => Promise<PostRequestResponse>,
  loginUser: (credentials: {
    username: string;
    password: string;
  }) => Promise<PostRequestResponse>,
  addFavorite: (newObject: Product) => Promise<PostRequestResponse>,
  removeFavorite: (newObject: Product) => Promise<PostRequestResponse>,
  like: (id: number) => Promise<PostRequestResponse>,
  dislike: (id: number) => Promise<PostRequestResponse>,
  getLikes: () => Promise<number[]>,
  getDislikes: () => Promise<number[]>
}

export const userService = {
  createUser, loginUser, addFavorite, removeFavorite,
  dislike, like, getLikes, getDislikes
}