import {
  faDocker,
  faHtml5,
  faMarkdown,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProjectStepEnum } from '../../entities/project/types/project-step.enum';
import { ProjectTypeEnum } from '../../entities/project/types/project-type.enum';

export const PROJECT_FORM_STEPS = {
  [ProjectStepEnum.resources]: 'Resources',
  [ProjectStepEnum.attachments]: 'Attachments',
  [ProjectStepEnum.links]: 'Links',
  [ProjectStepEnum.review]: 'Review',
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
