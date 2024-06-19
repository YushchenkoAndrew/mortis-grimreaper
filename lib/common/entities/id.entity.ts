import { z } from 'zod';
import { Column, Request, Validate } from '../decorators/column';
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
  @Validate(() => z.string().min(3, 'Name must be at least 3 characters'))
  name: string = '';
}
