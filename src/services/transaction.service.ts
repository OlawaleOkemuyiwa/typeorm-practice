import ClientEntity from "../entities/client.entity";
import { EntityRepository, Repository } from "typeorm";
import TransactionEntity, { TransactionType } from "../entities/transaction.entity";
import { HttpException } from "../exceptions/http_exception";

@EntityRepository()
class TransactionService extends Repository<TransactionEntity> {
  public async createTransaction (reqBody: any, clientId: number | string) {
    const { type, amount } = reqBody;

    if (type !== TransactionType.DEPOSIT && type !== TransactionType.WITHDRAW) 
      throw new HttpException(400, 'Invalid transaction type');

    const client = await ClientEntity.findOne(clientId);

    if (!client) throw new HttpException(404, "No client with such ID found");

    const balance = +client.balance;
    if (type === TransactionType.DEPOSIT) {
      client.balance = balance + amount;
    } else {
      if (amount > client.balance) throw new HttpException(404, "Insufficient funds!");
      client.balance = balance - amount; 
    }
    
    const transaction = TransactionEntity.create({
      type,
      amount,
      client
    });

    try {
      await client.save();
      return await transaction.save();
    } catch (err) {
      throw err;
    }
  }
  
  public async getTransaction (transactionId: number | string ) {
    try {
      return await TransactionEntity.findOne(transactionId);
    } catch (err) {
      throw err;
    }
  }

  public async getClientTransactions (clientId: number | string) {
    try {
      const client = await ClientEntity.findOne(clientId, {relations: ['transactions']});
      if (!client) throw new HttpException(404, "No client with such ID found");
      return client.transactions;
    } catch (err) {
      throw err;
    }
  }
}

export default TransactionService;