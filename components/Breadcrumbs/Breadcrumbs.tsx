import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { IdEntity } from '../../entities/common/id.entity';

export interface BreadcrumbsProps {
  path: (string | IdEntity)[];
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <ol
      className="flex items-center text-3xl whitespace-nowrap"
      aria-label="Breadcrumb"
    >
      {props.path.map((item, index) => {
        const count = props.path.length - index - 1;
        return (
          <li className="inline-flex items-center">
            <Link
              className="flex py-1 px-2 text-lg font-semibold tracking-tight text-gray-900 rounded-md hover:bg-gray-200"
              href={'../'.repeat(count)}
            >
              {item instanceof IdEntity ? item.name : item}
            </Link>

            {count ? (
              <FontAwesomeIcon
                icon={faAngleRight}
                className="flex-shrink-0 overflow-visible size-4 text-gray-600"
              />
            ) : (
              <></>
            )}
          </li>
        );
      })}
    </ol>
  );
}
