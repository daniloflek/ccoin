export class RtResponseDto {
  timeExchange: Date = new Date();
  timeCoinapi: Date = new Date();
  uuid: string = '';
  price: number = -1;
  size: number = -1;
  takerSide: string = 'UNKNOWN';
  symbolId: string = '<====>';
}
