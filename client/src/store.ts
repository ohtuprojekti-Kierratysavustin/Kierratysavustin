import create from 'zustand'
import { Product, User } from './types'

export const useStore = create<{
  setNotification: (message: string, condition: string) => void,
  clearNotification: () => void,
  setUser: (param: User | null) => void,
  setFavorites: (param: Product[]) => void,
  setLikes: (param: number[]) => void,
  setDislikes: (param: number[]) => void,
  setFilteredProducts: (param: Product[]) => void,
  setProduct: (param: Product) => void,
  setProducts: (param: Product[]) => void,
  updateProduct: (param: Product) => void,
  user: User | null,
  products: Product[],
  prod: any,
  favorites: Product[],
  likes: number[],
  dislikes: number[],
  filteredProducts: Product[],
  notification: { message: string | null, condition: string | null},
  timer: any
    }>(set => ({
      products: [],
      prod: null,
      filteredProducts: [],
      favorites: [],
      likes: [],
      dislikes: [],
      user: null,
      notification: { message: null, condition: null },
      timer: null,
      setUser: (param) => set(() => ({ user: param })),
      setProducts: (param) => set(() => ({ products: param })),
      setProduct: (param) => set(() => ({ prod: param })),
      setFavorites: (param) => set(() => ({ favorites: param })),
      setLikes: (param) => set(() => ({ likes: param })),
      setDislikes: (param) => set(() => ({ dislikes: param })),
      setFilteredProducts: (param) => set(() => ({ filteredProducts: param })),
      clearNotification: () => set(() => ({ notification: { message: null, condition: null } })),
      setNotification: (message, condition) => set(state => ({
        ...state,
        clearTimer: clearTimeout(state.timer),
        notification: { message, condition },
        timer: setTimeout(() => {
          state.clearNotification() }, 10000)
      })),
      updateProduct: (param) => set(state => ({
        ...state,
        products: state.products.map((p: any) => p.id !== param.id ? p : param)
      }))
    }))