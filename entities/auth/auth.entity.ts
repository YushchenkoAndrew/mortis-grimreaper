import { Column, Request } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { CommonEntity } from '../common/common.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ route: 'admin/login' })
export class AuthEntity extends CommonEntity {
  constructor(init?: Partial<AuthEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  access_token: string = '';

  @Column()
  refresh_token: string = '';

  @Column((e) => new UserEntity().build(e))
  user: UserEntity = null;
}
