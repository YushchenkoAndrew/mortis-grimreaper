import { Dispatch, ReactNode } from 'react';
import { ObjectLiteral } from '../../../lib/common/types';

type IdEntity = { id: string };

export type TableFormElementDataComponent<T extends ObjectLiteral & IdEntity> =
  { [key in keyof T]?: (value: T) => React.ReactNode };

export interface TableFormElementProps<T extends ObjectLiteral & IdEntity> {
  className?: string;
  columns: { [name in keyof T]?: string };
  data: T[];
  onClick?: Dispatch<T>;

  noHeader?: boolean;
  bodyComponent?: (children: ReactNode, obj: T[]) => ReactNode;
  rowComponent?: (
    props: { className: string; children: ReactNode },
    obj: T,
  ) => ReactNode;
  dataComponent: TableFormElementDataComponent<T>;
  firstComponent?: (obj: T) => ReactNode;

  setOptions?: Partial<{ rowColor: string; dataPadding: string }>;
}

export default function TableFormElement<T extends ObjectLiteral & IdEntity>(
  props: TableFormElementProps<T>,
) {
  const td = (row: T) =>
    Object.keys(props.columns).map((col, index) => (
      // <td key={index} className="first:flex px-6 py-4 last:text-right">
      <td
        key={index}
        className={`first:flex ${
          props.setOptions?.dataPadding || 'px-6 py-4'
        } items-center last:text-right`}
      >
        {index ? <></> : props.firstComponent?.(row)}
        {props.dataComponent[col]?.(row)}
      </td>
    ));

  const tr = () => {
    const className = `border-b cursor-pointer ${
      props.setOptions?.rowColor || 'hover:bg-blue-50'
    }`;

    return props.data.map((row) =>
      props.rowComponent ? (
        props.rowComponent({ className, children: td(row) }, row)
      ) : (
        <tr
          key={row.id}
          className={className}
          onClick={() => props.onClick?.(row)}
        >
          {td(row)}
        </tr>
      ),
    );
  };
  return (
    <div className={`${props.className ?? ''} relative overflow-x-auto border`}>
      <table className="w-full text-sm text-left text-gray-500">
        <thead
          className={`${
            props.noHeader ? 'hidden' : ''
          } text-sm font-medium text-gray-800 bg-gray-100`}
        >
          <tr>
            {Object.values(props.columns).map((col, index) => (
              <th scope="col" key={index} className="px-6 py-3 last:text-right">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.bodyComponent ? props.bodyComponent(tr(), props.data) : tr()}
        </tbody>
      </table>
    </div>
  );
}
