import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { WebSocket } from 'ws';
import { RtResponseDto } from '../dto/rt-response.dto';

type HelloMessage = {
  type: string;
  apikey: string;
  heartbeat: boolean;
  subscribe_data_type: string;
  subscribe_filter_symbol_id: string[];
};

type WebSocketAPIObject = {
  type: string;
  symbol_id: string;
  sequence: number;
  time_exchange: string;
  time_coinapi: string;
  uuid: string;
  price: number;
  size: number;
  taker_side: string;
};

@Injectable()
export class RtService implements OnModuleInit {
  private logger: Logger = new Logger('RTService');
  private socket: WebSocket;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private connectToWebSocket() {
    this.socket = new WebSocket(this.configService.get('SOCKET_URL'));
    this.socket.on('open', () => {
      this.logger.log('Connected to WebSocket server');
      const helloMessage = this.getHelloMessage();
      this.socket.emit('hello', helloMessage);
      this.logger.log('Hello message sent');
    });

    this.socket.on('message', async (data: any) => {
      await this.handleMessage(data);
    });

    this.socket.on('close', () => {
      this.logger.log('Disconnected from WebSocket server');
    });
  }

  public onModuleInit() {
    this.connectToWebSocket();
  }

  private getHelloMessage(): HelloMessage {
    const coinIds = this.configService.get('COIN_IDS').split(';');
    const message = {
      type: 'hello',
      apikey: this.configService.get('API_KEY'),
      heartbeat: false,
      subscribe_data_type: 'trade',
      subscribe_filter_symbol_id: coinIds.map(
        (c: string) => `${this.configService.get('EXCHANGE_ID')}_${c}_USD$`,
      ),
    };
    return message;
  }

  private async handleMessage(dataBuf: Buffer) {
    const data: WebSocketAPIObject = JSON.parse(dataBuf.toString());
    this.logger.log(`Received message: ${data}`);
    const rtData: RtResponseDto = {
      timeExchange: new Date(data.time_exchange),
      timeCoinapi: new Date(data.time_coinapi),
      uuid: data.uuid,
      price: data.price,
      size: data.size,
      takerSide: data.taker_side,
      symbolId: data.symbol_id,
    };
    await this.cacheManager.set(data.symbol_id, rtData);
  }
}
