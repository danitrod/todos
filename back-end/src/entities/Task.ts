import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Project } from './Project';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column()
  done!: boolean;

  @ManyToOne(() => Project)
  project!: Project;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  finishedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
