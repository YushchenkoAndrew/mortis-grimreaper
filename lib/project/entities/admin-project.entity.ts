import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { ProjectStatusEnum } from '../types/project-status.enum';
import { ProjectEntity } from './project.entity';

@Entity({ route: 'admin/projects', session: true })
export class AdminProjectEntity extends ProjectEntity {
  constructor(init?: Partial<AdminProjectEntity>) {
    super();
    this.assign(init, this);
  }

  @Request({ nullable: true })
  readme: boolean = null;

  @Request({ nullable: true })
  link: string = '';

  @Column()
  order: number = 0;

  @Request()
  @Column()
  status: ProjectStatusEnum = null;

  @Column((e) => new AdminAttachmentEntity().buildAll(e.attachments ?? []))
  attachments: AdminAttachmentEntity[] = [];
}
