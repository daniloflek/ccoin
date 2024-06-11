import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { HistoryQueryDTO } from '../dto/query-history.dto';

@Injectable()
export class DatePipe implements PipeTransform {
  transform(value: HistoryQueryDTO) {
    if (value.from <= value.to) return value;
    throw new BadRequestException({ msg: '"fom" can be bigger then "to"' });
  }
}
