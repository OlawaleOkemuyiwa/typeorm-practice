import TokenInterface from "../interfaces/token.interface";
import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import BankerEntity from "./banker.entity";

@Entity("token")
class TokenEntity extends BaseEntity implements TokenInterface {
  @PrimaryColumn()
  jwtToken: string;

  @ManyToOne(() => BankerEntity, banker => banker.tokens, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  @JoinColumn({ name: "banker_id" })
  banker: BankerEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default TokenEntity;