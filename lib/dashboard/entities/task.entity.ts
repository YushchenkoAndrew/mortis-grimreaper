import { z } from 'zod';
import { AttachmentEntity } from '../../attachment/entities/attachment.entity';
import { Column, Request, Validate } from '../../common/decorators/column';
import { Entity } from '../../common/decorators/request-entity';
import { IdEntity } from '../../common/entities/id.entity';
import { LinkEntity } from '../../link/entities/link.entity';
import { TagEntity } from '../../tag/entities/tag.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ route: 'stages' })
export class TaskEntity extends IdEntity {
  constructor(init?: Partial<TaskEntity>) {
    super();
    this.assign(init, this);
  }

  @Request({ nullable: true })
  @Column()
  @Validate(() => z.string())
  description: string = '';

  @Column((e) => new UserEntity().build(e.owner ?? []))
  owner: UserEntity = null;

  @Column((e) => new AttachmentEntity().buildAll(e.attachments ?? []))
  attachments: AttachmentEntity[] = [];

  @Column((e) => new LinkEntity().buildAll(e.links ?? {}))
  links: LinkEntity[] = [];

  @Column((e) => new TagEntity().buildAll(e.tags ?? {}))
  tags: TagEntity[] = [];

  // "contexts": [
  //   {
  //     "fields": [
  //       {
  //         "id": "a3c94c88-944d-4636-86d1-c233bdfaf70e",
  //         "name": "root",
  //         "options": {
  //           "additionalProp1": {}
  //         },
  //         "value": "root"
  //       }
  //     ],
  //     "id": "a3c94c88-944d-4636-86d1-c233bdfaf70e",
  //     "name": "root"
  //   }
  // ],
}
