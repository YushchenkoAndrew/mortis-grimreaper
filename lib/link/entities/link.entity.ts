import { Column } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';

@Entity({ route: 'link' })
export class LinkEntity extends IdEntity {
  constructor(init?: Partial<LinkEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  link: string = '';
}
