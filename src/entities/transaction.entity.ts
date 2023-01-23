import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, ManyToMany, BeforeInsert} from "typeorm";
import TransactionInterface from "../interfaces/transaction.interface";
import ClientEntity from "./client.entity";

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

@Entity("transaction")
export class TransactionEntity extends BaseEntity implements TransactionInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type: string;

  @Column({
    type: "numeric", //transaction limit at a time is 999,999.99
    precision: 8,
    scale: 2
  })
  amount: number;

  @ManyToOne(() => ClientEntity, client => client.transactions, {
    onDelete: "SET NULL",  //when a client record is deleted, the transaction records with that client id should have their column value to NULL 
    onUpdate: "CASCADE"
  })
  @JoinColumn({
    name: 'client_id'
  })
  client: ClientEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default TransactionEntity;
