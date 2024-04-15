import { DeepEntity, TreeT } from '../common/types';
import { AttachmentEntity } from './entities/attachment.entity';

export class AttachmentService {
  static filepath<T extends AttachmentEntity>(entity: T): string[] {
    return entity.path.split('/').concat(entity.name).filter(Boolean);
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

  static toList<T extends AttachmentEntity>(
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
          Number(!!a.type) - Number(!!b.type) || a.name.localeCompare(b.name),
      );
  }

  static readme(
    attachments: DeepEntity<AttachmentEntity>[],
  ): DeepEntity<AttachmentEntity> | null {
    return (
      attachments.find(
        (e) => e.path === '/' && e.name.toLowerCase().includes('readme'),
      ) || null
    );
  }
}
