import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from '../entities/coin.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { compareDatesByDay, formatISO8601, timeout } from 'src/utils';
import { Cron, CronExpression } from '@nestjs/schedule';

type ApiResp = {
  time_period_start: string;
  time_period_end: string;
  time_open: string;
  time_close: string;
  price_open: number;
  price_high: number;
  price_low: number;
  price_close: number;
  volume_traded: number;
  trades_count: number;
};

@Injectable()
export class HistoryService implements OnModuleInit {
  private logger: Logger = new Logger('HistoryService');
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    const mappedDates = await this.getLastDates();
    for (const id of this.configService.get('COIN_IDS').split(';')) {
      const dates = mappedDates[id];
      await timeout(1000);
      await this.getHistoryData(id, dates?.lastStartDate, dates?.lastEndDate);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async getByCron() {
    const mappedDates = await this.getLastDates();
    for (const id of this.configService.get('COIN_IDS').split(';')) {
      const dates = mappedDates[id];
      await timeout(1000);
      await this.getHistoryData(id, dates?.lastStartDate, dates?.lastEndDate);
    }
  }

  private async getLastDates(): Promise<Record<string, any>> {
    const results = await this.coinRepository
      .createQueryBuilder('coin')
      .select('symbol')
      .addSelect('MAX(coin.timePeriodStart)', 'lastStartDate')
      .addSelect('MAX(coin.timePeriodEnd)', 'lastEndDate')
      .groupBy('symbol')
      .getRawMany();

    const mapped = results.reduce(
      (acum, { symbol, lastEndDate, lastStartDate }) => {
        acum[symbol] = { lastEndDate, lastStartDate };
        return acum;
      },
      {},
    );
    return mapped;
  }

  private async getHistoryData(
    id: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<void> {
    const symbol = `${this.configService.get('EXCHANGE_ID')}_SPOT_${id}_USD`;
    if (endDate && compareDatesByDay(endDate, new Date()) !== -1) {
      this.logger.log(`${endDate}, skippingAction, because it is to early`);
      return;
    }
    const timeStart = formatISO8601(
      startDate
        ? new Date(startDate.setDate(startDate.getDate() + 1))
        : new Date(new Date().setDate(new Date().getDate() - 2)),
    );
    const timeEnd = formatISO8601(
      endDate
        ? new Date(endDate.setDate(endDate.getDate() + 1))
        : new Date(new Date().setDate(new Date().getDate() - 1)),
    );
    try {
      const { data } = await this.httpService.axiosRef.get<ApiResp[]>(
        `/v1/ohlcv/${symbol}/history`,
        {
          params: {
            time_start: timeStart,
            time_end: timeEnd,
            period_id: '1DAY',
          },
        },
      );
      const mapped = data.map((c) => ({
        timeClose: new Date(c.time_close),
        symbol: id,
        timeOpen: new Date(c.time_open),
        priceOpen: c.price_open,
        priceClose: c.price_close,
        priceHigh: c.price_high,
        priceLow: c.price_low,
        volumeTraded: c.volume_traded,
        timePeriodStart: new Date(c.time_period_start),
        timePeriodEnd: new Date(c.time_period_end),
        tradesCount: c.trades_count,
      }));
      await this.coinRepository.save(mapped);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
