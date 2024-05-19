import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface NoDataProps {
  className?: string;
  title?: string;
  description?: string;

  setOptions?: Partial<{
    border: string;
  }>;
}

export default function NoData(props: NoDataProps) {
  return (
    <div className={`mx-auto ${props.className || ''}`}>
      <div
        className={`flex items-center text-center h-full ${
          props.setOptions?.border ?? 'border rounded-lg'
        }`}
      >
        <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
          <div className="p-3 mx-auto text-blue-500 bg-blue-100 rounded-full">
            <FontAwesomeIcon
              className="pt-1 px-0.5 w-6 h-5"
              icon={faMagnifyingGlass}
            />
          </div>
          <h1 className="mt-3 text-lg font-medium text-gray-800">
            {props.title ?? 'No data found'}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {props.description ??
              `No data matching your current filters was found. Please adjust your search criteria.`}
          </p>
        </div>
      </div>
    </div>
  );
}
