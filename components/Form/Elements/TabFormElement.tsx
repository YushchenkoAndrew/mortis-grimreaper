import { Tab } from '@headlessui/react';
import { ReactNode } from 'react';
import { IdEntity } from '../../../lib/common/entities/id.entity';
import { ObjectLiteral } from '../../../lib/common/types';

export type TabFormElementDataComponent<T extends ObjectLiteral> = {
  [key in keyof T]?: (value: T) => ReactNode;
};

export interface TabFormElementProps<T extends ObjectLiteral> {
  className?: string;
  // name: string;
  // value: keyof T & string;
  // onChange: Dispatch<keyof T & string>;
  // options: T;

  default?: keyof T;
  disabled?: (keyof T)[];
  columns: { [name in keyof T]?: string };
  headerComponent?: ReactNode;
  dataComponent: TabFormElementDataComponent<T>;
}

export default function TabFormElement<T extends ObjectLiteral>(
  props: TabFormElementProps<T>,
) {
  const index = Object.keys(props.columns).indexOf(
    (props.default as string) || '',
  );

  return (
    <div className={props.className}>
      <Tab.Group defaultIndex={props.default ? index : 0}>
        <div className="flex px-2 py-3 rounded-t border bg-gray-100 border-gray-200">
          <Tab.List className="flex rounded border bg-white border-gray-300">
            {Object.entries(props.columns).map(([key, val]) => (
              <Tab
                key={key}
                disabled={props.disabled.includes(key)}
                className={({ selected }) =>
                  `my-1 ml-1 last:mr-1 px-4 py-0.5 text-sm rounded hover:bg-gray-200 disabled:hover:bg-white focus:outline-none disabled:text-gray-500 ${
                    selected ? 'font-medium bg-gray-200' : ''
                  }`
                }
              >
                {val}
              </Tab>
            ))}
          </Tab.List>

          {props.headerComponent}
        </div>
        <Tab.Panels>
          {Object.keys(props.columns).map((key, index) => (
            <Tab.Panel key={index}>
              {props.dataComponent[key]?.(null)}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
