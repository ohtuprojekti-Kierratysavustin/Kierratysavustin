import create from 'zustand'

export const useStore = create(set => ({
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
    products: state.products.map(p => p.id !== param.id ? p : param)
  }))
}))