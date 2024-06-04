import { Column } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';
import { ContextFieldEntity } from './context-field.entity';

@Entity({ route: 'contexts', session: true })
export class ContextEntity extends IdEntity {
  constructor(init?: Partial<ContextEntity>) {
    super();
    this.assign(init, this);
  }

  @Column((e) => new ContextFieldEntity().buildAll(e.fields ?? {}))
  fields: ContextFieldEntity[] = [];

  outOf(): [number, number] {
    return [this.fields.filter((e) => e.evaluate()).length, this.fields.length];
  }
}
