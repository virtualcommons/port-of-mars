import { Entity, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";

@Entity()
export class SoloPlayerDecision {
  @PrimaryGeneratedColumn()
  id!: number;
}
