import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { Core } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';

export enum Provider {
  Inflearn = 0,
  Udemy = 1,
}

@Entity()
export class Lecture extends Core {
  @Column({ type: 'enum', enum: Provider, default: Provider.Inflearn })
  provider: Provider;

  @Column()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  author?: string;

  @Column('simple-array')
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @Column({ default: '' })
  @IsString()
  category: string;

  @Column({ default: '2023/11' })
  @Matches(/^\d{4}\/\d{2}$/)
  lectureUpdatedAt: string;

  @Column()
  @IsNumber()
  level: number;

  @Column()
  @IsNumber()
  price: number;

  @Column({ type: 'int', nullable: true })
  @IsNumber()
  durationInMinutes: number;

  @Column('double precision')
  @IsNumber()
  score: number;

  @Column({ default: 0 })
  @IsNumber()
  views: number;

  @Column()
  @IsUrl()
  thumbnailUrl: string;

  @ManyToMany(() => User, (user) => user.likedLectures, { cascade: true })
  @JoinTable()
  likedByUsers: User[];

  @Column({ unique: true })
  @IsString()
  @IsUrl()
  url: string;

  @BeforeInsert()
  private likeAndViews() {
    this.views = 0;
  }
}
