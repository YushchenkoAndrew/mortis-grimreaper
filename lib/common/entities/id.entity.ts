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

  @Request()
  @Request({ nullable: true })
  name: string = '';
}
