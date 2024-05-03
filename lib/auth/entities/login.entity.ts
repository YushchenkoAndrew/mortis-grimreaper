import { Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class LoginEntity extends CommonEntity {
  constructor(init?: Partial<LoginEntity>) {
    super();
    this.assign(init, this);
  }

  @Request()
  username: string = '';

  @Request()
  password: string = '';
}
