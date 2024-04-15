import { Column } from '../decorators/column';
import { CommonEntity } from './common.entity';

export abstract class CommonPageEntity extends CommonEntity {
  @Column()
  page: number = 0;

  @Column()
  per_page: number = 0;

  @Column()
  total: number = 0;

  @Column()
  abstract result: unknown[];
}
