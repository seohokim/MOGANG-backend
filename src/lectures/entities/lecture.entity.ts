import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Core } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

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

  @Column({ default: 0 })
  @IsNumber()
  like: number;

  @Column({ unique: true })
  @IsString()
  @IsUrl()
  url: string;

  @BeforeInsert()
  private likeAndViews() {
    this.like = 0;
    this.views = 0;
  }
}
