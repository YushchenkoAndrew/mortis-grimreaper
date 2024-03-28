import { Entity } from '../../decorators/request-entity';
import { Column } from '../../decorators/column';
import { CommonPageEntity } from '../common/common-page.entity';
import { ProjectEntity } from './project.entity';

@Entity({ route: 'projects' })
export class ProjectPageEntity extends CommonPageEntity {
  @Column((e) => new ProjectEntity().buildAll(e.result))
  result: ProjectEntity[];
}
