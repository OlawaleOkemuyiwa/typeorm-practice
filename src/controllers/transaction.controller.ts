import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http_exception";
import TransactionService from "../services/transaction.service";

class TransactionController {
  public TransactionService = new TransactionService();

  public createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;
      if (Object.keys(req.body).length === 0 || !clientId) 
        throw new HttpException(400, 'please include appropriate request body and params');
      const transaction = await this.TransactionService.createTransaction(req.body, clientId);
      res.status(201).json({message: 'transaction created sucessfully', transaction});
    } catch (error) {
      next(error);
    }
  }

  public getTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { transactionId } = req.params;
      if (!transactionId) throw new HttpException(400, 'please include the required id of transaction');
      const transaction = await this.TransactionService.getTransaction(transactionId);
      if (!transaction) throw new HttpException(404, "No transaction with such ID found");
      res.json(transaction);
    } catch (error) {
      next(error);
    }    
  }

  public getClientTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.params;
      if (!clientId) throw new HttpException(400, 'please include the required id of clients to get transactions for');
      const transactions = await this.TransactionService.getClientTransactions(clientId);
      if (transactions.length === 0) throw new HttpException(404, "No transaction found for client");
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  } 
}

export default TransactionController;