import { Column, Request } from '../decorators/column';
import { Entity } from '../decorators/request-entity';
import { CommonEntity } from './common.entity';

@Entity({ route: 'markdown', modify: false })
export class MarkdownEntity extends CommonEntity {
  constructor(init?: Partial<MarkdownEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  @Request({ nullable: true })
  text: string = '';
}
