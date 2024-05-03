import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';

@Entity()
export class OrganizationEntity extends IdEntity {
  constructor(init?: Partial<OrganizationEntity>) {
    super();
    this.assign(init, this);
  }
}
