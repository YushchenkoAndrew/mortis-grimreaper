import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { IdEntity } from '../../lib/common/entities/id.entity';
import { DeepEntity } from '../../lib/common/types';

export interface BreadcrumbsProps<T extends object> {
  className?: string;
  path: (string | DeepEntity<T>)[];
  icon?: IconProp;
}

export default function Breadcrumbs<T extends IdEntity>(
  props: BreadcrumbsProps<T>,
) {
  return (
    <ol
      className={`${
        props.className ?? ''
      } flex items-center text-3xl whitespace-nowrap`}
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
              {typeof item == 'object' ? item.name : item}
            </Link>

            {count ? (
              <FontAwesomeIcon
                icon={props.icon ?? faAngleRight}
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
