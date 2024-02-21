export type TransactionWithoutCategoryData = {
  id: number
  name: string
  amount: number
  timestamp: EpochTimeStamp
  account_id: number
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
  account_id: number
  categoryData: {
    name: string
    color: string
    icon: string
  }
}

export type Account = {
  id: number
  name: string
  currency_id: number
}

export type Currency = {
  id: number
  name: string
  value: number
}
