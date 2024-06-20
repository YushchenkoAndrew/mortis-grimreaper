import { Column } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { StageEntity } from '../entities/stage.entity';

@Entity({ route: 'stages' })
export class DashboardCollection extends CommonEntity {
  constructor(init?: Partial<DashboardCollection>) {
    super();
    this.assign(init, this);
  }

  @Column((e) => new StageEntity().buildAll(e))
  stages: StageEntity[] = [];
}
