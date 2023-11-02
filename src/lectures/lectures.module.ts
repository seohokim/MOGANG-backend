import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, User])],
  providers: [LecturesService],
  controllers: [LecturesController],
})
export class LecturesModule {}
