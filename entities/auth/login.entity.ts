import { Request } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { CommonEntity } from '../common/common.entity';

@Entity({ route: 'login' })
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
