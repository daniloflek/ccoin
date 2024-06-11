import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoinInfoDTO } from './dto/coin-info.dto';
import { RtResponseDto } from './dto/rt-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HistoryResponseDto } from './dto/history-response';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from './entities/coin.entity';

type CoinAPIInfo = {
  asset_id: string;
  name: string;
  data_start: string;
  data_end: string;
};

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public async getListOfCoins(): Promise<CoinInfoDTO[]> {
    const coinIds = this.configService.get('COIN_IDS');
    const r = await this.httpService.axiosRef.get<CoinAPIInfo[]>('/v1/assets', {
      params: { filter_asset_id: coinIds },
    });
    return r.data.map((c) => ({
      id: c.asset_id,
      name: c.name,
      dataStart: c.data_start,
      dataEnd: c.data_end,
    }));
  }

  public async getRTCoinData(id: string): Promise<RtResponseDto> {
    const symbol = `${this.configService.get('EXCHANGE_ID')}_SPOT_${id}_USD`;
    const data = await this.cacheManager.get<RtResponseDto>(symbol);
    if (!data) return new RtResponseDto();
    return data;
  }

  public async getHistoricalCoinData(
    id: string,
    from: Date,
    to: Date,
  ): Promise<HistoryResponseDto[]> {
    const results = await this.coinRepository
      .createQueryBuilder('coin')
      .where('coin.symbol = :id', { id })
      .andWhere(
        '(coin.timePeriodStart BETWEEN :from AND :to OR coin.timePeriodEnd BETWEEN :from AND :to)',
        { from, to },
      )
      .getMany();
    return results;
  }
}
