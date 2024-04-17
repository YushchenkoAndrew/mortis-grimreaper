import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity({ route: 'admin/ping' })
export class AdminPingEntity extends CommonEntity {
  constructor(init?: Partial<AdminPingEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  message: string = null;
}
