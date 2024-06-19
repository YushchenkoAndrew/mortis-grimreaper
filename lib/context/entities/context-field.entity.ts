import { Column, Request } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';
import type { ContextFieldOptionType } from '../types/context-field-option.type';
import { ContextFieldValueEnum } from '../types/context-field-value.enum';

@Entity({ route: 'contexts/{{context_id}}/fields' })
export class ContextFieldEntity extends IdEntity {
  constructor(init?: Partial<ContextFieldEntity>) {
    super();
    this.assign(init, this);
  }

  @Column()
  @Request()
  value: string = null;

  @Column()
  @Request({ nullable: true })
  options: ContextFieldOptionType = null;

  evaluate(): boolean | number | null {
    if (!this.options) return null;
    switch (this.options?.type) {
      case ContextFieldValueEnum.boolean:
        if (this.value === 'true') return true;
        if (this.value === 'false') return false;
        return null;

      case ContextFieldValueEnum.number:
        if (isNaN(Number(this.value))) return null;
        return Number(this.value);
    }

    return null;
  }

  invert(): string {
    if (!this.options) return null;
    switch (this.options?.type) {
      case ContextFieldValueEnum.boolean:
        if (this.value === 'true') return 'false';
        if (this.value === 'false') return 'true';
        return null;

      // case ContextFieldValueEnum.number:
      // if (isNaN(Number(this.value))) return null;
      // return Number(this.value);
    }

    return null;
  }
}
