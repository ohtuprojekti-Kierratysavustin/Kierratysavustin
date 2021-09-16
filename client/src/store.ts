import create from 'zustand'

export const useStore = create<{
  setNotification: (message: string, condition: string) => void,
  clearNotification: () => void,
  setUser: (user: {
    id: number,
    username: string,
    passwordHash: string,
    likes: number[],
    dislikes: number[],
    products: number[]
  }) => void,
  setFavorites: (favorites: [{
    id: number,
    name: string,
    instructions: number[],
    users: number[]
  }]) => void,
  setLikes: (likes: [{
    id: number,
    score: number,
    information: string,
    product_id: number
  }]) => void,
  setDislikes: (dislikes: [{
    id: number,
    score: number,
    information: string,
    product_id: number
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
          id: number,
          name: string,
          instructions: number[],
          users: number[]
        }
      ]) => set(() => ({ products: param })),
      setProduct: (param: {
        id: number,
        name: string,
        instructions: number[],
        users: number[]
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