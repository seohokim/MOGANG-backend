import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'seoho',
  password: '4688',
  database: 'mogang',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // 실제 서비스 이용시엔 false를 해야 데이터 에러를 방지 할 수 있음
};
