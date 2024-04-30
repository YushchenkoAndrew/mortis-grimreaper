import { AttachmentEntity } from '../../../lib/attachment/entities/attachment.entity';

export interface ProjectContainer {
  className?: string;
  scripts: AttachmentEntity[];
  preview: AttachmentEntity[];
}
