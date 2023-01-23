import { Router } from "express";
import TransactionController from "../controllers/transaction.controller";
import { Route } from "../interfaces/route.interface";

class TransactionRoute implements Route {
  public path: string = '/api/transactions';
  public router: Router = Router();
  private TransactionController: TransactionController = new TransactionController();

  constructor() {
    this.router.post(`${this.path}/:clientId`, this.TransactionController.createTransaction);
    this.router.get(`${this.path}/:transactionId`, this.TransactionController.getTransaction);
    this.router.get(`${this.path}/client/:clientId`, this.TransactionController.getClientTransactions);
  }
}

export default TransactionRoute;