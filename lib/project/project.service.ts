import { AdminAttachmentEntity } from '../attachment/entities/admin-attachment.entity';
import { AttachmentEntity } from '../attachment/entities/attachment.entity';
import { AttachmentAttachableTypeEnum } from '../attachment/types/attachment-attachable-type.enum';
import { DeepEntity } from '../common/types';
import { RequestTypeEnum } from '../common/types/request-type.enum';

export class ProjectService {
  static async saveAttachments<
    T extends { id: string; attachments: DeepEntity<AttachmentEntity[]> },
  >(project: T, filepath: string, files: File[], by_name?: boolean) {
    for (const file of files) {
      const name = by_name ? file.name.split('.')[0] : file.name;
      const attachment = project.attachments.find(
        (e) =>
          (by_name ? e._without_ext() : e.name) == name && e.path == filepath,
      );

      await AdminAttachmentEntity.self.save.build(
        new AdminAttachmentEntity({
          id: attachment?.id,
          path: filepath,
          file: file as any,
          attachable_id: project.id,
          attachable_type: AttachmentAttachableTypeEnum.projects,
        }),
        { type: RequestTypeEnum.form },
      );

      // NOTE: Reload project attachments list
      // await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
    }
  }
}
