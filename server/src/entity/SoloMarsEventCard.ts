import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SoloMarsEventCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column()
  displayName!: string;

  @Column()
  codeName!: string;

  @Column()
  minHealth!: number;

  @Column()
  maxHealth!: number;

  @Column()
  minPoints!: number;

  @Column()
  maxPoints!: number;

  @Column()
  minBlocks!: number;

  @Column()
  maxBlocks!: number;

  @Column()
  draw2!: string;
}
