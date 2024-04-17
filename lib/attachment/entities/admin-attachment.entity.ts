import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { AttachmentEntity } from './attachment.entity';

@Entity({ route: 'admin/attachments', session: true })
export class AdminAttachmentEntity extends AttachmentEntity {
  constructor(init?: Partial<AdminAttachmentEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  updated_at: string = '';

  @Column()
  size: number = 0;

  @Request({ nullable: true })
  attachable_id: string = null;

  @Request({ nullable: true })
  attachable_type: string = null;
}
