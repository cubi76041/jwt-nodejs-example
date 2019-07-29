import { Entity, Column, Unique } from 'typeorm';
import { Length, IsNotEmpty, IsEmail, IsEnum, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { Base } from './Base';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity()
@Unique(['email'])
export class User extends Base {
  @Column()
  @Length(4, 255)
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @Column()
  @IsNotEmpty()
  @Expose()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  @Length(1, 100)
  @Expose({ name: 'first_name' })
  firstName: string;

  @Column()
  @Length(1, 100)
  @Expose({ name: 'last_name' })
  lastName: string;

  @Column()
  @IsNumber()
  @Expose()
  age: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: 'invalid user role'
  })
  @Expose()
  role: UserRole;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  validatePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
