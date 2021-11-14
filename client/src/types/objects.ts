import { SpawnSyncOptionsWithBufferEncoding } from "child_process"

export type Product = {
  id: number,
  name: string,
  instructions: Instruction[],
  creator: number,
  productImage: string
}

export type Instruction = {
  id: number,
  score: number,
  information: string,
  product_id: number,
  creator: number
}

export type User = {
  id: number,
  username: string,
  passwordHash: string,
  token: string,
  likes: number[],
  dislikes: number[],
  favoriteProducts: number[]
}

export type ProductUserCount = {
  recycleCount: number,
  purchaseCount: number,
  userID: number,
  productID: number
}

export type ProductUserCountUpdate = {
  productID: number,
  amount: number,
  type: String
}

export type ProductStatistic = {
  productID: Product,
  purchaseCount: number,
  recycleCount: number
}

export type RecyclingMaterial = {
  code: number,
  name: string
}

export type RecyclingSpot = {
  spot_id: number,
  name: string,
  operator: string,
  contact_info: string,
  address: string,
  postal_code: string,
  municipality: string,
  geometry: {
    coordinates: [number, number],
    type: string,
  },
  materials: RecyclingMaterial[],
  opening_hours_fi: string,
  opening_hours_sv: string,
  opening_hours_en: string,
  description_fi: string,
  description_se: string,
  description_en: string,
  occupied: boolean,
  additional_details: string
}