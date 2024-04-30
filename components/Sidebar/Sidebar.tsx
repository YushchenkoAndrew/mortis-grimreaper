import { ComponentType, Dispatch } from 'react';
import { IdEntity } from '../../lib/common/entities/id.entity';
import { TreeT } from '../../lib/common/types';
import { SidebarElementProps } from './SidebarElement';
import SidebarItem, { SidebarItemProps } from './SidebarItem';

export interface SidebarProps<T extends IdEntity> {
  data: TreeT<T>[];
  Element: ComponentType<SidebarElementProps>;
  onClick?: Dispatch<string[] | T>;
  sortBy?: SidebarItemProps<T>['sortBy'];
}

export default function Sidebar<T extends IdEntity>({
  Element,
  ...props
}: SidebarProps<T>) {
  return (
    <div className="flex flex-col w-72 h-[calc(100vh-4rem)]">
      <div className="flex-grow px-3 py-2 overflow-y-scroll bg-gray-100">
        {props.data.map((tree, index) => (
          <div
            key={index}
            className="pt-4 mt-4 space-y-2 border-t text-gray-800 text-left text-sm font-medium first:pt-2 first:mt-0 first:border-t-0 border-gray-200"
          >
            <SidebarItem
              tree={tree}
              Element={Element}
              sortBy={props.sortBy}
              onClick={props.onClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
