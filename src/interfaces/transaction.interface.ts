export default interface TransactionInterface {
  id: string;
  type: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}