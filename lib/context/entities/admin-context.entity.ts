import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { AdminContextFieldEntity } from './admin-context-field.entity';
import { ContextEntity } from './context.entity';

@Entity({ route: 'admin/contexts', session: true })
export class AdminContextEntity extends ContextEntity {
  constructor(init?: Partial<AdminContextEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  order: number = 0;

  @Column()
  updated_at: string = '';

  @Column((e) => new AdminContextFieldEntity().buildAll(e.fields ?? []))
  fields: AdminContextFieldEntity[] = [];

  @Request({ nullable: true })
  contextable_id: string = null;

  @Request({ nullable: true })
  contextable_type: string = null;
}
