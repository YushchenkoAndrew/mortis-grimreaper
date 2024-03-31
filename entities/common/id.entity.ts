import { Column } from '../../decorators/column';
import { CommonEntity } from './common.entity';

export class IdEntity extends CommonEntity {
  constructor(init?: Partial<IdEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string;

  @Column()
  name: string;
}
