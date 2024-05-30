import { Column } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { AdminStageEntity } from '../entities/admin-stage.entity';

@Entity({ route: 'admin/stages', session: true })
export class AdminDashboardCollection extends CommonEntity {
  constructor(init?: Partial<AdminDashboardCollection>) {
    super();
    this.assign(init, this);
  }

  @Column((e) => (console.log({ e }), new AdminStageEntity().buildAll(e)))
  stages: AdminStageEntity[] = [];
}
