import { Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class RefreshEntity extends CommonEntity {
  constructor(init?: Partial<RefreshEntity>) {
    super();
    this.assign(init, this);
  }

  @Request()
  refresh_token: string = '';
}
