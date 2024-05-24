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
        className="text-2xl pl-2 text-lime-600 rotate-180"
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

export function ProjectCircle(props: { type: ProjectTypeEnum }) {
  const className = 'h-3 w-3 rounded-full mr-1';

  switch (props.type) {
    case ProjectTypeEnum.p5js:
      return <span className={`${className} bg-red-500`} />;

    case ProjectTypeEnum.emscripten:
      return <span className={`${className} bg-lime-600`} />;

    case ProjectTypeEnum.html:
      return <span className={`${className} bg-orange-400`} />;

    case ProjectTypeEnum.markdown:
      return <span className={`${className} bg-pink-400`} />;

    case ProjectTypeEnum.link:
      return <span className={`${className} bg-cyan-500`} />;

    case ProjectTypeEnum.k3s:
      return <span className={`${className} bg-blue-400`} />;

    default:
      return <span className={`${className} border border-gray-500`} />;
  }
}
