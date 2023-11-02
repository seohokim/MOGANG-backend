import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Core } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

export enum Provider {
  Inflearn = 0,
  Udemy = 1,
}

@Entity()
export class Lecture extends Core {
  @Column()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  author?: string;

  @Column()
  @IsArray()
  @IsString({ each: true })
  skills: string;

  @Column()
  @IsNumber()
  level: number;

  @Column()
  @IsNumber()
  charge: number;

  @Column({ type: 'enum', enum: Provider, default: Provider.Inflearn })
  provider: Provider;

  @Column({ type: 'text', nullable: true })
  @IsString()
  htmlContent: string;

  @Column()
  @IsNumber()
  score: number;

  @Column()
  @IsNumber()
  views: number; //서비스 내부

  @Column()
  @IsString()
  thumnailUrl: string;

  @Column()
  @IsOptional()
  @IsNumber()
  like: number; //서비스 내부

  @Column({ unique: true })
  @IsString()
  @IsUrl()
  url: string;

  // @OneToMany(() => Review, review => review.lecture)
  // reviews: Review[];

  // @OneToMany(() => Post, post => post.lecture)
  // posts: Post[];

  @BeforeInsert()
  private async likeAndViews() {
    this.like = 0;
    this.views = 0;
  }
}
