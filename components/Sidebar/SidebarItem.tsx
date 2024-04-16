import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure } from '@headlessui/react';
import { ComponentType, Dispatch } from 'react';
import { IdEntity } from '../../lib/common/entities/id.entity';
import { TreeT } from '../../lib/common/types';
import { SidebarElementProps } from './SidebarElement';

export interface SidebarItemProps<T extends IdEntity> {
  path?: string[];
  tree: TreeT<T>;
  Element: ComponentType<SidebarElementProps>;
  onClick?: Dispatch<string[] | T>;
}

export default function SidebarItem<T extends IdEntity>({
  Element,
  ...props
}: SidebarItemProps<T>) {
  return (
    <>
      {Object.entries(props.tree)
        .sort(
          ([ka, a], [kb, b]) =>
            Number(a instanceof IdEntity) - Number(b instanceof IdEntity) ||
            (a instanceof IdEntity && b instanceof IdEntity
              ? a.name.localeCompare(b.name)
              : ka.localeCompare(kb)),
        )
        .map(([key, value], index) =>
          typeof value == 'object' && value instanceof IdEntity ? (
            <div
              className="p-2 w-full rounded cursor-pointer hover:bg-gray-300 focus:outline-none"
              onClick={() => props.onClick?.(value)}
            >
              <Element value={value.name} />
            </div>
          ) : (
            <Disclosure key={`${key}_${index}`}>
              {({ open }) => {
                const path = (props.path || []).concat(key);
                return (
                  <>
                    <div className="flex items-center w-full rounded hover:bg-gray-300 focus:outline-none">
                      <Disclosure.Button className="px-1.5 pt-1 pb-1.5 hover:rounded-l hover:bg-gray-400">
                        <FontAwesomeIcon
                          className="w-2.5 h-2.5"
                          icon={open ? faChevronDown : faChevronRight}
                        />
                      </Disclosure.Button>
                      <div
                        className="flex w-full cursor-pointer"
                        onClick={() => props.onClick?.(path)}
                      >
                        <Element tree open={open} value={key} />
                      </div>
                    </div>
                    <Disclosure.Panel className="ml-3 pl-2 border-l-2 border-gray-300">
                      <SidebarItem
                        tree={value}
                        Element={Element}
                        path={path}
                        onClick={props.onClick}
                      />
                    </Disclosure.Panel>
                  </>
                );
              }}
            </Disclosure>
          ),
        )}
    </>
  );
}
