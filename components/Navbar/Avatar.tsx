import React from 'react';
import Link from 'next/link';

export interface AvatarProps {
  src: string;
  href: string;
  name: string;

  children?: React.ReactNode;
}

export default function Avatar(props: AvatarProps) {
  return (
    <Link
      className="flex items-center px-5 md:px-0"
      href={props.href}
      target="_blank"
    >
      <div className="flex-shrink-0">
        <img
          className="h-10 w-10 md:h-8 md:w-8 rounded-full"
          src={props.src}
          rel="preload"
          alt=""
        />
      </div>

      <div className="md:hidden ml-3">
        <div className="text-base font-medium leading-none text-white">
          {props.name}
        </div>
        {props.children}
      </div>
    </Link>
  );
}
