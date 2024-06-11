import { Module } from '@nestjs/common';
import { CoinService } from './coin.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CoinController } from './coin.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RtService } from './rt/rt.service';
import { HistoryService } from './history/history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './entities/coin.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CoinIdPipe } from './pipes/coin-id.validation.pipe';
import { DatePipe } from './pipes/date-validation.pipe';

@Module({
  providers: [CoinService, RtService, HistoryService, CoinIdPipe, DatePipe],
  imports: [
    TypeOrmModule.forFeature([Coin]),
    ScheduleModule.forRoot(),
    CacheModule.register(),
    HttpModule.registerAsync({
      useFactory: (cs: ConfigService) => {
        const headers = {
          'X-CoinAPI-Key': cs.get('API_KEY'),
          Accept: 'application/json',
        };
        return {
          baseURL: cs.get('BASE_URL'),
          headers,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [CoinController],
})
export class CoinModule {}
