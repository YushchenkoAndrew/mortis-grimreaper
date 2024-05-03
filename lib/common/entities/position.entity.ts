import { Request } from '../decorators/column';
import { Entity } from '../decorators/request-entity';
import { IdEntity } from './id.entity';

@Entity({ session: true })
export class PositionEntity extends IdEntity {
  constructor(init?: Partial<PositionEntity>) {
    super();
    this.assign(init, this);
  }

  @Request()
  position: number = 0;
}
