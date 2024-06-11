import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoinIdPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}
  transform(value: string) {
    const coinIds = this.configService.get('COIN_IDS').split(';');
    if (!value) throw new BadRequestException('no id provided');
    if (!coinIds.includes(value)) {
      throw new BadRequestException({
        msg: 'id not in allowed range',
        coinIds,
      });
    }
    return value;
  }
}
