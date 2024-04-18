import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ route: 'auth/login' })
export class AuthEntity extends CommonEntity {
  constructor(init?: Partial<AuthEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  access_token: string = '';

  @Column()
  refresh_token: string = '';

  @Column((e) => new UserEntity().build(e.user))
  user: UserEntity = null;
}
