import create from 'zustand'

export const useStore = create<{
  setNotification: (message: string, condition: string) => void,
  clearNotification: () => void,
  setUser: (user: {
    id: Number,
    username: string,
    passwordHash: string,
    likes: Number[],
    dislikes: Number[],
    products: Number[]
  }) => void,
  setFavorites: (favorites: [{
    id: Number,
    name: string,
    instructions: Number[],
    users: Number[]
  }]) => void,
  setLikes: (likes: [{
    id: Number,
    score: Number,
    information: string,
    product_id: Number
  }]) => void,
  setDislikes: (dislikes: [{
    id: Number,
    score: Number,
    information: string,
    product_id: Number
  }]) => void,
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
      setUser: (param) => set(() => ({ user: param })),
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
      setFavorites: (param) => set(() => ({ favorites: param })),
      setLikes: (param) => set(() => ({ likes: param })),
      setDislikes: (param) => set(() => ({ dislikes: param })),
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