import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Coin } from '../coin.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@EventSubscriber()
export class CoinSubscriber implements EntitySubscriberInterface<Coin> {
  private readonly logger = new Logger('DatabaseLogger');

  listenTo() {
    return Coin;
  }

  afterInsert(event: InsertEvent<Coin>) {
    this.logger.log(`Created entity: ${JSON.stringify(event.entity)}`);
  }
}
