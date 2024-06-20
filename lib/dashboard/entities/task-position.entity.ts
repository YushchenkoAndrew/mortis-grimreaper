import { Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { PositionEntity } from '../../common/entities/position.entity';

@Entity({
  route: 'admin/stages/{{src_stage_id}}/tasks/{{id}}/order',
  session: true,
  modify: false,
})
export class TaskPositionEntity extends PositionEntity {
  constructor(init?: Partial<TaskPositionEntity>) {
    super();
    this.assign(init, this);
  }

  @Request(() => undefined)
  src_stage_id: string = '';

  @Request()
  stage_id: string = '';
}
