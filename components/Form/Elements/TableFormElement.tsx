import { ObjectLiteral } from '../../../types';

type IdEntity = { id: string; stringify?: (_: string) => string };

export interface TableFormElementProps<T extends ObjectLiteral & IdEntity> {
  className?: string;
  columns: { [name in keyof T]?: string };
  data: T[];
  first?: (value: string) => React.ReactNode;
}

export default function TableFormElement<T extends ObjectLiteral & IdEntity>(
  props: TableFormElementProps<T>,
) {
  return (
    <div
      className={`${
        props.className ?? ''
      } relative overflow-x-auto border rounded-md`}
    >
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-sm font-medium text-gray-800 bg-gray-100">
          <tr>
            {Object.values(props.columns).map((col, index) => (
              <th scope="col" key={index} className="px-6 py-3 last:text-right">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-blue-50">
              {Object.keys(props.columns).map((col, index) => {
                const value =
                  typeof row.stringify === 'function'
                    ? row.stringify(col)
                    : String(row[col]);

                return (
                  <td key={index} className="px-6 py-4 last:text-right">
                    {props.first && !index ? props.first(value) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
