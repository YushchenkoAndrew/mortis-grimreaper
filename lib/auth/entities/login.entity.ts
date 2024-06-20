import { z } from 'zod';
import { Request, Validate } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity()
export class LoginEntity extends CommonEntity {
  constructor(init?: Partial<LoginEntity>) {
    super();
    this.assign(init, this);
  }

  @Request()
  @Validate(() => z.string().min(3, 'Username must be at least 3 characters'))
  username: string = '';

  @Request()
  @Validate(() => z.string().min(3, 'Password must be at least 3 characters'))
  password: string = '';
}
