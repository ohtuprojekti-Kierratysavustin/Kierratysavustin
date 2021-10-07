export type Product = {
  id: number,
  name: string,
  instructions: Instruction[],
  users: number[],
  user: number
}

export type Instruction = {
  id: number,
  score: number,
  information: string,
  product_id: number,
  user: number
}

export type User = {
  id: number,
  username: string,
  passwordHash: string,
  token: string,
  likes: number[],
  dislikes: number[],
  products: number[]
}

export type ProductStatistic = {
  product: Product,
  purchaseCount: number,
  recycleCount: number,
}