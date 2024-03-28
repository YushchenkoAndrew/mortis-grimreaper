import { Column } from '../../decorators/column';
import { Entity } from '../../decorators/request-entity';
import { CommonEntity } from '../common/common.entity';
import { PatternModeEnum } from './types/pattern-mode.enum';

@Entity({ route: 'patterns' })
export class PatternEntity extends CommonEntity {
  constructor(init?: Partial<PatternEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string;

  @Column((e) => PatternModeEnum[e.mode] ?? PatternModeEnum.stroke)
  mode: string;

  @Column()
  path: string;

  @Column()
  height: number;

  @Column()
  width: number;
}
