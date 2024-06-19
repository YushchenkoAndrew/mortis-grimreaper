import { Dispatch } from 'react';
import { StringService } from '../../../../lib/common';
import { ErrorService } from '../../../../lib/common/error.service';
import { AdminProjectEntity } from '../../../../lib/project/entities/admin-project.entity';
import { ProjectStatusEnum } from '../../../../lib/project/types/project-status.enum';

export interface CustomProjectStatusPreviewProps {
  project: AdminProjectEntity;
  onChange?: Dispatch<AdminProjectEntity>;
}

export default function CustomProjectStatusPreview({
  project,
  ...props
}: CustomProjectStatusPreviewProps) {
  return (
    <span
      className={`text-xs font-normal leading-4 mx-2 px-1 rounded-xl border border-gray-400 text-gray-500 hover:bg-gray-200 cursor-pointer ${
        project.status == ProjectStatusEnum.inactive ? 'bg-gray-300' : ''
      }`}
      onClick={() =>
        ErrorService.envelop(
          async () => {
            await AdminProjectEntity.self.save.build(
              new AdminProjectEntity({
                id: project.id,
                status: project.invertStatus(),
              }),
            );

            const updated = await AdminProjectEntity.self.load.build(project.id); // prettier-ignore
            props.onChange?.(updated);
          },
          { in_progress: true },
        )
      }
    >
      {StringService.humanize(project.status)}
    </span>
  );
}
