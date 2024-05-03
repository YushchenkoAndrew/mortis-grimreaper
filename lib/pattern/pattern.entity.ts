import { Column } from '../common/decorators/column';
import { Entity } from '../common/decorators/request-entity';
import { CommonEntity } from '../common/entities/common.entity';
import { PatternModeEnum } from './types/pattern-mode.enum';

@Entity({ route: 'patterns' })
export class PatternEntity extends CommonEntity {
  constructor(init?: Partial<PatternEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  id: string = '';

  @Column((e) => PatternModeEnum[e.mode] ?? PatternModeEnum.stroke)
  mode: PatternModeEnum = null;

  @Column()
  path: string = '';

  @Column()
  height: number = 0;

  @Column()
  width: number = 0;
}
