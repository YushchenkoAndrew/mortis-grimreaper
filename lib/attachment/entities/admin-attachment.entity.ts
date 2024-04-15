import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { AttachmentEntity } from './attachment.entity';

@Entity({ route: 'admin/attachments' })
export class AdminAttachmentEntity extends AttachmentEntity {
  constructor(init?: Partial<AdminAttachmentEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  created_at: string = '';

  @Column()
  size: number = 0;

  @Request()
  attachable_id: string = '';

  @Request()
  attachable_type: string = '';
}
