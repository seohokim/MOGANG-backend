import * as bcrypt from 'bcrypt'
import { Exclude, classToPlain } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { Core } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity } from "typeorm";

@Entity()
export class User extends Core {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  @IsString()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }
}