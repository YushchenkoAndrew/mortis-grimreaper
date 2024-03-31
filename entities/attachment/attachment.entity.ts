import { Column } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { CommonEntity } from '../common/common.entity';
import { IdEntity } from '../common/id.entity';

@Entity({ route: 'attachments' })
export class AttachmentEntity extends IdEntity {
  constructor(init?: Partial<AttachmentEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  path: string;

  @Column()
  file: string;

  @Column()
  type: string;
}
