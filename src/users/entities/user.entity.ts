import * as bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { Core } from 'src/common/entities/core.entity';
import { Lecture } from 'src/lectures/entities/lecture.entity';

export enum Provider {
  Local,
  Google,
}

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

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  photo?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @ManyToMany(() => Lecture, (lecture) => lecture.likedByUsers)
  likedLectures: Lecture[];

  @Column({ type: 'enum', enum: Provider, default: Provider.Local })
  provider: Provider;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.password && this.provider === Provider.Local) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }
}
