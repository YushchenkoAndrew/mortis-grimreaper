import Link from 'next/link';
import { BehaviorProps } from './Behavior';
import type { UrlObject } from 'url';
import { useMemo, useRef } from 'react';
import styles from './Thumbnail.module.scss';
import { NumberService } from '../../lib/common';
import LineFormPreview from '../Form/Previews/LineFormPreview';
import Image from 'next/image';
import moment from 'moment';

export interface ThumbnailProps {
  img: string;
  name: string;
  description?: string;

  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  curtain?: true;

  barcode?: boolean;
  Behavior?: React.ComponentType<BehaviorProps>;
  setOptions?: Partial<{ imgSize: string }>;
}

export default function Thumbnail({ Behavior, ...props }: ThumbnailProps) {
  const divRef = useRef<HTMLDivElement>();
  const curtain = useMemo(() => {
    const seed = props.name + props.name.length;
    const index = Math.ceil(NumberService.mantissa(NumberService.seed(seed) * 1000000)); // prettier-ignore
    return ['curtain-t', 'curtain-b', 'curtain-r', 'curtain-l'][index % 4];
  }, [props.name]);

  return (
    <div
      ref={divRef}
      className={`group relative w-full max-w-full sm:max-w-sm overflow-hidden ${
        styles['thumbnail']
      } ${props.setOptions?.imgSize || 'aspect-1'}`}
    >
      <a
        className="block relative"
        href={props.href}
        target={props.target || '_self'}
      >
        {/* <span className="absolute top-0 left-0 w-full h-full bg-gray-500 transition duration-300 ease-in-out " /> */}
        {/* <span className="absolute block top-0 left-0 w-full h-full bg-white" /> */}

        <span className={`absolute bg-gray-700 ${styles[curtain]}`} />

        <img
          className={`relative block top-0 left-0 mix-blend-multiply object-cover aspect-1 ${''} `}
          src={props.img}
          alt={`Thumbnail: ${props.name || ''}`}
        />
        <div
          className={`absolute invisible group-hover:visible z-20 flex flex-col p-4 h-full w-full text-white ${styles[curtain]}`}
        >
          <span className="my-auto text-3xl font-medium text-center">
            {props.name}
          </span>

          <span className="block mt-auto w-full text-center">
            {props.description}
          </span>
        </div>

        {props.barcode && (
          <LineFormPreview
            className="absolute left-0 bottom-0 px-2 w-full bg-black "
            text={(props.name + ' ').replace(/ /g, '_')}
            scale={3.2}
            setOptions={{
              fontFamily: 'text-Barcode',
              textColor: 'text-white group-hover:text-gray-500',
            }}
          />
        )}
      </a>
    </div>
  );
}
