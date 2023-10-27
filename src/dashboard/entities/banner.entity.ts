import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Core } from 'src/common/entities/core.entity';
import { IsUrl } from 'class-validator';
@Entity()
export class Banner extends Core {
  @IsUrl()
  @Column({ type: 'text' })
  imageUrl: string;

  @Column({ type: 'text' })
  link: string;
}
