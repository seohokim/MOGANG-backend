import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture])],
  providers: [LecturesService],
  controllers: [LecturesController]
})
export class LecturesModule {}



