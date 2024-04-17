import { Config } from '../../../config';
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
  @Request({ nullable: true })
  path: string = '';

  @Column()
  @Request({ nullable: true })
  file: string = '';

  @Column()
  @Request({ nullable: true })
  type: string = '';

  _filepath() {
    return this.path + this.name;
  }

  _url() {
    return `${Config.self.base.api}${this.file}`;
  }
}
