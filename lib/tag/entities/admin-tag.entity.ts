import { Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';

@Entity({ route: 'admin/tags', session: true })
export class AdminTagEntity extends IdEntity {
  constructor(init?: Partial<AdminTagEntity>) {
    super();
    this.assign(init, this);
  }

  @Request({ nullable: true })
  taggable_id: string = null;

  @Request({ nullable: true })
  taggable_type: string = null;
}
