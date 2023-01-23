import validator from "validator";
import ContactInfoInterface from "../interfaces/contact_info.interface";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import ClientEntity from "./client.entity";

@Entity("contact_info")
class ContactInfoEntity extends BaseEntity implements ContactInfoInterface {
  @PrimaryColumn({
    length: 300
  })
  email: string;
  
  @Column({
    length: 20
  })
  phone: string;

  @OneToOne(() => ClientEntity, client => client.contact_info, {
    onDelete: "CASCADE", //when a client record is deleted, the client_info record with that client id should also be deleted
    onUpdate: "CASCADE"
  })
  @JoinColumn({name: "client_id"})
  client: ClientEntity;

  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;
  
  @BeforeInsert()
  @BeforeUpdate()
  trimAndValidateEmail() {
    this.email = this.email.trim().toLocaleLowerCase();
    if (!validator.isEmail(this.email)) throw new Error("Invalid email provided!") 
  }
}

export default ContactInfoEntity;