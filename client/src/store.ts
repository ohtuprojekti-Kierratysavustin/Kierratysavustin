import create from 'zustand'
import { Product, User, RecyclingStat } from './types'

export const useStore = create<{
  setNotification: (message: string, condition: string) => void,
  clearNotification: () => void,
  setUser: (param: User | null) => void,
  setFavorites: (param: Product[]) => void,
  setLikes: (param: number[]) => void,
  setDislikes: (param: number[]) => void,
  setFilteredProducts: (param: Product[]) => void,
  setProducts: (param: Product[]) => void,
  updateProduct: (param: Product) => void,
  updateRecyclingStats: (newStat: RecyclingStat) => void,
  setRecyclingStats: (stats: RecyclingStat[]) => void,
  user: User | null,
  products: Product[],
  favorites: Product[],
  likes: number[],
  dislikes: number[],
  filteredProducts: Product[],
  recyclingStats: RecyclingStat[],
  notification: { message: string | null, condition: string | null},
  timer: any
    }>(set => ({
      products: [],
      filteredProducts: [],
      favorites: [],
      likes: [],
      dislikes: [],
      recyclingStats: [],
      user: null,
      notification: { message: null, condition: null },
      timer: null,
      setUser: (param) => set(() => ({ user: param })),
      setProducts: (param) => set(() => ({ products: param })),
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
          state.clearNotification() }, 5000)
      })),

      updateProduct: (param) => set(state => ({
        ...state,
        products: state.products.map((p) => p.id !== param.id ? p : param)
      })),

      updateRecyclingStats: (newStat) =>
        set((state) => ({
          ...state,
          recyclingStats: addOrUpdateRecyclingStat(state.recyclingStats, newStat)
        })),

      setRecyclingStats: (stats) => set(() => ({ recyclingStats: stats })),
    }))

const addOrUpdateRecyclingStat = (stats :RecyclingStat[], newStat :RecyclingStat) :RecyclingStat[] => {
  if (stats.some(stat => stat.product.id === newStat.product.id )) {
    const newStats :RecyclingStat[] = stats.map(stat => ({
      ...stat,
      amount: stat.product.id === newStat.product.id ? newStat.amount : stat.amount
    }))
    return newStats
  }
  return [...stats, newStat]
}
