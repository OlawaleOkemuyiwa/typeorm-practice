import bcrypt from "bcrypt";
import { AfterInsert, AfterLoad, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import ClientInterface from "../interfaces/client.interface";
import PersonInterface from "../interfaces/person.interface";
import BankerEntity from "./banker.entity";
import ContactInfoEntity from "./contact_info.entity";
import TransactionEntity from "./transaction.entity";
import PersonEntity from "./utils/person";


@Entity("client")
//CCC: @Check(length of username > 5)
class ClientEntity extends PersonEntity implements PersonInterface, ClientInterface {
  @Column({
    length: 10,
    unique: true
  })
  card_number: string;

  @Column()
  pin: string;

  @Column({
    type: "numeric",
    precision: 20,  //max balance of a client is 9,999,999,999,999,999.9999
    scale: 4
  })
  balance: number;

  @Column({
    name: "active",
    default: true
  })
  is_active: boolean;

  @Column({
    type: "simple-json",
    nullable: true
  })
  additional_info: {
    age: number,
    hair_color: string
  };

  @Column({
    type: "simple-array",
    default: []
  })
  family_members: string[];

  @Column({
    length: 403,
    unique: true
  })
  username: string;

  //v2: Add avatar field and upload functionality

  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;
  
  private tempPin: string;
  private unhashedPin: string;

  @BeforeInsert()
  generateUsername() {
    this.username = `${this.first_name.concat(this.last_name).toLowerCase()}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
  }

  @OneToOne(() => ContactInfoEntity, contact => contact.client, { eager: true })  //always pull the contact_info of a client entity being loaded (by find or findOne etc) whether or not its added to the relations array
  contact_info: ContactInfoEntity;

  @OneToMany(() => TransactionEntity, transaction => transaction.client) 
  transactions: TransactionEntity[];

  @ManyToMany(() => BankerEntity, banker => banker.clients, {
    onDelete: "CASCADE",          //when client record is deleted, all records in the intermediate join table with that client id should also be deleted
    onUpdate: "CASCADE"
  })
  bankers: BankerEntity[];

  @AfterInsert()

  @AfterLoad()
  saveTempPin() {                 //this is func gets called everytime a client entity is loaded by QueryBuilder or repo/manager find methods. 
    this.tempPin = this.pin;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPin() {
    const pinOnLoad = this.tempPin;
    const pinToInsert = this.pin;
    
    if (pinToInsert && pinToInsert !== pinOnLoad) {      //this is done to make sure that we only attempt to hash pin when we are inserting a new entity with a pin value for the first time OR only when the pin field is being updated. It shouldn't run for every other entity update (e.g a username change) 
      try {
        this.pin = await bcrypt.hash(this.pin, 8);
      } catch (error) {
        throw new Error("Error hashing pin for client!")
      }
    }
  }

  serializer() {
    const { id, first_name, last_name, card_number, balance, is_active, additional_info, family_members, username, contact_info, created_at, updated_at } = this;
    return { id, first_name, last_name, card_number, balance, is_active, additional_info, family_members, username, contact_info, created_at, updated_at };
  }
}

export default ClientEntity;