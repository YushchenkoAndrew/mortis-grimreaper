import { Entity } from '../../common/decorators/request-entity';
import { Column } from '../../common/decorators/column';
import { CommonPageEntity } from '../../common/entities/common-page.entity';
import { AdminProjectEntity } from './admin-project.entity';

@Entity({ route: 'admin/projects', session: true })
export class AdminProjectPageEntity extends CommonPageEntity {
  @Column((e) => new AdminProjectEntity().buildAll(e.result))
  result: AdminProjectEntity[] = [];
}
