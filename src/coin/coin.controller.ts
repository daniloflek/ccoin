import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoinInfoDTO } from './dto/coin-info.dto';
import { CoinService } from './coin.service';
import { RtResponseDto } from './dto/rt-response.dto';
import { CoinIdPipe } from './pipes/coin-id.validation.pipe';
import { HistoryQueryDTO } from './dto/query-history.dto';
import { DatePipe } from './pipes/date-validation.pipe';
import { HistoryResponseDto } from './dto/history-response';

@Controller('coin')
export class CoinController {
  constructor(private coinService: CoinService) {}

  @Get('list')
  public async getCoinInfo(): Promise<CoinInfoDTO[]> {
    return this.coinService.getListOfCoins();
  }

  @Get('rt/:id')
  async getRt(@Param('id', CoinIdPipe) id: string): Promise<RtResponseDto> {
    return this.coinService.getRTCoinData(id);
  }

  @Get('history/:id')
  async getHistory(
    @Param('id', CoinIdPipe) id: string,
    @Query(DatePipe) query: HistoryQueryDTO,
  ): Promise<{ history: HistoryResponseDto[] }> {
    const history = await this.coinService.getHistoricalCoinData(
      id,
      query.from,
      query.to,
    );
    return { history };
  }
}
