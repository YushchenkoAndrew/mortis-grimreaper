import { Column, Request, Validate } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { AttachmentEntity } from '../../attachment/entities/attachment.entity';
import { IdEntity } from '../../common/entities/id.entity';
import { PaletteEntity } from '../../palette/palette.entity';
import { PatternEntity } from '../../pattern/pattern.entity';
import { ProjectTypeEnum } from '../types/project-type.enum';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';
import { LinkEntity } from '../../link/entities/link.entity';
import { TagEntity } from '../../tag/entities/tag.entity';
import { z } from 'zod';

@Entity({ route: 'projects' })
export class ProjectEntity extends IdEntity {
  constructor(init?: Partial<ProjectEntity>) {
    super();
    this.assign(init, this);
  }

  @Request({ nullable: true })
  @Column()
  @Validate(() => z.string())
  description: string = '';

  @Request()
  @Column({ nullable: true })
  @Validate(() => z.string())
  footer: string = '';

  @Request()
  @Column((e) => ProjectTypeEnum[e.type] ?? ProjectTypeEnum.html)
  @Validate(() => z.nativeEnum(ProjectTypeEnum))
  type: ProjectTypeEnum = null;

  @Column((e) => new PaletteEntity().build(e.palette ?? {}))
  palette: PaletteEntity = null;

  @Column((e) => new PatternEntity().build(e.pattern ?? {}))
  pattern: PatternEntity = null;

  @Column((e) => new AttachmentEntity().build(e.thumbnail ?? {}))
  thumbnail: AttachmentEntity = null;

  @Column((e) => new LinkEntity().build(e.redirect ?? {}))
  redirect: LinkEntity = null;

  @Column((e) => new AttachmentEntity().buildAll(e.attachments ?? []))
  attachments: AttachmentEntity[] = [];

  @Column((e) => new LinkEntity().buildAll(e.links ?? {}))
  links: LinkEntity[] = [];

  @Column((e) => new TagEntity().buildAll(e.tags ?? {}))
  tags: TagEntity[] = [];

  _avatar(prefix: string = '') {
    if (this.thumbnail?.file) return this.thumbnail._url() + `?r=${prefix}`;
    return createAvatar(identicon, { seed: this.id }).toDataUriSync();
  }
}
