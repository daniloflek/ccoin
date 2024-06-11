import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoinModule } from './coin/coin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './coin/entities/coin.entity';
import { CoinSubscriber } from './coin/entities/sybscribers/coin.subscriber';

@Module({
  imports: [
    CoinModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (cs: ConfigService) => {
        return {
          type: 'postgres',
          host: cs.get('HOST'),
          port: cs.get('PORT'),
          username: cs.get('DB_USER'),
          password: cs.get('PASSWORD'),
          database: cs.get('DB_NAME'),
          entities: [Coin],
          synchronize: true,
          subscribers: [CoinSubscriber],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
