import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import { Dispatch, ReactNode } from 'react';

export interface CardProps {
  className?: string;

  name: string;
  href: Url;
  img: string;

  header?: ReactNode;
  description?: string;
  children?: ReactNode;

  onClick?: Dispatch<void>;
}

export default function Card(props: CardProps) {
  return (
    <div
      className={`flex p-4 rounded border w-96 max-h-32 border-gray-400 justify-between ${
        props.className ?? ''
      }`}
      onClick={() => props.onClick?.()}
    >
      <div className="flex flex-col max-w-64 mr-2">
        <div className="flex items-center">
          <FontAwesomeIcon
            className="ml-0.5 mr-2 text-gray-500"
            icon={faBookmark}
          />
          <Link
            className="font-medium text-sky-600 hover:underline truncate"
            href={props.href}
          >
            {props.name}
          </Link>
          {props.header}
        </div>
        <span className="text-xs line-clamp-3 h-12 text-gray-600">
          {props.description}
        </span>
        {props.children}
      </div>
      <div className="flex w-full max-h-24 max-w-20 items-center justify-end">
        <img
          className="w-auto h-auto rounded"
          src={props.img}
          alt="Project img"
        />
      </div>
    </div>
  );
}
