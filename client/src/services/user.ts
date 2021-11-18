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
const editLike = async (id: number): Promise<PostRequestResponse> => {
  const response = axios.post(`${userUrl}/instructions/like`, { instructionID: id }, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}
const editDislike = async (id: number): Promise<PostRequestResponse> => {
  const response = axios.post(`${userUrl}/instructions/dislike`, { instructionID: id }, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}
const getLikes = async (): Promise<number[]> => {
  const response = axios.get(`${userUrl}/instructions/likes`, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}
const getDislikes = async (): Promise<number[]> => {
  const response = axios.get(`${userUrl}/instructions/dislikes`, tokenService.getConfig())
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
  editLike: (id: number) => Promise<PostRequestResponse>,
  editDislike: (id: number) => Promise<PostRequestResponse>,
  getLikes: () => Promise<number[]>,
  getDislikes: () => Promise<number[]>
}

export const userService = {
  createUser, loginUser, addFavorite, removeFavorite,
  editDislike, editLike, getLikes, getDislikes
}