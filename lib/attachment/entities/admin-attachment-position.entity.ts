import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';

@Entity({ route: 'admin/attachments/order', session: true })
export class AdminAttachmentPositionEntity extends IdEntity {
  constructor(init?: Partial<AdminAttachmentPositionEntity>) {
    super();
    this.assign(init, this);
  }

  @Request({ nullable: true })
  position: number = null;
}
