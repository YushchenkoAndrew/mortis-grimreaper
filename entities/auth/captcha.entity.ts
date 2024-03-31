import { Request } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { CommonEntity } from '../common/common.entity';

@Entity({ route: 'admin/login/captcha' })
export class CaptchaEntity extends CommonEntity {
  constructor(init?: Partial<CaptchaEntity>) {
    super();
    this.assign(init, this);
  }

  @Request()
  captcha: string = '';
}
