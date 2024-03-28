import { Column } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { CommonEntity } from '../common/common.entity';

@Entity({ route: 'palettes' })
export class PaletteEntity extends CommonEntity {
  constructor(init?: Partial<PaletteEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string;

  @Column()
  colors: string[];
}
