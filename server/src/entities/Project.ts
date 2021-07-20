import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
