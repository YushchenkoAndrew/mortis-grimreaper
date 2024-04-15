import { Column } from '../common/decorators/column';
import { Entity } from '../common/decorators/request-entity';
import { CommonEntity } from '../common/entities/common.entity';

@Entity({ route: 'palettes' })
export class PaletteEntity extends CommonEntity {
  constructor(init?: Partial<PaletteEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string = '';

  @Column()
  colors: string[] = [];
}
