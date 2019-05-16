import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import * as crypto from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from 'src/common/enums/index';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn() public id: number;

  @Column({
    default: '',
    length: 100,
  })
  @IsEmail()
  public email: string;

  @Column({
    length: 75,
  })
  @IsString()
  @Exclude()
  public password: string;

  @Column({
    length: 128,
  })
  @IsString()
  @Exclude()
  public passwordSalt: string;

  @Column({
    default: Role.PUBLIC,
  })
  public role: Role;

  @CreateDateColumn({
    type: 'timestamp',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  public updatedAt: Date;

  @BeforeInsert()
  public async hashPasswordWithSalt() {
    const salt = this.generateRandomSalt(128);
    this.passwordSalt = salt;
    this.password = crypto
      .createHmac('sha256', salt)
      .update(this.password)
      .digest('hex');
  }

  private generateRandomSalt(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}
