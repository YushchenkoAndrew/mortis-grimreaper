import {
  faDocker,
  faHtml5,
  faMarkdown,
} from '@fortawesome/free-brands-svg-icons';
import { faWindowMaximize } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProjectStepEnum } from '../../lib/project/types/project-step.enum';
import { ProjectTypeEnum } from '../../lib/project/types/project-type.enum';

export const PROJECT_FORM_STEPS = {
  [ProjectStepEnum.resources]: 'Resources',
  [ProjectStepEnum.links]: 'Links',
  [ProjectStepEnum.attachments]: 'Attachments',
  [ProjectStepEnum.review]: 'Review',
};

export const PROJECT_HANDLEBAR_SHORTCUTS = {
  // p5js: '.parent(document.getElementById(`p5js-container`))',
};

export const PROJECT_FILE_ACTIONS = {
  dir: 'Create Directory',
  create: 'Create File',
  upload: 'Upload File',
  delete: 'Delete File',
};

export const PROJECT_ACTIONS = {
  status: 'Change project visibility',
  delete: 'Delete this project',
};

export const PROJECTS_ACTIONS = {
  create: 'New Project',
  delete: 'Delete Projects',
};

export const PROJECT_TYPES_OPTIONS = {
  [ProjectTypeEnum.p5js]: (
    <>
      <FontAwesomeIcon
        className="text-2xl pr-2 text-red-500"
        icon={faStarOfLife}
      />
      p5js graphic
    </>
  ),
  [ProjectTypeEnum.emscripten]: (
    <>
      <FontAwesomeIcon
        className="text-2xl pl-2 text-lime-500 rotate-180"
        icon={faWindowMaximize}
      />
      Emscripten Project
    </>
  ),
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
