export interface TransactionParameters {
  [key: string]: any
}

export interface Transaction {
  id: string
  parameters: TransactionParameters
}
