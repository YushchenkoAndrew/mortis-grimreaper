import { Entity } from '../../decorators/request-entity';
import { IdEntity } from '../common/id.entity';

@Entity()
export class OrganizationEntity extends IdEntity {
  constructor(init?: Partial<OrganizationEntity>) {
    super();
    this.assign(init, this);
  }
}
