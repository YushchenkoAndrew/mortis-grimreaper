import { Column } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';
import { OrganizationEntity } from './organization.entity';

@Entity()
export class UserEntity extends IdEntity {
  constructor(init?: Partial<UserEntity>) {
    super();
    this.assign(init, this);
  }

  @Column((e) => new OrganizationEntity().build(e.organization ?? {}))
  organization: OrganizationEntity = null;
}
