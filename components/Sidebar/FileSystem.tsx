import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SidebarElementProps } from './SidebarElement';

export default function FileSystem(props: SidebarElementProps) {
  function condition<T>(...options: T[]): T {
    if (!props.tree) return options[0];
    if (props.open) return options[1];
    return options[2];
  }

  return (
    <div className={`${props.className || ''} flex items-center w-full ml-1`}>
      <FontAwesomeIcon
        className={`pb-0.5 text-base mr-1.5 text-gray-500`}
        icon={condition(faFile, faFolderOpen, faFolder)}
      />
      <span className="text-gray-800">{props.value}</span>
    </div>
  );
}
