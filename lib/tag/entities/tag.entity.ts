import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';

@Entity({ route: 'tags' })
export class TagEntity extends IdEntity {
  constructor(init?: Partial<TagEntity>) {
    super();
    this.assign(init, this);
  }
}
