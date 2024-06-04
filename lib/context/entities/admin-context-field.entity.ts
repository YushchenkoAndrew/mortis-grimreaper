import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { ContextFieldValueEnum } from '../types/context-field-value.enum';
import { ContextFieldEntity } from './context-field.entity';

@Entity({ route: 'admin/contexts/{{context_id}}/fields', session: true })
export class AdminContextFieldEntity extends ContextFieldEntity {
  constructor(init?: Partial<AdminContextFieldEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  order: number = 0;

  @Column()
  updated_at: string = '';

  @Request(() => undefined, { nullable: true })
  stage_id: string = null;
}
