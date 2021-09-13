import create from 'zustand'

export const useStore = create<{
  setNotification: (message: string, condition: string) => void,
  clearNotification: () => void,
  user: any,
  products: any,
  prod: any,
  favorites: any,
  likes: any,
  dislikes: any,
  filteredProducts: any,
  notification: any,
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
      setUser: (param: {
        id: Number,
        username: string,
        passwordHash: string,
        likes: Number[],
        dislikes: Number[],
        products: Number[]
      }) => set(() => ({ user: param })),
      setProducts: (param: [
        {
          id: Number,
          name: string,
          instructions: Number[],
          users: Number[]
        }
      ]) => set(() => ({ products: param })),
      setProduct: (param: {
        id: Number,
        name: string,
        instructions: Number[],
        users: Number[]
      }) => set(() => ({ prod: param })),
      setFavorites: (param: any) => set(() => ({ favorites: param })),
      setLikes: (param: any) => set(() => ({ likes: param })),
      setDislikes: (param: any) => set(() => ({ dislikes: param })),
      setFilteredProducts: (param: string) => set(() => ({ filteredProducts: param })),
      clearNotification: () => set(() => ({ notification: { message: null, condition: null } })),
      setNotification: (message, condition) => set(state => ({
        ...state,
        clearTimer: clearTimeout(state.timer),
        notification: { message, condition },
        timer: setTimeout(() => {
          state.clearNotification() }, 10000)
      })),
      updateProduct: (param: any) => set(state => ({
        ...state,
        products: state.products.map((p: any) => p.id !== param.id ? p : param)
      }))
    }))