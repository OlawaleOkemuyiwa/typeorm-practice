import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, AfterLoad, Check } from "typeorm";
import PersonEntity from "./utils/person";
import PersonInterface from "../interfaces/person.interface";
import BankerInterface from "../interfaces/banker.interface";
import ClientEntity from "./client.entity";
import TokenEntity from "./token.entity";

@Entity("banker")
@Check(` "yearly_salary" > 0 `)
class BankerEntity extends PersonEntity implements PersonInterface, BankerInterface {
  @Column({
    length: 300,
    unique: true
  })
  email: string;

  @Column({
    length: 10,
    unique: true
  })
  employee_number: string;
  
  @Column()
  password: string;

  @Column({
    type: "numeric",
    precision: 8,
    scale: 2
  })
  yearly_salary: number;

  @Column({
    default: false
  })
  isAdmin: boolean;

  //self-referencing table where FK contraint column is the supervisor_id. A banker is a supervisee (i.e has a supervisor). A banker can also be a supervisor that has many supervisees. So many supervisees (many table with FK column) attached to 1 supervisor (one table) (n:1)
  @ManyToOne(() => BankerEntity, banker => banker.supervisees, {
    onDelete: "SET NULL", 
    onUpdate: "CASCADE"
  })
  @JoinColumn({ name: "supervisor_id" })
  supervisor: BankerEntity;
  //CCC: how do i assign a default value of e.g value of 1 (id of supervisor) and ON DELETE SET DEFAULT so whenever a supervisor is deleted, such banker is assigned 1 as its supervisor (i.e The head boss becomes his supervisor until a new supervisor is assigned officially)
  
  @OneToMany(() => BankerEntity, banker => banker.supervisor)
  supervisees: BankerEntity[];

  @OneToMany(() => TokenEntity, token => token.banker)
  tokens: TokenEntity[];

  @ManyToMany(() => ClientEntity, client => client.bankers, {
    onDelete: "CASCADE", //when a banker record is deleted, all records in the intermediate join table with that banker_id should also be deleted
    onUpdate: "CASCADE"
  })
  @JoinTable({
    name: "banker_client",
    joinColumn: {
      name: "banker_id",      //1st column name of the intermediate banker_client table which references the id field of this entity
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "client_id",      //2nd column name of the intermediate banker_client table which references the id field of the other entity (ClientEntity) in many-to-many relationship with. 
      referencedColumnName: "id"
    }
  })
  clients: ClientEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  private tempPassword: string;
  
  @BeforeInsert()
  @BeforeUpdate()
  trimAndValidateEmail() {
    this.email = this.email.trim().toLocaleLowerCase();
    if (!validator.isEmail(this.email)) throw new Error("Invalid email provided!");
  }

  @AfterLoad()
  saveTemppassword() {         
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashpassword() {
    const passwordOnLoad = this.tempPassword;
    const passwordToInsert = this.password;
    
    if (passwordToInsert && passwordToInsert !== passwordOnLoad) {      
      try {
        this.password = await bcrypt.hash(this.password, 8);
      } catch (error) {
        throw new Error("Error hashing password for banker!")
      }
    }
  }

  static async findByCredentials(email: string, password: string) {
    const banker = await this.findOne({ email });

    if (!banker) throw new Error("Unable to login");

    const isMatch = await bcrypt.compare(password, banker.password);

    if (!isMatch) throw new Error("Unable to login");

    return banker;
  }

  async generateAuthToken() {
    const banker = this;
    const token = jwt.sign({ bankerId: banker.id }, `${process.env.JWT_SECRET}`);

    const tokenRecord = TokenEntity.create({
      jwtToken: token,
      banker
    })
    
    await tokenRecord.save();
    
    return token;
  };

  serializer() {
    const { id, first_name, last_name, email, employee_number, isAdmin, created_at, updated_at } = this;
    return { id, first_name, last_name, email, employee_number, isAdmin, created_at, updated_at };
  }
};

export default BankerEntity;
