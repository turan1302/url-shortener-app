import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkModule } from './link/link.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './link/entity/link.entity';

@Module({
  imports: [
    LinkModule,

    TypeOrmModule.forFeature([Link]),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3307'),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? 'root',
      database: process.env.DB_NAME ?? 'url_shortener',
      autoLoadEntities: true,
      timezone: '+03:00', // Europe/Istanbul
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
