import { DeepEntity, ObjectLiteral, TreeT } from '../common/types';
import { AdminAttachmentEntity } from './entities/admin-attachment.entity';
import { AttachmentEntity } from './entities/attachment.entity';

export class AttachmentService {
  static filepath<T extends AttachmentEntity>(entity: T): string[] {
    return entity.path.split('/').concat(entity.name).filter(Boolean);
  }

  static vars<T extends AttachmentEntity>(
    attachments: DeepEntity<T>[],
  ): ObjectLiteral<string> {
    return attachments.reduce((acc, curr) => {
      acc['id:/' + curr._filepath()] = curr.id;
      acc['file:/' + curr._filepath()] = curr._url();
      return acc;
    }, {});
  }

  static toTree<T extends AttachmentEntity>(
    attachments: DeepEntity<T>[],
  ): TreeT<T> {
    const tree: TreeT<T> = {};

    for (const attachment of attachments) {
      const path = attachment.path.split('/').filter(Boolean);
      const level = path.reduce((acc, k) => (acc[k] ||= {}), tree);
      level[attachment.name] = attachment;
    }

    return tree;
  }

  static toList<T extends AdminAttachmentEntity>(
    attachments: DeepEntity<T>[],
    root: string[] = [],
  ): T[] {
    const level = root.reduce((acc, k) => acc?.[k], this.toTree(attachments));
    if (!level || level instanceof AttachmentEntity) return [];

    return Object.keys(level)
      .map((k) =>
        level[k] instanceof AttachmentEntity
          ? (level[k] as T)
          : (new AttachmentEntity({
              path: '/' + root.join('/'),
              name: k,
            }) as T),
      )
      .sort(
        (a: T, b: T) =>
          Number(!!a.type) - Number(!!b.type) ||
          (a.order || 0) - (b.order || 0),
      );
  }

  static readme<T extends AttachmentEntity>(
    attachments: DeepEntity<T>[],
  ): DeepEntity<T> | null {
    return (
      attachments.find(
        (e) => e.path === '/' && e.name.toLowerCase().includes('readme'),
      ) || null
    );
  }

  static js<T extends AttachmentEntity>(attachments: DeepEntity<T>[]): T[] {
    if (!attachments) return [] as any;

    const scripts = attachments.filter((e) => e.type == '.js');
    return scripts.map((e) => new AttachmentEntity(e as any)) as any;
  }

  static cpp<T extends AttachmentEntity>(attachments: DeepEntity<T>[]): T[] {
    if (!attachments) return [] as any;

    const scripts = attachments.filter((e) => ['.cpp', '.h'].includes(e.type));
    return scripts.map((e) => new AttachmentEntity(e as any)) as any;
  }
}
