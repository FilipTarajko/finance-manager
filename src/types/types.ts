export type TransactionWithoutCategoryData = {
  id: number
  name: string
  amount: number
  timestamp: EpochTimeStamp
}

export type Category = {
  id: number
  name: string
  color: string
  icon: string
  transactions: TransactionWithoutCategoryData[]
}

export type TransactionWithCategoryData = {
  id: number
  name: string
  amount: number
  timestamp: EpochTimeStamp
  categoryData: {
    name: string
    color: string
    icon: string
  }
}
