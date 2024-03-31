import { Column } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { IdEntity } from '../common/id.entity';
import { OrganizationEntity } from './organization.entity';

@Entity()
export class UserEntity extends IdEntity {
  constructor(init?: Partial<UserEntity>) {
    super();
    this.assign(init, this);
  }

  @Column((e) => new OrganizationEntity().build(e.organization ?? {}))
  organization: OrganizationEntity;
}
