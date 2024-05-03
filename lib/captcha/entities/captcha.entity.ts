import { Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity({ route: 'admin/auth/captcha' })
export class CaptchaEntity extends CommonEntity {
  constructor(init?: Partial<CaptchaEntity>) {
    super();
    this.assign(init, this);
  }

  @Request()
  captcha: string = '';
}
