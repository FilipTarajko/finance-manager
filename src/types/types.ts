export type Transaction = {
  id: number
  name: string
  amount: number
  category: Category
  timestamp: EpochTimeStamp
}

export type Category = {
  id: number
  name: string
  color: string
  icon: string
}
