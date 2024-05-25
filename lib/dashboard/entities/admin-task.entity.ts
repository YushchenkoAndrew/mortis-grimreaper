import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { AdminLinkEntity } from '../../link/entities/admin-link.entity';
import { AdminTagEntity } from '../../tag/entities/admin-tag.entity';
import { TaskStatusEnum } from '../types/task-status.enum';
import { TaskEntity } from './task.entity';

@Entity({ route: 'admin/stages/{{stage_id}}/tasks', session: true })
export class AdminTaskEntity extends TaskEntity {
  constructor(init?: Partial<AdminTaskEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  order: number = 0;

  @Request()
  @Column()
  status: TaskStatusEnum = null;

  @Column((e) => new AdminAttachmentEntity().buildAll(e.attachments ?? []))
  attachments: AdminAttachmentEntity[] = [];

  @Column((e) => new AdminLinkEntity().buildAll(e.links ?? {}))
  links: AdminLinkEntity[] = [];

  @Column((e) => new AdminTagEntity().buildAll(e.tags ?? {}))
  tags: AdminTagEntity[] = [];

  @Request(() => undefined, { nullable: true })
  stage_id: string = null;
}
