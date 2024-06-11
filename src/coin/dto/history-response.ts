export class HistoryResponseDto {
  timeClose: Date;
  symbol: string;
  timeOpen: Date;
  priceOpen: number;
  priceClose: number;
  priceHigh: number;
  priceLow: number;
  volumeTraded: number;
  tradesCount: number;
  timePeriodStart: Date;
  timePeriodEnd: Date;
}
