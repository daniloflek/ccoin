import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  timeClose: Date;

  @Column('text')
  symbol: string;

  @Column('timestamp')
  timeOpen: Date;

  @Column({ type: 'decimal', default: -1 })
  priceOpen: number;

  @Column({ type: 'decimal', default: -1 })
  priceClose: number;

  @Column({ type: 'decimal', default: -1 })
  priceHigh: number;

  @Column({ type: 'decimal', default: -1 })
  priceLow: number;

  @Column('decimal')
  volumeTraded: number;

  @Column('bigint')
  tradesCount: number;

  @Column('timestamp')
  timePeriodStart: Date;

  @Column('timestamp')
  timePeriodEnd: Date;

  @CreateDateColumn()
  createdAt: Date;
}
