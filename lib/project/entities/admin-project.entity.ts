import { z } from 'zod';
import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { Column, Request, Validate } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { AdminLinkEntity } from '../../link/entities/admin-link.entity';
import { AdminTagEntity } from '../../tag/entities/admin-tag.entity';
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
  @Validate(() => z.string().url())
  link: string = '';

  @Column()
  order: number = 0;

  @Request()
  @Column()
  status: ProjectStatusEnum = null;

  @Column((e) => new AdminAttachmentEntity().buildAll(e.attachments ?? []))
  attachments: AdminAttachmentEntity[] = [];

  @Column((e) => new AdminLinkEntity().buildAll(e.links ?? []))
  links: AdminLinkEntity[] = [];

  @Column((e) => new AdminTagEntity().buildAll(e.tags ?? {}))
  tags: AdminTagEntity[] = [];

  invertStatus(): ProjectStatusEnum {
    switch (this.status) {
      case ProjectStatusEnum.active:
        return ProjectStatusEnum.inactive;

      case ProjectStatusEnum.inactive:
        return ProjectStatusEnum.active;

      default:
        return null;
    }
  }
}
