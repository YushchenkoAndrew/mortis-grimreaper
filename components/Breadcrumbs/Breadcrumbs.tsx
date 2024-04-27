import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { IdEntity } from '../../lib/common/entities/id.entity';
import { DeepEntity } from '../../lib/common/types';
import type { UrlObject } from 'url';
import { ReactNode } from 'react';

export interface BreadcrumbsProps {
  className?: string;
  href: { name: string; path: UrlObject | string }[];
  itemComponent?: (
    props: { name: string; path: UrlObject | string },
    index: number,
  ) => ReactNode;
  icon?: IconProp;
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <ol
      className={`${
        props.className ?? ''
      } flex items-center text-3xl whitespace-nowrap`}
      aria-label="Breadcrumb"
    >
      {props.href.map(({ path, name }, index) => (
        <li className="inline-flex items-center">
          <Link
            key={index}
            className="flex py-1 px-2 text-lg font-semibold tracking-tight text-gray-900 rounded-md hover:bg-gray-200"
            href={path}
          >
            {props.itemComponent
              ? props.itemComponent({ path, name }, index)
              : name}
          </Link>

          {props.href.length - index - 1 ? (
            <FontAwesomeIcon
              icon={props.icon ?? faAngleRight}
              className="flex-shrink-0 overflow-visible size-4 text-gray-600"
            />
          ) : (
            <></>
          )}
        </li>
      ))}
    </ol>
  );
}
