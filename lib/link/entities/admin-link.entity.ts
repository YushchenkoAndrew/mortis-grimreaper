import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { LinkEntity } from './link.entity';

@Entity({ route: 'admin/links', session: true })
export class AdminLinkEntity extends LinkEntity {
  constructor(init?: Partial<AdminLinkEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  order: number = 0;

  @Column()
  updated_at: string = '';

  @Request({ nullable: true })
  linkable_id: string = null;

  @Request({ nullable: true })
  linkable_type: string = null;
}
