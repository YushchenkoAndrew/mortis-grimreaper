import { identicon } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { Column } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';
import { OrganizationEntity } from './organization.entity';

@Entity()
export class UserEntity extends IdEntity {
  constructor(init?: Partial<UserEntity>) {
    super();
    this.assign(init, this);
  }

  @Column((e) => new OrganizationEntity().build(e.organization ?? null))
  organization: OrganizationEntity = null;

  _avatar(): string {
    // if (this.thumbnail?.file) return this.thumbnail._url() + `?r=${prefix}`;
    return createAvatar(identicon, { seed: this.id }).toDataUriSync();
  }
}
