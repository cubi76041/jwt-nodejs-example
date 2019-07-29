import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export abstract class Base {
  @PrimaryGeneratedColumn()
  @Expose({ toPlainOnly: true })
  id: number;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
