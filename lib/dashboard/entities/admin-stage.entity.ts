import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { StageStatusEnum } from '../types/stage-status.enum';
import { AdminTaskEntity } from './admin-task.entity';
import { StageEntity } from './stage.entity';

@Entity({ route: 'admin/stages', session: true })
export class AdminStageEntity extends StageEntity {
  constructor(init?: Partial<AdminStageEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  order: number = 0;

  @Request()
  @Column()
  status: StageStatusEnum = null;

  @Column((e) => new AdminTaskEntity().buildAll(e.tasks ?? {}))
  tasks: AdminTaskEntity[] = [];
}
