import PersonInterface from "../../interfaces/person.interface";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["first_name", "last_name"])
class PersonEntity extends BaseEntity implements PersonInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200
  })
  first_name: string;

  @Column({
    length: 200
  })
  last_name: string;
}

export default PersonEntity;