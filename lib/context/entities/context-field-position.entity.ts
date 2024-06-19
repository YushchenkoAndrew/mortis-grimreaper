import { Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { PositionEntity } from '../../common/entities/position.entity';

@Entity({
  route: 'admin/contexts/{{context_id}}/fields/{{id}}/order',
  session: true,
  modify: false,
})
export class ContextFieldPositionEntity extends PositionEntity {
  constructor(init?: Partial<ContextFieldPositionEntity>) {
    super();
    this.assign(init, this);
  }

  @Request()
  context_id: string = '';
}
