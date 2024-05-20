import { Column, Request } from '../decorators/column';
import { CommonEntity } from './common.entity';

export class IdEntity extends CommonEntity {
  constructor(init?: Partial<IdEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  @Request(() => undefined, { nullable: true })
  id: string = null;

  @Column()
  @Request({ nullable: true })
  name: string = '';
}
