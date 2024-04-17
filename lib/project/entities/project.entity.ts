import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { AttachmentEntity } from '../../attachment/entities/attachment.entity';
import { IdEntity } from '../../common/entities/id.entity';
import { PaletteEntity } from '../../palette/palette.entity';
import { PatternEntity } from '../../pattern/pattern.entity';
import { ProjectTypeEnum } from '../types/project-type.enum';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

@Entity({ route: 'projects' })
export class ProjectEntity extends IdEntity {
  constructor(init?: Partial<ProjectEntity>) {
    super();
    this.assign(init, this);
  }

  @Request()
  @Column()
  description: string = '';

  @Request()
  @Column({ nullable: true })
  footer: string = '';

  @Request()
  @Column((e) => ProjectTypeEnum[e.type] ?? ProjectTypeEnum.html)
  type: ProjectTypeEnum = null;

  @Column((e) => new PaletteEntity().build(e.palette ?? {}))
  palette: PaletteEntity = null;

  @Column((e) => new PatternEntity().build(e.pattern ?? {}))
  pattern: PatternEntity = null;

  @Column((e) => new AttachmentEntity().build(e.thumbnail ?? {}))
  thumbnail: AttachmentEntity = null;

  @Column((e) => new AttachmentEntity().buildAll(e.attachments ?? []))
  attachments: AttachmentEntity[] = [];

  _avatar() {
    if (this.thumbnail?.file) return this.thumbnail._url();
    return createAvatar(identicon, { seed: this.id }).toDataUriSync();
  }
}