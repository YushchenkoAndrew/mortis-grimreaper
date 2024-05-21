import { Column } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';
import { TaskEntity } from './task.entity';

@Entity({ route: 'stages' })
export class StageEntity extends IdEntity {
  constructor(init?: Partial<StageEntity>) {
    super();
    this.assign(init, this);
  }

  @Column((e) => new TaskEntity().buildAll(e.tasks ?? {}))
  tasks: TaskEntity[] = [];
}
