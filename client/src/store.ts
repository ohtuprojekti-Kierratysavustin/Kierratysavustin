import create from 'zustand'
import { Product, User, ProductStatistic } from './types/objects'

export const useStore = create<{
  setNotification: (message: string, condition: string) => void,
  clearNotification: () => void,
  setUser: (param: User | null) => void,
  setFavorites: (param: Product[]) => void,
  setLikes: (param: number[]) => void,
  setDislikes: (param: number[]) => void,
  setSelectedMaterials: (param: any[]) => void,
  setFilteredProducts: (param: Product[]) => void,
  setProducts: (param: Product[]) => void,
  updateProduct: (param: Product) => void,
  updateProductStatistics: (newStat: ProductStatistic) => void,
  setProductStatistics: (stats: ProductStatistic[]) => void,
  user: User | null,
  products: Product[],
  favorites: Product[],
  likes: number[],
  dislikes: number[],
  selectedMaterials: any[],
  filteredProducts: Product[],
  productStatistics: ProductStatistic[],
  notification: { message: string | null, condition: string | null},
  timer: any
    }>(set => ({
      products: [],
      filteredProducts: [],
      favorites: [],
      likes: [],
      dislikes: [],
      selectedMaterials: [],
      productStatistics: [],
      user: null,
      notification: { message: null, condition: null },
      timer: null,
      setUser: (param) => set(() => ({ user: param })),
      setProducts: (param) => set(() => ({ products: param })),
      setFavorites: (param) => set(() => ({ favorites: param })),
      setLikes: (param) => set(() => ({ likes: param })),
      setDislikes: (param) => set(() => ({ dislikes: param })),
      setSelectedMaterials: (param) => set(() => ({ selectedMaterials: param })),
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

      updateProductStatistics: (newStat) =>
        set((state) => ({
          ...state,
          productStatistics: addOrUpdateRecyclingStat(state.productStatistics, newStat)
        })),

      setProductStatistics: (stats) => set(() => ({ productStatistics: stats })),
    }))

const addOrUpdateRecyclingStat = (stats :ProductStatistic[], newStat :ProductStatistic) :ProductStatistic[] => {
  if (stats.some(stat => stat.productID.id === newStat.productID.id )) {
    const newStats :ProductStatistic[] = stats.map(stat => ({
      ...stat,
      recycleCount: stat.productID.id === newStat.productID.id ? newStat.recycleCount : stat.recycleCount,
      purchaseCount: stat.productID.id === newStat.productID.id ? newStat.purchaseCount : stat.purchaseCount
    }))
    return newStats
  }
  return [...stats, newStat]
}
