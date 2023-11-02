import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Core } from 'src/common/entities/core.entity';
import { IsOptional, IsUrl } from 'class-validator';
@Entity()
export class Banner extends Core {
  @Column()
  @IsUrl()
  imageUrl: string;

  @Column()
  @IsUrl()
  @IsOptional()
  link?: string;
}
