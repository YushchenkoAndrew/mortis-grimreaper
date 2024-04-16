import {
  faDocker,
  faHtml5,
  faMarkdown,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IdEntity } from '../../lib/common/entities/id.entity';
import { ProjectStepEnum } from '../../lib/project/types/project-step.enum';
import { ProjectTypeEnum } from '../../lib/project/types/project-type.enum';

export const PROJECT_FORM_STEPS = {
  [ProjectStepEnum.resources]: 'Resources',
  [ProjectStepEnum.links]: 'Links',
  [ProjectStepEnum.attachments]: 'Attachments',
  [ProjectStepEnum.review]: 'Review',
};

export const PROJECT_ACTIONS = [{ Links: new IdEntity({ name: 'Link' }) }];

export const PROJECT_FILE_ACTIONS = {
  create: 'Create File',
  upload: 'Upload File',
  delete: 'Delete File',
};

export const PROJECT_TYPES_OPTIONS = {
  [ProjectTypeEnum.html]: (
    <>
      <FontAwesomeIcon
        className="text-2xl pr-2 text-orange-500"
        icon={faHtml5}
      />
      HTML Page
    </>
  ),
  [ProjectTypeEnum.markdown]: (
    <>
      <FontAwesomeIcon
        className="text-2xl pr-2 text-gray-900"
        icon={faMarkdown}
      />
      Markdown Article
    </>
  ),
  [ProjectTypeEnum.link]: (
    <>
      <FontAwesomeIcon className="text-2xl pr-2 text-sky-600" icon={faGlobe} />
      Redirected Link
    </>
  ),
  [ProjectTypeEnum.k3s]: (
    <>
      <FontAwesomeIcon className="text-2xl pr-2 text-sky-600" icon={faDocker} />
      Docker
    </>
  ),
};
