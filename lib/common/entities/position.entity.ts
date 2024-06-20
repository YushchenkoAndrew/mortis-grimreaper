import { Request } from '../decorators/column';
import { Entity } from '../decorators/request-entity';
import { OrderableTypeEnum } from '../types/orderable-type.enum';
import { IdEntity } from './id.entity';

@Entity({
  route: 'admin/{{orderable}}/{{id}}/order',
  session: true,
  modify: false,
})
export class PositionEntity extends IdEntity {
  constructor(init?: Partial<PositionEntity>) {
    super();
    this.assign(init, this);
  }

  id: any = null;

  @Request()
  position: number = 0;

  @Request(() => undefined)
  orderable: OrderableTypeEnum = null;
}
