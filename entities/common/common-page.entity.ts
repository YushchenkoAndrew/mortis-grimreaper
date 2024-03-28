import { Column } from '../../decorators/column';
import { CommonEntity } from './common.entity';

export abstract class CommonPageEntity extends CommonEntity {
  @Column()
  page: number;

  @Column()
  per_page: number;

  @Column()
  total: number;

  @Column()
  abstract result: unknown[];
}
