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
  favoriteProducts: number[],
  role: string
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