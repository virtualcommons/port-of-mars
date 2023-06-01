import { Entity, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";

@Entity()
export class SoloPlayer {
  @PrimaryGeneratedColumn()
  id!: number;
}
