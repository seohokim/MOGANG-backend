import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { Core } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Lecture extends Core {
  @Column()
  @IsString()
  provider: string;

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

  @Column('simple-array')
  @IsArray()
  @IsString({ each: true })
  category: string[];

  @Column({ default: '2023/11' })
  @Matches(/^\d{4}\/\d{2}$/) // 2023/11
  lectureUpdatedAt: string;

  @Column()
  @IsString()
  level: string;

  @Column()
  @IsNumber()
  originPrice: number;

  @Column()
  @IsNumber()
  currentPrice: number;

  @Column({ nullable: true })
  @Matches(/^(\d{1,4}):(\d{2})$/) //15:05 or 0:55
  duration: string;

  @Column('double precision')
  @IsNumber()
  score: number;

  @Column({ default: 0 })
  @IsNumber()
  views: number;

  @Column()
  @IsString()
  description: string;

  @ManyToMany(() => User, (user) => user.likedLectures, { cascade: true })
  @JoinTable()
  likedByUsers: User[];

  @Column()
  @IsUrl()
  thumbnailUrl: string;

  @Column({ unique: true })
  @IsString()
  @IsUrl()
  url: string;

  @BeforeInsert()
  private likeAndViews() {
    this.views = 0;
  }
}
