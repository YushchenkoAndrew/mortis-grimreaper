import imageCompression from 'browser-image-compression';
import { DeepEntity, ObjectLiteral, TreeT } from '../common/types';
import { ProjectTypeEnum } from '../project/types/project-type.enum';
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

  static filter<T extends AttachmentEntity>(
    type: ProjectTypeEnum,
    attachments: DeepEntity<T>[],
  ): DeepEntity<T>[] {
    if (!attachments?.length) return [];

    switch (type) {
      case ProjectTypeEnum.p5js:
        return attachments.filter((e) => ['.js'].includes(e.type));

      case ProjectTypeEnum.emscripten:
        return attachments.filter((e) => ['.cpp', '.h'].includes(e.type));

      case ProjectTypeEnum.markdown:
        return attachments.filter((e) => ['.md'].includes(e.type));

      case ProjectTypeEnum.html:
        return attachments.filter((e) => ['.html'].includes(e.type));

      default:
        return [];
    }
  }

  static async thumbnail(file: File): Promise<File> {
    const jpeg = await imageCompression(file, {
      maxSizeMB: 1,
      initialQuality: 0.5,
      fileType: 'image/jpeg',
      useWebWorker: true,
    });

    return new File([jpeg], 'thumbnail.jpeg');
  }
}
