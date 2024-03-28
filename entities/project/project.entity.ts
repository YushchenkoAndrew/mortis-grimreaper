import { Column } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { AttachmentEntity } from '../attachment/attachment.entity';
import { CommonEntity } from '../common/common.entity';
import { PaletteEntity } from '../palette/palette.entity';
import { PatternEntity } from '../pattern/pattern.entity';
import { ProjectTypeEnum } from './types/project-type.enum';

@Entity({ route: 'projects' })
export class ProjectEntity extends CommonEntity {
  constructor(init?: Partial<ProjectEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column((e) => ProjectTypeEnum[e.type] ?? ProjectTypeEnum.html)
  type: ProjectTypeEnum;

  @Column((e) => new PaletteEntity().build(e.palette ?? {}))
  palette: PaletteEntity;

  @Column((e) => new PatternEntity().build(e.pattern ?? {}))
  pattern: PatternEntity;

  @Column((e) => new AttachmentEntity().build(e.thumbnail ?? {}))
  thumbnail: AttachmentEntity;
}
