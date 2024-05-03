import { Entity } from '../../common/decorators/request-entity';
import { Column } from '../../common/decorators/column';
import { CommonPageEntity } from '../../common/entities/common-page.entity';
import { ProjectEntity } from './project.entity';

@Entity({ route: 'projects' })
export class ProjectPageEntity extends CommonPageEntity {
  @Column((e) => new ProjectEntity().buildAll(e.result))
  result: ProjectEntity[] = [];
}
