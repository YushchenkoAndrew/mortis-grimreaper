import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';

@Entity({ route: 'attachments' })
export class AttachmentEntity extends IdEntity {
  constructor(init?: Partial<AttachmentEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  @Request()
  path: string = '';

  @Column()
  @Request()
  file: string = '';

  @Column()
  @Request(() => undefined)
  type: string = '';

  filepath() {
    return this.path + this.name;
  }
}
