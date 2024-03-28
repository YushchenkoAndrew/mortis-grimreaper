import { Column } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { CommonEntity } from '../common/common.entity';

@Entity({ route: 'attachments' })
export class AttachmentEntity extends CommonEntity {
  constructor(init?: Partial<AttachmentEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  file: string;

  @Column()
  type: string;
}
